import React from "react";
import "./AddDate.css";
// import CoupleImage from "../assets/home_screen.jpg";
import DateForm from "./DateForm";
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function AddDate({ noDates }) {
  const [modalShow, setModalShow] = useState(false);

  const postData = async (body) => {
    const response = await fetch("http://localhost:8000/mydates", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  return (
    <>
      <div className="container-fluid styleScoped row">
        {/* <div className="row"> */}
          <div className="col-md-8 image-container">
            {/* <img src={CoupleImage} className="image" alt="Couple" /> */}
          </div>
          <div className="col-md-4">
            <div className="card-container-date">
              <div className="subheading">
                {noDates === true ? (
                  <>
                  <Typography variant="h6" >
                    You don't have any saved date ideas yet
                  </Typography>
                  <Typography variant="subtitle1" className="mb-4" >
                    Start adding some date ideas today!
                  </Typography>
                  </>
                ): (
                  <>
                    <Typography variant="h6" >
                      Where memories begin... 
                    </Typography>
                    <Typography variant="h6" className="mb-4" >
                    Start adding some date ideas today!
                    </Typography>
                  </>
                )}
              </div>

              <div className="tagline-button-container">
                <div className="button-container">
                  <Button
                    variant="contained"
                    onClick={() => setModalShow(true)}
                    size="large"
                    sx={{backgroundColor: "#39798f", color:"white", ':hover': {bgcolor: '#1d3d48'}}}
                  >
                    Add Date
                  </Button>
                </div>
                <DateForm
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  postData={postData}
                  redirect={"/mydates"}
                />
              </div>
              
            </div>
          </div>
        {/* </div> */}
      </div>
    </>
  );
}
