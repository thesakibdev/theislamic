import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const hasAccess = (role) => ["admin", "creator", "editor"].includes(role);

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === hasAccess(user?.role)) {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "reader") {
      return <Navigate to="/index" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  // if (
  //   location.pathname.startsWith("/admin") &&
  //   (!isAuthenticated || !hasAccess(user?.role))
  // ) {
  //   return <Navigate to="/unauth-page" />;
  // }

  return <>{children}</>;
}
