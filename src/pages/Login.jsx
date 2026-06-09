import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ROLES, ROLE_LABELS } from "../utils/constants";

const ROLE_COLORS = {
  employe: "#0071E3",
  champion: "#5AC8FA",
  expert: "#AF52DE",
  cockpit: "#FF9F0A",
  admin: "#1D1D1F",
};

export default function Login() {
  const { users, login } = useApp();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("");

  const selected = users.find((u) => u.id === selectedId);

  const handleLogin = () => {
    if (!selected) return;
    login(selected);
    if (selected.role === ROLES.COCKPIT) navigate("/cockpit");
    else if (selected.role === ROLES.EMPLOYE) navigate("/tickets");
    else navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div
        className="w-full max-w-[420px] bg-card border border-border rounded-[24px] p-12 animate-fadeup"
      >
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold tracking-[-0.3px] text-ink">
            AI Governance
          </h1>
          <p className="text-[15px] text-muted mt-1.5">
            Plateforme de gouvernance IA agentique
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="label">Profil</label>
            <select
              className="input"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">Choisir un profil…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.title || ROLE_LABELS[u.role]}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-panel">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shrink-0"
                style={{ backgroundColor: ROLE_COLORS[selected.role] }}
              >
                {selected.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-ink truncate">
                  {selected.name}
                </div>
                <div className="text-[13px] text-muted truncate">
                  {ROLE_LABELS[selected.role]}
                  {selected.metier ? ` · ${selected.metier}` : ""}
                  {selected.instance ? ` · ${selected.instance}` : ""}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!selected}
            className="btn-primary w-full"
          >
            Se connecter
          </button>

          <p className="text-[12px] text-placeholder text-center">
            Aucun mot de passe requis — sélectionnez un profil de démonstration.
          </p>
        </div>
      </div>
    </div>
  );
}
