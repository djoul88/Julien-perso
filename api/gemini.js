// api/gemini.js
// Middleware Node.js/Express pour relayer les requêtes à l'API Gemini (Google AI Studio)
// Sécurise la clé API (fichier .env), et évite toute exposition côté client.

import express from 'express';
import fetch from 'node-fetch'; // Si Node 18+, utilise global fetch
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Place ta clé dans .env : GEMINI_API_KEY=...

if (!GEMINI_API_KEY) {
  throw new Error('Clé API Gemini manquante. Ajoute GEMINI_API_KEY=... dans le fichier .env');
}

// Gemini API endpoint (modèle Gemini 1.5 Flash ou Pro, adapte si besoin)
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY;

// POST /api/gemini
// Body: { prompt: <string> }
router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt manquant ou invalide.' });
  }

  // Payload Gemini
  const payload = {
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ]
  };

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "Erreur Gemini API" });
    }

    // data.candidates[0].content.parts[0].text (structure Gemini)
    // Peut avoir plusieurs candidats (propositions)
    res.json({ result: data });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erreur interne Gemini' });
  }
});

export default router;