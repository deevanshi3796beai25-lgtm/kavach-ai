import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck, ArrowRight, Menu, X, QrCode, ScanFace, AudioLines, Link2, PauseCircle, Lock,
  Fingerprint, MapPin, Languages, Upload, Cpu, BadgeCheck, Scale,
} from "lucide-react";
import { BrandMark, ShieldIllustration, Button, Card } from "../components/common/index.js";

const FEATURES = [
  { icon: QrCode, title: "QR & UPI Analyzer", text: "Review who you are about to pay. Verified, unverified and risk-flagged payees are clearly separated." },
  { icon: ScanFace, title: "DeepTruth AI", text: "Check images, audio and video for signs of manipulation before you trust them.", tone: "purple" },
  { icon: AudioLines, title: "VoiceGuard", text: "Find pressure tactics, OTP requests and other scam language in call recordings." },
  { icon: Link2, title: "LinkShield", text: "Look inside a link — look-alike domains, bait words, shorteners — before you open it." },
  { icon: PauseCircle, title: "UPI SafePause", text: "A calm checkpoint before you pay, so urgency can't rush you into a mistake.", tone: "purple" },
  { icon: Lock, title: "Privacy Centre", text: "Clear consent controls plus access, correction, erasure and grievance requests." },
];
const STEPS = [
  { icon: Upload, title: "Add what you received", text: "Upload a QR, paste a link, or add a call recording or media file." },
  { icon: Cpu, title: "KAVACH checks the signals", text: "Rule checks and AI models look for known scam patterns and inconsistencies." },
  { icon: BadgeCheck, title: "You get a clear verdict", text: "Plain-language findings with reasons, so you decide with confidence." },
];
const USPS = [
  { icon: MapPin, title: "Built India-first", text: "Designed around UPI, Indian banking scams, regional languages and the 1930 helpline." },
  { icon: Scale, title: "Honest about uncertainty", text: "An unknown payee is labelled unverified — never automatically called a fraudster." },
  { icon: Fingerprint, title: "One view, four signals", text: "QR, voice, link and media evidence come together in a single Scam Intelligence view." },
  { icon: Languages, title: "Made for everyone", text: "Simple language and multilingual support are part of the plan from day one." },
];

