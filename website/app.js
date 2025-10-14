const home = document.getElementById('home');
const pages = document.querySelectorAll('.page'); // récup touts les éléments de classe .page

document.querySelectorAll('.home .btn').forEach(btn => { // selectionne ts les boutons de .home
  btn.addEventListener('click', () => {
    const target = btn.dataset.page; // soit creation soit navigaute
    home.style.display = 'none'; // cache la page
    document.getElementById(target).classList.add('active'); // rend la page ciblée visible 
  });
});

document.querySelectorAll('.back-btn').forEach(btn => { // séléctionne bouton retour et enlève la classe active
  btn.addEventListener('click', () => {
    pages.forEach(p => p.classList.remove('active'));
    home.style.display = 'flex'; // réactive la page d'acceuil
  });
});

const state = { creation: { objet: '', pieces: [] } }; // state un objet qui contient objet: "" et piece: []
const $objet = document.getElementById('objet'); // on recup les éléments du fichier html
const $piece = document.getElementById('piece');
const $addPiece = document.getElementById('addPiece');  
const $pieces = document.getElementById('pieces');
const $creationOut = document.getElementById('creationOut');

$objet.addEventListener('input', e => state.creation.objet = e.target.value.trim());

$addPiece.addEventListener('click', () => {
  const val = $piece.value.trim();
  if (!val) return;
  state.creation.pieces.push(val);
  $piece.value = '';
  renderPieces();
});

function renderPieces() {  // met à jour la liste de pièce
  $pieces.innerHTML = '';
  state.creation.pieces.forEach((p, i) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = `<span>${p}</span><span class="x">×</span>`;
    chip.querySelector('.x').addEventListener('click', () => {
      state.creation.pieces.splice(i, 1);
      renderPieces();
    });
    $pieces.appendChild(chip);
  });
}

document.getElementById('genCreation').addEventListener('click', () => {
  const { objet, pieces } = state.creation;
  if (!objet && pieces.length === 0) {
    $creationOut.textContent = 'Ajoute au moins un objet ou une pièce.';
    return;
  }
  const plan = [];
  if (objet) plan.push(`Cible: ${objet}`);
  if (pieces.length) {
    plan.push('Étapes:');
    plan.push('  1) toucher marc');
    
  }
  $creationOut.innerHTML = `<pre>${plan.join('\\n')}</pre>`;
});
