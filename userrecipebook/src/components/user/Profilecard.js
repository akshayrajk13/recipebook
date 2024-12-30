import React, { useState } from "react";
import userimage from "./images/User.svg";
import axios from "axios";
import { useSelector } from "react-redux";

function Profilecard({ loggedInUser, loggedInEmail }) {
  const user = useSelector((store) => store.auth.user);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError("");
    setSuccess("");
  };

  const validate = () => {
    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (currentPassword.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (newPassword.length < 8) {
      return "New password must be at least 8 characters long.";
    }
    if (newPassword !== confirmNewPassword) {
      return "Passwords don't match.";
    }
    return null; // No validation errors
  };

  const attemptPasswordReset = (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    console.log(formData);
    axios
      .patch("http://localhost:4000/api/resetpassword", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(() => {
        setError(""); // Clear any previous errors
        setSuccess("Password updated successfully");
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
    <div className="accordion mt-5 shadow rounded" id="accordionExample">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
          >
            Profile Section
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <div className="card text-center shadow rounded">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  <div
                    className="rounded-circle overflow-hidden"
                    style={{
                      width: "120px",
                      height: "120px",
                    }}
                  >
                    <img
                      src={userimage}
                      alt="Profile"
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
                <h5 className="card-title">Name: {loggedInUser}</h5>
                <p className="card-text">E-mail: {loggedInEmail}</p>
                <button
                  className="btn btn-outline-dark shadow rounded"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExample"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  Reset Password
                </button>
                <div className="collapse mt-3" id="collapseExample">
                  <form onSubmit={attemptPasswordReset}>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                      <label htmlFor="currentPassword">Current Password</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                      <label htmlFor="newPassword">New Password</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                      />
                      <label htmlFor="confirmNewPassword">
                        Confirm New Password
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-dark w-100"
                      disabled={
                        !formData.currentPassword ||
                        !formData.newPassword ||
                        !formData.confirmNewPassword
                      }
                    >
                      Reset
                    </button>
                    {error && (
                      <div className="alert alert-danger mt-3 text-center p-2 rounded">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="alert alert-success mt-3 text-center p-2 rounded">
                        {success}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profilecard;
