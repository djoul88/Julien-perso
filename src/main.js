// src/main.js
import { questionsData } from './questions.js';
import { generateBriefPrompt } from './prompt.js';

// Initialisation
let step = 'welcome'; // welcome | question | mode | scenarios | rdv | script | qr
let answers = [];
let currentQuestion = 0;
let selectedMode = null; // "secret" | "partage"
let scenarios = [];
let selectedScenario = null;
let scriptHtml = null;
let geminiFollowup = null; // Pour gestion de suivi Gemini (ex: attente date/lieu)
let rdvInfos = {}; // {date, heure, lieu}

const app = document.getElementById('app');

function render() {
  switch (step) {
    case 'welcome': return renderWelcome();
    case 'question': return renderQuestion();
    case 'mode': return renderModeChoice();
    case 'scenarios': return renderScenarios();
    case 'rdv': return renderRdvPrompt();
    case 'script': return renderScript();
    case 'qr': return renderQrPage();
    default: return renderWelcome();
  }
}

function renderWelcome() {
  app.innerHTML = `
    <div class="text-center fade-in">
      <h1 class="text-5xl md:text-6xl font-serif text-amber-400 mb-4">Prompt d'un Instant</h1>
      <p class="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
        <span class="block mb-2 font-serif text-2xl text-amber-300">
          Imaginez votre scénario intime, unique et sur-mesure.
        </span>
        En quelques questions, générez un brief précis, puis laissez Gemini imaginer une expérience parfaite pour votre duo.
      </p>
      <button class="btn-main" id="start-btn">Commencer</button>
    </div>
  `;
  document.getElementById('start-btn').onclick = () => {
    answers = [];
    currentQuestion = 0;
    step = 'question';
    render();
  };
}

function renderQuestion() {
  const qData = questionsData[currentQuestion];
  if (!qData) {
    step = 'mode';
    render();
    return;
  }
  let progress = Math.round((currentQuestion / questionsData.length) * 100);
  let optionsHtml = '';
  qData.options.forEach((opt, idx) => {
    if (opt.type === 'text') {
      optionsHtml += `
        <div>
          <button class="btn-secondary mb-2" id="text-btn-${idx}">${opt.text}</button>
          <div id="text-field-${idx}" style="display:none;">
            <input type="text" class="w-full bg-gray-800 border-2 border-gray-600 focus:border-amber-500 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 mb-2" placeholder="Précisez ici..." id="custom-input-${idx}" />
            <button class="btn-main" id="validate-btn-${idx}">Valider</button>
          </div>
        </div>`;
    } else {
      optionsHtml += `<button class="btn-main mb-2" id="opt-btn-${idx}">${opt.text}</button>`;
    }
  });

  app.innerHTML = `
    <div>
      <div class="flex justify-between items-center mb-4">
        ${currentQuestion > 0 ? `<button class="text-amber-400 font-semibold hover:underline" id="back-btn">&larr; Retour</button>` : '<div></div>'}
        <div class="w-full bg-gray-700 rounded-full h-2.5 mx-2">
          <div style="width:${progress}%" class="bg-amber-500 h-2.5 rounded-full"></div>
        </div>
      </div>
      <h2 class="text-2xl md:text-3xl font-light text-center mb-8">${qData.question}</h2>
      <div class="answers-grid">${optionsHtml}</div>
    </div>
  `;

  qData.options.forEach((opt, idx) => {
    if (opt.type === 'text') {
      document.getElementById(`text-btn-${idx}`).onclick = () => {
        document.getElementById(`text-field-${idx}`).style.display = 'block';
      };
      document.getElementById(`validate-btn-${idx}`).onclick = () => {
        const val = document.getElementById(`custom-input-${idx}`).value.trim();
        if (val) {
          answers[currentQuestion] = { slug: qData.slug, value: { slug: opt.slug, custom: val, text: `${opt.text}: ${val}` } };
          currentQuestion++;
          render();
        }
      };
    } else {
      document.getElementById(`opt-btn-${idx}`).onclick = () => {
        answers[currentQuestion] = { slug: qData.slug, value: opt };
        currentQuestion++;
        render();
      };
    }
  });

  if (currentQuestion > 0) {
    document.getElementById('back-btn').onclick = () => {
      currentQuestion--;
      render();
    };
  }
}

