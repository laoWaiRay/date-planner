import React, { useEffect } from "react";
import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useAuthContext } from "../hooks/useAuthContext";
import Chip from "@mui/material/Chip";

function UploadMemory(props) {
  const handleCancel = () => {
    props.onHide();
  };
  const [file, setFile] = useState(null);
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [acceptedinvitations, setacceptedInvitations] = useState([]);
  const [chipsData, setChipsData] = useState([]);

  const colors = ["blue"];
  const fetchAcceptedInvitations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/acceptedUserInvites?user_id=${user.id}`
      );
      const data = await response.json();
      const mappedInvitations = data.map((invitation) => {
        return {
          id: invitation.invitation_id,
          label: `${invitation.event_title} with ${invitation.other_people_username}`,
        };
      });
      setacceptedInvitations(data);
      setChipsData(mappedInvitations);
    } catch (error) {
      console.error("Error fetching accepted invitations:", error.message);
    }
  };
  useEffect(() => {
    fetchAcceptedInvitations();
  }, []);
  const types = ["image/png", "image/jpeg"];
  const changeHandler = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError(null);
    } else {
      setFile(null);
      setError("Please select an image file with type jpeg or png");
    }
  };

  const handleChipClick = (chipId) => {
    // Handle chip click event here
    console.log(`Chip with ID ${chipId} clicked!`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !caption || selectedChips.length === 0) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (file) {
      const reader = new FileReader();
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ overlay: { zIndex: 1000 } }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Share your Memory!</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control type="file" onChange={changeHandler} required />
          </Form.Group>
          {error && <div className="error">{error}</div>}
          {file && <div>{file.name}</div>}

          <Form.Group controlId="text" className="mb-3">
            <Form.Label>Caption</Form.Label>
            <Form.Control type="text" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select your date</Form.Label>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "5px",
              }}
            >
              {chipsData.map((chip) => (
                <Chip
                  key={chip.id}
                  label={chip.label}
                  onClick={() => handleChipClick(chip.id)}
                  sx={{
                    backgroundColor: "#39798f",
                    color: "white",
                    ":hover": { bgcolor: "#1d3d48" },
                    margin: "5px",
                  }}
                />
              ))}
            </div>
          </Form.Group>

          <div className="space-x-2">
            <Button type="submit" variant="primary">
              Confirm Changes
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UploadMemory;
