import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useApp } from "../../hooks/useApp.js";
import { useToast } from "../../hooks/useToast.js";
import { useDisclosure } from "../../hooks/useDisclosure.js";
import { useClickOutside } from "../../hooks/useClickOutside.js";
import { timeAgo } from "../../utils/format.js";

export default function NotificationMenu() {
  const { open, onClose, toggle } = useDisclosure();
  const ref = useRef(null);
  const nav = useNavigate();
  const toast = useToast();
  const { notifications, markAllRead, markRead } = useApp();
  const unread = notifications.filter((n) => n.unread).length;
  useClickOutside(ref, onClose, open);

  return (
    <div className="popover-wrap" ref={ref}>
      <button className="icon-btn" onClick={toggle} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} aria-expanded={open}>
        <Bell size={18} />{unread > 0 && <span className="dot-badge" />}
      </button>
      {open && (
        <div className="popover" role="menu">
          <div className="popover-head">
            <span>Notifications</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { markAllRead(); toast.success("All caught up", "Notifications marked as read."); }}>Mark all read</button>
          </div>
          {notifications.map((n) => (
            <button key={n.id} className={`popover-item ${n.unread ? "unread" : ""}`} role="menuitem" onClick={() => { markRead(n.id); onClose(); nav(n.to); }}>
              <div>
                <div style={{ fontWeight: 600 }}>{n.title}</div>
                <div className="s">{n.body}</div>
                <div className="s">{timeAgo(n.at)} · DEMO</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
