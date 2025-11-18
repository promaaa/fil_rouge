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

def extract_item_detail(soup, label):
    for c in soup.select(".tuto-items-details-container"):
        left = c.select_one(".tuto-items-details-container-left")
        right = c.select_one(".tuto-items-details-container-right")
        if not left or not right:
            continue
        if label.lower() in left.get_text(strip=True).lower():
            return clean_text(right.get_text(" ", strip=True))
    return None

def extract_intro(soup):
    intro_div = soup.select_one("div.wf-intro")
    if not intro_div:
        return []
    sections = []

    for elem in intro_div.children:
        if elem.name == "p":
            txt = clean_text(elem.get_text())
            if txt:
                sections.append({"titre": txt, "sous_items": []})

        elif elem.name == "ul":
            items = [clean_text(li.get_text()) for li in elem.find_all("li")]
            items = [i for i in items if i]
            if items:
                if sections:
                    sections[-1]["sous_items"].extend(items)
                else:
                    sections.append({"titre": "", "sous_items": items})
    return sections

def extract_materiaux_outils(soup):
    materiaux = []
    outils = []

    # --- Matériaux ---
    mat_anchor = soup.find(id="Matériaux")
    if mat_anchor:
        mat_h = mat_anchor.find_parent(["h2", "h3"]) or mat_anchor
        sib = mat_h.next_sibling
        while sib:
            name = getattr(sib, "name", None)
            if name in ("h2", "h3"):
                break
            if name == "p":
                txt = clean_text(sib.get_text())
                if txt and txt != "Matériaux":
                    materiaux.append({"titre": txt, "sous_items": []})
            sib = sib.next_sibling

    # --- Outils ---
    out_anchor = soup.find(id="Outils")
    if out_anchor:
        out_h = out_anchor.find_parent(["h2", "h3"]) or out_anchor
        sib = out_h.next_sibling
        current_group = None

        while sib:
            name = getattr(sib, "name", None)
            if name in ("h2", "h3"):
                break

            if name == "b":
                titre = clean_text(sib.get_text())
                if titre:
                    current_group = {"titre": titre, "sous_items": []}
                    outils.append(current_group)

            elif name == "p":
                txt = clean_text(sib.get_text())
                if not txt:
                    pass
                else:
                    b = sib.find("b")
                    if b and clean_text(b.get_text()) == txt:
                        current_group = {"titre": txt, "sous_items": []}
                        outils.append(current_group)
                    else:
                        if current_group is None:
                            current_group = {"titre": "", "sous_items": []}
                            outils.append(current_group)
                        current_group["sous_items"].append(txt)

            sib = sib.next_sibling

    return materiaux, outils


def extract_step_images(step_index, soup):
    carousel_id = f"myCarousel{step_index}"
    car = soup.find(id=carousel_id)
    images = []
    if not car:
        return images

    for img in car.select("img"):
        url = img.get("src")
        if not url:
            continue
        images.append({
            "url": url,
            "alt": clean_text(img.get("alt", "")),
            "description": ""
        })
    return images



def extract_etapes(soup):
    etapes = []

    # Les étapes sont dans des <span id="Étape_..."> à l'intérieur de <h2>
    for anchor in soup.find_all("span", id=re.compile(r"^Étape_")):
        titre = clean_text(anchor.get_text())
        if not titre:
            continue

        h2 = anchor.find_parent("h2")
        if not h2:
            continue

        m = re.search(r"Étape\s*(\d+)", titre)
        numero = int(m.group(1)) if m else len(etapes) + 1

        content_nodes = []
        sib = h2.next_sibling
        while sib:
            if getattr(sib, "name", None) == "h2":
                break
            content_nodes.append(sib)
            sib = sib.next_sibling

        etapes_list = []
        remarques = []

        for node in content_nodes:
            name = getattr(node, "name", None)
            if name == "p":
                txt = clean_text(node.get_text())
                if txt:
                    etapes_list.append({"titre": txt, "sous_etapes": []})
            elif name in ("ul", "ol"):
                items = [clean_text(li.get_text()) for li in node.find_all("li")]
                items = [i for i in items if i]
                if items:
                    etapes_list.append({"titre": "", "sous_etapes": items})

        images = []
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



# =========================
#   CONVERT HTML → JSON
# =========================

def html_to_makerlens_json(html: str, page_url: str, slug: str):
    soup = BeautifulSoup(html, "html.parser")

    h1 = soup.find("h1", id="firstHeading")
    titre_page = clean_text(h1.get_text()) if h1 else slug

    main_img = soup.select_one(".tuto-main-image img")
    images = []
    if main_img:
        images.append({
            "url": main_img.get("src"),
            "alt": clean_text(main_img.get("alt")),
            "description": clean_text(
                soup.select_one(".tuto-details-about-title").get_text()
                if soup.select_one(".tuto-details-about-title") else ""
            )
        })

    difficulte = extract_item_detail(soup, "Difficulté")
    duree = extract_item_detail(soup, "Durée")
    cout = extract_item_detail(soup, "Coût")

    intro = extract_intro(soup)
    materiaux, outils = extract_materiaux_outils(soup)
    etapes = extract_etapes(soup)

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
#   BATCH LOWTECHLAB
# =========================

def batch_convert_lowtechlab():
    # dossier du fichier actuel (parsers/)
    here = os.path.dirname(os.path.abspath(__file__))

    # racine du projet (../)
    project_root = os.path.dirname(here)

    # dossiers HTML et JSON
    pages_dir = os.path.join(project_root, "pages_html", "lowtechlab")
    output_dir = os.path.join(project_root, "json", "lowtechlab")
    os.makedirs(output_dir, exist_ok=True)

    base_url = "https://wiki.lowtechlab.org/wiki/"

    # lister tous les fichiers HTML
    for filename in os.listdir(pages_dir):
        if not filename.lower().endswith(".html"):
            continue

        html_path = os.path.join(pages_dir, filename)
        # exemple: "Vélo_générateur_d_électricité.html" -> "Vélo_générateur_d_électricité"
        base_name = os.path.splitext(filename)[0]

        # clé du JSON : version "humaine" (underscore -> espace)
        slug = base_name.replace("_", " ")

        # URL d'origine probable
        page_url = base_url + base_name

        # fichier de sortie JSON (on garde le même base_name)
        out_path = os.path.join(output_dir, base_name + ".json")

        if os.path.exists(out_path):
            print(f"⏩ JSON déjà présent, on saute : {out_path}")
            continue

        print(f"🔧 Traitement de : {html_path}")

        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()

        data = html_to_makerlens_json(html, page_url, slug)

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"✅ JSON généré : {out_path}")

    print("🎉 Batch Low-tech Lab terminé.")


# =========================
#     MAIN
# =========================

if __name__ == "__main__":
    batch_convert_lowtechlab()
