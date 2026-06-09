import { ROLES, STATUSES } from "../utils/constants";

// ---- Demo users ----
// Ordre d'affichage volontaire pour la page de connexion (démo).
export const demoUsers = [
  {
    id: "u_antoine",
    name: "Antoine Lefebvre",
    role: ROLES.EMPLOYE,
    metier: "RH",
    email: "antoine.lefebvre@entreprise.fr",
    title: "Employé RH",
  },
  {
    id: "u_julie",
    name: "Julie Martin",
    role: ROLES.CHAMPION,
    metier: "RH",
    title: "Champion RH",
  },
  {
    id: "u_marc",
    name: "Marc Dubois",
    role: ROLES.EXPERT,
    instance: "DPO & Legal",
    title: "Expert DPO & Legal",
  },
  {
    id: "u_sarah",
    name: "Sarah Chen",
    role: ROLES.COCKPIT,
    title: "AI Cockpit",
  },
  {
    id: "u_admin",
    name: "Admin",
    role: ROLES.ADMIN,
    title: "Administrateur",
  },
];

function emptyCheckpoints(n = 5) {
  return Array.from({ length: n }, () => ({ status: "", comment: "" }));
}

// ---- Demo tickets ----
export const demoTickets = [
  {
    id: "t_0001",
    reference: "AGT-2025-0001",
    title: "Agent de pré-analyse des dossiers RH",
    metier: "RH",
    champion: "Julie Martin",
    championUserId: "u_julie",
    creatorUserId: "u_julie",
    sponsor: "Direction des Ressources Humaines",
    priorite: "Haute",
    status: STATUSES.INSTRUCTION,
    createdAt: "2025-03-04T09:12:00.000Z",
    updatedAt: "2025-04-18T14:30:00.000Z",
    // Étape 2
    probleme:
      "Le service RH passe un temps considérable à effectuer une première lecture des dossiers de candidature et des demandes internes. L'objectif est d'automatiser cette pré-analyse pour libérer du temps sur les tâches à forte valeur.",
    valeurs: ["Productivité", "Aide à la décision"],
    agentDescription:
      "Agent LLM connecté à l'outil RH qui lit les dossiers, en extrait une synthèse structurée et propose un pré-classement selon des critères définis par les recruteurs.",
    autonomie: "Semi-autonome",
    // Étape 3
    dataTypes:
      "CV, lettres de motivation, évaluations annuelles, données d'identité des collaborateurs et candidats.",
    donneesPerso: true,
    donneesSensibles: true,
    perimetre: "Europe",
    nbUsers: 45,
    frequence: "Quotidienne",
    // Module 2 — grille Champion (remplie)
    championGrid: {
      completed: true,
      savedAt: "2025-03-20T10:00:00.000Z",
      valueScores: {
        productivite: 5,
        qualite: 3,
        risque: 2,
        alignement: 4,
        faisabilite: 4,
      },
      // ethic score = 11 (risque élevé) : RH(+3) + non informé(+3) + pas de recours(+3) + sans validation(+2)
      ethicAnswers: {
        d1: false,
        d2: true,
        d3: false,
        d4: false,
        d5: false,
        p1: false,
        p2: false, // personnes NON informées => +3
        p3: false, // pas de recours => +3
        p4: false,
        c1: true, // sans validation => +2
        c2: true,
        c3: true,
      },
      risks: {
        principale:
          "Reproduction de biais de recrutement existants et atteinte à la vie privée des candidats.",
        mitigation:
          "Revue humaine systématique du pré-classement, anonymisation partielle des dossiers en entrée, audit des recommandations.",
        dependances:
          "Connecteur à l'outil RH (Workday), disponibilité d'un jeu de données d'entraînement représentatif.",
        impacts:
          "Discrimination involontaire de candidats, perte de confiance des collaborateurs, risque réglementaire RGPD.",
      },
      validation: "Je valide avec réserves",
      comment:
        "Le cas d'usage est pertinent mais nécessite des garde-fous forts sur les biais et l'information des personnes.",
    },
    // Module 3 — avis experts (DPO soumis, défavorable)
    expertReviews: {
      "DPO & Legal": {
        expert: "Marc Dubois",
        submitted: true,
        submittedAt: "2025-04-18T14:30:00.000Z",
        checkpoints: [
          {
            status: "Attention requise",
            comment:
              "Base légale à clarifier pour le traitement automatisé des candidatures.",
          },
          {
            status: "Non conforme",
            comment:
              "Classification AI Act probable en haut risque (recrutement) — exigences non remplies.",
          },
          {
            status: "Non conforme",
            comment: "Base légale insuffisamment documentée.",
          },
          {
            status: "Non conforme",
            comment: "Les personnes concernées ne sont pas informées.",
          },
          {
            status: "Attention requise",
            comment: "Le droit à l'intervention humaine doit être formalisé.",
          },
        ],
        recommandation: "Défavorable",
        conditions:
          "Mise en conformité AI Act, information explicite des candidats, formalisation du recours humain et DPIA complète avant toute reprise de l'instruction.",
        confiance: "Fort",
      },
    },
    cockpitDecision: null,
    history: [
      {
        ts: "2025-03-04T09:12:00.000Z",
        actor: "Julie Martin",
        action: "Ticket soumis",
      },
      {
        ts: "2025-03-20T10:00:00.000Z",
        actor: "Julie Martin",
        action: "Grille Champion enregistrée (validée avec réserves)",
      },
      {
        ts: "2025-03-20T10:00:00.000Z",
        actor: "Système",
        action: "Passage en statut « Instruction experte »",
      },
      {
        ts: "2025-04-18T14:30:00.000Z",
        actor: "Marc Dubois",
        action: "Avis DPO & Legal soumis : Défavorable",
      },
    ],
  },

  {
    id: "t_0002",
    reference: "AGT-2025-0002",
    title: "Agent de synthèse des rapports financiers",
    metier: "Finance",
    champion: "Thomas Renaud",
    championUserId: "u_thomas",
    creatorUserId: "u_thomas",
    sponsor: "Direction Financière",
    priorite: "Moyenne",
    status: STATUSES.ARBITRAGE,
    createdAt: "2025-02-10T08:00:00.000Z",
    updatedAt: "2025-05-02T16:45:00.000Z",
    probleme:
      "La production des synthèses mensuelles de rapports financiers est chronophage et répétitive pour les contrôleurs de gestion.",
    valeurs: ["Productivité", "Qualité", "Automatisation"],
    agentDescription:
      "Agent qui agrège des données financières déjà consolidées et produit une note de synthèse en langage naturel, sans accès aux données individuelles.",
    autonomie: "Supervisé",
    dataTypes:
      "Données financières agrégées (P&L, bilans consolidés), aucun identifiant individuel.",
    donneesPerso: false,
    donneesSensibles: false,
    perimetre: "France",
    nbUsers: 12,
    frequence: "Mensuelle",
    championGrid: {
      completed: true,
      savedAt: "2025-02-20T09:30:00.000Z",
      valueScores: {
        productivite: 4,
        qualite: 4,
        risque: 4,
        alignement: 4,
        faisabilite: 5,
      },
      // ethic score = 4 (risque faible) : sans validation(+2) + pas d'arrêt d'urgence(+2)
      ethicAnswers: {
        d1: false,
        d2: false,
        d3: false,
        d4: false,
        d5: false,
        p1: false,
        p2: true,
        p3: true,
        p4: false,
        c1: true, // +2
        c2: true,
        c3: false, // +2
      },
      risks: {
        principale:
          "Erreur d'interprétation des chiffres agrégés conduisant à une synthèse trompeuse.",
        mitigation:
          "Relecture systématique par un contrôleur de gestion, comparaison automatique avec la période précédente.",
        dependances: "Accès en lecture seule à l'entrepôt de données financières.",
        impacts:
          "Décision de pilotage erronée si la synthèse n'est pas relue. Impact limité car données agrégées.",
      },
      validation: "Je valide ce cas d'usage",
      comment: "",
    },
    // Seulement 2 avis rendus : l'arbitrage est déjà ouvert (≥ 1 avis suffit).
    expertReviews: {
      "DPO & Legal": {
        expert: "Marc Dubois",
        submitted: true,
        submittedAt: "2025-04-28T10:15:00.000Z",
        checkpoints: emptyCheckpoints(5).map(() => ({
          status: "Conforme",
          comment: "Données agrégées, aucun traitement de données personnelles.",
        })),
        recommandation: "Favorable",
        conditions: "",
        confiance: "Fort",
      },
      "Data & Security": {
        expert: "Léa Fontaine",
        submitted: true,
        submittedAt: "2025-05-02T16:45:00.000Z",
        checkpoints: emptyCheckpoints(5).map((_, idx) => ({
          status: idx === 1 ? "Attention requise" : "Conforme",
          comment:
            idx === 1
              ? "Chiffrement au repos à confirmer sur l'entrepôt cible."
              : "Conforme aux standards de l'instance.",
        })),
        recommandation: "Favorable avec conditions",
        conditions:
          "Confirmer le chiffrement au repos et la traçabilité des accès avant mise en production.",
        confiance: "Modéré",
      },
    },
    cockpitDecision: null,
    history: [
      {
        ts: "2025-02-10T08:00:00.000Z",
        actor: "Thomas Renaud",
        action: "Ticket soumis",
      },
      {
        ts: "2025-02-20T09:30:00.000Z",
        actor: "Thomas Renaud",
        action: "Grille Champion enregistrée (validée)",
      },
      {
        ts: "2025-02-20T09:30:00.000Z",
        actor: "Système",
        action: "Passage en statut « Instruction experte »",
      },
      {
        ts: "2025-04-28T10:15:00.000Z",
        actor: "Marc Dubois",
        action: "Avis DPO & Legal soumis : Favorable",
      },
      {
        ts: "2025-04-28T10:15:00.000Z",
        actor: "Système",
        action:
          "Premier avis expert reçu — passage en « Arbitrage AI Cockpit »",
      },
      {
        ts: "2025-05-02T16:45:00.000Z",
        actor: "Léa Fontaine",
        action: "Avis Data & Security soumis : Favorable avec conditions",
      },
    ],
  },

  {
    id: "t_0003",
    reference: "AGT-2025-0003",
    title: "Agent de détection d'anomalies de conformité",
    metier: "Conformité",
    champion: "Isabelle Morel",
    championUserId: null,
    creatorUserId: null,
    sponsor: "Direction de la Conformité",
    priorite: "Haute",
    status: STATUSES.SOUMIS,
    createdAt: "2025-05-28T11:20:00.000Z",
    updatedAt: "2025-05-28T11:20:00.000Z",
    probleme:
      "Les contrôles de conformité sont aujourd'hui réalisés par échantillonnage manuel, ce qui laisse passer des anomalies.",
    valeurs: ["Qualité", "Aide à la décision"],
    agentDescription:
      "Agent analysant les transactions et flux documentaires pour détecter des anomalies de conformité et alerter les équipes.",
    autonomie: "Supervisé",
    dataTypes:
      "Transactions, documents contractuels, journaux d'accès. À préciser durant l'instruction.",
    donneesPerso: true,
    donneesSensibles: false,
    perimetre: "International",
    nbUsers: 8,
    frequence: "Quotidienne",
    championGrid: {
      completed: false,
      savedAt: null,
      valueScores: {},
      ethicAnswers: {},
      risks: { principale: "", mitigation: "", dependances: "", impacts: "" },
      validation: "",
      comment: "",
    },
    expertReviews: {},
    cockpitDecision: null,
    history: [
      {
        ts: "2025-05-28T11:20:00.000Z",
        actor: "Isabelle Morel",
        action: "Ticket soumis",
      },
    ],
  },

  {
    id: "t_0004",
    reference: "AGT-2025-0004",
    title: "Agent d'aide à la rédaction des fiches de poste",
    metier: "RH",
    champion: "Antoine Lefebvre",
    championUserId: null,
    creatorUserId: "u_antoine",
    sponsor: "Direction des Ressources Humaines",
    priorite: "Moyenne",
    status: STATUSES.SOUMIS,
    createdAt: "2025-06-02T09:40:00.000Z",
    updatedAt: "2025-06-02T09:40:00.000Z",
    probleme:
      "La rédaction des fiches de poste est longue et hétérogène d'un service à l'autre. Un appui rédactionnel permettrait d'harmoniser et d'accélérer ce travail.",
    valeurs: ["Productivité", "Qualité"],
    agentDescription:
      "Agent qui propose une trame et un premier jet de fiche de poste à partir de quelques éléments saisis par le manager, à relire et valider.",
    autonomie: "Supervisé",
    dataTypes:
      "Intitulés de poste, missions, compétences attendues. Aucune donnée personnelle de collaborateur.",
    donneesPerso: false,
    donneesSensibles: false,
    perimetre: "France",
    nbUsers: 30,
    frequence: "Hebdomadaire",
    championGrid: {
      completed: false,
      savedAt: null,
      valueScores: {},
      ethicAnswers: {},
      risks: { principale: "", mitigation: "", dependances: "", impacts: "" },
      validation: "",
      comment: "",
    },
    expertReviews: {},
    cockpitDecision: null,
    history: [
      {
        ts: "2025-06-02T09:40:00.000Z",
        actor: "Antoine Lefebvre",
        action: "Demande soumise",
      },
    ],
  },
];
