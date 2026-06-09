import { useState } from "react";
import { Send, Circle, Gavel } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Badge from "../../components/ui/Badge";
import {
  INSTANCES,
  ROLES,
  getCheckpoints,
  CHECKPOINT_STATUSES,
  EXPERT_RECOMMANDATIONS,
  CONFIANCE_NIVEAUX,
} from "../../utils/constants";

const RECO_COLOR = {
  Favorable: "#34C759",
  "Favorable avec conditions": "#FF9F0A",
  Défavorable: "#FF3B30",
};

function TrafficLight({ reco }) {
  const color = RECO_COLOR[reco] || "#6E6E73";
  return (
    <span className="inline-flex items-center gap-1.5">
      <Circle size={10} fill={color} color={color} />
      <span className="text-sm" style={{ color }}>
        {reco || "—"}
      </span>
    </span>
  );
}

function MiniLights({ reviews }) {
  return (
    <div className="flex items-center gap-1">
      {INSTANCES.map((inst) => {
        const r = reviews?.[inst];
        const color = r?.submitted
          ? RECO_COLOR[r.recommandation] || "#6E6E73"
          : "#E5E5EA";
        return (
          <span
            key={inst}
            title={`${inst}${r?.submitted ? " · " + r.recommandation : " · en attente"}`}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}

export { MiniLights };

export default function ExpertReview({ ticket }) {
  const { currentUser } = useApp();
  const reviews = ticket.expertReviews || {};
  const submittedCount = INSTANCES.filter((i) => reviews[i]?.submitted).length;
  const pct = Math.round((submittedCount / INSTANCES.length) * 100);

  const isExpert = currentUser?.role === ROLES.EXPERT && currentUser?.instance;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-ink">Synthèse des avis experts</h3>
          <span className="text-sm text-muted">
            {submittedCount}/{INSTANCES.length} instances ont rendu leur avis
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-bg border border-border overflow-hidden">
          <div
            className="h-full bg-lavender rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm mt-3 text-gold flex items-center gap-2">
          <Gavel size={15} />
          {submittedCount}/{INSTANCES.length} instances ont rendu leur avis —
          L'AI Cockpit peut arbitrer dès le premier avis reçu.
        </p>
      </div>

      {/* Synthesis table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">Instance</th>
                <th className="px-4 py-3 font-medium">Expert</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Recommandation</th>
                <th className="px-4 py-3 font-medium">Confiance</th>
              </tr>
            </thead>
            <tbody>
              {INSTANCES.map((inst) => {
                const r = reviews[inst];
                return (
                  <tr
                    key={inst}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-4 py-3 text-ink font-medium">{inst}</td>
                    <td className="px-4 py-3 text-muted">
                      {r?.expert || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r?.submitted ? (
                        <Badge color="#34C759">Rendu</Badge>
                      ) : (
                        <Badge color="#6E6E73">En attente</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r?.submitted ? <TrafficLight reco={r.recommandation} /> : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">{r?.confiance || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expert form */}
      {isExpert && (
        <ExpertForm ticket={ticket} instance={currentUser.instance} />
      )}
    </div>
  );
}

function ExpertForm({ ticket, instance }) {
  const { currentUser, submitExpertReview, pushToast } = useApp();
  const checkpoints = getCheckpoints(instance);
  const existing = ticket.expertReviews?.[instance];

  const [cps, setCps] = useState(() =>
    checkpoints.map((_, i) => ({
      status: existing?.checkpoints?.[i]?.status || "",
      comment: existing?.checkpoints?.[i]?.comment || "",
    }))
  );
  const [recommandation, setRecommandation] = useState(
    existing?.recommandation || ""
  );
  const [conditions, setConditions] = useState(existing?.conditions || "");
  const [confiance, setConfiance] = useState(existing?.confiance || "");

  const setCp = (i, key, val) =>
    setCps((arr) => arr.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));

  const submit = () => {
    if (!recommandation) {
      pushToast("Choisissez une recommandation globale.", "error");
      return;
    }
    if (!confiance) {
      pushToast("Indiquez votre niveau de confiance.", "error");
      return;
    }
    submitExpertReview(
      ticket.id,
      instance,
      { expert: currentUser.name, checkpoints: cps, recommandation, conditions, confiance },
      currentUser.name
    );
    pushToast(`Avis ${instance} soumis.`, "success");
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-ink">
          Mon avis — <span className="text-lavender">{instance}</span>
        </h3>
        {existing?.submitted && <Badge color="#34C759">Déjà soumis</Badge>}
      </div>
      <p className="text-sm text-muted mb-5">
        Expert : {currentUser.name} · Ticket {ticket.reference}
      </p>

      <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
        Points de contrôle
      </h4>
      <div className="space-y-3 mb-6">
        {checkpoints.map((cp, i) => (
          <div key={i} className="panel p-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <span className="text-sm text-ink flex-1 min-w-[200px]">
                {i + 1}. {cp}
              </span>
              <select
                className="input max-w-[200px]"
                value={cps[i].status}
                onChange={(e) => setCp(i, "status", e.target.value)}
              >
                <option value="">— Statut —</option>
                {CHECKPOINT_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <textarea
              className="input mt-2 min-h-[50px] text-sm"
              placeholder="Commentaire"
              value={cps[i].comment}
              onChange={(e) => setCp(i, "comment", e.target.value)}
            />
          </div>
        ))}
      </div>

      <h4 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
        Avis final de l'instance
      </h4>
      <label className="label">Recommandation globale</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {EXPERT_RECOMMANDATIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRecommandation(r)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              recommandation === r
                ? "border-current"
                : "bg-bg border-border text-muted hover:text-ink"
            }`}
            style={
              recommandation === r
                ? {
                    color: RECO_COLOR[r],
                    backgroundColor: `${RECO_COLOR[r]}26`,
                    borderColor: RECO_COLOR[r],
                  }
                : undefined
            }
          >
            {r}
          </button>
        ))}
      </div>

      {recommandation === "Favorable avec conditions" && (
        <div className="mb-4">
          <label className="label">Conditions</label>
          <textarea
            className="input min-h-[70px]"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
          />
        </div>
      )}

      <label className="label">Niveau de confiance</label>
      <select
        className="input max-w-xs mb-5"
        value={confiance}
        onChange={(e) => setConfiance(e.target.value)}
      >
        <option value="">— Choisir —</option>
        {CONFIANCE_NIVEAUX.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <div className="flex justify-end">
        <button className="btn-primary" onClick={submit}>
          <Send size={16} />
          Soumettre l'avis
        </button>
      </div>
    </div>
  );
}
