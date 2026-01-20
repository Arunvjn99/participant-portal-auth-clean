import type { ReactNode } from "react";

interface AuthLayoutProps {
  left?: ReactNode;
  children: ReactNode;
}

export const AuthLayout = ({ left, children }: AuthLayoutProps) => {
  return (
    <div className="auth-layout">
      {left && (
        <div className="auth-layout__left">
          <div className="auth-layout__left-inner">
            <div className="auth-layout__left-card">{left}</div>
            <div className="auth-layout__left-dots" aria-hidden="true">
              <span className="auth-layout__dot auth-layout__dot--active" />
              <span className="auth-layout__dot" />
              <span className="auth-layout__dot" />
            </div>
          </div>
        </div>
      )}
      <div className="auth-layout__right">
        <div className="auth-layout__right-card">{children}</div>
      </div>
    </div>
  );
};
