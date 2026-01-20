interface WarningBannerProps {
  message: string;
  type?: "warning" | "info";
}

export const WarningBanner = ({ message, type = "warning" }: WarningBannerProps) => {
  return (
    <div className={`warning-banner warning-banner--${type}`} role="alert">
      <span className="warning-banner__icon" aria-hidden="true">
        {type === "warning" ? "⚠️" : "ℹ️"}
      </span>
      <p className="warning-banner__message">{message}</p>
    </div>
  );
};
