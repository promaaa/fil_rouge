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
        
        # Les étapes sont des dictionnaires avec titre et description
        etapes = []
        for e in project_data.get("étapes", []):
            if isinstance(e, dict):
                titre_etape = e.get('titre', '').strip()
                description = e.get("description", "")
                
                # Si description est un array, créer des sous-points
                if isinstance(description, list):
                    # Filtrer et nettoyer les éléments
                    desc_items = [d.strip() for d in description if d and d.strip()]
                    if desc_items:
                        # Formater : Titre avec les points en dessous
                        formatted = f"<strong>{titre_etape}</strong><ul>"
                        for item in desc_items:
                            formatted += f"<li>{item}</li>"
                        formatted += "</ul>"
                        etapes.append(formatted)
                    else:
                        etapes.append(f"<strong>{titre_etape}</strong>")
                else:
                    # Si c'est une simple chaîne
                    description = str(description).strip()
                    etapes.append(f"<strong>{titre_etape}</strong>: {description}")
            else:
                etapes.append(str(e).strip())
        
        # Appliquer unique_preserve_order pour éviter les doublons
        etapes = unique_preserve_order(etapes)
        
        # Annexes comme remarques
        annexes = project_data.get("annexes", [])
        remarques_list = []
        for a in annexes:
            if isinstance(a, dict):
                desc = a.get("description", "")
                # Si description est un array, le joindre
                if isinstance(desc, list):
                    desc = " ".join([str(d).strip() for d in desc if d])
                remarques_list.append(desc)
            else:
                remarques_list.append(str(a))
        remarques = "\n".join(remarques_list).strip()

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
