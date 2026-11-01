import { ShieldAlert, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "../common/index.js";
import { timeAgo } from "../../utils/format.js";

const ICON = { high: ShieldAlert, medium: AlertTriangle, low: Info };
const CHIP = { high: "danger", medium: "warn", low: "" };

export default function AlertList({ alerts, onOpen, onDismiss, limit = 4 }) {
  if (!alerts.length) return <div className="empty">🎉 No active alerts.</div>;
  return (
    <ul>
      {alerts.slice(0, limit).map((a) => {
        const Icon = ICON[a.level];
        return (
          <li key={a.id} className="list-item" style={{ alignItems: "flex-start" }}>
            <span className={`icon-chip ${CHIP[a.level]}`}><Icon size={18} aria-hidden="true" /></span>
            <div className="grow">
              <div className="t">{a.title}</div>
              <div className="s">{timeAgo(a.at)}</div>
              <div className="row" style={{ gap: 6, marginTop: 6 }}>
                <Button variant="secondary" size="sm" onClick={() => onOpen(a)}>View details</Button>
                <Button variant="ghost" size="sm" icon={X} onClick={() => onDismiss(a)}>Dismiss</Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
