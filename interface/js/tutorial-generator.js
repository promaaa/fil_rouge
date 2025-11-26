/**
 * Générateur de tutoriels HTML à partir de données JSON structurées
 * Compatible avec les données issues de data_exemple.json
 * Structure identique à output.html
 */

class TutorialGenerator {
  /**
   * Génère un document HTML complet à partir de données JSON de tutoriel
   * @param {Object} tutorialData - Les données du tutoriel au format JSON
   * @param {string} tutorialKey - La clé du tutoriel dans l'objet JSON
   * @returns {string} - Le HTML généré
   */
  static generateHTML(tutorialData, tutorialKey) {
    const data = tutorialData[tutorialKey];
    if (!data) {
      console.error(`Tutoriel "${tutorialKey}" non trouvé dans les données`);
      return "";
    }

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeHtml(data.titre?.[0] || "Tutoriel")}</title>
  ${this.generateStyles()}
</head>
<body>

  ${this.generateHeader(data)}

  ${this.generateIntroduction(data)}

  ${this.generateLegalNotices(data)}

  ${this.generateMaterials(data)}

  ${this.generateTools(data)}

  ${this.generateSteps(data)}

  ${this.generateAnnexes(data)}

  ${this.generateLightbox()}

  ${this.generateScripts()}

</body>
</html>`;
  }

  static generateStyles() {
    return `
  <style>
    /* Import des polices du website */
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap');

