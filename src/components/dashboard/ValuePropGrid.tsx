import type { ReactNode } from "react";

interface ValuePropGridProps {
  children: ReactNode;
}

export const ValuePropGrid = ({ children }: ValuePropGridProps) => {
  return <div className="value-prop-grid">{children}</div>;
};
