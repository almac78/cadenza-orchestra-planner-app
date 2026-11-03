/* Allows users to edit an existing call (event) using the shared event form. */
import { Alert, Button, Card } from "react-bootstrap";
// Navigation hooks from React Router to read the URL parameter and redirect.
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import EventForm from "../components/EventForm";
import { isPastEvent } from "../utils/validators";

export default function EditEvent() {
  // Extract event ID from the URL, e.g. /edit/1234.
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, updateEvent } = useEvents();
  // Only returns the event if it belongs to the logged-in user.
  const existing = getEventById(id);

  // If the event does not exist, show a message with a way back.
  if (!existing) {
    return (
      <div className="cz-narrow">
        <Alert variant="warning">
          This call could not be found. It may have been deleted.
        </Alert>
        <Button as={Link} to="/dashboard" variant="primary">
          Back to dashboard
        </Button>
      </div>
    );
  }

  // Try to save the changes; go back to the dashboard if they were saved.
  function handleSubmit(values) {
    const result = updateEvent(id, values);
    if (result.ok) navigate("/dashboard");
    return result;
  }

  return (
    <div className="cz-narrow">
      <h2>Edit Call</h2>
      <p className="cz-muted mb-4">
        Changes are saved to your dashboard straight away.
      </p>

      <Card className="cz-card shadow-sm">
        <Card.Body className="p-4">
          <EventForm
            initialValues={existing}
            onSubmit={handleSubmit}
            submitLabel="Update Call"
            onCancel={() => navigate("/dashboard")}
            allowPastDates={isPastEvent(existing.date, existing.time)}
          />
        </Card.Body>
      </Card>
    </div>
  );
}
