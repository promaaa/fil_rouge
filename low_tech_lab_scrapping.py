import requests
import os
from urllib.parse import urljoin, unquote
from bs4 import BeautifulSoup

OUTPUT_DIR = "pages"
BASE = 'https://wiki.lowtechlab.org/wiki/'
url = 'https://wiki.lowtechlab.org/wiki/Group:Low-tech_Lab#Tutoriels'

response = requests.get(url)
response.encoding = response.apparent_encoding


if response.status_code == 200:
    print('Requête réussie')
    
else:
     print('Erreur lors de la requête:', response.status_code)

numero = 0   
soup = BeautifulSoup(response.text, 'html.parser')
with open('low_tech_lab_tuto_liens.txt', 'w') as f:
        div_cards = soup.find_all('div', class_='project-card')
        for div in div_cards:
            lien = div.find('a', href=True)
            if lien:
                numero += 1
                f.write(f"{numero}: {lien['href']}\n")  # ✅ conversion explicite en str
f.close()
print('Nombre de liens trouvés:', numero)

# Dossier où seront enregistrées les pages
os.makedirs("pages", exist_ok=True)

# Lecture du fichier contenant les liens
with open("low_tech_lab_tuto_liens.txt", "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue

        # Accepte soit "N: /wiki/..." soit directement "/wiki/..."
        if ":" in line:
            _, path = line.split(":", 1)
            path = path.strip()
        else:
            path = line


        url = urljoin(BASE, path)
        print("Téléchargement:", url)

        try:
            r = requests.get(url, timeout=20)
            if r.status_code == 200:
                # Nom de fichier basé sur le dernier segment décodé
                last_seg = unquote(path.rsplit("/", 1)[-1]) or "index"
                # Nom de fichier sûr (sans caractères problématiques)
                safe_name = "".join(c if c.isalnum() or c in ("-", "_") else "_" for c in last_seg)
                out_path = os.path.join(OUTPUT_DIR, f"{safe_name}.html")
                n = 0
                with open(out_path, "w", encoding="utf-8") as out:
                    out.write(r.text)
                    n += 1
                print("tuto", n, "-> OK :", out_path)
            else:
                print("  -> Erreur HTTP", r.status_code)
        except Exception as e:
            print("  -> Échec:", e)


        

print('fin')
