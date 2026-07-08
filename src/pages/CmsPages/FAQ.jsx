import React, { useState } from "react";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";
import "./style.scss";
import "./faq.scss";

const faqData = [
  {
    question: "What is Movix?",
    answer:
      "Movix is an interactive movie and TV show discovery platform. It allows you to explore trending content, create watchlists, track your viewing history, play trivia, get personalized recommendations, and much more — all in one place.",
  },
  {
    question: "Is Movix free to use?",
    answer:
      "Yes! Movix is completely free to use. We don't require any subscriptions or payments. Simply visit the website and start exploring.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required. Movix uses your browser's local storage to save your watchlist, viewing history, and preferences. This means your data stays on your device and is never sent to our servers.",
  },
  {
    question: "Where does the movie data come from?",
    answer:
      "All movie and TV show data, including posters, ratings, cast information, and metadata, is sourced from The Movie Database (TMDB) API. We are not affiliated with TMDB but use their public API under their terms of service.",
  },
  {
    question: "What is CineMatch?",
    answer:
      "CineMatch is our personalized recommendation engine. It asks you to rate a few movies and then uses that data to suggest films and TV shows tailored to your taste.",
  },
  {
    question: "What is CineBot?",
    answer:
      "CineBot is our AI-powered chat assistant. You can ask it about movies, get recommendations, learn fun facts, and have conversations about your favorite films. It's available as a floating chat widget on every page.",
  },
  {
    question: "What is Moodify?",
    answer:
      "Moodify helps you find the perfect movie based on your current mood. Select how you're feeling, and we'll suggest movies that match your vibe — whether you want something cheerful, dramatic, or thrilling.",
  },
  {
    question: "What is GlobeTrotter?",
    answer:
      "GlobeTrotter is an interactive feature that lets you explore iconic filming locations around the world on a 3D globe. Click on any location to discover movies that were filmed there.",
  },
  {
    question: "Can I use Movix on my phone?",
    answer:
      "Absolutely! Movix is fully responsive and works great on mobile devices, tablets, and desktops. The interface adapts to your screen size for the best experience.",
  },
  {
    question: "How do I clear my data?",
    answer:
      "Since all your data (watchlist, history, preferences) is stored in your browser's local storage, you can clear it anytime by going to your browser settings and clearing the site data for Movix, or by using your browser's developer tools.",
  },
  {
    question: "What regional cinema sections are available?",
    answer:
      "Movix features dedicated sections for Malayalam, Telugu, Tamil, Korean, Japanese, Chinese, Thai, French, Spanish, German, Italian, Portuguese, and Turkish cinema. Each section includes both movies and TV shows with a toggle switch.",
  },
  {
    question: "How does the Box Office Battle work?",
    answer:
      "Box Office Battle lets you compare two movies side by side, looking at their box office performance, ratings, popularity, and other metrics. It's a fun way to see how your favorite films stack up against each other.",
  },
];

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`faqItem ${isOpen ? "open" : ""}`}
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
    >
      <button className="faqQuestion" onClick={() => setIsOpen(!isOpen)}>
        <div className="faqQuestionContent">
          <span className="faqIndex">{String(index + 1).padStart(2, "0")}</span>
          <span>{question}</span>
        </div>
        <span className={`faqIcon ${isOpen ? "rotated" : ""}`}>
          <FaChevronDown />
        </span>
      </button>
      <div className="faqAnswer" style={isOpen ? { maxHeight: "400px" } : {}}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="cmsPage faqPage">
      <div className="faqBgGlow" />
      <ContentWrapper>
        <div className="pageHeader">
          <div className="headerBadge">
            <span className="badgePulse" />
            Got Questions
          </div>
          <h1>
            Frequently Asked{" "}
            <span className="gradientText">Questions</span>
          </h1>
          <p className="subtitle">
            Everything you need to know about Movix. Can't find what you're
            looking for? We're here to help.
          </p>
        </div>

        <div className="content">
          <div className="faqList">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                index={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>

          <div className="ctaSection">
            <div className="ctaIcon">
              <FaQuestionCircle />
            </div>
            <h3>Still Have Questions?</h3>
            <p>
              Can't find what you're looking for? Feel free to reach out — we'd
              love to help.
            </p>
            <a href="mailto:support@movix.app" className="ctaBtn">
              Contact Support
            </a>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default FAQ;
