// src/generate.js

/**
 * Génère un scénario depuis Gemini, puis la page HTML et le QR code sur ton hébergement mutualisé.
 * @param {string} prompt - Le prompt à envoyer à Gemini.
 * @param {function} onStatus - Callback de statut (texte à afficher à l'utilisateur)
 * @param {function} onResult - Callback finale ({ url, qr }) à afficher ou utiliser.
 * @param {function} onError - Callback en cas d'erreur.
 */
export async function generateScenarioAndPage(prompt, onStatus, onResult, onError) {
  try {
    onStatus?.('Génération du script Gemini en cours...');
    // 1. Appel Gemini (proxy PHP)
    const response = await fetch('/juju/api/gemini.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    if (!data || !data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Réponse Gemini invalide');
    }
    const scriptHtml = data.candidates[0].content.parts[0].text;

    onStatus?.('Création de la page secrète...');
    // 2. Appel création page HTML + QR code
    const res2 = await fetch('/juju/api/create.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: scriptHtml })
    });
    const data2 = await res2.json();
    if (!data2.success) throw new Error(data2.error || 'Erreur lors de la création de la page');

    // 3. Callback résultat
    onResult?.({ url: data2.url, qr: data2.qr, scriptHtml });
  } catch (e) {
    onError?.(e.message || e);
  }
}