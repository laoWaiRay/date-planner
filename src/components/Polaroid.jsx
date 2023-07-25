import React from "react";
import "./Polaroid.css";

const Polaroid = (props) => {
  return (
    <div className="polaroid-photo">
      <img src={props.imageSrc} alt="Polaroid" />
      <div className="polaroid-caption">{props.caption}</div>
    </div>
  );
};

export default Polaroid;
