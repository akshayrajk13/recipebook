import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { removeUser } from "../store/authSlice";

function Nav() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  useEffect(() => {
    setActiveLink(location.hash);
  }, [location]);
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function logout() {
    if (user) {
      dispatch(removeUser());
      navigate("/login");
    }
  }
  return (
    <nav
      id="navbar"
      className="navbar fixed-top navbar-expand-lg bg-body-tertiary"
      data-bs-theme="dark"
    >
      <div className="container">
        <a className="navbar-brand" href="/">
          Recipe Book
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <HashLink
                to="/#home"
                className={`nav-link ${activeLink === "#home" ? "active" : ""}`}
              >
                Home
              </HashLink>
            </li>
            <li className="nav-item">
              <HashLink
                smooth
                to={"/#about"}
                className={`nav-link ${
                  activeLink === "#about" ? "active" : ""
                }`}
              >
                About
              </HashLink>
            </li>
            <li className="nav-item">
              <HashLink
                smooth
                to={"/#contact"}
                className={`nav-link ${
                  activeLink === "#contact" ? "active" : ""
                }`}
              >
                Contact
              </HashLink>
            </li>
          </ul>
          <ul className="navbar-nav d-flex">
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink to={"/dashboard"} className="nav-link">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={"/addrecipe"} className="nav-link">
                    Add Recipe
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={"/profile"} className="nav-link">
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <span className="nav-link" onClick={logout}>
                    Log Out
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to={"/login"} className="nav-link">
                    Log In
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={"/signup"} className="nav-link">
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
