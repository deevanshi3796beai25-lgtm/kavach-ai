import { Languages } from "lucide-react";
import { useApp } from "../../hooks/useApp.js";
import { useToast } from "../../hooks/useToast.js";
import { languages } from "../../services/mockData.js";

export default function LanguageSelect() {
  const { language, setLanguage } = useApp();
  const toast = useToast();
  return (
    <label className="lang-select">
      <Languages size={16} className="lang-icon" aria-hidden="true" />
      <span className="sr-only">Language</span>
      <select
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          const l = languages.find((x) => x.code === e.target.value);
          toast.info(`Language set to ${l.label}`, "Preference saved. Full UI translation is not built yet (demo).");
        }}
      >
        {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>
    </label>
  );
}
