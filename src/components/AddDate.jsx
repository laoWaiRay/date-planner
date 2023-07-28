import React from "react";
import "./AddDate.css";
// import CoupleImage from "../assets/home_screen.jpg";
import DateForm from "./DateForm";
import Button from "react-bootstrap/Button";
import { useState } from "react";

export default function AddDate() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div className="container-fluid styleScoped row">
        {/* <div className="row"> */}
          <div className="col-md-8 image-container">
            {/* <img src={CoupleImage} className="image" alt="Couple" /> */}
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
                />
              </div>
              <div className="subheading">
                Where Memories Begin! Start Adding Dates Today!
              </div>
            </div>
          </div>
        {/* </div> */}
      </div>
    </>
  );
}
