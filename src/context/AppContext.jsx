import { createContext, useContext, useState, useCallback } from "react";
import { demoTickets, demoUsers } from "../data/demoData";
import { STATUSES, ROLES } from "../utils/constants";
import { computeEthicScore } from "../utils/scoring";
import { nextReference, uid } from "../utils/formatters";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [users] = useState(demoUsers);
  const [tickets, setTickets] = useState(demoTickets);
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // ---- Toasts ----
  const pushToast = useCallback((message, type = "info") => {
    const id = uid("toast");
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  // ---- Auth ----
  const login = useCallback((user) => setCurrentUser(user), []);
  const logout = useCallback(() => setCurrentUser(null), []);

  // ---- Tickets ----
  const addHistory = (ticket, actor, action) => ({
    ...ticket,
    history: [
      ...(ticket.history || []),
      { ts: new Date().toISOString(), actor, action },
    ],
  });

  const createTicket = useCallback(
    (data) => {
      const now = new Date().toISOString();
      let created;
      // Auto-assign the matching Champion for the ticket's métier (so a ticket
      // créé par un employé remonte bien au Champion concerné, ex. RH -> Julie).
      const championForMetier = users.find(
        (u) => u.role === ROLES.CHAMPION && u.metier === data.metier
      );
      const isChampion = currentUser?.role === ROLES.CHAMPION;
      const assignedChampionId = isChampion
        ? currentUser.id
        : championForMetier?.id || null;
      const assignedChampionName = isChampion
        ? currentUser.name
        : championForMetier?.name || data.champion || "";

      setTickets((prev) => {
        const reference = nextReference(prev);
        created = {
          id: uid("t"),
          reference,
          status: STATUSES.SOUMIS,
          createdAt: now,
          updatedAt: now,
          creatorUserId: currentUser?.id || null,
          championGrid: {
            completed: false,
            savedAt: null,
            valueScores: {},
            ethicAnswers: {},
            risks: {
              principale: "",
              mitigation: "",
              dependances: "",
              impacts: "",
            },
            validation: "",
            comment: "",
          },
          expertReviews: {},
          cockpitDecision: null,
          history: [
            {
              ts: now,
              actor: currentUser?.name || data.champion || "Champion",
              action: "Ticket soumis",
            },
          ],
          ...data,
          // Assignation du Champion (prioritaire sur la saisie du formulaire)
          championUserId: assignedChampionId,
          champion: assignedChampionName,
        };
        // Trace l'affectation au Champion dans l'historique
        if (!isChampion && assignedChampionName) {
          created.history.push({
            ts: now,
            actor: "Système",
            action: `Ticket affecté au Champion ${assignedChampionName} (${data.metier})`,
          });
        }
        return [created, ...prev];
      });
      return created;
    },
    [currentUser, users]
  );

  const updateTicket = useCallback((id, patch) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...patch, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }, []);

  // ---- Module 2: Champion grid ----
  const saveChampionGrid = useCallback(
    (ticketId, grid, actorName) => {
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id !== ticketId) return t;
          const now = new Date().toISOString();
          const validated =
            grid.validation === "Je valide ce cas d'usage" ||
            grid.validation === "Je valide avec réserves";
          let next = {
            ...t,
            championGrid: { ...grid, completed: true, savedAt: now },
            updatedAt: now,
          };
          next = addHistory(
            next,
            actorName,
            `Grille Champion enregistrée (${grid.validation || "sans décision"})`
          );
          // advance to expert instruction if validated and still early in flow
          if (
            validated &&
            (t.status === STATUSES.SOUMIS ||
              t.status === STATUSES.QUALIFICATION)
          ) {
            next.status = STATUSES.INSTRUCTION;
            next = addHistory(
              next,
              "Système",
              "Passage en statut « Instruction experte »"
            );
          }
          return next;
        })
      );
    },
    []
  );

  // ---- Module 3: Expert review ----
  const submitExpertReview = useCallback((ticketId, instance, review, actorName) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const now = new Date().toISOString();
        const reviews = {
          ...t.expertReviews,
          [instance]: { ...review, submitted: true, submittedAt: now },
        };
        let next = { ...t, expertReviews: reviews, updatedAt: now };
        next = addHistory(
          next,
          actorName,
          `Avis ${instance} soumis : ${review.recommandation}`
        );
        // Nouvelle règle : dès le 1er avis reçu -> arbitrage AI Cockpit.
        if (t.status === STATUSES.INSTRUCTION) {
          next.status = STATUSES.ARBITRAGE;
          next = addHistory(
            next,
            "Système",
            "Premier avis expert reçu — passage en « Arbitrage AI Cockpit »"
          );
        }
        return next;
      })
    );
  }, []);

  // ---- Module 4: Cockpit decision ----
  const submitCockpitDecision = useCallback((ticketId, decision, actorName) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const now = new Date().toISOString();
        const statusMap = {
          Go: STATUSES.APPROUVE,
          Rework: STATUSES.ATTENTE,
          "No Go": STATUSES.REFUSE,
        };
        const newStatus = statusMap[decision.decision] || t.status;
        let next = {
          ...t,
          cockpitDecision: { ...decision, decidedAt: now, decidedBy: actorName },
          status: newStatus,
          updatedAt: now,
        };
        next = addHistory(
          next,
          actorName,
          `Décision AI Cockpit : ${decision.decision} → ${newStatus}`
        );
        return next;
      })
    );
  }, []);

  // ---- Derived helpers ----
  const getTicket = useCallback(
    (id) => tickets.find((t) => t.id === id),
    [tickets]
  );

  const ticketEthicScore = useCallback(
    (t) =>
      t?.championGrid?.completed
        ? computeEthicScore(t.championGrid.ethicAnswers)
        : null,
    []
  );

  const value = {
    users,
    tickets,
    currentUser,
    toasts,
    ROLES,
    login,
    logout,
    setCurrentUser,
    pushToast,
    dismissToast,
    createTicket,
    updateTicket,
    saveChampionGrid,
    submitExpertReview,
    submitCockpitDecision,
    getTicket,
    ticketEthicScore,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
