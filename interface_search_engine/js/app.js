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
      ${type === "success"
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

// ===== DONNÉES ET RECHERCHE =====

let creationTutorials = [];
let recyclageTutorials = [];
let fuseCreation;
let fuseRecyclage;

async function initData() {
  try {
    // Utilisation des données globales chargées via data.js
    if (typeof tutorielsData === 'undefined') {
      throw new Error('Les données des tutoriels ne sont pas chargées.');
    }

    creationTutorials = tutorielsData.creation;
    recyclageTutorials = tutorielsData.recyclage;

    const options = {
      keys: [
        { name: 'titre', weight: 3 },
        { name: 'projet_principal.nom', weight: 2 },
        { name: 'objets_possibles', weight: 1 },
        { name: 'materiaux', weight: 0.5 },
        { name: 'outils', weight: 0.5 },
        { name: 'composants_recuperables', weight: 0.5 }
      ],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true
    };

    fuseCreation = new Fuse(creationTutorials, options);
    fuseRecyclage = new Fuse(recyclageTutorials, options);

    console.log("Données chargées et moteur de recherche prêt");
  } catch (error) {
    console.error("Erreur chargement données:", error);
    showToast("Erreur de chargement des tutoriels", "error");
  }
}

initData();

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

// ===== FILTRAGE =====

// Helper pour parser le temps (ex: "2-3 heures" -> 150 minutes moyenne)
function parseTime(timeStr) {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+)/g);
  if (!match) return 0;

  // Si range "2-3", moyenne. Si "1", juste 1.
  let hours = 0;
  if (match.length >= 2) {
    hours = (parseInt(match[0]) + parseInt(match[1])) / 2;
  } else {
    hours = parseInt(match[0]);
  }

  // Si minutes (cas rare mais possible)
  if (timeStr.includes("minute")) {
    return hours / 60; // Convertir en heures
  }

  return hours;
}

// Helper pour parser le coût (ex: "15-25€" -> 20)
function parseCost(costStr) {
  if (!costStr) return 0;
  const match = costStr.match(/(\d+)/g);
  if (!match) return 0;

  if (match.length >= 2) {
    return (parseInt(match[0]) + parseInt(match[1])) / 2;
  } else {
    return parseInt(match[0]);
  }
}

// Fonction de filtrage générique
function filterResults(results, filters) {
  return results.filter(result => {
    const item = result.item;

    // Filtre Difficulté
    if (filters.difficulty && filters.difficulty !== 'all') {
      if (item.difficulté !== filters.difficulty) return false;
    }

    // Filtre Temps
    if (filters.time && filters.time !== 'all') {
      // Pour recyclage, le temps est dans projet_principal
      const timeStr = item.temps || (item.projet_principal ? item.projet_principal.temps : null);
      const hours = parseTime(timeStr);

      if (filters.time === 'short' && hours >= 2) return false; // < 2h (Creation) ou < 1h (Recyclage - ajusté)
      if (filters.time === 'medium' && (hours < 2 || hours > 5)) return false;
      if (filters.time === 'long' && hours <= 5) return false;

      // Note: J'utilise les seuils de Creation (2h, 5h) comme base. 
      // Pour Recyclage, les seuils UI sont <1h, 1-3h, >3h. 
      // Je vais affiner selon le type si nécessaire, mais ici je simplifie.
      // Correction pour respecter l'UI Recyclage si c'est un item recyclage
      if (item.projet_principal) { // C'est du recyclage
        if (filters.time === 'short' && hours >= 1) return false;
        if (filters.time === 'medium' && (hours < 1 || hours > 3)) return false;
        if (filters.time === 'long' && hours <= 3) return false;
      }
    }

    // Filtre Coût (Creation seulement)
    if (filters.cost && filters.cost !== 'all') {
      const cost = parseCost(item.cout);
      if (filters.cost === 'low' && cost >= 20) return false;
      if (filters.cost === 'medium' && (cost < 20 || cost > 50)) return false;
      if (filters.cost === 'high' && cost <= 50) return false;
    }

    return true;
  });
}


const $tutorialPage = document.getElementById("outputPage");
const $tutorialContent = document.getElementById("outputContent");

// ===== MODE CRÉATION =====
const $objetCreation = document.getElementById("objetCreation");
const $creationOut = document.getElementById("creationOut");
const $btnCreation = document.getElementById("genCreation");

