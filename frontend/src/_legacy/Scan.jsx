import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { scan } from "../api.js";
import { TYPES } from "../types.js";

export default function Scan() {
  const { type: p } = useParams();
  const nav = useNavigate();
  const type = TYPES[p] ? p : "link";
  const t = TYPES[type];
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = (k) => { setText(""); setFile(null); setErr(""); nav(`/scan/${k}`); };

  async function submit(e) {
    e.preventDefault();
    if (!text.trim() && !file) return setErr("Pehle kuch daalein ya file chunein.");
    setBusy(true); setErr("");
    try {
      const r = await scan(type, text, file);
      nav(`/result/${r.id}`, { state: r });
    } catch (x) {
      setErr(x.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="tabs">
        {Object.entries(TYPES).map(([k, v]) => (
          <button key={k} className={k === type ? "tab on" : "tab"} onClick={() => pick(k)}>
            {v.icon} {v.title}
          </button>
        ))}
      </div>
      <form className="card" onSubmit={submit}>
        <h2>{t.icon} {t.title}</h2>
        <p className="muted">{t.desc}</p>
        {t.textOk && (
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.placeholder} rows={type === "voice" ? 6 : 3} />
        )}
        {t.file && (
          <label className="file">
            {t.textOk ? "Ya file upload karein: " : "File chunein: "}
            <input type="file" accept={t.file} onChange={(e) => setFile(e.target.files[0] || null)} />
          </label>
        )}
        {err && <div className="error">{err}</div>}
        <button className="btn" disabled={busy}>{busy ? "Check ho raha hai..." : "Check karein"}</button>
      </form>
    </>
  );
}
