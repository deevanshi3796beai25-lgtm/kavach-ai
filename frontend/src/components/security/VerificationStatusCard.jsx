import { BadgeCheck, HelpCircle, ShieldAlert } from "lucide-react";
import { DemoBadge } from "../common/index.js";

const VIEW = {
  verified: { tone: "safe", Icon: BadgeCheck },
  unverified: { tone: "warn", Icon: HelpCircle },
  risk: { tone: "danger", Icon: ShieldAlert },
};

/** Shows one of the three beneficiary states. statusKey: verified | unverified | risk */
export default function VerificationStatusCard({ statusKey, info, demo = true }) {
  const v = VIEW[statusKey];
  return (
    <div className={`verdict ${v.tone}`} role="status">
      <div className="row" style={{ alignItems: "flex-start", flexWrap: "nowrap", gap: 16 }}>
        <span className={`icon-chip lg ${v.tone}`}><v.Icon size={26} aria-hidden="true" /></span>
        <div className="grow">
          <div className="row" style={{ gap: 10 }}>
            <div className="verdict-title">{info.label}</div>
            {demo && <DemoBadge />}
          </div>
          <div style={{ fontWeight: 600, marginTop: 2 }}>{info.headline}</div>
          <p className="muted text-sm" style={{ marginTop: 6 }}>{info.meaning}</p>
        </div>
      </div>
    </div>
  );
}
