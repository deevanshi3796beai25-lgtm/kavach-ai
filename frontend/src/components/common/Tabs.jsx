import { useId } from "react";

/** Accessible tab list. Render the panel yourself based on `value`. */
export default function Tabs({ tabs, value, onChange, label = "Sections" }) {
  const id = useId();
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button
          key={t.id} role="tab" id={`${id}-${t.id}`} className="tab"
          aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => {
            const i = tabs.findIndex((x) => x.id === value);
            if (e.key === "ArrowRight") onChange(tabs[(i + 1) % tabs.length].id);
            if (e.key === "ArrowLeft") onChange(tabs[(i - 1 + tabs.length) % tabs.length].id);
          }}
        >
          {t.icon && <t.icon size={15} aria-hidden="true" />}{t.label}
        </button>
      ))}
    </div>
  );
}
