import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Pencil, Gavel, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Badge from "../../components/ui/Badge";
import ChampionGrid from "../Champion/ChampionGrid";
import ExpertReview from "../Expert/ExpertReview";
import CockpitDecisionModal from "../Cockpit/CockpitDecisionModal";
import { formatDate, formatDateTime } from "../../utils/formatters";
import { ROLES, STATUSES } from "../../utils/constants";

function InfoRow({ label, value }) {
  return (
    <div className="flex gap-3 py-2 border-b border-border/50 last:border-0">
      <span className="text-muted w-52 shrink-0 text-sm">{label}</span>
      <span className="text-ink text-sm">{value || "—"}</span>
    </div>
  );
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTicket, currentUser } = useApp();
  const [tab, setTab] = useState(0);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const ticket = getTicket(id);

  const canEdit = useMemo(
    () =>
      currentUser?.role === ROLES.CHAMPION &&
      ticket?.championUserId === currentUser.id,
    [currentUser, ticket]
  );

  if (!ticket) {
    return (
      <div className="card p-8 text-center text-muted">
        Ticket introuvable.
        <div className="mt-4">
          <button className="btn-secondary" onClick={() => navigate("/tickets")}>
            Retour aux tickets
          </button>
        </div>
      </div>
    );
  }

  const isCockpit =
    currentUser?.role === ROLES.COCKPIT || currentUser?.role === ROLES.ADMIN;
  const isEmployee = currentUser?.role === ROLES.EMPLOYE;

  // L'employé ne voit que les informations et l'historique (sans les détails experts).
  const tabs = isEmployee
    ? [
        { label: "Informations", content: <InfoTab ticket={ticket} /> },
        {
          label: "Historique",
          content: <HistoryTab ticket={ticket} employeeView />,
        },
      ]
    : [
        { label: "Informations", content: <InfoTab ticket={ticket} /> },
        { label: "Grille Champion", content: <ChampionGrid ticket={ticket} /> },
        { label: "Avis Experts", content: <ExpertReview ticket={ticket} /> },
        {
          label: "Décision AI Cockpit",
          content: (
            <DecisionTab
              ticket={ticket}
              isCockpit={isCockpit}
              onDecide={() => setDecisionOpen(true)}
            />
          ),
        },
        { label: "Historique", content: <HistoryTab ticket={ticket} /> },
      ];
  const activeTab = Math.min(tab, tabs.length - 1);

  return (
    <div>
      <button onClick={() => navigate("/tickets")} className="btn-ghost text-sm mb-4 -ml-2">
        <ChevronLeft size={16} /> Tickets
      </button>

      {/* Header */}
      <div className="card p-5 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-sm text-gold">{ticket.reference}</span>
              <Badge status={ticket.status} />
            </div>
            <h2 className="text-2xl font-bold text-ink">{ticket.title}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted">
              <span>Métier : {ticket.metier}</span>
              <span>Champion : {ticket.champion}</span>
              <span>Créé le {formatDate(ticket.createdAt)}</span>
              <span>MàJ {formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <button
                className="btn-secondary"
                onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
              >
                <Pencil size={16} /> Éditer
              </button>
            )}
            {isCockpit && ticket.status === STATUSES.ARBITRAGE && (
              <button className="btn-primary" onClick={() => setDecisionOpen(true)}>
                <Gavel size={16} /> Prendre une décision
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-5 overflow-x-auto">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTab(i)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === i
                ? "border-gold text-gold"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tabs[activeTab].content}

      <CockpitDecisionModal
        open={decisionOpen}
        onClose={() => setDecisionOpen(false)}
        ticket={ticket}
      />
    </div>
  );
}

