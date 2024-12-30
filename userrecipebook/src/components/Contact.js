import React from "react";

function Contact() {
  return (
    <>
      <h1 className="display-1 text-light pt-5 mb-5" id="contact">
        Contact
      </h1>
      <form className="mb-5">
        <div className="input-group mb-3 shadow rounded border-0">
          <span
            className="input-group-text bg-warning border-0"
            id="basic-addon1"
          >
            @
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="E-mail"
            aria-label="E-mail"
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="input-group mb-3 shadow rounded border-0">
          <span className="input-group-text bg-warning border-0">Name</span>
          <input
            type="text"
            className="form-control"
            placeholder="Your Name"
            aria-label="Your Name"
            aria-describedby="basic-addon2"
          />
        </div>
        <div className="input-group mb-3 shadow rounded border-0">
          <span className="input-group-text bg-warning border-0">Message</span>
          <textarea
            className="form-control"
            aria-label="With textarea"
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-dark w-100 shadow rounded border-0"
        >
          Send
        </button>
      </form>
    </>
  );
}

export default Contact;
