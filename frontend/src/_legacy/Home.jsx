import { Link } from "react-router-dom";
import { TYPES } from "../types.js";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Fake hai ya asli? Pehle check karo.</h1>
        <p>Call, link, QR ya photo/video daalo. KAVACH AI batayega safe hai ya fraud, aur wajah bhi.</p>
      </section>
      <div className="grid">
        {Object.entries(TYPES).map(([k, t]) => (
          <Link key={k} to={`/scan/${k}`} className="card tile">
            <div className="big">{t.icon}</div>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
