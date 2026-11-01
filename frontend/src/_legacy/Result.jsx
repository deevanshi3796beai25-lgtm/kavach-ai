import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getScan } from "../api.js";
import { TYPES, VERDICT } from "../types.js";

export default function Result() {
  const { id } = useParams();
  const { state } = useLocation();
  const [r, setR] = useState(state && state.id === id ? state : null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!r) getScan(id).then(setR).catch((e) => setErr(e.message));
  }, [id]);

  if (err) return <div className="card error">{err}</div>;
  if (!r) return <div className="card">Load ho raha hai...</div>;
  const v = VERDICT[r.verdict];
  return (
    <>
      <div className={`card result ${v.cls}`}>
        <div className="big">{v.icon}</div>
        <h1>{v.label}</h1>
        <div className="meter"><span style={{ width: `${r.score}%` }} /></div>
        <p className="muted">Risk score: {r.score}/100 • {TYPES[r.type]?.title}</p>
        {r.mode === "demo" && <p className="demo">DEMO mode: ye heuristic check hai, asli AI model nahi.</p>}
      </div>
      <div className="card">
        <h3>Kyun?</h3>
        <ul>{r.reasons.map((x, i) => <li key={i}>{x}</li>)}</ul>
        {r.input_preview && <p className="muted small">Checked: {r.input_preview}</p>}
        {r.verdict !== "SAFE" && <p className="tip">Paisa gaya ya sandeh hai? <b>1930</b> par call karein.</p>}
      </div>
      <div className="row">
        <Link className="btn" to={`/scan/${r.type}`}>Aur check karein</Link>
        <Link className="btn ghost" to="/history">History</Link>
      </div>
    </>
  );
}
