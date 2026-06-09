// Apple-style segmented yes/no control. Tri-state aware (value can be undefined).
export default function Toggle({
  value,
  onChange,
  disabled = false,
  labels = ["Oui", "Non"],
}) {
  return (
    <div className="inline-flex p-0.5 rounded-[10px] bg-panel border border-separator text-[13px] font-medium">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        className={`px-4 py-1.5 rounded-lg transition-all ${
          value === true
            ? "bg-white text-blue shadow-soft"
            : "text-muted hover:text-ink"
        } disabled:cursor-not-allowed`}
      >
        {labels[0]}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 rounded-lg transition-all ${
          value === false
            ? "bg-white text-ink shadow-soft"
            : "text-muted hover:text-ink"
        } disabled:cursor-not-allowed`}
      >
        {labels[1]}
      </button>
    </div>
  );
}
