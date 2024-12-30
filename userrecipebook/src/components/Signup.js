import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import checkGuest from "./auth/checkGuest";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError("");
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      return "Name is required.";
    }
    if (!email.trim()) {
      return "E-mail is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (password !== confirmPassword) {
      return "Passwords don't match.";
    }
    return null; // No validation errors
  };

  const attemptSignup = (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    axios
      .post("http://localhost:4000/api/signup", formData)
      .then(() => {
        setError(""); // Clear any previous errors
        navigate("/login");
      })
      .catch((error) => {
        if (error.response) {
          const serverError = error.response.data.errors
            ? Object.values(error.response.data.errors).join("")
            : error.response.data.message || "An unexpected error occurred.";
          setError(serverError);
        } else if (error.request) {
          setError("Unable to reach the server. Please try again later.");
        } else {
          setError(`Error: ${error.message}`);
        }
      });
  };

  return (
    <>
      <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
        <Nav />
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h1 className="display-4 text-center text-light">Sign Up</h1>
          <form onSubmit={attemptSignup}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
              <label htmlFor="name">Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
              />
              <label htmlFor="email">E-mail</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            <button type="submit" className="btn btn-dark w-100">
              Sign Up
            </button>
            {error && (
              <div className="alert alert-danger mt-3 text-center p-2 rounded">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default checkGuest(Signup);
