// src/prompt.js
// Générateur du prompt Gemini à partir des réponses du questionnaire et des données couple

import { questionsData } from './questions.js';
import { coupleData } from './couple.js';

/**
 * Génère un prompt Gemini à partir des réponses, du mode et de la base couple.
 * @param {Array} answers - [{slug, value}]
 * @param {"secret"|"partage"} mode
 * @returns {string} prompt complet prêt pour l'API Gemini
 */
export function generateBriefPrompt(answers, mode) {
    // Helper pour retrouver texte de réponse
    const getText = (slug) => {
        const obj = answers.find(a => a.slug === slug);
        if (!obj) return "";
        let v = obj.value;
        return v.text ? v.text : (typeof v === "string" ? v : "");
    };

    // Bloc de réponses
    let bloc = '';
    questionsData.forEach(q => {
        bloc += `- ${q.question} ${getText(q.slug)}\n`;
    });

    // Détection du besoin de demander date/heure/lieu
    const quand = answers.find(a => a.slug === "quand");
    const demandeRdv = quand && (
        quand.value.slug === "prochainement"
        || (
            quand.value.slug === "autre"
            && /jour|date|rdv|rendez-vous|réserver|réservation|plus tard/i.test(quand.value.custom || '')
        )
    );

    // Détermination des prénoms organisateur/partenaire (depuis coupleData sinon fallback Julie/Julien)
    const commande = answers.find(a => a.slug === "commande")?.value?.slug;
    const organisateur = (commande === (coupleData.prenom1_slug || "julie")) ? coupleData.prenom1 : coupleData.prenom2;
    const partenaire = (organisateur === coupleData.prenom1) ? coupleData.prenom2 : coupleData.prenom1;

    let prompt = `Bonjour Gemini.

Voici notre brief pour un jeu de rôle érotique à deux, sur-mesure, selon nos envies, nos limites, et notre histoire :

${bloc}

Nous sommes un couple : **${coupleData.prenom1} et ${coupleData.prenom2}**.
- Si l’un de nous organise la soirée (mode “secret”), l’autre doit toujours être le partenaire qui recevra le QR code ou le script mystère (par exemple, si c’est ${coupleData.prenom2} qui organise, ${coupleData.prenom1} sera forcément la partenaire, et inversement). 
- Les scénarios peuvent utiliser nos vrais prénoms ou proposer des noms d’emprunt pour pimenter l’expérience.

**Toutes les informations utiles à propos de notre couple (histoire, contraintes, envies, limites, anecdotes, etc.) :**
${coupleData.lien_base}

Consulte ce document comme base de connaissance et exploite au maximum ces données pour personnaliser et enrichir les scénarios.

Merci de proposer trois idées de scénarios différents adaptés à ces réponses :
- Pour chaque scénario, donne uniquement un titre et un court pitch (maximum 3 lignes).
- N’entre dans aucun détail, ne révèle rien du déroulé, jusqu’à ce que nous ayons choisi une proposition.
- Si aucune proposition ne convient, nous te demanderons d’en proposer trois autres, jamais de détail avant un choix explicite.

Le but du jeu de rôle est **qu’il y ait toujours une ou plusieurs relations sexuelles dans le scénario ou à la fin** (sauf si c’est explicitement exclu dans nos réponses).
**La description des scènes sexuelles pourra être soit explicite, soit simplement suggérée, selon l’ambiance, le ton du scénario, ou nos réponses.**
Si la durée choisie pour la parenthèse est supérieure à une heure, tu peux prévoir plusieurs séquences ou rapports sexuels (ex : jeu sur la durée, à épisodes, ou différentes étapes).

Tu peux, selon le contexte ou nos envies, proposer des expériences sexuelles dans des lieux publics (si réaliste dans la mise en scène). Exemples acceptés : fellation ou pénétration digitale dans une cabine d’essayage, rapport sexuel discret dans une voiture ou des toilettes publiques, etc. Fais-le seulement si c’est cohérent et excite le couple, sans jamais forcer ni dépasser les limites précisées dans notre base de connaissance.

${demandeRdv ? `
IMPORTANT : Si le scénario choisi nécessite un rendez-vous à une date ou heure précise (ex : “dans quelques jours” ou scénario avec organisation),
**AVANT** de générer le script complet, demande d’abord à l'organisateur de préciser :
- la date
- l’heure
- et le lieu précis du rendez-vous.
**Attends la réponse de l’organisateur avant d’écrire le scénario complet.**
` : ''}

${mode === "secret" ? `
IMPORTANT : Après notre choix de scénario, nous te demanderons de développer ce scénario selon ces instructions :

1. Rédige d’abord le script complet pour l’organisateur (${organisateur}) :
   - Débute par la liste de tout ce qu’il doit prévoir (accessoires, réservations, organisation…)
   - Indique les informations sur le partenaire (${partenaire}) qui sont nécessaires à la réussite du scénario
   - À la fin du script, précise :
     "Ton/ta partenaire recevra un script séparé avec uniquement ce qu’il/elle doit savoir pour jouer son rôle.
      Avant le jeu, prépare un QR code ou un lien contenant ce script partenaire. Utilise par exemple https://queste.fr/juju/qr : colle le code HTML généré, tu auras un lien web + QR code à partager (par SMS, WhatsApp, ou à imprimer pour le jeu de rôle)."
   - N’ajoute jamais cette consigne dans le script partenaire.

2. Ensuite, après une séparation claire (par exemple : --- CODE DE LA PAGE PARTENAIRE ---), rédige uniquement le script du partenaire (${partenaire}) :
   - Ce script ne doit jamais mentionner la liste des préparatifs, ni le mode "chacun son script"
   - Il doit contenir uniquement les instructions, la mise en ambiance, et les informations nécessaires sur l’autre pour bien jouer son rôle
   - Génère le tout dans un code HTML/CSS de page web sobre, mobile et anonyme, sans révéler la surprise ni les détails globaux.

Après avoir reçu le code HTML du script partenaire, indique clairement à l'utilisateur d'utiliser le bouton "Copier", puis d'aller sur https://queste.fr/juju/qr pour le coller et obtenir un lien et QR code à partager au partenaire.

N’ajoute aucune information supplémentaire ou superflue.
` : `
IMPORTANT : Après notre choix de scénario, nous te demanderons de développer ce scénario en détail pour nous deux :
- Commence par la liste complète de tout ce qu’il faut prévoir (accessoires, réservations, préparation…)
- Puis déroule le scénario complet, avec les rôles, instructions, suggestions de dialogue, consignes, etc.
`}
`;

    return prompt;
}