function renderModeChoice() {
  app.innerHTML = `
    <div class="fade-in">
      <h2 class="text-2xl font-serif text-amber-400 text-center mb-4">Révélation du scénario</h2>
      <p class="text-gray-300 text-center mb-6">Voulez-vous que chacun ait son propre script secret, ou un script complet à deux ?</p>
      <div class="flex flex-col gap-4">
        <button class="btn-main" id="secret-btn">Chacun son script secret</button>
        <button class="btn-main" id="partage-btn">Script complet pour tous les deux</button>
      </div>
    </div>
  `;
  document.getElementById('secret-btn').onclick = () => {
    selectedMode = 'secret';
    step = 'scenarios';
    fetchScenarios();
  };
  document.getElementById('partage-btn').onclick = () => {
    selectedMode = 'partage';
    step = 'scenarios';
    fetchScenarios();
  };
}

async function fetchScenarios() {
  app.innerHTML = `
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
      <p class="text-xl text-amber-300">Génération des scénarios par Gemini...</p>
    </div>
  `;
  const prompt = generateBriefPrompt(answers, selectedMode);
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    // Structure Gemini : array de "candidates", chaque candidate = 3 scénarios sous forme de texte
    const text = data.result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Parse scénarios : attend 3 blocs titre+pitch, séparés par lignes ou puces
    scenarios = parseScenarios(text);
    geminiFollowup = null;
    step = 'scenarios';
    render();
  } catch (e) {
    app.innerHTML = `<p class="text-red-400">Erreur lors de la génération des scénarios : ${e.message || e}</p>`;
  }
}

function parseScenarios(text) {
  // Essaye de découper 3 scénarios titre + pitch (format attendu : - Titre : pitch)
  const parts = text.split(/\n?- /g).map(s => s.trim()).filter(Boolean);
  const scArr = [];
  for (let part of parts) {
    const [titre, ...desc] = part.split(/[:：-]/);
    if (titre && desc.length) {
      scArr.push({ titre: titre.trim(), pitch: desc.join(':').trim() });
    }
  }
  return scArr.slice(0, 3);
}

function renderScenarios() {
  let html = `
    <div class="fade-in">
      <h2 class="text-3xl font-serif text-amber-400 text-center mb-6">Choisissez un scénario</h2>
      <div class="flex flex-col gap-4">
        ${scenarios.map((s, i) => `
          <button class="btn-main" id="scenario-btn-${i}">
            <b>${s.titre}</b><br><span class="text-base text-amber-200">${s.pitch}</span>
          </button>
        `).join('')}
      </div>
      <button class="btn-secondary mt-8" id="restart-btn">Recommencer</button>
    </div>
  `;
  app.innerHTML = html;
  scenarios.forEach((s, i) => {
    document.getElementById(`scenario-btn-${i}`).onclick = () => {
      selectedScenario = s;
      // Vérifie si le prompt demandait date/heure/lieu
      if (shouldAskRdv()) {
        step = 'rdv';
        render();
      } else {
        requestScript();
      }
    };
  });
  document.getElementById('restart-btn').onclick = () => {
    step = 'welcome';
    render();
  };
}

function shouldAskRdv() {
  // Si le prompt initial demandait un RDV, ou Gemini a posé la question, demander à l'utilisateur
  const quand = answers.find(a => a.slug === "quand");
  return quand && (
    quand.value.slug === "prochainement" ||
    (quand.value.slug === "autre" && /jour|date|rdv|rendez-vous|réserver|réservation|plus tard/i.test(quand.value.custom || ''))
  );
}

