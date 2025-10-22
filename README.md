# 🌍 Scraping-part

Ce projet Python permet d’extraire automatiquement les **tutoriels low-tech** des sites sélectionnés au préalable 
Il télécharge pour chaque page :
- le **code HTML** complet du tutoriel,
- toutes les **images associées**.

---

## 🧠 Objectif
L’objectif du projet est de créer une **base de connaissances locale** de tutoriels low-tech utilisables hors ligne et exploitables par la future plateforme **Maker-Lens**.

---

## ⚙️ Fonctionnalités

✅ Téléchargement automatique des pages listées dans un fichier texte  
✅ Conversion des liens `/wiki/...` en URLs complètes  
✅ Sauvegarde du contenu HTML dans le dossier `pages/`  
✅ Téléchargement des images de chaque page dans `images/<nom_du_tuto>/`  
✅ Gestion automatique des erreurs réseau et des caractères spéciaux dans les noms de fichiers  



