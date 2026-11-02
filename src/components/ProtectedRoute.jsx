/* Component that protects routes by checking user authentication status.
If the user is logged in, it renders the child components; otherwise, it redirects to the login page
and remembers the page they wanted, so they can be sent back there after logging in. */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}