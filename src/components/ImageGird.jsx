import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
function ImageGrid({ images, onDeleteImage }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const handleImageClick = (imgSource) => {
    setSelectedImage(imgSource);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const handleDeleteClick = async (event, imageID) => {
    event.stopPropagation();
    try {
      const requestOptions = {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `http://localhost:8000/memories/images/${imageID}`,
        requestOptions
      );

      if (response.ok) {
        onDeleteImage(imageID);
      } else {
        console.error("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error.message);
    }
  };

  return (
    <>
      <div className="gallery">
        {images.map((image, index) => {
          return (
            <div
              className="pics"
              key={index}
              onClick={() => handleImageClick(image)}
            >
              <span
                className="delete-icon-container"
                onClick={(event) => handleDeleteClick(event, image.id)}
              >
                <DeleteIcon className="delete-icon" />
              </span>
              <img
                src={image.image_url}
                alt={image.caption}
                style={{ width: "100%" }}
              />
            </div>
          );
        })}
      </div>
      <Modal
        size="xl"
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="custom-modal"
        style={{
          "--bs-modal-padding": "0px",
          "--bs-modal-bg": "transparent",
          "width":"100%"
          // marginLeft: "auto",
        }}
      >
        <Modal.Body>
          <div className="polaroid-photo">
            <img
              src={selectedImage.image_url}
              alt="Clicked Image"
              style={{ width: "100%" }}
            />
            <div className="polaroid-city">{selectedImage.city}</div>

            <div className="polaroid-caption">{selectedImage.image_label}</div>
            <div className="polaroid-date">
              {formatDate(selectedImage.date)}
            </div>
            <div>
              <p>{selectedImage.caption}</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageGrid;
