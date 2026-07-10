# Movix — Your Ultimate Movie Discovery Platform

> **Discover, compare, and curate your perfect watchlist from millions of movies & TV shows — all in one beautifully crafted platform.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-1.9-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TMDB API](https://img.shields.io/badge/TMDB_API-Powered-01D277?logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-LLaMA_3.3-FF6600?logo=groq&logoColor=white)](https://groq.com/)

---

## ▸ Why Movix?

Movix isn't just another movie database — it's a **complete entertainment companion**. Built with React 18, Redux Toolkit, and SCSS, and powered by **TMDB API** and **Groq AI**, Movix delivers a cinematic-grade experience across all devices.

| Feature | What it does |
|---|---|
| ◆ **Advanced Search** | Lightning-fast search across 1M+ movies & TV shows with smart filters |
| ◆ **CineBot AI** | Chat with an AI movie expert powered by Groq (LLaMA 3.3 70B) |
| ◆ **CineMatch** | Tinder-style swiping to build your watchlist with keyboard & touch support |
| ◆ **Moodify** | 12 mood-based categories — tell us how you feel, get perfect picks |
| ◆ **Interactive Trivia** | Multiple game modes (guess by year, tagline, or silhouette) |
| ◆ **Mystery Box** | 3D surprise recommendation box for spontaneous discovery |
| ◆ **GlobeTrotter** | Interactive 3D globe — explore films from 190+ countries |
| ◆ **CineGraph** | Force-directed graph visualization of actor/director/movie connections |
| ◆ **CineStream** | Immersive auto-playing trailer feed for visual-first discovery |
| ◆ **Middle Ground** | Find common movie interests between two sets of genre preferences |
| ◆ **Comparison Tool** | Side-by-side title comparison — ratings, cast, runtime, revenue |
| ◆ **Watchlist & History** | Personal tracking — all stored locally, **no account needed** |
| ◆ **Regional Cinema** | Explore cinema by language (Hindi, Japanese, Korean, French, and more) |
| ◆ **CMS Pages** | About, FAQ, Blog, Contact, Privacy Policy, Terms of Service |

---

## ▸ Live Demo

**[ ▶ Visit Movix](https://movix-roan.vercel.app)** — Deployed on Vercel

---

## ▸ Tech Stack

### **Frontend**  
| Technology | Purpose |
|---|---|
| **React 18** | UI library with functional components & hooks |
| **Redux Toolkit** | Centralized state management (home, watchlist, history, filters, comparison, theme) |
| **React Router v6** | Client-side routing with nested layouts |
| **SCSS / Sass** | Modular styling with mixins, variables, and responsive breakpoints |
| **Vite 5** | Lightning-fast dev server & optimized builds |
| **Axios** | HTTP client for API communication |
| **react-lazy-load-image-component** | Blur-up image loading for posters & backdrops |
| **react-circular-progressbar** | Animated rating visualizations |
| **react-infinite-scroll-component** | Infinite scrolling pagination |
| **react-select** | Searchable multi-select genre filters |
| **react-globe.gl** | 3D interactive globe for GlobeTrotter |
| **react-force-graph-2d** | Force-directed graph for CineGraph |
| **react-player** | Embedded video player for trailers |
| **three.js** | 3D rendering for Mystery Box and GlobeTrotter |
| **d3-force** | Physics-based graph layout engine |

### **APIs & Services**  
| Service | Purpose |
|---|---|
| **[TMDB API](https://www.themoviedb.org/)** | Comprehensive movie & TV show data (1M+ titles) |
| **[Groq AI](https://groq.com/)** | LLaMA 3.3 70B model for CineBot conversational AI |

### **DevOps & Tooling**  
| Tool | Purpose |
|---|---|
| **Vite** | Build tool, asset bundling, HMR |
| **Vercel** | Production deployment with automatic CI/CD |
| **ESLint** | Code quality & consistency |
| **GitHub** | Version control & collaboration |

---

## ▸ Responsive Design

Movix is fully responsive with optimized breakpoints:

| Breakpoint | Target | Notes |
|---|---|---|
| **< 640px** | Mobile | Touch-optimized interactions, compact layouts |
| **640px – 767px** | Small screens | Adaptive grids, readable typography |
| **768px – 1023px** | Tablet | Balanced layout with touch support |
| **1024px+** | Desktop | Full glassmorphism experience |

---

## ▸ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm or yarn
- [TMDB API Key](https://www.themoviedb.org/settings/api) (free)
- [Groq API Key](https://groq.com/) (free tier available) — *optional, only for CineBot*

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/devhimanshuu/Movix.git
cd Movix

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env file in the root directory:
#   VITE_APP_TMDB_TOKEN=your_tmdb_api_token_here
#   VITE_GROQ_API_KEY=your_groq_api_key_here   # optional

# 4. Start development server
npm run dev

# 5. Build for production
npm run build
```

### Environment Variables

```env
VITE_APP_TMDB_TOKEN=your_tmdb_api_token_here    # Required
VITE_GROQ_API_KEY=your_groq_api_key_here        # Optional (for CineBot AI)
```

---

## ▸ Project Architecture

```
src/
├── assets/                  # Static assets (images, fallbacks)
├── components/              # Reusable UI components
│   ├── BackToTop/          # Scroll-to-top button
│   ├── Carousel/           # Infinite scroll movie carousel
│   ├── CineBot/            # AI chat assistant (draggable)
│   ├── ContentWrapper/     # Max-width layout wrapper
│   ├── CustomCursor/       # Custom cursor with trail effects
│   ├── Footer/             # Site footer with links
│   ├── Header/             # Navigation header with search
│   ├── MovieCard/          # Movie poster card component
│   ├── SearchFilters/      # Advanced filtering interface
│   ├── Spinner/            # Loading spinner
│   ├── SwitchTab/          # Tab switcher (movie/TV)
│   ├── VideoPopUp/         # Modal video player
│   └── genres/             # Genre badge pills
│
├── data/
│   └── languages.js        # Language definitions for regional cinema
│
├── hooks/
│   ├── useFetch.jsx        # Custom data-fetching hook
│   └── useThemeSync.js     # Theme synchronization hook
│
├── pages/                  # Route-specific page components
│   ├── 404/               # Cinematic 404 page
│   ├── CineGraph/         # Force-directed graph visualization
│   ├── CineMatch/         # Tinder-style swiping
│   ├── CineStream/        # Trailer feed
│   ├── CmsPages/          # About, Blog, Contact, FAQ, Privacy, Terms
│   ├── Comparison/        # Title comparison tool (incl. BoxOfficeBattle)
│   ├── Details/           # Movie/TV detail pages with cast, reviews, videos
│   ├── Explore/           # Browse & filter all titles
│   ├── GlobeTrotter/      # 3D world map explorer
│   ├── Home/              # Dashboard with sections
│   ├── Landing/           # Marketing landing page
│   ├── MiddleGround/      # Shared genre finder
│   ├── Moodify/           # Mood-based discovery
│   ├── MysteryBox/        # Random surprise picker
│   ├── PersonDetails/     # Actor/director biography page
│   ├── RegionalCinema/    # Language-specific collections
│   ├── SearchResult/      # Search results with filters
│   ├── Trivia/            # Interactive movie quiz
│   ├── WatchHistory/      # Viewing history
│   └── Watchlist/         # Saved watchlist
│
├── store/                  # Redux Toolkit state management
│   ├── store.js           # Store configuration
│   ├── homeSlice.js       # API config & genres
│   ├── watchlistSlice.js  # Watchlist CRUD
│   ├── historySlice.js    # Watch history tracking
│   ├── searchFiltersSlice.js  # Filter state persistence
│   ├── comparisonSlice.js # Comparison items
│   └── themeSlice.js      # Theme preferences
│
└── utils/
    ├── api.js             # TMDB API client (axios)
    ├── groqApi.js         # Groq AI chat client
    └── reactSelectTheme.js # Custom react-select styling
```

---

## ▸ Key Features — Deep Dive

### CineBot (AI Assistant)
- Conversational AI powered by **Groq's LLaMA 3.3 70B** model
- Context-aware movie recommendations, plot summaries, actor bios
- Draggable chat window with persistent conversation history
- Smart context management (keeps last 10 messages)

### CineMatch (Swipe Discovery)
- Tinder-style card stack with swipe gestures
- **9 genre filters** for targeted discovery
- Undo support (Ctrl+Z), keyboard shortcuts (←/→)
- Session statistics tracking
- Infinite loading — automatically fetches more cards
- Mouse drag + touch support

### Moodify (Mood-Based Discovery)
- **12 mood categories** with custom gradients & icons
- Each mood maps to specific TMDB genre, keyword & quality filters
- Featured hero banner with backdrop & overview
- Shuffle button to randomize results across pages

### GlobeTrotter (World Cinema)
- **Interactive 3D globe** built with `react-globe.gl`
- Click any continent to discover films set in those locations
- Smooth camera transitions with auto-rotation

### CineGraph (Data Visualization)
- Force-directed graph with `react-force-graph-2d`
- Visualizes connections between actors, directors, and movies
- Node clustering with color-coded categories
- Click nodes to navigate to detail pages

### CineStream (Trailer Feed)
- Auto-playing video feed for visual-first discovery
- Swipe up/down to browse trailers
- Smooth transitions between videos

### Comparison Tool & Box Office Battle
- Side-by-side comparison of any two titles
- Ratings, cast, runtime, budget, revenue, release dates
- **Box Office Battle** — head-to-head financial comparison mode

### Interactive Trivia
- Multiple game modes: guess by year, tagline, or silhouette
- Timer-based challenges with score tracking
- AI-generated questions for endless variety

---

## ▸ Contributing

Contributions are welcome and appreciated! Please see our **[Contributing Guidelines](./CONTRIBUTING.md)** for detailed instructions on:

- Project setup & development workflow
- Coding and styling guidelines
- Commit conventions
- Pull request process
- Feature requests & bug reports

---

## ▸ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## ▸ Contact & Social

**Himanshu Gupta** — Solo Developer & Designer

| Platform | Link |
|---|---|
| ◆ **GitHub** | [@devhimanshuu](https://github.com/devhimanshuu) |
| ◆ **LinkedIn** | [Himanshu Gupta](https://www.linkedin.com/in/himanshu-guptaa/) |
| ◆ **Twitter / X** | [@devhimanshuu](https://twitter.com/devhimanshuu) |
| ◆ **Email** | devhimanshuu@gmail.com |
| ◆ **Blog** | [TechSphere](https://techsphere.hashnode.dev/) |

---

## ▸ Acknowledgments

- **[TMDB](https://www.themoviedb.org/)** — The world's largest movie database, powering our data
- **[Groq](https://groq.com/)** — Ultra-fast AI inference for CineBot
- **[React](https://react.dev/)** — The UI framework that makes it all possible
- All open-source contributors whose libraries made this project possible

---

> **If you found this project helpful, please give it a star!**  
> Made with love by [Himanshu Gupta](https://github.com/devhimanshuu)
