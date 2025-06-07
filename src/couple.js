// src/couple.js
// Données détaillées sur le couple, à utiliser pour personnaliser les prompts Gemini

export const coupleData = {
  prenom1: "Julie",
  prenom2: "Julien",
  prenom1_slug: "julie",
  prenom2_slug: "julien",
  noms: ["Julie", "Julien"],
  ages: { Julie: 35, Julien: 36 },
  ville: "Aire sur la Lys",
  region: "Pas-de-Calais",
  enfants_naturels: [
    { prenom: "Lola", age: 9 },
    { prenom: "Léo", age: 11 }
  ],
  enfants_accueillis: [
    { age: 5 },
    { age: 9 },
    { age: 15 }
  ],
  professions: {
    Julie: "assistante familiale (accueil de 3 enfants de 5, 9 et 15 ans)",
    Julien: "délégué syndical, membre du bureau fédéral national"
  },
  alcool: {
    Julie: "bière rouge (pas de vin rouge)",
    Julien: "pissang avec du coca, ne boit presque jamais d'alcool"
  },
  fume: { Julie: "CBD de temps en temps" },
  duree_couple: 17,
  anecdotes: [
    "Premier baiser dans la chambre de Julien chez ses parents",
    "Première fois pendant les règles de Julie (serviette pour ne pas tâcher les draps)",
    "Fou rire : cuillère en plastique fondue dans le four",
    "Moment gênant devenu private joke : la mère de Julien entre dans la chambre pendant l'amour",
    "Escape games en couple",
    "Week-end à Paris : dîner sur la Seine, spectacle Hoshi",
    "10 ans de mariage : semaine à Marrakech",
    "Rénovation de plusieurs maisons ensemble"
  ],
  famille: {
    après_naissance_enfants: "moins d'intimité et de temps pour le couple",
    moments_enfants: ["gili", "faire le monstre", "jouer au foot"]
  },
  rituels: [],
  reves: [
    "Tour du monde en catamaran (Julien)",
    "Vivre dans la nature (Julie)",
    "Tour du monde à deux"
  ],
  jeux_cadeaux: [
    "Sex toys offerts par Julien à Julie",
    "Jeux d'escape game",
    "Anniversaires : resto et petit cadeau",
    "Organisation d'un anniversaire surprise pour les 30 ans de Julien par Julie"
  ],
  sorties: {
    plus_de_liberté: "une journée par mois pour nous",
    petites_sorties: "marché, shopping, café en ville = moments propices aux jeux",
    organisation_maison: "Julien",
    contraintes: "aucune contrainte technique (pas d’animaux à sortir, murs fins, voisins...)"
  },
  gouts: {
    Julie: {
      cinéma: "films/series d’horreur, Disney",
      parfums: "très sensible aux odeurs, adore le chocolat"
    },
    Julien: {
      humour: ["Elodie Poux", "Artus"],
      boisson: "pissang coca"
    }
  },
  accessoires: [
    "huile de massage",
    "menottes",
    "sex toys",
    "gaine à pénis",
    "womanizer",
    "lingerie pour elle",
    "bandeau pour les yeux",
    "sex toys double pénétration",
    "womanizer duo"
  ],
  envies_accessoires: [
    "déguisements si pas trop cher"
  ],
  contacts_physiques: [
    "massages",
    "baisers",
    "effleurements"
  ],
  limites: [
    "forte douleur",
    "humiliation",
    "exhibition"
  ],
  lieux: [
    "préférence chambre",
    "jamais la cuisine (vis-à-vis des voisins)",
    "possibles : grenier, bureau/dressing, escaliers"
  ],
  fantasmes: [
    "plan à 3 avec 2 hommes (Julien, mais Julie ne veut pas d’autre partenaire, donc scénario imaginaire possible)",
    "double pénétration avec womanizer",
    "club libertin"
  ],
  communication: [
    "aiment les surprises par SMS/mail/message",
    "aiment les instructions ludiques ou défis à relever",
    "le côté 'mise en scène' compte autant que l’histoire",
    "préfèrent les scripts détaillés",
    "les dialogues/situations peuvent être directs ou soft"
  ],
  mots_securite: "un mot code",
  planning: {
    jours_faciles: "enfants à la maison, prévoir un jour où ils sont à l’école ou soir après leur coucher",
    weekend: "plus compliqué",
    préférence: "planifier longtemps à l’avance mais flexibles"
  },
  // Pour le prompt : lien direct vers la base Google Sheets ou toute URL utile
  lien_base: "https://docs.google.com/spreadsheets/d/1dqe0DksevrAkC0cxRf60FqVrH9QuvdYFktTrPgub7_c/edit?usp=sharing"
};