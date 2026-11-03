/* Page to add a new call (event) using the shared event form. */
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import EventForm from "../components/EventForm";

export default function AddEvent() {
  // Access addEvent function from events context.
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  // Try to add the event; go back to the dashboard if it was saved.
  function handleSubmit(values) {
    const result = addEvent(values);
    if (result.ok) navigate("/dashboard");
    return result;
  }

  return (
    <div className="cz-narrow">
      <h2>Add Call</h2>
      <p className="cz-muted mb-4">
        Schedule a rehearsal, concert, sectional or meeting. All fields are
        required.
      </p>

      <Card className="cz-card shadow-sm">
        <Card.Body className="p-4">
          <EventForm
            onSubmit={handleSubmit}
            submitLabel="Save Call"
            onCancel={() => navigate("/dashboard")}
          />
        </Card.Body>
      </Card>
    </div>
  );
}
