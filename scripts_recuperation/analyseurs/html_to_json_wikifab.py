import os
import json
from bs4 import BeautifulSoup
import re

# =========================
#  FONCTIONS UTILITAIRES
# =========================

def clean_text(s):
    """Nettoie le texte : retire les espaces inutiles et les lignes vides"""
    if not s:
        return ""
    return " ".join(s.split()).strip()

def extract_item_detail(soup, label):
    """Extrait les détails d'un élément donné (par exemple : Difficulté, Durée, Coût)"""
    for c in soup.select(".tuto-items-details-container"):
        left = c.select_one(".tuto-items-details-container-left")
        right = c.select_one(".tuto-items-details-container-right")
        if not left or not right:
            continue
        if label.lower() in left.get_text(strip=True).lower():
            text = clean_text(right.get_text(" ", strip=True))
            # Nettoyer les doublons anglais/français (ex: "Medium Moyen" -> "Moyen")
            if text and " " in text:
                parts = text.split()
                if len(parts) == 2:
                    first, second = parts
                    # Mapping des valeurs anglaises courantes vers français
                    if first.lower() in ("easy", "medium", "hard", "difficult", "very"):
                        return second
                    if first.lower() == "very" and len(parts) > 2:
                        return " ".join(parts[2:]) if len(parts) > 2 else parts[-1]
            return text
    return None

def extract_intro(soup):
    """Extrait l'introduction de la page (sous forme de titres et de sous-items)"""
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
    """Extrait les matériaux et outils nécessaires"""
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
            elif name in ("ul", "ol"):
                items = [clean_text(li.get_text()) for li in sib.find_all("li")]
                items = [i for i in items if i]
                if items:
                    if materiaux:
                        materiaux[-1]["sous_items"].extend(items)
                    else:
                        materiaux.append({"titre": "", "sous_items": items})
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

            elif name in ("ul", "ol"):
                items = [clean_text(li.get_text()) for li in sib.find_all("li")]
                items = [i for i in items if i]
                if items:
                    if current_group is None:
                        current_group = {"titre": "", "sous_items": []}
                        outils.append(current_group)
                    current_group["sous_items"].extend(items)

            sib = sib.next_sibling

    return materiaux, outils

def extract_step_images(step_index, soup):
    """Extrait les images des étapes sous forme de carrousels ou d'images individuelles"""
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
    """Extrait les étapes détaillées (y compris les images et les sous-étapes)"""
    etapes = []

    # Cherche les étapes dans les span avec un id "Étape_..."
    for anchor in soup.find_all("span", id=re.compile(r"^Étape_")):
        titre = clean_text(anchor.get_text())
        if not titre:
            continue

        h2 = anchor.find_parent("h2")
        if not h2:
            continue

        # Numéro d'étape : "Étape 3 - ..." -> 3
        m = re.search(r"Étape\s*(\d+)", titre)
        numero = int(m.group(1)) if m else len(etapes) + 1

        etapes_list = []
        remarques = []
        images = []

        # On parcourt tout ce qui suit h2 jusqu'à un autre h2
        for node in h2.next_elements:
            # On s'arrête au prochain h2
            if getattr(node, "name", None) == "h2" and node is not h2:
                break

            if not hasattr(node, "name"):
                continue

            # Texte des étapes : paragraphes
            if node.name == "p":
                txt = clean_text(node.get_text())
                if txt:
                    etapes_list.append({"titre": txt, "sous_etapes": []})

            # Listes ordonnées ou non ordonnées -> sous-étapes
            elif node.name in ("ul", "ol"):
                items = [clean_text(li.get_text()) for li in node.find_all("li")]
                items = [i for i in items if i]
                if items:
                    etapes_list.append({"titre": "", "sous_etapes": items})

            # IMAGES (y compris dans .tuto-step-image)
            elif node.name == "img":
                url = node.get("src")
                if not url:
                    continue
                alt = clean_text(node.get("alt") or "")
                images.append({
                    "url": url,
                    "alt": alt,
                    "description": ""
                })

        # Si aucune étape textuelle et aucune image, on ignore cette étape
        if not etapes_list and not images:
            continue

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
    """Convertit le fichier HTML en un format JSON structuré."""
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
#   FONCTIONS UTILITAIRES
# =========================

def batch_convert(source_name, pages_dir=None, output_dir=None):
    """Convertit les fichiers HTML en JSON pour Lowtechlab ou Wikifab."""
    # dossier du fichier actuel (analyseurs/)
    here = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(here)
    
    # Chemins par défaut si non spécifiés
    if pages_dir is None:
        pages_dir = os.path.join(project_root, "pages_brutes", source_name)
    if output_dir is None:
        output_dir = os.path.join(project_root, "donnees_brutes", source_name)
    
    os.makedirs(output_dir, exist_ok=True)

    base_url = "https://wiki.lowtechlab.org/wiki/" if source_name == "lowtechlab" else "https://wikifab.org/wiki/"

    # Parcours des fichiers HTML dans le répertoire spécifié
    for filename in os.listdir(pages_dir):
        if not filename.lower().endswith(".html"):
            continue

        html_path = os.path.join(pages_dir, filename)
        base_name = os.path.splitext(filename)[0]
        slug = base_name.replace("_", " ")

        page_url = base_url + base_name
        out_path = os.path.join(output_dir, base_name + ".json")

        print(f"🔧 Traitement de : {html_path}")

        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()

        data = html_to_makerlens_json(html, page_url, slug)

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"✅ JSON généré : {out_path}")

    print(f"🎉 Batch {source_name} terminé.")

# =========================
#     MAIN
# =========================

if __name__ == "__main__":
    # Traitement des fichiers Lowtechlab
    print("🔍 Traitement des fichiers Lowtechlab...")
    batch_convert("lowtechlab")

    # Traitement des fichiers Wikifab
    print("🔍 Traitement des fichiers Wikifab...")
    batch_convert("wikifab")

    print("✅ Traitement terminé.")
