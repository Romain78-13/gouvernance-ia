import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Award,
  Gauge as GaugeIcon,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ROLES, ROLE_LABELS } from "../../utils/constants";

function menuForRole(role) {
  switch (role) {
    case ROLES.EMPLOYE:
      return [
        { to: "/tickets", label: "Mes demandes", icon: Ticket },
        { to: "/tickets/new", label: "Nouvelle demande", icon: PlusCircle },
        { to: "/aide", label: "Aide", icon: HelpCircle },
      ];
    case ROLES.CHAMPION:
      return [
        { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/tickets", label: "Mes tickets", icon: Ticket },
        { to: "/tickets/new", label: "Nouveau ticket", icon: PlusCircle },
        { to: "/champions", label: "Champions", icon: Award },
      ];
    case ROLES.EXPERT:
      return [
        { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/tickets", label: "Tickets à traiter", icon: Ticket },
        { to: "/champions", label: "Champions", icon: Award },
      ];
    case ROLES.COCKPIT:
      return [
        { to: "/cockpit", label: "Dashboard Cockpit", icon: GaugeIcon },
        { to: "/tickets", label: "Tous les tickets", icon: Ticket },
        { to: "/champions", label: "Champions", icon: Award },
      ];
    case ROLES.ADMIN:
      return [
        { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/cockpit", label: "Dashboard Cockpit", icon: GaugeIcon },
        { to: "/tickets", label: "Tous les tickets", icon: Ticket },
        { to: "/tickets/new", label: "Nouveau ticket", icon: PlusCircle },
        { to: "/champions", label: "Champions", icon: Award },
        { to: "/admin", label: "Administration", icon: Settings },
      ];
    default:
      return [];
  }
}

const ROLE_COLORS = {
  employe: "#0071E3",
  champion: "#5AC8FA",
  expert: "#AF52DE",
  cockpit: "#FF9F0A",
  admin: "#1D1D1F",
};

export default function Sidebar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  if (!currentUser) return null;
  const menu = menuForRole(currentUser.role);
  const roleColor = ROLE_COLORS[currentUser.role] || "#6E6E73";

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-card border-r border-separator flex flex-col">
      {/* Logo */}
      <div className="px-6 h-14 flex items-center">
        <span className="text-[17px] font-bold text-ink">AI Governance</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-0.5">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-panel text-blue"
                    : "text-muted hover:text-ink hover:bg-panel"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className={isActive ? "text-blue" : ""}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="px-3 py-4 border-t border-separator">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white shrink-0 text-[15px]"
            style={{ backgroundColor: roleColor }}
          >
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-ink truncate">
              {currentUser.name}
            </div>
            <div className="text-[12px] text-muted truncate">
              {currentUser.title || ROLE_LABELS[currentUser.role]}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="btn-secondary w-full !py-2.5 text-[14px]"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Changer de profil
        </button>
      </div>
    </aside>
  );
}
