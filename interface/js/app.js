// Configuration
// Les données sont chargées via js/data.js dans window.tutorialData

// État de l'application
let appData = null; // Données normalisées
let fuse = null;

// Éléments DOM
const $pages = document.querySelectorAll(".page");
const $navButtons = document.querySelectorAll("[data-page]");
const $backButtons = document.querySelectorAll(".back-btn");
const $home = document.getElementById("home");
const $tutorialPage = document.getElementById("outputPage"); // Side panel
const $tutorialContent = document.getElementById("tutorialContent");

// Inputs et Boutons
const $objetCreation = document.getElementById("objetCreation");
const $btnCreation = document.getElementById("genCreation");
const $outCreation = document.getElementById("creationOut");

const $objetRecyclage = document.getElementById("objetRecyclage");
const $btnRecyclage = document.getElementById("genRecyclage");
const $outRecyclage = document.getElementById("recyclageOut");

// Filtres
const filters = {
    creation: { difficulty: 'all', time: 'all', cost: 'all' },
    recyclage: { difficulty: 'all', time: 'all', cost: 'all' }
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {

    initNavigation();
    initFilters();

    // Vérification et normalisation des données
    if (window.tutorialData) {

        appData = normalizeData(window.tutorialData);
        initSearch();
        initNavigate();

    } else {
        console.error("Erreur : window.tutorialData est vide. Vérifiez le chargement de js/data.js");
        showToast("Erreur : Données introuvables", "error");
    }
});

// --- Normalisation des Données ---

function normalizeData(rawData) {
    const normalized = {};

    for (const [key, item] of Object.entries(rawData)) {
        // Extraction sécurisée des valeurs (gestion des tableaux et objets)
        const titre = Array.isArray(item.titre) ? item.titre[0] : (item.titre || key);
        const difficulte = Array.isArray(item.difficulté) ? item.difficulté[0] : (item.difficulté || "Inconnue");
        const temps = Array.isArray(item.durée) ? item.durée[0] : (item.durée || "N/A");
        const cout = Array.isArray(item.coût) ? item.coût[0] : (item.coût || "N/A");

        // Extraction des matériaux (liste d'objets -> liste de strings)
        let materiaux = [];
        if (Array.isArray(item.matériaux)) {
            materiaux = item.matériaux.map(m => m.titre || m).filter(Boolean);
        }

        // Extraction des outils
        let outils = [];
        if (Array.isArray(item.outils)) {
            outils = item.outils.map(o => o.titre || o).filter(Boolean);
        }

        // Extraction des étapes (complexe -> simple liste de titres)
        let etapes = [];
        if (Array.isArray(item.étapes)) {
            item.étapes.forEach(step => {
                // Titre de l'étape principale
                if (step.titre) etapes.push(step.titre);

                // Sous-étapes dans les solutions
                if (Array.isArray(step.solutions)) {
                    step.solutions.forEach(sol => {
                        if (Array.isArray(sol.etapes)) {
                            sol.etapes.forEach(subStep => {
                                if (subStep.titre) etapes.push(subStep.titre);
                            });
                        }
                    });
                }
            });
        }

        // Extraction des conseils (souvent dans introduction ou remarques)
        let conseils = [];
        let description_text = ""; // Pour la recherche

        if (Array.isArray(item.introduction)) {
            item.introduction.forEach(intro => {
                if (intro.titre) {
                    description_text += intro.titre + " ";
                    if (intro.titre.toLowerCase().includes("attention") || intro.titre.toLowerCase().includes("conseil")) {
                        conseils.push(intro.titre);
                    }
                }
            });
        }

        // Extraction de l'image
        let image = "assets/images/placeholder.jpg";
        if (Array.isArray(item.image) && item.image.length > 0 && item.image[0].url) {
            image = item.image[0].url;
        } else if (typeof item.image === 'string') {
            image = item.image;
        }

        // Catégorisation pour les filtres
        let difficultyCategory = difficulte; // Par défaut

        // Catégorisation Temps
        let timeCategory = "medium";
        const timeStr = temps.toLowerCase();
        if (timeStr.includes("heure") || timeStr.includes("minute") || timeStr.includes("h")) {
            const hours = parseInt(timeStr) || 0;
            if (hours < 1 && timeStr.includes("minute")) timeCategory = "short";
            else if (hours < 2) timeCategory = "short"; // < 2h
            else if (hours < 24) timeCategory = "medium"; // < 1 jour
        } else if (timeStr.includes("jour") || timeStr.includes("mois")) {
            timeCategory = "long";
        }

        // Catégorisation Coût
        let costCategory = "medium";
        const costMatches = cout.match(/\d+/g);
        if (costMatches) {
            const maxCost = Math.max(...costMatches.map(Number));
            if (maxCost < 10) costCategory = "low";
            else if (maxCost <= 50) costCategory = "medium";
            else costCategory = "high";
        }

        normalized[key] = {
            id: key,
            titre: titre,
            difficulté: difficulte,
            temps: temps,
            cout: cout,
            difficultyCategory: difficultyCategory,
            timeCategory: timeCategory,
            costCategory: costCategory,
            materiaux: materiaux,
            outils: outils,
            etapes: etapes,
            conseils: conseils,
            description_text: description_text,
            image: image,
            // Conservation de l'objet original pour usage avancé si besoin
            original: item
        };
    }

    return normalized;
}

