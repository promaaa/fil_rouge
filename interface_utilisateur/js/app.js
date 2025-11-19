const home = document.getElementById("home");
const pages = document.querySelectorAll(".page");
const reveals = document.querySelectorAll(".reveal");

// Animation d'apparition progressive lors du scroll
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  },
);

reveals.forEach((el) => revealObserver.observe(el));

// Fonction pour afficher une notification toast
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      ${
        type === "success"
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
      }
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function changeGridColor(target) {
  const cover = document.querySelector(".backdrop-cover");
  cover.style.backgroundColor = "black";

  setTimeout(() => {
    cover.style.backgroundColor = "transparent";
    document.documentElement.style.setProperty(
      "--line-color",
      `var(--${target}-line-color)`,
    );
    document.documentElement.style.setProperty(
      "--accent-primary",
      `var(--${target}-color)`,
    );
  }, 100);
}

// Navigation depuis l'accueil vers les différentes pages
document.querySelectorAll(".home .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.page;
    home.style.display = "none";
    document.getElementById(target).classList.add("active");

    // Ajouter à l'historique
    history.pushState({ page: target }, "", `#${target}`);
    console.log("Moving to page:", target);

    changeGridColor(target);
  });
});

// Boutons retour
document.querySelectorAll(".back-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    goToHome();
    changeGridColor("default");
  });
});

// Fonction pour retourner à l'accueil
function goToHome() {
  pages.forEach((p) => p.classList.remove("active"));
  home.style.display = "flex";

  // Mettre à jour l'historique
  history.pushState({ page: "home" }, "", "#home");
}

// Gérer le bouton retour du navigateur
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.page) {
    if (event.state.page === "home") {
      pages.forEach((p) => p.classList.remove("active"));
      home.style.display = "flex";
    } else {
      home.style.display = "none";
      pages.forEach((p) => p.classList.remove("active"));
      document.getElementById(event.state.page).classList.add("active");
    }
  } else {
    // Si pas d'état, retourner à l'accueil
    pages.forEach((p) => p.classList.remove("active"));
    home.style.display = "flex";
  }
});

// Initialiser l'état de l'historique
history.replaceState({ page: "home" }, "", "#home");

// ===== BASE DE DONNÉES HARD-CODÉE =====

