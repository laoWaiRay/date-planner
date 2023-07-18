import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { getUserByUsername } from '../api/internal/postgres'
import { Alert } from 'react-bootstrap';

function CreateDateInviteModal({ onClose }) {
  const [username, setUsername] = useState('');
  const [datetime, setDatetime] = useState('');
  const [userError, setUserError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invitedUser = await getUserByUsername(username);

    //if the user doesn't exist
    if(Object.hasOwn(invitedUser, "error")){
      setUserError(true);
      //let user try again
    } else{
      //console.log('Date and Time:', datetime);
      console.log(invitedUser);
      onClose(); // Close the modal after form submission
    }
  
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
              onChange={(e) => {setUsername(e.target.value);}}
              required
            />
            {userError ?      
            (<p className='text-red-500'>
              Username doesn't exist
            </p>)
              : null}
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
