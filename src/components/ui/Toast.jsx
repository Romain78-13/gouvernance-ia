import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useApp } from "../../context/AppContext";

const CONFIG = {
  success: { icon: CheckCircle2, color: "#34C759" },
  error: { icon: AlertTriangle, color: "#FF3B30" },
  info: { icon: Info, color: "#5AC8FA" },
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-2.5">
      {toasts.map((t) => {
        const cfg = CONFIG[t.type] || CONFIG.info;
        const Icon = cfg.icon;
        return (
          <button
            key={t.id}
            onClick={() => dismissToast(t.id)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-pill bg-ink text-white text-[15px] animate-toastup max-w-[90vw]"
          >
            <Icon size={18} strokeWidth={1.5} style={{ color: cfg.color }} className="shrink-0" />
            <span className="text-left">{t.message}</span>
          </button>
        );
      })}
    </div>
  );
}
