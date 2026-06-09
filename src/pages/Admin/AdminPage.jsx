import { Users, Database } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Badge from "../../components/ui/Badge";
import { ROLE_LABELS } from "../../utils/constants";

export default function AdminPage() {
  const { users, tickets } = useApp();
  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
          <Users size={18} className="text-gold" />
          Utilisateurs ({users.length})
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="px-3 py-2 font-medium">Nom</th>
              <th className="px-3 py-2 font-medium">Rôle</th>
              <th className="px-3 py-2 font-medium">Métier / Instance</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-2.5 text-ink">{u.name}</td>
                <td className="px-3 py-2.5">
                  <Badge color="#AF52DE">{ROLE_LABELS[u.role]}</Badge>
                </td>
                <td className="px-3 py-2.5 text-muted">
                  {u.metier || u.instance || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-ink mb-2 flex items-center gap-2">
          <Database size={18} className="text-turquoise" />
          État des données (session)
        </h3>
        <p className="text-sm text-muted">
          {tickets.length} tickets en mémoire. Toutes les données sont gérées en
          session (aucune persistance) et seront réinitialisées au rechargement
          de la page.
        </p>
      </div>
    </div>
  );
}
