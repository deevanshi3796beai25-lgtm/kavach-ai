export const TYPES = {
  voice: { icon: "📞", title: "Call / Voice", desc: "Call transcript, phone number ya audio check karein", placeholder: "Call me jo bola gaya wo paste karein, ya sirf number likhein (+91...)", file: "audio/*", textOk: true },
  link: { icon: "🔗", title: "Link", desc: "SMS/WhatsApp ka link phishing to nahi?", placeholder: "https://...", file: null, textOk: true },
  qr: { icon: "▦", title: "QR / UPI", desc: "QR ke andar ka UPI link ya text paste karein", placeholder: "upi://pay?pa=name@bank&pn=Name&am=100", file: null, textOk: true },
  media: { icon: "🖼️", title: "Photo / Video", desc: "Deepfake ya edited media check karein", placeholder: "", file: "image/*,video/*", textOk: false },
};
export const VERDICT = {
  SAFE: { cls: "safe", icon: "✅", label: "SAFE" },
  SUSPICIOUS: { cls: "warn", icon: "⚠️", label: "SUSPICIOUS" },
  FAKE: { cls: "bad", icon: "🚨", label: "FAKE / HIGH RISK" },
};
