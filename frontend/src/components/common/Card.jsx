export default function Card({ title, subtitle, icon: Icon, action, hover, flat, className = "", children, as: Tag = "section", ...rest }) {
  return (
    <Tag className={["card", hover && "card-hover", flat && "card-flat", className].filter(Boolean).join(" ")} {...rest}>
      {(title || action) && (
        <div className="card-head">
          <div>
            <h3 className="card-title">{Icon && <Icon size={18} color="var(--cyan)" aria-hidden="true" />}{title}</h3>
            {subtitle && <p className="card-sub">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}
