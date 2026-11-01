import { createContext, useCallback, useMemo, useState } from "react";
import ToastStack from "../components/common/ToastStack.jsx";
import { uid } from "../utils/format.js";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback((type, title, message) => {
    const id = uid("toast");
    setToasts((t) => [...t.slice(-3), { id, type, title, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const api = useMemo(
    () => ({
      success: (title, msg) => push("success", title, msg),
      error: (title, msg) => push("error", title, msg),
      info: (title, msg) => push("info", title, msg),
      warning: (title, msg) => push("warning", title, msg),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
