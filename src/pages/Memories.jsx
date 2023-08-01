import React from "react";
import "./Memories.css";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import UploadMemory from "../components/UploadMemoryModal";
import ImageGrid from "../components/ImageGird";
import { useAuthContext } from "../hooks/useAuthContext";

function Memories() {
  const { user } = useAuthContext();
  const [modalShow, setModalShow] = useState(false);
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/memories/images?user_id=${user.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images.");
      }
      const data = await response.json();
      console.log(data);
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error.message);
    }
  };

  const handleDeleteImage = (deletedImageId) => {
    setImages((prevImages) =>
      prevImages.filter((image) => image.id !== deletedImageId)
    );
  };

  useEffect(() => {
    fetchImages();
  }, [user.id]);

  return (
    <>
      <div className="memories mb-3">
        <div className="title">
        <h1 className="text-center mt-12 mb-2 tracking-wider text-center font-light tracking-wider" 
            style= {{color: "#39798f"}}>
              MEMORIES THAT LAST
          </h1>
          <p className="text-gray-500" style={{ textAlign: "center"}}>Remember, Rejoice, Relive: Your Memorable Ignite Moments</p>
        </div>
        <Button
          variant="contained"
          onClick={() => setModalShow(true)}
          sx={{
            backgroundColor: "#39798f",
            color: "white",
            ":hover": { bgcolor: "#1d3d48" },
            margin: "0 auto",
            display: "block",
          }}
        >
          Add a Memory
        </Button>
        <UploadMemory
          show={modalShow}
          onHide={() => setModalShow(false)}
          fetchImages={fetchImages}
        />
      </div>

      <ImageGrid images={images} onDeleteImage={handleDeleteImage} />
    </>
  );
}

export default Memories;
