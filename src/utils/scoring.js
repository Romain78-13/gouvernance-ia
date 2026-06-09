import { ETHIC_AXES, VALUE_CRITERIA } from "./constants";

// ---- Business value score (Section A) ----
// values: { productivite, qualite, risque, alignement, faisabilite } each 1..5
export function computeValueScore(values = {}) {
  const nums = VALUE_CRITERIA.map((c) => Number(values[c.key]) || 0);
  const filled = nums.filter((n) => n > 0);
  if (filled.length === 0) return 0;
  const avg = filled.reduce((a, b) => a + b, 0) / filled.length;
  return Math.round(avg * 10) / 10;
}

export function valueScoreColor(score) {
  if (score >= 4) return "#34C759"; // iOS green
  if (score >= 2) return "#FF9F0A"; // iOS orange
  return "#FF3B30"; // iOS red
}

// ---- Ethical risk score (Section B) ----
// answers: { d1: true/false, ... }
export function computeEthicScore(answers = {}) {
  let total = 0;
  for (const axis of ETHIC_AXES) {
    for (const q of axis.questions) {
      const a = answers[q.key];
      if (a === undefined || a === null) continue;
      if (a === q.riskAnswer) total += q.points;
    }
  }
  return total;
}

// per-axis risk points (used for the radar chart)
export function computeAxisScores(answers = {}) {
  return ETHIC_AXES.map((axis) => {
    let total = 0;
    let max = 0;
    for (const q of axis.questions) {
      max += q.points;
      const a = answers[q.key];
      if (a === q.riskAnswer) total += q.points;
    }
    return {
      axis:
        axis.id === "donnees"
          ? "Données"
          : axis.id === "personnes"
          ? "Personnes"
          : "Contrôle",
      value: total,
      max,
    };
  });
}

export function ethicRiskLevel(score) {
  if (score <= 4)
    return {
      label: "Risque faible",
      color: "#34C759",
      tone: "green",
      reco: "Déploiement standard possible",
    };
  if (score <= 9)
    return {
      label: "Risque modéré",
      color: "#FF9F0A",
      tone: "orange",
      reco: "Validation DPO/Legal requise",
    };
  if (score <= 14)
    return {
      label: "Risque élevé",
      color: "#FF3B30",
      tone: "red",
      reco: "Validation comité éthique + AI Cockpit",
    };
  return {
    label: "Risque critique",
    color: "#8B0000",
    tone: "darkred",
    reco: "Reformulation du cas d'usage requise",
  };
}

// Maximum possible ethical score (for gauge scaling)
export const MAX_ETHIC_SCORE = ETHIC_AXES.reduce(
  (sum, axis) => sum + axis.questions.reduce((s, q) => s + q.points, 0),
  0
);
