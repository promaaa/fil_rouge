# Scripts de Récupération

Ce dossier contient les outils pour récupérer (scraper), parser et harmoniser les tutoriels depuis différentes sources web.

## Structure

- **`scripts/`** : Scripts principaux de scraping web (anciennement `scrapers`).
- **`analyseurs/`** : Scripts d'analyse et de parsing des pages HTML vers JSON (anciennement `parsers`).
  - `html_to_json_lowtech.py` : Parser pour Low-tech Lab
  - `html_to_json_wikifab.py` : Parser pour Wikifab
  - `html_to_json_Instructables.py` : Parser pour Instructables
- **`utilitaires/`** : Fonctions utilitaires partagées.
  - `harmonizer.py` : Harmonisation des JSON vers HTML/JSON unifié
  - `templates/` : Templates Jinja2 pour la génération HTML
- **`pages_brutes/`** : Pages HTML brutes téléchargées (anciennement `pages_html`).
  - `lowtechlab/` : 206 tutoriels
  - `wikifab/` : 113 tutoriels
  - `instructables/` : 315 tutoriels
- **`donnees_brutes/`** : Données JSON brutes extraites des pages (anciennement `json`).
  - Structure identique à `pages_brutes/`
- **`donnees_harmonisees/`** : Données harmonisées (HTML + JSON au format unifié).
  - Chaque source contient deux sous-dossiers : `html/` et `json/`

## Pipeline de traitement

### Étape 1 : Parsing HTML → JSON

Extraction des données structurées depuis les pages HTML :

```bash
cd analyseurs
python html_to_json_lowtech.py      # 206 fichiers générés
python html_to_json_wikifab.py      # 113 fichiers générés
python html_to_json_Instructables.py # 315 fichiers générés
```

### Étape 2 : Harmonisation JSON → HTML/JSON unifié

Conversion vers un format harmonisé commun :

```bash
cd utilitaires
python harmonizer.py
```

Configuration dans `harmonizer.py` :
```python
INPUT_DIR = "../donnees_brutes/instructables"  # Source à traiter
OUTPUT_BASE_DIR = "../donnees_harmonisees"
SOURCE_NAME = "instructables"  # lowtechlab | wikifab | instructables
```

## Résultat

**634 tutoriels traités au total** :
- 206 Low-tech Lab (français)
- 113 Wikifab (français)
- 315 Instructables (anglais)

Chaque tutoriel existe en 3 formats :
1. HTML brut (`pages_brutes/`)
2. JSON structuré (`donnees_brutes/`)
3. HTML + JSON harmonisé (`donnees_harmonisees/`)

## Dépendances

```bash
pip install beautifulsoup4 jinja2 lxml
```

## Notes techniques

- Encodage UTF-8 pour les caractères français et emojis
- Gestion automatique des chemins Windows longs (>200 caractères) via hachage MD5
- Templates Jinja2 pour génération HTML harmonisée
