import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaHeart,
  FaPaperPlane,
} from "react-icons/fa";
import { FaHashnode } from "react-icons/fa6";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import movixLogo from "../../assets/movix-logo.svg";

import "./style.scss";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleNav = (path) => (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footerGlow" />

      <ContentWrapper>
        {/* Newsletter */}
        <div className="newsletterSection">
          <div className="newsletterContent">
            <span className="newsletterBadge">Stay Updated</span>
            <h3 className="newsletterTitle">
              Get the latest in cinema, delivered to your inbox.
            </h3>
            <p className="newsletterDesc">
              Curated movie picks, new releases, and Movix updates. No spam, ever.
            </p>
          </div>
          <form className="newsletterForm" onSubmit={handleNewsletterSubmit}>
            {subscribed ? (
              <div className="newsletterSuccess">Thanks for subscribing!</div>
            ) : (
              <>
                <div className="inputWrapper">
                  <FaPaperPlane className="inputIcon" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletterInput"
                    required
                  />
                </div>
                <button type="submit" className="newsletterBtn">
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>

        {/* Main Content */}
        <div className="footerMain">
          <div className="footerBrand">
            <a href="/home" onClick={handleNav("/home")} className="footerLogo">
              <img src={movixLogo} alt="Movix" className="footerLogoImg" />
            </a>
            <p className="footerTagline">
              Your premium destination for discovering movies, TV shows, and
              entertainment from around the world.
            </p>
            <div className="featureBadges">
              <span className="badge">
                <span className="badgeDot" /> 13+ Languages
              </span>
              <span className="badge">
                <span className="badgeDot" /> AI Powered
              </span>
              <span className="badge">
                <span className="badgeDot" /> Free Forever
              </span>
            </div>
            <div className="footerSocials">
              <a
                href="https://github.com/devhimanshuu"
                target="_blank"
                rel="noopener noreferrer"
                className="socialIcon"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://techsphere.hashnode.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="socialIcon"
                aria-label="Blog"
              >
                <FaHashnode />
              </a>
              <a
                href="https://twitter.com/devhimanshuu"
                target="_blank"
                rel="noopener noreferrer"
                className="socialIcon"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.linkedin.com/in/himanshu-guptaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="socialIcon"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footerLinks">
            <div className="linkGroup">
              <h4>Explore</h4>
              <a href="/home" onClick={handleNav("/home")}>Home</a>
              <a href="/explore/movie" onClick={handleNav("/explore/movie")}>Movies</a>
              <a href="/explore/tv" onClick={handleNav("/explore/tv")}>TV Shows</a>
              <a href="/regional-cinema" onClick={handleNav("/regional-cinema")}>Regional Cinema</a>
              <a href="/watchlist" onClick={handleNav("/watchlist")}>Watchlist</a>
              <a href="/history" onClick={handleNav("/history")}>History</a>
              <a href="/comparison" onClick={handleNav("/comparison")}>Box Office Battle</a>
            </div>
            <div className="linkGroup">
              <h4>Features</h4>
              <a href="/cinematch" onClick={handleNav("/cinematch")}>CineMatch</a>
              <a href="/moodify" onClick={handleNav("/moodify")}>Moodify</a>
              <a href="/trivia" onClick={handleNav("/trivia")}>Trivia</a>
              <a href="/globetrotter" onClick={handleNav("/globetrotter")}>GlobeTrotter</a>
              <a href="/cinegraph" onClick={handleNav("/cinegraph")}>CineGraph</a>
              <a href="/cinestream" onClick={handleNav("/cinestream")}>CineStream</a>
              <a href="/mystery-box" onClick={handleNav("/mystery-box")}>Mystery Box</a>
              <a href="/middle-ground" onClick={handleNav("/middle-ground")}>Middle Ground</a>
            </div>
            <div className="linkGroup">
              <h4>Company</h4>
              <a href="/about" onClick={handleNav("/about")}>About</a>
              <a href="/blog" onClick={handleNav("/blog")}>Blog</a>
              <a href="/faq" onClick={handleNav("/faq")}>FAQ</a>
              <a href="/contact" onClick={handleNav("/contact")}>Contact</a>
            </div>
            <div className="linkGroup">
              <h4>Legal</h4>
              <a href="/terms" onClick={handleNav("/terms")}>Terms of Service</a>
              <a href="/privacy-policy" onClick={handleNav("/privacy-policy")}>Privacy Policy</a>
            </div>
          </div>
        </div>

        <div className="footerDivider" />

        <div className="footerBottom">
          <p className="copyright">
            <span className="copyrightYear">
              &copy; {new Date().getFullYear()}
            </span>
            <span className="copyrightDivider" aria-hidden="true" />
            <span className="copyrightText">
              <span className="textLine">Brought to life with</span>
              <FaHeart className="heartIcon" />
              <span className="textLine">by</span>
            </span>
            <a
              href="https://himanshuguptaa.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="copyrightAuthor"
            >
              <span className="authorTooltip">Portfolio</span>
              <span className="authorName">Himanshu Gupta</span>
              <span className="authorGlow" />
            </a>
          </p>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
