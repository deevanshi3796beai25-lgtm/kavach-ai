// SIMULATED analysis. Nothing here calls a real AI model or bank.
// Later: replace each function body with a call to the FastAPI backend (see services/api.js),
// keeping the same return shape so the UI does not need to change.
import { qrScenarios, qrStateInfo, voiceDemo } from "./mockData.js";
import { hashString } from "../utils/format.js";
import { normalizeUrl } from "../utils/validators.js";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- QR & UPI ----------
export async function analyzeQr(file, scenario = "auto") {
  await sleep(1700);
  const keys = ["verified", "unverified", "risk"];
  const key = scenario !== "auto" ? scenario : keys[hashString((file?.name || "") + (file?.size || 0)) % 3];
  return { demo: true, key, ...qrScenarios[key], info: qrStateInfo[key] };
}

// ---------- DeepTruth ----------
export async function analyzeMedia(file, kind) {
  await sleep(2100);
  const h = hashString((file?.name || "") + (file?.size || 0));
  const score = 12 + (h % 74); // illustrative 12–85
  const level = score >= 65 ? "high" : score >= 35 ? "medium" : "low";
  const signalsByKind = {
    image: ["Facial edge consistency", "Lighting direction", "Compression artefacts", "Metadata completeness"],
    audio: ["Spectral smoothness", "Breathing / pause pattern", "Background noise continuity", "Metadata completeness"],
    video: ["Lip-sync alignment", "Frame-to-frame flicker", "Blink pattern", "Metadata completeness"],
  };
  const signals = (signalsByKind[kind] || signalsByKind.image).map((name, i) => {
    const v = (h >> (i * 3)) % 100;
    return { name, value: v, type: v > 66 ? "warn" : "pass" };
  });
  return {
    demo: true, kind, score, level,
    label: level === "high" ? "POSSIBLE MANIPULATION SIGNALS" : level === "medium" ? "INCONCLUSIVE — REVIEW" : "NO MANIPULATION SIGNALS",
    signals,
    summary:
      "This is an illustrative result generated from the file's name and size. A production model would examine the actual pixels / audio / frames, and even then a score is evidence, not proof.",
  };
}

// ---------- VoiceGuard ----------
export async function analyzeVoice() {
  await sleep(2000);
  return { demo: true, level: "high", label: "SCAM-LIKE LANGUAGE (SAMPLE)", ...voiceDemo };
}

// ---------- LinkShield ----------
const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "rb.gy", "cutt.ly", "is.gd"];
const RISKY_TLDS = [".xyz", ".top", ".help", ".click", ".icu", ".live", ".support", ".buzz", ".tk", ".gq", ".cf"];
const BRANDS = ["sbi", "hdfc", "icici", "axis", "paytm", "phonepe", "gpay", "googlepay", "npci", "upi", "amazon", "flipkart", "irctc", "uidai", "aadhaar"];
const BAIT = ["kyc", "verify", "update", "refund", "reward", "prize", "lottery", "claim", "blocked", "suspend", "urgent", "login", "secure"];

/**
 * Illustrative rule-based check on the URL text only. It does NOT fetch the page,
 * look up domain age, or query any threat-intelligence feed.
 */
