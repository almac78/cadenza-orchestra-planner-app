import { Container } from "react-bootstrap";
// Authentication hook: reads login state from the AuthContext.
import { useAuth } from "./hooks/useAuth";
//Branded logo asset
import cadenzaLogo from "./assets/cadenza-lockup-serifC.svg";

// Temporary start page to check that the authentication context is connected.
export default function App() {
  const { isLoggedIn, currentUser } = useAuth();

  return (
    <Container className="py-5 text-center">
      <img src={cadenzaLogo} alt="Cadenza Orchestra Planner" height={120} />
      <p className="lead mt-4">
        {isLoggedIn
          ? `Logged in as ${currentUser.name}.`
          : "Authentication context connected - nobody is logged in yet."}
      </p>
    </Container>
  );
}
