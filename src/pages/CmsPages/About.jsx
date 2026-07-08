import React from "react";
import { Link } from "react-router-dom";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./style.scss";

const About = () => {

  return (
    <div className="cmsPage">
      <ContentWrapper>
        <div className="pageHeader">
          <h1>About Movix</h1>
          <p className="subtitle">
            Where Every Screen Tells a Story
          </p>
        </div>
        <div className="content">
          <h2>Our Mission</h2>
          <p>
            Movix is a passion project built for movie lovers, by movie lovers.
            We believe that discovering your next favorite film should be an
            adventure in itself. Our mission is to create an immersive,
            interactive platform that transforms how you explore, track, and
            engage with movies and TV shows.
          </p>

          <h2>What We Offer</h2>
          <p>Movix goes beyond a simple movie database. We offer a rich set of features designed to enhance your entertainment experience:</p>
          <ul>
            <li>
              <strong>Smart Discovery</strong> — Browse trending, popular, and
              top-rated content across multiple languages and regions
            </li>
            <li>
              <strong>Personal Watchlist</strong> — Build and manage your
              must-watch collection
            </li>
            <li>
              <strong>Viewing History</strong> — Keep track of everything
              you've watched
            </li>
            <li>
              <strong>CineMatch</strong> — Get personalized movie recommendations
              based on your taste
            </li>
            <li>
              <strong>Trivia</strong> — Test your movie knowledge with our
              interactive trivia game
            </li>
            <li>
              <strong>Moodify</strong> — Find the perfect movie for your current
              mood
            </li>
            <li>
              <strong>CineGraph</strong> — Explore connections between movies,
              actors, and directors
            </li>
            <li>
              <strong>GlobeTrotter</strong> — Discover iconic filming locations
              around the world
            </li>
            <li>
              <strong>CineBot</strong> — Chat with our AI assistant for
              movie recommendations and trivia
            </li>
            <li>
              <strong>Box Office Battle</strong> — Compare movies side by side
            </li>
          </ul>

          <h2>Regional Cinema</h2>
          <p>
            We celebrate cinema from around the world. Explore dedicated sections
            for Malayalam, Telugu, Tamil, Korean, Japanese, French, Spanish,
            German, Chinese, Italian, Portuguese, Thai, and Turkish films — each
            with movies and TV shows to discover.
          </p>

          <h2>Technology</h2>
          <div className="highlight">
            <p>
              <strong>Built with modern web technologies:</strong> Movix is
              built with React, Redux, and powered by The Movie Database (TMDB)
              API for comprehensive movie and TV show data. Our AI features are
              powered by Groq for fast, intelligent responses.
            </p>
          </div>

          <h2>Credits</h2>
          <p>
            Movix is created by{" "}
            <a href="https://himanshuguptaa.vercel.app" target="_blank" rel="noopener noreferrer">
              <strong>Himanshu Gupta</strong>
            </a>
            . Movie data and images are provided by{" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
              TMDB
            </a>
            . We are grateful to the open-source community for the tools and
            libraries that make this project possible.
          </p>

          <div className="contactInfo">
            <h3>Get In Touch</h3>
            <p>
              Have feedback, suggestions, or just want to say hello? We'd love
              to hear from you!
            </p>
            <p>Email: hello@movix.app</p>
            <p>
              GitHub:{" "}
              <a href="https://github.com/devhimanshuu" target="_blank" rel="noopener noreferrer">
                github.com/devhimanshuu
              </a>
            </p>
            <p className="contactLink">
              <Link to="/contact">Visit our Contact page →</Link>
            </p>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default About;
