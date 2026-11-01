import { useId } from "react";

/** Custom hero illustration: a layered shield orbited by the four protection modules. */
export default function ShieldIllustration() {
  const id = useId();
  const g = (n) => `${id}${n}`;
  return (
    <svg viewBox="0 0 480 480" fill="none" role="img" aria-label="Illustration of a glowing shield protecting QR, voice, link and media checks">
      <defs>
        <linearGradient id={g("a")} x1="120" y1="60" x2="360" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="#258CE8" /><stop offset=".55" stopColor="#39D5F2" /><stop offset="1" stopColor="#7857E8" />
        </linearGradient>
        <linearGradient id={g("b")} x1="240" y1="80" x2="240" y2="400" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16253f" /><stop offset="1" stopColor="#0b1424" />
        </linearGradient>
        <radialGradient id={g("c")} cx="50%" cy="40%" r="60%"><stop stopColor="#39D5F2" stopOpacity=".35" /><stop offset="1" stopColor="#39D5F2" stopOpacity="0" /></radialGradient>
      </defs>

      {/* orbit rings */}
      <circle cx="240" cy="240" r="214" stroke="#258CE8" strokeOpacity=".18" strokeDasharray="3 9" />
      <circle cx="240" cy="240" r="170" stroke="#39D5F2" strokeOpacity=".16" />
      <circle cx="240" cy="240" r="130" fill={`url(#${g("c")})`} />

      {/* shield */}
      <path d="M240 78 130 120v96c0 76 47 129 110 152 63-23 110-76 110-152v-96L240 78Z" fill={`url(#${g("b")})`} stroke={`url(#${g("a")})`} strokeWidth="3" strokeLinejoin="round" />
      <path d="M240 104 152 137v79c0 62 37 106 88 126 51-20 88-64 88-126v-79l-88-33Z" stroke="#39D5F2" strokeOpacity=".28" strokeWidth="1.5" />
      {/* circuit lines */}
      <g stroke="#39D5F2" strokeOpacity=".35" strokeWidth="1.5" strokeLinecap="round">
        <path d="M240 142v40M240 300v36M180 200h-24M300 200h24M196 268h-18M284 268h18" />
      </g>
      <g fill="#39D5F2" fillOpacity=".7"><circle cx="240" cy="142" r="3.5" /><circle cx="156" cy="200" r="3.5" /><circle cx="324" cy="200" r="3.5" /><circle cx="178" cy="268" r="3.5" /><circle cx="302" cy="268" r="3.5" /></g>
      {/* check */}
      <circle cx="240" cy="228" r="52" fill="#0a1424" stroke={`url(#${g("a")})`} strokeWidth="2.5" />
      <path d="M214 229 234 249 270 208" stroke={`url(#${g("a")})`} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

      {/* orbit nodes */}
      <g>
        <circle cx="240" cy="26" r="26" fill="#0d1525" stroke="#258CE8" strokeOpacity=".7" />
        <g stroke="#5db4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="228" y="14" width="9" height="9" rx="1.5" /><rect x="243" y="14" width="9" height="9" rx="1.5" /><rect x="228" y="29" width="9" height="9" rx="1.5" /><path d="M243 29h4v4h5M247 38v0M252 29v0" /></g>
      </g>
      <g>
        <circle cx="440" cy="240" r="26" fill="#0d1525" stroke="#7857E8" strokeOpacity=".8" />
        <path d="M426 240h4m4-8v16m5-22v28m5-18v8m5-14v20m5-12v4" stroke="#a791ff" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g>
        <circle cx="240" cy="454" r="26" fill="#0d1525" stroke="#39D5F2" strokeOpacity=".7" />
        <g stroke="#39D5F2" strokeWidth="2.2" strokeLinecap="round" fill="none"><path d="M236 450a6 6 0 0 1 0-8l5-5a6 6 0 0 1 8 8l-2 2" /><path d="M244 458a6 6 0 0 1 0 8l-5 5a6 6 0 0 1-8-8l2-2" transform="translate(0 -9)" /></g>
      </g>
      <g>
        <circle cx="40" cy="240" r="26" fill="#0d1525" stroke="#f5b544" strokeOpacity=".7" />
        <g stroke="#f5b544" strokeWidth="2.2" strokeLinecap="round" fill="none"><circle cx="40" cy="236" r="7" /><path d="M28 254c2-7 8-10 12-10s10 3 12 10" /></g>
      </g>
    </svg>
  );
}
