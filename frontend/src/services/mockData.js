// ALL DATA IN THIS FILE IS FICTIONAL DEMO DATA. Replace with API calls (FastAPI / Supabase) later.
import { minutesAgo } from "../utils/format.js";

export const demoUser = {
  name: "Aarav Sharma",
  email: "aarav.demo@example.com",
  phone: "9876543210",
  initials: "AS",
  plan: "Demo account",
};

export const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
];

export const seedScans = [
  { id: "s1", module: "qr", title: "Merchant QR — Corner Mart", subject: "cornermart@demobank", level: "low", label: "VERIFIED", at: minutesAgo(18) },
  { id: "s2", module: "link", title: "kyc-update-sbi.help", subject: "Link analysis", level: "high", label: "HIGH RISK", at: minutesAgo(95) },
  { id: "s3", module: "voice", title: "Call recording 02", subject: "Voice analysis", level: "medium", label: "REVIEW", at: minutesAgo(60 * 5) },
  { id: "s4", module: "qr", title: "Personal QR — unknown payee", subject: "r.verma92@demobank", level: "medium", label: "UNVERIFIED", at: minutesAgo(60 * 26) },
  { id: "s5", module: "deepfake", title: "profile_photo.jpg", subject: "Image analysis", level: "low", label: "NO SIGNALS", at: minutesAgo(60 * 49) },
];

export const seedAlerts = [
  { id: "a1", level: "high", title: "Phishing link pattern detected", body: "kyc-update-sbi.help imitates a bank KYC page. Do not enter any credentials or OTP.", at: minutesAgo(95) },
  { id: "a2", level: "medium", title: "Unverified beneficiary", body: "You scanned a QR for r.verma92@demobank. No verification data exists for this payee — confirm directly with the person before paying.", at: minutesAgo(60 * 26) },
  { id: "a3", level: "low", title: "Weekly safety tip", body: "Genuine banks never ask for your UPI PIN or OTP. You only enter your PIN to SEND money, never to receive it.", at: minutesAgo(60 * 72) },
];

export const seedTimeline = [
  { id: "t1", level: "safe", title: "QR verified — Corner Mart", at: minutesAgo(18) },
  { id: "t2", level: "danger", title: "High-risk link flagged", at: minutesAgo(95) },
  { id: "t3", level: "warn", title: "Voice call marked for review", at: minutesAgo(300) },
  { id: "t4", level: "warn", title: "Unverified payee scanned", at: minutesAgo(60 * 26) },
  { id: "t5", level: "safe", title: "Profile photo checked — no signals", at: minutesAgo(60 * 49) },
];

export const seedNotifications = [
  { id: "n1", title: "High-risk link flagged", body: "kyc-update-sbi.help — review in LinkShield", unread: true, to: "/app/linkshield", at: minutesAgo(95) },
  { id: "n2", title: "Weekly safety tip", body: "Never share your UPI PIN or OTP.", unread: true, to: "/app/intelligence", at: minutesAgo(60 * 20) },
  { id: "n3", title: "Privacy notice updated (demo)", body: "Review your consent preferences.", unread: false, to: "/app/privacy", at: minutesAgo(60 * 70) },
];

export const seedConsentHistory = [
  { id: "c1", action: "Granted", purpose: "Essential security processing", at: minutesAgo(60 * 24 * 12) },
  { id: "c2", action: "Granted", purpose: "Scan history storage", at: minutesAgo(60 * 24 * 12) },
  { id: "c3", action: "Withdrawn", purpose: "Product analytics", at: minutesAgo(60 * 24 * 5) },
];

// ----- QR & UPI demo scenarios (fictional payees) -----
export const qrScenarios = {
  verified: {
    status: "verified",
    payee: { name: "Corner Mart Pvt Ltd", upiId: "cornermart@demobank", merchantCode: "5411 (Grocery)", amount: "₹ 480.00", note: "Order #1042" },
    reasons: [
      { type: "pass", title: "Matches a verified merchant record", body: "In this demo, the UPI ID matches a sample verified-merchant registry entry." },
      { type: "pass", title: "Name matches the UPI ID handle", body: "The display name and the handle are consistent." },
      { type: "pass", title: "No risk reports on file (demo)", body: "No community or bank reports in the sample dataset." },
    ],
  },
  unverified: {
    status: "unverified",
    payee: { name: "R. Verma", upiId: "r.verma92@demobank", merchantCode: "— (personal account)", amount: "Not specified", note: "—" },
    reasons: [
      { type: "skip", title: "No verification data available", body: "We have no record for this payee. That is common for individuals and new merchants." },
      { type: "pass", title: "No risk reports on file (demo)", body: "Nothing in the sample dataset flags this payee." },
      { type: "warn", title: "Personal account asking for a payment", body: "Confirm with the person through a channel you trust before paying." },
    ],
  },
  risk: {
    status: "risk",
    payee: { name: "Prize Refund Desk", upiId: "refund.claim7781@demobank", merchantCode: "— (unknown)", amount: "₹ 4,999.00", note: "Processing fee" },
    reasons: [
      { type: "fail", title: "Matches a demo risk pattern", body: "Names like “refund”, “claim” or “prize” combined with a ‘fee’ note are a common scam theme." },
      { type: "fail", title: "Collect-style request for a ‘fee’", body: "Genuine refunds and prizes never require you to pay first." },
      { type: "warn", title: "Name and handle do not match", body: "The display name and the UPI handle look unrelated." },
    ],
  },
};

