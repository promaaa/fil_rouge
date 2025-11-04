Harmonizer — Prototype de transformation JSON → HTML/PDF
=========================================================

Ce dépôt contient un prototype qui transforme des données JSON structurées représentant des tutoriels en pages HTML, puis en PDF. Le document ci‑dessous décrit de manière détaillée le fonctionnement du code, la structure des données attendue, les étapes d'exécution, les dépendances et les pistes d'évolution.

Table des matières
------------------

1. Vue d'ensemble
2. Arborescence et fichiers importants
3. Format des données (schéma attendu)
4. Description détaillée du code (`harmonizer.py`)
5. Template Jinja2
6. Exécution et dépendances
7. Vérification et dépannage
8. Bonnes pratiques pour l'édition du JSON
9. Tests, validation et CI
10. Suggestions d'amélioration
11. Contribution et licence

1. Vue d'ensemble
-----------------

Objectif : prendre un fichier JSON décrivant un tutoriel (métadonnées, matériaux, outils, étapes, annexes, images, etc.), le normaliser et produire une page HTML harmonisée (`output.html`). Si WeasyPrint est disponible, le prototype produit également un PDF (`output.pdf`).

Le principe est d'imposer une structure de données cohérente pour faciliter l'automatisation et la réutilisation.

2. Arborescence et fichiers importants
-------------------------------------

- `harmonizer.py` : moteur principal. Lit le JSON, normalise les données, rend le template et produit le HTML/PDF.
- `data_exemple.json` : exemple de données d'entrée.
- `templates/tutoriel_universel.html.j2` : template Jinja2 pour le rendu HTML.
- `output.html` : fichier HTML généré.
- `output.pdf` : fichier PDF (si génération activée).
- `output/` : dossier de sortie optionnel (pour ressources ou génération multiple).

3. Format des données (schéma attendu)
--------------------------------------

Chaque tutoriel est un objet contenant des métadonnées et des sections. Les clés principales sont :

