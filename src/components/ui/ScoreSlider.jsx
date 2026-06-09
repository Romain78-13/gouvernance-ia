// iOS-style score slider 1..5 with blue fill and current value.
export default function ScoreSlider({ value = 0, onChange, disabled = false, label }) {
  const v = Number(value) || 0;
  const pct = v > 0 ? ((v - 1) / 4) * 100 : 0;
  const track = `linear-gradient(to right, #0071E3 ${pct}%, #E5E5EA ${pct}%)`;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {label && <span className="text-[15px] text-ink">{label}</span>}
        <span className="text-[15px] font-semibold text-blue tabular-nums">
          {v > 0 ? `${v}/5` : "—"}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={v || 1}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ios-range w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        style={{ background: v === 0 ? "#E5E5EA" : track }}
      />
      <div className="flex justify-between text-[12px] text-placeholder px-0.5 mt-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  );
}
