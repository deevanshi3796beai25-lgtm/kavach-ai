import { Link } from "react-router-dom";
import { QrCode, Link2, AudioLines, PauseCircle } from "lucide-react";

const ACTIONS = [
  { to: "/app/qr-upi", icon: QrCode, title: "Scan a QR", sub: "Check payee" },
  { to: "/app/linkshield", icon: Link2, title: "Check a link", sub: "Before you tap" },
  { to: "/app/voiceguard", icon: AudioLines, title: "Analyse a call", sub: "Upload audio" },
  { to: "/app/safepause", icon: PauseCircle, title: "SafePause", sub: "Pre-payment check" },
];

export default function QuickActions() {
  return (
    <div className="quick-actions">
      {ACTIONS.map(({ to, icon: Icon, title, sub }) => (
        <Link key={to} to={to} className="quick-action">
          <span className="icon-chip"><Icon size={19} aria-hidden="true" /></span>
          <b>{title}</b><span>{sub}</span>
        </Link>
      ))}
    </div>
  );
}
