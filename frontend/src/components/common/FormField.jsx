import { useId } from "react";
import { AlertCircle } from "lucide-react";

/** Label + control + hint + error. kind: input | textarea | select */
export default function FormField({ label, error, hint, kind = "input", options = [], className = "", ...props }) {
  const id = useId();
  const common = { id, "aria-invalid": !!error || undefined, "aria-describedby": error ? `${id}-e` : hint ? `${id}-h` : undefined, className: `${kind} ${error ? "has-error" : ""} ${className}` };
  return (
    <div className="field">
      {label && <label htmlFor={id} className="label">{label}</label>}
      {kind === "textarea" ? <textarea {...common} {...props} />
        : kind === "select" ? <select {...common} {...props}>{options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select>
        : <input {...common} {...props} />}
      {error ? <p id={`${id}-e`} className="error-text" role="alert"><AlertCircle size={14} />{error}</p> : hint ? <p id={`${id}-h`} className="hint">{hint}</p> : null}
    </div>
  );
}
