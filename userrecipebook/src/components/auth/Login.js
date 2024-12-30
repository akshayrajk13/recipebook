import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav";
import Footer from "../Footer";
import checkGuest from "./checkGuest";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
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
    const { email, password } = formData;

    // Check if email and password are provided
    if (!email || !password) {
      return "E-mail and password are required.";
    }

    // Email validation logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // Password length validation
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    return null; // No validation errors
  };

  const attemptLogin = (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Server-side validation
    axios
      .post("http://localhost:4000/api/login", formData)
      .then((response) => {
        setError(""); // Clear any previous errors
        const user = { token: response?.data?.token || "" };
        dispatch(setUser(user));
        navigate("/dashboard");
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
          <h1 className="display-4 text-center text-light mb-4">Login</h1>
          <form onSubmit={attemptLogin}>
            <div className="form-floating mb-3 shadow rounded">
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
            <div className="form-floating mb-3 shadow rounded">
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
            <button
              type="submit"
              className="btn btn-dark w-100 shadow rounded mb-3"
            >
              Log In
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

export default checkGuest(Login);
