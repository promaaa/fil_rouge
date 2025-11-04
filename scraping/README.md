# 🛠️ Maker Scraping Tool

Un outil de scraping asynchrone pour récupérer des tutoriels de fabrication depuis des sites makers/low-tech.

## 📋 Sites supportés

- **LowTechLab** (https://wiki.lowtechlab.org) - 92+ tutoriels
- **Wikifab** (https://wikifab.org) - 112+ tutoriels avec gestion du "Voir plus"

## ✨ Fonctionnalités

- 🚀 **Scraping asynchrone** ultra-rapide avec `aiohttp`
- 🌐 **Support JavaScript** avec Playwright pour le contenu dynamique
- 🖱️ **Clics automatiques** sur "Voir plus" (jusqu'à 20 clics par site)
- 🖼️ **Images cliquables** sans doublons
- 📁 **Organisation automatique** des tutoriels par site
- 🔄 **Gestion des erreurs** et retry automatique
- 📊 **Logs détaillés** du processus

## 🚀 Installation rapide

### Prérequis
- Python 3.11+ 
- Git

### 1. Cloner le repository
```bash
git clone https://github.com/divinebanon1-art/Scraping_part.git
cd Scraping_part
```

### 2. Créer l'environnement virtuel
```bash
python -m venv .venv
```

### 3. Activer l'environnement virtuel

**Windows (PowerShell):**
```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows (cmd):**
```cmd
.venv\Scripts\activate.bat
```

**Linux/macOS:**
```bash
source .venv/bin/activate
```

### 4. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 5. Installer les navigateurs Playwright
```bash
playwright install
```

## 🎯 Utilisation

### Scraping simple
```bash
python Scrappy_fixed.py
```

### Avec environnement virtuel (si non activé)
**Windows:**
```powershell
& ".\.venv\Scripts\python.exe" Scrappy_fixed.py
```

**Linux/macOS:**
```bash
./.venv/bin/python Scrappy_fixed.py
```

## 📁 Structure des résultats

```
pages/
├── lowtechlab/           # Tutoriels LowTechLab (92 fichiers)
│   ├── Four_solaire.html
│   ├── Eolienne_200W.html
│   └── ...
├── wikifab/              # Tutoriels Wikifab (112 fichiers)  
│   ├── Robot_Arduino.html
│   ├── Imprimante_3D.html
│   └── ...
├── links_lowtechlab.txt  # Liste des URLs LowTechLab
└── links_wikifab.txt     # Liste des URLs Wikifab
```

## ⚙️ Configuration

Modifiez le fichier `Scrappy_fixed.py` pour :

### Ajouter un nouveau site
```python
{
    "name": "monsite",
    "base": "https://monsite.com/",
    "list_url": "https://monsite.com/tutoriels",
    "link_selector": "a.tutorial-link",
    "href_attr": "href", 
    "use_playwright": True,  # Si contenu dynamique
    "load_more_selector": ".load-more",  # Bouton "voir plus"
}
```

### Ajuster les paramètres
```python
MAX_CONCURRENCY = 15    # Requêtes simultanées
RETRIES = 3            # Tentatives par URL
max_clicks = 20        # Clics max sur "voir plus"
```

## 🔧 Dépendances

- **aiohttp** - Requêtes HTTP asynchrones
- **beautifulsoup4** - Parsing HTML
- **lxml** - Parser XML/HTML performant  
- **playwright** - Automatisation navigateur
- **aiodns** - Résolution DNS asynchrone

## 📊 Performance

- **~200 tutoriels** récupérés en quelques minutes
- **15 requêtes simultanées** maximum
- **Gestion intelligente** des timeouts et erreurs
- **Optimisé** pour minimiser la charge serveur

## 🐛 Dépannage

### Erreur "Module not found"
```bash
# Vérifier l'environnement virtuel
pip list

# Réinstaller les dépendances
pip install -r requirements.txt
```

### Erreur Playwright
```bash
# Réinstaller les navigateurs
playwright install

# Ou forcer la réinstallation
playwright install --force
```

### Erreur d'encodage
- Normal pour quelques pages avec caractères spéciaux
- La majorité du contenu sera correctement récupéré

## 📄 Licence

MIT License - Libre d'utilisation et modification

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📞 Contact

- GitHub: [@divinebanon1-art](https://github.com/divinebanon1-art)
- Repository: [Scraping_part](https://github.com/divinebanon1-art/Scraping_part)

---

⭐ **N'hésitez pas à star le projet si il vous aide !**