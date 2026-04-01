import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";

const Header = () => {
	const [show, setShow] = useState("top");
	const [lastScrollY, setLastScrollY] = useState(0);
	const [mobileMenu, setMobileMenu] = useState(false);
	const [query, setQuery] = useState("");
	const [showSearch, setShowSearch] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	const controlNavbar = () => {
		if (window.scrollY > 200) {
			if (window.scrollY > lastScrollY && !mobileMenu) {
				setShow("hide");
			} else {
				setShow("show");
			}
		} else {
			setShow("top");
		}
		setLastScrollY(window.scrollY);
	};

	useEffect(() => {
		window.addEventListener("scroll", controlNavbar);
		return () => {
			window.removeEventListener("scroll", controlNavbar);
		};
	}, [lastScrollY]);

	const searchQueryHandler = (event) => {
		if (event.key === "Enter" && query.length > 0) {
			navigate(`/search/${query}`);
			setTimeout(() => {
				setShowSearch(false);
			}, 1000);
		}
	};

	const openSearch = () => {
		setMobileMenu(false);
		setShowSearch(true);
	};

	const openMobileMenu = () => {
		setMobileMenu(true);
		setShowSearch(false);
	};

	const navigationHandler = (type) => {
		if (type === "movie") {
			navigate("/explore/movie");
		} else {
			navigate("/explore/tv");
		}
		setMobileMenu(false);
	};

	return (
		<header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
			<ContentWrapper>
				<div className="logo" onClick={() => navigate("/")}>
					<img src={logo} alt="" />
				</div>
				<ul className="menuItems">
					{[
						{ label: "Home", path: "/home" },
						{ label: "Movies", path: "/explore/movie", type: "movie" },
						{ label: "TV Shows", path: "/explore/tv", type: "tv" },
						{ label: "Watchlist", path: "/watchlist" },
						{ label: "History", path: "/history" },
						{ label: "Comparison", path: "/comparison" },
						{ label: "Match", path: "/cinematch" },
						{ label: "Trivia", path: "/trivia" },
						{ label: "Surprise", path: "/mystery-box" },
						{ label: "Feed", path: "/cinestream" },
						{ label: "Moods", path: "/moodify" },
						{ label: "Globe", path: "/globetrotter" },
						{ label: "Graph", path: "/cinegraph" },
						{ label: "Planner", path: "/middle-ground" },
					].map((item, index) => {
						const isActive = 
							location.pathname === item.path || 
							(item.type === "movie" && location.pathname.startsWith("/explore/movie")) ||
							(item.type === "tv" && location.pathname.startsWith("/explore/tv"));

						return (
							<li
								key={item.label}
								className={`menuItem ${isActive ? "active" : ""}`}
								style={{ "--i": index }}
								onClick={() =>
									item.type ? navigationHandler(item.type) : navigate(item.path)
								}
							>
								{item.label}
							</li>
						);
					})}
					<li className="menuItem searchIcon">
						<HiOutlineSearch onClick={openSearch} />
					</li>
				</ul>

				<div className="mobileMenuItems">
					<HiOutlineSearch onClick={openSearch} />
					{mobileMenu ? (
						<VscChromeClose onClick={() => setMobileMenu(false)} />
					) : (
						<SlMenu onClick={openMobileMenu} />
					)}
				</div>
			</ContentWrapper>
			{showSearch && (
				<div className="searchBar">
					<ContentWrapper>
						<div className="searchInput">
							<input
								type="text"
								placeholder="Search for a movie or tv show...."
								onChange={(e) => setQuery(e.target.value)}
								onKeyUp={searchQueryHandler}
							/>
							<VscChromeClose onClick={() => setShowSearch(false)} />
						</div>
					</ContentWrapper>
				</div>
			)}
		</header>
	);
};

export default Header;
