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
  const [chipsData, setChipsData] = useState([]);
  const [selectedChipId, setSelectedChipId] = useState(null);
  const [imageDataURL, setImageDataURL] = useState(null);
  const [formData, setFormData] = useState({
    caption: "",
  });

  const { caption } = formData;
  const handleCaptionChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, caption: value });
  };
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
      const reader = new FileReader();
      reader.readAsDataURL(selected);
      reader.onload = () => {
        setImageDataURL(reader.result);
      };
    } else {
      setFile(null);
      setError("Please select an image file with type jpeg or png");
    }
  };

  const handleChipClick = (chipId) => {
    setSelectedChipId((prevId) => (prevId === chipId ? null : chipId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageDataURL || !formData.caption || selectedChipId === null) {
      setError(
        "Please fill in all the fields and don't forget to select a date"
      );
      return;
    }

    const chip_object = chipsData.find((i) => i.id === selectedChipId);

    try {
      const imageLabel = chip_object.label;

      const body = {
        user_id: user.id,
        image_url: imageDataURL,
        caption: caption,
        image_label: imageLabel,
      };

      const requestOptions = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(
        "http://localhost:8000/memories/images",
        requestOptions
      );

      if (!response.ok) {
        setError("Failed to upload image. Please try again later.");
        return;
      }
      console.log("Image uploaded successfully!");
      props.onHide();
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setError("Failed to upload image. Please try again later.");
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
            <Form.Control
              type="text"
              value={caption}
              onChange={handleCaptionChange}
              required
            />
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
                    backgroundColor:
                      selectedChipId === chip.id ? "white" : "#39798f",
                    color: selectedChipId === chip.id ? "#39798f" : "white",
                    border: `2px solid ${
                      selectedChipId === chip.id ? "#39798f" : "white"
                    }`,
                    ":hover": {
                      backgroundColor:
                        selectedChipId === chip.id ? "white" : "#1d3d48",
                      color: selectedChipId === chip.id ? "#1d3d48" : "white",
                    },
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
