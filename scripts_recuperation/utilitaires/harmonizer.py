import json
import os
from jinja2 import Environment, FileSystemLoader

# =========================
#  CONFIG : A ADAPTER ICI
# =========================

# Dossier où se trouvent les JSON source (ceux produits par html_to_json)
# Exemple : "../json/json_original/lowtechlab"
INPUT_DIR = "../json/json_original/wikifab"

# Dossier racine pour les sorties harmonisées (au niveau de json/)
OUTPUT_BASE_DIR = "../json"

# Nom de la source (lowtechlab, instructables, wikifab)
SOURCE_NAME = "wikifab"

# Dossier où se trouve le template Jinja2
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")


def unique_preserve_order(L):
    """Enlever les doublons en gardant l'ordre."""
    seen = set()
    result = []
    for x in L:
        if x not in seen:
            seen.add(x)
            result.append(x)
    return result


class TutorialHarmonizer:
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

    def format_hierarchical_list(self, items):
        """Formate une liste d'items titre/sous_items en fragments HTML."""
        if not items:
            return []
        
        formatted = []
        for item in items:
            if isinstance(item, dict):
                titre = (item.get('titre') or "").strip()
                sous_items = item.get('sous_items', [])
                
                if sous_items:
                    html = f"{titre}"
                    html += "<ul>"
                    for sub in sous_items:
                        if isinstance(sub, str) and sub.strip():
                            html += f"<li>{sub.strip()}</li>"
                    html += "</ul>"
                    formatted.append(html)
                else:
                    if titre:
                        formatted.append(titre)
            elif isinstance(item, str) and item.strip():
                formatted.append(item.strip())
        
        return formatted

    def _get_project_data(self, data: dict):
        """
        Cas typique : {"vélo": {...}}
        -> on prend la première (et souvent seule) valeur du dict.
        """
        if not isinstance(data, dict) or not data:
            raise ValueError("Le JSON racine doit être un objet non vide.")
        first_key = next(iter(data.keys()))
        return data[first_key]

    def _compute_common_fields(self, data: dict):
        """
        Calcule tous les champs harmonisés (titre, intro, étapes, etc.)
        à partir de la structure JSON d'entrée.
        """
        project_data = self._get_project_data(data)

        # Champs principaux
        titre = (project_data.get("titre", ["Projet maker"])[0] or "").strip()
        difficulte = (project_data.get("difficulté", [""])[0] or "").strip()
        duree = (project_data.get("durée", [""])[0] or "").strip()
        cout = (project_data.get("coût", [""])[0] or "").strip()
        image = project_data.get("image", [{}])[0] if project_data.get("image") else {}
        main_image_url = (image.get("url") or "").strip()
        main_image_caption = (image.get("description") or "").strip()

        # Lien source
        source_link = ""
        if isinstance(project_data, dict):
            liens = project_data.get("liens", None)
            if isinstance(liens, str) and liens.strip():
                source_link = liens.strip()
            elif isinstance(liens, (list, tuple)) and liens:
                first = liens[0]
                if isinstance(first, str) and first.strip():
                    source_link = first.strip()

        # Introduction
        intro_items = project_data.get("introduction", [])
        intro_formatted = self.format_hierarchical_list(intro_items)
        intro = " ".join(intro_formatted) if intro_formatted else (
            f"Ce tutoriel explique comment {titre.lower()}." if titre else ""
        )

        # Matériaux / outils
        materiaux_raw = project_data.get("matériaux", [])
        materiaux = unique_preserve_order(self.format_hierarchical_list(materiaux_raw))

        outils_raw = project_data.get("outils", [])
        outils = unique_preserve_order(self.format_hierarchical_list(outils_raw))

        # Étapes (liste de dicts {"html":..., "fichiers":[...]})
        etapes = []
        step_number = 1  # Initialisation du numéro des étapes

        for e in project_data.get("étapes", []):
            if isinstance(e, dict):
                titre_etape = (e.get('titre') or "").strip()
                solutions = e.get("solutions", [])

                if solutions:
                    for sol in solutions:
                        num = step_number
                        num_str = f"{num}. " if (num is not None and str(num).strip() != "") else ""
                        formatted = f"<strong>{num_str}{titre_etape}</strong>"

                        # Images de l'étape
                        images = sol.get("images", [])
                        if images:
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
                                    formatted += "<figure>"
                                    formatted += f"<img src='{url}' alt='{alt}' loading='lazy'>"
                                    if description:
                                        formatted += f"<figcaption>{description}</figcaption>"
                                    formatted += "</figure>"
                            formatted += "</div>"

                        # Objectif
                        objectif = (sol.get("objectif") or "").strip()
                        if objectif:
                            formatted += f"<p><em>{objectif}</em></p>"

                        # Matériaux et outils spécifiques à la solution
                        materiaux_outils = sol.get("materiaux_outils", [])
                        if materiaux_outils:
                            formatted += "<p><strong>Matériaux et outils :</strong></p><ul>"
                            for item in materiaux_outils:
                                if isinstance(item, str) and item.strip():
                                    formatted += f"<li>{item.strip()}</li>"
                            formatted += "</ul>"

                        # Étapes détaillées
                        etapes_solution = sol.get("etapes", [])
                        if etapes_solution:
                            formatted += "<p><strong>Étapes :</strong></p><ol>"

                            # 1) Normaliser la liste d'étapes (fusionner les sous_etapes "orphelines")
                            normalized = []
                            
                            def is_formula(line: str) -> bool:
                                if not line:
                                    return False
                                if "=" in line:
                                    return True
                                return False

                            for step in etapes_solution:
                                if isinstance(step, dict):
                                    titre_step = (step.get('titre') or "").strip()
                                    sous_etapes = step.get('sous_etapes') or []
                                    sous_etapes = [
                                        s.strip() for s in sous_etapes
                                        if isinstance(s, str) and s.strip()
                                    ]

                                    # Heuristique formule
                                    if titre_step and is_formula(titre_step):
                                        if normalized:
                                            normalized[-1]["sous_etapes"].append(titre_step)
                                        else:
                                            normalized.append({
                                                "titre": "",
                                                "sous_etapes": [titre_step]
                                            })
                                        continue

                                    if titre_step and not sous_etapes:
                                        normalized.append({
                                            "titre": titre_step,
                                            "sous_etapes": []
                                        })

                                    elif titre_step and sous_etapes:
                                        normalized.append({
                                            "titre": titre_step,
                                            "sous_etapes": sous_etapes
                                        })

                                    elif not titre_step and sous_etapes:
                                        if normalized:
                                            normalized[-1]["sous_etapes"].extend(sous_etapes)
                                        else:
                                            normalized.append({
                                                "titre": "",
                                                "sous_etapes": sous_etapes
                                            })

                                elif isinstance(step, str):
                                    txt = step.strip()
                                    if txt:
                                        normalized.append({
                                            "titre": txt,
                                            "sous_etapes": []
                                        })

                            # 2) Générer le HTML à partir de la liste normalisée
                            for item in normalized:
                                titre_step = item["titre"]
                                sous_etapes = item["sous_etapes"]

                                formatted += "<li>"
                                if titre_step:
                                    formatted += titre_step

                                if sous_etapes:
                                    formatted += "<ul>"
                                    for sub in sous_etapes:
                                        formatted += f"<li>{sub}</li>"
                                    formatted += "</ul>"

                                formatted += "</li>"

                            formatted += "</ol>"

                        # Remarques
                        remarques_solution = sol.get("remarques", [])
                        if remarques_solution:
                            formatted += "<p><strong>Remarques :</strong></p><ul>"
                            for rem in remarques_solution:
                                if isinstance(rem, str) and rem.strip():
                                    formatted += f"<li>{rem.strip()}</li>"
                            formatted += "</ul>"

                        # Fichiers
                        fichiers = sol.get("fichiers", []) if isinstance(sol, dict) else []
                        etapes.append({"html": formatted, "fichiers": fichiers})

                        # Incrémentation du numéro d'étape après chaque solution
                        step_number += 1
                else:
                    # Fallback si pas de solutions
                    etapes.append({"html": f"<strong>{titre_etape}</strong>", "fichiers": []})

        # Enlever doublons
        seen = set()
        unique_etapes = []
        for item in etapes:
            key = item.get('html') if isinstance(item, dict) else str(item)
            if key not in seen:
                seen.add(key)
                unique_etapes.append(item)
        etapes = unique_etapes

        # Structure harmonisée
        return {
            "titre": titre,
            "main_image_url": main_image_url,
            "main_image_caption": main_image_caption,
            "difficulte": difficulte,
            "duree": duree,
            "cout": cout,
            "source_link": source_link,
            "intro": intro,
            "intro_items": intro_formatted,
            "materiaux": materiaux,
            "outils": outils,
            "etapes": etapes,
            "remarques": "",
            "mentions_legales": [],
        }


    # ========== SORTIE HTML ==========
    def harmonize(self, data: dict):
        fields = self._compute_common_fields(data)
        template = self.env.get_template("tutoriel_universel.html.j2")
        html_output = template.render(**fields)
        return html_output

    def save_html(self, html_output: str, output_html: str):
        with open(output_html, "w", encoding="utf-8") as f:
            f.write(html_output)
        print(f"✅ HTML généré : {output_html}")

    # ========== SORTIE JSON HARMONISÉ ==========
    def harmonize_to_json(self, data: dict):
        return self._compute_common_fields(data)

    def save_json(self, json_data: dict, output_json: str):
        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(json_data, f, ensure_ascii=False, indent=4)
        print(f"✅ JSON harmonisé généré : {output_json}")


