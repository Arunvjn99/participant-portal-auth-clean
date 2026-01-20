import { branding } from "../../config/branding";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return <img src={branding.logo.src} alt={branding.logo.alt} className={className} />;
};
