import { QrCode, ScanFace, AudioLines, Link2 } from "lucide-react";
import { LevelBadge } from "../common/index.js";
import { timeAgo } from "../../utils/format.js";

const ICON = { qr: QrCode, deepfake: ScanFace, voice: AudioLines, link: Link2 };
const CHIP = { low: "safe", medium: "warn", high: "danger" };

export default function ScanList({ scans, limit = 5 }) {
  if (!scans.length) return <div className="empty">No scans yet. Run your first check.</div>;
  return (
    <ul>
      {scans.slice(0, limit).map((s) => {
        const Icon = ICON[s.module] || QrCode;
        return (
          <li key={s.id} className="list-item">
            <span className={`icon-chip ${CHIP[s.level]}`}><Icon size={18} aria-hidden="true" /></span>
            <div className="grow"><div className="t">{s.title}</div><div className="s">{s.subject} · {timeAgo(s.at)}</div></div>
            <LevelBadge level={s.level}>{s.label}</LevelBadge>
          </li>
        );
      })}
    </ul>
  );
}
