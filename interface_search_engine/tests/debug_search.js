const Fuse = require('fuse.js');
const fs = require('fs');
const path = require('path');

// Load data manually since we are in node environment
// We can't require data.js directly because it sets a global variable
// So we'll read it and eval it or just copy the data structure here for testing
// Actually, let's just read the JSON content from the file we created earlier (tutoriels.json)
// even though the app uses data.js, the content is the same.
const dataPath = path.join(__dirname, '../data/tutoriels.json');
const rawData = fs.readFileSync(dataPath);
const data = JSON.parse(rawData);

const creationTutorials = data.creation;
const recyclageTutorials = data.recyclage;

const options = {
    keys: [
        { name: 'titre', weight: 3 },
        { name: 'projet_principal.nom', weight: 2 },
        { name: 'objets_possibles', weight: 1 },
        { name: 'materiaux', weight: 0.5 },
        { name: 'outils', weight: 0.5 },
        { name: 'composants_recuperables', weight: 0.5 }
    ],
    threshold: 0.4, // Back to 0.4
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true // Search anywhere in the string
};

const fuseCreation = new Fuse(creationTutorials, options);
const fuseRecyclage = new Fuse(recyclageTutorials, options);

function debugSearch(term) {
    console.log(`\n--- Debugging search for: "${term}" ---`);

    console.log("Creation Results:");
    const resCreation = fuseCreation.search(term);
    resCreation.slice(0, 3).forEach(res => {
        console.log(`  [Score: ${res.score.toFixed(4)}] ${res.item.titre}`);
        res.matches.forEach(m => {
            console.log(`    Matched key: ${m.key}, Value: "${m.value}"`);
        });
    });

    console.log("Recyclage Results:");
    const resRecyclage = fuseRecyclage.search(term);
    resRecyclage.slice(0, 3).forEach(res => {
        console.log(`  [Score: ${res.score.toFixed(4)}] ${res.item.titre}`);
        res.matches.forEach(m => {
            console.log(`    Matched key: ${m.key}, Value: "${m.value}"`);
        });
    });
}

debugSearch("vélo");
debugSearch("lqmpe");