// Tutoriels de création
const creationTutorials = {
  "lampe design": {
    titre: "Lampe de Bureau Design",
    difficulté: "Débutant",
    temps: "2-3 heures",
    materiaux: [
      "Douille E27",
      "Câble électrique",
      "Ampoule LED",
      "Bois de palette",
      "Interrupteur",
      "Vis et colle",
    ],
    outils: ["Scie", "Perceuse", "Tournevis", "Papier de verre"],
    etapes: [
      "Découper le bois aux dimensions souhaitées (base 15x15cm, bras 40cm)",
      "Poncer toutes les surfaces pour un aspect lisse",
      "Percer un trou pour passer le câble électrique",
      "Fixer la douille E27 au sommet du bras",
      "Assembler la base et le bras avec vis et colle",
      "Passer le câble et connecter l'interrupteur",
      "Tester la connexion électrique",
      "Appliquer une finition (vernis, peinture) si désiré",
    ],
    conseils: [
      "Toujours débrancher avant de manipuler",
      "Respecter les normes électriques",
      "Utiliser une ampoule LED pour économie d'énergie",
    ],
    cout: "15-25€",
  },
  lampe: {
    titre: "Lampe de Bureau Design",
    difficulté: "Débutant",
    temps: "2-3 heures",
    materiaux: [
      "Douille E27",
      "Câble électrique",
      "Ampoule LED",
      "Bois de palette",
      "Interrupteur",
      "Vis et colle",
    ],
    outils: ["Scie", "Perceuse", "Tournevis", "Papier de verre"],
    etapes: [
      "Découper le bois aux dimensions souhaitées (base 15x15cm, bras 40cm)",
      "Poncer toutes les surfaces pour un aspect lisse",
      "Percer un trou pour passer le câble électrique",
      "Fixer la douille E27 au sommet du bras",
      "Assembler la base et le bras avec vis et colle",
      "Passer le câble et connecter l'interrupteur",
      "Tester la connexion électrique",
      "Appliquer une finition (vernis, peinture) si désiré",
    ],
    conseils: [
      "Toujours débrancher avant de manipuler",
      "Respecter les normes électriques",
      "Utiliser une ampoule LED pour économie d'énergie",
    ],
    cout: "15-25€",
  },
  "enceinte bluetooth": {
    titre: "Enceinte Bluetooth DIY",
    difficulté: "Intermédiaire",
    temps: "4-5 heures",
    materiaux: [
      "Module Bluetooth PAM8403",
      "Haut-parleur 5W (x2)",
      "Batterie Li-ion 18650",
      "Module de charge TP4056",
      "Interrupteur",
      "Boîtier en bois",
    ],
    outils: ["Fer à souder", "Perceuse", "Scie", "Multimètre", "Colle à bois"],
    etapes: [
      "Découper le boîtier selon les dimensions des haut-parleurs",
      "Percer les trous pour les haut-parleurs et l'interrupteur",
      "Souder le module Bluetooth aux haut-parleurs",
      "Connecter la batterie au module de charge",
      "Assembler tous les composants électroniques",
      "Fixer les haut-parleurs dans le boîtier",
      "Tester le système audio",
      "Fermer et finaliser le boîtier",
    ],
    conseils: [
      "Vérifier la polarité des connexions",
      "Tester chaque composant avant assemblage",
      "Prévoir des évents pour le son",
    ],
    cout: "30-45€",
  },
  enceinte: {
    titre: "Enceinte Bluetooth DIY",
    difficulté: "Intermédiaire",
    temps: "4-5 heures",
    materiaux: [
      "Module Bluetooth PAM8403",
      "Haut-parleur 5W (x2)",
      "Batterie Li-ion 18650",
      "Module de charge TP4056",
      "Interrupteur",
      "Boîtier en bois",
    ],
    outils: ["Fer à souder", "Perceuse", "Scie", "Multimètre", "Colle à bois"],
    etapes: [
      "Découper le boîtier selon les dimensions des haut-parleurs",
      "Percer les trous pour les haut-parleurs et l'interrupteur",
      "Souder le module Bluetooth aux haut-parleurs",
      "Connecter la batterie au module de charge",
      "Assembler tous les composants électroniques",
      "Fixer les haut-parleurs dans le boîtier",
      "Tester le système audio",
      "Fermer et finaliser le boîtier",
    ],
    conseils: [
      "Vérifier la polarité des connexions",
      "Tester chaque composant avant assemblage",
      "Prévoir des évents pour le son",
    ],
    cout: "30-45€",
  },
  "chargeur solaire": {
    titre: "Chargeur Solaire Portable",
    difficulté: "Intermédiaire",
    temps: "3-4 heures",
    materiaux: [
      "Panneau solaire 5V 2W",
      "Module de charge solaire",
      "Batterie 18650 (x2)",
      "Support de batterie",
      "Port USB de sortie",
      "Boîtier étanche",
    ],
    outils: ["Fer à souder", "Multimètre", "Perceuse", "Colle époxy"],
    etapes: [
      "Tester le panneau solaire en plein soleil",
      "Préparer le boîtier avec trous pour USB et panneau",
      "Souder le panneau au module de charge",
      "Connecter les batteries au module",
      "Installer le port USB de sortie",
      "Fixer tous les composants dans le boîtier",
      "Tester la charge et la décharge",
      "Sceller le boîtier pour l'étanchéité",
    ],
    conseils: [
      "Utiliser des batteries de qualité",
      "Protéger contre les surcharges",
      "Tester par temps ensoleillé",
    ],
    cout: "25-35€",
  },
  chargeur: {
    titre: "Chargeur Solaire Portable",
    difficulté: "Intermédiaire",
    temps: "3-4 heures",
    materiaux: [
      "Panneau solaire 5V 2W",
      "Module de charge solaire",
      "Batterie 18650 (x2)",
      "Support de batterie",
      "Port USB de sortie",
      "Boîtier étanche",
    ],
    outils: ["Fer à souder", "Multimètre", "Perceuse", "Colle époxy"],
    etapes: [
      "Tester le panneau solaire en plein soleil",
      "Préparer le boîtier avec trous pour USB et panneau",
      "Souder le panneau au module de charge",
      "Connecter les batteries au module",
      "Installer le port USB de sortie",
      "Fixer tous les composants dans le boîtier",
      "Tester la charge et la décharge",
      "Sceller le boîtier pour l'étanchéité",
    ],
    conseils: [
      "Utiliser des batteries de qualité",
      "Protéger contre les surcharges",
      "Tester par temps ensoleillé",
    ],
    cout: "25-35€",
  },
  "station météo": {
    titre: "Station Météo Connectée",
    difficulté: "Intermédiaire",
    temps: "5-6 heures",
    materiaux: [
      "Arduino/ESP32",
      "Capteur DHT22 (température/humidité)",
      "Capteur BMP180 (pression)",
      "Écran LCD 16x2",
      "Boîtier étanche",
      "Alimentation 5V",
    ],
    outils: ["Fer à souder", "Tournevis", "Ordinateur pour programmation"],
    etapes: [
      "Connecter le capteur DHT22 aux pins de l'Arduino",
      "Brancher le capteur BMP180 via I2C",
      "Connecter l'écran LCD",
      "Télécharger et installer les bibliothèques nécessaires",
      "Programmer l'Arduino avec le code de lecture des capteurs",
      "Tester l'affichage des données",
      "Monter le tout dans un boîtier étanche",
      "Installer à l'extérieur et alimenter",
    ],
    conseils: [
      "Protéger les capteurs de la pluie directe",
      "Calibrer les capteurs avant installation",
      "Prévoir une ventilation pour mesures précises",
    ],
    cout: "35-50€",
  },
  horloge: {
    titre: "Horloge LED Personnalisée",
    difficulté: "Intermédiaire",
    temps: "4-5 heures",
    materiaux: [
      "Arduino Nano",
      "Module RTC DS3231",
      "Matrice LED 8x32",
      "Alimentation 5V",
      "Boîtier acrylique",
      "Boutons poussoirs (x3)",
    ],
    outils: ["Fer à souder", "Colle", "Ordinateur"],
    etapes: [
      "Connecter le module RTC à l'Arduino",
      "Câbler la matrice LED",
      "Installer les boutons pour réglage",
      "Programmer l'affichage de l'heure",
      "Ajouter des animations personnalisées",
      "Assembler dans le boîtier",
      "Régler l'heure et tester",
      "Finaliser avec le boîtier acrylique",
    ],
    conseils: [
      "Utiliser un module RTC avec pile pour garder l'heure",
      "Régler la luminosité selon l'environnement",
      "Prévoir animations pour réveil",
    ],
    cout: "25-40€",
  },
  "support téléphone": {
    titre: "Support de Téléphone Ajustable",
    difficulté: "Débutant",
    temps: "1-2 heures",
    materiaux: [
      "Contreplaqué 5mm",
      "Charnière métallique",
      "Feutrine adhésive",
      "Vis",
      "Vernis",
    ],
    outils: ["Scie sauteuse", "Perceuse", "Papier de verre", "Pinceau"],
    etapes: [
      "Découper la base (12x8cm) et le support (10x15cm)",
      "Poncer tous les bords",
      "Percer les trous pour la charnière",
      "Fixer la charnière entre base et support",
      "Coller la feutrine sur les surfaces de contact",
      "Appliquer 2 couches de vernis",
      "Laisser sécher 24h",
      "Tester la stabilité avec différents téléphones",
    ],
    conseils: [
      "Ajuster l'angle pour un confort optimal",
      "La feutrine protège le téléphone",
      "Possibilité d'ajouter un passe-câble",
    ],
    cout: "8-15€",
  },
  "mangeoire oiseaux": {
    titre: "Mangeoire à Oiseaux Intelligente",
    difficulté: "Débutant",
    temps: "2-3 heures",
    materiaux: [
      "Bois de cèdre",
      "Plexiglas transparent",
      "Vis inox",
      "Crochet de suspension",
      "Huile de lin",
    ],
    outils: ["Scie", "Perceuse", "Papier de verre", "Chiffon"],
    etapes: [
      "Découper les planches : toit (20x20cm), base (18x18cm), côtés (15x15cm)",
      "Percer un trou de 4cm de diamètre pour l'accès",
      "Assembler la structure avec vis inox",
      "Fixer le plexiglas pour voir le niveau de graines",
      "Installer le toit incliné pour l'écoulement de l'eau",
      "Appliquer l'huile de lin pour protection",
      "Fixer le crochet de suspension",
      "Remplir de graines et suspendre",
    ],
    conseils: [
      "Nettoyer régulièrement",
      "Placer à l'abri des prédateurs",
      "Bois de cèdre résiste aux intempéries",
    ],
    cout: "12-20€",
  },
  "pot fleur": {
    titre: "Pot de Fleurs Auto-Arrosant",
    difficulté: "Débutant",
    temps: "1-2 heures",
    materiaux: [
      "Deux pots en plastique (grand et petit)",
      "Mèche en coton",
      "Terreau",
      "Gravier",
    ],
    outils: ["Perceuse", "Ciseaux", "Cutter"],
    etapes: [
      "Percer un trou au centre du petit pot",
      "Passer la mèche en coton par le trou",
      "Placer le petit pot dans le grand",
      "Mettre du gravier au fond du petit pot",
      "Ajouter le terreau et la plante",
      "Remplir le grand pot d'eau (réservoir)",
      "L'eau monte par capillarité via la mèche",
      "Recharger le réservoir toutes les semaines",
    ],
    conseils: [
      "La mèche doit toucher le fond du réservoir",
      "Adapter la taille selon la plante",
      "Idéal pour les vacances",
    ],
    cout: "5-10€",
  },
  "organisateur bureau": {
    titre: "Organisateur de Bureau Modulaire",
    difficulté: "Débutant",
    temps: "2-3 heures",
    materiaux: [
      "Bois de palette",
      "Petites boîtes/pots en verre",
      "Colle à bois",
      "Peinture acrylique",
      "Vernis",
    ],
    outils: ["Scie", "Papier de verre", "Pinceau", "Colle"],
    etapes: [
      "Découper une planche de base (40x20cm)",
      "Créer des séparateurs verticaux (10x15cm)",
      "Poncer toutes les pièces",
      "Assembler la structure avec colle",
      "Peindre aux couleurs souhaitées",
      "Fixer les pots en verre pour petites fournitures",
      "Appliquer le vernis de finition",
      "Laisser sécher et organiser le bureau",
    ],
    conseils: [
      "Personnaliser les compartiments selon besoins",
      "Ajouter des aimants pour trombones",
      "Possibilité d'empiler plusieurs niveaux",
    ],
    cout: "10-18€",
  },
  etagere: {
    titre: "Étagère Murale en Bois",
    difficulté: "Débutant",
    temps: "2-4 heures",
    materiaux: [
      "Planches de bois (pin ou chêne)",
      "Équerres métalliques",
      "Vis et chevilles",
      "Lasure ou peinture",
    ],
    outils: ["Scie", "Niveau à bulle", "Perceuse", "Papier de verre", "Mètre"],
    etapes: [
      "Mesurer et découper les planches (longueur au choix)",
      "Poncer les planches pour un rendu lisse",
      "Appliquer la lasure ou peinture (2 couches)",
      "Marquer l'emplacement mural avec niveau",
      "Percer et installer les chevilles",
      "Fixer les équerres au mur",
      "Poser et visser les planches sur les équerres",
      "Vérifier la solidité",
    ],
    conseils: [
      "Utiliser un détecteur de montants",
      "Espacer les équerres tous les 40-50cm",
      "Vérifier l'horizontalité",
    ],
    cout: "20-35€",
  },
  terrarium: {
    titre: "Terrarium Fermé Auto-Suffisant",
    difficulté: "Débutant",
    temps: "1-2 heures",
    materiaux: [
      "Grand bocal en verre",
      "Gravier",
      "Charbon actif",
      "Terreau",
      "Plantes tropicales miniatures",
      "Mousse",
    ],
    outils: ["Cuillère à long manche", "Vaporisateur", "Gants"],
    etapes: [
      "Nettoyer le bocal à fond",
      "Mettre 3cm de gravier pour drainage",
      "Ajouter 1cm de charbon actif (filtre l'eau)",
      "Déposer 5-7cm de terreau",
      "Planter les végétaux avec la cuillère",
      "Ajouter la mousse décorative",
      "Vaporiser légèrement",
      "Fermer et placer à lumière indirecte",
    ],
    conseils: [
      "Ne pas trop arroser au début",
      "Ouvrir 1x/mois pour aération",
      "Choisir plantes aimant l'humidité",
    ],
    cout: "15-30€",
  },
  miroir: {
    titre: "Miroir Lumineux LED",
    difficulté: "Intermédiaire",
    temps: "3-4 heures",
    materiaux: [
      "Miroir",
      "Bande LED blanc froid",
      "Cadre en bois",
      "Alimentation 12V",
      "Variateur d'intensité",
      "Câbles",
    ],
    outils: ["Scie", "Perceuse", "Fer à souder", "Colle"],
    etapes: [
      "Mesurer et découper le cadre aux dimensions du miroir",
      "Créer une rainure pour les LED à l'arrière",
      "Coller la bande LED dans la rainure",
      "Souder le variateur sur le circuit",
      "Connecter l'alimentation",
      "Fixer le miroir sur le cadre",
      "Tester l'éclairage",
      "Fixer le système de suspension",
    ],
    conseils: [
      "LED blanc froid = meilleur rendu des couleurs",
      "Positionner LED pour éviter reflets directs",
      "Étanchéifier si usage salle de bain",
    ],
    cout: "35-55€",
  },
  robot: {
    titre: "Robot Éviteur d'Obstacles",
    difficulté: "Avancé",
    temps: "6-8 heures",
    materiaux: [
      "Arduino Uno",
      "Châssis robot 2 roues",
      "Moteurs DC (x2)",
      "Driver moteur L298N",
      "Capteur ultrason HC-SR04",
      "Batterie 9V",
      "Roue folle",
    ],
    outils: ["Fer à souder", "Tournevis", "Ordinateur", "Multimètre"],
    etapes: [
      "Assembler le châssis et fixer les moteurs",
      "Monter la roue folle à l'avant",
      "Connecter le driver moteur à l'Arduino",
      "Câbler les moteurs au driver",
      "Installer le capteur ultrason à l'avant",
      "Programmer la logique d'évitement",
      "Connecter la batterie",
      "Tester et ajuster les paramètres",
    ],
    conseils: [
      "Commencer par tester chaque module séparément",
      "Ajuster la sensibilité du capteur",
      "Prévoir interrupteur marche/arrêt",
    ],
    cout: "40-60€",
  },
  "console retro": {
    titre: "Console Rétro-Gaming Portable",
    difficulté: "Avancé",
    temps: "8-10 heures",
    materiaux: [
      "Raspberry Pi Zero",
      'Écran LCD 3.5"',
      "Batterie Li-Po 2000mAh",
      "Boutons arcade",
      "Joystick",
      "Haut-parleur",
      "Carte microSD 32GB",
    ],
    outils: [
      "Fer à souder",
      "Imprimante 3D (boîtier)",
      "Tournevis",
      "Ordinateur",
    ],
    etapes: [
      "Installer RetroPie sur la carte SD",
      "Imprimer le boîtier en 3D",
      "Souder les boutons sur GPIO du Raspberry",
      "Connecter l'écran LCD",
      "Installer le système audio",
      "Configurer la batterie et charge",
      "Assembler tous les composants dans le boîtier",
      "Configurer les émulateurs et tester",
    ],
    conseils: [
      "Respecter les droits des ROMs",
      "Prévoir ventilation pour le Pi",
      "Batterie: 4-6h d'autonomie",
    ],
    cout: "80-120€",
  },
  drone: {
    titre: "Mini-Drone FPV DIY",
    difficulté: "Avancé",
    temps: "10-15 heures",
    materiaux: [
      "Châssis drone 250mm",
      "Contrôleur de vol F4",
      "Moteurs brushless (x4)",
      "ESC 30A (x4)",
      "Hélices",
      "Batterie LiPo 3S",
      "Caméra FPV",
      "Émetteur VTX",
    ],
    outils: [
      "Fer à souder",
      "Pince coupante",
      "Tournevis",
      "Ordinateur",
      "Radiocommande",
    ],
    etapes: [
      "Assembler le châssis en fibre de carbone",
      "Fixer les moteurs aux bras",
      "Souder les ESC aux moteurs et à la platine",
      "Installer le contrôleur de vol au centre",
      "Monter la caméra et l'émetteur VTX",
      "Connecter la batterie avec alarme",
      "Configurer le firmware (Betaflight)",
      "Calibrer et tester progressivement",
    ],
    conseils: [
      "Commencer en mode stabilisé",
      "S'entraîner sur simulateur d'abord",
      "Respecter réglementation aérienne",
    ],
    cout: "150-250€",
  },
  "cadre photo": {
    titre: "Cadre Photo Numérique WiFi",
    difficulté: "Intermédiaire",
    temps: "4-5 heures",
    materiaux: [
      "Raspberry Pi Zero W",
      'Écran LCD 7"',
      "Cadre photo",
      "Alimentation micro-USB",
      "Carte microSD",
    ],
    outils: ["Tournevis", "Cutter", "Colle", "Ordinateur"],
    etapes: [
      "Installer Raspberry Pi OS Lite sur SD",
      "Configurer le WiFi",
      "Installer un logiciel de diaporama (feh, Slideshow)",
      "Connecter l'écran au Raspberry",
      "Synchroniser avec cloud photo (Google Photos, etc)",
      "Adapter le cadre pour intégrer l'écran",
      "Configurer le démarrage automatique",
      "Masquer tous les câbles",
    ],
    conseils: [
      "Mode diaporama avec transitions",
      "Mise à jour auto des photos",
      "Économie énergie: éteindre la nuit",
    ],
    cout: "60-90€",
  },
  "serrure connectée": {
    titre: "Serrure Connectée Biométrique",
    difficulté: "Avancé",
    temps: "6-8 heures",
    materiaux: [
      "Arduino Mega",
      "Capteur d'empreinte digitale",
      "Serrure électrique",
      "Module WiFi ESP8266",
      "Écran OLED",
      "Alimentation 12V",
      "Relais 5V",
    ],
    outils: ["Fer à souder", "Tournevis", "Perceuse", "Multimètre"],
    etapes: [
      "Installer la serrure électrique sur la porte",
      "Connecter le capteur d'empreinte à l'Arduino",
      "Câbler le relais pour contrôler la serrure",
      "Ajouter le module WiFi pour contrôle distant",
      "Programmer la gestion des empreintes",
      "Installer l'écran OLED pour feedback",
      "Créer un boîtier de protection",
      "Enregistrer les empreintes autorisées",
    ],
    conseils: [
      "Prévoir alimentation de secours",
      "Chiffrer communications WiFi",
      "Garder clé mécanique de secours",
    ],
    cout: "70-110€",
  },
  "arrosage automatique": {
    titre: "Système d'Arrosage Automatique",
    difficulté: "Intermédiaire",
    temps: "4-6 heures",
    materiaux: [
      "Arduino Uno",
      "Pompe à eau 12V",
      "Capteur d'humidité sol",
      "Relais",
      "Tuyau et goutteurs",
      "Réservoir d'eau",
      "Alimentation",
    ],
    outils: ["Fer à souder", "Tournevis", "Pince", "Cutter"],
    etapes: [
      "Connecter le capteur d'humidité à l'Arduino",
      "Câbler la pompe via le relais",
      "Installer le réservoir d'eau surélevé",
      "Disposer le tuyau avec goutteurs près des plantes",
      "Programmer la logique d'arrosage",
      "Définir seuils d'humidité",
      "Tester le système",
      "Ajouter panneau solaire (optionnel)",
    ],
    conseils: [
      "Calibrer capteur humidité selon type de sol",
      "Arrosage tôt matin pour éviter évaporation",
      "Surveiller niveau réservoir",
    ],
    cout: "35-55€",
  },
};