# =========================
#      POINT D'ENTRÉE
# =========================
if __name__ == "__main__":
    print(f"🔍 Dossier d'entrée : {INPUT_DIR}")
    if not os.path.isdir(INPUT_DIR):
        raise NotADirectoryError(f"Dossier introuvable : {INPUT_DIR}")

    # Créer les sous-dossiers de sortie avec la structure source
    output_html_dir = os.path.join(OUTPUT_BASE_DIR, "html_harmonized", SOURCE_NAME)
    output_json_dir = os.path.join(OUTPUT_BASE_DIR, "json_harmonized", SOURCE_NAME)
    os.makedirs(output_html_dir, exist_ok=True)
    os.makedirs(output_json_dir, exist_ok=True)

    harmonizer = TutorialHarmonizer()
    print("✅ Harmonizer initialisé")

    # Parcours de tous les JSON du dossier (sauf ceux déjà harmonisés)
    for filename in os.listdir(INPUT_DIR):
        if not filename.lower().endswith(".json"):
            continue
        if filename.endswith("_harmonized.json"):
            continue

        input_path = os.path.join(INPUT_DIR, filename)
        if not os.path.isfile(input_path):
            continue

        print(f"\n📄 Traitement du fichier : {filename}")
        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Génération HTML
        html_code = harmonizer.harmonize(data)
        base_name, _ = os.path.splitext(filename)
        output_html = os.path.join(output_html_dir, base_name + ".html")
        harmonized_json_path = os.path.join(output_json_dir, base_name + "_harmonized.json")

        harmonizer.save_html(html_code, output_html)

        # Génération JSON harmonisé
        json_struct = harmonizer.harmonize_to_json(data)
        harmonizer.save_json(json_struct, harmonized_json_path)

    print("\n✅ Traitement terminé pour tous les JSON du dossier.")
