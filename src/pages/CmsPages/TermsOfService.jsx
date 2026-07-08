import React from "react";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./style.scss";

const TermsOfService = () => {
  return (
    <div className="cmsPage">
      <ContentWrapper>
        <div className="pageHeader">
          <h1>Terms of Service</h1>
          <p className="subtitle">
            Please read these terms carefully before using Movix.
          </p>
          <p className="lastUpdated">Last updated: July 9, 2026</p>
        </div>
        <div className="content">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Movix, you agree to be bound by these Terms
            of Service. If you do not agree to these terms, please do not use
            our platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Movix is a movie and TV show discovery platform that allows users
            to explore, track, and manage their viewing experience. Our services
            include:
          </p>
          <ul>
            <li>Browsing movies and TV shows from various sources</li>
            <li>Creating and managing personal watchlists</li>
            <li>Tracking viewing history</li>
            <li>Interactive features like trivia, recommendations, and more</li>
            <li>AI-powered chat assistance for movie queries</li>
          </ul>

          <h2>3. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>
              Use the platform only for personal, non-commercial purposes
            </li>
            <li>Not attempt to exploit or abuse any features of the platform</li>
            <li>Not use automated tools to access or scrape our content</li>
            <li>Not interfere with the proper functioning of the platform</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <div className="highlight">
            <p>
              <strong>Content Ownership:</strong> Movie and TV show data,
              images, and metadata displayed on Movix are provided by TMDB. All
              movie and TV show trademarks are the property of their respective
              owners.
            </p>
          </div>

          <h2>5. Disclaimer of Warranties</h2>
          <p>
            Movix is provided "as is" and "as available" without warranties of
            any kind. We do not guarantee the accuracy, completeness, or
            reliability of any content on our platform.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall Movix be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use
            of or inability to use our services.
          </p>

          <h2>7. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites or services.
            We are not responsible for the content, privacy policies, or
            practices of any third-party sites.
          </p>

          <h2>8. Modifications to Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of
            our service at any time without prior notice.
          </p>

          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your access to our platform immediately,
            without prior notice, for conduct that we determine, in our sole
            discretion, violates these terms or is harmful to other users.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with
            applicable laws, without regard to conflict of law principles.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. We will
            notify you of any material changes by posting the new terms on this
            page.
          </p>

          <div className="contactInfo">
            <h3>Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <p>Email: legal@movix.app</p>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default TermsOfService;
