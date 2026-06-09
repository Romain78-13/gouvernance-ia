import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, AlertTriangle, ShieldAlert, CheckCircle2, Gavel, Star } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Badge from "../../components/ui/Badge";
import StatusPieChart from "../../components/charts/StatusPieChart";
import MetierBarChart from "../../components/charts/MetierBarChart";
import CockpitDecisionModal from "./CockpitDecisionModal";
import { MiniLights } from "../Expert/ExpertReview";
import {
  computeEthicScore,
  computeValueScore,
  ethicRiskLevel,
} from "../../utils/scoring";
import { STATUSES, STATUS_LIST, METIERS, INSTANCES } from "../../utils/constants";
import { daysSince } from "../../utils/formatters";

function KpiCard({ icon: Icon, label, value, color, alert, hint }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted">{label}</span>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}1f` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="text-3xl font-extrabold" style={{ color: alert ? "#FF3B30" : "#1D1D1F" }}>
        {value}
      </div>
      {hint && <div className="text-xs text-muted mt-1">{hint}</div>}
    </div>
  );
}

export default function CockpitDashboard() {
  const { tickets } = useApp();
  const navigate = useNavigate();
  const [decisionTicket, setDecisionTicket] = useState(null);

  const activeStatuses = [
    STATUSES.SOUMIS,
    STATUSES.QUALIFICATION,
    STATUSES.INSTRUCTION,
    STATUSES.ARBITRAGE,
    STATUSES.ATTENTE,
  ];

  const stats = useMemo(() => {
    const active = tickets.filter((t) => activeStatuses.includes(t.status));
    const overdue = tickets.filter(
      (t) => t.status === STATUSES.ARBITRAGE && daysSince(t.updatedAt) > 14
    );
    const scored = tickets
      .filter((t) => t.championGrid?.completed)
      .map((t) => computeEthicScore(t.championGrid.ethicAnswers));
    const avgEthic = scored.length
      ? Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) / 10
      : 0;
    const decided = tickets.filter((t) => t.cockpitDecision);
    const gos = decided.filter((t) => t.cockpitDecision.decision === "Go");
    const approvalRate = decided.length
      ? Math.round((gos.length / decided.length) * 100)
      : 0;
    return {
      active: active.length,
      overdue: overdue.length,
      avgEthic,
      approvalRate,
      decidedCount: decided.length,
    };
  }, [tickets]);

  const statusData = STATUS_LIST.map((s) => ({
    name: s,
    value: tickets.filter((t) => t.status === s).length,
  }));
  const metierData = METIERS.map((m) => ({
    name: m,
    value: tickets.filter((t) => t.metier === m).length,
  }));

  const queue = tickets.filter((t) => t.status === STATUSES.ARBITRAGE);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Activity}
          label="Tickets actifs"
          value={stats.active}
          color="#5AC8FA"
        />
        <KpiCard
          icon={AlertTriangle}
          label="En attente > 14 jours"
          value={stats.overdue}
          color="#FF3B30"
          alert={stats.overdue > 0}
          hint={stats.overdue > 0 ? "Action urgente requise" : "Aucun retard"}
        />
        <KpiCard
          icon={ShieldAlert}
          label="Score éthique moyen"
          value={stats.avgEthic}
          color="#0071E3"
          hint="Sur le portefeuille évalué"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Taux d'approbation"
          value={`${stats.approvalRate}%`}
          color="#34C759"
          hint={`${stats.decidedCount} décision(s) rendue(s)`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-semibold text-ink mb-3">Répartition par statut</h3>
          <StatusPieChart data={statusData} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-ink mb-3">Tickets par métier</h3>
          <MetierBarChart data={metierData} />
        </div>
      </div>

      {/* Arbitration queue */}
      <div>
        <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
          <Gavel size={18} className="text-gold" />
          File d'arbitrage ({queue.length})
        </h3>
        {queue.length === 0 ? (
          <div className="card p-8 text-center text-muted">
            Aucun ticket en attente d'arbitrage.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {queue.map((t) => {
              const ethic = computeEthicScore(t.championGrid?.ethicAnswers || {});
              const value = computeValueScore(t.championGrid?.valueScores || {});
              const level = ethicRiskLevel(ethic);
              return (
                <div key={t.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/tickets/${t.id}`)}
                    >
                      <div className="font-mono text-xs text-gold">{t.reference}</div>
                      <div className="font-semibold text-ink hover:text-gold transition-colors">
                        {t.title}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {t.metier} · {t.champion}
                      </div>
                    </div>
                    <Badge color={level.color}>{ethic}</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted">
                      <Star size={14} className="text-gold" fill="#0071E3" />
                      Valeur <span className="text-ink font-semibold">{value}/5</span>
                    </span>
                    <span className="text-muted">
                      Risque <Badge color={level.color}>{level.label}</Badge>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <div className="text-xs text-muted mb-1">
                        Avis experts ·{" "}
                        <span className="text-gold font-semibold">
                          {
                            INSTANCES.filter(
                              (i) => t.expertReviews?.[i]?.submitted
                            ).length
                          }
                          /{INSTANCES.length} avis reçus
                        </span>
                      </div>
                      <MiniLights reviews={t.expertReviews} />
                    </div>
                    <button
                      className="btn-primary text-sm"
                      onClick={() => setDecisionTicket(t)}
                    >
                      <Gavel size={15} /> Prendre une décision
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CockpitDecisionModal
        open={Boolean(decisionTicket)}
        onClose={() => setDecisionTicket(null)}
        ticket={decisionTicket}
      />
    </div>
  );
}
