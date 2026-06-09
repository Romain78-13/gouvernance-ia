import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { pendingActionsForUser } from "../../utils/notifications";

const TITLES = [
  [/^\/$/, "Tableau de bord"],
  [/^\/cockpit/, "Tableau de bord AI Cockpit"],
  [/^\/tickets\/new/, "Nouveau ticket"],
  [/^\/tickets\/[^/]+\/edit/, "Édition du ticket"],
  [/^\/tickets\/[^/]+/, "Détail du ticket"],
  [/^\/tickets/, "Tickets"],
  [/^\/champions/, "Les Champions"],
  [/^\/admin/, "Administration"],
];

function titleFor(pathname) {
  for (const [re, label] of TITLES) if (re.test(pathname)) return label;
  return "AI Governance";
}

export default function Header() {
  const { currentUser, tickets } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const pending = pendingActionsForUser(currentUser, tickets);
  const count = pending.length;

  return (
    <header
      className="h-14 shrink-0 sticky top-0 z-[100] glass flex items-center justify-between px-10"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
    >
      <h1 className="text-[17px] font-semibold text-ink">
        {titleFor(location.pathname)}
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/tickets")}
          className="relative p-2 rounded-full text-muted hover:text-ink hover:bg-panel transition-colors"
          title={
            count > 0
              ? `${count} ticket(s) en attente de votre action`
              : "Aucune action en attente"
          }
        >
          <Bell size={20} strokeWidth={1.5} />
          {count > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-danger text-white text-[10px] font-semibold flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
        <div className="text-right leading-tight">
          <div className="text-[14px] font-medium text-ink">{currentUser?.name}</div>
          <div className="text-[12px] text-muted">{currentUser?.title}</div>
        </div>
      </div>
    </header>
  );
}
