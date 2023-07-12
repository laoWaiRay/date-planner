import React from "react";
import "./HomeScreen.css";
import CoupleImage from "../assets/home_screen.png";
import DateForm from "./DateForm";
import Button from "react-bootstrap/Button";
import { useState } from "react";

export default function CenteredImage() {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <div className="w-full min-h-screen flex">
        <div>
          <img src={CoupleImage} className="image-container" />
        </div>

        <main
          className="w-full min-h-screen ml-auto px-12 py-6 flex flex-shrink-0 flex-col 
      justify-center sm:w-[28rem] items-center"
        >
            <div className="font-display text-blue-500 font-bold text-2xl text-center">
              Your Date Planner: Where Memories Begin! Start Adding Dates Today!
            </div>
          <div className="button-container">
            <Button variant="primary" onClick={() => setModalShow(true)}>
              Add Date
            </Button>
          </div>
          <DateForm show={modalShow} onHide={() => setModalShow(false)} />
        </main>
      </div>
    </>
  );
}
