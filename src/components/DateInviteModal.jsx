import { Pending } from '@mui/icons-material';
import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { getUserByUsername } from '../api/internal/postgres'
import { createInvitation } from '../api/internal/postgres'
import { useAuthContext } from '../hooks/useAuthContext';
import Button from '@mui/material/Button';

function CreateDateInviteModal({ onClose, eventID }) {
  const [username, setUsername] = useState('');
  const [datetime, setDatetime] = useState('');
  const [userError, setUserError] = useState(false);
  const currentUser = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invitedUser = await getUserByUsername(username);

    //if the user doesn't exist
    if(Object.hasOwn(invitedUser, "error")){
      setUserError(true);
      //let user try again
    } else{
      const currentUserID = currentUser.user.id;
      const invitedUserID = invitedUser.id;
      const splitDate = datetime.split("T");
      const date = splitDate[0];
      const time = splitDate[1];
      const status = "pending";
      //createInvitation
      createInvitation(currentUserID, invitedUserID, eventID, status, date, time );
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
          <Button className="mt-4" type="submit" variant="contained" sx={{backgroundColor: "#39798f", ':hover': {bgcolor: '#1d3d48'}}}>Send Invite</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateDateInviteModal;
