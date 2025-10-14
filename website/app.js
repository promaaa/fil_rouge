const home = document.getElementById('home');
const pages = document.querySelectorAll('.page');
const reveals = document.querySelectorAll('.reveal');

// Animation d'apparition progressive lors du scroll
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18
});

reveals.forEach(el => revealObserver.observe(el));

// Fonction pour afficher une notification toast
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      ${type === 'success' ? 
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' :
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
      }
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Navigation depuis l'accueil vers les différentes pages
document.querySelectorAll('.home .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.page;
    home.style.display = 'none';
    document.getElementById(target).classList.add('active');
    
    // Ajouter à l'historique
    history.pushState({ page: target }, '', `#${target}`);
  });
});

// Boutons retour
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    goToHome();
  });
});

// Fonction pour retourner à l'accueil
function goToHome() {
  pages.forEach(p => p.classList.remove('active'));
  home.style.display = 'flex';
  
  // Mettre à jour l'historique
  history.pushState({ page: 'home' }, '', '#home');
}

// Gérer le bouton retour du navigateur
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.page) {
    if (event.state.page === 'home') {
      pages.forEach(p => p.classList.remove('active'));
      home.style.display = 'flex';
    } else {
      home.style.display = 'none';
      pages.forEach(p => p.classList.remove('active'));
      document.getElementById(event.state.page).classList.add('active');
    }
  } else {
    // Si pas d'état, retourner à l'accueil
    pages.forEach(p => p.classList.remove('active'));
    home.style.display = 'flex';
  }
});

// Initialiser l'état de l'historique
history.replaceState({ page: 'home' }, '', '#home');

// ===== BASE DE DONNÉES HARD-CODÉE =====

// Tutoriels de création
const creationTutorials = {
  'lampe design': {
    titre: 'Lampe de Bureau Design',
    difficulté: 'Débutant',
    temps: '2-3 heures',
    materiaux: ['Douille E27', 'Câble électrique', 'Ampoule LED', 'Bois de palette', 'Interrupteur', 'Vis et colle'],
    outils: ['Scie', 'Perceuse', 'Tournevis', 'Papier de verre'],
    etapes: [
      'Découper le bois aux dimensions souhaitées (base 15x15cm, bras 40cm)',
      'Poncer toutes les surfaces pour un aspect lisse',
      'Percer un trou pour passer le câble électrique',
      'Fixer la douille E27 au sommet du bras',
      'Assembler la base et le bras avec vis et colle',
      'Passer le câble et connecter l\'interrupteur',
      'Tester la connexion électrique',
      'Appliquer une finition (vernis, peinture) si désiré'
    ],
    conseils: ['Toujours débrancher avant de manipuler', 'Respecter les normes électriques', 'Utiliser une ampoule LED pour économie d\'énergie'],
    cout: '15-25€'
  },
  'enceinte bluetooth': {
    titre: 'Enceinte Bluetooth DIY',
    difficulté: 'Intermédiaire',
    temps: '4-5 heures',
    materiaux: ['Module Bluetooth PAM8403', 'Haut-parleur 5W (x2)', 'Batterie Li-ion 18650', 'Module de charge TP4056', 'Interrupteur', 'Boîtier en bois'],
    outils: ['Fer à souder', 'Perceuse', 'Scie', 'Multimètre', 'Colle à bois'],
    etapes: [
      'Découper le boîtier selon les dimensions des haut-parleurs',
      'Percer les trous pour les haut-parleurs et l\'interrupteur',
      'Souder le module Bluetooth aux haut-parleurs',
      'Connecter la batterie au module de charge',
      'Assembler tous les composants électroniques',
      'Fixer les haut-parleurs dans le boîtier',
      'Tester le système audio',
      'Fermer et finaliser le boîtier'
    ],
    conseils: ['Vérifier la polarité des connexions', 'Tester chaque composant avant assemblage', 'Prévoir des évents pour le son'],
    cout: '30-45€'
  },
  'chargeur solaire': {
    titre: 'Chargeur Solaire Portable',
    difficulté: 'Intermédiaire',
    temps: '3-4 heures',
    materiaux: ['Panneau solaire 5V 2W', 'Module de charge solaire', 'Batterie 18650 (x2)', 'Support de batterie', 'Port USB de sortie', 'Boîtier étanche'],
    outils: ['Fer à souder', 'Multimètre', 'Perceuse', 'Colle époxy'],
    etapes: [
      'Tester le panneau solaire en plein soleil',
      'Préparer le boîtier avec trous pour USB et panneau',
      'Souder le panneau au module de charge',
      'Connecter les batteries au module',
      'Installer le port USB de sortie',
      'Fixer tous les composants dans le boîtier',
      'Tester la charge et la décharge',
      'Sceller le boîtier pour l\'étanchéité'
    ],
    conseils: ['Utiliser des batteries de qualité', 'Protéger contre les surcharges', 'Tester par temps ensoleillé'],
    cout: '25-35€'
  }
};

