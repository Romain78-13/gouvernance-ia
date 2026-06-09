import { Check } from "lucide-react";

// Apple-style step progress bar.
export default function WizardProgress({ steps, current, onStepClick }) {
  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => onStepClick && i <= current && onStepClick(i)}
              className="flex flex-col items-center gap-2"
              style={{ cursor: i <= current ? "pointer" : "default" }}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[15px] font-semibold transition-colors ${
                  done
                    ? "bg-success text-white"
                    : active
                    ? "bg-blue text-white"
                    : "bg-card border border-border text-placeholder"
                }`}
              >
                {done ? <Check size={16} strokeWidth={2} /> : i + 1}
              </span>
              <span
                className={`text-[13px] font-medium whitespace-nowrap ${
                  active ? "text-ink" : done ? "text-muted" : "text-placeholder"
                }`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={`h-px flex-1 mx-3 mb-6 ${
                  i < current ? "bg-success" : "bg-separator"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
