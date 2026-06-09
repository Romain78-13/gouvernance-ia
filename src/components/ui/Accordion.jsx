import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({
  title,
  subtitle,
  defaultOpen = true,
  right,
  headerStyle,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
        style={headerStyle}
      >
        <div>
          <div className="font-semibold text-ink">{title}</div>
          {subtitle && <div className="text-[13px] text-muted mt-0.5">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-3">
          {right}
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            className={`text-muted transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 border-t border-separator">{children}</div>
        </div>
      </div>
    </div>
  );
}
