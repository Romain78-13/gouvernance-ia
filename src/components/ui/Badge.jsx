import { STATUS_COLORS } from "../../utils/constants";

// Pale pill badge. Pass either `status` (maps to STATUS_COLORS) or an explicit color.
// Hex helper to build a 12%-opacity background from a solid accent color.
function tint(hex) {
  return `${hex}1f`;
}

const BASE =
  "inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[13px] font-medium whitespace-nowrap";

export default function Badge({ status, color, bg, text, children, dot = false }) {
  if (status && STATUS_COLORS[status]) {
    const c = STATUS_COLORS[status];
    return (
      <span className={BASE} style={{ backgroundColor: c.bg, color: c.text }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
        {children || status}
      </span>
    );
  }
  const style = {
    backgroundColor: bg || (color ? tint(color) : "#F5F5F7"),
    color: text || color || "#6E6E73",
  };
  return (
    <span className={BASE} style={style}>
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color || "#6E6E73" }}
        />
      )}
      {children}
    </span>
  );
}