// Filtres DOM Elements
const $creationDifficulty = document.getElementById("creationDifficulty");
const $creationTime = document.getElementById("creationTime");
const $creationCost = document.getElementById("creationCost");

function loadCreation(tutorial) {
  $tutorialContent.innerHTML = `
    <div class="tutorial-page">
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
    // 1. Recherche Fuse
    const results = fuseCreation.search(objet);

    // 2. Filtrage
    const filters = {
      difficulty: $creationDifficulty.value,
      time: $creationTime.value,
      cost: $creationCost.value
    };

    const filteredResults = filterResults(results, filters);
    const tutorial = filteredResults.length > 0 ? filteredResults[0].item : null;

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

          <div class="section">
            <span>
              <strong>Matériaux nécessaires :</strong>
              ${tutorial.materiaux
          .toString()
          .replaceAll(",", ", ")
          .replace("[", "")
          .replace("]", "")}
            </span>
          </div>

          <div class="section">
            <span>
              <strong>Outils requis :</strong>
              ${tutorial.outils
          .toString()
          .replaceAll(",", ", ")
          .replace("[", "")
          .replace("]", "")}
            </span>
          </div>
        </div>
      `;
      document
        .getElementById("btnSeeTutorialCreation")
        .addEventListener("click", () => {
          document.getElementById("creation").classList.remove("active");
          loadCreation(tutorial);
        });
    } else {
      // Message différent si résultats trouvés mais filtrés
      const rawResults = fuseCreation.search(objet);
      let message = "";

      if (rawResults.length > 0) {
        message = `Aucun résultat ne correspond à vos filtres pour "${objet}". Essayez d'élargir votre recherche.`;
      } else {
        message = `Tutoriel personnalisé pour "${objet}" en cours de développement.`;
      }

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
              ${message}
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

// Filtres DOM Elements
const $recyclageDifficulty = document.getElementById("recyclageDifficulty");
const $recyclageTime = document.getElementById("recyclageTime");

function loadRecyclage(tutorial) {
  $tutorialContent.innerHTML = `
    <div class="tutorial-page">
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
    // 1. Recherche Fuse
    const results = fuseRecyclage.search(objet);

    // 2. Filtrage
    const filters = {
      difficulty: $recyclageDifficulty.value,
      time: $recyclageTime.value,
      // Pas de filtre coût pour recyclage
    };

    const filteredResults = filterResults(results, filters);
    const tutorial = filteredResults.length > 0 ? filteredResults[0].item : null;

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
          document.getElementById("recyclage").classList.remove("active");
          loadRecyclage(tutorial);
        });
    } else {
      // Message différent si résultats trouvés mais filtrés
      const rawResults = fuseRecyclage.search(objet);
      let message = "";

      if (rawResults.length > 0) {
        message = `Aucun résultat ne correspond à vos filtres pour "${objet}". Essayez d'élargir votre recherche.`;
      } else {
        message = `Idées de recyclage pour "${objet}" en cours d'ajout.`;
      }

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
              ${message}
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
document.querySelectorAll(".btn-tutorial").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const trendingTitles = [
      "Lampe de Bureau Design",
      "Station Météo Connectée",
      "Chargeur Solaire Portable",
      "Robot Éviteur d'Obstacles",
      "Enceinte Bluetooth DIY",
      "Horloge LED Personnalisée",
      "Recyclage d'Ordinateur",
      "Support de Téléphone Ajustable",
      "Terrarium Fermé Auto-Suffisant",
      "Miroir Lumineux LED",
      "Recyclage de Palettes en Bois",
      "Recyclage de Pneus Usagés",
      "Recyclage de Bocaux en Verre",
      "Recyclage de Jeans Usagés",
      "Mangeoire à Oiseaux Intelligente",
      "Recyclage de CD/DVD",
      "Recyclage de Bouteilles Plastique",
      "Pot de Fleurs Auto-Arrosant"
    ];

    const title = trendingTitles[index];
    if (title) {
      // Chercher dans les deux listes
      const tutorial = [...creationTutorials, ...recyclageTutorials].find(t => t.titre === title);

      if (tutorial) {
        document.getElementById("navigate").classList.remove("active");
        // Déterminer si c'est création ou recyclage pour appeler la bonne fonction
        if (creationTutorials.includes(tutorial)) {
          loadCreation(tutorial);
        } else {
          loadRecyclage(tutorial);
        }
      }
    }
  });
});
