import React from "react";
import "./HomeScreen.css";
import CoupleImage from "../assets/home_screen.jpg";
import DateForm from "./DateForm";
import Button from "react-bootstrap/Button";
import { useState } from "react";

export default function HomeScreen() {
  const [modalShow, setModalShow] = useState(false);

  const postData = async (body) => {
    await fetch("http://localhost:8000/mydates", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9 image-container">
            <img src={CoupleImage} className="image" alt="Couple" />
          </div>
          <div className="col-md-3">
            <div className="card-container">
              <div className="tagline-button-container">
                <div className="button-container">
                  <Button
                    variant="primary button-container"
                    onClick={() => setModalShow(true)}
                  >
                    Add Date
                  </Button>
                </div>
                <DateForm
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  postData={postData}
                />
              </div>
              <div className="subheading">
                Where Memories Begin! Start Adding Dates Today!
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
