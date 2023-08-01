import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Modal from "react-bootstrap/Modal";

function ImageGrid() {
  const [images, setImages] = useState([]);
  const { user } = useAuthContext();

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/memories/images?user_id=${user.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images.");
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [user.id]);

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
              onClick={() => handleImageClick(image.image_url)}
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
      >
        <Modal.Body>
          <img
            src={selectedImage}
            alt="Clicked Image"
            style={{ width: "100%" }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageGrid;
