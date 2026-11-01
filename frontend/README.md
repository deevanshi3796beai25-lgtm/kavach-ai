# KAVACH AI — Frontend

React 19 + Vite + React Router + Lucide icons. Plain CSS design system (no Tailwind).

```bash
npm install     # installs lucide-react (the only new dependency)
npm run dev     # http://localhost:5173
npm run build
```

## Routes
`/` landing · `/app` overview · `/app/qr-upi` · `/app/deeptruth` · `/app/voiceguard` · `/app/linkshield` · `/app/intelligence` · `/app/safepause` · `/app/privacy` · `/app/settings`

## Structure
- `components/common` buttons, cards, modal, tabs, toasts, dropzone, form fields …
- `components/layout` sidebar, topbar, notification / profile / language menus
- `components/dashboard`, `components/security` feature-level building blocks
- `layouts/AppLayout.jsx` shell · `routes/` route table + nav config
- `context/` toast + demo app state · `hooks/` upload, simulated task, etc.
- `services/mockAnalysis.js` **all simulated analysis lives here** — replace each function with a FastAPI call (same return shape) when the backend is ready. `services/api.js` is your original backend client, kept for that.
- `styles/` tokens, components, layout, page CSS
- `_legacy/` your original Home/Scan/Result/History pages, kept for reference (not imported)

Everything shown is DEMO data / simulated results and is labelled as such.
