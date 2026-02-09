import { Outlet, useLocation } from "react-router-dom";
import { FloatingRetirementSearch } from "../components/ai/FloatingRetirementSearch";

const HIDE_BELLA_PATHS = ["/", "/voice"];

/**
 * Root layout - wraps all routes. Renders Outlet + global floating components.
 * FloatingRetirementSearch appears on every screen except login and voice pages.
 */
export const RootLayout = () => {
  const { pathname } = useLocation();
  const showBella = !HIDE_BELLA_PATHS.includes(pathname);

  return (
    <>
      <Outlet />
      {showBella && <FloatingRetirementSearch />}
    </>
  );
};
