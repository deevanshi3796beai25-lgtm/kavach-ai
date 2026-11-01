import { timeAgo } from "../../utils/format.js";

export default function ActivityTimeline({ items, limit = 6 }) {
  if (!items.length) return <div className="empty">No activity yet.</div>;
  return (
    <ul className="timeline">
      {items.slice(0, limit).map((t) => (
        <li key={t.id} className={t.level}>
          <div className="tl-title">{t.title}</div>
          <div className="tl-time">{timeAgo(t.at)}</div>
        </li>
      ))}
    </ul>
  );
}
