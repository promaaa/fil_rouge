# Structure JSON pour Tutoriels DIY

Ce dépôt définit une structure JSON standardisée pour documenter des tutoriels techniques (low-tech, Arduino, bricolage, etc.) et les convertir en HTML.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure des données](#structure-des-données)
3. [Exemples de tutoriels](#exemples-de-tutoriels)
4. [Utilisation](#utilisation)
5. [Convertisseur HTML](#convertisseur-html)
6. [Bonnes pratiques](#bonnes-pratiques)
7. [Contribution](#contribution)

##  Vue d'ensemble

Ce projet propose un format JSON stantardiser pour structurer des tutoriels techniques de manière cohérente et réutilisable. Le format permet de :

- Décrire précisément les matériaux, outils et étapes
- Organiser les informations de manière hiérarchique
- Inclure des images,fichiers et des remarques détaillées
- Proposer plusieurs solutions pour une même étape
- Générer automatiquement des pages HTML

### Tutoriels actuellement documentés

1. **Vélo à assistance électrique** - Conversion d'un vélo classique avec composants d'hoverboard
2. **Marmite norvégienne** - Système de cuisson passive économe en énergie
3. **Système d'éclairage vélo Arduino** - Feux intelligents avec clignotants et odomètre

## Structure des données

### Format général

Chaque tutoriel est un objet JSON contenant les clés principales suivantes :
```json
{
  "nom_du_tutoriel": {
    "titre": ["Titre du tutoriel"],
    "image": [{ "url": "...", "alt": "...", "description": "..." }],
    "difficulté": ["Facile|Moyen|Difficile"],
    "durée": ["temps estimé"],
    "coût": ["fourchette de prix"],
    "liens": ["url source"],
    "introduction": [...],
    "mentions légales": [...],
    "matériaux": [...],
    "outils": [...],
    "étapes": [...],
    "annexes": [...]
  }
}
```

### Sections détaillées

#### Métadonnées de base

- **titre** : Liste contenant le titre principal
- **difficulté** : `["Facile"]`, `["Moyen"]` ou `["Difficile"]`
- **durée** : Temps estimé (ex: `["2 jour(s)"]`, `["1 heure"]`)
- **coût** : Fourchette de prix (ex: `["50-100 EUR (€)"]`)
- **liens** : Liste des URLs sources du tutoriel

#### Introduction

Liste d'objets structurés :
```json
{
  "titre": "Texte d'introduction ou sous-titre",
  "sous_items": ["point 1", "point 2", ...]
}
```

#### Matériaux et Outils

Format hiérarchique permettant de regrouper par catégories :
```json
{
  "titre": "Catégorie ou élément",
  "sous_items": ["détail 1", "détail 2", ...]
}
```

**Exemple** :
```json
{
  "titre": "Équipements de protection obligatoires :",
  "sous_items": [
    "Lunettes de protection",
    "Gants de travail"
  ]
}
```

#### Étapes

Structure la plus complexe, permettant plusieurs solutions par étape :
```json
{
  "numero": 1,
  "titre": "Titre de l'étape",
  "solutions": [
    {
      "objectif": "Description de l'objectif",
      "materiaux_outils": ["liste des outils nécessaires"],
      "etapes": [
        {
          "titre": "Action à réaliser",
          "sous_etapes": ["détail 1", "détail 2"]
        }
      ],
      "remarques": ["conseil important", ...],
      "images": [
        {
          "url": "https://...",
          "alt": "texte alternatif",
          "description": "description détaillée"
        }
      ]
    }
  ]
}
```

## Exemples de tutoriels

### Tutoriel simple : Marmite norvégienne

Exemple d'un tutoriel rapide (1h, facile, 10€) avec 9 étapes :
- Construction de deux caisses emboîtées
- Isolation thermique avec matériaux de récupération
- Conseils d'utilisation

### Tutoriel complexe : Vélo électrique

Exemple d'un tutoriel avancé (2 jours, difficile, 50-100€) avec :
- Démontage de composants électroniques
- Installation de capteurs
- Câblage électrique détaillé
- Tests et modifications optionnelles

### Tutoriel électronique : Arduino Bike Lights

Exemple d'un projet technique (2 mois, difficile, 50-80€) avec :
- Circuits imprimés et composants électroniques
- Programmation Arduino
- Impression 3D de supports
- Configuration logicielle

##  Utilisation

### Ajouter un nouveau tutoriel

1. Créez une nouvelle entrée dans `data_exemple.json`
2. Suivez la structure décrite ci-dessus
3. Remplissez toutes les sections obligatoires
4. Validez le JSON

##  Convertisseur HTML

Le projet inclut un convertisseur Python qui transforme le JSON en pages HTML.

### Installation
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install jinja2
```

### Génération HTML
```bash
python harmonizer.py
```

Produit : `output.html`

##  Bonnes pratiques

### Structure des données

- **Toujours utiliser des listes** même pour une seule valeur : `["valeur"]`
- **Préférer des listes vides** `[]` plutôt que `null`
- **Respecter l'encodage UTF-8** pour les caractères accentués
- **Fournir des URLs complètes** pour les images (avec `https://`)

### Images

- Inclure systématiquement `url`, `alt` et `description`
- Utiliser des descriptions détaillées pour l'accessibilité
- Préférer des images hébergées de manière pérenne

### Étapes et sous-étapes

- Une étape sans sous-étapes : `"sous_etapes": []`
- Toujours structurer les actions avec `{titre, sous_etapes}`
- Numéroter les étapes de manière séquentielle

### Remarques et conseils

- Placer les remarques importantes dans le champ `remarques` de chaque solution
- Distinguer les conseils généraux (introduction) des remarques spécifiques (étapes)

##  Contribution

### Ajouter un tutoriel

1. Forkez le projet
2. Ajoutez votre tutoriel dans `data_exemple.json`
3. Validez la structure JSON
4. Testez la génération HTML
5. Créez une Pull Request

### Sources recommandées

- [Low-tech Lab](https://wiki.lowtechlab.org)
- [Instructables](https://www.instructables.com)
- Autres wikis et documentations techniques open-source après vérification et validation

Important : Avant d'intégrer un tutoriel provenant d'une source externe :
- Vérifiez la fiabilité et la qualité des instructions
- Assurez-vous que le contenu est sous licence compatible (CC, MIT, GPL, etc.)
- Testez les instructions si possible
- Mentionnez toujours la source originale dans le champ `liens`
- Respectez les droits d'auteur et les conditions d'utilisation

### Lignes directrices

- Documenter des projets DIY, low-tech ou techniques
- Fournir des instructions claires et reproductibles
- Inclure des photos de qualité
- Mentionner les sources originales dans `liens`
- Vérifier l'exactitude technique avant de publier
- Tester les tutoriels complexes quand c'est possible

##  Ressources

- [Tutoriel vélo électrique](https://wiki.lowtechlab.org/wiki/V%C3%A9lo_%C3%A0_assistance_%C3%A9lectrique)
- [Tutoriel marmite norvégienne](https://wiki.lowtechlab.org/wiki/Marmite_norv%C3%A9gienne)
- [Tutoriel Arduino Bike Lights](https://www.instructables.com/This-Project-Reduces-Bike-Crashes-DIY-Arduino-Bike/)
