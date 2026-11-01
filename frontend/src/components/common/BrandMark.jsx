import { useId } from "react";

/** KAVACH AI logo mark — a shield with a check. */
export default function BrandMark({ size = 36 }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}g`} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#258CE8" /><stop offset="1" stopColor="#39D5F2" />
        </linearGradient>
      </defs>
      <path d="M24 3 6 10v13c0 11 7.6 19.4 18 22 10.4-2.6 18-11 18-22V10L24 3Z" fill={`url(#${id}g)`} fillOpacity=".16" stroke={`url(#${id}g)`} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M15.5 24.5 21.5 30.5 33 17.5" stroke={`url(#${id}g)`} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
