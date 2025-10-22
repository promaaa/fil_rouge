import json
import os
from jinja2 import Environment, FileSystemLoader

# Optionnel : pour créer le PDF (installe avec `pip install weasyprint`)
try:
    from weasyprint import HTML
    PDF_ENABLED = True
except (ImportError, OSError) as e:
    PDF_ENABLED = False
    print(" WeasyPrint non disponible — génération PDF désactivée.")

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


# --- Classe principale ---
class TutorialHarmonizer:
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

    def harmonize(self, data: dict):
        # On prend la première clé du dictionnaire (vélo, marmite, etc.)
        project_data = list(data.values())[0]
        
        # Normalisation
        titre = project_data.get("titre", ["Projet maker"])[0].strip()
        difficulte = project_data.get("difficulté", [""])[0].strip()
        duree = project_data.get("durée", [""])[0].strip()
        cout = project_data.get("coût", [""])[0].strip()
        
        introduction = [i.strip() for i in project_data.get("introduction", [])]
        intro = " ".join(introduction) if introduction else f"Ce tutoriel explique comment {titre.lower()}."
        
        
        materiaux = unique_preserve_order([m.strip() for m in project_data.get("matériaux", [])])
        outils = unique_preserve_order([o.strip() for o in project_data.get("outils", [])])
        
        # Les étapes avec la nouvelle structure "solutions"
        etapes = []
        for e in project_data.get("étapes", []):
            if isinstance(e, dict):
                titre_etape = e.get('titre', '').strip()
                solutions = e.get("solutions", [])
                
                if solutions:
                    # Traiter chaque solution
                    for sol in solutions:
                        formatted = f"<strong>{titre_etape}</strong>"
                        
                        # Images (ajoutées juste après le titre)
                        images = sol.get("images", [])
                        if images:
                            formatted += "<div class='step-images'>"
                            for img in images:
                                url = img.get("url", "")
                                alt = img.get("alt", "")
                                description = img.get("description", "")
                                if url:
                                    formatted += f"<figure>"
                                    formatted += f"<img src='{url}' alt='{alt}'>"
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
                                if step.strip():
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
                                if step.strip():
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

        # Rendu via Jinja
        template = self.env.get_template("tutoriel_universel.html.j2")
        html_output = template.render(
            titre=titre,
            difficulte=difficulte,
            duree=duree,
            cout=cout,
            materiaux=materiaux,
            outils=outils,
            etapes=etapes,
            remarques=remarques,
            intro=intro
        )
        return html_output

    def save(self, html_output: str, output_html="output.html", output_pdf="output.pdf"):
        # Sauvegarde HTML
        with open(output_html, "w", encoding="utf-8") as f:
            f.write(html_output)
        print(f" HTML généré : {output_html}")

        # Génération PDF (si lib installée)
        if PDF_ENABLED:
            HTML(string=html_output).write_pdf(output_pdf)
            print(f" PDF généré : {output_pdf}")
        else:
            print(" WeasyPrint non installé — aucun PDF créé.")


# --- Exemple d'utilisation ---
if __name__ == "__main__":
    with open("data_exemple.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    harmonizer = TutorialHarmonizer()
    html_code = harmonizer.harmonize(data)
    harmonizer.save(html_code)
