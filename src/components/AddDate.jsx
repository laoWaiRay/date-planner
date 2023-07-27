import React from "react";
import "./AddDate.css";
import CoupleImage from "../assets/home_screen.jpg";
import DateForm from "./DateForm";
import Button from "react-bootstrap/Button";
import { useState } from "react";

export default function AddDate({ retrieveDates, retrieveFavorites }) {
  const [modalShow, setModalShow] = useState(false);

  const postData = async (body) => {
    const response = await fetch("http://localhost:8000/mydates", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      retrieveDates();
      retrieveFavorites();
    }
  };

  return (
    <>
      <div className="container-fluid styleScoped">
        <div className="row">
          <div className="col-md-8 image-container">
            <img src={CoupleImage} className="image" alt="Couple" />
          </div>
          <div className="col-md-4">
            <div className="card-container-date">
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
