/* Main page after login: shows the user's upcoming calls grouped by month, with past calls tucked away below. */
import { useState } from "react";
import { Button, Card, Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
// Current user from authentication context and events from events context.
import { useAuth } from "../hooks/useAuth";
import { useEvents } from "../hooks/useEvents";
// Components to display events and confirm deletion.
import EventCard from "../components/EventCard";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { formatLongDate, formatRelativeDay, groupEventsByMonth } from "../utils/dates";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { upcomingEvents, pastEvents, deleteEvent } = useEvents();
  // The event waiting for delete confirmation (null when the dialog is closed).
  const [eventToDelete, setEventToDelete] = useState(null);
  // Whether the past calls section is expanded.
  const [showPast, setShowPast] = useState(false);

  const nextEvent = upcomingEvents[0];
  const firstName = currentUser?.name?.split(" ")[0];

  // Delete the selected event once the user confirms.
  function handleConfirmDelete() {
    deleteEvent(eventToDelete.id);
    setEventToDelete(null);
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="cz-eyebrow mb-1">Welcome back, {firstName}</p>
          <h2 className="mb-0">Your schedule</h2>
        </div>
        <Button as={Link} to="/add" variant="primary">
          + Add Call
        </Button>
      </div>

      {/* Summary strip */}
      <div className="cz-summary mb-4">
        <Card className="cz-card">
          <Card.Body>
            <div className="cz-summary-label">Upcoming calls</div>
            <div className="cz-summary-value">{upcomingEvents.length}</div>
          </Card.Body>
        </Card>
        <Card className="cz-card cz-summary-next">
          <Card.Body>
            <div className="cz-summary-label">Next call</div>
            {nextEvent ? (
              <>
                <div className="cz-summary-value cz-summary-value-sm">
                  {nextEvent.name}
                </div>
                <div className="cz-muted small">
                  {formatRelativeDay(nextEvent.date)} ·{" "}
                  {formatLongDate(nextEvent.date)} at {nextEvent.time}
                </div>
              </>
            ) : (
              <div className="cz-muted">Nothing scheduled</div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Upcoming calls, grouped by month */}
      {upcomingEvents.length === 0 ? (
        <Card className="cz-card cz-empty text-center mb-4">
          <Card.Body className="py-5">
            <h3 className="h5">No upcoming calls</h3>
            <p className="cz-muted mb-3">
              Schedule your next rehearsal, concert or meeting to see it here.
            </p>
            <Button as={Link} to="/add" variant="primary">
              Add your first call
            </Button>
          </Card.Body>
        </Card>
      ) : (
        groupEventsByMonth(upcomingEvents).map((group) => (
          <section key={group.heading} className="mb-4">
            <h3 className="cz-month-heading">{group.heading}</h3>
            {group.events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={setEventToDelete}
              />
            ))}
          </section>
        ))
      )}

      {/* Past calls, hidden by default */}
      {pastEvents.length > 0 && (
        <section className="mt-5">
          <Button
            variant="link"
            className="cz-past-toggle p-0"
            onClick={() => setShowPast((prev) => !prev)}
            aria-expanded={showPast}
            aria-controls="past-calls"
          >
            {showPast ? "Hide" : "Show"} past calls ({pastEvents.length})
          </Button>
          <Collapse in={showPast}>
            <div id="past-calls" className="pt-3">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDelete={setEventToDelete}
                  isPast
                />
              ))}
            </div>
          </Collapse>
        </section>
      )}

      <ConfirmDeleteModal
        event={eventToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </>
  );
}