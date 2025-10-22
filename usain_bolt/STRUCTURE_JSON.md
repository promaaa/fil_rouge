# Structure du JSON pour les Tutoriels

## Vue d'ensemble

Le fichier `data_exemple.json` utilise une structure hiérarchique cohérente pour organiser tous les contenus.

## Deux types de structures

### 1. Sections Textuelles (avec `titre` + `sous_items`)

Utilisées pour :
- `introduction`
- `mentions légales`
- `matériaux`
- `outils`

**Structure :**
```json
{
  "titre": "Texte principal ou titre se terminant par :",
  "sous_items": ["item 1", "item 2", ...] ou []
}
```

**Exemples :**

```json
{
  "titre": "Points importants de la réglementation :",
  "sous_items": [
    "L'assistance ne doit fonctionner que jusqu'à une vitesse de 25 km/h",
    "La puissance du moteur ne doit pas excéder 250W",
    "L'assistance doit être activée par le pédalage"
  ]
}
```

```json
{
  "titre": "2 options en fonction du boitier de pédalier du vélo :",
  "sous_items": [
    "à axes carrés (\"universel\"): ~8€",
    "à axes carrés dernières générations (\"intégré\") : ~8€"
  ]
}
```

```json
{
  "titre": "Équipements de protection obligatoires :",
  "sous_items": [
    "Lunettes de protection",
    "Gants de travail",
    "Masque de protection pour la soudure"
  ]
}
```

### 2. Étapes (avec `titre` + `sous_etapes`)

Utilisées pour :
- `étapes[n].solutions[n].etapes`
- `annexes[n].solutions[n].etapes`

**Structure :**
```json
{
  "titre": "Description de l'étape",
  "sous_etapes": ["sous-étape 1", "sous-étape 2", ...] ou []
}
```

**Exemples :**

```json
{
  "titre": "Enlever la coque plastique qui enferme tous les composants électroniques.",
  "sous_etapes": []
}
```

```json
{
  "titre": "Brancher dans l'ordre :",
  "sous_etapes": [
    "Le capteur PAS sur le connecteur approprié",
    "Les trois lignes d'alimentation du moteur brushless",
    "Le capteur à effet Hall du moteur",
    "Les capteurs de frein sur les connecteurs dédiés"
  ]
}
```

```json
{
  "titre": "Tests initiaux :",
  "sous_etapes": [
    "Vérifier toutes les connexions électriques",
    "Tester les freins avec le système coupé",
    "Vérifier le bon fonctionnement du capteur PAS",
    "Tester l'assistance progressivement"
  ]
}
```

## Règles importantes

### ✅ À faire :

1. **Toujours inclure les deux clés** : Chaque objet doit avoir `titre` ET `sous_items` (ou `sous_etapes`)
2. **Utiliser des tableaux vides** : Si pas de sous-éléments, mettre `[]` et non `null`
3. **Titres avec ":"** : Les titres se terminant par ":" indiquent généralement qu'ils ont des sous-éléments
4. **Items sans sous-éléments** : Utilisez `"sous_items": []` ou `"sous_etapes": []`

### ❌ À éviter :

1. ❌ Mélanger strings et objets dans une même liste
2. ❌ Omettre une des clés (`titre` ou `sous_items`/`sous_etapes`)
3. ❌ Utiliser `null` au lieu de `[]`

## Rendu HTML

### Sections textuelles :
- **Avec sous_items** : `Titre:<ul><li>item1</li><li>item2</li></ul>`
- **Sans sous_items** : `Titre`

### Étapes :
- **Avec sous_etapes** : `<li>Titre:<ul><li>sous-étape1</li><li>sous-étape2</li></ul></li>`
- **Sans sous_etapes** : `<li>Titre</li>`
- **Les titres ne sont PAS en gras** (pas de balise `<strong>`)

## Exemple complet

```json
{
  "vélo": {
    "titre": ["Vélo à assistance électrique"],
    "matériaux": [
      {
        "titre": "Moteur + roue de hoverboard 6\" : 36v",
        "sous_items": []
      },
      {
        "titre": "2 options en fonction du boitier de pédalier du vélo :",
        "sous_items": [
          "à axes carrés (\"universel\"): ~8€",
          "à axes carrés dernières générations (\"intégré\") : ~8€"
        ]
      }
    ],
    "étapes": [
      {
        "numero": 1,
        "titre": "Démontage Hoverboard",
        "solutions": [
          {
            "objectif": "",
            "materiaux_outils": [],
            "etapes": [
              {
                "titre": "Enlever la coque plastique.",
                "sous_etapes": []
              },
              {
                "titre": "Brancher dans l'ordre :",
                "sous_etapes": [
                  "Le capteur PAS",
                  "Les trois lignes d'alimentation"
                ]
              }
            ],
            "remarques": [],
            "images": []
          }
        ]
      }
    ]
  }
}
```

## Automatisation future

Cette structure cohérente facilite :
- ✅ La validation automatique du JSON
- ✅ La transformation automatique en HTML/PDF
- ✅ L'extraction et la réorganisation du contenu
- ✅ La génération de documentation
- ✅ L'intégration avec d'autres systèmes
