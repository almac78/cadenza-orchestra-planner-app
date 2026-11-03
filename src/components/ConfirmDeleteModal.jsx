/* Confirmation dialog shown before a call is permanently deleted. */
import { Button, Modal } from "react-bootstrap";

export default function ConfirmDeleteModal({ event, onConfirm, onCancel }) {
  return (
    <Modal show={Boolean(event)} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete call?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <strong>{event?.name}</strong> will be removed from your schedule. This
        cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel}>
          Keep it
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}