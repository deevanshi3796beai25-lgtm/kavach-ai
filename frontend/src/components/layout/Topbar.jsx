import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import NotificationMenu from "./NotificationMenu.jsx";
import ProfileMenu from "./ProfileMenu.jsx";
import LanguageSelect from "./LanguageSelect.jsx";
import { appNav } from "../../routes/navigation.js";
import { useToast } from "../../hooks/useToast.js";

export default function Topbar({ onMenu }) {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const toast = useToast();

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim().toLowerCase();
    if (!term) return;
    const hit = appNav.find((n) => n.label.toLowerCase().includes(term) || n.desc.toLowerCase().includes(term));
    if (hit) { nav(hit.path); setQ(""); } else toast.warning("No matching page", "Try “QR”, “link”, “voice” or “privacy”.");
  };

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <form className="topbar-search" onSubmit={submit} role="search">
        <Search size={16} aria-hidden="true" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a page…" aria-label="Jump to a page" />
      </form>
      <div className="spacer" />
      <LanguageSelect />
      <NotificationMenu />
      <ProfileMenu />
    </header>
  );
}
