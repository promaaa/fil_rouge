# MakerLens

**Plateforme web pour transformer vos idées et objets en projets maker concrets**

## Concept

MakerLens est la plateforme conçue pour aider la communauté des makers à :

  - **Créer** : Générer des tutoriels pour fabriquer de nouveaux objets.
  - **Recycler** : Trouver comment réutiliser des objets existants (upcycling).
  - **Naviguer** : Découvrir des tutoriels tendance de la communauté.

-----

## Structure des Dossiers

Chaque dossier principal est accompagné d'un fichier **`STRUCTURE.md`** adapté, détaillant son contenu et les instructions d'utilisation spécifiques.

```
fil_rouge/
├── donnees/                          # Base de données temporaire (Format JSON)
├── interface_navigation_images/      # Premier prototype fonctionnel du site
├── interface_utilisateur/            # Interface web (HTML/CSS/JS)
└── script_recuperation/              # Algorithme de récupération des tutoriels
```

### Détail des Sous-Dossiers

  
  * **`donnees/`**

    > Sur ce dossier, vous trouverez le travail sur la mise en forme de la base de données en format **JSON**. Par souci de visibilité, ce dossier sera sûrement amené à disparaître dans la version finale du projet, mais la documentation sur la méthodologie apparaitra toujours.

  * **`interface_navigation_images/`**

    > Sur ce dossier, vous trouverez le **premier prototype fonctionnel** de notre site web avec la fusion de notre base de données et l'IHM que nous avons effectué au premier sprint.
    
  * **`interface_utilisateur/`** (Interface Homme-Machine)

    > Ce dossier contient l'ensemble du **code front-end** avec **HTML**, **JavaScript** et **CSS** pour un visuel optimisé pour ordinateur et téléphone.


  * **`script_recuperation/`**

    > Vous y trouverez l'algorithme qui récupère les fichiers **HTML** des différents sites de tutoriel que nous avons trouvés.

-----

## Design

  - **Style** : Blueprint technique moderne.
  - **Couleurs** : **Vert** (`#00DB21`) et **Marron** (`#502800`).
  - **Interface** : Responsive avec animations fluides.

-----

## Démarrage

1.  Cloner le repository.
2.  Ouvrir `IHM/index.html` (ou l'équivalent dans `IHM/`) dans un navigateur.
3.  Choisir un mode (Création, Recyclage ou Navigation).

-----

## Technologies

  - **Frontend** : **HTML**, **CSS**, **JavaScript**.
  - Logo personnalisé intégré.
  - **Base de données** : Tutoriels en **JSON**.

-----

## Licence

Voir le fichier **`LICENSE`** pour les détails.