import { Card } from "../common/index.js";

export default function StatCard({ icon: Icon, label, value, tone = "", note }) {
  return (
    <Card hover>
      <div className="stat-card">
        <span className={`icon-chip lg ${tone}`}><Icon size={24} aria-hidden="true" /></span>
        <div>
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
          {note && <div className="text-xs muted">{note}</div>}
        </div>
      </div>
    </Card>
  );
}
