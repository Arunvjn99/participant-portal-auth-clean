import { Outlet } from "react-router-dom";
import { EnrollmentProvider } from "../enrollment/context/EnrollmentContext";

/**
 * EnrollmentLayout - Wraps enrollment routes with EnrollmentProvider
 * Ensures enrollment state is shared across choose-plan and contribution pages
 */
export const EnrollmentLayout = () => {
  return (
    <EnrollmentProvider>
      <Outlet />
    </EnrollmentProvider>
  );
};
