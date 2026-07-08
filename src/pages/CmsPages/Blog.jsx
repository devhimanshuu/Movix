import React from "react";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { FaClock, FaCalendar, FaArrowRight, FaPenFancy } from "react-icons/fa";
import "./style.scss";
import "./blog.scss";

const blogPosts = [
  {
    id: 1,
    title: "The Rise of Korean Cinema: From Parasite to Global Phenomenon",
    excerpt:
      "Explore how Korean films have taken the world by storm, breaking barriers and winning prestigious awards across the globe.",
    date: "July 5, 2026",
    category: "Cinema Insights",
    readTime: "5 min read",
    image: "https://via.placeholder.com/400x250/1a1a2e/e94560?text=Korean+Cinema",
  },
  {
    id: 2,
    title: "Top 10 Must-Watch Malayalam Films of 2026",
    excerpt:
      "From gripping thrillers to heartwarming dramas, here are the Malayalam films that have captivated audiences this year.",
    date: "June 28, 2026",
    category: "Recommendations",
    readTime: "4 min read",
    image: "https://via.placeholder.com/400x250/1a1a2e/e94560?text=Malayalam+Films",
  },
  {
    id: 3,
    title: "How AI is Changing the Way We Discover Movies",
    excerpt:
      "From personalized recommendations to AI chatbots, discover how artificial intelligence is revolutionizing movie discovery.",
    date: "June 20, 2026",
    category: "Technology",
    readTime: "6 min read",
    image: "https://via.placeholder.com/400x250/1a1a2e/e94560?text=AI+Movies",
  },
  {
    id: 4,
    title: "The Best Japanese Anime Films for Beginners",
    excerpt:
      "New to anime? Start with these carefully curated Japanese animated films that will transport you to incredible worlds.",
    date: "June 15, 2026",
    category: "Recommendations",
    readTime: "5 min read",
    image: "https://via.placeholder.com/400x250/1a1a2e/e94560?text=Anime+Films",
  },
  {
    id: 5,
    title: "Iconic Filming Locations You Can Visit in Real Life",
    excerpt:
      "From New Zealand's Middle-earth to Iceland's alien landscapes, explore the real-world locations behind your favorite movies.",
    date: "June 10, 2026",
    category: "Cinema Insights",
    readTime: "7 min read",
    image: "https://via.placeholder.com/400x250/1a1a2e/e94560?text=Filming+Locations",
  },
  {
    id: 6,
    title: "Building Movix: Our Journey in Creating a Movie Platform",
    excerpt:
      "A behind-the-scenes look at how we built Movix, the challenges we faced, and the features we're most proud of.",
    date: "June 1, 2026",
    category: "Behind the Scenes",
    readTime: "8 min read",
    image: "https://via.placeholder.com/400x250/1a1a2e/e94560?text=Building+Movix",
  },
];

const BlogCard = ({ post, index }) => {
  return (
    <div className="blogCard" style={{ animationDelay: `${0.1 + index * 0.08}s` }}>
      <div
        className="blogImage"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <span className="blogCategory">{post.category}</span>
      </div>
      <div className="blogContent">
        <div className="blogMeta">
          <span className="blogMetaItem">
            <FaCalendar className="metaIcon" />
            {post.date}
          </span>
          <span className="blogMetaItem">
            <FaClock className="metaIcon" />
            {post.readTime}
          </span>
        </div>
        <h3 className="blogTitle">{post.title}</h3>
        <p className="blogExcerpt">{post.excerpt}</p>
        <span className="blogReadMore">
          Read Article <FaArrowRight className="readMoreIcon" />
        </span>
      </div>
    </div>
  );
};

const Blog = () => {
  return (
    <div className="cmsPage blogPage">
      <div className="blogBgGlow" />
      <ContentWrapper>
        <div className="pageHeader">
          <div className="headerBadge">
            <span className="badgePulse" />
            Latest Stories
          </div>
          <h1>
            The <span className="gradientText">Movix</span> Blog
          </h1>
          <p className="subtitle">
            Stories, insights, and recommendations from the world of cinema —
            written by movie lovers, for movie lovers.
          </p>
        </div>

        <div className="content">
          <div className="blogGrid">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>

          <div className="ctaSection">
            <div className="ctaIcon">
              <FaPenFancy />
            </div>
            <h3>Want to Contribute?</h3>
            <p>
              Passionate about movies and writing? We'd love to hear from you.
              Reach out to discuss guest posting opportunities.
            </p>
            <a href="mailto:blog@movix.app" className="ctaBtn">
              Write for Us
            </a>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Blog;
