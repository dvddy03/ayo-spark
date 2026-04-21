export type Athlete = {
  id: string;
  slug: string;
  nom: string;
  pays: string;
  codePays: string;
  sport: string;
  langueNative: string;
  type: "athlete" | "reporter" | "benevole";
  estRefugie?: boolean;
  photoUrl?: string;
  positionActuelle: string;
  emotionPrincipale: string;
};

export type EmotionScore = {
  nom: string;
  score: number;
  couleur: string;
};

export type VoiceAnalysis = {
  emotions: EmotionScore[];
  themes: string[];
  extrait_fort: string;
  intensite: number;
  connexions_potentielles: string[];
};

export type Spark = {
  id: string;
  athlete1Id: string;
  athlete2Id: string;
  type: "teranga" | "culturel" | "olympique";
  score: number;
  lienCommun: string;
  lieuSuggere: string;
  heureSuggeree: string;
  statut: "pending" | "accepted" | "declined" | "completed";
};

export type QuickSuggestion = {
  title: string;
  description: string;
  href: string;
  accent: "gold" | "green" | "cyan" | "orange" | "purple" | "red";
};

export type DemoAccessProfile = {
  id: string;
  role: "athlete" | "reporter" | "guide";
  label: string;
  description: string;
  pitch: string;
  route: string;
};

export const APP_NAME = "AYO SPARK";
export const DEMO_ATHLETE_ID = "a4";
export const JOURNAL_STORAGE_KEY = "ayo-spark-journals";
export const SPARK_STATUS_STORAGE_KEY = "ayo-spark-spark-status";
export const GUIDE_HISTORY_STORAGE_KEY = "ayo-spark-guide-history";
export const TRANSLATOR_HISTORY_STORAGE_KEY = "ayo-spark-translate-history";

export const athletes: Athlete[] = [
  {
    id: "a1",
    slug: "amara-diallo",
    nom: "Amara Diallo",
    pays: "Senegal",
    codePays: "SN",
    sport: "Judo",
    langueNative: "fr",
    type: "athlete",
    positionActuelle: "Diamniadio",
    emotionPrincipale: "Fierte et pression familiale",
  },
  {
    id: "a2",
    slug: "yuki-tanaka",
    nom: "Yuki Tanaka",
    pays: "Japon",
    codePays: "JP",
    sport: "Natation",
    langueNative: "ja",
    type: "athlete",
    positionActuelle: "Dakar",
    emotionPrincipale: "Solitude et perfectionnisme",
  },
  {
    id: "a3",
    slug: "sofia-mendes",
    nom: "Sofia Mendes",
    pays: "Bresil",
    codePays: "BR",
    sport: "Athletisme",
    langueNative: "pt",
    type: "athlete",
    positionActuelle: "Saly",
    emotionPrincipale: "Joie et nostalgie",
  },
  {
    id: "a4",
    slug: "hassan-omar",
    nom: "Hassan Omar",
    pays: "Equipe Refugees",
    codePays: "RF",
    sport: "Boxe",
    langueNative: "so",
    type: "athlete",
    estRefugie: true,
    positionActuelle: "Diamniadio",
    emotionPrincipale: "Resilience et espoir",
  },
  {
    id: "a5",
    slug: "emma-larsson",
    nom: "Emma Larsson",
    pays: "Suede",
    codePays: "SE",
    sport: "Escrime",
    langueNative: "sv",
    type: "athlete",
    positionActuelle: "Dakar",
    emotionPrincipale: "Doute et determination",
  },
];

export const athleteById = Object.fromEntries(
  athletes.map((athlete) => [athlete.id, athlete]),
) as Record<string, Athlete>;

export const sparks: Spark[] = [
  {
    id: "s1",
    athlete1Id: "a4",
    athlete2Id: "a1",
    type: "teranga",
    score: 94,
    lienCommun:
      "Deux Africains, deux realites, une meme flamme pour prouver que leur peuple existe.",
    lieuSuggere: "Corniche de Dakar",
    heureSuggeree: "18:30",
    statut: "pending",
  },
  {
    id: "s2",
    athlete1Id: "a2",
    athlete2Id: "a3",
    type: "culturel",
    score: 87,
    lienCommun:
      "La peur de decevoir leurs parents traverse les cultures japonaise et bresilienne.",
    lieuSuggere: "Village Olympique - Jardin central",
    heureSuggeree: "16:00",
    statut: "pending",
  },
  {
    id: "s3",
    athlete1Id: "a5",
    athlete2Id: "a1",
    type: "olympique",
    score: 79,
    lienCommun:
      "Visualisation pre-combat et routines de concentration a partager entre escrime et judo.",
    lieuSuggere: "Dakar Arena",
    heureSuggeree: "11:15",
    statut: "pending",
  },
];

