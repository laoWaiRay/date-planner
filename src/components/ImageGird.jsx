import React, { useState, useEffect } from "react";
import styles from "../pages/Memories.module.css"

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
      <div className={`${styles.gallery}`}>
        {images.map((image, index) => {
          return (
            <div
              className={`${styles.pics}`}
              key={index}
              onClick={() => handleImageClick(image)}
            >
              <span
                className={`${styles.deleteIconContainer}`}
                onClick={(event) => handleDeleteClick(event, image.id)}
              >
                <DeleteIcon className={`${styles.deleteIcon}`} />
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
        show={showModal}
        size="xl"
        centered
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
          <div className={`${styles.polaroidPhoto}`}>
            <img
              src={selectedImage.image_url}
              alt="Clicked Image"
              style={{ width: "100%" }}
            />
            <div className={`${styles.polaroidCity}`}>{selectedImage.city}</div>

            <div className={`${styles.polaroidCaption}`}>{selectedImage.image_label}</div>
            <div className={`${styles.polaroidDate}`}>
              {formatDate(selectedImage.date)}
            </div>
            <div>
              <p className={`${styles.p}`}>{selectedImage.caption}</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageGrid;
