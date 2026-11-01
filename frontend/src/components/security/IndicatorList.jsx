import { CheckCircle2, AlertTriangle, XCircle, MinusCircle } from "lucide-react";

const ICON = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle, skip: MinusCircle };

/** items: [{ type: pass|warn|fail|skip, title, body }] */
export default function IndicatorList({ items }) {
  return (
    <ul className="stack-sm">
      {items.map((it, i) => {
        const Icon = ICON[it.type] || MinusCircle;
        return (
          <li key={i} className={`indicator ${it.type}`}>
            <Icon size={18} aria-hidden="true" />
            <div>
              <div className="t">{it.title}{it.type === "skip" && <span className="muted text-xs"> · not checked</span>}</div>
              <div className="s">{it.body}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
