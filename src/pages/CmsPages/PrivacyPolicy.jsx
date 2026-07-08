import React from "react";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./style.scss";

const PrivacyPolicy = () => {
  return (
    <div className="cmsPage">
      <ContentWrapper>
        <div className="pageHeader">
          <h1>Privacy Policy</h1>
          <p className="subtitle">
            Your privacy is important to us at Movix.
          </p>
          <p className="lastUpdated">Last updated: July 9, 2026</p>
        </div>
        <div className="content">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Movix ("we," "our," or "us"). We are committed to
            protecting your personal information and your right to privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our website and services.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>
            We may collect information that you voluntarily provide when you
            interact with our platform, including:
          </p>
          <ul>
            <li>Watchlist and viewing preferences</li>
            <li>Search history within the application</li>
            <li>User preferences and settings</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>
            When you access our platform, we may automatically collect certain
            information, including:
          </p>
          <ul>
            <li>Device type and browser information</li>
            <li>Usage patterns and interaction data</li>
            <li>Pages visited and time spent on each page</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain our services</li>
            <li>Personalize your movie and TV show recommendations</li>
            <li>Improve and optimize our platform</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Remember your preferences and settings</li>
          </ul>

          <h2>4. Data Storage</h2>
          <div className="highlight">
            <p>
              <strong>Local Storage:</strong> Movix uses your browser's local
              storage to save your watchlist, viewing history, and preferences.
              This data stays on your device and is not transmitted to external
              servers.
            </p>
          </div>

          <h2>5. Third-Party Services</h2>
          <p>
            We use The Movie Database (TMDB) API to provide movie and TV show
            data. Please note that TMDB has its own privacy policy governing the
            use of their services.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information. However, no method of transmission
            over the Internet or electronic storage is 100% secure.
          </p>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of data collection</li>
            <li>Clear your local data at any time through your browser settings</li>
          </ul>

          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under 13. We do not
            knowingly collect personal information from children under 13.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on this page and
            updating the "Last updated" date.
          </p>

          <div className="contactInfo">
            <h3>Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy, please contact
              us:
            </p>
            <p>Email: privacy@movix.app</p>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default PrivacyPolicy;
