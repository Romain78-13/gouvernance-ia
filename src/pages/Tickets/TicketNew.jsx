import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Send, Pencil } from "lucide-react";
import { useApp } from "../../context/AppContext";
import WizardProgress from "../../components/ui/Wizard";
import IOSToggle from "../../components/ui/IOSToggle";
import {
  METIERS,
  PRIORITES,
  AUTONOMIES,
  FREQUENCES,
  PERIMETRES,
  VALEUR_OPTIONS,
  ROLES,
} from "../../utils/constants";

const STEPS = ["Identification", "Description", "Données", "Récapitulatif"];

const empty = {
  title: "",
  metier: "Finance",
  champion: "",
  sponsor: "",
  priorite: "Moyenne",
  probleme: "",
  valeurs: [],
  agentDescription: "",
  autonomie: "Supervisé",
  dataTypes: "",
  donneesPerso: false,
  donneesSensibles: false,
  perimetre: "France",
  nbUsers: "",
  frequence: "Mensuelle",
};

function Field({ label, children, required }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-[#FF3B30]">*</span>}
      </label>
      {children}
    </div>
  );
}

function RadioRow({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            value === opt
              ? "bg-gold/15 border-gold text-gold"
              : "bg-bg border-border text-muted hover:text-ink"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function TicketNew() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { currentUser, users, createTicket, updateTicket, getTicket, pushToast } =
    useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const isChampion = currentUser?.role === ROLES.CHAMPION;
  const isEmployee = currentUser?.role === ROLES.EMPLOYE;
  const [form, setForm] = useState(() => ({
    ...empty,
    champion: isChampion ? currentUser.name : "",
    metier:
      isChampion || isEmployee ? currentUser.metier || "Finance" : "Finance",
  }));

  // Champion automatiquement responsable selon le métier choisi
  const championForMetier = users.find(
    (u) => u.role === ROLES.CHAMPION && u.metier === form.metier
  );

  // Pour l'employé, le Champion responsable est dérivé du métier.
  useEffect(() => {
    if (isEmployee && !isEdit) {
      setForm((f) => ({ ...f, champion: championForMetier?.name || "" }));
    }
  }, [isEmployee, isEdit, championForMetier?.name]);

  useEffect(() => {
    if (isEdit) {
      const t = getTicket(id);
      if (t) setForm({ ...empty, ...t });
    }
  }, [id, isEdit, getTicket]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleValeur = (v) =>
    setForm((f) => ({
      ...f,
      valeurs: f.valeurs.includes(v)
        ? f.valeurs.filter((x) => x !== v)
        : [...f.valeurs, v],
    }));

  const canNext = () => {
    if (step === 0) return form.title.trim().length > 0;
    return true;
  };

  const submit = () => {
    if (!form.title.trim()) {
      pushToast("Le titre du cas d'usage est obligatoire.", "error");
      setStep(0);
      return;
    }
    const payload = { ...form, nbUsers: Number(form.nbUsers) || 0 };
    if (isEdit) {
      updateTicket(id, payload);
      pushToast("Ticket mis à jour.", "success");
      navigate(`/tickets/${id}`);
    } else {
      const t = createTicket(payload);
      pushToast(`Ticket ${t.reference} créé et soumis.`, "success");
      navigate(`/tickets/${t.id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost text-sm mb-4 -ml-2"
      >
        <ChevronLeft size={16} /> Retour
      </button>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-ink mb-1">
          {isEdit ? "Éditer le ticket" : "Nouveau cas d'usage agentique"}
        </h2>
        <p className="text-sm text-muted mb-6">
          Renseignez la fiche de cadrage de l'agent en 4 étapes.
        </p>

        <WizardProgress
          steps={STEPS}
          current={step}
          onStepClick={(i) => setStep(i)}
        />

        {/* Step 1 */}
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Titre du cas d'usage" required>
              <input
                className="input"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Ex : Agent de synthèse des rapports financiers"
              />
            </Field>
            <Field label="Métier">
              <select
                className="input"
                value={form.metier}
                onChange={(e) => set("metier", e.target.value)}
              >
                {METIERS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Champion responsable">
              {isEmployee ? (
                <>
                  <input
                    className="input bg-panel cursor-not-allowed"
                    value={championForMetier?.name || "Aucun Champion pour ce métier"}
                    readOnly
                  />
                  <p className="text-[12px] text-muted mt-1.5">
                    Affecté automatiquement selon le métier sélectionné.
                  </p>
                </>
              ) : (
                <input
                  className="input"
                  value={form.champion}
                  onChange={(e) => set("champion", e.target.value)}
                  placeholder="Nom du Champion"
                />
              )}
            </Field>
            <Field label="Sponsor métier">
              <input
                className="input"
                value={form.sponsor}
                onChange={(e) => set("sponsor", e.target.value)}
                placeholder="Direction sponsor"
              />
            </Field>
            <Field label="Priorité perçue">
              <RadioRow
                options={PRIORITES}
                value={form.priorite}
                onChange={(v) => set("priorite", v)}
              />
            </Field>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="space-y-4">
            <Field label="Problème métier adressé">
              <textarea
                className="input min-h-[90px]"
                value={form.probleme}
                onChange={(e) => set("probleme", e.target.value)}
              />
            </Field>
            <Field label="Valeur attendue">
              <div className="flex flex-wrap gap-2">
                {VALEUR_OPTIONS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => toggleValeur(v)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      form.valeurs.includes(v)
                        ? "bg-turquoise/15 border-turquoise text-turquoise"
                        : "bg-bg border-border text-muted hover:text-ink"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Description de l'agent envisagé">
              <textarea
                className="input min-h-[90px]"
                value={form.agentDescription}
                onChange={(e) => set("agentDescription", e.target.value)}
              />
            </Field>
            <Field label="Niveau d'autonomie">
              <RadioRow
                options={AUTONOMIES}
                value={form.autonomie}
                onChange={(v) => set("autonomie", v)}
              />
            </Field>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="space-y-4">
            <Field label="Types de données utilisées">
              <textarea
                className="input min-h-[80px]"
                value={form.dataTypes}
                onChange={(e) => set("dataTypes", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Présence de données personnelles">
                <IOSToggle
                  value={form.donneesPerso}
                  onChange={(v) => set("donneesPerso", v)}
                />
              </Field>
              <Field label="Données sensibles RH/Finance/Conformité">
                <IOSToggle
                  value={form.donneesSensibles}
                  onChange={(v) => set("donneesSensibles", v)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Périmètre géographique">
                <select
                  className="input"
                  value={form.perimetre}
                  onChange={(e) => set("perimetre", e.target.value)}
                >
                  {PERIMETRES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Nombre d'utilisateurs concernés">
                <input
                  type="number"
                  min={0}
                  className="input"
                  value={form.nbUsers}
                  onChange={(e) => set("nbUsers", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Fréquence d'utilisation">
              <RadioRow
                options={FREQUENCES}
                value={form.frequence}
                onChange={(v) => set("frequence", v)}
              />
            </Field>
          </div>
        )}

        {/* Step 4 — Récapitulatif */}
        {step === 3 && (
          <div className="space-y-4">
            <RecapBlock title="Identification" onEdit={() => setStep(0)}>
              <RecapRow label="Titre" value={form.title} />
              <RecapRow label="Métier" value={form.metier} />
              <RecapRow label="Champion" value={form.champion} />
              <RecapRow label="Sponsor" value={form.sponsor} />
              <RecapRow label="Priorité" value={form.priorite} />
            </RecapBlock>
            <RecapBlock title="Description" onEdit={() => setStep(1)}>
              <RecapRow label="Problème" value={form.probleme} />
              <RecapRow
                label="Valeur attendue"
                value={form.valeurs.join(", ")}
              />
              <RecapRow label="Agent" value={form.agentDescription} />
              <RecapRow label="Autonomie" value={form.autonomie} />
            </RecapBlock>
            <RecapBlock title="Données" onEdit={() => setStep(2)}>
              <RecapRow label="Types de données" value={form.dataTypes} />
              <RecapRow
                label="Données personnelles"
                value={form.donneesPerso ? "Oui" : "Non"}
              />
              <RecapRow
                label="Données sensibles"
                value={form.donneesSensibles ? "Oui" : "Non"}
              />
              <RecapRow label="Périmètre" value={form.perimetre} />
              <RecapRow label="Utilisateurs" value={form.nbUsers || "—"} />
              <RecapRow label="Fréquence" value={form.frequence} />
            </RecapBlock>
          </div>
        )}

        {/* Footer nav */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
          <button
            className="btn-secondary"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            <ChevronLeft size={16} /> Précédent
          </button>
          {step < STEPS.length - 1 ? (
            <button
              className="btn-primary"
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
            >
              Suivant <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn-primary" onClick={submit}>
              <Send size={16} />
              {isEdit ? "Enregistrer" : "Soumettre le ticket"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RecapBlock({ title, onEdit, children }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-ink">{title}</h3>
        <button className="btn-ghost text-xs" onClick={onEdit}>
          <Pencil size={13} /> Modifier
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function RecapRow({ label, value }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-muted w-40 shrink-0">{label}</span>
      <span className="text-ink">{value || "—"}</span>
    </div>
  );
}
