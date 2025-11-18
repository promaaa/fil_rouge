#!/usr/bin/env python3
"""
Script pour redimensionner les images dans les fichiers HTML Instructables
en ajoutant des paramètres de taille aux URLs.
"""

import os
import re
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

def resize_image_url(url, width=800, height=600, quality=80):
    """
    Modifie une URL d'image Instructables pour ajouter des paramètres de redimensionnement.
    """
    if 'content.instructables.com' not in url:
        return url
    
    # Parser l'URL
    parsed = urlparse(url)
    query_params = parse_qs(parsed.query)
    
    # Ajouter/modifier les paramètres de redimensionnement
    query_params['auto'] = ['webp']  # Format optimisé
    query_params['fit'] = ['bounds']  # Respecter les proportions
    query_params['width'] = [str(width)]
    query_params['height'] = [str(height)]
    
    # Ajouter qualité si c'est un JPEG
    if url.lower().endswith('.jpg') or url.lower().endswith('.jpeg'):
        query_params['quality'] = [str(quality)]
    
    # Reconstruire l'URL
    new_query = urlencode(query_params, doseq=True)
    new_parsed = parsed._replace(query=new_query)
    
    return urlunparse(new_parsed)

def resize_images_in_html(html_content, width=800, height=600, quality=80):
    """
    Redimensionne toutes les images dans le contenu HTML.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    images_resized = 0
    
    # Trouver toutes les images
    img_tags = soup.find_all('img')
    
    for img in img_tags:
        src = img.get('src')
        if src and 'content.instructables.com' in src:
            new_src = resize_image_url(src, width, height, quality)
            if new_src != src:
                img['src'] = new_src
                images_resized += 1
    
    # Également traiter les liens vers les images
    link_tags = soup.find_all('a', href=True)
    
    for link in link_tags:
        href = link.get('href')
        if href and 'content.instructables.com' in href and any(href.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif']):
            new_href = resize_image_url(href, width*2, height*2, quality)  # Liens vers version plus grande
            if new_href != href:
                link['href'] = new_href
                images_resized += 1
    
    return str(soup), images_resized

def process_file(file_path, width=800, height=600, quality=80):
    """Traite un fichier HTML individual."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, images_resized = resize_images_in_html(content, width, height, quality)
        
        if images_resized > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ {os.path.basename(file_path)}: {images_resized} images redimensionnées")
            return True, images_resized
        else:
            print(f"⚠️  {os.path.basename(file_path)}: Aucune image à redimensionner")
            return False, 0
            
    except Exception as e:
        print(f"❌ Erreur avec {os.path.basename(file_path)}: {e}")
        return False, 0

def main():
    """Fonction principale."""
    pages_dir = "pages_html/instructables"

    if not os.path.exists(pages_dir):
        print(f"❌ Dossier {pages_dir} introuvable!")
        return
    
    # Options de redimensionnement
    print("🖼️  REDIMENSIONNEMENT DES IMAGES INSTRUCTABLES")
    print("=" * 60)
    print("Options disponibles :")
    print("1. Petites images (600x450px)")
    print("2. Images moyennes (800x600px) [recommandé]")
    print("3. Images grandes (1200x900px)")
    print("4. Personnalisé")
    
    choice = input("\nChoisissez une option (1-4) [default: 2]: ").strip()
    
    if choice == "1":
        width, height, quality = 600, 450, 75
        size_name = "petites"
    elif choice == "3":
        width, height, quality = 1200, 900, 85
        size_name = "grandes"
    elif choice == "4":
        try:
            width = int(input("Largeur (px): "))
            height = int(input("Hauteur (px): "))
            quality = int(input("Qualité (1-100): "))
            size_name = "personnalisées"
        except ValueError:
            print("❌ Valeurs invalides, utilisation des paramètres par défaut")
            width, height, quality = 800, 600, 80
            size_name = "moyennes"
    else:  # Default ou choice == "2"
        width, height, quality = 800, 600, 80
        size_name = "moyennes"
    
    print(f"\n🔧 Configuration: images {size_name} ({width}x{height}px, qualité {quality}%)")
    
    html_files = [f for f in os.listdir(pages_dir) if f.endswith('.html')]
    
    if not html_files:
        print(f"❌ Aucun fichier HTML trouvé dans {pages_dir}")
        return
    
    print(f"\n🔍 Traitement de {len(html_files)} fichiers HTML...")
    print()
    
    total_processed = 0
    total_images = 0
    
    for html_file in html_files:
        file_path = os.path.join(pages_dir, html_file)
        processed, images = process_file(file_path, width, height, quality)
        
        if processed:
            total_processed += 1
            total_images += images
    
    print()
    print("📊 RÉSUMÉ")
    print("=" * 50)
    print(f"Fichiers traités avec succès: {total_processed}/{len(html_files)}")
    print(f"Total d'images redimensionnées: {total_images}")
    print(f"Taille configurée: {width}x{height}px (qualité {quality}%)")
    
    if total_processed > 0:
        print("\n✅ Les images ont été redimensionnées avec succès!")
        print("💡 Les images devraient maintenant se charger plus rapidement.")
        print("🔗 Les URLs incluent maintenant des paramètres de redimensionnement automatique.")

if __name__ == "__main__":
    main()