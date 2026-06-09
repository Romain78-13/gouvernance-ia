import { useState } from "react";
import { Check, RotateCcw, X as XIcon, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import { computeEthicScore, computeValueScore, ethicRiskLevel } from "../../utils/scoring";

const DECISIONS = [
  { key: "Go", label: "Go", icon: Check, color: "#34C759" },
  { key: "Rework", label: "Rework", icon: RotateCcw, color: "#FF9F0A" },
  { key: "No Go", label: "No Go", icon: XIcon, color: "#FF3B30" },
];

const MIN_JUSTIF = 100;

export default function CockpitDecisionModal({ open, onClose, ticket }) {
  const { submitCockpitDecision, currentUser, pushToast } = useApp();
  const [decision, setDecision] = useState("");
  const [justification, setJustification] = useState("");
  const [conditions, setConditions] = useState("");
  const [certified, setCertified] = useState(false);

  if (!ticket) return null;

  const ethic = computeEthicScore(ticket.championGrid?.ethicAnswers || {});
  const value = computeValueScore(ticket.championGrid?.valueScores || {});
  const level = ethicRiskLevel(ethic);
  const valid = decision && certified && justification.trim().length >= MIN_JUSTIF;

  const confirm = () => {
    if (!valid) return;
    submitCockpitDecision(
      ticket.id,
      { decision, justification, conditions, certified },
      currentUser.name
    );
    pushToast(`Décision « ${decision} » enregistrée pour ${ticket.reference}.`, "success");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Décision AI Cockpit" maxWidth="max-w-2xl">
      {/* Summary */}
      <div className="panel p-4 mb-5">
        <div className="font-mono text-xs text-gold">{ticket.reference}</div>
        <div className="font-semibold text-ink mt-0.5">{ticket.title}</div>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <span className="text-muted">Métier : <span className="text-ink">{ticket.metier}</span></span>
          <span className="text-muted">Champion : <span className="text-ink">{ticket.champion}</span></span>
          <span className="text-muted">
            Valeur : <span className="text-ink">{value}/5</span>
          </span>
          <span className="text-muted flex items-center gap-1.5">
            Risque éthique : <Badge color={level.color}>{ethic} · {level.label}</Badge>
          </span>
        </div>
      </div>

      {/* Decision */}
      <label className="label">Décision</label>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {DECISIONS.map((d) => {
          const Icon = d.icon;
          const active = decision === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setDecision(d.key)}
              className="flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 font-semibold transition-colors"
              style={{
                color: active ? d.color : "#6E6E73",
                borderColor: active ? d.color : "#E5E5EA",
                backgroundColor: active ? `${d.color}1f` : "transparent",
              }}
            >
              <Icon size={22} />
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Justification */}
      <label className="label">
        Justification{" "}
        <span
          className={
            justification.trim().length >= MIN_JUSTIF
              ? "text-turquoise"
              : "text-[#FF3B30]"
          }
        >
          ({justification.trim().length}/{MIN_JUSTIF} caractères min.)
        </span>
      </label>
      <textarea
        className="input min-h-[100px] mb-4"
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
        placeholder="Motivez la décision au regard des avis experts et du risque éthique…"
      />

      <label className="label">Conditions éventuelles</label>
      <textarea
        className="input min-h-[60px] mb-4"
        value={conditions}
        onChange={(e) => setConditions(e.target.value)}
      />

      <label className="flex items-start gap-3 mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={certified}
          onChange={(e) => setCertified(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-gold"
        />
        <span className="text-sm text-muted">
          Je certifie avoir pris connaissance de l'ensemble des avis experts et
          j'assume la responsabilité de cette décision.
        </span>
      </label>

      <div className="flex justify-end gap-3">
        <button className="btn-secondary" onClick={onClose}>
          Annuler
        </button>
        <button className="btn-primary" disabled={!valid} onClick={confirm}>
          <ShieldCheck size={16} />
          Confirmer la décision
        </button>
      </div>
    </Modal>
  );
}
