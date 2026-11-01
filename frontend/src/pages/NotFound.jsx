import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="stack" style={{ alignItems: "center", padding: 24 }}>
        <span className="icon-chip lg"><SearchX size={26} /></span>
        <h1 style={{ fontSize: 28 }}>Page not found</h1>
        <p className="muted">The page you are looking for does not exist.</p>
        <div className="row" style={{ justifyContent: "center" }}><Link to="/app" className="btn btn-primary">Go to dashboard</Link><Link to="/" className="btn btn-secondary">Back to home</Link></div>
      </div>
    </div>
  );
}
