import type { ReactNode } from "react";

interface AdvisorListProps {
  children: ReactNode;
}

export const AdvisorList = ({ children }: AdvisorListProps) => {
  return <div className="advisor-list">{children}</div>;
};
