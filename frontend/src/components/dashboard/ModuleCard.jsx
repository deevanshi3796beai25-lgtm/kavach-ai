import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "../common/index.js";

export default function ModuleCard({ to, icon: Icon, label, desc, tone = "" }) {
  return (
    <Card hover>
      <Link to={to} className="module-card">
        <span className={`icon-chip ${tone}`}><Icon size={20} aria-hidden="true" /></span>
        <h3 style={{ fontSize: 16 }}>{label}</h3>
        <p>{desc}</p>
        <span className="go">Open <ArrowRight size={14} aria-hidden="true" /></span>
      </Link>
    </Card>
  );
}
