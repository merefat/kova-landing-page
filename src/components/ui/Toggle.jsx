// Green pill switch — matches the "On" toggle in the reference panels.
export default function Toggle({ on, onToggle, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`toggle ${on ? 'on' : ''}`}
      onClick={onToggle}
      disabled={disabled}
    >
      <span className="toggle-knob" />
    </button>
  );
}
