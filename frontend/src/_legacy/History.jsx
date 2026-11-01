import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clearScans, listScans } from "../api.js";
import { TYPES, VERDICT } from "../types.js";

export default function History() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  const load = () => listScans().then(setRows).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  async function wipe() {
    if (!confirm("Saari history delete karein?")) return;
    await clearScans(); load();
  }

  if (err) return <div className="card error">{err}</div>;
  if (!rows) return <div className="card">Load ho raha hai...</div>;
  return (
    <>
      <div className="row between">
        <h2>Scan History</h2>
        {rows.length > 0 && <button className="btn ghost" onClick={wipe}>Sab delete</button>}
      </div>
      {rows.length === 0 ? (
        <div className="card">Abhi koi scan nahi. <Link to="/scan">Pehla scan karein</Link></div>
      ) : (
        rows.map((r) => {
          const v = VERDICT[r.verdict];
          return (
            <Link key={r.id} to={`/result/${r.id}`} className={`card item ${v.cls}`}>
              <span className="big">{TYPES[r.type]?.icon}</span>
              <div className="grow">
                <b>{v.icon} {v.label}</b>
                <div className="muted small ellip">{r.input_preview}</div>
              </div>
              <span className="muted small">{r.score}</span>
            </Link>
          );
        })
      )}
    </>
  );
}
