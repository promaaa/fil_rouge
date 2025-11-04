import requests
import os
from urllib.parse import urljoin, unquote, urlsplit, urlunsplit
from bs4 import BeautifulSoup

# ------------------ CONFIG ------------------
OUTPUT_DIR = "pages"      # HTML local
IMAGES_ROOT = "images"    # images locales
BASE = "https://wiki.lowtechlab.org/wiki/"
LIST_URL = "https://wiki.lowtechlab.org/wiki/Group:Low-tech_Lab#Tutoriels"

# Contrôle des images
ALLOWED_EXT = (".jpg", ".jpeg", ".png", ".gif", ".webp")  # ajoute ".svg" si tu veux les SVG
MAX_IMG_PER_PAGE = 20  # limite d'images téléchargées par page

# ------------------ 1) récup liens ------------------
response = requests.get(LIST_URL)
response.encoding = response.apparent_encoding

if response.status_code == 200:
    print("Requête réussie")
else:
    print("Erreur lors de la requête:", response.status_code)

numero = 0
soup = BeautifulSoup(response.text, "html.parser")

with open("low_tech_lab_tuto_liens.txt", "w", encoding="utf-8") as f:
    div_cards = soup.find_all("div", class_="project-card")
    for div in div_cards:
        lien = div.find("a", href=True)
        if lien:
            numero += 1
            f.write(f"{numero}: {lien['href']}\n")

print("Nombre de liens trouvés :", numero)

# ------------------ 2) dossiers ------------------
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(IMAGES_ROOT, exist_ok=True)

def safe_name(s: str) -> str:
    return "".join(c if c.isalnum() or c in ("-", "_", ".") else "_" for c in s)

# ------------------ 3) pages + images ------------------
with open("low_tech_lab_tuto_liens.txt", "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue

        if ":" in line:
            _, path = line.split(":", 1)
            path = path.strip()
        else:
            path = line

        if not path.startswith("/wiki/"):
            print("Ignoré (non-wiki):", line)
            continue

        page_url = urljoin(BASE, path)
        print(f"\nTéléchargement : {page_url}")

        try:
            r = requests.get(page_url, timeout=25)
            if r.status_code != 200:
                print("  -> Erreur HTTP", r.status_code)
                continue

            page_key_raw = unquote(path.rsplit("/", 1)[-1]) or "index"
            page_key = safe_name(page_key_raw)

            soup = BeautifulSoup(r.text, "html.parser")

            page_img_dir = os.path.join(IMAGES_ROOT, page_key)
            os.makedirs(page_img_dir, exist_ok=True)

            # --------- PATCH anti-doublons / limite / normalisation ---------
            imgs = soup.find_all("img")
            seen = set()
            count = 0

            for img in imgs:
                if count >= MAX_IMG_PER_PAGE:
                    break

                # srcset > data-src > src
                raw = (img.get("srcset") or "").strip()
                if raw:
                    src = raw.split(",")[0].strip().split(" ")[0]
                else:
                    src = (img.get("data-src") or img.get("src") or "").strip()

                if not src:
                    continue

                # URL absolue
                img_url = urljoin(BASE, str(src))

                # normaliser: enlever query/fragment (meilleure déduplication)
                parts = list(urlsplit(img_url))
                parts[3] = ""  # query
                parts[4] = ""  # fragment
                norm_url = urlunsplit(parts)

                # filtrer extensions
                name_guess = unquote(norm_url.rsplit("/", 1)[-1]) or "image"
                lower_name = name_guess.lower()
                if not lower_name.endswith(ALLOWED_EXT):
                    continue

                # dédoublonner
                if norm_url in seen:
                    continue
                seen.add(norm_url)

                img_name = safe_name(name_guess)
                img_path = os.path.join(page_img_dir, img_name)

                # skip si déjà téléchargée
                if os.path.exists(img_path) and os.path.getsize(img_path) > 0:
                    rel_src = os.path.relpath(img_path, start=OUTPUT_DIR).replace("\\", "/")
                    img["src"] = rel_src
                    count += 1
                    continue

                # téléchargement
                try:
                    ir = requests.get(norm_url, timeout=20)
                    if ir.status_code == 200:
                        with open(img_path, "wb") as fout:
                            fout.write(ir.content)
                        rel_src = os.path.relpath(img_path, start=OUTPUT_DIR).replace("\\", "/")
                        img["src"] = rel_src
                        print("📸", img_name)
                        count += 1
                    else:
                        print(f"  (image HTTP {ir.status_code}) {norm_url}")
                except Exception as e:
                    print(f"  ⚠️ Erreur image : {norm_url} -> {e}")
            # ----------------------------------------------------------------

            out_path = os.path.join(OUTPUT_DIR, f"{page_key}.html")
            with open(out_path, "w", encoding="utf-8") as out:
                out.write(str(soup))
            print(f"  ✅ Page enregistrée : {out_path}")

        except Exception as e:
            print("  -> Échec:", e)

print("\nTéléchargement terminé !")