// --- Recherche ---

function initSearch() {
    if (!appData) return;

    if (typeof Fuse === 'undefined') {
        console.error("Fuse.js manquant");
        return;
    }

    const dataList = Object.values(appData);

    const options = {
        includeScore: true,
        threshold: 0.5, // Augmenté pour être plus tolérant
        ignoreLocation: true, // Important pour trouver des mots n'importe où
        keys: [
            { name: "titre", weight: 2 }, // Le titre est plus important
            "materiaux",
            "description_text", // Recherche dans l'intro
            "id"
        ]
    };

    fuse = new Fuse(dataList, options);


    // Event Listeners
    if ($btnCreation) $btnCreation.addEventListener("click", () => handleSearch('creation'));
    if ($btnRecyclage) $btnRecyclage.addEventListener("click", () => handleSearch('recyclage'));

    if ($objetCreation) {
        $objetCreation.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleSearch('creation');
        });
    }
    if ($objetRecyclage) {
        $objetRecyclage.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleSearch('recyclage');
        });
    }
}

function handleSearch(type) {
    const inputEl = type === 'creation' ? $objetCreation : $objetRecyclage;
    const outputEl = type === 'creation' ? $outCreation : $outRecyclage;
    const query = inputEl.value.trim();

    if (!query) {
        showToast("Veuillez entrer un terme de recherche", "info");
        return;
    }

    outputEl.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Recherche en cours...</p></div>';

    setTimeout(() => {
        const results = fuse.search(query);
        const filteredResults = filterResults(results, filters[type], type);
        displayResults(filteredResults, outputEl, type);
    }, 500);
}

function filterResults(results, currentFilters, type) {
    return results.filter(result => {
        const item = result.item;

        // Filtre Difficulté
        if (currentFilters.difficulty !== 'all' && item.difficultyCategory !== currentFilters.difficulty) {
            return false;
        }

        // Filtre Temps
        if (currentFilters.time !== 'all' && item.timeCategory !== currentFilters.time) {
            return false;
        }

        // Filtre Coût
        if (currentFilters.cost !== 'all' && item.costCategory !== currentFilters.cost) {
            return false;
        }

        return true;
    });
}


function displayResults(results, container, type) {
    container.innerHTML = "";

    if (results.length === 0) {
        container.innerHTML = `
            <div class="info-message">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Aucun résultat trouvé.</p>
            </div>
        `;
        return;
    }

    results.forEach(result => {
        const item = result.item;
        const card = document.createElement("div");
        card.className = "card card-animated";
        card.style.cursor = "pointer";

        // Contenu de la carte
        card.innerHTML = `
            <div class="card-image-banner" style="height: 120px; overflow: hidden; border-radius: 12px 12px 0 0; margin: -20px -20px 12px -20px; position: relative;">
                <img src="${item.image}" alt="${item.titre}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%);"></div>
            </div>
            <div class="result-header" style="border-bottom: none; margin-bottom: 8px; padding-bottom: 0;">
                <h3 style="font-size: 18px; margin: 0;">${item.titre}</h3>
                <span class="badge badge-difficulty">${item.difficulté}</span>
            </div>
            <div class="badges" style="margin-bottom: 12px;">
                <span class="badge badge-time">${item.temps}</span>
                <span class="badge badge-cost">${item.cout}</span>
            </div>
            <button class="btn btn-sm btn-primary" style="margin-top:8px; width:100%;">Voir le tutoriel</button>
        `;

        // Click sur toute la carte
        card.addEventListener("click", () => {

            loadTutorial(item);
        });

        container.appendChild(card);
    });
}

// --- Affichage Détaillé (Panneau Latéral) ---