function renderRdvPrompt() {
  app.innerHTML = `
    <div class="fade-in text-center">
      <h2 class="text-2xl font-serif text-amber-400 mb-4">Précisez le rendez-vous</h2>
      <p class="text-gray-300 mb-4">Pour ce scénario, Gemini a besoin de connaître la date, l'heure, et le lieu précis du rendez-vous.</p>
      <input type="date" id="rdv-date" class="mb-2 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"/><br>
      <input type="time" id="rdv-heure" class="mb-2 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"/><br>
      <input type="text" id="rdv-lieu" placeholder="Lieu précis..." class="mb-4 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 w-64"/><br>
      <button class="btn-main mb-4" id="rdv-valider">Valider et générer le script</button>
      <button class="btn-secondary" id="rdv-cancel">Retour</button>
    </div>
  `;
  document.getElementById('rdv-valider').onclick = () => {
    const date = document.getElementById('rdv-date').value;
    const heure = document.getElementById('rdv-heure').value;
    const lieu = document.getElementById('rdv-lieu').value.trim();
    if (!date || !heure || !lieu) return alert("Merci de remplir tous les champs.");
    rdvInfos = { date, heure, lieu };
    requestScript();
  };
  document.getElementById('rdv-cancel').onclick = () => {
    step = 'scenarios';
    render();
  };
}

async function requestScript() {
  step = 'script';
  app.innerHTML = `
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
      <p class="text-xl text-amber-300">Génération du script détaillé par Gemini...</p>
    </div>
  `;
  let promptDetail = `Voici le scénario choisi : ${selectedScenario.titre} — ${selectedScenario.pitch}\n\n`;
  if (rdvInfos.date && rdvInfos.heure && rdvInfos.lieu) {
    promptDetail += `La date, l'heure et le lieu du rendez-vous sont : 
- Date : ${rdvInfos.date}
- Heure : ${rdvInfos.heure}
- Lieu : ${rdvInfos.lieu}\n\n`;
  }
  // Instructions selon le mode
  if (selectedMode === "secret") {
    const commande = answers.find(a => a.slug === "commande")?.value?.slug;
    const organisateur = (commande === "julie") ? "Julie" : "Julien";
    const partenaire = (organisateur === "Julie") ? "Julien" : "Julie";
    promptDetail += `
Merci de développer ce scénario selon les instructions ci-dessous :

1. Rédige d’abord le script complet pour l’organisateur (${organisateur}) :
   - Débute par la liste de tout ce qu’il doit prévoir (accessoires, réservations, organisation…)
   - Indique les informations sur le partenaire (${partenaire}) qui sont nécessaires à la réussite du scénario
   - À la fin du script, précise : "Ton/ta partenaire recevra un script séparé avec uniquement ce qu’il/elle doit savoir pour jouer son rôle."

2. Ensuite, après une séparation claire (par exemple : --- CODE DE LA PAGE PARTENAIRE ---), rédige uniquement le script du partenaire (${partenaire}) :
   - Ce script ne doit jamais mentionner la liste des préparatifs, ni le mode "chacun son script"
   - Il doit contenir uniquement les instructions, la mise en ambiance, et les informations nécessaires sur l’autre pour bien jouer son rôle
   - Génère le tout dans un code HTML/CSS de page web sobre, mobile et anonyme, sans révéler la surprise ni les détails globaux.

N’ajoute aucune information supplémentaire ou superflue.
`;
  } else {
    promptDetail += `
Merci de développer ce scénario en détail pour nous deux :
- Commence par la liste complète de tout ce qu’il faut prévoir (accessoires, réservations, préparation…)
- Puis déroule le scénario complet, avec les rôles, instructions, suggestions de dialogue, consignes, etc.
`;
  }
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptDetail })
    });
    const data = await res.json();
    let htmlResult = data.result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    scriptHtml = htmlResult;
    step = 'qr';
    render();
  } catch (e) {
    app.innerHTML = `<p class="text-red-400">Erreur lors de la génération du script : ${e.message || e}</p>`;
  }
}

