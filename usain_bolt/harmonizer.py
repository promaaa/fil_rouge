import json
import os
from jinja2 import Environment, FileSystemLoader
"""
# Optionnel : pour créer le PDF 
try:
    from weasyprint import HTML
    PDF_ENABLED = True
except (ImportError, OSError) as e:
    PDF_ENABLED = False
    print(" WeasyPrint non disponible — génération PDF désactivée.")
"""
# permet de trouver le chemin de template sur nimporte quelle machine
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")


def unique_preserve_order(L):  # permet que chaque étape soit unique et dans l'ordre gràce à l'ensemble seen
    seen = set()
    result = []
    for x in L:
        if x not in seen:
            seen.add(x)
            result.append(x)
    return result


# Classe principale 
class TutorialHarmonizer:
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

    def format_hierarchical_list(self, items):
        """Formate une liste d'items avec structure titre/sous_items en HTML"""
        if not items:
            return []
        
        formatted = []
        for item in items:
            if isinstance(item, dict):
                titre = item.get('titre', '').strip()
                sous_items = item.get('sous_items', [])
                
                if sous_items:
                    # Item avec sous-items
                    html = f"{titre}"
                    html += "<ul>"
                    for sub in sous_items:
                        if sub.strip():
                            html += f"<li>{sub.strip()}</li>"
                    html += "</ul>"
                    formatted.append(html)
                else:
                    # Item simple
                    if titre:
                        formatted.append(titre)
            elif isinstance(item, str) and item.strip():
                formatted.append(item.strip())
        
        return formatted

    def harmonize(self, data: dict):
        # On prend la première clé du dictionnaire (vélo, marmite, etc.)
        project_data = list(data.values())[2]
        
        # Normalisation
        titre = project_data.get("titre", ["Projet maker"])[0].strip()
        difficulte = project_data.get("difficulté", [""])[0].strip()
        duree = project_data.get("durée", [""])[0].strip()
        cout = project_data.get("coût", [""])[0].strip()
        image = project_data.get("image", [{}])[0]
        main_image_url = image.get("url", "").strip()
        main_image_caption = image.get("description", "").strip()
        # récupérer la clé du projet (ex: 'vélo') pour heuristiques
        project_key = list(data.keys())[0] if isinstance(data, dict) and data else ""
        
        # Introduction avec structure hiérarchique
        intro_items = project_data.get("introduction", [])
        intro_formatted = self.format_hierarchical_list(intro_items)
        # keep a fallback single-line intro for older templates, but also provide
        # the list of intro items to the template so each can render as a paragraph
        intro = " ".join(intro_formatted) if intro_formatted else f"Ce tutoriel explique comment {titre.lower()}."
        
        # Matériaux et outils avec structure hiérarchique
        materiaux_raw = project_data.get("matériaux", [])
        materiaux = unique_preserve_order(self.format_hierarchical_list(materiaux_raw))
        
        outils_raw = project_data.get("outils", [])
        outils = unique_preserve_order(self.format_hierarchical_list(outils_raw))
        
        # Les étapes avec la nouvelle structure "solutions"
        etapes = []
        for e in project_data.get("étapes", []):
            if isinstance(e, dict):
                titre_etape = e.get('titre', '').strip()
                solutions = e.get("solutions", [])
                
                if solutions:
                    # Traiter chaque solution
                    for sol in solutions:
                        # include step number if present (e.g. "1. Titre")
                        num = e.get('numero', None)
                        num_str = f"{num}. " if (num is not None and str(num).strip() != "") else ""
                        formatted = f"<strong>{num_str}{titre_etape}</strong>"
                        
                        # Images (ajoutées juste après le titre)
                        images = sol.get("images", [])
                        if images:
                            # ajouter une classe count-N pour faciliter le rendu côté template
                            try:
                                count = len(images)
                            except Exception:
                                count = 0
                            formatted += f"<div class='step-images count-{count}'>"
                            for img in images:
                                url = img.get("url", "")
                                alt = img.get("alt", "")
                                description = img.get("description", "")
                                if url:
                                    formatted += f"<figure>"
                                    # add lazy loading to thumbnails to improve performance
                                    formatted += f"<img src='{url}' alt='{alt}' loading='lazy'>"
                                    if description:
                                        formatted += f"<figcaption>{description}</figcaption>"
                                    formatted += f"</figure>"
                            formatted += "</div>"
                        
                        # Objectif
                        objectif = sol.get("objectif", "").strip()
                        if objectif:
                            formatted += f"<p><em>{objectif}</em></p>"
                        
                        # Matériaux et outils
                        materiaux_outils = sol.get("materiaux_outils", [])
                        if materiaux_outils:
                            formatted += "<p><strong>Matériaux et outils :</strong></p><ul>"
                            for item in materiaux_outils:
                                if item.strip():
                                    formatted += f"<li>{item.strip()}</li>"
                            formatted += "</ul>"
                        
                        # Étapes
                        etapes_solution = sol.get("etapes", [])
                        if etapes_solution:
                            formatted += "<p><strong>Étapes :</strong></p><ol>"
                            for step in etapes_solution:
                                if isinstance(step, dict):  # C'est une étape avec sous-étapes
                                    titre_step = step.get('titre', '').strip()
                                    sous_etapes = step.get('sous_etapes', [])
                                    if titre_step:
                                        formatted += f"<li>{titre_step}"
                                        if sous_etapes:
                                            formatted += "<ul>"
                                            for sub in sous_etapes:
                                                if sub.strip():
                                                    formatted += f"<li>{sub.strip()}</li>"
                                            formatted += "</ul>"
                                        formatted += "</li>"
                                elif isinstance(step, str) and step.strip():
                                    formatted += f"<li>{step.strip()}</li>"
                            formatted += "</ol>"
                        
                        # Remarques
                        remarques_solution = sol.get("remarques", [])
                        if remarques_solution:
                            formatted += "<p><strong>Remarques :</strong></p><ul>"
                            for rem in remarques_solution:
                                if rem.strip():
                                    formatted += f"<li>{rem.strip()}</li>"
                            formatted += "</ul>"
                        
                        etapes.append(formatted)
                else:
                    # Fallback si pas de solutions (ancienne structure)
                    etapes.append(f"<strong>{titre_etape}</strong>")
            else:
                etapes.append(str(e).strip())
        
        # Appliquer unique_preserve_order pour éviter les doublons
        etapes = unique_preserve_order(etapes)
        
        # Annexes avec la nouvelle structure "solutions"
        annexes = project_data.get("annexes", [])
        remarques_list = []
        for a in annexes:
            if isinstance(a, dict):
                titre_annexe = a.get("titre", "")
                solutions = a.get("solutions", [])
                
                if solutions:
                    for sol in solutions:
                        annexe_text = ""
                        if titre_annexe:
                            annexe_text += f"<strong>{titre_annexe}</strong><br>"
                        
                        # Objectif
                        objectif = sol.get("objectif", "").strip()
                        if objectif:
                            annexe_text += f"{objectif}<br>"
                        
                        # Matériaux et outils
                        materiaux_outils = sol.get("materiaux_outils", [])
                        if materiaux_outils:
                            annexe_text += "<strong>Matériaux et outils :</strong> " + ", ".join([m.strip() for m in materiaux_outils if m.strip()]) + "<br>"
                        
                        # Étapes
                        etapes_annexe = sol.get("etapes", [])
                        if etapes_annexe:
                            annexe_text += "<strong>Étapes :</strong><br>"
                            for i, step in enumerate(etapes_annexe, 1):
                                if isinstance(step, dict):  # Étape avec sous-étapes
                                    titre_step = step.get('titre', '').strip()
                                    sous_etapes = step.get('sous_etapes', [])
                                    if titre_step:
                                        annexe_text += f"{titre_step}<br>"
                                        if sous_etapes:
                                            for sub in sous_etapes:
                                                if sub.strip():
                                                    annexe_text += f"  - {sub.strip()}<br>"
                                elif isinstance(step, str) and step.strip():
                                    annexe_text += f"{i}. {step.strip()}<br>"
                        
                        # Remarques
                        remarques_annexe = sol.get("remarques", [])
                        if remarques_annexe:
                            for rem in remarques_annexe:
                                if rem.strip():
                                    annexe_text += f"{rem.strip()}<br>"
                        
                        remarques_list.append(annexe_text)
                else:
                    # Fallback ancienne structure
                    desc = a.get("description", "")
                    if isinstance(desc, list):
                        desc = " ".join([str(d).strip() for d in desc if d])
                    if titre_annexe:
                        remarques_list.append(f"<strong>{titre_annexe}</strong><br>{desc}")
                    else:
                        remarques_list.append(desc)
            else:
                remarques_list.append(str(a))
        remarques = "<br>".join(remarques_list).strip()
        # Mentions légales (priorité à la clé française "mentions légales", fallback variants)
        mentions_raw = []
        if isinstance(project_data, dict):
            mentions_raw = project_data.get("mentions légales", project_data.get("mentions_legales", []))
        mentions_legales = unique_preserve_order(self.format_hierarchical_list(mentions_raw))

        # Rendu via Jinja
        template = self.env.get_template("tutoriel_universel.html.j2")
        # Déterminer le lien source : priorité à la clé 'liens' (peut être une chaîne ou une liste),
        # ensuite à 'source', enfin heuristique basée sur la clé/titre.
        source_link = ""
        if isinstance(project_data, dict):
            # préférence : 'liens' (français)
            liens = project_data.get("liens", None)
            if isinstance(liens, str) and liens.strip():
                source_link = liens.strip()
            elif isinstance(liens, (list, tuple)) and len(liens) > 0:
                first = liens[0]
                if isinstance(first, str) and first.strip():
                    source_link = first.strip()
                    
        html_output = template.render(
            titre=titre,
            main_image_url= main_image_url,
            main_image_caption= main_image_caption,
            difficulte=difficulte,
            duree=duree,
            cout=cout,
            source_link=source_link,
            materiaux=materiaux,
            outils=outils,
            etapes=etapes,
            remarques=remarques,
            intro=intro,
            intro_items=intro_formatted,
            mentions_legales=mentions_legales
        )
        return html_output

    def save(self, html_output: str, output_html="output.html" ):
        # Sauvegarde HTML
        with open(output_html, "w", encoding="utf-8") as f:
            f.write(html_output)
        print(f" HTML généré : {output_html}")
"""
        # Génération PDF (si lib installée)
        if PDF_ENABLED:
            HTML(string=html_output).write_pdf(output_pdf)
            print(f" PDF généré : {output_pdf}")
        else:
            print(" WeasyPrint non installé — aucun PDF créé.")
"""

# Point d'entrée 
if __name__ == "__main__":
    with open("data_exemple.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    harmonizer = TutorialHarmonizer()
    html_code = harmonizer.harmonize(data)
    harmonizer.save(html_code)
