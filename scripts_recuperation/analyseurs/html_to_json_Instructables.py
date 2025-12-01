import os
import json
from bs4 import BeautifulSoup
import re

# =========================
#  FONCTIONS UTILITAIRES
# =========================

def clean_text(s):
    if not s:
        return ""
    return " ".join(s.split()).strip()


# =========================
#  INTRO / SUPPLIES / ÉTAPES
# =========================

def find_intro_h2(soup):
    """Retourne le h2 d'introduction (ex: 'Introduction: ...') si présent."""
    for h2 in soup.find_all("h2"):
        txt = clean_text(h2.get_text())
        if txt.lower().startswith("introduction"):
            return h2
    return None


def extract_intro_instructables(soup):
    """
    Introduction = contenu après le h2 'Introduction' et avant
    le premier h2 'Supplies' ou 'Step ...'.
    On va chercher les <p> et les listes n'importe où dans les blocs frères.
    """
    sections = []
    intro_h2 = find_intro_h2(soup)
    if not intro_h2:
        return sections

    sib = intro_h2.next_sibling

    while sib:
        name = getattr(sib, "name", None)

        # Arrêt à la prochaine section majeure
        if name == "h2":
            h2_txt = clean_text(sib.get_text())
            if "supplies" in h2_txt.lower() or re.match(r"step\s+\d+", h2_txt, re.IGNORECASE):
                break

        # On cherche du texte dans tous les descendants
        if hasattr(sib, "find_all"):
            # Paragraphes
            for p in sib.find_all("p"):
                txt = clean_text(p.get_text())
                if txt:
                    sections.append({"titre": txt, "sous_items": []})

            # Listes
            for ul in sib.find_all(["ul", "ol"]):
                items = [clean_text(li.get_text()) for li in ul.find_all("li")]
                items = [i for i in items if i]
                if items:
                    sections.append({"titre": "", "sous_items": items})

        sib = sib.next_sibling

    return sections


def extract_supplies_as_materiaux(soup):
    """
    Instructables -> section 'Supplies' mappée vers 'matériaux'.
    On récupère tous les <li> et <p> de la zone, même s'ils sont dans des <div>.
    """
    materiaux = []
    outils = []

    supplies_h2 = None
    for h2 in soup.find_all("h2"):
        txt = clean_text(h2.get_text())
        if "supplies" in txt.lower():
            supplies_h2 = h2
            break

    if not supplies_h2:
        return materiaux, outils

    sib = supplies_h2.next_sibling
    items = []

    while sib:
        name = getattr(sib, "name", None)
        if name == "h2":  # fin de la zone Supplies
            break

        if hasattr(sib, "find_all"):
            # Listes d’items
            for ul in sib.find_all(["ul", "ol"]):
                for li in ul.find_all("li"):
                    t = clean_text(li.get_text())
                    if t:
                        items.append(t)
            # Phrases isolées
            for p in sib.find_all("p"):
                t = clean_text(p.get_text())
                if t:
                    items.append(t)

        sib = sib.next_sibling

    if items:
        materiaux.append({"titre": "Supplies", "sous_items": items})

    return materiaux, outils


def extract_etapes_instructables(soup):
    """
    Étapes = tous les h2 'Step X: ...'.
    On prend tout le contenu entre deux Step successifs, en allant chercher
    les <p> et les listes dans TOUS les descendants.
    """
    etapes = []

    step_headers = []
    for h2 in soup.find_all("h2"):
        title_text = clean_text(h2.get_text())
        m = re.match(r"Step\s*(\d+)\s*:?\s*(.*)", title_text, re.IGNORECASE)
        if m:
            step_headers.append((h2, int(m.group(1)), title_text))

    for idx, (h2, numero, titre) in enumerate(step_headers):
        # Trouver la prochaine h2 de type Step pour borner le contenu
        next_step_h2 = step_headers[idx + 1][0] if idx + 1 < len(step_headers) else None

        content_nodes = []
        sib = h2.next_sibling
        while sib and sib is not next_step_h2:
            content_nodes.append(sib)
            sib = sib.next_sibling

        etapes_list = []
        remarques = []
        images = []

        # Texte + listes
        for node in content_nodes:
            if not hasattr(node, "find_all"):
                continue

            # Paragraphes
            for p in node.find_all("p"):
                txt = clean_text(p.get_text())
                # On évite des paragraphes vides ou purement "Attachments", etc.
                if txt and txt.lower() not in ("attachments",):
                    etapes_list.append({"titre": txt, "sous_etapes": []})

            # Listes
            for ul in node.find_all(["ul", "ol"]):
                items = [clean_text(li.get_text()) for li in ul.find_all("li")]
                items = [i for i in items if i]
                if items:
                    etapes_list.append({"titre": "", "sous_etapes": items})

        # Images (comme avant)
        for node in content_nodes:
            if hasattr(node, "find_all"):
                for img in node.find_all("img"):
                    url = img.get("src")
                    if not url:
                        continue
                    images.append({
                        "url": url,
                        "alt": clean_text(img.get("alt") or ""),
                        "description": ""
                    })

        solution = {
            "objectif": "",
            "materiaux_outils": [],
            "etapes": etapes_list,
            "remarques": remarques,
            "fichiers": [{
                "nom": "",
                "type": "",
                "description": "",
                "lien": ""
            }],
            "images": images
        }

        etapes.append({
            "numero": numero,
            "titre": titre,
            "solutions": [solution]
        })

    return etapes


