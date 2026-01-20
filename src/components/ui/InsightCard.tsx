interface InsightCardProps {
  title?: string;
  message: string;
  tone?: "positive" | "neutral" | "warning";
}

export const InsightCard = ({ title, message, tone = "neutral" }: InsightCardProps) => {
  return (
    <div className={`insight-card insight-card--${tone}`} role="status" aria-live="polite">
      {title && <h4 className="insight-card__title">{title}</h4>}
      <p className="insight-card__message">{message}</p>
    </div>
  );
};
