// src/questions.js
// Toutes les questions du questionnaire, format structuré

export const questionsData = [
    {
        slug: 'commande',
        question: "Qui est aux commandes cette fois-ci ?",
        options: [
            { text: "Julie", slug: "julie" },
            { text: "Julien", slug: "julien" }
        ]
    },
    {
        slug: 'quand',
        question: "Quand commence l'aventure ?",
        options: [
            { text: "Maintenant, à l'improviste", slug: "maintenant" },
            { text: "Demain, pour faire monter l’envie", slug: "demain" },
            { text: "Dans les prochains jours, pour organiser", slug: "prochainement" },
            { text: "Autre moment (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'duree',
        question: "Combien de temps va durer cette parenthèse ?",
        options: [
            { text: "Court & intense (moins d'une heure)", slug: "court" },
            { text: "L'affaire de quelques heures", slug: "quelques_heures" },
            { text: "Une nuit entière ou une après-midi complète", slug: "long" },
            { text: "Autre durée (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'lieu',
        question: "Où se déroulera l'histoire ?",
        options: [
            { text: "Chez nous", slug: "maison" },
            { text: "Dehors puis à la maison", slug: "exterieur_maison" },
            { text: "Dans un lieu insolite", slug: "lieu_insolite" },
            { text: "Autre lieu (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'ambiance',
        question: "Quelle sera l’ambiance générale ?",
        options: [
            { text: "Tendre & sensuelle", slug: "tendre" },
            { text: "Joueuse & complice", slug: "complice" },
            { text: "Passionnelle & fiévreuse", slug: "passion" },
            { text: "Mystérieuse & audacieuse", slug: "mystere" },
            { text: "Autre ambiance (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'emotion',
        question: "Quelle émotion veux-tu explorer ?",
        options: [
            { text: "Redécouverte tendre", slug: "redécouverte" },
            { text: "Transgression / Secret", slug: "transgression" },
            { text: "Adrénaline de l’inconnu", slug: "inconnu" },
            { text: "Joie simple de la complicité", slug: "joie" },
            { text: "Autre émotion (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'mise_en_scene',
        question: "Comment veux-tu mettre en scène le jeu ?",
        options: [
            { text: "Minimaliste, sans accessoires", slug: "minimaliste" },
            { text: "Quelques accessoires symboliques", slug: "symbolique" },
            { text: "Ambiance travaillée (musique, lumière…)", slug: "ambiance" },
            { text: "Immersion totale (costumes, décor...)", slug: "immersion" },
            { text: "Autre (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'univers',
        question: "Quel univers t'inspire le plus ?",
        options: [
            { text: "Situation réaliste qui dérape", slug: "realisme" },
            { text: "Voyage dans le temps", slug: "temps" },
            { text: "Imaginaire débridé", slug: "imaginaire" },
            { text: "Comédie romantique ou absurde", slug: "comedie" },
            { text: "Autre univers (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'personnages',
        question: "Quels personnages souhaitez-vous incarner ?",
        options: [
            { text: "De parfaits inconnus", slug: "inconnus" },
            { text: "Des connaissances qui se révèlent", slug: "connaissances" },
            { text: "Une version fantasmée de nous-mêmes", slug: "vous_memes" },
            { text: "Autres personnages (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'fil_conducteur',
        question: "Quel fil conducteur préférez-vous ?",
        options: [
            { text: "Un script détaillé à suivre", slug: "detaille" },
            { text: "Quelques étapes clés, liberté entre elles", slug: "etapes" },
            { text: "Juste un point de départ, l’improvisation fera le reste", slug: "impro" },
            { text: "Autre (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'pouvoir',
        question: "Qui mènera la danse ?",
        options: [
            { text: "En harmonie, à deux", slug: "harmonie" },
            { text: "Je prends les rênes", slug: "guide" },
            { text: "Je me laisse surprendre", slug: "surprendre" },
            { text: "On alterne les rôles", slug: "alterne" },
            { text: "Autre dynamique (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'ton',
        question: "Quel ton souhaitez-vous pour vos échanges ?",
        options: [
            { text: "Poétique & romantique", slug: "poetique" },
            { text: "Direct & explicite", slug: "direct" },
            { text: "Taquin & humoristique", slug: "taquin" },
            { text: "Principalement silencieux", slug: "silence" },
            { text: "Autre (à préciser)", slug: "autre", type: "text" }
        ]
    },
    {
        slug: 'fantasme',
        question: "Un fantasme ou un acte à explorer absolument ?",
        options: [
            { text: "Non, je suis ouvert(e) à la surprise", slug: "ouvert" },
            { text: "Oui (à préciser)", slug: "oui", type: "text" }
        ]
    },
    {
        slug: 'limite',
        question: "Une limite ou un thème à éviter absolument ?",
        options: [
            { text: "Non, aucune restriction particulière", slug: "aucune" },
            { text: "Oui (à préciser)", slug: "oui", type: "text" }
        ]
    }
];