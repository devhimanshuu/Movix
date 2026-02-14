import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";
import useFetch from "../../hooks/useFetch";
import Img from "../../components/lazyLoadImage/img";

/* ── Scroll-reveal hook ── */
function useReveal(threshold = 0.12) {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) setVisible(true);
			},
			{ threshold },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, visible];
}

const Landing = () => {
	const navigate = useNavigate();
	const { url } = useSelector((state) => state.home);
	const { data: trendingData } = useFetch("/trending/movie/day");
	const [currentSlide, setCurrentSlide] = useState(0);
	const featRef = useRef(null);

	const [r1, v1] = useReveal();
	const [r2, v2] = useReveal();
	const [r3, v3] = useReveal();
	const [r4, v4] = useReveal();
	const [r5, v5] = useReveal();
	const [r6, v6] = useReveal();
	const [r7, v7] = useReveal();
	const [r8, v8] = useReveal();
	const [r9, v9] = useReveal();

	useEffect(() => {
		if (trendingData?.results?.length > 0) {
			const t = setInterval(() => {
				setCurrentSlide((p) => (p >= 4 ? 0 : p + 1));
			}, 6000);
			return () => clearInterval(t);
		}
	}, [trendingData]);

	const go = (path) => () => navigate(path);
	const current = trendingData?.results?.[currentSlide];

	const genres = [
		"Action",
		"Comedy",
		"Drama",
		"Horror",
		"Sci-Fi",
		"Romance",
		"Thriller",
		"Animation",
		"Documentary",
		"Fantasy",
		"Mystery",
		"Adventure",
	];

	return (
		<div className="lp">
			{/* ═══════ HERO ═══════ */}
			<section className="hero">
				<div className="hero__bg">
					{trendingData?.results?.slice(0, 5).map((m, i) => (
						<div
							key={m.id}
							className={`hero__slide ${i === currentSlide ? "active" : ""}`}>
							{m.backdrop_path && url.backdrop && (
								<Img src={url.backdrop + m.backdrop_path} />
							)}
						</div>
					))}
				</div>
				<div className="hero__overlay" />

				{current && (
					<div className="hero__now">
						<span className="hero__now-tag">Now Trending</span>
						<span className="hero__now-name">
							{current.title || current.name}
						</span>
					</div>
				)}

				<div className="hero__center">
					<p className="hero__eyebrow">The Future of Entertainment</p>
					<h1 className="hero__title">
						<span className="grad">Mo</span>vix
					</h1>
					<p className="hero__sub">
						Discover, compare, and curate your perfect watchlist from millions
						of movies & TV shows — all in one beautifully crafted platform.
					</p>
					<div className="hero__btns">
						<button className="btn btn--primary" onClick={go("/home")}>
							Start Exploring
						</button>
						<button className="btn btn--ghost" onClick={go("/explore/movie")}>
							Browse Movies
						</button>
					</div>
					<div className="hero__dots">
						{[0, 1, 2, 3, 4].map((i) => (
							<button
								key={i}
								className={`hero__dot ${i === currentSlide ? "on" : ""}`}
								onClick={() => setCurrentSlide(i)}
							/>
						))}
					</div>
					<button
						className="hero__scroll"
						onClick={() =>
							featRef.current?.scrollIntoView({ behavior: "smooth" })
						}>
						<span className="hero__scroll-bar" />
					</button>
				</div>
			</section>

			{/* ═══════ MARQUEE ═══════ */}
			<div className={`ticker ${v1 ? "reveal" : ""}`} ref={r1}>
				<div className="ticker__track">
					{[...Array(2)].map((_, d) => (
						<div className="ticker__set" key={d}>
							{[
								"Trending",
								"Top Rated",
								"Award Winners",
								"Now Playing",
								"Coming Soon",
								"Fan Favorites",
								"Hidden Gems",
								"Binge-Worthy",
							].map((t, i) => (
								<span key={i} className="ticker__item">
									{t}
									<span className="ticker__dot" />
								</span>
							))}
						</div>
					))}
				</div>
			</div>

			{/* ═══════ CORE FEATURES ═══════ */}
			<section
				className={`sec sec--features ${v2 ? "reveal" : ""}`}
				ref={(el) => {
					featRef.current = el;
					r2.current = el;
				}}>
				<div className="sec__inner">
					<div className="sec__head">
						<span className="label label--pink">Core Features</span>
						<h2 className="sec__title">
							Everything you need,
							<br />
							nothing you don't.
						</h2>
						<p className="sec__desc">
							Movix packs powerful features into a clean, intuitive interface —
							so you spend less time searching and more time watching.
						</p>
					</div>
					<div className="cards cards--4">
						{[
							{
								n: "01",
								t: "Discover",
								d: "Browse trending, top-rated, and upcoming titles across every genre — powered by live TMDB data with lightning-fast search.",
								l: "/explore/movie",
							},
							{
								n: "02",
								t: "Moodify",
								d: "Tell us how you feel. Our mood-based engine analyzes tone and themes to serve you the perfect movie match for tonight.",
								l: "/moodify",
							},
							{
								n: "03",
								t: "Compare",
								d: "Put any two titles side by side. Ratings, cast, runtime, revenue, trivia — every detail at a glance in a beautiful visual diff.",
								l: "/comparison",
							},
							{
								n: "04",
								t: "Curate",
								d: "Build your watchlist, track your watch history, and organize everything. Your data stays on your device — zero accounts needed.",
								l: "/watchlist",
							},
						].map((c, i) => (
							<div
								className="glass-card"
								key={i}
								style={{ transitionDelay: `${i * 0.1}s` }}>
								<span className="glass-card__num">{c.n}</span>
								<h3 className="glass-card__title">{c.t}</h3>
								<p className="glass-card__text">{c.d}</p>
								<span className="glass-card__link" onClick={go(c.l)}>
									Try it →
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════ SMART FEATURES ═══════ */}
			<section className={`sec sec--smart ${v3 ? "reveal" : ""}`} ref={r3}>
				<div className="sec__inner">
					<div className="sec__head sec__head--center">
						<span className="label label--orange">Smart Features</span>
						<h2 className="sec__title">
							Not just another
							<br />
							movie database.
						</h2>
						<p className="sec__desc">
							Movix goes far beyond search. These AI-powered and interactive
							features make it your ultimate entertainment companion.
						</p>
					</div>
					<div className="cards cards--3">
						{[
							{
								t: "CineBot",
								sub: "AI Assistant",
								d: "Ask anything about movies. Get instant recommendations, plot summaries, actor trivia, or just have a casual movie chat — powered by AI.",
								l: "/home",
							},
							{
								t: "CineMatch",
								sub: "Similarity Engine",
								d: "Find movies that feel the same. CineMatch analyzes themes, mood, visuals, and narrative style to surface titles you'd never find by genre alone.",
								l: "/cinematch",
							},
							{
								t: "CineStream",
								sub: "Where to Watch",
								d: "Stop switching between apps. CineStream shows you exactly where any title is streaming — Netflix, Prime, Hulu, Disney+ and 50+ more.",
								l: "/cinestream",
							},
						].map((c, i) => (
							<div
								className="glass-card glass-card--tall"
								key={i}
								style={{ transitionDelay: `${i * 0.12}s` }}>
								<span className="glass-card__badge">{c.sub}</span>
								<h3 className="glass-card__title">{c.t}</h3>
								<p className="glass-card__text">{c.d}</p>
								<span className="glass-card__link" onClick={go(c.l)}>
									Explore →
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════ FUN FEATURES ═══════ */}
			<section className={`sec sec--fun ${v4 ? "reveal" : ""}`} ref={r4}>
				<div className="sec__inner">
					<div className="sec__row">
						<div className="sec__row-text">
							<span className="label label--pink">Interactive & Fun</span>
							<h2 className="sec__title">
								Play, explore,
								<br />
								get surprised.
							</h2>
							<p className="sec__desc">
								Entertainment shouldn't stop at browsing. With Trivia,
								MysteryBox, and GlobeTrotter, Movix turns movie discovery into
								an experience.
							</p>
						</div>
						<div className="cards cards--col">
							{[
								{
									t: "Trivia",
									d: "Test your film knowledge with AI-generated questions across difficulty levels. Compete, learn, and discover new facts about your favorite movies.",
									l: "/trivia",
								},
								{
									t: "Mystery Box",
									d: "Feeling adventurous? Click the box and get a completely random, hand-picked movie recommendation. No filters, pure surprise.",
									l: "/mystery-box",
								},
								{
									t: "GlobeTrotter",
									d: "Explore world cinema by clicking any country on an interactive map. Discover the best films from every corner of the globe.",
									l: "/globetrotter",
								},
							].map((c, i) => (
								<div
									className="glass-card glass-card--row"
									key={i}
									style={{ transitionDelay: `${i * 0.1}s`, cursor: "pointer" }}
									onClick={go(c.l)}>
									<div>
										<h3 className="glass-card__title">{c.t}</h3>
										<p className="glass-card__text">{c.d}</p>
									</div>
									<span className="glass-card__link">Try it →</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ═══════ GENRE EXPLORER ═══════ */}
			<section className={`sec sec--genre ${v5 ? "reveal" : ""}`} ref={r5}>
				<div className="sec__inner">
					<div className="sec__head sec__head--center">
						<span className="label label--orange">Browse by Genre</span>
						<h2 className="sec__title">
							Every mood
							<br />
							has a genre.
						</h2>
						<p className="sec__desc">
							From edge-of-seat action to heartfelt romance — tap any genre to
							explore curated collections instantly.
						</p>
					</div>
					<div className="pills">
						{genres.map((g, i) => (
							<button
								key={g}
								className="pill"
								onClick={go("/explore/movie")}
								style={{ transitionDelay: `${i * 0.04}s` }}>
								{g}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* ═══════ SHOWCASE ═══════ */}
			<section className={`sec sec--showcase ${v6 ? "reveal" : ""}`} ref={r6}>
				<div className="sec__inner">
					<div className="showcase__grid">
						<div className="showcase__text">
							<span className="label label--pink">Featured</span>
							<h2 className="sec__title">
								Trending right
								<br />
								now on Movix.
							</h2>
							<p className="sec__desc">
								Here's what the world is watching today. Updated every hour with
								fresh data from TMDB.
							</p>
							<button className="btn btn--ghost" onClick={go("/home")}>
								See All Trending
							</button>
						</div>
						<div className="posters">
							{trendingData?.results?.slice(0, 6).map(
								(m, i) =>
									m.poster_path &&
									url.poster && (
										<div
											key={m.id}
											className="posters__item"
											style={{ transitionDelay: `${i * 0.08}s` }}
											onClick={go(`/movie/${m.id}`)}>
											<Img src={url.poster + m.poster_path} />
											<div className="posters__hover">
												<span className="posters__rating">
													{m.vote_average?.toFixed(1)}
												</span>
												<span className="posters__name">
													{m.title || m.name}
												</span>
											</div>
										</div>
									),
							)}
						</div>
					</div>
				</div>
			</section>

			{/* ═══════ HOW IT WORKS ═══════ */}
			<section className={`sec sec--how ${v8 ? "reveal" : ""}`} ref={r8}>
				<div className="sec__inner">
					<div className="sec__head">
						<span className="label label--pink">How It Works</span>
						<h2 className="sec__title">
							Three steps to your
							<br />
							perfect watch night.
						</h2>
						<p className="sec__desc">
							No sign-up. No subscriptions. No data collection. Just open Movix
							and start discovering.
						</p>
					</div>
					<div className="steps">
						{[
							{
								n: "1",
								t: "Search or Browse",
								d: "Use powerful search, Moodify, genre pills, or GlobeTrotter to find exactly what you're looking for — from blockbusters to indie gems.",
							},
							{
								n: "2",
								t: "Explore Details",
								d: "Dive into ratings, trailers, cast bios, reviews, streaming providers, and similar titles — everything on one distraction-free page.",
							},
							{
								n: "3",
								t: "Watch & Track",
								d: "Add to your watchlist, compare with other titles, and track your entire viewing journey. All stored locally, no account needed.",
							},
						].map((s, i) => (
							<div
								className="step"
								key={i}
								style={{ transitionDelay: `${i * 0.15}s` }}>
								<div className="step__marker">{s.n}</div>
								<h3 className="step__title">{s.t}</h3>
								<p className="step__text">{s.d}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════ STATS ═══════ */}
			<section className={`sec sec--stats ${v9 ? "reveal" : ""}`} ref={r9}>
				<div className="stats">
					{[
						{ n: "1M+", l: "Titles" },
						{ n: "20+", l: "Genres" },
						{ n: "190+", l: "Countries" },
						{ n: "100%", l: "Free" },
					].map((s, i) => (
						<React.Fragment key={i}>
							{i > 0 && <div className="stats__div" />}
							<div
								className="stats__item"
								style={{ transitionDelay: `${i * 0.1}s` }}>
								<span className="stats__num">{s.n}</span>
								<span className="stats__label">{s.l}</span>
							</div>
						</React.Fragment>
					))}
				</div>
			</section>

			{/* ═══════ FINAL CTA ═══════ */}
			<section className="cta">
				<div className="cta__inner">
					<h2 className="cta__title">
						Your next favorite film
						<br />
						is one click away.
					</h2>
					<p className="cta__sub">
						Join thousands of cinephiles already using Movix. No sign-up
						required — just pure movie magic.
					</p>
					<button className="btn btn--primary btn--lg" onClick={go("/home")}>
						Start Exploring
					</button>
				</div>
			</section>

			{/* ═══════ SIGNATURE ═══════ */}
			<div className="lp-signature">
				<a
					href="https://www.linkedin.com/in/himanshu-guptaa/"
					target="_blank"
					rel="noopener noreferrer"
					className="lp-signature__badge">
					Created By Himanshu Gupta
				</a>
			</div>
		</div>
	);
};

export default Landing;
