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
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&family=Space+Grotesk:wght@700;800&display=swap');

    /* Variables CSS inspirées du thème du website */
    :root {
      --bg-main: #1a0f00;
      --bg-card: #502800;
      --bg-card-hover: #6b3600;

      --line-color: #00db21;
      --accent-primary: #00db21;
      --primary-color: #00db21;
      --primary-dark: #00a218;
      --accent-color: #d0db00;
      --accent-orange: #f07800;

      --warning-bg: #6b3600;
      --warning-border: #f07800;

      --text-primary: #ffffff;
      --text-secondary: rgba(255, 255, 255, 0.8);
      --border-color: #6b3600;

      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
      --shadow-neon: 0 0 20px rgba(0, 219, 33, 0.3);
      --shadow-neon-strong: 0 12px 30px rgba(0, 219, 33, 0.4);

      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;

      --font-title: "Space Grotesk", sans-serif;
      --font-body: "Roboto Mono", monospace;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes backdropDrift {
      0% {
        transform: translate3d(0, 0, 0) scale(1);
      }
      100% {
        transform: translate3d(-30px, -20px, 0) scale(1.05);
      }
    }

    @keyframes glowPulse {
      0%, 100% {
        box-shadow: 0 0 20px rgba(0, 219, 33, 0.3);
      }
      50% {
        box-shadow: 0 0 30px rgba(0, 219, 33, 0.6);
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-body);
      max-width: 960px;
      margin: 0 auto;
      background-color: var(--bg-main);
      background-image:
        linear-gradient(var(--line-color) 1px, transparent 1px),
        linear-gradient(to right, var(--line-color) 1px, var(--bg-main) 1px);
      background-size: 40px 40px;
      background-position: -1px -1px;
      color: var(--text-primary);
      line-height: 1.7;
      padding: 40px 40px;
      font-size: 16px;
      min-height: 100vh;
      position: relative;
      animation: fadeIn 0.6s ease-out;
    }

    /* Effet de fond animé subtil */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      opacity: 0.12;
      background:
        radial-gradient(
          circle at 28% 20%,
          rgba(0, 219, 33, 0.35),
          transparent 45%
        ),
        radial-gradient(
          circle at 72% 78%,
          rgba(208, 219, 0, 0.25),
          transparent 52%
        );
      animation: backdropDrift 30s ease-in-out infinite alternate;
    }

    body > * {
      position: relative;
      z-index: 1;
    }

    /* En-tête principal */
    header {
      background: var(--bg-card);
      padding: 40px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg), 0 0 40px rgba(0, 219, 33, 0.15);
      border: 2px dashed var(--line-color);
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
      animation: slideIn 0.6s ease-out;
      transition: all 0.3s ease;
      text-align: center;
    }

    header:hover {
      border-color: var(--accent-primary);
      box-shadow: var(--shadow-lg), 0 0 50px rgba(0, 219, 33, 0.25);
      transform: translateY(-2px);
    }

    header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: linear-gradient(90deg,
        var(--primary-color) 0%,
        var(--accent-color) 50%,
        var(--primary-color) 100%);
      box-shadow: 0 0 20px var(--primary-color);
      animation: glowPulse 3s ease-in-out infinite;
    }

    h1 {
      color: var(--text-primary);
      font-family: var(--font-title);
      font-size: 2.8em;
      font-weight: 800;
      margin: 0 auto 0.5em;
      line-height: 1.1;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-shadow:
        0 0 30px rgba(0, 219, 33, 0.7),
        0 0 60px rgba(0, 219, 33, 0.4),
        0 4px 8px rgba(0, 0, 0, 0.9);
      background: linear-gradient(135deg, #00db21 0%, #d0db00 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      display: inline-block;
      text-align: center;
      width: auto;
      max-width: 100%;
    }

    h1::after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      text-shadow:
        0 0 30px rgba(0, 219, 33, 0.7),
        0 0 60px rgba(0, 219, 33, 0.4);
      -webkit-text-fill-color: rgba(0, 219, 33, 0.3);
    }

    h2 {
      color: var(--primary-color);
      font-family: var(--font-title);
      font-size: 1.8em;
      font-weight: 700;
      margin: 1.5em 0 0.8em 0;
      display: flex;
      align-items: center;
      gap: 0.4em;
      border-bottom: 3px solid var(--primary-color);
      padding-bottom: 0.4em;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-shadow: 0 0 15px rgba(0, 219, 33, 0.4);
      position: relative;
    }

    h2::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 60px;
      height: 3px;
      background: var(--accent-color);
      box-shadow: 0 0 10px var(--accent-color);
    }

    h3 {
      color: var(--accent-color);
      font-family: var(--font-title);
      font-size: 1.3em;
      font-weight: 700;
      margin: 1.2em 0 0.6em 0;
      letter-spacing: 0.05em;
      text-shadow: 0 0 10px rgba(208, 219, 0, 0.3);
    }

    p {
      margin: 0.8em 0;
      color: var(--text-primary);
      line-height: 1.8;
    }

    strong {
      color: var(--accent-color);
      font-weight: 700;
    }

    /* Image principale */
    header img {
      max-width: 100%;
      height: auto;
      border-radius: var(--radius-md);
      border: 2px solid var(--line-color);
      box-shadow: var(--shadow-md), 0 0 20px rgba(0, 219, 33, 0.2);
      margin: 2em auto;
      display: block;
      transition: all 0.4s ease;
      filter: brightness(0.85) contrast(1.1);
    }

    header img:hover {
      transform: scale(1.03) translateY(-4px);
      box-shadow: var(--shadow-lg), 0 0 40px rgba(0, 219, 33, 0.4);
      border-color: var(--accent-color);
      filter: brightness(1) contrast(1.2);
    }

    /* Informations du tutoriel */
    header > p {
      margin: 1em auto;
      font-size: 0.95em;
      line-height: 1.8;
      text-align: center;
      max-width: 800px;
    }

    header strong {
      color: var(--accent-color);
      font-weight: 700;
      text-shadow: 0 0 8px rgba(208, 219, 0, 0.3);
    }

    header a {
      color: var(--primary-color);
      text-decoration: underline;
      font-weight: 600;
      transition: all 0.3s ease;
      position: relative;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(0, 219, 33, 0.1);
      border: 1px solid rgba(0, 219, 33, 0.3);
      display: inline-block;
    }

    header a:hover {
      color: var(--accent-color);
      background: rgba(0, 219, 33, 0.2);
      border-color: var(--accent-primary);
      text-decoration: none;
      text-shadow: 0 0 10px rgba(0, 219, 33, 0.5);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 219, 33, 0.3);
    }

    /* Style des liens dans les sections */
    .section a {
      color: var(--primary-color);
      text-decoration: underline;
      font-weight: 600;
      transition: all 0.3s ease;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(0, 219, 33, 0.1);
      border: 1px solid rgba(0, 219, 33, 0.3);
      display: inline-block;
    }

    .section a:hover {
      color: var(--accent-color);
      background: rgba(0, 219, 33, 0.2);
      border-color: var(--accent-primary);
      text-decoration: none;
      text-shadow: 0 0 10px rgba(0, 219, 33, 0.5);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 219, 33, 0.3);
    }

    /* Listes */
    ul, ol {
      margin: 1em 0 1em 2em;
      line-height: 1.8;
    }

    li {
      margin: 0.8em 0;
      color: var(--text-primary);
      position: relative;
      padding-left: 0.5em;
      transition: all 0.2s ease;
    }

    li:hover {
      color: var(--accent-color);
      transform: translateX(4px);
    }

    ol > li {
      padding-left: 0.8em;
    }

    ul > li::marker {
      color: var(--primary-color);
      font-size: 1.2em;
    }

    ol > li::marker {
      color: var(--primary-color);
      font-weight: 800;
      font-family: var(--font-title);
    }

    /* Sous-listes */
    ol > li ul,
    ul > li ul {
      margin: 0.5em 0 0.5em 1.5em;
    }

    ol > li strong {
      color: var(--text-primary);
      font-weight: 600;
      display: block;
      margin-bottom: 0.4em;
    }

    /* Sections */
    .section {
      background: var(--bg-card);
      padding: 40px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md), 0 0 0 rgba(0, 219, 33, 0);
      border: 2px dashed var(--line-color);
      margin-bottom: 40px;
      transition: all 0.4s ease;
      animation: slideIn 0.6s ease-out backwards;
      position: relative;
    }

    .section:nth-child(2) { animation-delay: 0.1s; }
    .section:nth-child(3) { animation-delay: 0.2s; }
    .section:nth-child(4) { animation-delay: 0.3s; }
    .section:nth-child(5) { animation-delay: 0.4s; }

    .section:hover {
      box-shadow: var(--shadow-neon-strong), 0 4px 20px rgba(0, 0, 0, 0.3);
      border-color: var(--accent-primary);
      transform: translateY(-4px);
      border-style: solid;
    }

    .section h2 {
      margin-top: 0;
    }

    .section p:first-child {
      margin-top: 0;
    }

    header p:first-child {
      margin-top: 1.5em;
    }

    /* Section Matériaux */
    .section.materials ul ul {
      color: var(--text-secondary);
      font-size: 0.9em;
      margin-top: 0.4em;
    }

    .section.materials > ul > li {
      font-weight: 500;
    }

    /* Section Mentions Légales */
    .section.legal-notices {
      background: var(--warning-bg);
      border: 2px dashed var(--warning-border);
      border-left: 6px solid var(--warning-border);
      padding: 25px 30px;
      position: relative;
      box-shadow: 0 4px 16px rgba(240, 120, 0, 0.2);
    }

    .section.legal-notices:hover {
      border-color: var(--accent-orange);
      box-shadow: 0 8px 30px rgba(240, 120, 0, 0.3);
    }

    .section.legal-notices::before {
      content: '⚠️';
      position: absolute;
      top: 25px;
      right: 25px;
      font-size: 2em;
      opacity: 0.5;
    }

    .section.legal-notices h2 {
      color: var(--accent-orange);
      border-bottom-color: var(--accent-orange);
    }

    .legal-content {
      color: var(--text-primary);
    }

    .legal-content p {
      margin: 1em 0;
      line-height: 1.7;
    }

    .legal-content p:first-child {
      margin-top: 0;
    }

    .legal-content strong {
      color: var(--accent-orange);
    }

    .legal-content ul {
      margin: 0.8em 0 1em 2em;
    }

    .legal-content li {
      margin: 0.5em 0;
      line-height: 1.6;
    }

    /* Section Étapes */
    .section.steps > ol {
      counter-reset: step-counter;
      list-style: none;
      margin-left: 0;
    }

    .section.steps > ol > li {
      counter-increment: step-counter;
      margin-bottom: 3em;
      padding: 25px;
      background: rgba(107, 54, 0, 0.3);
      border-radius: var(--radius-md);
      border: 2px dashed var(--primary-color);
      border-left: 5px solid var(--primary-color);
      position: relative;
      transition: all 0.4s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .section.steps > ol > li:hover {
      background: rgba(107, 54, 0, 0.5);
      box-shadow: var(--shadow-neon-strong), 0 8px 20px rgba(0, 0, 0, 0.4);
      transform: translateX(8px);
      border-style: solid;
    }

    .section.steps > ol > li::before {
      content: counter(step-counter);
      position: absolute;
      top: -15px;
      left: -15px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: var(--bg-main);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-title);
      font-weight: 800;
      font-size: 1.4em;
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(0, 219, 33, 0.6),
        inset 0 2px 4px rgba(255, 255, 255, 0.2);
      border: 3px solid var(--bg-main);
      transition: all 0.3s ease;
    }

    .section.steps > ol > li:hover::before {
      transform: scale(1.1) rotate(5deg);
      box-shadow:
        0 6px 20px rgba(0, 0, 0, 0.5),
        0 0 40px rgba(0, 219, 33, 0.8),
        inset 0 2px 4px rgba(255, 255, 255, 0.3);
    }

    .section.steps > ol > li > strong:first-child {
      display: block;
      font-size: 1.3em;
      color: var(--accent-color);
      margin-bottom: 1em;
      padding-left: 45px;
      font-weight: 700;
      font-family: var(--font-title);
      letter-spacing: 0.03em;
      text-shadow: 0 0 10px rgba(208, 219, 0, 0.3);
    }

    .section.steps > ol > li > p {
      margin: 0.8em 0;
      padding-left: 10px;
    }

    .section.steps > ol > li > ol,
    .section.steps > ol > li > ul {
      margin-left: 10px;
    }

    /* Images des étapes */
    .step-images {
      margin: 1.5em 0;
      display: grid;
      gap: 12px;
      background: rgba(26, 15, 0, 0.6);
      border: 2px dashed var(--line-color);
      padding: 15px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm), inset 0 2px 8px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }

    .step-images:hover {
      border-color: var(--accent-primary);
      box-shadow: var(--shadow-md), 0 0 20px rgba(0, 219, 33, 0.2);
      border-style: solid;
    }

    .step-images.count-1 { grid-template-columns: 1fr; }
    .step-images.count-2 { grid-template-columns: repeat(2, 1fr); }
    .step-images.count-3 { grid-template-columns: repeat(3, 1fr); }
    .step-images.count-4,
    .step-images.count-5,
    .step-images.count-6,
    .step-images.count-7,
    .step-images.count-8,
    .step-images.count-9,
    .step-images.count-10 {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    figure {
      margin: 0;
      text-align: center;
      background: rgba(80, 40, 0, 0.5);
      padding: 8px;
      border-radius: var(--radius-sm);
      border: 2px solid var(--border-color);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;
    }

    figure::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--radius-sm);
      opacity: 0;
      background: radial-gradient(circle at center, rgba(0, 219, 33, 0.1), transparent);
      transition: opacity 0.3s ease;
    }

    figure:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 8px 20px rgba(0, 219, 33, 0.3);
      border-color: var(--accent-primary);
    }

    figure:hover::before {
      opacity: 1;
    }

    .step-images figure img {
      width: auto;
      max-width: 100%;
      max-height: 180px;
      object-fit: contain;
      background: rgba(0, 0, 0, 0.4);
      border-radius: var(--radius-sm);
      border: 1px solid rgba(0, 219, 33, 0.2);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: zoom-in;
      display: block;
      margin: 0 auto;
      transition: all 0.3s ease;
      filter: brightness(0.9) contrast(1.05);
    }

    .step-images figure img:hover {
      transform: scale(1.08);
      filter: brightness(1) contrast(1.15);
      border-color: var(--accent-color);
      box-shadow: 0 4px 12px rgba(0, 219, 33, 0.4);
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

    .lightbox-caption {
      color: white;
      margin-top: 1em;
      font-size: 1em;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    }

    .lightbox-close {
      position: absolute;
      top: 20px;
      right: 30px;
      color: white;
      background: rgba(0, 0, 0, 0.7);
      width: 56px;
      height: 56px;
      border: 3px solid white;
      border-radius: 50%;
      font-size: 1.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }

    .lightbox-close:hover {
      background: var(--primary-color);
      transform: rotate(90deg) scale(1.1);
      box-shadow: 0 0 30px rgba(0, 219, 33, 0.6);
      border-color: var(--accent-color);
    }

    /* Fichiers attachés */
    .fichiers-list {
      list-style: none;
      padding-left: 0;
      margin: 1.5em 0;
    }

    .fichiers-list li {
      padding: 12px 16px;
      margin: 8px 0;
      background: rgba(107, 54, 0, 0.3);
      border-radius: var(--radius-sm);
      border: 2px dashed var(--border-color);
      border-left: 4px solid var(--primary-color);
      transition: all 0.3s ease;
      position: relative;
    }

    .fichiers-list li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 0;
      background: var(--accent-color);
      transition: height 0.3s ease;
      box-shadow: 0 0 10px var(--accent-color);
    }

    .fichiers-list li:hover {
      transform: translateX(8px);
      box-shadow: var(--shadow-neon), 0 4px 12px rgba(0, 0, 0, 0.3);
      border-color: var(--accent-primary);
      border-style: solid;
      background: rgba(107, 54, 0, 0.5);
    }

    .fichiers-list li:hover::before {
      height: 100%;
    }

    .fichiers-list a {
      color: var(--primary-color);
      text-decoration: underline;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(0, 219, 33, 0.1);
      border: 1px solid rgba(0, 219, 33, 0.3);
      transition: all 0.3s ease;
    }

    .fichiers-list a:hover {
      color: var(--accent-color);
      background: rgba(0, 219, 33, 0.2);
      border-color: var(--accent-primary);
      text-decoration: none;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 219, 33, 0.3);
    }

    .fichiers-list a::before {
      content: '📎';
      font-size: 1.2em;
    }

    .fichiers-list a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    .fichiers-list .meta {
      font-size: 0.85em;
      color: var(--text-secondary);
      font-style: italic;
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
    ${
      image
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
    ${
      lien
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
