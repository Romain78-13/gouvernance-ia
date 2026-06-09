// Shared domain constants for the AI Governance app.

export const ROLES = {
  EMPLOYE: "employe",
  CHAMPION: "champion",
  EXPERT: "expert",
  COCKPIT: "cockpit",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  employe: "Employé",
  champion: "Champion",
  expert: "Expert",
  cockpit: "AI Cockpit",
  admin: "Admin",
};

export const METIERS = ["Finance", "RH", "Opérations", "Conformité", "IT"];

export const PRIORITES = ["Haute", "Moyenne", "Faible"];

export const AUTONOMIES = ["Supervisé", "Semi-autonome", "Autonome"];

export const FREQUENCES = ["Quotidienne", "Hebdomadaire", "Mensuelle", "Ad hoc"];

export const PERIMETRES = ["France", "Europe", "International"];

export const VALEUR_OPTIONS = [
  "Productivité",
  "Qualité",
  "Automatisation",
  "Aide à la décision",
];

// The 7 expert instances
export const INSTANCES = [
  "Data & Security",
  "Enterprise Architecture",
  "DPO & Legal",
  "HR & Comms",
  "Cloud Architecture",
  "Infrastructure & Platforms",
  "Data & Analytics",
];

// Ticket workflow statuses
export const STATUSES = {
  SOUMIS: "Soumis",
  QUALIFICATION: "En qualification",
  INSTRUCTION: "Instruction experte",
  ARBITRAGE: "Arbitrage AI Cockpit",
  APPROUVE: "Approuvé",
  REFUSE: "Refusé",
  ATTENTE: "En attente",
};

export const STATUS_LIST = Object.values(STATUSES);

// status -> tailwind-ish color tokens (used by Badge component)
export const STATUS_COLORS = {
  Soumis: { dot: "#6E6E73", bg: "#F5F5F7", text: "#6E6E73" },
  "En qualification": { dot: "#0071E3", bg: "#E8F3FF", text: "#0071E3" },
  "Instruction experte": { dot: "#AF52DE", bg: "#F5EEFF", text: "#AF52DE" },
  "Arbitrage AI Cockpit": { dot: "#FF9F0A", bg: "#FFF4E0", text: "#FF9F0A" },
  Approuvé: { dot: "#34C759", bg: "#E8F8EE", text: "#34C759" },
  Refusé: { dot: "#FF3B30", bg: "#FFE8E8", text: "#FF3B30" },
  "En attente": { dot: "#FF9F0A", bg: "#FFF4E0", text: "#FF9F0A" },
};

// Champion business value criteria (Section A)
export const VALUE_CRITERIA = [
  { key: "productivite", label: "Gain de productivité estimé" },
  { key: "qualite", label: "Amélioration de la qualité des décisions" },
  { key: "risque", label: "Réduction du risque opérationnel" },
  { key: "alignement", label: "Alignement avec les priorités stratégiques" },
  { key: "faisabilite", label: "Faisabilité technique perçue" },
];

// Ethical risk questions (Section B). `riskAnswer` = the answer value that adds points.
export const ETHIC_AXES = [
  {
    id: "donnees",
    title: "Axe 1 — Caractère des données",
    questions: [
      {
        key: "d1",
        label: "L'agent traite-t-il des données personnelles identifiantes ?",
        riskAnswer: true,
        points: 2,
      },
      {
        key: "d2",
        label:
          "L'agent traite-t-il des données RH (évaluation, rémunération, performance) ?",
        riskAnswer: true,
        points: 3,
      },
      {
        key: "d3",
        label: "L'agent traite-t-il des données financières individuelles ?",
        riskAnswer: true,
        points: 2,
      },
      {
        key: "d4",
        label:
          "L'agent traite-t-il des données de santé ou sensibles au sens RGPD ?",
        riskAnswer: true,
        points: 4,
      },
      {
        key: "d5",
        label:
          "Les données sont-elles partagées avec des tiers ou systèmes externes ?",
        riskAnswer: true,
        points: 2,
      },
    ],
  },
  {
    id: "personnes",
    title: "Axe 2 — Impact sur les personnes",
    questions: [
      {
        key: "p1",
        label:
          "L'agent prend-il des décisions affectant directement des individus ?",
        riskAnswer: true,
        points: 4,
      },
      {
        key: "p2",
        label:
          "Les personnes concernées sont-elles informées du traitement automatisé ?",
        riskAnswer: false,
        points: 3,
      },
      {
        key: "p3",
        label:
          "Existe-t-il un recours humain possible en cas de contestation ?",
        riskAnswer: false,
        points: 3,
      },
      {
        key: "p4",
        label: "L'agent pourrait-il reproduire ou amplifier des biais existants ?",
        riskAnswer: true,
        points: 2,
      },
    ],
  },
  {
    id: "controle",
    title: "Axe 3 — Autonomie et contrôle",
    questions: [
      {
        key: "c1",
        label: "L'agent agit-il sans validation humaine systématique ?",
        riskAnswer: true,
        points: 2,
      },
      {
        key: "c2",
        label: "Les décisions de l'agent sont-elles traçables et explicables ?",
        riskAnswer: false,
        points: 3,
      },
      {
        key: "c3",
        label: "Y a-t-il un mécanisme d'arrêt d'urgence prévu ?",
        riskAnswer: false,
        points: 2,
      },
    ],
  },
];

// Expert checkpoint definitions by instance
export const EXPERT_CHECKPOINTS = {
  "DPO & Legal": [
    "Conformité RGPD sur les données traitées",
    "Conformité AI Act (classification du risque)",
    "Existence d'une base légale pour le traitement",
    "Droit d'information des personnes concernées",
    "Droit à l'intervention humaine prévu",
  ],
  "Data & Security": [
    "Principe de moindre privilège sur les accès",
    "Chiffrement des données en transit et au repos",
    "Traçabilité des accès et actions de l'agent",
    "Plan de continuité en cas de défaillance",
    "Absence de fuite de données sensibles",
  ],
  __generic: [
    "Alignement avec les standards de l'instance",
    "Risques identifiés dans le périmètre de l'instance",
    "Compatibilité avec les systèmes existants",
    "Exigences de conformité spécifiques",
    "Recommandations de l'instance",
  ],
};

export function getCheckpoints(instance) {
  return EXPERT_CHECKPOINTS[instance] || EXPERT_CHECKPOINTS.__generic;
}

export const CHECKPOINT_STATUSES = [
  "Conforme",
  "Non conforme",
  "Attention requise",
  "Non applicable",
];

export const EXPERT_RECOMMANDATIONS = [
  "Favorable",
  "Favorable avec conditions",
  "Défavorable",
];

export const CONFIANCE_NIVEAUX = ["Fort", "Modéré", "Faible"];
