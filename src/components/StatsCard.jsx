export default function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  accent = "default",
}) {
  return (
    <div className={`stats-card stats-card--${accent}`}>
      <div className="stats-card__header">
        <div>
          <div className="stats-title">{title}</div>
          <div className="stats-value">{value}</div>
        </div>
        {icon ? <div className="stats-icon">{icon}</div> : null}
      </div>
      {description ? (
        <div className="stats-description">{description}</div>
      ) : null}
      {trend ? <div className="stats-trend">{trend}</div> : null}
    </div>
  );
}
