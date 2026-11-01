import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { ScoreRing, DemoBadge } from "../common/index.js";

const TONE = { low: ["safe", "var(--safe)", ShieldCheck], medium: ["warn", "var(--warn)", AlertTriangle], high: ["danger", "var(--danger)", ShieldAlert] };

/** Generic score + label + summary result card used by DeepTruth, VoiceGuard and LinkShield. */
export default function RiskResultCard({ level, label, score, caption = "risk", headline, summary, children }) {
  const [tone, color, Icon] = TONE[level];
  return (
    <div className={`verdict ${tone}`} role="status">
      <div className="row" style={{ gap: 20, alignItems: "center" }}>
        {typeof score === "number" && <ScoreRing value={score} caption={caption} tone={color} size={118} />}
        <div className="grow" style={{ minWidth: 220 }}>
          <div className="row" style={{ gap: 10 }}>
            <Icon size={22} color={color} aria-hidden="true" />
            <div className="verdict-title" style={{ fontSize: 20 }}>{label}</div>
            <DemoBadge />
          </div>
          {headline && <div style={{ fontWeight: 600, marginTop: 4, overflowWrap: "anywhere" }}>{headline}</div>}
          {summary && <p className="muted text-sm" style={{ marginTop: 6 }}>{summary}</p>}
        </div>
      </div>
      {children && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
}
