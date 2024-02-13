import React, { useState } from "react";
import "./Form.css";
import "./mix.css";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mbjnoggy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitted(true);
      setEmail("");
      setMessage("");
    } catch (error) {
      setErrors([{ field: "form", message: error.message }]);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    alert("Your response is submitted");
  }

  return (
    <section>
    <div className="form_data">
    <div className="form_heading">
            <h1>Connect With Us</h1>
            <p>Hi, We appreciate your feedback.</p>
          </div>
      <form onSubmit={handleFormSubmit}>
        <div className="form_input">
        <label htmlFor="email">Email</label>

          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <br /> <br />
        <div className="contact-input">
        <label htmlFor="msg">Message / Feedback</label>

          <textarea
            rows={4}
            id="message"
            name="message"
            placeholder="Enter Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
        {errors.map((error, index) => (
          <p key={index}>{error.message}</p>
        ))}
        <div className="contact-btn">
        <button type="Send" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>

        </div>
        
      </form>
    </div>
    </section>
  );
};

export default ContactForm;
