import {Container} from "react-bootstrap";
//Branded logo asset
import cadenzaLogo from "./assets/cadenza-lockup-serifC.svg";

//Temporary start page to check that Bootstrap is working and that the logo is displaying correctly.
export default function App() {
  return (
    <Container className="py-5 text-center">
      <img src={cadenzaLogo} alt="Cadenza Orchestra Planner" height={120}/>
      <p className="lead mt-4">Project set-up complete.</p>
      <button type="button" className="btn btn-dark">
        Bootstrap is working!
      </button>
    </Container>
  );
}