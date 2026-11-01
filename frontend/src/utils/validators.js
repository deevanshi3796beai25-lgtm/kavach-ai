// Each validator returns an error string, or "" when valid.
export const required = (v, label = "This field") => (String(v ?? "").trim() ? "" : `${label} is required.`);

export const email = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()) ? "" : "Enter a valid email address.";

export const phone = (v) =>
  /^(\+91[\s-]?)?[6-9]\d{9}$/.test(String(v).replace(/\s/g, "")) ? "" : "Enter a valid 10-digit Indian mobile number.";

/** UPI ID format: handle@provider (e.g. name@bank). Format check only — says nothing about who owns it. */
export const upiId = (v) =>
  /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-]{1,64}$/.test(String(v).trim())
    ? ""
    : "Enter a valid UPI ID, like name@bank.";

export const amount = (v) => {
  const n = Number(v);
  if (!String(v).trim()) return "Amount is required.";
  if (Number.isNaN(n) || n <= 0) return "Enter an amount greater than 0.";
  if (n > 1000000) return "Amount looks too large for a UPI payment.";
  return "";
};

export const minLength = (min, label = "This field") => (v) =>
  String(v ?? "").trim().length >= min ? "" : `${label} must be at least ${min} characters.`;

export function normalizeUrl(input) {
  const raw = String(input).trim();
  if (!raw) return null;
  try {
    return new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
}

export const url = (v) => {
  const u = normalizeUrl(v);
  if (!u || !u.hostname.includes(".")) return "Enter a valid link, like https://example.com";
  return "";
};

/** Run a { field: validatorFn } schema against values. Returns an errors object ({} if all valid). */
export function validate(values, schema) {
  const errors = {};
  for (const key of Object.keys(schema)) {
    const fns = Array.isArray(schema[key]) ? schema[key] : [schema[key]];
    for (const fn of fns) {
      const msg = fn(values[key]);
      if (msg) { errors[key] = msg; break; }
    }
  }
  return errors;
}