    /* Variables CSS - Thème sobre et professionnel */
    :root {
      --bg-main: #1a0f00;
      --bg-card: #2c1800; /* Plus sombre pour le contraste */
      --bg-card-hover: #3d2200;

      --line-color: #00db21;
      --accent-primary: #00db21;
      --primary-color: #00db21;
      --accent-color: #d0db00;
      --accent-orange: #f07800;

      --text-primary: #ffffff;
      --text-secondary: rgba(255, 255, 255, 0.9);
      --border-color: #502800;

      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;

      --font-title: "Space Grotesk", sans-serif;
      --font-body: "Roboto Mono", monospace;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-body);
      max-width: 900px;
      margin: 0 auto;
      background-color: var(--bg-main);
      color: var(--text-primary);
      line-height: 1.6;
      padding: 40px;
      font-size: 15px;
      min-height: 100vh;
    }

    /* En-tête principal - Style Document */
    header {
      border-bottom: 2px solid var(--line-color);
      padding-bottom: 30px;
      margin-bottom: 40px;
      text-align: left;
    }

    h1 {
      color: var(--text-primary);
      font-family: var(--font-title);
      font-size: 2.4em;
      font-weight: 700;
      margin-bottom: 0.2em;
      letter-spacing: -0.02em;
      text-transform: none; /* Plus lisible */
    }

    header > p {
      color: var(--text-secondary);
      font-size: 1.1em;
      max-width: 800px;
      margin-top: 10px;
    }

    /* Titres de section */
    h2 {
      color: var(--primary-color);
      font-family: var(--font-title);
      font-size: 1.5em;
      font-weight: 700;
      margin: 2em 0 1em 0;
      padding-bottom: 0.5em;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    h3 {
      color: var(--accent-color);
      font-family: var(--font-title);
      font-size: 1.2em;
      font-weight: 600;
      margin: 1.5em 0 0.8em 0;
    }

    p {
      margin-bottom: 1em;
      color: var(--text-secondary);
    }

    strong {
      color: var(--text-primary);
      font-weight: 700;
    }

    /* Image principale */
    header img {
      max-width: 100%;
      height: auto;
      border-radius: var(--radius-md);
      margin-top: 20px;
      border: 1px solid var(--border-color);
    }

    /* Sections - Style "Carte" sobre */
    .section {
      background: var(--bg-card);
      padding: 25px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      margin-bottom: 30px;
    }

    /* Listes */
    ul, ol {
      margin: 0 0 1em 1.5em;
    }

    li {
      margin-bottom: 0.5em;
      color: var(--text-secondary);
    }

    ul > li::marker {
      color: var(--primary-color);
    }

    ol > li::marker {
      color: var(--primary-color);
      font-weight: 600;
    }

    /* Section Mentions Légales */
    .section.legal-notices {
      background: rgba(240, 120, 0, 0.1);
      border: 1px solid var(--accent-orange);
      border-left: 4px solid var(--accent-orange);
    }

    .section.legal-notices h2 {
      color: var(--accent-orange);
      border-bottom-color: rgba(240, 120, 0, 0.3);
      margin-top: 0;
    }

    /* Section Étapes - Style clair */
    .section.steps {
      background: transparent;
      border: none;
      padding: 0;
    }

    .section.steps > ol {
      list-style: none;
      margin: 0;
      counter-reset: step-counter;
    }

    .section.steps > ol > li {
      counter-increment: step-counter;
      margin-bottom: 2em;
      padding: 20px;
      background: var(--bg-card);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      position: relative;
    }

    .section.steps > ol > li::before {
      content: counter(step-counter);
      position: absolute;
      top: -12px;
      left: -12px;
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      color: #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-family: var(--font-title);
      font-size: 1.1em;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .section.steps > ol > li > strong:first-child {
      display: block;
      font-size: 1.2em;
      color: var(--text-primary);
      margin-bottom: 0.5em;
      font-family: var(--font-title);
    }

    /* Images des étapes */
    .step-images {
      margin-top: 15px;
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    .step-images figure img {
      width: 100%;
      height: 150px;
      object-fit: contain;
      background: rgba(0, 0, 0, 0.2);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
    }
    }

    .step-images.count-1 figure img {
      max-width: 100%;
      max-height: 400px;
    }

    .step-images figure figcaption {
      display: none;
    }

    figcaption {
      font-size: 0.85em;
      color: var(--text-secondary);
      margin-top: 0.6em;
      font-style: italic;
      line-height: 1.4;
    }

    /* Lightbox */
    .lightbox-overlay {
      position: fixed;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      padding: 20px;
      backdrop-filter: blur(8px);
    }

    .lightbox-overlay.active {
      display: flex;
      animation: fadeIn 0.2s ease;
    }

    .lightbox-content {
      max-width: 95%;
      max-height: 95%;
      text-align: center;
      animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes zoomIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .lightbox-content img {
      max-width: 100%;
      max-height: 85vh;
      border-radius: var(--radius-md);
      border: 3px solid var(--line-color);
      box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.9),
        0 0 50px rgba(0, 219, 33, 0.3);
    }

    /* Liens globaux - Haute visibilité, pas de bleu */
    a {
      color: var(--accent-color); /* Jaune/Vert vif */
      text-decoration: none;
      border-bottom: 1px solid var(--accent-color);
      transition: all 0.2s ease;
      font-weight: 500;
    }

    a:hover {
      color: #ffffff;
      background: rgba(208, 219, 0, 0.15);
      border-bottom-color: transparent;
    }

    /* Header et Section links overrides (si nécessaire pour spécificité) */
    header a, .section a {
      color: var(--accent-color);
      border-bottom: 1px solid var(--accent-color);
      background: transparent;
      padding: 0 2px;
      border-radius: 2px;
    }

    header a:hover, .section a:hover {
      color: #ffffff;
      background: rgba(208, 219, 0, 0.2);
      text-decoration: none;
      box-shadow: none;
      transform: none;
      border-color: transparent;
    }

    /* Fichiers attachés - Style "Carte Professionnelle" */
    .fichiers-list {
      list-style: none;
      padding: 0;
      margin: 1.5em 0;
      display: grid;
      gap: 12px;
    }

    .fichiers-list li {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-left: 4px solid var(--primary-color); /* Vert */
      padding: 16px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
    }

    .fichiers-list li:hover {
      transform: translateX(4px);
      background: #332200; /* Légèrement plus clair */
      border-color: var(--primary-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .fichiers-list a {
      color: var(--text-primary);
      font-weight: 700;
      border-bottom: none;
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .fichiers-list a:hover {
      background: transparent;
      color: var(--primary-color);
    }

    .fichiers-list a::before {
      content: '📄';
      font-size: 1.4em;
      filter: grayscale(100%);
      transition: filter 0.2s;
    }

    .fichiers-list li:hover a::before {
      filter: grayscale(0%);
    }

    .fichiers-list .meta {
      font-size: 0.85em;
      color: var(--text-secondary);
      margin-left: auto;
      font-weight: 400;
      background: rgba(0,0,0,0.2);
      padding: 4px 8px;
      border-radius: 4px;
    }
      margin-left: 30px;
    }

    /* Pied de page / Annexes */
    footer {
      background: var(--bg-card);
      margin-top: 40px;
      padding: 30px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md), 0 0 0 rgba(208, 219, 0, 0);
      border: 2px dashed var(--accent-color);
      border-top: 6px solid var(--accent-color);
      transition: all 0.4s ease;
      animation: slideIn 0.8s ease-out backwards;
      animation-delay: 0.6s;
    }

    footer:hover {
      box-shadow: 0 8px 30px rgba(208, 219, 0, 0.4), 0 0 40px rgba(208, 219, 0, 0.2);
      transform: translateY(-4px);
      border-style: solid;
    }

    footer h2 {
      margin-top: 0;
      color: var(--accent-color);
    }

    footer p {
      margin: 1em 0;
    }

    footer a {
      color: var(--accent-color);
      text-decoration: none;
      font-weight: 600;
      word-break: break-all;
      position: relative;
      padding: 2px 4px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    footer a::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
      transition: width 0.3s ease;
      box-shadow: 0 0 10px var(--accent-color);
    }

    footer a:hover {
      color: var(--primary-color);
      background: rgba(208, 219, 0, 0.1);
      text-shadow: 0 0 10px rgba(208, 219, 0, 0.5);
    }

    footer a:hover::before {
      width: 100%;
    }

    /* Style des liens dans le footer */
    footer a {
      text-decoration: underline;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(0, 219, 33, 0.1);
      border: 1px solid rgba(0, 219, 33, 0.3);
      display: inline-block;
      transition: all 0.3s ease;
    }

    footer a:hover {
      text-decoration: none;
      background: rgba(0, 219, 33, 0.2);
      border-color: var(--accent-primary);
      color: var(--accent-color);
      text-shadow: 0 0 10px rgba(0, 219, 33, 0.5);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 219, 33, 0.3);
    }

    /* Responsive */
    @media (max-width: 768px) {
      body {
        padding: 20px 20px;
        font-size: 14px;
        background-size: 30px 30px;
      }

      body::before {
        opacity: 0.08;
      }

      h1 {
        font-size: 1.8em;
        letter-spacing: 0.06em;
      }

      h2 {
        font-size: 1.4em;
        letter-spacing: 0.04em;
      }

      h3 {
        font-size: 1.1em;
      }

      header,
      .section,
      footer {
        padding: 20px 16px;
      }

      header {
        margin-bottom: 20px;
      }

      .section {
        margin-bottom: 20px;
      }

      .section.steps > ol > li {
        padding: 20px 15px 20px 20px;
        margin-bottom: 2em;
      }

      .section.steps > ol > li::before {
        width: 44px;
        height: 44px;
        font-size: 1.1em;
        top: -10px;
        left: -10px;
        border-width: 2px;
      }

      .section.steps > ol > li > strong:first-child {
        font-size: 1.1em;
        padding-left: 30px;
      }

      .step-images {
        padding: 12px;
        gap: 10px;
      }

      .step-images.count-2,
      .step-images.count-3,
      .step-images.count-4,
      .step-images.count-5,
      .step-images.count-6,
      .step-images.count-7,
      .step-images.count-8,
      .step-images.count-9,
      .step-images.count-10 {
        grid-template-columns: 1fr;
      }

      .step-images figure img {
        max-height: 250px;
      }

      ul, ol {
        margin-left: 1.5em;
      }

      .lightbox-close {
        width: 50px;
        height: 50px;
        top: 10px;
        right: 10px;
      }
    }

    /* Tablettes */
    @media (min-width: 769px) and (max-width: 1024px) {
      body {
        padding: 30px 20px;
        font-size: 15px;
      }

      h1 {
        font-size: 2.2em;
      }

      h2 {
        font-size: 1.6em;
      }

      .step-images.count-3,
      .step-images.count-4,
      .step-images.count-5,
      .step-images.count-6,
      .step-images.count-7,
      .step-images.count-8,
      .step-images.count-9,
      .step-images.count-10 {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Impression */
    @media print {
      body {
        background: white;
        color: black;
        padding: 20px;
        max-width: 100%;
      }

      header::before {
        display: none;
      }

      .section,
      header,
      footer {
        background: white;
        box-shadow: none;
        border: 1px solid #ddd;
        page-break-inside: avoid;
      }

      h1, h2, h3 {
        color: black;
        text-shadow: none;
      }

      .section.steps > ol > li::before {
        background: black;
      }

      .lightbox-overlay {
        display: none !important;
      }

      a {
        color: black;
        text-decoration: underline;
      }
    }
  </style>`;
  }

  static generateHeader(data) {
    const titre = this.escapeHtml(data.titre?.[0] || "Tutoriel");

    return `
  <header>
    <h1>${titre}</h1>
  </header>`;
  }

  static generateIntroduction(data) {
    if (!data.introduction || data.introduction.length === 0) return "";

    const image = data.image?.[0];
    const difficulte = this.escapeHtml(data.difficulté?.[0] || "");
    const duree = this.escapeHtml(data.durée?.[0] || "");
    const cout = this.escapeHtml(data.coût?.[0] || "");
    const lien = data.liens?.[0] || "";

    const introContent = data.introduction
      .map((item) => {
        let html = `<p>${this.escapeHtml(item.titre)}</p>`;

        if (item.sous_items && item.sous_items.length > 0) {
          html += "<ul>";
          item.sous_items.forEach((subItem) => {
            html += `<li>${this.escapeHtml(subItem)}</li>`;
          });
          html += "</ul>";
        }

        return html;
      })
      .join("\n");

    return `
  <div class="section">
    <h2>📖 Introduction</h2>
    ${image
        ? `
    <div style="text-align:center; margin-bottom:2em;">
      <img src="${this.escapeHtml(image.url)}" alt="${this.escapeHtml(image.alt || data.titre?.[0] || "")}" style="max-width:100%; max-height:320px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      ${image.description ? `<p style="font-size:0.9em; color:#666; margin-top:1em; font-style:italic;">${this.escapeHtml(image.description)}</p>` : ""}
    </div>
    `
        : ""
      }
    ${introContent}
    <p style="color: #666; font-size: 0.95em;">
      ${difficulte ? `<strong>Difficulté :</strong> ${difficulte} &nbsp;&nbsp;` : ""}
      ${duree ? `<strong>Durée :</strong> ${duree} &nbsp;&nbsp;` : ""}
      ${cout ? `<strong>Coût :</strong> ${cout}` : ""}
    </p>
    ${lien
        ? `
    <p style="font-size:0.95em; color:#066; margin-top:0.2em;">
      <strong>Lien du tutoriel de base :</strong>
      <a href="${this.escapeHtml(lien)}" target="_blank" rel="noopener">${this.escapeHtml(lien)}</a>
    </p>
    `
        : ""
      }
  </div>`;
  }

  static generateLegalNotices(data) {
    if (!data["mentions légales"] || data["mentions légales"].length === 0)
      return "";

    const legalContent = data["mentions légales"]
      .map((item) => {
        let html = "";

        // Si c'est un titre principal
        if (item.titre && item.titre.trim()) {
          html += `<p>${this.escapeHtml(item.titre)}</p>`;
        }

        // Si il y a des sous-items (liste à puces)
        if (item.sous_items && item.sous_items.length > 0) {
          html += "<ul>";
          item.sous_items.forEach((subItem) => {
            html += `<li>${this.escapeHtml(subItem)}</li>`;
          });
          html += "</ul>";
        }

        return html;
      })
      .join("\n");

    return `
  <div class="section legal-notices">
    <h2>⚖️ Mentions Légales</h2>
    <div class="legal-content">
      ${legalContent}
    </div>
  </div>`;
  }

  static generateMaterials(data) {
    if (!data.matériaux || data.matériaux.length === 0) return "";

    const materialsContent = data.matériaux
      .map((item) => {
        let html = `<li>${this.escapeHtml(item.titre)}`;

        if (item.sous_items && item.sous_items.length > 0) {
          html += "<ul>";
          item.sous_items.forEach((subItem) => {
            html += `<li>${this.escapeHtml(subItem)}</li>`;
          });
          html += "</ul>";
        }

        html += "</li>";
        return html;
      })
      .join("\n");

    return `
  <div class="section materials">
    <h2>🛠️ Matériaux</h2>
    <ul>
      ${materialsContent}
    </ul>
  </div>`;
  }

  static generateTools(data) {
    if (!data.outils || data.outils.length === 0) return "";

    const toolsContent = data.outils
      .map((item) => {
        let html = `<li>${this.escapeHtml(item.titre)}`;

        if (item.sous_items && item.sous_items.length > 0) {
          html += "<ul>";
          item.sous_items.forEach((subItem) => {
            html += `<li>${this.escapeHtml(subItem)}</li>`;
          });
          html += "</ul>";
        }

        html += "</li>";
        return html;
      })
      .join("\n");

    return `
  <div class="section">
    <h2>🔧 Outils</h2>
    <ul>
      ${toolsContent}
    </ul>
  </div>`;
  }

  static generateSteps(data) {
    if (!data.étapes || data.étapes.length === 0) return "";

    const stepsContent = data.étapes
      .map((etape) => {
        let html = "<li>\n";

        // Titre de l'étape avec les images juste après (comme dans output.html)
        html += `<strong>${etape.numero}. ${this.escapeHtml(etape.titre)}</strong>`;

        // Solutions (contenu de l'étape)
        if (etape.solutions && etape.solutions.length > 0) {
          etape.solutions.forEach((solution) => {
            // Images directement après le titre (format output.html)
            if (solution.images && solution.images.length > 0) {
              const imageCount = solution.images.length;
              html += `<div class='step-images count-${imageCount}'>`;

              solution.images.forEach((img) => {
                html += `<figure>`;
                html += `<img src='${this.escapeHtml(img.url)}' alt='${this.escapeHtml(img.alt || etape.titre)}' loading='lazy'>`;
                if (img.description) {
                  html += `<figcaption>${this.escapeHtml(img.description)}</figcaption>`;
                }
                html += `</figure>`;
              });

              html += `</div>`;
            }

            // Objectif
            if (solution.objectif && solution.objectif.trim()) {
              html += `<p><em>${this.escapeHtml(solution.objectif)}</em></p>`;
            }

            // Description (fallback pour ancien format)
            if (solution.description && solution.description.trim()) {
              html += `<p><em>${this.escapeHtml(solution.description)}</em></p>`;
            }

            // Matériaux et outils (nouveau format JSON)
            if (
              solution.materiaux_outils &&
              solution.materiaux_outils.length > 0
            ) {
              html += `<p><strong>Matériaux et outils :</strong></p><ul>`;
              solution.materiaux_outils.forEach((item) => {
                if (item && item.trim()) {
                  html += `<li>${this.escapeHtml(item)}</li>`;
                }
              });
              html += `</ul>`;
            }
            // Fallback pour ancien format avec majuscules
            else if (
              solution["Matériaux et outils"] &&
              solution["Matériaux et outils"].length > 0
            ) {
              html += `<p><strong>Matériaux et outils :</strong></p><ul>`;
              solution["Matériaux et outils"].forEach((item) => {
                html += `<li>${this.escapeHtml(item)}</li>`;
              });
              html += `</ul>`;
            }

            // Étapes de la solution (nouveau format JSON avec structure hiérarchique)
            if (solution.etapes && solution.etapes.length > 0) {
              html += `<p><strong>Étapes :</strong></p><ol>`;
              solution.etapes.forEach((step) => {
                if (typeof step === "object" && step !== null) {
                  // Étape avec titre et sous-étapes
                  const titre = step.titre || "";
                  const sous_etapes = step.sous_etapes || [];
                  if (titre.trim()) {
                    html += `<li>${this.escapeHtml(titre)}`;
                    if (sous_etapes.length > 0) {
                      html += `<ul>`;
                      sous_etapes.forEach((sub) => {
                        if (sub && sub.trim()) {
                          html += `<li>${this.escapeHtml(sub)}</li>`;
                        }
                      });
                      html += `</ul>`;
                    }
                    html += `</li>`;
                  }
                } else if (typeof step === "string" && step.trim()) {
                  // Étape simple (string)
                  html += `<li>${this.escapeHtml(step)}</li>`;
                }
              });
              html += `</ol>`;
            }
            // Fallback pour ancien format avec majuscules
            else if (solution["Étapes"] && solution["Étapes"].length > 0) {
              html += `<p><strong>Étapes :</strong></p><ol>`;
              solution["Étapes"].forEach((item) => {
                html += `<li>${this.escapeHtml(item)}</li>`;
              });
              html += `</ol>`;
            }

            // Remarques (nouveau format JSON)
            if (solution.remarques && solution.remarques.length > 0) {
              html += `<p><strong>Remarques :</strong></p><ul>`;
              solution.remarques.forEach((item) => {
                if (item && item.trim()) {
                  html += `<li>${this.escapeHtml(item)}</li>`;
                }
              });
              html += `</ul>`;
            }
            // Fallback pour ancien format avec majuscules
            else if (
              solution["Remarques"] &&
              solution["Remarques"].length > 0
            ) {
              html += `<p><strong>Remarques :</strong></p><ul>`;
              solution["Remarques"].forEach((item) => {
                html += `<li>${this.escapeHtml(item)}</li>`;
              });
              html += `</ul>`;
            }

            // Conseils
            if (solution["Conseils"] && solution["Conseils"].length > 0) {
              html += `<p><strong>Conseils :</strong></p><ul>`;
              solution["Conseils"].forEach((item) => {
                html += `<li>${this.escapeHtml(item)}</li>`;
              });
              html += `</ul>`;
            }

            // Fichiers attachés
            if (solution.fichiers && solution.fichiers.length > 0) {
              // Filtrer les fichiers vides (sans nom ni lien)
              const validFiles = solution.fichiers.filter(
                (f) => f.nom || f.lien,
              );

              if (validFiles.length > 0) {
                html += `<p><strong>Fichiers :</strong></p><ul class="fichiers-list">`;
                validFiles.forEach((fichier) => {
                  html += `<li>`;
                  if (fichier.lien) {
                    const fileName = this.escapeHtml(fichier.nom || "file");
                    html += `<a href="${this.escapeHtml(fichier.lien)}" target="_blank" rel="noopener" download="${fileName}" class="file-link">${this.escapeHtml(fichier.nom || "Télécharger")}</a>`;
                  } else {
                    html += this.escapeHtml(fichier.nom);
                  }
                  if (fichier.type) {
                    html += ` — <span class="meta">${this.escapeHtml(fichier.type)}</span>`;
                  }
                  if (fichier.description) {
                    html += `<br><span style="font-size: 0.85em; color: #666;">${this.escapeHtml(fichier.description)}</span>`;
                  }
                  html += `</li>`;
                });
                html += `</ul>`;
              }
            }
          });
        }

        html += "\n</li>";
        return html;
      })
      .join("\n");

    return `
  <div class="section steps">
    <h2>📋 Étapes</h2>
    <ol>
      ${stepsContent}
    </ol>
  </div>`;
  }

  static generateAnnexes(data) {
    if (!data.annexes || data.annexes.length === 0) return "";

    const annexesContent = data.annexes
      .map((annexe) => {
        let html = `<p><strong>${this.escapeHtml(annexe.titre)}</strong></p>`;

        if (annexe.description) {
          html += `<p>${this.escapeHtml(annexe.description)}</p>`;
        }

        if (annexe.lien) {
          html += `<p><a href="${this.escapeHtml(annexe.lien)}" target="_blank" rel="noopener" class="link">${this.escapeHtml(annexe.lien)}</a></p>`;
        }

        return html;
      })
      .join("\n");

    return `
  <footer>
    <h2>💡 Annexes</h2>
    ${annexesContent}
  </footer>`;
  }

  static generateLightbox() {
    return `
  <div id="lightbox" class="lightbox-overlay" aria-hidden="true">
    <button id="lb-close" class="lightbox-close" aria-label="Fermer">×</button>
    <button id="lb-prev" class="lightbox-control lightbox-prev" aria-label="Image précédente">‹</button>
    <button id="lb-next" class="lightbox-control lightbox-next" aria-label="Image suivante">›</button>
    <div class="lightbox-content">
      <img id="lb-img" src="" alt="">
      <div id="lb-caption" class="lightbox-caption"></div>
    </div>
  </div>`;
  }

  static generateScripts() {
    return `
  <script>
    // Lightbox pour visualiser les images
    document.addEventListener('click', function(ev){
      const fig = ev.target.closest('.step-images figure');
      if(!fig) return;
      const container = fig.closest('.step-images');
      if(!container) return;
      const figures = Array.from(container.querySelectorAll('figure'));
      const idx = figures.indexOf(fig);
      if(idx < 0) return;

      const overlay = document.getElementById('lightbox');
      const imgEl = document.getElementById('lb-img');
      const captionEl = document.getElementById('lb-caption');
      const btnPrev = document.getElementById('lb-prev');
      const btnNext = document.getElementById('lb-next');

      let current = idx;
      function show(i){
        const f = figures[i];
        const im = f.querySelector('img');
        const cap = f.querySelector('figcaption');
        if(im){ imgEl.src = im.src; imgEl.alt = im.alt || ''; }
        captionEl.textContent = cap ? cap.textContent : '';
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden','false');
      }
      function hide(){ overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); }

      show(current);

      document.getElementById('lb-close').onclick = hide;
      overlay.onclick = function(e){ if(e.target === overlay) hide(); };
      if(btnPrev){ btnPrev.onclick = function(e){ e.stopPropagation(); current = Math.max(current-1, 0); show(current); }; }
      if(btnNext){ btnNext.onclick = function(e){ e.stopPropagation(); current = Math.min(current+1, figures.length-1); show(current); }; }
      document.onkeydown = function(e){
        if(e.key === 'Escape') hide();
        if(e.key === 'ArrowRight') { current = Math.min(current+1, figures.length-1); show(current); }
        if(e.key === 'ArrowLeft') { current = Math.max(current-1, 0); show(current); }
      };
    });
  </script>`;
  }

  static escapeHtml(text) {
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

  /**
   * Charge un fichier JSON et génère le HTML pour un tutoriel spécifique
   * @param {string} jsonPath - Chemin vers le fichier JSON
   * @param {string} tutorialKey - Clé du tutoriel à générer
   * @returns {Promise<string>} - Le HTML généré
   */
  static async generateFromFile(jsonPath, tutorialKey) {
    try {
      const response = await fetch(jsonPath);
      const data = await response.json();
      return this.generateHTML(data, tutorialKey);
    } catch (error) {
      console.error("Erreur lors du chargement du fichier JSON:", error);
      return "";
    }
  }

  /**
   * Génère et affiche un tutoriel dans un élément du DOM
   * @param {Object} tutorialData - Les données du tutoriel
   * @param {string} tutorialKey - La clé du tutoriel
   * @param {HTMLElement} targetElement - L'élément où afficher le HTML
   */
  static renderInElement(tutorialData, tutorialKey, targetElement) {
    const html = this.generateHTML(tutorialData, tutorialKey);
    if (targetElement) {
      targetElement.innerHTML = html;
    }
    return html;
  }
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== "undefined" && module.exports) {
  module.exports = TutorialGenerator;
}
