// iOS-style on/off switch (51x31). Boolean value.
export default function IOSToggle({ value, onChange, disabled = false }) {
  const on = value === true;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!on)}
      className="ios-toggle"
      data-state={on ? "on" : "off"}
      data-on={on ? "true" : "false"}
      aria-pressed={on}
    >
      <span className="knob" />
    </button>
  );
}
