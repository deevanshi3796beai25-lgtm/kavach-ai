import { FlaskConical } from "lucide-react";

export default function DemoNotice({ children }) {
  return (
    <div className="callout demo" role="note">
      <FlaskConical size={18} aria-hidden="true" />
      <div><b>DEMO — simulated result.</b> {children || "No real AI detection or bank verification is performed in this version."}</div>
    </div>
  );
}
