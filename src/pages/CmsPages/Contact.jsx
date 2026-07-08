import React, { useState } from "react";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import {
  FaEnvelope,
  FaUser,
  FaPaperPlane,
  FaCheck,
  FaGithub,
  FaTwitter,
  FaBell,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";
import "./style.scss";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 3000);
    }
  };

  return (
    <div className="cmsPage contactPage">
      <div className="contactBgGlow" />
      <ContentWrapper>
        <div className="pageHeader">
          <div className="headerBadge">
            <span className="badgePulse" />
            Let's Talk Cinema
          </div>
          <h1>
            Get In{" "}
            <span className="gradientText">Touch</span>
          </h1>
          <p className="subtitle">
            Have a question, a movie recommendation, or just want to say hello?
            We're all ears — and we love talking movies.
          </p>
        </div>

        <div className="contactGrid">
          <div className="contactFormWrapper">
            {submitted ? (
              <div className="successMessage">
                <div className="successIcon">
                  <FaCheck />
                </div>
                <h3>Message Sent!</h3>
                <p>
                  Thanks for reaching out. We'll get back to you as soon as
                  possible — usually within 24 hours.
                </p>
                <div className="successRings">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : (
              <form className="contactForm" onSubmit={handleSubmit}>
                <div className="formHeader">
                  <h3>Send Us a Message</h3>
                  <p>Fill out the form below and we'll get back to you.</p>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <div className="inputWrapper">
                      <FaUser className="inputIcon" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder=" "
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="name">Your Name</label>
                      <span className="inputFocus" />
                    </div>
                  </div>
                  <div className="formGroup">
                    <div className="inputWrapper">
                      <FaEnvelope className="inputIcon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder=" "
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="email">Email Address</label>
                      <span className="inputFocus" />
                    </div>
                  </div>
                </div>

                <div className="formGroup">
                  <div className="inputWrapper">
                    <FaTag className="inputIcon" />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder=" "
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="subject">Subject</label>
                    <span className="inputFocus" />
                  </div>
                </div>

                <div className="formGroup">
                  <div className="inputWrapper textareaWrapper">
                    <textarea
                      id="message"
                      name="message"
                      placeholder=" "
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="message">Your Message</label>
                    <span className="inputFocus" />
                  </div>
                </div>

                <button type="submit" className="submitBtn">
                  <span className="btnContent">
                    <FaPaperPlane className="btnIcon" />
                    Send Message
                  </span>
                  <span className="btnGlow" />
                </button>
              </form>
            )}
          </div>

          <div className="contactSidebar">
            <div className="sidebarCard">
              <div className="sidebarCardHeader">
                <span className="cardIcon">
                  <FaMapMarkerAlt />
                </span>
                <h3>Reach Out</h3>
              </div>
              <div className="contactMethods">
                <a
                  href="mailto:hello@movix.app"
                  className="contactMethod"
                >
                  <span className="methodIconBg">
                    <FaEnvelope className="methodIcon" />
                  </span>
                  <div>
                    <span className="methodLabel">Email</span>
                    <span className="methodValue">hello@movix.app</span>
                  </div>
                </a>
                <a
                  href="https://github.com/devhimanshuu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contactMethod"
                >
                  <span className="methodIconBg">
                    <FaGithub className="methodIcon" />
                  </span>
                  <div>
                    <span className="methodLabel">GitHub</span>
                    <span className="methodValue">devhimanshuu</span>
                  </div>
                </a>
                <a
                  href="https://twitter.com/devhimanshuu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contactMethod"
                >
                  <span className="methodIconBg">
                    <FaTwitter className="methodIcon" />
                  </span>
                  <div>
                    <span className="methodLabel">Twitter</span>
                    <span className="methodValue">@devhimanshuu</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="sidebarCard newsletterCard">
              <div className="sidebarCardHeader">
                <span className="cardIcon">
                  <FaBell />
                </span>
                <h3>Stay in the Loop</h3>
              </div>
              <p className="newsletterCardDesc">
                Get weekly movie recommendations, industry insights, and Movix
                updates delivered straight to your inbox.
              </p>
              {newsletterSubscribed ? (
                <div className="newsletterCardSuccess">
                  <FaCheck />
                  <span>You're subscribed!</span>
                </div>
              ) : (
                <form
                  className="newsletterCardForm"
                  onSubmit={handleNewsletterSubmit}
                >
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button type="submit">Subscribe</button>
                </form>
              )}
            </div>

            <div className="sidebarCard faqCard">
              <div className="sidebarCardHeader">
                <span className="cardIcon questionIcon">?</span>
                <h3>Quick Help</h3>
              </div>
              <p>
                Looking for answers? Check out our{" "}
                <a href="/faq">FAQ page</a> for common questions about Movix.
              </p>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Contact;