// Tutoriels de recyclage
const recyclageTutorials = {
  "vieux téléphone": {
    titre: "Recyclage de Smartphone",
    difficulté: "Avancé",
    objets_possibles: [
      "Webcam WiFi",
      "Cadre photo numérique",
      "Dashcam auto",
      "Télécommande domotique",
    ],
    composants_recuperables: [
      "Écran LCD",
      "Caméra",
      "Batterie",
      "Haut-parleur",
      "Vibreur",
      "Capteurs divers",
    ],
    projet_principal: {
      nom: "Webcam de Surveillance WiFi",
      etapes: [
        "Installer une application de surveillance (IP Webcam, Alfred)",
        "Configurer la connexion WiFi du téléphone",
        "Positionner le téléphone avec vue optimale",
        "Connecter à un chargeur permanent",
        "Configurer l'enregistrement sur cloud ou serveur local",
        "Tester la détection de mouvement",
        "Créer un support mural adapté",
      ],
      avantages: [
        "Réutilisation complète",
        "Pas d'achat nécessaire",
        "Fonctionnalités avancées gratuites",
      ],
      temps: "1-2 heures",
    },
    impact_eco: "Évite 150kg de CO2 (fabrication nouveau téléphone)",
    economie: "50-150€",
  },
  téléphone: {
    titre: "Recyclage de Smartphone",
    difficulté: "Avancé",
    objets_possibles: [
      "Webcam WiFi",
      "Cadre photo numérique",
      "Dashcam auto",
      "Télécommande domotique",
    ],
    composants_recuperables: [
      "Écran LCD",
      "Caméra",
      "Batterie",
      "Haut-parleur",
      "Vibreur",
      "Capteurs divers",
    ],
    projet_principal: {
      nom: "Webcam de Surveillance WiFi",
      etapes: [
        "Installer une application de surveillance (IP Webcam, Alfred)",
        "Configurer la connexion WiFi du téléphone",
        "Positionner le téléphone avec vue optimale",
        "Connecter à un chargeur permanent",
        "Configurer l'enregistrement sur cloud ou serveur local",
        "Tester la détection de mouvement",
        "Créer un support mural adapté",
      ],
      avantages: [
        "Réutilisation complète",
        "Pas d'achat nécessaire",
        "Fonctionnalités avancées gratuites",
      ],
      temps: "1-2 heures",
    },
    impact_eco: "Évite 150kg de CO2 (fabrication nouveau téléphone)",
    economie: "50-150€",
  },
  "vieux telephone": {
    titre: "Recyclage de Smartphone",
    difficulté: "Avancé",
    objets_possibles: [
      "Webcam WiFi",
      "Cadre photo numérique",
      "Dashcam auto",
      "Télécommande domotique",
    ],
    composants_recuperables: [
      "Écran LCD",
      "Caméra",
      "Batterie",
      "Haut-parleur",
      "Vibreur",
      "Capteurs divers",
    ],
    projet_principal: {
      nom: "Webcam de Surveillance WiFi",
      etapes: [
        "Installer une application de surveillance (IP Webcam, Alfred)",
        "Configurer la connexion WiFi du téléphone",
        "Positionner le téléphone avec vue optimale",
        "Connecter à un chargeur permanent",
        "Configurer l'enregistrement sur cloud ou serveur local",
        "Tester la détection de mouvement",
        "Créer un support mural adapté",
      ],
      avantages: [
        "Réutilisation complète",
        "Pas d'achat nécessaire",
        "Fonctionnalités avancées gratuites",
      ],
      temps: "1-2 heures",
    },
    impact_eco: "Évite 150kg de CO2 (fabrication nouveau téléphone)",
    economie: "50-150€",
  },
  telephone: {
    titre: "Recyclage de Smartphone",
    difficulté: "Avancé",
    objets_possibles: [
      "Webcam WiFi",
      "Cadre photo numérique",
      "Dashcam auto",
      "Télécommande domotique",
    ],
    composants_recuperables: [
      "Écran LCD",
      "Caméra",
      "Batterie",
      "Haut-parleur",
      "Vibreur",
      "Capteurs divers",
    ],
    projet_principal: {
      nom: "Webcam de Surveillance WiFi",
      etapes: [
        "Installer une application de surveillance (IP Webcam, Alfred)",
        "Configurer la connexion WiFi du téléphone",
        "Positionner le téléphone avec vue optimale",
        "Connecter à un chargeur permanent",
        "Configurer l'enregistrement sur cloud ou serveur local",
        "Tester la détection de mouvement",
        "Créer un support mural adapté",
      ],
      avantages: [
        "Réutilisation complète",
        "Pas d'achat nécessaire",
        "Fonctionnalités avancées gratuites",
      ],
      temps: "1-2 heures",
    },
    impact_eco: "Évite 150kg de CO2 (fabrication nouveau téléphone)",
    economie: "50-150€",
  },
  smartphone: {
    titre: "Recyclage de Smartphone",
    difficulté: "Avancé",
    objets_possibles: [
      "Webcam WiFi",
      "Cadre photo numérique",
      "Dashcam auto",
      "Télécommande domotique",
    ],
    composants_recuperables: [
      "Écran LCD",
      "Caméra",
      "Batterie",
      "Haut-parleur",
      "Vibreur",
      "Capteurs divers",
    ],
    projet_principal: {
      nom: "Webcam de Surveillance WiFi",
      etapes: [
        "Installer une application de surveillance (IP Webcam, Alfred)",
        "Configurer la connexion WiFi du téléphone",
        "Positionner le téléphone avec vue optimale",
        "Connecter à un chargeur permanent",
        "Configurer l'enregistrement sur cloud ou serveur local",
        "Tester la détection de mouvement",
        "Créer un support mural adapté",
      ],
      avantages: [
        "Réutilisation complète",
        "Pas d'achat nécessaire",
        "Fonctionnalités avancées gratuites",
      ],
      temps: "1-2 heures",
    },
    impact_eco: "Évite 150kg de CO2 (fabrication nouveau téléphone)",
    economie: "50-150€",
  },
  "bouteille plastique": {
    titre: "Recyclage de Bouteilles Plastique",
    difficulté: "Débutant",
    objets_possibles: [
      "Pot de fleurs",
      "Système d'irrigation goutte-à-goutte",
      "Mangeoire à oiseaux",
      "Rangement mural",
    ],
    composants_recuperables: [
      "Corps de bouteille",
      "Bouchon fileté",
      "Base stable",
    ],
    projet_principal: {
      nom: "Système d'Arrosage Automatique",
      etapes: [
        "Nettoyer soigneusement la bouteille",
        "Percer de petits trous (1-2mm) dans le bouchon",
        "Remplir la bouteille d'eau",
        "Visser le bouchon fermement",
        "Retourner et planter dans la terre près de la plante",
        "L'eau s'écoulera lentement pendant plusieurs jours",
        "Créer plusieurs unités pour un jardin complet",
      ],
      avantages: [
        "Économie d'eau",
        "Arrosage régulier",
        "Aucun coût",
        "Écologique",
      ],
      temps: "15-30 minutes",
    },
    impact_eco: "Évite pollution marine, réduit déchets plastiques",
    economie: "10-20€ (système d'arrosage commercial)",
  },
  bouteille: {
    titre: "Recyclage de Bouteilles Plastique",
    difficulté: "Débutant",
    objets_possibles: [
      "Pot de fleurs",
      "Système d'irrigation goutte-à-goutte",
      "Mangeoire à oiseaux",
      "Rangement mural",
    ],
    composants_recuperables: [
      "Corps de bouteille",
      "Bouchon fileté",
      "Base stable",
    ],
    projet_principal: {
      nom: "Système d'Arrosage Automatique",
      etapes: [
        "Nettoyer soigneusement la bouteille",
        "Percer de petits trous (1-2mm) dans le bouchon",
        "Remplir la bouteille d'eau",
        "Visser le bouchon fermement",
        "Retourner et planter dans la terre près de la plante",
        "L'eau s'écoulera lentement pendant plusieurs jours",
        "Créer plusieurs unités pour un jardin complet",
      ],
      avantages: [
        "Économie d'eau",
        "Arrosage régulier",
        "Aucun coût",
        "Écologique",
      ],
      temps: "15-30 minutes",
    },
    impact_eco: "Évite pollution marine, réduit déchets plastiques",
    economie: "10-20€ (système d'arrosage commercial)",
  },
  "ordinateur cassé": {
    titre: "Recyclage d'Ordinateur",
    difficulté: "Intermédiaire",
    objets_possibles: [
      "Serveur de fichiers",
      "Media center",
      "Console rétro-gaming",
      "Station météo",
    ],
    composants_recuperables: [
      "Disque dur",
      "RAM",
      "Ventilateurs",
      "Alimentation",
      "Boîtier",
      "Ports USB",
    ],
    projet_principal: {
      nom: "Serveur NAS Personnel",
      etapes: [
        "Récupérer le disque dur et tester sa santé",
        "Installer un OS léger (Ubuntu Server, OpenMediaVault)",
        "Configurer le partage réseau (Samba, NFS)",
        "Activer l'accès à distance sécurisé",
        "Mettre en place des sauvegardes automatiques",
        "Optimiser la consommation électrique",
        "Configurer l'accès depuis internet (optionnel)",
      ],
      avantages: [
        "Stockage cloud personnel",
        "Contrôle total des données",
        "Pas d'abonnement mensuel",
      ],
      temps: "3-5 heures",
    },
    impact_eco: "Évite e-waste toxique, prolonge durée de vie composants",
    economie: "100-300€ (NAS commercial)",
  },
  ordinateur: {
    titre: "Recyclage d'Ordinateur",
    difficulté: "Intermédiaire",
    objets_possibles: [
      "Serveur de fichiers",
      "Media center",
      "Console rétro-gaming",
      "Station météo",
    ],
    composants_recuperables: [
      "Disque dur",
      "RAM",
      "Ventilateurs",
      "Alimentation",
      "Boîtier",
      "Ports USB",
    ],
    projet_principal: {
      nom: "Serveur NAS Personnel",
      etapes: [
        "Récupérer le disque dur et tester sa santé",
        "Installer un OS léger (Ubuntu Server, OpenMediaVault)",
        "Configurer le partage réseau (Samba, NFS)",
        "Activer l'accès à distance sécurisé",
        "Mettre en place des sauvegardes automatiques",
        "Optimiser la consommation électrique",
        "Configurer l'accès depuis internet (optionnel)",
      ],
      avantages: [
        "Stockage cloud personnel",
        "Contrôle total des données",
        "Pas d'abonnement mensuel",
      ],
      temps: "3-5 heures",
    },
    impact_eco: "Évite e-waste toxique, prolonge durée de vie composants",
    economie: "100-300€ (NAS commercial)",
  },
  pc: {
    titre: "Recyclage d'Ordinateur",
    difficulté: "Intermédiaire",
    objets_possibles: [
      "Serveur de fichiers",
      "Media center",
      "Console rétro-gaming",
      "Station météo",
    ],
    composants_recuperables: [
      "Disque dur",
      "RAM",
      "Ventilateurs",
      "Alimentation",
      "Boîtier",
      "Ports USB",
    ],
    projet_principal: {
      nom: "Serveur NAS Personnel",
      etapes: [
        "Récupérer le disque dur et tester sa santé",
        "Installer un OS léger (Ubuntu Server, OpenMediaVault)",
        "Configurer le partage réseau (Samba, NFS)",
        "Activer l'accès à distance sécurisé",
        "Mettre en place des sauvegardes automatiques",
        "Optimiser la consommation électrique",
        "Configurer l'accès depuis internet (optionnel)",
      ],
      avantages: [
        "Stockage cloud personnel",
        "Contrôle total des données",
        "Pas d'abonnement mensuel",
      ],
      temps: "3-5 heures",
    },
    impact_eco: "Évite e-waste toxique, prolonge durée de vie composants",
    economie: "100-300€ (NAS commercial)",
  },
  "vieux cd": {
    titre: "Recyclage de CD/DVD",
    difficulté: "Débutant",
    objets_possibles: [
      "Attrape-soleil décoratif",
      "Sous-verres",
      "Mobile suspendu",
      "Épouvantail à oiseaux",
    ],
    composants_recuperables: [
      "Disque réfléchissant",
      "Trou central pour suspension",
    ],
    projet_principal: {
      nom: "Attrape-Soleil Mosaïque",
      etapes: [
        "Découper les CD en petits morceaux avec des ciseaux",
        "Préparer un support (cadre, pot, miroir)",
        "Appliquer de la colle forte sur le support",
        "Disposer les morceaux de CD en mosaïque",
        "Laisser sécher 24h",
        "Appliquer du joint à carrelage (optionnel)",
        "Nettoyer l'excès de joint",
        "Suspendre ou exposer près d'une fenêtre",
      ],
      avantages: [
        "Effet arc-en-ciel magnifique",
        "Décoration unique",
        "Repousse les oiseaux au jardin",
      ],
      temps: "2-3 heures",
    },
    impact_eco:
      "Évite mise en décharge de plastique polycarbonate non biodégradable",
    economie: "15-30€ (décoration équivalente)",
  },
  cd: {
    titre: "Recyclage de CD/DVD",
    difficulté: "Débutant",
    objets_possibles: [
      "Attrape-soleil décoratif",
      "Sous-verres",
      "Mobile suspendu",
      "Épouvantail à oiseaux",
    ],
    composants_recuperables: [
      "Disque réfléchissant",
      "Trou central pour suspension",
    ],
    projet_principal: {
      nom: "Attrape-Soleil Mosaïque",
      etapes: [
        "Découper les CD en petits morceaux avec des ciseaux",
        "Préparer un support (cadre, pot, miroir)",
        "Appliquer de la colle forte sur le support",
        "Disposer les morceaux de CD en mosaïque",
        "Laisser sécher 24h",
        "Appliquer du joint à carrelage (optionnel)",
        "Nettoyer l'excès de joint",
        "Suspendre ou exposer près d'une fenêtre",
      ],
      avantages: [
        "Effet arc-en-ciel magnifique",
        "Décoration unique",
        "Repousse les oiseaux au jardin",
      ],
      temps: "2-3 heures",
    },
    impact_eco:
      "Évite mise en décharge de plastique polycarbonate non biodégradable",
    economie: "15-30€ (décoration équivalente)",
  },
  "bocaux verre": {
    titre: "Recyclage de Bocaux en Verre",
    difficulté: "Débutant",
    objets_possibles: [
      "Lanternes décoratives",
      "Pots à épices",
      "Vases personnalisés",
      "Terrariums",
    ],
    composants_recuperables: [
      "Bocal transparent",
      "Couvercle fileté",
      "Verre robuste",
    ],
    projet_principal: {
      nom: "Lanternes LED Décoratives",
      etapes: [
        "Nettoyer et sécher le bocal",
        "Percer le couvercle pour passer câble LED",
        "Insérer guirlande LED dans le bocal",
        "Ajouter éléments décoratifs (sable, cailloux, branches)",
        "Passer le câble par le couvercle",
        "Visser le couvercle",
        "Brancher les LED",
        "Disposer comme décoration d'ambiance",
      ],
      avantages: [
        "Lumière tamisée agréable",
        "Personnalisable à l'infini",
        "Cadeau fait-main parfait",
      ],
      temps: "30-45 minutes",
    },
    impact_eco: "Évite production de verre neuf (1600°C, très énergivore)",
    economie: "10-25€ (lampe décorative)",
  },
  bocal: {
    titre: "Recyclage de Bocaux en Verre",
    difficulté: "Débutant",
    objets_possibles: [
      "Lanternes décoratives",
      "Pots à épices",
      "Vases personnalisés",
      "Terrariums",
    ],
    composants_recuperables: [
      "Bocal transparent",
      "Couvercle fileté",
      "Verre robuste",
    ],
    projet_principal: {
      nom: "Lanternes LED Décoratives",
      etapes: [
        "Nettoyer et sécher le bocal",
        "Percer le couvercle pour passer câble LED",
        "Insérer guirlande LED dans le bocal",
        "Ajouter éléments décoratifs (sable, cailloux, branches)",
        "Passer le câble par le couvercle",
        "Visser le couvercle",
        "Brancher les LED",
        "Disposer comme décoration d'ambiance",
      ],
      avantages: [
        "Lumière tamisée agréable",
        "Personnalisable à l'infini",
        "Cadeau fait-main parfait",
      ],
      temps: "30-45 minutes",
    },
    impact_eco: "Évite production de verre neuf (1600°C, très énergivore)",
    economie: "10-25€ (lampe décorative)",
  },
  "vieux jeans": {
    titre: "Recyclage de Jeans Usagés",
    difficulté: "Débutant",
    objets_possibles: [
      "Sac fourre-tout",
      "Tablier",
      "Pochettes",
      "Coussin décoratif",
    ],
    composants_recuperables: [
      "Tissu denim résistant",
      "Poches",
      "Ceinture",
      "Boutons",
    ],
    projet_principal: {
      nom: "Sac Fourre-Tout en Denim",
      etapes: [
        "Découper les jambes du jeans",
        "Coudre le bas pour fermer",
        "Utiliser la ceinture comme haut du sac",
        "Récupérer les poches et les coudre à l'extérieur",
        "Créer des anses avec du tissu ou sangles",
        "Coudre solidement les anses",
        "Renforcer les coutures avec surpiqûres",
        "Personnaliser avec patchs ou broderie (optionnel)",
      ],
      avantages: [
        "Tissu très résistant",
        "Poches déjà intégrées",
        "Style unique vintage",
      ],
      temps: "2-3 heures",
    },
    impact_eco: "Évite 10000L d'eau (fabrication nouveau jeans)",
    economie: "20-40€ (sac équivalent)",
  },
  jeans: {
    titre: "Recyclage de Jeans Usagés",
    difficulté: "Débutant",
    objets_possibles: [
      "Sac fourre-tout",
      "Tablier",
      "Pochettes",
      "Coussin décoratif",
    ],
    composants_recuperables: [
      "Tissu denim résistant",
      "Poches",
      "Ceinture",
      "Boutons",
    ],
    projet_principal: {
      nom: "Sac Fourre-Tout en Denim",
      etapes: [
        "Découper les jambes du jeans",
        "Coudre le bas pour fermer",
        "Utiliser la ceinture comme haut du sac",
        "Récupérer les poches et les coudre à l'extérieur",
        "Créer des anses avec du tissu ou sangles",
        "Coudre solidement les anses",
        "Renforcer les coutures avec surpiqûres",
        "Personnaliser avec patchs ou broderie (optionnel)",
      ],
      avantages: [
        "Tissu très résistant",
        "Poches déjà intégrées",
        "Style unique vintage",
      ],
      temps: "2-3 heures",
    },
    impact_eco: "Évite 10000L d'eau (fabrication nouveau jeans)",
    economie: "20-40€ (sac équivalent)",
  },
  "palette bois": {
    titre: "Recyclage de Palettes en Bois",
    difficulté: "Intermédiaire",
    objets_possibles: [
      "Table basse",
      "Jardinière verticale",
      "Tête de lit",
      "Étagère murale",
    ],
    composants_recuperables: [
      "Planches de bois",
      "Structure robuste",
      "Bois patiné authentique",
    ],
    projet_principal: {
      nom: "Table Basse Palette",
      etapes: [
        "Sélectionner palette EUR (traitement HT uniquement)",
        "Démonter ou utiliser palette entière",
        "Poncer toutes les surfaces (grain 80 puis 120)",
        "Traiter le bois (lasure, huile ou peinture)",
        "Fixer 4 roulettes sous la palette",
        "Ajouter une vitre de protection (optionnel)",
        "Laisser sécher 48h",
        "Profiter de votre table unique",
      ],
      avantages: [
        "Style industriel tendance",
        "Très économique",
        "Robuste et durable",
      ],
      temps: "4-6 heures (+ séchage)",
    },
    impact_eco: "Réutilisation de bois, évite abattage arbres",
    economie: "80-150€ (table basse neuve)",
  },
  palette: {
    titre: "Recyclage de Palettes en Bois",
    difficulté: "Intermédiaire",
    objets_possibles: [
      "Table basse",
      "Jardinière verticale",
      "Tête de lit",
      "Étagère murale",
    ],
    composants_recuperables: [
      "Planches de bois",
      "Structure robuste",
      "Bois patiné authentique",
    ],
    projet_principal: {
      nom: "Table Basse Palette",
      etapes: [
        "Sélectionner palette EUR (traitement HT uniquement)",
        "Démonter ou utiliser palette entière",
        "Poncer toutes les surfaces (grain 80 puis 120)",
        "Traiter le bois (lasure, huile ou peinture)",
        "Fixer 4 roulettes sous la palette",
        "Ajouter une vitre de protection (optionnel)",
        "Laisser sécher 48h",
        "Profiter de votre table unique",
      ],
      avantages: [
        "Style industriel tendance",
        "Très économique",
        "Robuste et durable",
      ],
      temps: "4-6 heures (+ séchage)",
    },
    impact_eco: "Réutilisation de bois, évite abattage arbres",
    economie: "80-150€ (table basse neuve)",
  },
  pneu: {
    titre: "Recyclage de Pneus Usagés",
    difficulté: "Intermédiaire",
    objets_possibles: [
      "Pouf ottoman",
      "Balançoire",
      "Jardinière",
      "Panier rangement",
    ],
    composants_recuperables: [
      "Caoutchouc résistant",
      "Forme circulaire",
      "Structure robuste",
    ],
    projet_principal: {
      nom: "Pouf Ottoman Design",
      etapes: [
        "Nettoyer le pneu en profondeur",
        "Découper deux cercles de contreplaqué (diamètre du pneu)",
        "Fixer un cercle en haut et un en bas avec vis",
        "Enrouler de la corde sisal autour du pneu",
        "Coller la corde au fur et à mesure",
        "Recouvrir complètement le pneu",
        "Fixer des pieds en bois sous le pneu (optionnel)",
        "Ajouter un coussin sur le dessus",
      ],
      avantages: [
        "Très résistant",
        "Style bohème unique",
        "Utilisation intérieur/extérieur",
      ],
      temps: "3-4 heures",
    },
    impact_eco: "Évite enfouissement (500 ans de décomposition)",
    economie: "60-120€ (pouf neuf)",
  },
  "vieille tablette": {
    titre: "Recyclage de Tablette",
    difficulté: "Intermédiaire",
    objets_possibles: [
      "Station météo murale",
      "Contrôleur domotique",
      "Cadre photo numérique",
      "Moniteur secondaire",
    ],
    composants_recuperables: ["Écran tactile", "WiFi", "Batterie", "Capteurs"],
    projet_principal: {
      nom: "Tableau de Bord Domotique Mural",
      etapes: [
        "Installer une app domotique (Home Assistant, Jeedom)",
        "Configurer l'accès au serveur domotique",
        "Désactiver la mise en veille automatique",
        "Créer un support mural discret",
        "Brancher chargeur en permanence",
        "Configurer widgets météo, caméras, lumières",
        "Activer mode kiosque (plein écran)",
        "Fixer au mur dans zone stratégique",
      ],
      avantages: [
        "Contrôle centralisé maison",
        "Interface tactile intuitive",
        "Toujours connecté",
      ],
      temps: "2-4 heures",
    },
    impact_eco: "Évite e-waste de métaux rares (lithium, cobalt)",
    economie: "100-200€ (tablette domotique dédiée)",
  },
  tablette: {
    titre: "Recyclage de Tablette",
    difficulté: "Intermédiaire",
    objets_possibles: [
      "Station météo murale",
      "Contrôleur domotique",
      "Cadre photo numérique",
      "Moniteur secondaire",
    ],
    composants_recuperables: ["Écran tactile", "WiFi", "Batterie", "Capteurs"],
    projet_principal: {
      nom: "Tableau de Bord Domotique Mural",
      etapes: [
        "Installer une app domotique (Home Assistant, Jeedom)",
        "Configurer l'accès au serveur domotique",
        "Désactiver la mise en veille automatique",
        "Créer un support mural discret",
        "Brancher chargeur en permanence",
        "Configurer widgets météo, caméras, lumières",
        "Activer mode kiosque (plein écran)",
        "Fixer au mur dans zone stratégique",
      ],
      avantages: [
        "Contrôle centralisé maison",
        "Interface tactile intuitive",
        "Toujours connecté",
      ],
      temps: "2-4 heures",
    },
    impact_eco: "Évite e-waste de métaux rares (lithium, cobalt)",
    economie: "100-200€ (tablette domotique dédiée)",
  },
};

