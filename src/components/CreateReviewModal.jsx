import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useAuthContext } from "../hooks/useAuthContext";
import { Typography, Rating } from "@mui/material";
import { addReview } from "../api/internal/postgres";

export default function CreateReviewModal({onClose, eventId}) {
  const [comment, setComment] = useState("");
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || !score) {
      setError("Please fill in the missing fields");
      return;
    }

    setError("");
    await addReview(eventId, user.id, comment, score);
    onClose();
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>New Review</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error &&
          <div className="text-red-400">{error}</div>
        }
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-3">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => {setComment(e.target.value);}}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Typography component="legend">Score</Typography>
            <Rating name="score" value={score} size="large" onChange={(e, newVal)=>{setScore(newVal)}} />
          </Form.Group>

          <Button type="submit" variant="primary">Submit Review</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
