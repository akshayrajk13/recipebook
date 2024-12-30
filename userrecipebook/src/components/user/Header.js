import React from "react";

function Header({ headerText, headerSubText, headerPhoto }) {
  return (
    <div
      className="container position-relative text-white text-center shadow rounded py-5"
      style={{
        backgroundImage: `url(${headerPhoto})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div
        className="overlay position-absolute w-100 h-100"
        style={{
          top: 0,
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>
      {/* Content */}
      <div className="content position-relative" style={{ zIndex: 2 }}>
        <h1 className="display-4 header-text">{headerText}</h1>
        <p className="lead header-subtext">{headerSubText}</p>
      </div>
    </div>
  );
}

export default Header;