- `titre` : liste (ex. `["Vélo à assistance électrique"]`).
- `difficulté`, `durée`, `coût` : listes contenant une valeur chacune.
- `introduction`, `mentions légales`, `matériaux`, `outils` : listes normalisées d'objets `{ "titre": string, "sous_items": [string, ...] }`.
- `étapes` : liste d'objets `{ "numero": int, "titre": string, "solutions": [...] }`.
- `solutions` : liste d'objets, chacun contenant au minimum :
  - `objectif` (string)
  - `materiaux_outils` (liste)
  - `etapes` (liste d'objets `{ "titre": string, "sous_etapes": [string, ...] }`)
  - `remarques` (liste)
  - `images` (optionnel) : liste d'objets `{ "url": string, "alt": string, "description": string }`

Règles importantes :

- Les éléments de `etapes` doivent être des objets avec les clés `titre` et `sous_etapes` (même si `sous_etapes` est vide).
- Les sections `matériaux` et `outils` utilisent la forme `{titre, sous_items}` pour permettre des sous-listes et des titres de sous‑section.

Exemple d'une étape avec sous-étapes :

```json
{
  "titre": "Brancher dans l'ordre :",
  "sous_etapes": [
    "Le capteur PAS sur le connecteur approprié",
    "Les trois lignes d'alimentation du moteur brushless"
  ]
}
```

4. Description détaillée du code (`harmonizer.py`)
--------------------------------------------------

Les fonctions et méthodes principales sont :

- Gestion conditionnelle de WeasyPrint : tentative d'import, génération PDF désactivée si dépendances manquantes.

- `unique_preserve_order(L)` : supprime les doublons tout en conservant l'ordre d'apparition.

- `format_hierarchical_list(self, items)` : formate les objets `{titre, sous_items}` en chaînes HTML prêtes à être affichées (injection via `|safe`). Un titre possédant `sous_items` renvoie un fragment HTML contenant un `<ul>`.

- `harmonize(self, data)` :
  - Récupère le premier tutoriel du JSON (`project_data = list(data.values())[0]`).
  - Extrait les métadonnées (`titre`, `difficulté`, `durée`, `coût`).
  - Normalise `introduction`, `matériaux`, `outils` via `format_hierarchical_list`.
  - Traite les `étapes` et leurs `solutions`, en générant les fragments HTML nécessaires pour les listes et les sous-étapes.
  - Agrège les annexes et remarques dans une variable `remarques` destinée au footer.
  - Rend le template Jinja2 `tutoriel_universel.html.j2` avec les variables : `titre, difficulte, duree, cout, materiaux, outils, etapes, remarques, intro`.

- `save(self, html_output, output_html='output.html', output_pdf='output.pdf')` : écrit le HTML et tente la conversion en PDF si WeasyPrint est disponible.

Notes d'implémentation :

- Le script produit des fragments HTML côté Python pour les listes imbriquées afin d'éviter une logique trop lourde dans la template. Ces fragments sont insérés via le filtre Jinja `|safe`.

5. Template Jinja2
------------------

Le template `templates/tutoriel_universel.html.j2` contient les sections suivantes :

- En-tête : `{{ titre }}`, `{{ intro }}` et les métadonnées (`difficulté`, `durée`, `coût`).
- Sections : `matériaux`, `outils` (listes rendues via `|safe`), `étapes` (ol) et `remarques` (footer).
- Styles CSS minimaux intégrés.

6. Exécution et dépendances
---------------------------

Installation recommandée :

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install jinja2
# weasyprint est optionnel si vous souhaitez générer un PDF
```

Pour activer la génération PDF (WeasyPrint) sur macOS, installer les dépendances système :

```bash
brew install pango gdk-pixbuf libffi glib gobject-introspection cairo
pip install weasyprint
```

Selon la configuration macOS, il peut être nécessaire d'exporter la variable d'environnement suivante avant de lancer la génération :

```bash
export DYLD_LIBRARY_PATH=/opt/homebrew/lib:$DYLD_LIBRARY_PATH
```

Commande d'exécution :

```bash
export DYLD_LIBRARY_PATH=/opt/homebrew/lib:$DYLD_LIBRARY_PATH
.venv/bin/python harmonizer.py
```

Le script écrit `output.html` et, si WeasyPrint est disponible, `output.pdf`.

7. Vérification et dépannage
----------------------------

- Valider rapidement le JSON :

```bash
python3 -c "import json; json.load(open('data_exemple.json','r',encoding='utf-8')); print('JSON valide')"
```

- Si le PDF n'est pas généré, vérifier l'installation de WeasyPrint et des dépendances système.
- Si les sous-listes ou les sous-étapes ne s'affichent pas correctement, vérifier la structure `{titre, sous_items}` ou `{titre, sous_etapes}` dans le JSON d'entrée.

8. Bonnes pratiques pour l'édition du JSON
-----------------------------------------

- Toujours fournir `titre`, `difficulté`, `durée` et `coût` (même si ces champs sont des listes vides) pour éviter des erreurs d'accès côté code.
- Préférer des listes vides `[]` plutôt que `null` pour les sous-éléments.
- Travailler en UTF-8 et éviter l'injection HTML non contrôlée dans les champs.

9. Tests, validation et intégration continue
-------------------------------------------

- Ajouter un schéma JSON (JSON Schema) pour valider automatiquement les fichiers d'entrée.
- Écrire des tests unitaires pour :
  - `format_hierarchical_list`
  - la normalisation des étapes et solutions
- Mettre en place une CI (par exemple GitHub Actions) qui valide le JSON et exécute `harmonizer.py` pour détecter des erreurs d'exécution.

10. Suggestions d'amélioration
-----------------------------

- Support multi-tutoriels : permettre de générer un HTML/PDF par tutoriel et un index global.
- Ajouter un CLI (argparse/click) pour choisir le fichier d'entrée, activer/désactiver le PDF, définir le dossier de sortie.
- Meilleure gestion des images : téléchargement et copie vers `output/` pour garantir la portabilité du HTML et du PDF.
- Génération de tests automatiques et schéma JSON strict pour éviter les cas ambigus.

11. Contribution et licence
--------------------------

- Pour contribuer : fork, branche, PR. Merci d'ajouter des tests et de documenter les changements.
- Licence : aucun fichier `LICENSE` présent dans le dépôt. Ajouter une licence explicite si vous prévoyez de partager publiquement.

---

Prochaines étapes possibles (je peux m'en charger) :

- créer un `requirements.txt` minimal,
- ajouter un test unitaire simple pour `format_hierarchical_list`,
- ajouter un petit CLI pour sélectionner le tutoriel à générer.

Indiquez votre préférence pour la suite.
