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
  FaCommentAlt,
  FaSpinner,
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
  const [submitting, setSubmitting] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 4000);
    }, 1500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 3000);
    }
  };

  const getFieldState = (field) => {
    const hasValue = formData[field]?.length > 0;
    const isFocused = focusedField === field;
    if (isFocused) return "focused";
    if (hasValue) return "filled";
    return "empty";
  };

  return (
    <div className="cmsPage contactPage">
      <div className="contactBgGlow" />
      <div className="contactBgGlow secondary" />
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
            <div className="formDecor" />
            {submitted ? (
              <div className="successMessage">
                <div className="successIcon">
                  <FaCheck />
                  <div className="successRipple" />
                </div>
                <h3>Message Sent!</h3>
                <p>
                  Thanks for reaching out. We'll get back to you as soon as
                  possible — usually within 24 hours.
                </p>
                <div className="successParticles">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="particle" style={{ '--i': i }} />
                  ))}
                </div>
              </div>
            ) : (
              <form className="contactForm" onSubmit={handleSubmit}>
                <div className="formHeader">
                  <div className="formHeaderIcon">
                    <FaCommentAlt />
                  </div>
                  <div>
                    <h3>Send Us a Message</h3>
                    <p>We'd love to hear from you. Fill out the form and we'll respond promptly.</p>
                  </div>
                </div>

                <div className="formRow">
                  <div className={`formGroup ${getFieldState("name")}`}>
                    <div className="inputWrapper">
                      <FaUser className="inputIcon" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                      <span className="inputFocus" />
                    </div>
                  </div>
                  <div className={`formGroup ${getFieldState("email")}`}>
                    <div className="inputWrapper">
                      <FaEnvelope className="inputIcon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                      <span className="inputFocus" />
                    </div>
                  </div>
                </div>

                <div className={`formGroup ${getFieldState("subject")}`}>
                  <div className="inputWrapper">
                    <FaTag className="inputIcon" />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <span className="inputFocus" />
                  </div>
                </div>

                <div className={`formGroup ${getFieldState("message")}`}>
                  <div className="inputWrapper textareaWrapper">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Your Message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <span className="inputFocus" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="submitBtn"
                  disabled={submitting}
                >
                  <span className={`btnContent ${submitting ? "loading" : ""}`}>
                    {submitting ? (
                      <FaSpinner className="btnIcon spinner" />
                    ) : (
                      <FaPaperPlane className="btnIcon" />
                    )}
                    {submitting ? "Sending..." : "Send Message"}
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
                <a href="mailto:hello@movix.app" className="contactMethod">
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
