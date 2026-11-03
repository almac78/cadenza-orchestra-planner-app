/* Reusable form for creating and editing a call (event).
Used by both the Add Call and Edit Call pages so the fields and validation display stay identical. */
import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { todayIsoDate } from "../utils/dates";

// Empty values used when adding a brand-new call.
const EMPTY_EVENT = {
  name: "",
  date: "",
  time: "",
  description: "",
  location: "",
};

/**
 * @param {object} props
 * @param {object} [props.initialValues] Existing event values (edit mode).
 * @param {(values: object) => {ok: boolean, errors?: object}} props.onSubmit Saves the values and reports validation errors.
 * @param {string} props.submitLabel Text for the submit button.
 * @param {() => void} props.onCancel Called when the user clicks Cancel.
 * @param {boolean} [props.allowPastDates] Lets the date picker show past dates (when editing a past call).
 */
export default function EventForm({
  initialValues = EMPTY_EVENT,
  onSubmit,
  submitLabel,
  onCancel,
  allowPastDates = false,
}) {
  // Form state, pre-filled with any existing values.
  const [form, setForm] = useState(() => ({
    ...EMPTY_EVENT,
    ...initialValues,
  }));
  // Field-level and form-level error messages.
  const [errors, setErrors] = useState({});

  // Update a single field and clear its error as the user types.
  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  // Send the form values to the parent page and show any validation errors.
  function handleSubmit(e) {
    e.preventDefault(); // Prevent full page reload.
    const result = onSubmit(form);
    if (!result.ok) setErrors(result.errors || {});
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}

      <Form.Group className="mb-3" controlId="event-name">
        <Form.Label>Engagement</Form.Label>
        <Form.Control
          name="name"
          value={form.name}
          onChange={updateField}
          isInvalid={Boolean(errors.name)}
          placeholder="e.g. Full rehearsal / Concert / Sectional"
          maxLength={80}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Form.Group as={Col} md={6} className="mb-3" controlId="event-date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={form.date}
            onChange={updateField}
            isInvalid={Boolean(errors.date)}
            min={allowPastDates ? undefined : todayIsoDate()}
          />
          <Form.Control.Feedback type="invalid">
            {errors.date}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={6} className="mb-3" controlId="event-time">
          <Form.Label>Call time</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={form.time}
            onChange={updateField}
            isInvalid={Boolean(errors.time)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.time}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="event-location">
        <Form.Label>Venue</Form.Label>
        <Form.Control
          name="location"
          value={form.location}
          onChange={updateField}
          isInvalid={Boolean(errors.location)}
          placeholder="e.g. Concert Hall / Studio 2 / Online"
          maxLength={100}
        />
        <Form.Control.Feedback type="invalid">
          {errors.location}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4" controlId="event-description">
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={form.description}
          onChange={updateField}
          isInvalid={Boolean(errors.description)}
          placeholder="e.g. Programme, dress code, run order, reminders"
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}
