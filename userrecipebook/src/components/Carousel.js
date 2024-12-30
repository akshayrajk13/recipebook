import React from "react";
import carousel1 from "./images/Carousel 1.jpg";
import carousel2 from "./images/Carousel 2.jpg";
import carousel3 from "./images/Carousel 3.jpg";

function Carousel() {
  return (
    <div
      id="carousel"
      className="carousel slide shadow rounded border-0"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src={carousel1}
            className="d-block w-100 carousel-image"
            alt="Carousel 1"
          />
        </div>
        <div className="carousel-item">
          <img
            src={carousel2}
            className="d-block w-100 carousel-image"
            alt="Carousel 2"
          />
        </div>
        <div className="carousel-item">
          <img
            src={carousel3}
            className="d-block w-100 carousel-image"
            alt="Carousel 3"
          />
        </div>
      </div>
      {/* Caption */}
      <div className="carousel-caption">Welcome to Recipe Book!</div>
      {/* Navigation Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carousel"
        data-bs-slide="prev"
      >
        <i className="bi bi-arrow-left-circle-fill fs-2 text-white"></i>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carousel"
        data-bs-slide="next"
      >
        <i className="bi bi-arrow-right-circle-fill fs-2 text-white"></i>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;
