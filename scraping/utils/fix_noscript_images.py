#!/usr/bin/env python3
"""
Script pour extraire les images des balises noscript et les mettre dans les mediasets
pour qu'elles s'affichent correctement dans le navigateur.
"""

import os
import re
from bs4 import BeautifulSoup

def fix_noscript_images(html_content):
    """
    Extrait les images des balises noscript et les place dans les mediasets.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Trouver toutes les sections step
    steps = soup.find_all('section', class_='step')
    images_moved = 0
    
    for step in steps:
        # Trouver la div mediaset vide
        mediaset = step.find('div', class_='mediaset')
        # Trouver la div noscript avec les images
        noscript = step.find('noscript')
        
        if mediaset and noscript:
            # Trouver la div no-js-photoset dans noscript
            photoset = noscript.find('div', class_='no-js-photoset')
            
            if photoset:
                # Cloner le contenu du photoset vers le mediaset
                photoset_clone = photoset.__copy__()
                photoset_clone['class'] = ['photoset']  # Changer la classe
                
                # Ajouter le contenu cloné au mediaset
                mediaset.append(photoset_clone)
                images_moved += len(photoset.find_all('img'))
    
    return str(soup), images_moved

def process_file(file_path):
    """Traite un fichier HTML individual."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, images_moved = fix_noscript_images(content)
        
        if images_moved > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ {os.path.basename(file_path)}: {images_moved} images déplacées")
            return True, images_moved
        else:
            print(f"⚠️  {os.path.basename(file_path)}: Aucune image à déplacer")
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
    
    html_files = [f for f in os.listdir(pages_dir) if f.endswith('.html')]
    
    if not html_files:
        print(f"❌ Aucun fichier HTML trouvé dans {pages_dir}")
        return
    
    print(f"🔍 Traitement de {len(html_files)} fichiers HTML...")
    print()
    
    total_processed = 0
    total_images = 0
    
    for html_file in html_files:
        file_path = os.path.join(pages_dir, html_file)
        processed, images = process_file(file_path)
        
        if processed:
            total_processed += 1
            total_images += images
    
    print()
    print("📊 RÉSUMÉ")
    print("=" * 50)
    print(f"Fichiers traités avec succès: {total_processed}/{len(html_files)}")
    print(f"Total d'images déplacées: {total_images}")
    
    if total_processed > 0:
        print("\n✅ Les images devraient maintenant être visibles dans les fichiers HTML!")
        print("💡 Ouvrez un fichier HTML dans votre navigateur pour vérifier.")

if __name__ == "__main__":
    main()