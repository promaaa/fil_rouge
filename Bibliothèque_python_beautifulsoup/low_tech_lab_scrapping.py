import os
import time
import requests
from urllib.parse import urljoin, unquote, urlsplit, urlunsplit
from bs4 import BeautifulSoup

# ------------------ CONFIG ------------------
OUTPUT_DIR = "pages"
BASE = "https://wiki.lowtechlab.org/wiki/"
LIST_URL = "https://wiki.lowtechlab.org/wiki/Group:Low-tech_Lab#Tutoriels"

# HTTP session avec user-agent
SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "MakerLensScraper/1.0 (+https://github.com/divinebanon1-art/Scraping_part)"
})

# ------------------ UTILS ------------------
def get_html(url: str, tries: int = 3, pause: float = 1.5) -> str | None:
    for i in range(tries):
        try:
            r = SESSION.get(url, timeout=25)
            r.encoding = r.apparent_encoding
            if r.status_code == 200:
                return r.text
            print(f"[try {i+1}/{tries}] HTTP {r.status_code} sur {url}")
        except Exception as e:
            print(f"[try {i+1}/{tries}] ERR {e}")
        time.sleep(pause)
    return None

def safe_name(s: str) -> str:
    return "".join(c if c.isalnum() or c in ("-", "_", ".") else "_" for c in s)

# ------------------ 1) Récupération des liens ------------------
html = get_html(LIST_URL)
if not html:
    print("Erreur lors de la requête de la page liste.")
soup = BeautifulSoup(html or "", "html.parser")

links = []
div_cards = soup.find_all("div", class_="project-card")
for div in div_cards:
    a = div.find("a", href=True)
    if a and a["href"].startswith("/wiki/"):
        links.append(a["href"])


# Dédoublonnage
seen = set()
unique_links = []
for u in links:
    if u not in seen:
        seen.add(u)
        unique_links.append(u)

os.makedirs(OUTPUT_DIR, exist_ok=True)
with open("low_tech_lab_tuto_liens.txt", "w", encoding="utf-8") as f:
    for i, u in enumerate(unique_links, 1):
        f.write(f"{i}: {u}\n")

print("Nombre de liens trouvés :", len(unique_links))

# ------------------ 2) Récupération des pages ------------------
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
            print("Ignoré:", line)
            continue

        page_url = urljoin(BASE, path)
        print(f"\nTéléchargement : {page_url}")

        page_html = get_html(page_url)
        if not page_html:
            print("  -> Erreur : impossible de charger la page")
            continue

        page_key_raw = unquote(path.rsplit("/", 1)[-1]) or "index"
        page_key = safe_name(page_key_raw)

        soup_page = BeautifulSoup(page_html, "html.parser")

        # -------- Images cliquables SANS doublons --------
        imgs = soup_page.find_all("img")
        seen_imgs = set()

        for img in imgs:
            raw = (img.get("srcset") or "").strip()
            if raw:
                src = raw.split(",")[0].strip().split(" ")[0]
            else:
                src = (img.get("data-src") or img.get("src") or "").strip()

            if not src:
                continue

            img_url = urljoin(BASE, str(src))

            parts = list(urlsplit(img_url))
            parts[3] = ""  # retirer query
            parts[4] = ""  # retirer fragment
            norm_url = urlunsplit(parts)

            if norm_url in seen_imgs:
                if img.parent and img.parent.name == "a" and len(img.parent.contents) == 1:
                    img.parent.decompose()
                else:
                    img.decompose()
                continue

            seen_imgs.add(norm_url)

            img["src"] = norm_url

            parent = img.parent
            if parent and parent.name == "a" and parent.get("href"):
                parent["href"] = norm_url
            else:
                a = soup_page.new_tag("a", href=norm_url, target="_blank", rel="noopener noreferrer")
                img.replace_with(a)
                a.append(img)
        # -------------------------------------------------

        out_path = os.path.join(OUTPUT_DIR, f"{page_key}.html")
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(str(soup_page))
        print(f"  ✅ Page enregistrée : {out_path}")

print("\n✅ Traitement terminé sans doublons d'images")
