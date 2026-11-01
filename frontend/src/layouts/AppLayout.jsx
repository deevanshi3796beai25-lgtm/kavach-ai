import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  // close the drawer on navigation, and scroll to top
  useEffect(() => { setMobileOpen(false); window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""}`}>
      <Sidebar open={mobileOpen} collapsed={collapsed} onClose={() => setMobileOpen(false)} onToggleCollapse={() => setCollapsed((c) => !c)} />
      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <div className="main">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <div className="demo-strip"><FlaskConical size={14} aria-hidden="true" /><span><b>DEMO MODE</b> — sample data and simulated results. No real AI detection or bank verification yet.</span></div>
        <main className="page" key={pathname}><Outlet /></main>
      </div>
    </div>
  );
}