export async function analyzeLink(input) {
  await sleep(1300);
  const u = normalizeUrl(input);
  if (!u) throw new Error("Enter a valid link first.");
  const host = (u?.hostname || "").toLowerCase().replace(/^www\./, "");
  const full = (u?.href || "").toLowerCase();
  const labels = host.split(".");
  const secondLevel = ["co", "gov", "org", "net", "nic", "ac"].includes(labels.at(-2)) && labels.at(-1) === "in";
  const registrable = labels.slice(secondLevel ? -3 : -2).join(".");
  const brandHit = BRANDS.find((b) => host.includes(b));
  // "official" = the registrable domain is exactly <brand>.<known suffix>, e.g. sbi.co.in — not kyc-sbi.com
  const officialBrand = !!brandHit && ["com", "in", "co.in", "gov.in", "org.in", "net.in"].some((sfx) => registrable === `${brandHit}.${sfx}`);
  const baitHit = BAIT.filter((b) => full.includes(b));
  const indicators = [];
  let points = 0;
  const add = (type, title, body, pts = 0) => { indicators.push({ type, title, body }); points += pts; };

  u.protocol === "https:"
    ? add("pass", "Uses HTTPS", "The connection is encrypted. This alone does not make a site trustworthy.")
    : add("warn", "Not using HTTPS", "The link is unencrypted — avoid entering any information.", 15);
  /^\d{1,3}(\.\d{1,3}){3}$/.test(host)
    ? add("fail", "IP address instead of a domain", "Legitimate services rarely use raw IP addresses.", 30)
    : add("pass", "Normal domain name", "The link uses a regular domain.");
  RISKY_TLDS.some((t) => host.endsWith(t))
    ? add("warn", "Domain ending often seen in scam sites", `Endings like “.${labels.at(-1)}” are cheap and commonly abused (not always malicious).`, 20)
    : add("pass", "Common domain ending", `“.${labels.at(-1)}” is not in our sample watch-list.`);
  brandHit && !officialBrand
    ? add("fail", `Mentions “${brandHit.toUpperCase()}” but is not the brand's own domain`, `${registrable} may be imitating a known brand.`, 30)
    : add("pass", "No look-alike brand name found", "No well-known Indian brand names are embedded in the domain.");
  baitHit.length
    ? add("warn", "Pressure / bait words in the link", `Found: ${baitHit.slice(0, 4).join(", ")}.`, 15 + Math.min(baitHit.length * 3, 10))
    : add("pass", "No pressure words detected", "The URL text has no common bait words.");
  SHORTENERS.includes(host) && add("warn", "Link shortener hides the destination", "Expand the link before opening it.", 15);
  (host.includes("xn--") || (full.match(/@/g) || []).length) && add("fail", "Obfuscated address", "Punycode or ‘@’ tricks can disguise the real destination.", 25);
  labels.length > 4 && add("warn", "Unusually many sub-domains", "Long sub-domain chains are used to look official.", 10);
  (host.match(/-/g) || []).length >= 3 && add("warn", "Many hyphens in the domain", "Scam domains often chain words with hyphens.", 10);

  indicators.push(
    { type: "skip", title: "Domain age / registration", body: "Not checked — needs a backend WHOIS service." },
    { type: "skip", title: "Threat-intelligence feeds", body: "Not checked — needs a backend integration." },
    { type: "skip", title: "Page content / SSL certificate", body: "Not checked — the page is never opened." },
  );

  const score = Math.min(97, 6 + points);
  const level = score >= 60 ? "high" : score >= 28 ? "medium" : "low";
  return {
    demo: true, url: u.href, domain: host, registrable, score, level,
    label: level === "high" ? "HIGH RISK" : level === "medium" ? "SUSPICIOUS — BE CAREFUL" : "LOW RISK (URL TEXT ONLY)",
    recommendation:
      level === "high" ? "Do not open this link or enter any details. If you already did, contact your bank and call 1930."
      : level === "medium" ? "Avoid entering personal or payment details. Open the service through its official app or by typing its address yourself."
      : "No obvious red flags in the URL text, but this check is limited. Stay alert on the page itself.",
    indicators,
  };
}

// ---------- UPI SafePause ----------
export async function checkRecipient({ upiId, amount }) {
  await sleep(1200);
  const id = upiId.toLowerCase();
  let key = "unverified";
  if (id === "cornermart@demobank") key = "verified";
  else if (/(refund|claim|prize|lottery|kyc|reward|cashback)/.test(id)) key = "risk";
  const high = Number(amount) >= 10000;
  return { demo: true, key, info: qrStateInfo[key], highAmount: high };
}
