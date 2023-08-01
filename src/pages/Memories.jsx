import React from "react";
import "./Memories.css";
import Button from "@mui/material/Button";
import { useState } from "react";
import UploadMemory from "../components/UploadMemoryModal";
import ImageGrid from "../components/ImageGird";

function Memories() {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <div className="memories mb-3">
        <div className="title">
          <h2>Memories that Last</h2>
          <p>Remember, Rejoice, Relive: Your Memorable Ignite Moments</p>
        </div>
        <Button
          variant="contained"
          onClick={() => setModalShow(true)}
          sx={{
            backgroundColor: "#39798f",
            color: "white",
            ":hover": { bgcolor: "#1d3d48" },
          }}
        >
          Add a Memory
        </Button>
        <UploadMemory show={modalShow} onHide={() => setModalShow(false)} />
      </div>
      <ImageGrid />
    </>
  );
}

export default Memories;
