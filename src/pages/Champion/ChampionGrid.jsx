import { useMemo, useState } from "react";
import { Save, Lock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Accordion from "../../components/ui/Accordion";
import Toggle from "../../components/ui/Toggle";
import ScoreSlider from "../../components/ui/ScoreSlider";
import Gauge from "../../components/ui/Gauge";
import Badge from "../../components/ui/Badge";
import EthicRadarChart from "../../components/charts/EthicRadarChart";
import {
  VALUE_CRITERIA,
  ETHIC_AXES,
  ROLES,
} from "../../utils/constants";
import {
  computeValueScore,
  valueScoreColor,
  computeEthicScore,
  computeAxisScores,
  ethicRiskLevel,
  MAX_ETHIC_SCORE,
} from "../../utils/scoring";

const VALIDATIONS = [
  "Je valide ce cas d'usage",
  "Je valide avec réserves",
  "Je ne valide pas",
];

export default function ChampionGrid({ ticket }) {
  const { currentUser, saveChampionGrid, pushToast } = useApp();
  const editable =
    currentUser?.role === ROLES.CHAMPION &&
    ticket.championUserId === currentUser.id;

  const [grid, setGrid] = useState(() => ({
    valueScores: { ...(ticket.championGrid?.valueScores || {}) },
    ethicAnswers: { ...(ticket.championGrid?.ethicAnswers || {}) },
    risks: {
      principale: "",
      mitigation: "",
      dependances: "",
      impacts: "",
      ...(ticket.championGrid?.risks || {}),
    },
    validation: ticket.championGrid?.validation || "",
    comment: ticket.championGrid?.comment || "",
  }));

  const valueScore = useMemo(
    () => computeValueScore(grid.valueScores),
    [grid.valueScores]
  );
  const ethicScore = useMemo(
    () => computeEthicScore(grid.ethicAnswers),
    [grid.ethicAnswers]
  );
  const axisData = useMemo(
    () => computeAxisScores(grid.ethicAnswers),
    [grid.ethicAnswers]
  );
  const level = ethicRiskLevel(ethicScore);

  const setValue = (k, v) =>
    setGrid((g) => ({ ...g, valueScores: { ...g.valueScores, [k]: v } }));
  const setAnswer = (k, v) =>
    setGrid((g) => ({ ...g, ethicAnswers: { ...g.ethicAnswers, [k]: v } }));
  const setRisk = (k, v) =>
    setGrid((g) => ({ ...g, risks: { ...g.risks, [k]: v } }));

  const handleSave = () => {
    const needsComment =
      grid.validation === "Je valide avec réserves" ||
      grid.validation === "Je ne valide pas";
    if (!grid.validation) {
      pushToast("Veuillez choisir une décision de validation.", "error");
      return;
    }
    if (needsComment && !grid.comment.trim()) {
      pushToast(
        "Un commentaire est obligatoire en cas de réserves ou de non-validation.",
        "error"
      );
      return;
    }
    saveChampionGrid(ticket.id, grid, currentUser.name);
    pushToast("Grille Champion enregistrée.", "success");
  };

  // count risk points contributed by each axis for accordion badges
  const axisPoints = (axisId) => axisData.find((a) =>
    (axisId === "donnees" && a.axis === "Données") ||
    (axisId === "personnes" && a.axis === "Personnes") ||
    (axisId === "controle" && a.axis === "Contrôle")
  )?.value || 0;

  return (
    <div className="space-y-6">
      {!editable && (
        <div className="panel px-4 py-3 flex items-center gap-2 text-sm text-muted">
          <Lock size={15} />
          {ticket.championGrid?.completed
            ? "Grille en lecture seule (modifiable uniquement par le Champion du ticket)."
            : "La grille n'a pas encore été remplie par le Champion."}
        </div>
      )}

      {/* SECTION A */}
      <section className="card p-5">
        <h3 className="font-semibold text-ink mb-1">
          Section A — Score de valeur métier
        </h3>
        <p className="text-sm text-muted mb-5">
          Évaluez chaque critère de 1 à 5.
        </p>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
          {VALUE_CRITERIA.map((c) => (
            <ScoreSlider
              key={c.key}
              label={c.label}
              value={grid.valueScores[c.key] || 0}
              onChange={(v) => setValue(c.key, v)}
              disabled={!editable}
            />
          ))}
        </div>
        <div className="mt-6 panel p-4">
          <Gauge
            label="Score de valeur moyen"
            value={valueScore}
            max={5}
            unit="/5"
            color={valueScoreColor(valueScore)}
            big
          />
        </div>
      </section>

      {/* SECTION B */}
      <section className="card p-5">
        <h3 className="font-semibold text-ink">
          Section B — Évaluation du risque éthique de l'agent
        </h3>
        <p className="text-sm text-muted mb-5 italic">
          Répondez honnêtement. Le score oriente la gouvernance, pas votre
          carrière.
        </p>

        <div className="space-y-3 mb-6">
          {ETHIC_AXES.map((axis) => (
            <Accordion
              key={axis.id}
              title={axis.title}
              right={
                <Badge color="#0071E3">+{axisPoints(axis.id)} pts</Badge>
              }
            >
              <div className="space-y-3 pt-3">
                {axis.questions.map((q) => (
                  <div
                    key={q.key}
                    className="flex items-center justify-between gap-4 flex-wrap"
                  >
                    <span className="text-sm text-ink flex-1 min-w-[200px]">
                      {q.label}
                      <span className="text-muted text-xs ml-2">
                        ({q.riskAnswer ? "oui" : "non"} = +{q.points})
                      </span>
                    </span>
                    <Toggle
                      value={grid.ethicAnswers[q.key]}
                      onChange={(v) => setAnswer(q.key, v)}
                      disabled={!editable}
                    />
                  </div>
                ))}
              </div>
            </Accordion>
          ))}
        </div>

        {/* Score dashboard */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6 flex flex-col justify-center">
            <div className="label mb-1">Score de risque éthique</div>
            <div className="flex items-end gap-3 mb-4">
              <span
                className="text-[56px] font-bold leading-none tracking-[-1px]"
                style={{ color: level.color }}
              >
                {ethicScore}
              </span>
              <span className="text-muted text-[15px] mb-2">
                / {MAX_ETHIC_SCORE} pts
              </span>
            </div>
            <Gauge value={ethicScore} max={MAX_ETHIC_SCORE} color={level.color} />
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <Badge color={level.color}>{level.label}</Badge>
              <p className="text-[15px] text-body">{level.reco}</p>
            </div>
          </div>
          <div className="card p-4">
            <p className="label text-center mb-1 mt-1">
              Répartition du risque par axe
            </p>
            <EthicRadarChart data={axisData} />
          </div>
        </div>
      </section>

      {/* SECTION C */}
      <section className="card p-5">
        <h3 className="font-semibold text-ink mb-4">
          Section C — Zones de risque Champion
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["principale", "Zone de risque principale identifiée"],
            ["mitigation", "Mesures de mitigation envisagées"],
            ["dependances", "Dépendances / contraintes techniques"],
            ["impacts", "Impacts potentiels en cas de dysfonctionnement"],
          ].map(([k, label]) => (
            <div key={k}>
              <label className="label">{label}</label>
              <textarea
                className="input min-h-[80px]"
                value={grid.risks[k]}
                onChange={(e) => setRisk(k, e.target.value)}
                disabled={!editable}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION D */}
      <section className="card p-5">
        <h3 className="font-semibold text-ink mb-4">
          Section D — Validation et commentaires
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {VALIDATIONS.map((v) => (
            <button
              key={v}
              type="button"
              disabled={!editable}
              onClick={() => setGrid((g) => ({ ...g, validation: v }))}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                grid.validation === v
                  ? "bg-gold/15 border-gold text-gold"
                  : "bg-bg border-border text-muted hover:text-ink"
              } disabled:opacity-60`}
            >
              {v}
            </button>
          ))}
        </div>
        <label className="label">
          Commentaire final{" "}
          {(grid.validation === "Je valide avec réserves" ||
            grid.validation === "Je ne valide pas") && (
            <span className="text-[#FF3B30]">* obligatoire</span>
          )}
        </label>
        <textarea
          className="input min-h-[90px]"
          value={grid.comment}
          onChange={(e) => setGrid((g) => ({ ...g, comment: e.target.value }))}
          disabled={!editable}
        />

        {editable && (
          <div className="flex justify-end mt-5">
            <button className="btn-primary" onClick={handleSave}>
              <Save size={16} />
              Enregistrer la grille
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
