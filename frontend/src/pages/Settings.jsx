import { useState } from "react";
import { Link } from "react-router-dom";
import { UserRound, Languages, Bell, ShieldCheck } from "lucide-react";
import { Button, Card, FormField, PageHeader, Toggle } from "../components/common/index.js";
import { useApp } from "../hooks/useApp.js";
import { useToast } from "../hooks/useToast.js";
import { languages } from "../services/mockData.js";
import { validate, required, email, phone } from "../utils/validators.js";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "language", label: "Language", icon: Languages },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
];

export default function Settings() {
  const { user, setUser, language, setLanguage } = useApp();
  const toast = useToast();
  const [section, setSection] = useState("profile");
  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [errors, setErrors] = useState({});
  const [lang, setLang] = useState(language);
  const [notif, setNotif] = useState({ scamAlerts: true, weeklyDigest: true, productNews: false, sms: false, push: true });
  const [priv, setPriv] = useState({ saveHistory: true, analytics: false, hideAmounts: false });

  const saveProfile = (e) => {
    e.preventDefault();
    const errs = validate(profile, { name: (v) => required(v, "Name"), email, phone });
    setErrors(errs);
    if (Object.keys(errs).length) return toast.error("Please fix the highlighted fields");
    const initials = profile.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    setUser({ ...user, ...profile, initials });
    toast.success("Profile updated", "Saved for this demo session.");
  };

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, language and notification preferences. Changes are kept for this demo session only." />
      <div className="settings-grid">
        <nav className="card" style={{ padding: 10 }} aria-label="Settings sections">
          {SECTIONS.map((s) => (
            <button key={s.id} className={`nav-link ${section === s.id ? "active" : ""}`} style={{ width: "100%", background: section === s.id ? undefined : "transparent", cursor: "pointer", font: "inherit" }} onClick={() => setSection(s.id)} aria-current={section === s.id ? "page" : undefined}>
              <s.icon size={18} /><span>{s.label}</span>
            </button>
          ))}
        </nav>

        <div>
          {section === "profile" && (
            <Card title="Profile" icon={UserRound}>
              <form className="stack" onSubmit={saveProfile} noValidate style={{ maxWidth: 520 }}>
                <FormField label="Full name" value={profile.name} error={errors.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                <FormField label="Email" type="email" value={profile.email} error={errors.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                <FormField label="Mobile number" value={profile.phone} error={errors.phone} hint="10-digit Indian mobile number" inputMode="tel" onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                <div><Button type="submit">Save profile</Button></div>
              </form>
            </Card>
          )}
          {section === "language" && (
            <Card title="Language preferences" icon={Languages} subtitle="Your choice is saved; full interface translation is planned.">
              <div style={{ maxWidth: 360 }} className="stack">
                <FormField label="Interface language" kind="select" value={lang} onChange={(e) => setLang(e.target.value)} options={languages.map((l) => ({ value: l.code, label: l.label }))} />
                <div><Button onClick={() => { setLanguage(lang); toast.success("Language saved", languages.find((l) => l.code === lang).label); }}>Save language</Button></div>
              </div>
            </Card>
          )}
          {section === "notifications" && (
            <Card title="Notification settings" icon={Bell}>
              <Toggle label="Scam alerts" description="Warn me when a scan finds a high-risk result." checked={notif.scamAlerts} onChange={(v) => setNotif({ ...notif, scamAlerts: v })} />
              <Toggle label="Weekly safety digest" description="A short summary of your activity and tips." checked={notif.weeklyDigest} onChange={(v) => setNotif({ ...notif, weeklyDigest: v })} />
              <Toggle label="Product news" description="Occasional updates about new features." checked={notif.productNews} onChange={(v) => setNotif({ ...notif, productNews: v })} />
              <Toggle label="Push notifications" checked={notif.push} onChange={(v) => setNotif({ ...notif, push: v })} />
              <Toggle label="SMS notifications" checked={notif.sms} onChange={(v) => setNotif({ ...notif, sms: v })} />
              <div style={{ marginTop: 16 }}><Button onClick={() => toast.success("Notification settings saved")}>Save settings</Button></div>
            </Card>
          )}
          {section === "privacy" && (
            <Card title="Privacy preferences" icon={ShieldCheck} subtitle="For full consent controls and data requests, visit the Privacy Centre.">
              <Toggle label="Save scan history" description="Keep past results so you can review them." checked={priv.saveHistory} onChange={(v) => setPriv({ ...priv, saveHistory: v })} />
              <Toggle label="Share anonymous analytics" checked={priv.analytics} onChange={(v) => setPriv({ ...priv, analytics: v })} />
              <Toggle label="Hide payment amounts in history" checked={priv.hideAmounts} onChange={(v) => setPriv({ ...priv, hideAmounts: v })} />
              <div className="row" style={{ marginTop: 16 }}><Button onClick={() => toast.success("Privacy preferences saved")}>Save preferences</Button><Link to="/app/privacy" className="btn btn-secondary">Open Privacy Centre</Link></div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