function renderScript() {
  app.innerHTML = `
    <div class="fade-in">
      <h2 class="text-3xl font-serif text-amber-400 text-center mb-4">Votre script</h2>
      <textarea readonly class="w-full h-80 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4">${scriptHtml || ''}</textarea>
      <div class="flex flex-col sm:flex-row gap-4">
        <button class="btn-main" id="copy-script">Copier le script</button>
        <button class="btn-main" id="to-qr">Créer la page & QR code</button>
        <button class="btn-secondary" id="restart-script">Recommencer</button>
      </div>
    </div>
  `;
  document.getElementById('copy-script').onclick = () => {
    const textarea = document.querySelector('textarea');
    textarea.select();
    document.execCommand('copy');
    document.getElementById('copy-script').textContent = 'Copié !';
    setTimeout(() => document.getElementById('copy-script').textContent = 'Copier le script', 1800);
  };
  document.getElementById('to-qr').onclick = () => {
    step = 'qr';
    render();
  };
  document.getElementById('restart-script').onclick = () => {
    step = 'welcome';
    render();
  };
}

function renderQrPage() {
  // Utilise une lib JS QR (ex: qrcode.js) ou appelle /api/qr (non inclus ici)
  app.innerHTML = `
    <div class="fade-in text-center">
      <h2 class="text-3xl font-serif text-amber-400 mb-4">Partagez votre script secret</h2>
      <p class="text-xl text-gray-300 mb-4">Votre script est prêt !<br>Vous pouvez créer une page web et un QR code à partager.</p>
      <form id="form-upload" class="flex flex-col gap-4 items-center">
        <textarea required id="html-input" class="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Collez ici le code HTML si besoin...">${scriptHtml || ''}</textarea>
        <button type="submit" class="btn-main">Créer la page & QR code</button>
      </form>
      <div id="qr-result" class="mt-6 hidden flex-col gap-4 items-center"></div>
      <button class="btn-secondary mt-6" id="restart-qr">Recommencer</button>
    </div>
  `;
  document.getElementById('restart-qr').onclick = () => {
    step = 'welcome';
    render();
  };
  document.getElementById('form-upload').onsubmit = async function(e) {
    e.preventDefault();
    const html = document.getElementById('html-input').value;
    const btn = this.querySelector('button');
    btn.disabled = true; btn.textContent = "Création en cours...";
    // Appel API pour créer page + qr (implémente /api/qr)
    const res = await fetch('/api/qr', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ html })
    });
    const data = await res.json();
    btn.disabled = false; btn.textContent = "Créer la page & QR code";
    if (data.success) {
      const qrDiv = document.getElementById('qr-result');
      qrDiv.classList.remove('hidden');
      qrDiv.innerHTML = `
        <div class="text-center mb-4">
          <p class="text-lg text-amber-300">Lien à partager :</p>
          <a href="${data.url}" target="_blank" class="block font-semibold text-amber-500 hover:underline text-lg">${data.url}</a>
        </div>
        <div class="flex flex-col items-center gap-2">
          <img src="${data.qr}" class="w-40 h-40 rounded-md border-2 border-gray-700 bg-white" alt="QR code">
          <button id="share-btn" class="mt-3 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow transition-all duration-300" style="font-size:1.1rem;">Partager le lien et le QR code</button>
        </div>
      `;
      document.getElementById('share-btn').onclick = async function() {
        const url = data.url;
        const qrImgUrl = data.qr;
        // Partage natif/fallback
        if (navigator.canShare && window.Blob) {
          try {
            const res = await fetch(qrImgUrl);
            const blob = await res.blob();
            const filesArray = [new File([blob], "qrcode.png", { type: "image/png" })];
            await navigator.share({
              title: "Votre scénario secret",
              text: "Voici le lien et le QR code pour ton scénario :\n" + url,
              url: url,
              files: filesArray
            });
            return;
          } catch(e) {}
        }
        try {
          await navigator.clipboard.writeText(url);
          alert("Lien copié dans le presse-papier !\nQR code à enregistrer si besoin.");
        } catch(e) {
          alert("Partage non supporté.\nCopiez le lien manuellement : " + url);
        }
      };
    } else {
      alert("Erreur : " + data.error);
    }
  };
}

// Démarrage
render();