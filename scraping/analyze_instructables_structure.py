#!/usr/bin/env python3
"""
Script d'analyse de la structure HTML des pages Instructables
pour comprendre l'organisation des images.
"""

import os
import re
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from collections import defaultdict

def analyze_instructables_images(file_path):
    """
    Analyse la structure des images dans un fichier HTML Instructables.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Erreur lecture {file_path}: {e}")
        return None
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # Statistiques générales
    img_tags = soup.find_all('img')
    total_images = len(img_tags)
    
    # Analyser les URLs des images
    url_domains = defaultdict(int)
    for img in img_tags:
        src = img.get('src', '')
        if src:
            domain = urlparse(src).netloc
            if domain:
                url_domains[domain] += 1
    
    # Analyser la structure par steps
    steps = soup.find_all('section', class_='step')
    step_info = []
    
    for i, step in enumerate(steps):
        step_id = step.get('id', f'step_{i}')
        step_title = 'Unknown'
        
        title_tag = step.find('h2', class_='step-title')
        if title_tag:
            step_title = title_tag.get_text().strip()
        
        # Compter les images dans ce step
        step_images = step.find_all('img')
        noscript_images = step.find_all('noscript')
        
        step_info.append({
            'id': step_id,
            'title': step_title,
            'images': len(step_images),
            'noscript_count': len(noscript_images)
        })
    
    # Analyser les URLs d'images de contenu
    content_urls = []
    for img in img_tags:
        src = img.get('src', '')
        if 'content.instructables.com' in src:
            content_urls.append(src)
    
    # Analyser les attributs des images
    img_attributes = defaultdict(int)
    for img in img_tags:
        for attr in img.attrs:
            img_attributes[attr] += 1
    
    # Analyser la structure HTML autour des images
    image_contexts = []
    for img in img_tags[:5]:  # Analyser les 5 premières images
        context = {
            'tag': img.name,
            'parent': img.parent.name if img.parent else None,
            'alt': img.get('alt', ''),
            'loading': img.get('loading', ''),
            'src': img.get('src', '')[:100] + '...' if len(img.get('src', '')) > 100 else img.get('src', '')
        }
        
        # Si le parent est un lien, récupérer l'URL
        if img.parent and img.parent.name == 'a':
            context['link_href'] = img.parent.get('href', '')[:100] + '...' if len(img.parent.get('href', '')) > 100 else img.parent.get('href', '')
        
        image_contexts.append(context)
    
    # Analyser les mediasets et galeries
    mediasets = soup.find_all('div', class_='mediaset')
    photosets = soup.find_all('div', class_=re.compile(r'photoset'))
    
    photoset_info = []
    for photoset in photosets:
        images_in_photoset = photoset.find_all('img')
        links_in_photoset = photoset.find_all('a')
        photoset_info.append({
            'images': len(images_in_photoset),
            'links': len(links_in_photoset)
        })
    
    return {
        'filename': os.path.basename(file_path),
        'total_images': total_images,
        'url_domains': dict(url_domains),
        'steps': step_info,
        'content_urls': content_urls,
        'img_attributes': dict(img_attributes),
        'image_contexts': image_contexts,
        'mediasets_count': len(mediasets),
        'photosets_count': len(photosets),
        'photoset_info': photoset_info
    }

def compare_with_another_file(file1_path, file2_path, file3_path=None):
    """
    Compare la structure de plusieurs fichiers Instructables.
    """
    files = [file1_path, file2_path]
    if file3_path:
        files.append(file3_path)
    
    results = []
    for file_path in files:
        if os.path.exists(file_path):
            result = analyze_instructables_images(file_path)
            if result:
                results.append(result)
    
    return results

def main():
    """Fonction principale d'analyse."""
    pages_dir = "pages/instructables"
    
    if not os.path.exists(pages_dir):
        print(f"❌ Dossier {pages_dir} introuvable!")
        return
    
    html_files = [f for f in os.listdir(pages_dir) if f.endswith('.html')]
    
    if not html_files:
        print(f"❌ Aucun fichier HTML trouvé dans {pages_dir}")
        return
    
    # Analyser le premier fichier en détail
    first_file = os.path.join(pages_dir, html_files[0])
    result = analyze_instructables_images(first_file)
    
    if not result:
        print("❌ Impossible d'analyser le fichier")
        return
    
    print(f"🔍 ANALYSE DE LA STRUCTURE DES IMAGES INSTRUCTABLES")
    print("=" * 60)
    
    print(f"\n📋 1. STRUCTURE GÉNÉRALE")
    print("-" * 30)
    print(f"Nombre total d'images: {result['total_images']}")
    
    print(f"\n🔗 2. TYPES D'URLS D'IMAGES")
    print("-" * 30)
    for domain, count in result['url_domains'].items():
        print(f"  {domain}: {count} images")
    
    print(f"\n📦 3. CONTENEURS D'IMAGES")
    print("-" * 30)
    print(f"Nombre de steps: {len(result['steps'])}")
    for step in result['steps']:
        print(f"  {step['id']}: '{step['title']}' - {step['images']} images")
        if step['noscript_count'] > 0:
            print(f"    └─ Dans noscript: {step['noscript_count']} images")
    
    print(f"\n🖼️ 4. ANALYSE DES URLS D'IMAGES DE CONTENU")
    print("-" * 30)
    if result['content_urls']:
        example_url = result['content_urls'][0]
        print(f"Exemple d'URL: {example_url}")
        # Décomposer l'URL
        parts = example_url.split('/')
        print("Structure de l'URL:")
        for i, part in enumerate(parts):
            print(f"  {i}: {part}")
    
    print(f"\n🏷️ 5. ATTRIBUTS DES IMAGES")
    print("-" * 30)
    print("Attributs trouvés:")
    for attr, count in result['img_attributes'].items():
        print(f"  {attr}: {count} fois")
    
    print(f"\n🏗️ 6. STRUCTURE HTML AUTOUR DES IMAGES")
    print("-" * 30)
    for i, context in enumerate(result['image_contexts'], 1):
        print(f"\nImage {i}:")
        print(f"  Tag: {context['tag']}")
        print(f"  Parent: {context['parent']}")
        if 'link_href' in context:
            print(f"  Lien vers: {context['link_href']}")
        print(f"  Alt: {context['alt']}")
        print(f"  Loading: {context['loading']}")
    
    print(f"\n📺 7. MEDIASETS ET GALERIES")
    print("-" * 30)
    print(f"Mediasets vides: {result['mediasets_count']}")
    print(f"No-js-photosets: {result['photosets_count']}")
    if result['photoset_info']:
        print("Structure des photosets:")
        for i, info in enumerate(result['photoset_info'], 1):
            print(f"  Photoset {i}: {info['images']} images, {info['links']} liens")
    
    # Comparer avec d'autres fichiers
    if len(html_files) > 1:
        print(f"\n🔄 COMPARAISON AVEC UN AUTRE FICHIER")
        print("=" * 60)
        
        # Analyser 2-3 autres fichiers pour comparaison
        comparison_files = html_files[1:4]  # Prendre les 3 suivants
        
        for comp_file in comparison_files:
            comp_path = os.path.join(pages_dir, comp_file)
            comp_result = analyze_instructables_images(comp_path)
            
            if comp_result:
                print(f"\n📄 Analyse de: {comp_file}")
                print("-" * 40)
                print(f"  Images totales: {comp_result['total_images']}")
                content_images = len([url for url in comp_result['content_urls'] if 'content.instructables.com' in url])
                print(f"  Images de contenu: {content_images}")
                print(f"  Steps: {len(comp_result['steps'])}")
                if comp_result['content_urls']:
                    example = comp_result['content_urls'][0][:80] + '...'
                    print(f"  URL exemple: {example}")

if __name__ == "__main__":
    main()