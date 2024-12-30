import React from "react";
import photo from "./images/Photo.jpg";

function Card() {
  return (
    <div
      className="card mt-5 shadow rounded border-0"
      style={{
        maxHeight: "400px",
        overflow: "hidden",
      }}
    >
      <img
        src={photo}
        className="card-img"
        alt="card"
        style={{
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div className="card-img-overlay">
        <h5 className="card-title">Inspired recipes for your kitchen table.</h5>
        <p className="card-text">
          Food should be exciting and meaningful. Something to look forward to
          with every bite. Let&apos;s get cooking and make something beautiful
          and absolutely delicious.
        </p>
      </div>
    </div>
  );
}

export default Card;
