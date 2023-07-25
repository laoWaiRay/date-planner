import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useAuthContext } from "../hooks/useAuthContext";
import resizeImage from "../helpers/resizeImage";
import { 
  refreshSession,
  setAvatar as setAvatarDB, 
  setCoverPhoto as setCoverPhotoDB 
} from "../api/internal/postgres";

export default function AvatarUploadModal({onClose, userId}) {
  const [avatar, setAvatar] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const { user, dispatch } = useAuthContext();

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file.type == "image/jpeg" || file.type == "image/png") {
      const reader = new FileReader();

      const handleLoadEvent = async () => {
        const resizedImg = await resizeImage(reader.result, 512);
        setAvatar(resizedImg);
        reader.removeEventListener("loadend", handleLoadEvent);
      }
      
      reader.addEventListener("loadend", handleLoadEvent);
      reader.readAsDataURL(file);
    }
  }

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file.type == "image/jpeg" || file.type == "image/png") {
      const reader = new FileReader();

      const handleLoadEvent = async () => {
        const resizedImg = await resizeImage(reader.result, 1280);
        setCoverPhoto(resizedImg);
        reader.removeEventListener("loadend", handleLoadEvent);
      }
      
      reader.addEventListener("loadend", handleLoadEvent);
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userId && avatar)
      await setAvatarDB(userId, avatar);
    if (userId && coverPhoto)
      await setCoverPhotoDB(userId, coverPhoto);
    
    // Update session data on server and auth context to include new
    // avatar/cover photo data
    if (avatar || coverPhoto) {
      async function getSessionDetails() {
        const session = await refreshSession();
        if (session.error) {
          dispatch({ type: "LOGOUT" });
        } else {
          dispatch({ type: "LOGIN", payload: session });
        }
      }
      getSessionDetails();
    }

    console.log("Success!")
    onClose();
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Images</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>User Avatar</Form.Label>
            <Form.Control type="file" onChange={handleAvatarUpload} />
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Cover Photo</Form.Label>
            <Form.Control type="file" onChange={handleCoverPhotoUpload}/>
          </Form.Group>

          <div className="space-x-2">
            <Button type="submit" variant="primary">Confirm Changes</Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}