// Fonction pour normaliser la recherche
function normalizeSearch(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Fonction pour trouver le meilleur match
function findBestMatch(input, database) {
  const normalized = normalizeSearch(input);

  // Recherche exacte
  if (database[normalized]) return database[normalized];

  // Recherche partielle
  for (let key in database) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return database[key];
    }
  }

  return null;
}

// Fonction pour obtenir le chemin de l'image d'un tutoriel
function getTutorialImage(titre) {
  const imageMap = {
    // Création
    "Lampe de Bureau Design": "images/lampe_design.jpg",
    "Enceinte Bluetooth DIY": "images/enceinte_bluetooth.jpg",
    "Chargeur Solaire Portable": "images/chargeur_solaire.jpg",
    "Station Météo Connectée": "images/station_meteo.png",
    "Horloge LED Personnalisée": "images/horloge.jpg",
    "Support de Téléphone Ajustable": "images/support_telephone.jpg",
    "Mangeoire à Oiseaux Intelligente": "images/mangeoire_oiseaux.jpg",
    "Pot de Fleurs Auto-Arrosant": "images/pot_fleur.jpg",
    "Organisateur de Bureau Modulaire": "images/organisateur_bureau.jpg",

    // Recyclage
    "Recyclage de Smartphone": "images/smartphone.jpg",
    "Recyclage de Bouteilles Plastique": "images/bouteille_plastique.jpg",
    "Recyclage d'Ordinateur": "images/ordinateur.jpg",
    "Recyclage de CD/DVD": "images/cd.jpg",
    "Recyclage de Pneus Usagés": "images/pneu.jpg",
  };

  return (
    imageMap[titre] ||
    "https://via.placeholder.com/300x200/0D2B45/FFD166?text=Image+bientot+disponible"
  );
}