export default function Landing() {
  const [menu, setMenu] = useState(false);
  const nav = useNavigate();
  const scrollTo = (id) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-nav-inner" style={{ position: "relative" }}>
          <Link to="/" className="brand" aria-label="KAVACH AI home"><BrandMark /><span className="brand-name">KAVACH AI</span></Link>
          <nav className={`lp-links ${menu ? "open" : ""}`} aria-label="Website">
            <a className="lnk" href="#features" onClick={(e) => { e.preventDefault(); scrollTo("features"); }}>Features</a>
            <a className="lnk" href="#how" onClick={(e) => { e.preventDefault(); scrollTo("how"); }}>How it works</a>
            <a className="lnk" href="#why" onClick={(e) => { e.preventDefault(); scrollTo("why"); }}>Why KAVACH</a>
            <Button size="sm" icon={ArrowRight} onClick={() => nav("/app")}>Open dashboard</Button>
          </nav>
          <button className="icon-btn lp-menu" onClick={() => setMenu((m) => !m)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}>{menu ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow"><ShieldCheck size={14} />India-first fraud prevention</span>
          <h1>Your Digital Payments Deserve <span className="grad-text">More Than Just Trust.</span></h1>
          <p className="sub">Detect suspicious activity, verify digital identities and make safer payment decisions with KAVACH AI.</p>
          <div className="row">
            <Button size="lg" icon={ShieldCheck} onClick={() => nav("/app")}>Get Protected</Button>
            <Button size="lg" variant="secondary" onClick={() => scrollTo("features")}>Explore Features</Button>
          </div>
          <p className="hero-tagline">Detect. Verify. Protect. Before You Pay.</p>
          <div className="hero-trust"><span><ShieldCheck size={16} />UPI · QR · Voice · Links · Media</span><span><Lock size={16} />Privacy-first design</span></div>
        </div>
        <div className="shield-wrap"><ShieldIllustration /></div>
      </section>

      <section className="lp-section" id="features">
        <div className="lp-section-head"><span className="eyebrow">Features</span><h2>Six layers of protection, one platform</h2><p>Every module answers one question: should I trust this before I act?</p></div>
        <div className="grid grid-3">
          {FEATURES.map(({ icon: Icon, title, text, tone }) => (
            <Card key={title} hover><div className="feature-card"><span className={`icon-chip ${tone || ""}`}><Icon size={20} /></span><h3>{title}</h3><p>{text}</p></div></Card>
          ))}
        </div>
      </section>

      <section className="lp-section" id="how" style={{ paddingTop: 20 }}>
        <div className="lp-section-head"><span className="eyebrow">How it works</span><h2>From suspicious to sure in three steps</h2></div>
        <div className="grid grid-3 steps">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Card key={title}><div className="step"><div className="step-num">0{i + 1}</div><div className="row" style={{ marginBottom: 8 }}><Icon size={18} color="var(--cyan)" /><h3 style={{ fontSize: 17 }}>{title}</h3></div><p className="muted text-sm">{text}</p></div></Card>
          ))}
        </div>
      </section>

      <section className="lp-section" id="why" style={{ paddingTop: 20 }}>
        <div className="usp">
          <div>
            <span className="eyebrow">Why KAVACH AI</span>
            <h2 style={{ fontSize: "clamp(26px,4vw,38px)", margin: "6px 0 14px" }}>Safety advice you can actually act on</h2>
            <p className="muted" style={{ fontSize: 16, marginBottom: 24 }}>Most tools shout “scam!” or stay silent. KAVACH explains its reasoning and tells you what to do next — while being honest about what it does not know.</p>
            <Button icon={ArrowRight} onClick={() => nav("/app/qr-upi")}>Try the QR Analyzer</Button>
          </div>
          <div className="usp-list">
            {USPS.map(({ icon: Icon, title, text }) => (
              <div className="usp-item" key={title}><span className="icon-chip purple"><Icon size={19} /></span><div><h4>{title}</h4><p>{text}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="cta-band">
          <h2 style={{ fontSize: "clamp(24px,3.5vw,34px)", marginBottom: 10 }}>Pause. Verify. Then pay.</h2>
          <p className="muted" style={{ marginBottom: 22 }}>Explore the demo dashboard — all results are simulated sample data.</p>
          <Button size="lg" icon={ShieldCheck} onClick={() => nav("/app")}>Get Protected</Button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <Link to="/" className="brand"><BrandMark /><span className="brand-name">KAVACH AI</span></Link>
            <p className="muted text-sm" style={{ marginTop: 14, maxWidth: 300 }}>Detect. Verify. Protect. Before You Pay.<br />An India-first AI-powered digital fraud prevention platform.</p>
          </div>
          <div><h5>Modules</h5><ul><li><Link to="/app/qr-upi">QR & UPI Analyzer</Link></li><li><Link to="/app/deeptruth">DeepTruth AI</Link></li><li><Link to="/app/voiceguard">VoiceGuard</Link></li><li><Link to="/app/linkshield">LinkShield</Link></li></ul></div>
          <div><h5>Platform</h5><ul><li><Link to="/app/intelligence">Scam Intelligence</Link></li><li><Link to="/app/safepause">UPI SafePause</Link></li><li><Link to="/app/privacy">Privacy Centre</Link></li><li><Link to="/app/settings">Settings</Link></li></ul></div>
          <div><h5>Report fraud</h5><ul><li>Helpline: <b>1930</b></li><li><a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer noopener">cybercrime.gov.in</a></li></ul></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} KAVACH AI. Frontend demo — results are simulated.</span><span>Not a substitute for advice from your bank or the authorities.</span></div>
      </footer>
    </div>
  );
}
