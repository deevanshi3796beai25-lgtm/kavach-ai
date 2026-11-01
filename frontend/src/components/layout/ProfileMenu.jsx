import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Settings, Lock, Home, LogOut } from "lucide-react";
import { useApp } from "../../hooks/useApp.js";
import { useToast } from "../../hooks/useToast.js";
import { useDisclosure } from "../../hooks/useDisclosure.js";
import { useClickOutside } from "../../hooks/useClickOutside.js";

export default function ProfileMenu() {
  const { open, onClose, toggle } = useDisclosure();
  const ref = useRef(null);
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useApp();
  useClickOutside(ref, onClose, open);
  const go = (to) => { onClose(); nav(to); };

  return (
    <div className="popover-wrap" ref={ref}>
      <button className="profile-btn" onClick={toggle} aria-expanded={open} aria-label="Open profile menu">
        <span className="avatar">{user.initials}</span>
        <span className="profile-meta"><b>{user.name}</b><span>{user.plan}</span></span>
        <ChevronDown size={15} color="var(--muted)" aria-hidden="true" />
      </button>
      {open && (
        <div className="popover" role="menu" style={{ width: 250 }}>
          <div style={{ padding: "10px 12px" }}><b>{user.name}</b><div className="muted text-sm" style={{ overflowWrap: "anywhere" }}>{user.email}</div></div>
          <button className="popover-item" role="menuitem" onClick={() => go("/app/settings")}><Settings size={16} />Profile & settings</button>
          <button className="popover-item" role="menuitem" onClick={() => go("/app/privacy")}><Lock size={16} />Privacy Centre</button>
          <button className="popover-item" role="menuitem" onClick={() => go("/")}><Home size={16} />Back to website</button>
          <button className="popover-item" role="menuitem" onClick={() => { onClose(); toast.info("Signed out (demo)", "There is no real login in this frontend yet."); nav("/"); }}><LogOut size={16} />Sign out</button>
        </div>
      )}
    </div>
  );
}
