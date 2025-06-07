// api/qr.js
// Endpoint Node.js/Express pour créer une page web depuis du HTML, générer un lien unique et un QR code lié

import express from 'express';
import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';
import QRCode from 'qrcode';

const router = express.Router();

const PUBLIC_PAGES_DIR = path.resolve('public', 'pages'); // Stocke les pages HTML générées ici
const BASE_URL = process.env.BASE_URL || 'https://queste.fr/juju/pages/'; // Modifie selon ton domaine réel

// Assure que le dossier existe
async function ensureDirExists() {
  try {
    await fs.mkdir(PUBLIC_PAGES_DIR, { recursive: true });
  } catch (e) {}
}

// POST /api/qr
// Body: { html: <string> }
router.post('/', async (req, res) => {
  const { html } = req.body;
  if (!html || typeof html !== 'string') {
    return res.status(400).json({ success: false, error: 'HTML manquant ou invalide.' });
  }
  await ensureDirExists();
  // Génère un ID unique
  const id = nanoid(12);

  const filePath = path.join(PUBLIC_PAGES_DIR, `${id}.html`);
  try {
    await fs.writeFile(filePath, html, 'utf8');
    const url = `${BASE_URL}${id}.html`;
    // Génère un QR code (format data URL PNG)
    const qr = await QRCode.toDataURL(url, { errorCorrectionLevel: 'M', width: 320 });
    res.json({ success: true, url, qr });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;