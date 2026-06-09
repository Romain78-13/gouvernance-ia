import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import Badge from "../components/ui/Badge";
import { ethicRiskLevel } from "../utils/scoring";
import { pendingActionsForUser } from "../utils/notifications";
import { formatDate } from "../utils/formatters";
import { ROLES, STATUSES } from "../utils/constants";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}1f` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <div className="text-2xl font-extrabold text-ink leading-none">
            {value}
          </div>
          <div className="text-xs text-muted mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { tickets, currentUser, ticketEthicScore } = useApp();
  const navigate = useNavigate();

  const scoped = useMemo(() => {
    if (currentUser?.role === ROLES.CHAMPION)
      return tickets.filter((t) => t.championUserId === currentUser.id);
    return tickets;
  }, [tickets, currentUser]);

  const pending = pendingActionsForUser(currentUser, tickets);

  const counts = {
    total: scoped.length,
    enCours: scoped.filter((t) =>
      [
        STATUSES.SOUMIS,
        STATUSES.QUALIFICATION,
        STATUSES.INSTRUCTION,
        STATUSES.ARBITRAGE,
        STATUSES.ATTENTE,
      ].includes(t.status)
    ).length,
    approuves: scoped.filter((t) => t.status === STATUSES.APPROUVE).length,
    pending: pending.length,
  };

  const recent = [...scoped]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="card p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">
            Bonjour {currentUser?.name.split(" ")[0]} 👋
          </h2>
          <p className="text-muted text-sm mt-1">
            {currentUser?.title} · Voici l'état de la gouvernance agentique.
          </p>
        </div>
        {currentUser?.role === ROLES.CHAMPION && (
          <button className="btn-primary" onClick={() => navigate("/tickets/new")}>
            <PlusCircle size={18} /> Nouveau ticket
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Ticket} label="Tickets" value={counts.total} color="#5AC8FA" />
        <StatCard icon={Clock} label="En cours" value={counts.enCours} color="#0071E3" />
        <StatCard
          icon={CheckCircle2}
          label="Approuvés"
          value={counts.approuves}
          color="#34C759"
        />
        <StatCard
          icon={AlertCircle}
          label="À traiter par vous"
          value={counts.pending}
          color="#FF3B30"
        />
      </div>

      {/* Pending actions */}
      {pending.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
            <AlertCircle size={18} className="text-[#FF3B30]" />
            Actions en attente ({pending.length})
          </h3>
          <div className="space-y-2">
            {pending.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/tickets/${t.id}`)}
                className="w-full panel px-4 py-3 flex items-center justify-between hover:bg-card transition-colors text-left"
              >
                <div>
                  <span className="font-mono text-xs text-gold mr-2">
                    {t.reference}
                  </span>
                  <span className="text-ink text-sm">{t.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={t.status} />
                  <ArrowRight size={16} className="text-muted" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent tickets */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-ink">Tickets récents</h3>
          <button
            className="btn-ghost text-sm"
            onClick={() => navigate("/tickets")}
          >
            Voir tout <ArrowRight size={14} />
          </button>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {recent.map((t) => {
              const score = ticketEthicScore(t);
              const level = score != null ? ethicRiskLevel(score) : null;
              return (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className="border-b border-border/60 last:border-0 hover:bg-panel cursor-pointer"
                >
                  <td className="px-5 py-3 font-mono text-xs text-gold">
                    {t.reference}
                  </td>
                  <td className="px-3 py-3 text-ink">{t.title}</td>
                  <td className="px-3 py-3 text-muted">{t.metier}</td>
                  <td className="px-3 py-3">
                    {level && <Badge color={level.color}>{score}</Badge>}
                  </td>
                  <td className="px-3 py-3">
                    <Badge status={t.status} />
                  </td>
                  <td className="px-5 py-3 text-muted whitespace-nowrap">
                    {formatDate(t.updatedAt)}
                  </td>
                </tr>
              );
            })}
            {recent.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-muted" colSpan={6}>
                  Aucun ticket pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
