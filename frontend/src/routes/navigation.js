import { LayoutDashboard, QrCode, ScanFace, AudioLines, Link2, Radar, PauseCircle, Lock, Settings } from "lucide-react";

export const appNav = [
  { path: "/app", label: "Overview", icon: LayoutDashboard, end: true, desc: "Your protection status at a glance." },
  { path: "/app/qr-upi", label: "QR & UPI Analyzer", icon: QrCode, desc: "Check a payment QR before you scan-and-pay." },
  { path: "/app/deeptruth", label: "DeepTruth AI", icon: ScanFace, desc: "Inspect images, audio and video for manipulation signals." },
  { path: "/app/voiceguard", label: "VoiceGuard", icon: AudioLines, desc: "Spot scam language in call recordings." },
  { path: "/app/linkshield", label: "LinkShield", icon: Link2, desc: "Check suspicious links before opening them." },
  { path: "/app/intelligence", label: "Scam Intelligence", icon: Radar, desc: "One view of evidence across all modules." },
  { path: "/app/safepause", label: "UPI SafePause", icon: PauseCircle, desc: "A safety checkpoint before you pay." },
  { path: "/app/privacy", label: "Privacy Centre", icon: Lock, desc: "Control consent and exercise your data rights." },
  { path: "/app/settings", label: "Settings", icon: Settings, desc: "Profile, language and notifications." },
];

export const moduleNav = appNav.filter((n) => !["/app", "/app/settings", "/app/privacy"].includes(n.path));
