#!/usr/bin/env python3
"""
Script de scraping Instructables optimisé utilisant la sitemap.
Basé sur le fichier amélioré de l'utilisateur.
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time
import os
import re

# Configuration
BASE = "https://www.instructables.com"
START = "https://www.instructables.com/sitemap/projects/living/life-hacks/"
OUTPUT_DIR = "pages"
LINKS_FILE = f"{OUTPUT_DIR}/links_instructables.txt"
HTML_DIR = f"{OUTPUT_DIR}/instructables"

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

def create_directories():
    """Crée les dossiers nécessaires s'ils n'existent pas."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(HTML_DIR, exist_ok=True)

def safe_filename(title):
    """Convertit un titre en nom de fichier sûr."""
    safe = re.sub(r'[<>:"/\\|?*]', '-', title)
    safe = re.sub(r'\s+', '-', safe)
    safe = re.sub(r'-+', '-', safe)
    safe = safe.strip('-')
    return safe[:200]

def clean_and_fix_html(html_content):
    """Nettoie le HTML et corrige les URLs."""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Supprimer les scripts de pub
    for script in soup.find_all('script'):
        script_text = script.get_text() if script.string else ""
        if any(word in script_text.lower() for word in ['cookie', 'advertisement', 'ads', 'tracking']):
            script.decompose()
    
    # Supprimer les divs de pub
    for div in soup.find_all('div', {'class': re.compile(r'(ad|advertisement|banner)', re.I)}):
        div.decompose()
    
    # Corriger les URLs relatives
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and isinstance(src, str) and src.startswith('/'):
            img['src'] = urljoin(BASE, src)
    
    for link in soup.find_all('a', href=True):
        href = link.get('href')
        if href and isinstance(href, str) and href.startswith('/'):
            link['href'] = urljoin(BASE, href)
    
    return str(soup)

def optimize_images(html_content):
    """Optimise les images pour un chargement rapide."""
    soup = BeautifulSoup(html_content, 'html.parser')
    images_processed = 0
    
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and isinstance(src, str) and 'content.instructables.com' in src:
            # Ajouter paramètres de redimensionnement
            if '?' not in src:
                img['src'] = f"{src}?auto=webp&fit=bounds&width=600&height=450&quality=75"
            else:
                img['src'] = f"{src}&auto=webp&fit=bounds&width=600&height=450&quality=75"
            
            # Rendre l'image cliquable si pas déjà dans un lien
            if not img.parent or img.parent.name != 'a':
                new_link = soup.new_tag('a')
                base_src = src.split('?')[0] if '?' in src else src
                new_link['href'] = f"{base_src}?auto=webp&fit=bounds&width=1200&height=900&quality=85"
                new_link['target'] = '_blank'
                new_link['rel'] = 'noopener noreferrer'
                img.wrap(new_link)
            
            images_processed += 1
    
    return str(soup), images_processed

def fix_noscript_images(html_content):
    """Extrait les images des balises noscript."""
    soup = BeautifulSoup(html_content, 'html.parser')
    images_moved = 0
    
    steps = soup.find_all('section', class_='step')
    for step in steps:
        mediaset = step.find('div', class_='mediaset')
        noscript = step.find('noscript')
        
        if mediaset and noscript:
            photoset = noscript.find('div', class_='no-js-photoset')
            if photoset:
                photoset_clone = photoset.__copy__()
                photoset_clone['class'] = 'photoset'
                mediaset.append(photoset_clone)
                images_moved += len(photoset.find_all('img'))
    
    return str(soup), images_moved

