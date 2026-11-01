import { createContext, useCallback, useMemo, useState } from "react";
import {
  demoUser, seedScans, seedAlerts, seedTimeline, seedNotifications, seedConsentHistory,
} from "../services/mockData.js";
import { uid } from "../utils/format.js";

export const AppContext = createContext(null);

/**
 * Global demo state: user, language, scan activity, alerts, notifications, consent history.
 * Kept in memory only. Swap these for API calls / a store when the backend is ready.
 */
export function AppProvider({ children }) {
  const [user, setUser] = useState(demoUser);
  const [language, setLanguage] = useState("en");
  const [scans, setScans] = useState(seedScans);
  const [alerts, setAlerts] = useState(seedAlerts);
  const [timeline, setTimeline] = useState(seedTimeline);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [consentHistory, setConsentHistory] = useState(seedConsentHistory);

  const addScan = useCallback((scan) => {
    const at = new Date().toISOString();
    const entry = { id: uid("scan"), at, ...scan };
    setScans((s) => [entry, ...s]);
    const tlLevel = entry.level === "high" ? "danger" : entry.level === "medium" ? "warn" : "safe";
    setTimeline((t) => [{ id: uid("tl"), level: tlLevel, title: `${entry.label}: ${entry.title}`, at }, ...t].slice(0, 12));
    if (entry.level !== "low") {
      setAlerts((a) => [{
        id: uid("alert"), level: entry.level, title: `${entry.label} — ${entry.title}`,
        body: entry.detail || "Review the full result before taking any action.", at,
      }, ...a]);
    }
  }, []);

  const dismissAlert = useCallback((id) => setAlerts((a) => a.filter((x) => x.id !== id)), []);
  const markAllRead = useCallback(() => setNotifications((n) => n.map((x) => ({ ...x, unread: false }))), []);
  const markRead = useCallback((id) => setNotifications((n) => n.map((x) => (x.id === id ? { ...x, unread: false } : x))), []);
  const addConsentEvent = useCallback((action, purpose) =>
    setConsentHistory((h) => [{ id: uid("c"), action, purpose, at: new Date().toISOString() }, ...h]), []);

  const value = useMemo(() => ({
    user, setUser, language, setLanguage, scans, addScan, alerts, dismissAlert, timeline,
    notifications, markAllRead, markRead, consentHistory, addConsentEvent,
  }), [user, language, scans, addScan, alerts, dismissAlert, timeline, notifications, markAllRead, markRead, consentHistory, addConsentEvent]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
