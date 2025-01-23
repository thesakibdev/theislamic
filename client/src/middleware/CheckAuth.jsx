import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (
    location.pathname.startsWith("/admin") &&
    (!isAuthenticated || user?.role !== "admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  return <>{children}</>;
}