export const quickLinks: QuickSuggestion[] = [
  {
    title: "Mon Journal",
    description: "Saisir une pensee forte, analyser l'emotion, sauvegarder le souvenir.",
    href: "/athlete/voice",
    accent: "red",
  },
  {
    title: "Teranga Spark",
    description: "Voir les connexions humaines prioritaires et accepter un rendez-vous.",
    href: "/athlete/sparks",
    accent: "green",
  },
  {
    title: "AYO GUIDE",
    description: "Traduction et guide local pour Dakar, Diamniadio et Saly.",
    href: "/guide",
    accent: "orange",
  },
  {
    title: "Reporter Mode",
    description: "Tableau de bord pour les histoires fortes et briefings d'interview.",
    href: "/reporter",
    accent: "cyan",
  },
];

export const demoAccessProfiles: DemoAccessProfile[] = [
  {
    id: "a4",
    role: "athlete",
    label: "Hassan Omar",
    description: "Profil athlete prioritaire pour le parcours emotionnel et le Spark Teranga.",
    pitch:
      "Le meilleur parcours jury pour montrer la resilience, la connexion humaine et la capsule finale.",
    route: "/athlete",
  },
  {
    id: "a1",
    role: "athlete",
    label: "Amara Diallo",
    description: "Profil athlete local pour montrer la fierte de Dakar 2026.",
    pitch:
      "Une bonne alternative si vous voulez un angle Senegal, famille et pression positive.",
    route: "/athlete",
  },
  {
    id: "reporter-young",
    role: "reporter",
    label: "Young Reporter CIO",
    description: "Role dedie a l'observation des sparks et a la detection des histoires fortes.",
    pitch:
      "Ideal pour la minute 4 de la presentation, lorsque le jury voit l'alerte story apparaitre.",
    route: "/reporter",
  },
  {
    id: "guide-volunteer",
    role: "guide",
    label: "Benevole Jambaar26",
    description: "Role utilitaire pour lancer rapidement le guide local et la traduction.",
    pitch:
      "Parfait pour montrer la valeur terrain de l'app avant de revenir aux athletes.",
    route: "/guide",
  },
];

export const voiceSamples = [
  {
    title: "Hassan - resilience",
    athleteId: "a4",
    text: "Je me bats pour tous ceux qui ne peuvent pas etre ici. Quand je monte sur le ring, je pense a ceux qui ont perdu leur maison mais pas leur courage.",
  },
  {
    title: "Amara - fierte",
    athleteId: "a1",
    text: "Je dois montrer que l'Afrique peut gagner ici, sur sa propre terre. Je veux que ma famille sente ma force jusque dans les tribunes.",
  },
  {
    title: "Yuki - solitude",
    athleteId: "a2",
    text: "Dans l'eau, les langues n'existent pas. Mais hors du bassin, la solitude revient et je me demande si je suis a la hauteur.",
  },
];

export const prebuiltCapsules: Record<string, string> = {
  a4: `Il est arrive a Dakar sans famille pour l'applaudir. Juste lui, ses gants, et quelque chose a prouver au monde : non pas qu'il etait le meilleur, mais qu'il existait. Le jour de sa defaite en quart de finale, Hassan Omar n'a pas pleure devant les cameras. Il a attendu le silence, puis l'eau froide, puis cette phrase qui est sortie comme une promesse : "Je me bats pour tous ceux qui ne peuvent pas etre ici." Trois jours plus tard, sur la Corniche, il parlait avec un judoka senegalais qu'il ne connaissait pas encore la veille. Dakar 2026 ne lui a pas offert une medaille. Il lui a offert une trace, une preuve, une voix qui restera dans la memoire du Village olympique.`,
  a1: `Au milieu du bruit, elle cherchait un souffle stable. Amara Diallo portait plus qu'un judogi : elle portait une attente collective, celle d'un pays qui accueillait pour la premiere fois un evenement olympique sur le sol africain. Chaque combat lui rappelait que la victoire ne se joue pas seulement sur le tapis, mais dans la facon de tenir debout sous le regard des autres. Dans ses mots revenaient la fierte, la famille et cette question simple : comment etre digne sans se perdre. Son histoire a Dakar est celle d'une athlete qui a appris a transformer la pression en presence.`,
};

export const languages = [
  { code: "fr", label: "Francais" },
  { code: "en", label: "English" },
  { code: "wo", label: "Wolof" },
  { code: "ja", label: "Japonais" },
  { code: "pt", label: "Portugais" },
  { code: "so", label: "Somali" },
];