// Tutoriels de recyclage
const recyclageTutorials = {
  'vieux téléphone': {
    titre: 'Recyclage de Smartphone',
    difficulté: 'Avancé',
    objets_possibles: ['Webcam WiFi', 'Cadre photo numérique', 'Dashcam auto', 'Télécommande domotique'],
    composants_recuperables: ['Écran LCD', 'Caméra', 'Batterie', 'Haut-parleur', 'Vibreur', 'Capteurs divers'],
    projet_principal: {
      nom: 'Webcam de Surveillance WiFi',
      etapes: [
        'Installer une application de surveillance (IP Webcam, Alfred)',
        'Configurer la connexion WiFi du téléphone',
        'Positionner le téléphone avec vue optimale',
        'Connecter à un chargeur permanent',
        'Configurer l\'enregistrement sur cloud ou serveur local',
        'Tester la détection de mouvement',
        'Créer un support mural adapté'
      ],
      avantages: ['Réutilisation complète', 'Pas d\'achat nécessaire', 'Fonctionnalités avancées gratuites'],
      temps: '1-2 heures'
    },
    impact_eco: 'Évite 150kg de CO2 (fabrication nouveau téléphone)',
    economie: '50-150€'
  },
  'bouteille plastique': {
    titre: 'Recyclage de Bouteilles Plastique',
    difficulté: 'Débutant',
    objets_possibles: ['Pot de fleurs', 'Système d\'irrigation goutte-à-goutte', 'Mangeoire à oiseaux', 'Rangement mural'],
    composants_recuperables: ['Corps de bouteille', 'Bouchon fileté', 'Base stable'],
    projet_principal: {
      nom: 'Système d\'Arrosage Automatique',
      etapes: [
        'Nettoyer soigneusement la bouteille',
        'Percer de petits trous (1-2mm) dans le bouchon',
        'Remplir la bouteille d\'eau',
        'Visser le bouchon fermement',
        'Retourner et planter dans la terre près de la plante',
        'L\'eau s\'écoulera lentement pendant plusieurs jours',
        'Créer plusieurs unités pour un jardin complet'
      ],
      avantages: ['Économie d\'eau', 'Arrosage régulier', 'Aucun coût', 'Écologique'],
      temps: '15-30 minutes'
    },
    impact_eco: 'Évite pollution marine, réduit déchets plastiques',
    economie: '10-20€ (système d\'arrosage commercial)'
  },
  'ordinateur cassé': {
    titre: 'Recyclage d\'Ordinateur',
    difficulté: 'Intermédiaire',
    objets_possibles: ['Serveur de fichiers', 'Media center', 'Console rétro-gaming', 'Station météo'],
    composants_recuperables: ['Disque dur', 'RAM', 'Ventilateurs', 'Alimentation', 'Boîtier', 'Ports USB'],
    projet_principal: {
      nom: 'Serveur NAS Personnel',
      etapes: [
        'Récupérer le disque dur et tester sa santé',
        'Installer un OS léger (Ubuntu Server, OpenMediaVault)',
        'Configurer le partage réseau (Samba, NFS)',
        'Activer l\'accès à distance sécurisé',
        'Mettre en place des sauvegardes automatiques',
        'Optimiser la consommation électrique',
        'Configurer l\'accès depuis internet (optionnel)'
      ],
      avantages: ['Stockage cloud personnel', 'Contrôle total des données', 'Pas d\'abonnement mensuel'],
      temps: '3-5 heures'
    },
    impact_eco: 'Évite e-waste toxique, prolonge durée de vie composants',
    economie: '100-300€ (NAS commercial)'
  }
};

