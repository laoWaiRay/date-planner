import React from "react";
import styles from "./Memories.module.css";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import UploadMemory from "../components/UploadMemoryModal";
import ImageGrid from "../components/ImageGrid";
import { useAuthContext } from "../hooks/useAuthContext";
import MemoryVideo from "../assets/couple-memories.mp4";
function Memories() {
  const { user } = useAuthContext();
  const [modalShow, setModalShow] = useState(false);
  const [images, setImages] = useState([]);
  const [acceptedInvitationsLength, setAcceptedInvitationsLength] =
    useState(null);

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

  const fetchAcceptedInvitations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/acceptedUserInvites?user_id=${user.id}`
      );
      const data = await response.json();
      setAcceptedInvitationsLength(data.length);
    } catch (error) {
      console.error("Error fetching accepted invitations:", error.message);
    }
  };

  const handleDeleteImage = (deletedImageId) => {
    setImages((prevImages) =>
      prevImages.filter((image) => image.id !== deletedImageId)
    );
  };

  useEffect(() => {
    fetchImages();
    fetchAcceptedInvitations();
  }, [user.id]);

  return (
    <>
      <div className="memories mb-3">
        <div className="title">
          <h1
            className="text-center mt-12 mb-2 tracking-wider text-center font-light tracking-wider"
            style={{ color: "#39798f" }}
          >
            MEMORIES THAT LAST
          </h1>
          <p className="text-gray-500" style={{ textAlign: "center" }}>
            Remember, Rejoice, Relive: Your Memorable Ignite Moments
          </p>
        </div>
        {acceptedInvitationsLength !== 0 && (
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
        )}

        {acceptedInvitationsLength === 0 && (
          <div style={{ textAlign: "center", marginTop: "3%" }}>
            <p className="text-gray-500 ">
              Your memories album looks lonely. Time to add some wonderful
              moments! Plan an Ignite moment and start uploading cherished
              memories to fill your album with joy.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <video
                className=""
                autoPlay
                loop
                muted
                style={{ height: "60vh" }}
              >
                <source src={MemoryVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        )}

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