const $tutorialPage = document.getElementById("outputPage");
const $tutorialContent = document.getElementById("outputContent");

// ===== MODE CRÉATION =====
const $objetCreation = document.getElementById("objetCreation");
const $creationOut = document.getElementById("creationOut");
const $btnCreation = document.getElementById("genCreation");

function loadCreation(tutorial) {
  $tutorialContent.innerHTML = `
    <div class="tutorial-page">
      <div class="result-header">
        <section>
          <button class="close-btn">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 19
                      L5 5
                      M5 19
                      L19 5"
                  />
              </svg>
              Fermer
          </button>
          <h3>${tutorial.titre}</h3>
        </section>
        <div class="badges">
          <span class="badge badge-difficulty">${tutorial.difficulté}</span>
          <span class="badge badge-time">${tutorial.temps}</span>
          <span class="badge badge-cost">${tutorial.cout}</span>
        </div>
      </div>

      <div class="section">
        <h4>Matériaux nécessaires</h4>
        <ul class="material-list">
          ${tutorial.materiaux.map((m) => `<li><span class="check">✓</span>${m}</li>`).join("")}
        </ul>
      </div>

      <div class="section">
        <h4>Outils requis</h4>
        <ul class="tool-list">
          ${tutorial.outils.map((o) => `<li><span class="tool-icon">•</span>${o}</li>`).join("")}
        </ul>
      </div>

      <div class="section">
        <h4>Étapes de fabrication</h4>
        <ol class="steps-list">
          ${tutorial.etapes
            .map(
              (e, i) => `
            <li>
              <span class="step-number">${i + 1}</span>
              <span class="step-text">${e}</span>
            </li>
          `,
            )
            .join("")}
        </ol>
      </div>

      <div class="section tips-section">
        <h4>Conseils importants</h4>
        <ul class="tips-list">
          ${tutorial.conseils.map((c) => `<li><span class="tip-icon">•</span>${c}</li>`).join("")}
        </ul>
      </div>

      <div class="action-buttons">
        <button class="btn-action btn-primary" onclick="window.print()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimer
        </button>
        <button class="btn-action btn-secondary" onclick="navigator.clipboard.writeText(document.querySelector('.tutorial-result').innerText).then(() => showToast('✓ Tutoriel copié dans le presse-papiers'))">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copier
        </button>
      </div>
    </div>
  `;
  document.querySelector(".close-btn").addEventListener("click", () => $tutorialPage.classList.remove('active'));
  $tutorialPage.classList.add("active");
}

