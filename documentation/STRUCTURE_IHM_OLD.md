# IHM / Interface Homme-Machine (Frontend)

Ce répertoire contient l'ensemble du code frontend (l'Interface Homme-Machine) du projet **MakerLens**. Il s'agit du prototype web développé durant le premier sprint pour valider les fonctionnalités clés de l'interface utilisateur.

## Aperçu

L'IHM est conçue pour être l'unique point d'interaction de l'utilisateur avec la plateforme. Elle assure la **responsivité** et le respect du **design technique moderne** défini pour le projet.

## Contenu du Dossier

Voici les fichiers et dossiers composant cette interface :

| Fichier / Dossier | Rôle | Description Détaillée |
| :--- | :--- | :--- |
| **`index.html`** | **Page Principale** | Le point d'entrée du site. Contient la structure HTML de la page d'accueil (choix du mode : Création, Recyclage, Navigation) et des pages de résultats/tutoriels. |
| **`about.html`** | **Page À Propos** | Contient les informations contextuelles, la vision et la mission du projet MakerLens. |
| **`styles.css`** | **Feuilles de Style** | Définit l'intégralité du style visuel (couleurs, polices, mise en page) en utilisant les variables CSS pour le thème **Vert (#00DB21)** et **Marron (#502800)**. |
| **`app.js`** | **Logique Frontend** | Contient le **JavaScript vanilla** pour gérer les interactions utilisateur : navigation entre les pages (vues), gestion des formulaires, affichage des tutoriels et des notifications (toasts). |
| **`images/`** | **Ressources Graphiques** | Contient le logo (`logo-no-text.png`), les icônes et les autres ressources visuelles utilisées par le frontend. |

## Conception Responsive (Ordinateur et Téléphone)

L'Interface Homme-Machine (IHM) a été développée dès le départ avec une approche **"mobile-first"** pour assurer une expérience utilisateur optimale quel que soit l'appareil utilisé.

### Sur Grand Écran (Ordinateur/Tablette)

La mise en page utilise l'espace disponible pour afficher les contenus et les outils de navigation côte à côte. 

### Sur Petit Écran (Téléphone)

L'interface bascule vers une structure **mono-colonne** et adapte la taille des éléments (boutons, cartes) pour garantir la **facilité d'utilisation** avec le pouce. La navigation est simplifiée pour offrir un accès clair et direct aux fonctionnalités principales (Création, Recyclage, Navigation).

Cette approche garantit que l'interface est toujours **utilisable, esthétique et performante**, qu'elle soit consultée sur un écran large d'ordinateur ou un petit écran de smartphone.

## Démarrage du Prototype

Pour visualiser et tester l'Interface Homme-Machine localement :

1.  **Naviguez** dans ce dossier `IHM/`.
2.  Ouvrez le fichier **`index.html`** directement dans votre navigateur web préféré (Chrome, Firefox, Edge...).

Aucun serveur web n'est nécessaire pour le fonctionnement initial, puisque le frontend utilise du JavaScript  et une base de données JSON hardcodée pour les démonstrations.

## Technologies Utilisées

* **Structure** : HTML
* **Style** : CSS (avec variables pour le thème)
* **Interactions** : JavaScript 
* **Typographie** : Space Grotesk et Roboto Mono
