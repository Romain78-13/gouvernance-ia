// Thin horizontal gauge (6px) with the numeric value beside it.
export default function Gauge({
  value = 0,
  max = 100,
  color = "#0071E3",
  label,
  unit = "",
  big = false,
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="w-full">
      {label && (
        <div className="text-[13px] font-medium tracking-[0.1px] uppercase text-muted mb-2">
          {label}
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1.5 rounded-pill bg-separator overflow-hidden">
          <div
            className="h-full rounded-pill transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <span
          className={`font-bold tabular-nums shrink-0 ${
            big ? "text-[28px] leading-none" : "text-[17px]"
          }`}
          style={{ color }}
        >
          {value}
          {unit}
        </span>
      </div>
    </div>
  );
}
