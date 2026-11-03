/* Centred, branded card used as the layout for the Login and Register pages. */
import { Card } from "react-bootstrap";
// Branded mark asset
import cadenzaMark from "../assets/cadenza-mark-serifC.svg";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="cz-auth">
      <Card className="cz-card shadow-sm">
        <Card.Body className="p-4 p-sm-5">
          <div className="text-center mb-4">
            <img src={cadenzaMark} alt="" className="cz-auth-mark mb-3" />
            <h1 className="cz-auth-title">{title}</h1>
            {subtitle && <p className="cz-muted mb-0">{subtitle}</p>}
          </div>
          {children}
        </Card.Body>
      </Card>
    </div>
  );
}
