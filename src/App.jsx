import { Container } from "react-bootstrap";
// Hooks that read from the authentication and events contexts.
import { useAuth } from "./hooks/useAuth";
import { useEvents } from "./hooks/useEvents";
//Branded logo asset
import cadenzaLogo from "./assets/cadenza-lockup-serifC.svg";

// Temporary start page to check that both contexts are connected.
export default function App() {
  const { isLoggedIn, currentUser } = useAuth();
  const { upcomingEvents } = useEvents();
  return (
    <Container className="py-5 text-center">
      <img src={cadenzaLogo} alt="Cadenza Orchestra Planner" height={120} />
      <p className="lead mt-4">
        {isLoggedIn
          ? `Logged in as ${currentUser.name}.`
          : "Authentication context connected - nobody is logged in yet."}
      </p>
      <p>Events context connected - upcoming calls: {upcomingEvents.length}</p>
    </Container>
  );
}