// Recherche avec Enter
$objetCreation.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $btnCreation.click();
  }
});

$btnCreation.addEventListener("click", () => {
  const objet = $objetCreation.value.trim();
  if (!objet) {
    $creationOut.innerHTML = `
      <div class="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Veuillez indiquer un objet à créer</span>
      </div>
    `;
    return;
  }

  // Animation de chargement
  $creationOut.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Génération du tutoriel en cours...</p>
    </div>
  `;

  // Simulation de chargement
  setTimeout(() => {
    const tutorial = findBestMatch(objet, creationTutorials);

    if (tutorial) {
      const imageSrc = getTutorialImage(tutorial.titre);
      $creationOut.innerHTML = `
        <div class="tutorial-result">
          <img src="${imageSrc}" alt="${tutorial.titre}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">

          <div class="result-header">
            <span style="">
              <h3>${tutorial.titre}</h3>
              <div class="badges">
                <span class="badge badge-difficulty">${tutorial.difficulté}</span>
                <span class="badge badge-time">${tutorial.temps}</span>
                <span class="badge badge-cost">${tutorial.cout}</span>
              </div>
            </span>
            <span style="">
              <button class="btn btn-open-tuto" id="btnSeeTutorialCreation">Voir tutorial</button>
            <span>
          </div>

          <div class="tooltip">
            <strong>Matériaux nécessaires</strong>
            <span class="tooltiptext">
              <ul>
                ${tutorial.materiaux.map(
                  (v) => {
                    return "<li>" + v + "</li>"
                  }
                ).toString().replaceAll(",", "")}
              </ul>
            </span>
          </div>

          <div class="tooltip">
            <strong>Outils requis</strong>
            <span class="tooltiptext">
              <ul>
                ${tutorial.outils.map(
                  (v) => {
                    return "<li>" + v + "</li>"
                  }
                ).toString().replaceAll(",", "")}
              </ul>
            </span>
          </div>
        </div>
      `;
      document
        .getElementById("btnSeeTutorialCreation")
        .addEventListener("click", () => {
          // document.getElementById("creation").classList.remove("active");
          loadCreation(tutorial);
        }); // note to self: this won't work when we start searching for multiple results. fix later.
    } else {
      $creationOut.innerHTML = `
        <div class="tutorial-result">
          <div class="result-header">
            <h3>${objet}</h3>
            <div class="badges">
              <span class="badge badge-difficulty">À déterminer</span>
            </div>
          </div>

          <div class="section">
            <p class="info-message">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tutoriel personnalisé pour "${objet}" en cours de développement.
            </p>
            <p style="margin-top: 12px; font-size: 13px; color: var(--text-secondary);">
              Essayez : <strong>lampe</strong>, <strong>enceinte bluetooth</strong>, <strong>chargeur solaire</strong>, <strong>station météo</strong>, <strong>horloge</strong>, <strong>robot</strong>, <strong>terrarium</strong>, ou <strong>miroir</strong>
            </p>
          </div>
        </div>
      `;
    }
  }, 1500);
});

// ===== MODE RECYCLAGE =====
const $objetRecyclage = document.getElementById("objetRecyclage");
const $recyclageOut = document.getElementById("recyclageOut");
const $btnRecyclage = document.getElementById("genRecyclage");

function loadRecyclage(tutorial) {
  $tutorialContent.innerHTML = `
    <div class="tutorial-page">
      <div class="result-header">
        <section>
          <button class="close-btn">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 19
                      L5 5
                      M5 19
                      L19 5"
                  />
              </svg>
              Fermer
          </button>
          <h3>${tutorial.titre}</h3>
        </section>
        <div class="badges">
          <span class="badge badge-difficulty">${tutorial.difficulté}</span>
          <span class="badge badge-eco">Économie: ${tutorial.economie}</span>
        </div>
      </div>

      <div class="section highlight-section">
        <h4>Projet principal : ${tutorial.projet_principal.nom}</h4>
        <p class="project-time">Temps estimé : ${tutorial.projet_principal.temps}</p>

        <h5 style="margin-top: 16px;">Étapes :</h5>
        <ol class="steps-list">
          ${tutorial.projet_principal.etapes
            .map(
              (e, i) => `
            <li>
              <span class="step-number">${i + 1}</span>
              <span class="step-text">${e}</span>
            </li>
          `,
            )
            .join("")}
        </ol>

        <div class="advantages">
          <h5>Avantages :</h5>
          <ul>
            ${tutorial.projet_principal.avantages.map((a) => `<li>✓ ${a}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="section">
        <h4>Autres projets possibles</h4>
        <div class="project-chips">
          ${tutorial.objets_possibles.map((p) => `<span class="project-chip">${p}</span>`).join("")}
        </div>
      </div>

      <div class="section">
        <h4>Composants récupérables</h4>
        <div class="component-grid">
          ${tutorial.composants_recuperables
            .map(
              (c) => `
            <div class="component-item">
              <span class="component-icon">📦</span>
              <span>${c}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <div class="section eco-section">
        <h4>Impact écologique</h4>
        <p class="eco-impact">${tutorial.impact_eco}</p>
      </div>

      <div class="action-buttons">
        <button class="btn-action btn-primary" onclick="window.print()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimer
        </button>
        <button class="btn-action btn-secondary" onclick="navigator.clipboard.writeText(document.querySelector('.recycle-result').innerText).then(() => showToast('✓ Tutoriel copié dans le presse-papiers'))">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copier
        </button>
      </div>
    </div>
  `;
  document.querySelector(".close-btn").addEventListener("click", () => $tutorialPage.classList.remove('active'));
  $tutorialPage.classList.add("active");
}

// Recherche avec Enter
$objetRecyclage.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $btnRecyclage.click();
  }
});

$btnRecyclage.addEventListener("click", () => {
  const objet = $objetRecyclage.value.trim();
  if (!objet) {
    $recyclageOut.innerHTML = `
      <div class="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Veuillez indiquer un objet à recycler</span>
      </div>
    `;
    return;
  }

  // Animation de chargement
  $recyclageOut.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Recherche d'idées de recyclage...</p>
    </div>
  `;

  // Simulation de chargement
  setTimeout(() => {
    const tutorial = findBestMatch(objet, recyclageTutorials);

    if (tutorial) {
      const imageSrc = getTutorialImage(tutorial.titre);
      $recyclageOut.innerHTML = `
        <div class="tutorial-result recycle-result">
          <img src="${imageSrc}" alt="${tutorial.titre}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">

          <div class="result-header">
            <span>
              <h3>${tutorial.titre}</h3>
              <div class="badges">
                <span class="badge badge-difficulty">${tutorial.difficulté}</span>
                <span class="badge badge-eco">Économie: ${tutorial.economie}</span>
              </div>
            </span>
          </div>

          <div class="section highlight-section">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span>
                <h4>Projet principal : ${tutorial.projet_principal.nom}</h4>
                <p class="project-time">Temps estimé : ${tutorial.projet_principal.temps}</p>
              </span>
              <span>
                <button class="btn btn-open-tuto" id="btnSeeTutorialRecyclage">Voir tutorial</button>
              <span>
            </div>

          <div class="section">
            <h4>Composants récupérables</h4>
            <div class="component-grid">
              ${tutorial.composants_recuperables
                .map(
                  (c) => `
                <div class="component-item">
                  <span class="component-icon">📦</span>
                  <span>${c}</span>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
      `;
      document
        .getElementById("btnSeeTutorialRecyclage")
        .addEventListener("click", () => {
          // document.getElementById("recyclage").classList.remove("active");
          loadRecyclage(tutorial);
        }); // note to self: this won't work when we start searching for multiple results. fix later.
    } else {
      $recyclageOut.innerHTML = `
        <div class="tutorial-result recycle-result">
          <div class="result-header">
            <h3>${objet}</h3>
            <div class="badges">
              <span class="badge badge-difficulty">À déterminer</span>
            </div>
          </div>

          <div class="section">
            <p class="info-message">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Idées de recyclage pour "${objet}" en cours d'ajout.
            </p>
            <p style="margin-top: 12px; font-size: 13px; color: var(--text-secondary);">
              Essayez : <strong>vieux téléphone</strong>, <strong>bouteille plastique</strong>, <strong>ordinateur cassé</strong>, <strong>vieux cd</strong>, <strong>bocal</strong>, <strong>jeans</strong>, <strong>palette</strong>, <strong>pneu</strong>, ou <strong>tablette</strong>
            </p>
          </div>
        </div>
      `;
    }
  }, 1500);
});

// ===== TUTORIELS TENDANCE =====
// Gérer les clics sur les boutons des tutoriels tendance
document.querySelectorAll(".btn-tutorial").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    // Mapping des index de cartes aux tutoriels
    const tutorialMap = [
      creationTutorials["lampe design"],
      creationTutorials["station météo"],
      creationTutorials["chargeur solaire"],
      creationTutorials["enceinte bluetooth"],
    ];

    const tutorial = tutorialMap[index];
    if (tutorial) {
      // Fermer la page navigate
      // document.getElementById("navigate").classList.remove("active");
      // Ouvrir la page de tutoriel
      loadCreation(tutorial);
    }
  });
});
