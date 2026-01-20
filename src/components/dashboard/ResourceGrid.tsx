import type { ReactNode } from "react";

interface ResourceGridProps {
  children: ReactNode;
  className?: string;
}

const ResourceGrid = ({ children, className }: ResourceGridProps) => {
  return <div className={`resource-grid ${className || ""}`}>{children}</div>;
};

export default ResourceGrid;
