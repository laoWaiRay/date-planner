import { Modal, Form, Button } from "react-bootstrap";
import { useAuthContext } from "../hooks/useAuthContext";
import { deleteEvent } from "../api/internal/postgres";
import { useNavigate } from "react-router-dom";

export default function DeleteWarningModal({onClose, eventId, event_username}) {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, user.username, event_username)
    if (!user || user.username != event_username) return;
    deleteEvent(eventId);
    navigate(-1);
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Deleting Post</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <h2 className="text-lg">Do you want to delete this event permanently?</h2>
          <p>This action cannot be undone.</p>
          <div className="space-x-2">
            <Button type="submit" variant="danger">Delete</Button>
            <Button type="button" variant="secondary">Cancel</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
