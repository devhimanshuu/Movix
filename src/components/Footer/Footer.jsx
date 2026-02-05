import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { FaHashnode } from "react-icons/fa6";

import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./style.scss";

const Footer = () => {
	return (
		<footer className="footer">
			<ContentWrapper>
				<ul className="menuItems">
					<li className="menuItem">Terms Of Use</li>
					<li className="menuItem">Privacy-Policy</li>
					<li className="menuItem">About</li>
					<li className="menuItem">Blog</li>
					<li className="menuItem">FAQ</li>
				</ul>
				<div className="infoText">
					At Movix, we're dedicated to bringing you the best in movies. Explore
					our vast collection of films, TV shows, and documentaries. Join our
					community of movie lovers to share recommendations and engage in
					lively discussions. Welcome to Movix – Where Every Screen Tells a
					Story.
				</div>
				<div className="socialIcons">
					<span className="icon">
						<a href="https://github.com/devhimanshuu">
							<FaGithub />
						</a>
					</span>
					<span className="icon">
						<a href="https://techsphere.hashnode.dev/">
							<FaHashnode />
						</a>
					</span>
					<span className="icon">
						<a href="https://twitter.com/devhimanshuu">
							<FaTwitter />
						</a>
					</span>
					<span className="icon">
						<a href="https://www.linkedin.com/in/himanshu-guptaa/">
							<FaLinkedin />
						</a>
					</span>
				</div>
				<div className="endName">
					<div className="signature-wrapper">Created By Himanshu Gupta</div>
				</div>
			</ContentWrapper>
		</footer>
	);
};

export default Footer;
