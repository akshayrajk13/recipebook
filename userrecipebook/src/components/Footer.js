import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="navbar fixed-bottom bg-body-tertiary border-0"
      data-bs-theme="dark"
    >
      <div className="container">
        <NavLink className="navbar-brand" to={"/"}>
          &copy; Recipe Book
        </NavLink>
      </div>
    </footer>
  );
}

export default Footer;