function loadTutorial(tutorial) {


    // Utilisation d'une iframe pour isoler le style du tutoriel généré
    // On conserve la structure de conteneur pour ne pas briser le layout flex parent
    $tutorialContent.innerHTML = `
        <div class="tutorial-iframe-container" style="min-height: 85vh; display: flex; flex-direction: column; overflow: hidden;">
            <div class="iframe-header" style="padding: 10px 20px; background: var(--bg-main); border-bottom: 1px solid var(--line-color); display: flex; justify-content: space-between; align-items: center;">
                <button class="close-btn" style="margin: 0; position: static;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Fermer
                </button>
                <div class="actions">
                    <button class="btn-action btn-secondary" id="iframePrintBtn" style="padding: 6px 12px; font-size: 12px;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 16px; height: 16px;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimer
                    </button>
                </div>
            </div>
            <iframe id="tutorialIframe" style="flex: 1; width: 100%; border: none; background: var(--bg-main);"></iframe>
        </div>
    `;

    // Génération et injection du contenu
    if (typeof TutorialGenerator !== 'undefined' && window.tutorialData) {
        try {
            // Utilisation de l'ID pour récupérer les données brutes
            const fullHtml = TutorialGenerator.generateHTML(window.tutorialData, tutorial.id);
            const iframe = document.getElementById('tutorialIframe');

            // Écriture dans l'iframe
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(fullHtml);
            doc.close();

            // Gestion de l'impression depuis le bouton externe
            document.getElementById('iframePrintBtn').addEventListener('click', () => {
                iframe.contentWindow.print();
            });

        } catch (e) {
            console.error("Erreur génération tutoriel:", e);
            $tutorialContent.innerHTML = `<div class="alert alert-warning">Erreur lors de la génération du tutoriel : ${e.message}</div>`;
        }
    } else {
        $tutorialContent.innerHTML = `<div class="alert alert-warning">Données ou générateur manquant.</div>`;
    }

    // Activation du panneau
    $tutorialPage.classList.add("active");

    // Gestion fermeture
    const closeBtn = $tutorialContent.querySelector(".close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            $tutorialPage.classList.remove("active");
        });
    }
}

// --- Navigation ---

function initNavigation() {
    $navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const pageId = btn.getAttribute("data-page");
            showPage(pageId);
        });
    });

    $backButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            showHome();
        });
    });
}

function showPage(pageId) {
    $home.style.display = "none";
    $pages.forEach(page => {
        page.classList.remove("active");
        if (page.id === pageId) {
            page.classList.add("active");
        }
    });
}

function showHome() {
    $pages.forEach(page => page.classList.remove("active"));
    $home.style.display = "flex";
    if ($tutorialPage) $tutorialPage.classList.remove("active");
}

function initFilters() {
    // Configuration des filtres Création
    setupFilter('creation', 'difficulty', 'creationDifficulty');
    setupFilter('creation', 'time', 'creationTime');
    setupFilter('creation', 'cost', 'creationCost');

    // Configuration des filtres Recyclage
    setupFilter('recyclage', 'difficulty', 'recyclageDifficulty');
    setupFilter('recyclage', 'time', 'recyclageTime');
    setupFilter('recyclage', 'cost', 'recyclageCost');
}

function setupFilter(type, key, elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.addEventListener("change", (e) => {
            filters[type][key] = e.target.value;

            // Relancer la recherche si un terme est déjà saisi
            const inputEl = type === 'creation' ? $objetCreation : $objetRecyclage;
            if (inputEl.value.trim()) {
                handleSearch(type);
            }
        });
    }
}

function showToast(message, type = "info") {
    // Toast simplifié
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => toast.remove(), 3000);
}

function initNavigate() {
    const grid = document.getElementById("tutoriels-grid");
    if (!grid || !appData) return;

    grid.innerHTML = ""; // Clear existing content

    Object.values(appData).forEach(item => {
        const card = document.createElement("div");
        card.className = "tutorial-card card-animated";

        // Description courte (tentative d'extraction)
        let description = "Découvrez ce projet maker incroyable.";
        if (item.conseils && item.conseils.length > 0) {
            description = item.conseils[0];
        } else if (item.original.introduction && item.original.introduction.length > 0 && item.original.introduction[0].titre) {
            // Prend les 100 premiers caractères de l'intro
            description = item.original.introduction[0].titre.substring(0, 100) + "...";
        }

        // Tags (Matériaux limités à 3)
        const tagsHtml = item.materiaux.slice(0, 3).map(m => `<span class="tag">${m}</span>`).join('');

        card.innerHTML = `
            <div class="tutorial-badge">${item.difficulté}</div>
            <img src="${item.image}" alt="${item.titre}" class="tutorial-img" style="object-fit: cover; height: 200px; width: 100%;">
            <div class="tutorial-content">
                <h3>${item.titre}</h3>
                <p class="tutorial-desc">${description}</p>
                <div class="tutorial-tags">
                    ${tagsHtml}
                </div>
                <button class="btn btn-tutorial">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    Voir le tutoriel
                </button>
            </div>
        `;

        // Click listener
        card.addEventListener("click", () => {
            loadTutorial(item);
        });

        grid.appendChild(card);
    });
}
