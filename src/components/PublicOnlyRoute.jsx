/* Component for pages that only make sense when logged out (Login and Register).
Logged-in users are sent on to the page they originally asked for (set by ProtectedRoute),
or to their dashboard. */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicOnlyRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  return isLoggedIn ? <Navigate to={redirectTo} replace /> : children;
}