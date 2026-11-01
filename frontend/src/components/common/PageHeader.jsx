import { DemoBadge } from "./Badge.jsx";

export default function PageHeader({ title, description, demo, actions }) {
  return (
    <header className="page-header">
      <div className="titles">
        <div className="row" style={{ gap: 12 }}>
          <h1>{title}</h1>
          {demo && <DemoBadge />}
        </div>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="row">{actions}</div>}
    </header>
  );
}