export const JOJ_DATA = {
  sites_competition: [
    {
      nom: "Village Olympique",
      ville: "Diamniadio",
      info: "Universite Amadou Makhtar Mbow. Relie a Dakar par TER.",
    },
    {
      nom: "Corniche West",
      ville: "Dakar",
      info: "Hub principal des festivites et des rencontres informelles.",
    },
    {
      nom: "Dakar Arena",
      ville: "Diamniadio",
      info: "Badminton et futsal. Salle climatisee.",
    },
    {
      nom: "Saly Beach West",
      ville: "Saly",
      info: "Sports de plage et ambiance detendue apres competition.",
    },
  ],
  restaurants: [
    {
      nom: "Marche Kermel",
      ville: "Dakar",
      type: "Cuisine senegalaise authentique",
      conseil: "Essayez le thieboudienne du vendredi",
    },
    {
      nom: "Chez Dado",
      ville: "Diamniadio",
      type: "Thieboudienne, Yassa, Mafe",
      conseil: "Option vegetarienne disponible",
    },
    {
      nom: "Cafeteria Village Olympique",
      ville: "Diamniadio",
      type: "International et local",
      conseil: "Ouvert 24h pendant les JOJ",
    },
  ],
  tourisme: [
    {
      nom: "Ile de Goree",
      type: "Histoire UNESCO",
      info: "Ferry depuis Dakar, visite ideale sur une demi-journee.",
    },
    {
      nom: "Lac Rose",
      type: "Nature",
      info: "A 30 km de Dakar, parfait pour une sortie courte.",
    },
    {
      nom: "Corniche de Dakar",
      type: "Balade",
      info: "Vue ocean et coucher de soleil, tres adapte aux rencontres Spark.",
    },
  ],
  transport: [
    {
      type: "TER",
      trajet: "Dakar Centre <-> Diamniadio",
      duree: "45 minutes",
      prix: "1 500 FCFA",
    },
    {
      type: "Taxi",
      trajet: "Dakar urbain",
      duree: "Variable",
      prix: "1 000 a 3 000 FCFA",
    },
    {
      type: "Navette JOJ",
      trajet: "Entre les sites accredites",
      duree: "Selon planning",
      prix: "Gratuit",
    },
  ],
  mots_wolof: [
    { mot: "Teranga", sens: "hospitalite" },
    { mot: "Jerejef", sens: "merci" },
    { mot: "Jambaar", sens: "courageux" },
    { mot: "Mangi fi", sens: "je vais bien" },
  ],
};

export function getFlagEmoji(codePays: string) {
  if (codePays === "RF") return "RF";
  return codePays
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );
}

export function getSparkTypeLabel(type: Spark["type"]) {
  if (type === "teranga") return "Spark Teranga";
  if (type === "culturel") return "Spark Culturel";
  return "Spark Olympique";
}

export function getSparkColor(type: Spark["type"]) {
  if (type === "teranga") return "text-green";
  if (type === "culturel") return "text-cyan";
  return "text-orange";
}

export function getMockAnalysis(transcription: string): VoiceAnalysis {
  const text = transcription.toLowerCase();
  if (text.includes("famille") || text.includes("afrique")) {
    return {
      emotions: [
        { nom: "Fierte", score: 91, couleur: "#f39c12" },
        { nom: "Pression", score: 78, couleur: "#e74c3c" },
        { nom: "Esperance", score: 70, couleur: "#2ecc71" },
      ],
      themes: ["Famille", "Afrique", "Representation", "Victoire"],
      extrait_fort:
        "Je dois montrer que l'Afrique peut gagner ici, sur sa propre terre.",
      intensite: 9,
      connexions_potentielles: ["Fierte", "Pression familiale", "Transmission"],
    };
  }

  if (text.includes("eau") || text.includes("solitude")) {
    return {
      emotions: [
        { nom: "Solitude", score: 72, couleur: "#00bcd4" },
        { nom: "Gratitude", score: 65, couleur: "#2ecc71" },
        { nom: "Doute", score: 58, couleur: "#9b59b6" },
      ],
      themes: ["Discipline", "Silence", "Adaptation", "Famille"],
      extrait_fort: "Dans l'eau, les langues n'existent pas.",
      intensite: 7,
      connexions_potentielles: ["Solitude", "Perfection", "Recherche de paix"],
    };
  }

  return {
    emotions: [
      { nom: "Resilience", score: 87, couleur: "#2ecc71" },
      { nom: "Espoir", score: 74, couleur: "#f39c12" },
      { nom: "Courage", score: 68, couleur: "#00bcd4" },
      { nom: "Manque", score: 51, couleur: "#9b59b6" },
    ],
    themes: ["Exil", "Voix", "Dignite", "Representation"],
    extrait_fort: "Je me bats pour tous ceux qui ne peuvent pas etre ici.",
    intensite: 8,
    connexions_potentielles: ["Resilience", "Afrique", "Courage partage"],
  };
}