def extract_main_image_instructables(soup):
    """
    Image principale :
    - on évite les 'pixel.png'
    - on prend la première image de contenu raisonnable (idéalement après l'intro).
    """

    def is_valid_src(src):
        if not src:
            return False
        return "pixel.png" not in src

    intro_h2 = find_intro_h2(soup)

    # D'abord: chercher après le h2 Introduction
    if intro_h2:
        sib = intro_h2.next_sibling
        while sib:
            name = getattr(sib, "name", None)
            if name == "h2":  # prochaine section
                break
            if hasattr(sib, "find_all"):
                for img in sib.find_all("img"):
                    src = img.get("src")
                    if is_valid_src(src):
                        return [{
                            "url": src,
                            "alt": clean_text(img.get("alt") or ""),
                            "description": ""
                        }]
            sib = sib.next_sibling

    # Sinon: première image non-pixel sur la page
    for img in soup.find_all("img"):
        src = img.get("src")
        if is_valid_src(src):
            return [{
                "url": src,
                "alt": clean_text(img.get("alt") or ""),
                "description": ""
            }]

    return []


# =========================
#   CONVERT HTML → JSON (Instructables)
# =========================

def html_to_makerlens_json_instructables(html: str, page_url: str, slug: str):
    soup = BeautifulSoup(html, "html.parser")

    # Titre : premier h1 ou fallback = slug
    h1 = soup.find("h1")
    titre_page = clean_text(h1.get_text()) if h1 else slug

    images = extract_main_image_instructables(soup)

    # Pas de difficulté/durée/coût standardisés → on laisse vide
    difficulte = None
    duree = None
    cout = None

    intro = extract_intro_instructables(soup)
    materiaux, outils = extract_supplies_as_materiaux(soup)
    etapes = extract_etapes_instructables(soup)

    return {
        slug: {
            "titre": [titre_page],
            "image": images,
            "difficulté": [difficulte] if difficulte else [],
            "durée": [duree] if duree else [],
            "coût": [cout] if cout else [],
            "liens": [page_url],
            "introduction": intro,
            "mentions légales": [],
            "matériaux": materiaux,
            "outils": outils,
            "étapes": etapes,
            "annexes": []
        }
    }


# =========================
#   BATCH INSTRUCTABLES
# =========================

def batch_convert_instructables():
    here = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(here)

    pages_dir = os.path.join(project_root, "pages", "instructables")
    output_dir = os.path.join(project_root, "json", "instructables")
    os.makedirs(output_dir, exist_ok=True)

    base_url = "https://www.instructables.com/"

    for filename in os.listdir(pages_dir):
        if not filename.lower().endswith(".html"):
            continue

        html_path = os.path.join(pages_dir, filename)
        base_name = os.path.splitext(filename)[0]
        slug = base_name

        page_url = base_url + base_name + "/"
        out_path = os.path.join(output_dir, base_name + ".json")

        #if os.path.exists(out_path):
        #    print(f"⏩ JSON déjà présent, on saute : {out_path}")
        #    continue

        #print(f"🔧 Traitement de : {html_path}")

        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()

        data = html_to_makerlens_json_instructables(html, page_url, slug)

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"✅ JSON généré : {out_path}")

    print("🎉 Batch Instructables terminé.")


# =========================
#     MAIN
# =========================

if __name__ == "__main__":
    batch_convert_instructables()
