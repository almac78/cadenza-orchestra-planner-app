/* Component that displays event details in a card format with options to edit or delete the event. */
import { useState } from "react";
import { Badge, Button, Card, Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  formatLongDate,
  formatRelativeDay,
  getDateBadgeParts,
} from "../utils/dates";

export default function EventCard({ event, onDelete, isPast = false }) {
  const { day, month, weekday } = getDateBadgeParts(event.date);
  // Whether the notes are open on small screens (they are always shown on larger screens).
  const [showNotes, setShowNotes] = useState(false);
  const notesId = `notes-${event.id}`;

  return (
    <Card className={`cz-card cz-event mb-3 ${isPast ? "cz-event-past" : ""}`}>
      <Card.Body className="d-flex gap-3">
        {/* Calendar-style date badge */}
        <div className="cz-date-badge" aria-hidden="true">
          <span className="cz-date-weekday">{weekday}</span>
          <span className="cz-date-day">{day}</span>
          <span className="cz-date-month">{month}</span>
        </div>

        <div className="flex-grow-1 min-w-0">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <Card.Title as="h3" className="cz-event-title mb-0">
              {event.name}
            </Card.Title>
            {!isPast && (
              <Badge bg="" className="cz-badge-relative">
                {formatRelativeDay(event.date)}
              </Badge>
            )}
          </div>

          <div className="cz-event-meta mb-2">
            <span>
              <span className="visually-hidden">Date: </span>
              {formatLongDate(event.date)} · {event.time}
            </span>
            <span>
              <span aria-hidden="true">📍 </span>
              <span className="visually-hidden">Venue: </span>
              {event.location}
            </span>
          </div>

          {/* Notes: always visible on tablets and computers (md and up) */}
          <Card.Text className="cz-event-notes d-none d-md-block">
            {event.description}
          </Card.Text>

          {/* Notes on phones: hidden behind a button to keep the list compact */}
          <div className="d-md-none mb-3">
            <Button
              variant="link"
              size="sm"
              className="cz-notes-toggle p-0"
              onClick={() => setShowNotes((prev) => !prev)}
              aria-expanded={showNotes}
              aria-controls={notesId}
            >
              <span aria-hidden="true">💬 </span>
              {showNotes ? "Hide notes" : "Show notes"}
            </Button>
            <Collapse in={showNotes}>
              <div id={notesId}>
                <p className="cz-event-notes pt-2 mb-0">{event.description}</p>
              </div>
            </Collapse>
          </div>

          <div className="d-flex gap-2">
            <Button
              as={Link}
              to={`/edit/${event.id}`}
              variant="outline-primary"
              size="sm"
              aria-label={`Edit ${event.name}`}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(event)}
              aria-label={`Delete ${event.name}`}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