export function getMockTranslation(
  text: string,
  sourceLang: string,
  targetLang: string,
) {
  if (!text.trim()) return "";

  const canned: Record<string, string> = {
    "fr:wo:bonjour": "Salaam aleekum",
    "fr:en:bonjour": "Hello",
    "fr:wo:merci": "Jerejef",
    "en:fr:hello": "Bonjour",
  };

  const key = `${sourceLang}:${targetLang}:${text.trim().toLowerCase()}`;
  if (canned[key]) return canned[key];

  const prefix =
    targetLang === "wo"
      ? "Wolof"
      : targetLang === "en"
        ? "English"
        : targetLang === "fr"
          ? "Francais"
          : targetLang.toUpperCase();

  return `${prefix}: ${text}`;
}

export function detectSuggestions(message: string) {
  const msg = message.toLowerCase();
  if (msg.includes("manger") || msg.includes("restaurant") || msg.includes("food")) {
    return ["Restaurants halal", "Cuisine locale", "Prix et horaires"];
  }
  if (msg.includes("transport") || msg.includes("taxi") || msg.includes("ter")) {
    return ["Prendre le TER", "Trouver un taxi", "Navette JOJ"];
  }
  if (msg.includes("voir") || msg.includes("visiter") || msg.includes("visit")) {
    return ["Ile de Goree", "Lac Rose", "Corniche Dakar"];
  }
  return ["Restaurants", "Transport", "Tourisme", "Urgence"];
}

export function getMockGuideReply(message: string, langue: string, position?: string) {
  const msg = message.toLowerCase();
  const spot = position || "Diamniadio";

  if (msg.includes("restaurant") || msg.includes("manger") || msg.includes("food")) {
    return {
      reponse: `Jerejef - merci. Depuis ${spot}, je vous conseille Chez Dado a Diamniadio pour un repas local simple, ou la Cafeteria du Village Olympique si vous voulez une option rapide et ouverte tard. Pour Dakar, le Marche Kermel reste une tres bonne sortie si vous avez du temps. Tu pourrais aussi demander les options halal ou vegetariennes.`,
      suggestions: detectSuggestions(message),
    };
  }

  if (msg.includes("transport") || msg.includes("aller") || msg.includes("taxi")) {
    return {
      reponse: `Teranga - hospitalite. Pour aller de Dakar a Diamniadio, le TER reste l'option la plus simple : environ 45 minutes pour 1 500 FCFA. Pour un trajet plus direct, prenez un taxi et fixez le prix avant de monter. Tu pourrais aussi verifier les navettes JOJ si tu es accredite.`,
      suggestions: detectSuggestions(message),
    };
  }

  if (msg.includes("urgence") || msg.includes("medical")) {
    return {
      reponse: `Jambaar - courageux. En cas d'urgence medicale, appelez d'abord le 15 pour le SAMU Senegal. Ensuite, rapprochez-vous du point medical du Village Olympique ou du site de competition. Tu pourrais aussi noter le contact de ton responsable d'equipe.`,
      suggestions: ["Numero 15", "Point medical", "Responsable equipe"],
    };
  }

  return {
    reponse: `Mangi fi - je vais bien. Je peux t'aider sur les restaurants, les transports entre Dakar et Diamniadio, ou les visites comme l'Ile de Goree et la Corniche. En ce moment, depuis ${spot}, le plus pratique est de privilegier les trajets courts et les lieux deja references JOJ. Tu pourrais aussi me demander un itineraire ou une sortie apres competition.`,
    suggestions: detectSuggestions(message),
  };
}

export function getCapsuleForAthlete(athleteId: string, customExcerpts?: string[]) {
  if (customExcerpts && customExcerpts.length > 0) {
    const athlete = athleteById[athleteId] ?? athleteById[DEMO_ATHLETE_ID];
    return `Le soir tombait sur Dakar quand les mots ont fini par trouver leur forme. ${athlete.nom}, ${athlete.sport.toLowerCase()} de ${athlete.pays}, n'a pas seulement traverse une competition : ${customExcerpts.slice(0, 3).join(" ")} Dans ses phrases revenaient la peur, la tenue, le souffle, puis ce refus discret de disparaitre dans le bruit general. Chaque journal ajoute une couche a la memoire : moins un resultat qu'une presence. Aux JOJ, son histoire n'est plus un detail. Elle devient un fil humain, une preuve qu'une voix intime peut relier un village olympique entier.`;
  }

  return prebuiltCapsules[athleteId] ?? prebuiltCapsules[DEMO_ATHLETE_ID];
}
