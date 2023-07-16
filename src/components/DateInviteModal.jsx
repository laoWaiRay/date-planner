import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function CreateDateInviteModal({ onClose }) {
  const [username, setUsername] = useState('');
  const [datetime, setDatetime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Username:', username);
    console.log('Date and Time:', datetime);
    onClose(); // Close the modal after form submission
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Date Invite</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date and Time:</Form.Label>
            <Form.Control
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary">Send Invite</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateDateInviteModal;