def get_project_links():
    """Récupère tous les liens de projets depuis la sitemap."""
    print("🔍 RÉCUPÉRATION DES LIENS VIA SITEMAP")
    print("-" * 45)
    
    seen = set()
    links = []
    next_url = START
    page_num = 1
    
    while next_url:
        print(f"📄 Page sitemap {page_num}...")
        
        try:
            r = requests.get(next_url, headers=UA, timeout=20)
            r.raise_for_status()
            soup = BeautifulSoup(r.text, "html.parser")

            # Récupère tous les liens de projets
            page_links = 0
            for a in soup.select("a[href]"):
                href = a.get("href")
                if not href:
                    continue
                abs_href = urljoin(BASE, href)
                
                # Garde uniquement des pages projet
                if (abs_href.startswith(BASE) and 
                    "/sitemap/" not in abs_href and 
                    "#" not in abs_href and 
                    "autodesk.com" not in abs_href and 
                    abs_href not in seen):
                    seen.add(abs_href)
                    links.append(abs_href)
                    page_links += 1

            print(f"   ✅ {page_links} nouveaux projets trouvés")

            # Suivre la pagination "Next"
            nxt = soup.find("a", string=lambda t: t and t.strip().lower() == "next")
            next_url = urljoin(BASE, nxt["href"]) if nxt and nxt.has_attr("href") else None
            
            page_num += 1
            time.sleep(1)  # Pause pour le serveur
            
        except Exception as e:
            print(f"❌ Erreur page {page_num}: {e}")
            break

    return links

def download_project_page(url):
    """Télécharge et traite une page de projet."""
    try:
        # Extraire le nom du projet
        project_name = url.split('/')[-2] if url.endswith('/') else url.split('/')[-1]
        filename = f"{safe_filename(project_name)}.html"
        filepath = os.path.join(HTML_DIR, filename)
        
        # Vérifier si existe déjà
        if os.path.exists(filepath):
            print(f"⚡ {filename} existe déjà, ignoré")
            return filename, 0, 0
        
        # Télécharger
        r = requests.get(url, headers=UA, timeout=20)
        r.raise_for_status()
        
        # Traiter le HTML
        cleaned_html = clean_and_fix_html(r.text)
        optimized_html, images_opt = optimize_images(cleaned_html)
        final_html, images_moved = fix_noscript_images(optimized_html)
        
        # Sauvegarder
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(final_html)
        
        total_images = images_opt + images_moved
        print(f"✅ {filename} ({total_images} images traitées)")
        return filename, 1, total_images
        
    except Exception as e:
        print(f"❌ Erreur {url}: {e}")
        return None, 0, 0

def main():
    """Fonction principale."""
    print("🔍 SCRAPER INSTRUCTABLES - SITEMAP METHOD")
    print("=" * 55)
    
    create_directories()
    
    # Étape 1: Récupérer les liens
    project_links = get_project_links()
    
    print(f"\n📊 {len(project_links)} projets trouvés au total")
    
    # Sauvegarder les liens
    with open(LINKS_FILE, 'w', encoding='utf-8') as f:
        for i, link in enumerate(project_links, 1):
            f.write(f"{i}: {link}\n")
    
    print(f"💾 Liens sauvegardés dans {LINKS_FILE}")
    
    # Étape 2: Télécharger les pages
    print(f"\n📥 TÉLÉCHARGEMENT DES PAGES HTML")
    print("-" * 40)
    
    total_downloaded = 0
    total_images = 0
    
    for i, url in enumerate(project_links, 1):
        result = download_project_page(url)
        if result[0]:
            total_downloaded += result[1]
            total_images += result[2]
        
        # Pause pour ne pas surcharger le serveur
        if i % 10 == 0:
            print(f"📦 {i}/{len(project_links)} pages traitées...")
            time.sleep(2)
        else:
            time.sleep(0.5)
    
    print(f"\n🎉 SCRAPING TERMINÉ!")
    print("=" * 50)
    print(f"📁 Projets téléchargés: {total_downloaded}")
    print(f"🖼️  Images traitées: {total_images}")
    print(f"📂 Fichiers dans: {HTML_DIR}")
    print(f"🔗 Liens dans: {LINKS_FILE}")

if __name__ == "__main__":
    main()