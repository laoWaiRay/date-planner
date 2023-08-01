import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";

function ImageGrid({ images }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const handleImageClick = (imgSource) => {
    setSelectedImage(imgSource);
    setShowModal(true);
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
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="custom-modal"
        style={{
          "--bs-modal-padding": "0px",
          "--bs-modal-bg": "transparent",
          marginLeft: "-10%",
        }}
      >
        <Modal.Body>
          <div className="polaroid-photo">
            <img
              src={selectedImage.image_url}
              alt="Clicked Image"
              style={{ width: "100%" }}
            />
            <div className="polaroid-caption">{selectedImage.image_label}</div>
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
