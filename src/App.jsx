// React Router
import { Navigate, Route, Routes } from "react-router-dom";
// Bootstrap
import { Container } from "react-bootstrap";
// Fixed header navigation bar that appears on all pages at the top of the screen.
import HeaderNav from "./components/HeaderNav";
// Route guards: one for logged-in users only, one for logged-out users only.
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
// Pages for each route.
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import Help from "./pages/Help";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

// Main application component that sets up routing and layout.
export default function App() {
  return (
    <>
      <HeaderNav />

      <main className="cz-main">
        <Container className="cz-page">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />

            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>
    </>
  );
}