export const qrStateInfo = {
  verified: {
    label: "VERIFIED", level: "low",
    headline: "Payee matches a verified record",
    meaning: "The beneficiary matches a trusted source (for example a registered merchant). This lowers risk but is not a guarantee — always check the amount and name.",
  },
  unverified: {
    label: "UNKNOWN / UNVERIFIED", level: "medium",
    headline: "We could not verify this payee",
    meaning: "There is not enough information to confirm the beneficiary. This does NOT mean the payee is fraudulent — most individuals and small shops are unverified. Confirm identity yourself before paying.",
  },
  risk: {
    label: "RISK-FLAGGED", level: "high",
    headline: "This payee shows risk signals",
    meaning: "One or more specific risk signals were found (for example a scam-like pattern or a report). Pause the payment and double-check using a trusted channel.",
  },
};

// ----- Voice demo -----
export const voiceDemo = {
  transcript: [
    { text: "Hello sir, I am calling from the bank's head office. ", flag: false },
    { text: "Your account will be blocked today", flag: "Urgency / threat" },
    { text: " because KYC is pending. To avoid this, ", flag: false },
    { text: "please share the OTP", flag: "Requests OTP" },
    { text: " that you just received. Do not tell anyone, ", flag: false },
    { text: "this is a confidential matter", flag: "Secrecy pressure" },
    { text: ". You can also install this app so we can ", flag: false },
    { text: "access your phone screen", flag: "Remote-access request" },
    { text: " and fix it quickly.", flag: false },
  ],
  indicators: [
    { type: "fail", title: "Urgency or threat language", body: "Pressure like “blocked today” is used to stop you from thinking." },
    { type: "fail", title: "Request for OTP / PIN", body: "Banks never ask for OTPs on a call." },
    { type: "warn", title: "Secrecy request", body: "Scammers ask you not to tell family or the bank." },
    { type: "warn", title: "Remote-access app suggested", body: "Screen-sharing apps let callers see your OTPs and banking apps." },
    { type: "skip", title: "Voice cloning / synthetic speech", body: "Not analysed — requires a real audio model." },
  ],
};

// ----- Evidence for Scam Intelligence (aggregated demo) -----
export const moduleMeta = {
  qr: { label: "QR & UPI", color: "var(--blue)" },
  deepfake: { label: "DeepTruth", color: "#a791ff" },
  voice: { label: "VoiceGuard", color: "var(--cyan)" },
  link: { label: "LinkShield", color: "var(--warn)" },
};

export const recommendedActions = [
  { id: "r1", title: "Never share your UPI PIN or OTP", body: "No bank, agent or ‘officer’ needs it. You only enter your PIN to send money." },
  { id: "r2", title: "Verify the payee before you pay", body: "Call the person or shop on a number you already trust, not one sent in the message." },
  { id: "r3", title: "Do not open links from unexpected SMS / WhatsApp", body: "Type the bank's address yourself or use its official app." },
  { id: "r4", title: "Report fraud quickly", body: "Call 1930 or visit cybercrime.gov.in. Early reporting improves the chance of recovery." },
  { id: "r5", title: "Turn on UPI transaction limits", body: "Set a daily cap in your bank app to reduce the impact of any mistake." },
];

// ----- SafePause demo recipients -----
export const safePauseSamples = [
  { name: "Corner Mart Pvt Ltd", upiId: "cornermart@demobank", amount: "480" },
  { name: "R. Verma", upiId: "r.verma92@demobank", amount: "12000" },
  { name: "Prize Refund Desk", upiId: "refund.claim7781@demobank", amount: "4999" },
];

export const privacyNotice = [
  { title: "What we process", body: "Files, links and payment details you choose to analyse, plus basic usage data needed to run the service." },
  { title: "Why we process it", body: "To show you a safety assessment and keep your scan history. We ask for your consent for anything beyond this." },
  { title: "Your choices", body: "You can withdraw consent, request access, correct or erase your data, and raise a grievance at any time." },
  { title: "Retention", body: "Scan data is kept only as long as you keep it in your history. You can erase it whenever you like." },
];
