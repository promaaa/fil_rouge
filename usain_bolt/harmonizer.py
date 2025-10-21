import json
import os
import re
from jinja2 import Environment, FileSystemLoader

# Optionnel : pour créer le PDF (installe avec `pip install weasyprint`)
try:
    from weasyprint import HTML
    PDF_ENABLED = True
except (ImportError, OSError) as e:
    PDF_ENABLED = False
    print("⚠️ WeasyPrint non disponible — génération PDF désactivée.")

# --- CONFIG ---
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")

# --- Helpers simples ---
def sentencify(s: str) -> str:
    s = s.strip()
    if not s:
        return s
    s = s[0].upper() + s[1:]
    if not re.search(r"[.!?…]$", s):
        s += "."
    return s

def unique_preserve_order(L):
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
        # Normalisation
        titre = data.get("titre", "Projet maker").strip()
        materiaux = unique_preserve_order([m.strip() for m in data.get("matériaux", [])])
        outils = unique_preserve_order([o.strip() for o in data.get("outils", [])])
        etapes = [
            sentencify(e["description"]) if isinstance(e, dict) else sentencify(e)
            for e in data.get("étapes", [])
        ]
        remarques = data.get("remarques", "").strip()
        intro = f"Ce tutoriel explique comment {titre.lower()}."

        # Rendu via Jinja
        template = self.env.get_template("tutoriel_universel.html.j2")
        html_output = template.render(
            titre=titre,
            materiaux=materiaux,
            outils=outils,
            etapes=etapes,
            remarques=remarques,
            intro=sentencify(intro)
        )
        return html_output

    def save(self, html_output: str, output_html="output.html", output_pdf="output.pdf"):
        # Sauvegarde HTML
        with open(output_html, "w", encoding="utf-8") as f:
            f.write(html_output)
        print(f"✅ HTML généré : {output_html}")

        # Génération PDF (si lib installée)
        if PDF_ENABLED:
            HTML(string=html_output).write_pdf(output_pdf)
            print(f"✅ PDF généré : {output_pdf}")
        else:
            print("⚠️ WeasyPrint non installé — aucun PDF créé.")


# --- Exemple d'utilisation ---
if __name__ == "__main__":
    with open("data_exemple.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    harmonizer = TutorialHarmonizer()
    html_code = harmonizer.harmonize(data)
    harmonizer.save(html_code)
