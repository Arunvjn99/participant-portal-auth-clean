import { DashboardCard } from "./DashboardCard";
import { useState } from "react";
import type { KeyboardEvent } from "react";

interface ResourceCardProps {
  title: string;
  description: string;
  imageSrc?: string;
  badge?: string;
  onClick?: () => void;
}

const ResourceCard = ({ title, description, imageSrc, badge, onClick }: ResourceCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const showImage = imageSrc && !imageError;
  const showPlaceholder = !imageSrc || imageError;

  const cardContent = (
    <>
      {showImage && (
        <div className="resource-card__image-wrapper">
          <img
            src={imageSrc}
            alt=""
            className="resource-card__image"
            onError={handleImageError}
          />
          {badge && (
            <span className="resource-card__badge" aria-label={`Content type: ${badge}`}>
              {badge}
            </span>
          )}
        </div>
      )}
      {showPlaceholder && (
        <div className="resource-card__image-placeholder">
          {badge && (
            <span className="resource-card__badge resource-card__badge--on-placeholder" aria-label={`Content type: ${badge}`}>
              {badge}
            </span>
          )}
        </div>
      )}
      <h3 className="resource-card__title">{title}</h3>
      <p className="resource-card__description">{description}</p>
    </>
  );

  if (onClick) {
    return (
      <DashboardCard>
        <div
          className="resource-card resource-card--clickable"
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          aria-label={`${title}. ${description}`}
        >
          {cardContent}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <div className="resource-card">{cardContent}</div>
    </DashboardCard>
  );
};

export default ResourceCard;
