import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout.jsx";
import Landing from "../pages/Landing.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import QrUpiAnalyzer from "../pages/QrUpiAnalyzer.jsx";
import DeepTruth from "../pages/DeepTruth.jsx";
import VoiceGuard from "../pages/VoiceGuard.jsx";
import LinkShield from "../pages/LinkShield.jsx";
import ScamIntelligence from "../pages/ScamIntelligence.jsx";
import UpiSafePause from "../pages/UpiSafePause.jsx";
import PrivacyCentre from "../pages/PrivacyCentre.jsx";
import Settings from "../pages/Settings.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="qr-upi" element={<QrUpiAnalyzer />} />
        <Route path="deeptruth" element={<DeepTruth />} />
        <Route path="voiceguard" element={<VoiceGuard />} />
        <Route path="linkshield" element={<LinkShield />} />
        <Route path="intelligence" element={<ScamIntelligence />} />
        <Route path="safepause" element={<UpiSafePause />} />
        <Route path="privacy" element={<PrivacyCentre />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
