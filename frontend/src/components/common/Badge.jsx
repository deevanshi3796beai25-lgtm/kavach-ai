const TONES = { safe: "badge-safe", warn: "badge-warn", danger: "badge-danger", info: "badge-info", demo: "badge-demo" };
export default function Badge({ tone, children, icon: Icon }) {
  return <span className={`badge ${TONES[tone] || ""}`}>{Icon && <Icon size={12} aria-hidden="true" />}{children}</span>;
}

/** Marks anything simulated. Use wherever demo data / simulated results are shown. */
export function DemoBadge({ children = "DEMO" }) {
  return <Badge tone="demo">{children}</Badge>;
}

/** Maps a risk level (low | medium | high) to a coloured badge. */
export function LevelBadge({ level, children }) {
  const tone = level === "high" ? "danger" : level === "medium" ? "warn" : "safe";
  return <Badge tone={tone}>{children}</Badge>;
}