// Fonction pour normaliser la recherche
function normalizeSearch(text) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
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

// ===== MODE CRÉATION =====
const $objetCreation = document.getElementById('objetCreation');
const $creationOut = document.getElementById('creationOut');
const $btnCreation = document.getElementById('genCreation');

// Recherche avec Enter
$objetCreation.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    $btnCreation.click();
  }
});

$btnCreation.addEventListener('click', () => {
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
      $creationOut.innerHTML = `
        <div class="tutorial-result">
          <div class="result-header">
            <h3>${tutorial.titre}</h3>
            <div class="badges">
              <span class="badge badge-difficulty">${tutorial.difficulté}</span>
              <span class="badge badge-time">${tutorial.temps}</span>
              <span class="badge badge-cost">${tutorial.cout}</span>
            </div>
          </div>
          
          <div class="section">
            <h4>Matériaux nécessaires</h4>
            <ul class="material-list">
              ${tutorial.materiaux.map(m => `<li><span class="check">✓</span>${m}</li>`).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h4>Outils requis</h4>
            <ul class="tool-list">
              ${tutorial.outils.map(o => `<li><span class="tool-icon">•</span>${o}</li>`).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h4>Étapes de fabrication</h4>
            <ol class="steps-list">
              ${tutorial.etapes.map((e, i) => `
                <li>
                  <span class="step-number">${i + 1}</span>
                  <span class="step-text">${e}</span>
                </li>
              `).join('')}
            </ol>
          </div>
          
          <div class="section tips-section">
            <h4>Conseils importants</h4>
            <ul class="tips-list">
              ${tutorial.conseils.map(c => `<li><span class="tip-icon">•</span>${c}</li>`).join('')}
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
              Essayez : <strong>lampe design</strong>, <strong>enceinte bluetooth</strong>, ou <strong>chargeur solaire</strong>
            </p>
          </div>
        </div>
      `;
    }
  }, 1500);
});

// ===== MODE RECYCLAGE =====
const $objetRecyclage = document.getElementById('objetRecyclage');
const $recyclageOut = document.getElementById('recyclageOut');
const $btnRecyclage = document.getElementById('genRecyclage');

// Recherche avec Enter
$objetRecyclage.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    $btnRecyclage.click();
  }
});

$btnRecyclage.addEventListener('click', () => {
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
      $recyclageOut.innerHTML = `
        <div class="tutorial-result recycle-result">
          <div class="result-header">
            <h3>${tutorial.titre}</h3>
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
              ${tutorial.projet_principal.etapes.map((e, i) => `
                <li>
                  <span class="step-number">${i + 1}</span>
                  <span class="step-text">${e}</span>
                </li>
              `).join('')}
            </ol>
            
            <div class="advantages">
              <h5>Avantages :</h5>
              <ul>
                ${tutorial.projet_principal.avantages.map(a => `<li>✓ ${a}</li>`).join('')}
              </ul>
            </div>
          </div>
          
          <div class="section">
            <h4>Autres projets possibles</h4>
            <div class="project-chips">
              ${tutorial.objets_possibles.map(p => `<span class="project-chip">${p}</span>`).join('')}
            </div>
          </div>
          
          <div class="section">
            <h4>Composants récupérables</h4>
            <div class="component-grid">
              ${tutorial.composants_recuperables.map(c => `
                <div class="component-item">
                  <span class="component-icon">📦</span>
                  <span>${c}</span>
                </div>
              `).join('')}
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
              Essayez : <strong>vieux téléphone</strong>, <strong>bouteille plastique</strong>, ou <strong>ordinateur cassé</strong>
            </p>
          </div>
        </div>
      `;
    }
  }, 1500);
});
