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

// ===== CHARGEMENT DES DONNÉES DEPUIS JSON =====

let tutorialData = null;

// Charger les données JSON au démarrage
async function loadTutorialData() {
  try {
    const response = await fetch("./data/data_exemple.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    tutorialData = await response.json();
    console.log("Données des tutoriels chargées:", Object.keys(tutorialData));
    return true;
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    showToast("Erreur lors du chargement des tutoriels", "error");
    return false;
  }
}

// Charger les données au démarrage de l'application
loadTutorialData()
  .then((success) => {
    if (success && tutorialData) {
      console.log(
        "Application prête - tutoriels disponibles:",
        Object.keys(tutorialData),
      );
    } else {
      console.error("Échec du chargement des tutoriels");
    }
  })
  .catch((error) => {
    console.error("Erreur fatale lors du chargement:", error);
  });

// Fonction pour normaliser la recherche
function normalizeSearch(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Fonction pour trouver le meilleur match dans les données JSON
function findBestMatch(input) {
  if (!tutorialData) {
    console.error("Les données des tutoriels ne sont pas encore chargées");
    return null;
  }

  const normalized = normalizeSearch(input);

  // Recherche exacte par clé
  if (tutorialData[normalized]) {
    return { key: normalized, data: tutorialData[normalized] };
  }

  // Recherche dans les titres
  for (let key in tutorialData) {
    const tutorial = tutorialData[key];
    const titre = tutorial.titre?.[0] || "";

    if (
      normalizeSearch(titre).includes(normalized) ||
      normalized.includes(normalizeSearch(titre))
    ) {
      return { key, data: tutorial };
    }
  }

  // Recherche partielle dans les clés
  for (let key in tutorialData) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return { key, data: tutorialData[key] };
    }
  }

  return null;
}

// Fonction pour trouver le meilleur match basé sur les matériaux
function findBestMatchByMaterial(input) {
  if (!tutorialData) {
    console.error("Les données des tutoriels ne sont pas encore chargées");
    return null;
  }

  const normalized = normalizeSearch(input);

  // Recherche dans les matériaux
  for (let key in tutorialData) {
    const tutorial = tutorialData[key];
    if (tutorial.matériaux && tutorial.matériaux.length > 0) {
      for (let mat of tutorial.matériaux) {
        const matTitre = mat.titre || "";
        if (
          normalizeSearch(matTitre).includes(normalized) ||
          normalized.includes(normalizeSearch(matTitre))
        ) {
          return { key, data: tutorial };
        }
        if (mat.sous_items && mat.sous_items.length > 0) {
          for (let sub of mat.sous_items) {
            if (
              normalizeSearch(sub).includes(normalized) ||
              normalized.includes(normalizeSearch(sub))
            ) {
              return { key, data: tutorial };
            }
          }
        }
      }
    }
  }

  // Fallback to title search if no material match
  for (let key in tutorialData) {
    const tutorial = tutorialData[key];
    const titre = tutorial.titre?.[0] || "";
    if (
      normalizeSearch(titre).includes(normalized) ||
      normalized.includes(normalizeSearch(titre))
    ) {
      return { key, data: tutorial };
    }
  }

  return null;
}

// Fonction pour obtenir le chemin de l'image d'un tutoriel
function getTutorialImage(tutorial) {
  // Utiliser l'image du JSON si elle existe
  if (tutorial.image && tutorial.image.length > 0 && tutorial.image[0].url) {
    return tutorial.image[0].url;
  }

  // Image par défaut
  return "https://via.placeholder.com/300x200/502800/00db21?text=Tutoriel";
}

const $tutorialPage = document.getElementById("outputPage");
const $tutorialContent = document.getElementById("outputContent");

// ===== GÉNÉRATION HTML À PARTIR DES DONNÉES JSON =====
// Utilise TutorialGenerator.js pour générer le HTML du tutoriel
function generateTutorialHTML(tutorialKey, tutorialData) {
  if (!tutorialData) return "";

  // Utiliser le générateur existant pour créer le HTML complet
  const fullHTML = TutorialGenerator.generateHTML(
    { [tutorialKey]: tutorialData },
    tutorialKey,
  );

  // Extraire le body du HTML généré
  const bodyMatch = fullHTML.match(/<body>([\s\S]*)<\/body>/);
  if (bodyMatch) {
    return bodyMatch[1];
  }

  return fullHTML;
}

function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function copyToClipboard() {
  const content = document.querySelector(".tutorial-page").innerText;
  navigator.clipboard
    .writeText(content)
    .then(() => {
      showToast("✓ Tutoriel copié dans le presse-papiers");
    })
    .catch(() => {
      showToast("Erreur lors de la copie", "error");
    });
}

function downloadHTML() {
  const tutorialKey = currentTutorialKey;
  if (!tutorialKey || !tutorialData) return;

  const fullHTML = TutorialGenerator.generateHTML(tutorialData, tutorialKey);
  const blob = new Blob([fullHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tutoriel_${tutorialKey}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("✓ Fichier HTML téléchargé");
}

let currentTutorialKey = null;

function loadTutorial(key, data) {
  currentTutorialKey = key;
  const html = generateTutorialHTML(key, data);
  $tutorialContent.innerHTML = html;
  $tutorialPage.classList.add("active");
}

// ===== MODE CRÉATION =====
const $objetCreation = document.getElementById("objetCreation");
const $creationOut = document.getElementById("creationOut");
const $btnCreation = document.getElementById("genCreation");

// Recherche avec Enter
$objetCreation.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $btnCreation.click();
  }
});