function InfoTab({ ticket }) {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="card p-5">
        <h3 className="font-semibold text-ink mb-3">Identification</h3>
        <InfoRow label="Titre" value={ticket.title} />
        <InfoRow label="Métier" value={ticket.metier} />
        <InfoRow label="Champion responsable" value={ticket.champion} />
        <InfoRow label="Sponsor métier" value={ticket.sponsor} />
        <InfoRow label="Priorité perçue" value={ticket.priorite} />
      </div>
      <div className="card p-5">
        <h3 className="font-semibold text-ink mb-3">Description</h3>
        <InfoRow label="Problème métier" value={ticket.probleme} />
        <InfoRow label="Valeur attendue" value={(ticket.valeurs || []).join(", ")} />
        <InfoRow label="Agent envisagé" value={ticket.agentDescription} />
        <InfoRow label="Niveau d'autonomie" value={ticket.autonomie} />
      </div>
      <div className="card p-5 lg:col-span-2">
        <h3 className="font-semibold text-ink mb-3">Données</h3>
        <div className="grid md:grid-cols-2 gap-x-8">
          <div>
            <InfoRow label="Types de données" value={ticket.dataTypes} />
            <InfoRow
              label="Données personnelles"
              value={ticket.donneesPerso ? "Oui" : "Non"}
            />
            <InfoRow
              label="Données sensibles"
              value={ticket.donneesSensibles ? "Oui" : "Non"}
            />
          </div>
          <div>
            <InfoRow label="Périmètre géographique" value={ticket.perimetre} />
            <InfoRow label="Utilisateurs concernés" value={ticket.nbUsers} />
            <InfoRow label="Fréquence d'utilisation" value={ticket.frequence} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionTab({ ticket, isCockpit, onDecide }) {
  const d = ticket.cockpitDecision;
  if (!d) {
    return (
      <div className="card p-8 text-center">
        <p className="text-muted mb-4">
          Aucune décision AI Cockpit n'a encore été prise pour ce ticket.
        </p>
        {isCockpit && ticket.status === STATUSES.ARBITRAGE && (
          <button className="btn-primary" onClick={onDecide}>
            <Gavel size={16} /> Prendre une décision
          </button>
        )}
        {ticket.status !== STATUSES.ARBITRAGE && (
          <p className="text-xs text-muted">
            Le ticket doit être en « Arbitrage AI Cockpit » pour être arbitré.
          </p>
        )}
      </div>
    );
  }
  const decisionColor =
    d.decision === "Go" ? "#34C759" : d.decision === "Rework" ? "#FF9F0A" : "#FF3B30";
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Badge color={decisionColor}>{d.decision}</Badge>
        <span className="text-sm text-muted">
          par {d.decidedBy} · {formatDateTime(d.decidedAt)}
        </span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-muted mb-1">Justification</h4>
        <p className="text-ink text-sm whitespace-pre-wrap">{d.justification}</p>
      </div>
      {d.conditions && (
        <div>
          <h4 className="text-sm font-semibold text-muted mb-1">Conditions</h4>
          <p className="text-ink text-sm whitespace-pre-wrap">{d.conditions}</p>
        </div>
      )}
    </div>
  );
}

function HistoryTab({ ticket, employeeView = false }) {
  // Pour l'employé : on masque le contenu des avis experts (juste « Avis expert reçu »).
  const sanitize = (h) => {
    if (!employeeView) return h;
    if (/^Avis .+ soumis/i.test(h.action)) {
      return { ...h, action: "Avis expert reçu", actor: "Instance experte" };
    }
    return h;
  };
  const history = [...(ticket.history || [])].map(sanitize).reverse();
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-ink mb-4">Journal des actions</h3>
      <ol className="relative border-l border-border ml-2">
        {history.map((h, i) => (
          <li key={i} className="mb-5 ml-5 last:mb-0">
            <span className="absolute -left-[7px] flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gold ring-4 ring-card" />
            <div className="flex items-center gap-2 text-xs text-muted mb-0.5">
              <Clock size={12} />
              {formatDateTime(h.ts)}
            </div>
            <div className="text-sm text-ink">{h.action}</div>
            <div className="text-xs text-muted">par {h.actor}</div>
          </li>
        ))}
        {history.length === 0 && (
          <p className="text-muted text-sm ml-5">Aucune action enregistrée.</p>
        )}
      </ol>
    </div>
  );
}
