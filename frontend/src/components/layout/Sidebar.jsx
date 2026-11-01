import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen, X, Phone } from "lucide-react";
import { BrandMark } from "../common/index.js";
import { appNav } from "../../routes/navigation.js";

export default function Sidebar({ open, collapsed, onClose, onToggleCollapse }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Main navigation">
      <div className="sidebar-head">
        <NavLink to="/" className="brand" aria-label="KAVACH AI home" onClick={onClose}>
          <BrandMark size={36} />
          <span className="brand-name">KAVACH AI<small>Detect · Verify · Protect</small></span>
        </NavLink>
        <button className="icon-btn menu-btn" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        <button className="icon-btn collapse-btn" onClick={onToggleCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="nav-scroll">
        <div className="nav-label">Protection</div>
        {appNav.map(({ path, label, icon: Icon, end }) => (
          <NavLink key={path} to={path} end={end} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onClose} title={label}>
            <Icon size={19} aria-hidden="true" /><span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-helpline"><Phone size={13} style={{ verticalAlign: -2, marginRight: 6 }} />Cyber-fraud helpline <b>1930</b><br />cybercrime.gov.in</div>
      </div>
    </aside>
  );
}
