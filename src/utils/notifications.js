import { ROLES, STATUSES, INSTANCES } from "./constants";

// Returns the list of tickets that require an action from the given user.
export function pendingActionsForUser(user, tickets) {
  if (!user) return [];
  switch (user.role) {
    case ROLES.EMPLOYE:
      // L'employé est notifié quand l'une de ses demandes a changé de statut
      // (c.-à-d. a progressé au-delà de « Soumis »).
      return tickets.filter(
        (t) => t.creatorUserId === user.id && t.status !== STATUSES.SOUMIS
      );
    case ROLES.CHAMPION:
      // own tickets that still need the Champion grid
      return tickets.filter(
        (t) =>
          t.championUserId === user.id &&
          !t.championGrid?.completed &&
          t.status === STATUSES.SOUMIS
      );
    case ROLES.EXPERT: {
      // tickets in expert instruction where this expert's instance hasn't ruled
      const inst = user.instance;
      if (!inst || !INSTANCES.includes(inst)) return [];
      return tickets.filter(
        (t) =>
          t.status === STATUSES.INSTRUCTION &&
          !t.expertReviews?.[inst]?.submitted
      );
    }
    case ROLES.COCKPIT:
    case ROLES.ADMIN:
      return tickets.filter((t) => t.status === STATUSES.ARBITRAGE);
    default:
      return [];
  }
}
