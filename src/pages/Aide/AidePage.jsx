import { useNavigate } from "react-router-dom";
import {
  FileText,
  ClipboardCheck,
  Users,
  Gavel,
  Rocket,
  PlusCircle,
  HelpCircle,
} from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    color: "#5AC8FA",
    title: "1 · Vous soumettez votre demande",
    text: "Décrivez votre besoin et l'agent IA envisagé via une fiche simple. Votre demande reçoit une référence (ex. AGT-2025-0004) et le statut « Soumis ».",
  },
  {
    icon: ClipboardCheck,
    color: "#AF52DE",
    title: "2 · Un Champion qualifie le cas d'usage",
    text: "Un Champion métier évalue la valeur et le niveau de risque de votre demande à l'aide d'une grille de décision. Statut : « Instruction experte ».",
  },
  {
    icon: Users,
    color: "#0071E3",
    title: "3 · Les experts donnent leur avis",
    text: "Les instances de gouvernance (sécurité, données, juridique, etc.) examinent la demande. Vous êtes informé qu'un avis a été reçu, sans en voir le détail.",
  },
  {
    icon: Gavel,
    color: "#5AC8FA",
    title: "4 · L'AI Cockpit arbitre",
    text: "Dès le premier avis expert reçu, l'AI Cockpit peut rendre sa décision : Go, Rework (à retravailler) ou No Go. Statut : « Arbitrage AI Cockpit ».",
  },
  {
    icon: Rocket,
    color: "#AF52DE",
    title: "5 · Décision et déploiement",
    text: "La demande devient « Approuvé », « En attente » ou « Refusé ». Vous suivez chaque changement de statut depuis vos demandes.",
  },
];

export default function AidePage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
            <HelpCircle size={26} className="text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink mb-2">
              Comment fonctionne le circuit de gouvernance ?
            </h2>
            <p className="text-muted leading-relaxed">
              Chaque demande d'agent IA suit un parcours en 5 étapes simples. Ce
              circuit garantit que votre besoin est bien cadré, évalué et validé
              avant tout déploiement.
            </p>
          </div>
        </div>
      </div>

      <div className="relative pl-6 border-l-2 border-border space-y-6">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="relative">
              <span
                className="absolute -left-[31px] w-5 h-5 rounded-full ring-4 ring-bg"
                style={{ backgroundColor: s.color }}
              />
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${s.color}1f` }}
                  >
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: s.color }}>
                    {s.title}
                  </h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-semibold text-ink">Prêt à démarrer ?</h3>
          <p className="text-sm text-muted mt-1">
            Soumettez votre première demande d'agent IA en quelques minutes.
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/tickets/new")}>
          <PlusCircle size={18} /> Nouvelle demande
        </button>
      </div>
    </div>
  );
}
