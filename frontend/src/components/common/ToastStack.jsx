import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ICONS = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };

export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info;
        return (
          <div key={t.id} className={`toast ${t.type}`} role="status">
            <Icon size={18} aria-hidden="true" />
            <div className="grow">
              <div className="toast-title">{t.title}</div>
              {t.message && <div className="toast-msg">{t.message}</div>}
            </div>
            <button className="btn-ghost btn btn-sm" style={{ padding: 4 }} onClick={() => onDismiss(t.id)} aria-label="Dismiss notification"><X size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}
