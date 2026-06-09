import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Filter } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../utils/formatters";
import { ethicRiskLevel } from "../../utils/scoring";
import {
  ROLES,
  STATUS_LIST,
  METIERS,
  PRIORITES,
  STATUSES,
} from "../../utils/constants";

const PAGE_SIZE = 8;

export default function TicketList() {
  const { tickets, currentUser, ticketEthicScore } = useApp();
  const navigate = useNavigate();
  const [fStatut, setFStatut] = useState("");
  const [fMetier, setFMetier] = useState("");
  const [fPriorite, setFPriorite] = useState("");
  const [page, setPage] = useState(1);

  // Role-based scoping of the visible tickets
  const scoped = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === ROLES.EMPLOYE) {
      return tickets.filter((t) => t.creatorUserId === currentUser.id);
    }
    if (currentUser.role === ROLES.CHAMPION) {
      return tickets.filter((t) => t.championUserId === currentUser.id);
    }
    if (currentUser.role === ROLES.EXPERT) {
      // tickets in instruction or beyond (where experts act)
      return tickets.filter((t) =>
        [
          STATUSES.INSTRUCTION,
          STATUSES.ARBITRAGE,
          STATUSES.APPROUVE,
          STATUSES.REFUSE,
          STATUSES.ATTENTE,
        ].includes(t.status)
      );
    }
    return tickets; // cockpit + admin see all
  }, [tickets, currentUser]);

  const filtered = useMemo(() => {
    return scoped.filter(
      (t) =>
        (!fStatut || t.status === fStatut) &&
        (!fMetier || t.metier === fMetier) &&
        (!fPriorite || t.priorite === fPriorite)
    );
  }, [scoped, fStatut, fMetier, fPriorite]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-muted text-sm">
            {filtered.length} ticket{filtered.length > 1 ? "s" : ""}
            {currentUser?.role === ROLES.CHAMPION ? " (vos cas d'usage)" : ""}
            {currentUser?.role === ROLES.EMPLOYE ? " (vos demandes)" : ""}
          </p>
        </div>
        {(currentUser?.role === ROLES.CHAMPION ||
          currentUser?.role === ROLES.EMPLOYE) && (
          <button
            className="btn-primary"
            onClick={() => navigate("/tickets/new")}
          >
            <PlusCircle size={18} />
            {currentUser?.role === ROLES.EMPLOYE
              ? "Nouvelle demande"
              : "Nouveau ticket"}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2 text-muted text-sm font-medium">
          <Filter size={16} /> Filtres
        </div>
        <div>
          <label className="label">Statut</label>
          <select
            className="input min-w-[180px]"
            value={fStatut}
            onChange={(e) => {
              setFStatut(e.target.value);
              resetPage();
            }}
          >
            <option value="">Tous</option>
            {STATUS_LIST.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Métier</label>
          <select
            className="input min-w-[150px]"
            value={fMetier}
            onChange={(e) => {
              setFMetier(e.target.value);
              resetPage();
            }}
          >
            <option value="">Tous</option>
            {METIERS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Priorité</label>
          <select
            className="input min-w-[130px]"
            value={fPriorite}
            onChange={(e) => {
              setFPriorite(e.target.value);
              resetPage();
            }}
          >
            <option value="">Toutes</option>
            {PRIORITES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        {(fStatut || fMetier || fPriorite) && (
          <button
            className="btn-ghost text-sm"
            onClick={() => {
              setFStatut("");
              setFMetier("");
              setFPriorite("");
              resetPage();
            }}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Métier</th>
                <th className="px-4 py-3 font-medium">Champion</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Score éthique</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((t) => {
                const score = ticketEthicScore(t);
                const level = score != null ? ethicRiskLevel(score) : null;
                return (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="border-b border-border/60 last:border-0 hover:bg-panel cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gold whitespace-nowrap">
                      {t.reference}
                    </td>
                    <td className="px-4 py-3 text-ink max-w-xs">
                      <div className="truncate">{t.title}</div>
                    </td>
                    <td className="px-4 py-3 text-muted">{t.metier}</td>
                    <td className="px-4 py-3 text-muted">{t.champion}</td>
                    <td className="px-4 py-3">
                      <Badge status={t.status} />
                    </td>
                    <td className="px-4 py-3">
                      {score != null ? (
                        <Badge color={level.color}>
                          {score} · {level.label}
                        </Badge>
                      ) : (
                        <span className="text-muted text-xs">Non évalué</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {formatDate(t.createdAt)}
                    </td>
                  </tr>
                );
              })}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted">
                    Aucun ticket ne correspond aux filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            className="btn-secondary text-sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </button>
          <span className="text-sm text-muted">
            Page {page} / {totalPages}
          </span>
          <button
            className="btn-secondary text-sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
