const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');

// Load data
const dataPath = path.join(__dirname, '../data/tutoriels.json');
const rawData = fs.readFileSync(dataPath);
const data = JSON.parse(rawData);

const creationTutorials = data.creation;
const recyclageTutorials = data.recyclage;

// Fuse options (same as app.js)
const options = {
    keys: [
        'titre',
        'materiaux',
        'outils',
        'objets_possibles',
        'composants_recuperables',
        'projet_principal.nom'
    ],
    threshold: 0.4,
    includeScore: true
};

const fuseCreation = new Fuse(creationTutorials, options);
const fuseRecyclage = new Fuse(recyclageTutorials, options);

function runTest(name, fuseInstance, query, expectedTitle) {
    const results = fuseInstance.search(query);
    const bestMatch = results.length > 0 ? results[0].item : null;

    if (bestMatch && bestMatch.titre === expectedTitle) {
        console.log(`[PASS] ${name}: Query "${query}" found "${bestMatch.titre}"`);
        return true;
    } else {
        console.error(`[FAIL] ${name}: Query "${query}"`);
        console.error(`       Expected: "${expectedTitle}"`);
        console.error(`       Found:    "${bestMatch ? bestMatch.titre : 'Nothing'}"`);
        return false;
    }
}

console.log("Running Search Verification Tests...\n");

let passed = 0;
let total = 0;

// Test 1: Creation - Fuzzy Search (Typo)
total++;
if (runTest("Creation Fuzzy", fuseCreation, "lqmpe", "Lampe de Bureau Design")) passed++;

// Test 2: Recyclage - Exact Search
total++;
if (runTest("Recyclage Exact", fuseRecyclage, "bouteille", "Recyclage de Bouteilles Plastique")) passed++;

// Test 3: Recyclage - Partial/Fuzzy
total++;
if (runTest("Recyclage Fuzzy", fuseRecyclage, "ordinateur", "Recyclage d'Ordinateur")) passed++;

// Test 4: Creation - Material Search
total++;
if (runTest("Creation Material", fuseCreation, "arduino", "Station Météo Connectée")) passed++;

console.log(`\nResults: ${passed}/${total} tests passed.`);

if (passed === total) {
    process.exit(0);
} else {
    process.exit(1);
}
