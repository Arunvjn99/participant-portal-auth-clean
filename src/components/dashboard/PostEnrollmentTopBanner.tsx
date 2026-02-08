import { useNavigate } from "react-router-dom";

interface PostEnrollmentTopBannerProps {
  percentOnTrack: number;
  subText: string;
  actionRoute: string;
}

/**
 * Top banner: "You're X% on track for retirement" with gradient + Take Action CTA
 */
export const PostEnrollmentTopBanner = ({
  percentOnTrack,
  subText,
  actionRoute,
}: PostEnrollmentTopBannerProps) => {
  const navigate = useNavigate();

  return (
    <div className="ped-banner">
      <div className="ped-banner__content">
        <div className="ped-banner__icon" aria-hidden>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
          </svg>
        </div>
        <div className="ped-banner__text">
          <p className="ped-banner__title">
            You're {percentOnTrack}% on track for retirement.
          </p>
          <p className="ped-banner__sub">{subText}</p>
        </div>
        <button
          type="button"
          className="ped-banner__cta"
          onClick={() => navigate(actionRoute)}
        >
          Take Action →
        </button>
      </div>
    </div>
  );
};
