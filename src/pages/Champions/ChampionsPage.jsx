import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  FileText,
  BarChart3,
  ClipboardCheck,
  SlidersHorizontal,
  CheckSquare,
  Square,
  Rocket,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import { METIERS } from "../../utils/constants";

const PRESELECTION = [
  "Légitimité métier reconnue sur son périmètre",
  "Capacité à mobiliser et embarquer ses équipes",
  "Appétence pour l'IA sans excès d'enthousiasme naïf",
  "Sens des responsabilités et culture du risque",
  "Disponibilité réelle pour porter le rôle dans la durée",
];

const ENTRETIEN = [
  "Comment décidez-vous d'arrêter un agent qui ne tient pas ses promesses ?",
  "Quel est, selon vous, le pire scénario d'échec de cet agent ?",
  "Comment mesurerez-vous la valeur réellement créée ?",
  "Quelles données refuseriez-vous catégoriquement de confier à l'agent ?",
  "Comment gérez-vous un désaccord avec une instance experte ?",
];

const PROTOCOLE = [
  "Vérifier que le cas d'usage est clairement cadré et documenté",
  "S'assurer que la grille de décision Champion est complétée",
  "Confirmer que le score de risque éthique a été calculé",
  "Recueillir l'ensemble des avis experts requis",
  "Valider l'existence d'un mécanisme de supervision humaine",
  "Documenter les mesures de mitigation des risques identifiés",
  "Obtenir l'arbitrage de l'AI Cockpit avant tout déploiement",
];

function CheckList({ items, color = "#5AC8FA" }) {
  const [checked, setChecked] = useState(() => items.map(() => false));
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i}>
          <button
            type="button"
            onClick={() =>
              setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)))
            }
            className="flex items-start gap-2.5 text-left w-full group"
          >
            {checked[i] ? (
              <CheckSquare size={18} style={{ color }} className="shrink-0 mt-0.5" />
            ) : (
              <Square size={18} className="text-muted shrink-0 mt-0.5" />
            )}
            <span
              className={`text-sm ${
                checked[i] ? "text-muted line-through" : "text-ink"
              }`}
            >
              {item}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function ToolCard({ icon: Icon, title, desc, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-5 text-left hover:border-gold/50 transition-colors group"
    >
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: `${color}1f` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <h4 className="font-semibold text-ink group-hover:text-gold transition-colors">
        {title}
      </h4>
      <p className="text-sm text-muted mt-1">{desc}</p>
    </button>
  );
}

export default function ChampionsPage() {
  const navigate = useNavigate();
  const [metier, setMetier] = useState(METIERS[0]);
  const [protocoleOpen, setProtocoleOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* 1. Définition */}
      <section className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
            <Award size={26} className="text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink mb-2">
              Le rôle des Champions
            </h2>
            <p className="text-muted leading-relaxed">
              Pour que la gouvernance agentique fonctionne, il faut des acteurs
              qui en sont responsables. Ce sont les Champions. Dans notre
              approche, un Champion n'est pas un utilisateur enthousiaste de
              l'IA. C'est un <span className="text-ink font-medium">propriétaire d'agent</span> :
              il engage sa responsabilité sur la pertinence métier de l'agent,
              la fiabilité de ses résultats, et la décision de le déployer à
              l'échelle ou de l'arrêter.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Grille de sélection en deux temps */}
      <section>
        <h3 className="text-lg font-semibold text-ink mb-4">
          Grille de sélection en deux temps
        </h3>
        {/* métier tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {METIERS.map((m) => (
            <button
              key={m}
              onClick={() => setMetier(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                metier === m
                  ? "bg-turquoise/15 border-turquoise text-turquoise"
                  : "bg-bg border-border text-muted hover:text-ink"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card p-5">
            <h4 className="font-semibold text-ink mb-1">
              1 · Présélection sur dossier
            </h4>
            <p className="text-xs text-muted mb-4">
              Métier {metier} — 5 critères à valider
            </p>
            <CheckList items={PRESELECTION} color="#5AC8FA" />
          </div>
          <div className="card p-5">
            <h4 className="font-semibold text-ink mb-1">
              2 · Validation en entretien
            </h4>
            <p className="text-xs text-muted mb-4">
              Métier {metier} — 5 questions types
            </p>
            <CheckList items={ENTRETIEN} color="#AF52DE" />
          </div>
        </div>
      </section>

      {/* 3. Les 4 outils du Champion */}
      <section>
        <h3 className="text-lg font-semibold text-ink mb-4">
          Les 4 outils du Champion
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ToolCard
            icon={FileText}
            title="Fiche de cadrage"
            desc="Soumettre un nouveau cas d'usage agentique."
            color="#0071E3"
            onClick={() => navigate("/tickets/new")}
          />
          <ToolCard
            icon={BarChart3}
            title="Tableau de bord de performance"
            desc="Suivre l'état de vos tickets et agents."
            color="#5AC8FA"
            onClick={() => navigate("/tickets")}
          />
          <ToolCard
            icon={ClipboardCheck}
            title="Protocole de validation"
            desc="Consulter la checklist de validation."
            color="#AF52DE"
            onClick={() => setProtocoleOpen(true)}
          />
          <ToolCard
            icon={SlidersHorizontal}
            title="Grille de décision"
            desc="Évaluer valeur métier et risque éthique."
            color="#FF3B30"
            onClick={() => navigate("/tickets")}
          />
        </div>
      </section>

      {/* 4. Programme de formation */}
      <section className="card p-6">
        <h3 className="text-lg font-semibold text-ink mb-5 flex items-center gap-2">
          <Rocket size={20} className="text-gold" />
          Programme de formation
        </h3>
        <div className="relative pl-6 border-l-2 border-border space-y-8">
          <div className="relative">
            <span className="absolute -left-[31px] w-5 h-5 rounded-full bg-gold ring-4 ring-card" />
            <div className="text-gold font-semibold">Vague 1 — Gains rapides</div>
            <p className="text-sm text-muted mt-1">
              Finance, RH, IT — déploiement des premiers Champions sur les cas
              d'usage à forte valeur et risque maîtrisé.
            </p>
            <div className="flex gap-2 mt-2">
              {["Finance", "RH", "IT"].map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1 rounded-full text-xs bg-gold/15 text-gold"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <span className="absolute -left-[31px] w-5 h-5 rounded-full bg-lavender ring-4 ring-card" />
            <div className="text-lavender font-semibold">
              Vague 2 — Extension
            </div>
            <p className="text-sm text-muted mt-1">
              Conformité, Opérations — avant la vague 2 de déploiement, sur des
              périmètres plus sensibles.
            </p>
            <div className="flex gap-2 mt-2">
              {["Conformité", "Opérations"].map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1 rounded-full text-xs bg-lavender/15 text-lavender"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Protocole modal */}
      <Modal
        open={protocoleOpen}
        onClose={() => setProtocoleOpen(false)}
        title="Protocole de validation"
      >
        <p className="text-sm text-muted mb-4">
          Checklist à parcourir avant de proposer le déploiement d'un agent.
        </p>
        <CheckList items={PROTOCOLE} color="#34C759" />
      </Modal>
    </div>
  );
}
