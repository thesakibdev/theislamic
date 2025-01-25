import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const hasAccess = (role) => ["admin", "creator", "editor"].includes(role);

  if (
    location.pathname.startsWith("/admin") &&
    (!isAuthenticated || !hasAccess(user?.role))
  ) {
    return <Navigate to="/unauth-page" />;
  }

  return <>{children}</>;
}
