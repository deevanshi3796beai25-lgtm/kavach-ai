export default function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <label className="toggle-row">
      <span>
        <span style={{ fontWeight: 600, display: "block" }}>{label}</span>
        {description && <span className="muted text-sm">{description}</span>}
      </span>
      <span className="toggle">
        <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} />
        <span className="track" />
      </span>
    </label>
  );
}