$btnCreation.addEventListener("click", () => {
  const objet = $objetCreation.value.trim();

  // Vérifier que les données sont chargées
  if (!tutorialData) {
    $creationOut.innerHTML = `
      <div class="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Chargement des données en cours... Veuillez patienter.</span>
      </div>
    `;
    return;
  }

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
      <p>Recherche de tutoriel...</p>
    </div>
  `;

  // Simulation de chargement
  setTimeout(() => {
    const result = findBestMatch(objet);

    if (result) {
      const { key, data } = result;
      const imageSrc = getTutorialImage(data);
      const titre = data.titre?.[0] || "Tutoriel";
      const difficulte = data.difficulté?.[0] || "";
      const duree = data.durée?.[0] || "";
      const cout = data.coût?.[0] || "";

      $creationOut.innerHTML = `
        <div class="tutorial-result">
          <img src="${imageSrc}" alt="${escapeHtml(titre)}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">

          <div class="result-header">
            <span>
              <h3>${escapeHtml(titre)}</h3>
              <div class="badges">
                ${difficulte ? `<span class="badge badge-difficulty">${escapeHtml(difficulte)}</span>` : ""}
                ${duree ? `<span class="badge badge-time">${escapeHtml(duree)}</span>` : ""}
                ${cout ? `<span class="badge badge-cost">${escapeHtml(cout)}</span>` : ""}
              </div>
            </span>
            <span>
              <button class="btn btn-open-tuto" id="btnSeeTutorial">Voir tutoriel</button>
            </span>
          </div>
        </div>
      `;

      document
        .getElementById("btnSeeTutorial")
        .addEventListener("click", () => {
          document.getElementById("creation").classList.remove("active");
          loadTutorial(key, data);
        });
    } else {
      $creationOut.innerHTML = `
        <div class="tutorial-result">
          <div class="result-header">
            <h3>${escapeHtml(objet)}</h3>
            <div class="badges">
              <span class="badge badge-difficulty">À déterminer</span>
            </div>
          </div>

          <div class="section">
            <p class="info-message">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tutoriel personnalisé pour "${escapeHtml(objet)}" en cours de développement.
            </p>
            <p style="margin-top: 12px; font-size: 13px; color: var(--text-secondary);">
              Essayez les tutoriels disponibles dans le fichier JSON.
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

// Recherche avec Enter
$objetRecyclage.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $btnRecyclage.click();
  }
});

$btnRecyclage.addEventListener("click", () => {
  const objet = $objetRecyclage.value.trim();

  // Vérifier que les données sont chargées
  if (!tutorialData) {
    $recyclageOut.innerHTML = `
      <div class="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Chargement des données en cours... Veuillez patienter.</span>
      </div>
    `;
    return;
  }

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
    const result = findBestMatchByMaterial(objet);

    if (result) {
      const { key, data } = result;
      const imageSrc = getTutorialImage(data);
      const titre = data.titre?.[0] || "Tutoriel";
      const difficulte = data.difficulté?.[0] || "";
      const duree = data.durée?.[0] || "";
      const cout = data.coût?.[0] || "";

      $recyclageOut.innerHTML = `
        <div class="tutorial-result recycle-result">
          <img src="${imageSrc}" alt="${escapeHtml(titre)}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">

          <div class="result-header">
            <span>
              <h3>${escapeHtml(titre)}</h3>
              <div class="badges">
                ${difficulte ? `<span class="badge badge-difficulty">${escapeHtml(difficulte)}</span>` : ""}
                ${duree ? `<span class="badge badge-time">${escapeHtml(duree)}</span>` : ""}
                ${cout ? `<span class="badge badge-cost">${escapeHtml(cout)}</span>` : ""}
              </div>
            </span>
            <span>
              <button class="btn btn-open-tuto" id="btnSeeTutorialRecyclage">Voir tutoriel</button>
            </span>
          </div>
        </div>
      `;

      document
        .getElementById("btnSeeTutorialRecyclage")
        .addEventListener("click", () => {
          document.getElementById("recyclage").classList.remove("active");
          loadTutorial(key, data);
        });
    } else {
      $recyclageOut.innerHTML = `
        <div class="tutorial-result recycle-result">
          <div class="result-header">
            <h3>${escapeHtml(objet)}</h3>
            <div class="badges">
              <span class="badge badge-eco">Recyclage créatif</span>
            </div>
          </div>

          <div class="section">
            <p class="info-message">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Idée de recyclage pour "${escapeHtml(objet)}" en développement.
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
    // Attendre que les données soient chargées
    if (!tutorialData) {
      showToast("Chargement des données en cours...", "error");
      return;
    }

    // Utiliser les premières clés du JSON pour les tutoriels tendance
    const tutorialKeys = Object.keys(tutorialData);
    if (index < tutorialKeys.length) {
      const key = tutorialKeys[index];
      const data = tutorialData[key];

      // Fermer la page navigate
      document.getElementById("navigate").classList.remove("active");
      // Ouvrir la page de tutoriel
      loadTutorial(key, data);
    }
  });
});
