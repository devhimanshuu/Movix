import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
    FaNetworkWired, 
    FaHeart, 
    FaGamepad, 
    FaPlay, 
    FaUserFriends, 
    FaMask, 
    FaBoxOpen, 
    FaGlobeAmericas,
    FaArrowRight
} from "react-icons/fa";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import "./style.scss";

const FEATURES = [
    {
        id: "cinegraph",
        title: "CineGraph",
        desc: "Explore movie universes and actor connections in a cosmic interactve web.",
        icon: <FaNetworkWired />,
        path: "/cinegraph",
        color: "#da2f68"
    },
    {
        id: "cinematch",
        title: "CineMatch",
        desc: "Tinder for movies! Swipe through posters to build your perfect watchlist.",
        icon: <FaHeart />,
        path: "/cinematch",
        color: "#4ecdc4"
    },
    {
        id: "trivia",
        title: "Movie Trivia",
        desc: "Multiple game modes to test your cinematic knowledge and hit high streaks.",
        icon: <FaGamepad />,
        path: "/trivia",
        color: "#f89e00"
    },
    {
        id: "cinestream",
        title: "CineStream",
        desc: "Vertical immersion. Discover new favorites in an auto-playing trailer feed.",
        icon: <FaPlay />,
        path: "/cinestream",
        color: "#a855f7"
    },
    {
        id: "middle-ground",
        title: "Middle Ground",
        desc: "Planning a movie night? Find common ground between two sets of genres.",
        icon: <FaUserFriends />,
        path: "/middle-ground",
        color: "#4a90e2"
    },
    {
        id: "moodify",
        title: "Moodify",
        desc: "How are you feeling today? Get movie picks tailored to your current mood.",
        icon: <FaMask />,
        path: "/moodify",
        color: "#ff6b6b"
    },
    {
        id: "mystery-box",
        title: "Mystery Box",
        desc: "Feeling lucky? Open the 3D box to reveal a high-rated surprise movie.",
        icon: <FaBoxOpen />,
        path: "/mystery-box",
        color: "#06ffa5"
    },
    {
        id: "globetrotter",
        title: "GlobeTrotter",
        desc: "Travel through the 3D globe to discover movies filmed in every corner of the world.",
        icon: <FaGlobeAmericas />,
        path: "/globetrotter",
        color: "#764ba2"
    }
];

const InteractiveSection = () => {
    const navigate = useNavigate();

    return (
        <div className="interactiveSection">
            <ContentWrapper>
                <div className="sectionHeader">
                    <h2 className="title">Cinematic Experiences</h2>
                    <p className="subtitle">Discover movies in a whole new dimension with our interactive experimental tools</p>
                </div>

                <div className="featuresGrid">
                    {FEATURES.map((feature) => (
                        <div 
                            key={feature.id} 
                            className="featureCard"
                            onClick={() => navigate(feature.path)}
                            style={{ "--feature-color": feature.color }}
                        >
                            <div className="cardBackground" />
                            <div className="cardGlow" />
                            
                            <div className="iconWrapper">
                                {feature.icon}
                            </div>
                            
                            <div className="cardContent">
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                                <div className="exploreLink">
                                    Try it now <FaArrowRight />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default InteractiveSection;
