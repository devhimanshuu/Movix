# Contributing to Movix

Thank you for considering contributing to Movix! We welcome contributions of all kinds — bug fixes, new features, documentation improvements, and more.

This guide will help you get started with the development workflow.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Styling Guidelines](#styling-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Adding New Features](#adding-new-features)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Getting Help](#getting-help)

---

## Code of Conduct

This project is governed by the **[Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md)**. By participating, you agree to uphold its standards.

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainer at devhimanshuu@gmail.com.

---

## Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** (comes with Node.js) or **yarn**
- **TMDB API Key** — [Get one free](https://www.themoviedb.org/settings/api)
- **Groq API Key** — [Get one free](https://groq.com/) *(optional, only needed for CineBot)*

### Setup

1. **Fork the repository** by clicking the "Fork" button on GitHub.

2. **Clone your fork:**

   ```bash
   git clone https://github.com/your-username/Movix.git
   cd Movix
   ```

3. **Add the upstream remote:**

   ```bash
   git remote add upstream https://github.com/devhimanshuu/Movix.git
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **Set up environment variables:**

   Create a `.env` file in the project root:

   ```env
   VITE_APP_TMDB_TOKEN=your_tmdb_api_token_here
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

6. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app should now be running at `http://localhost:5173`.

---

## Development Workflow

1. **Create a branch** for your work:

   ```bash
   git checkout -b feature/your-feature-name
   ```

   Use a descriptive branch name:
   - `feature/` — new features (e.g., `feature/dark-mode-toggle`)
   - `fix/` — bug fixes (e.g., `fix/search-pagination`)
   - `docs/` — documentation changes (e.g., `docs/api-usage`)
   - `refactor/` — code refactoring (e.g., `refactor/carousel-logic`)
   - `style/` — styling changes (e.g., `style/header-responsive`)

2. **Make your changes** following the [Coding Guidelines](#coding-guidelines).

3. **Run the linter** to check for code quality issues:

   ```bash
   npm run lint
   ```

4. **Build the project** to verify everything compiles:

   ```bash
   npm run build
   ```

5. **Test your changes** manually in the browser at `http://localhost:5173`.

6. **Commit your changes** following the [Commit Guidelines](#commit-guidelines).

7. **Push and open a Pull Request:**

   ```bash
   git push origin feature/your-feature-name
   ```

   Then open a PR on GitHub from your branch to the `main` branch of the upstream repository.

---

## Project Structure

```
src/
├── assets/              # Static assets (images, fallbacks)
├── components/          # Reusable UI components
│   ├── BackToTop/      # Scroll-to-top button
│   ├── Carousel/       # Infinite scroll movie carousel
│   ├── CineBot/        # AI chat assistant
│   ├── ContentWrapper/ # Max-width layout wrapper
│   ├── CustomCursor/   # Custom cursor with trail effects
│   ├── Footer/         # Site footer
│   ├── Header/         # Navigation header with search
│   ├── MovieCard/      # Movie poster card component
│   ├── SearchFilters/  # Advanced filtering interface
│   ├── Spinner/        # Loading spinner
│   ├── SwitchTab/      # Tab switcher (movie/TV)
│   ├── VideoPopUp/     # Modal video player
│   └── genres/         # Genre badge pills
├── data/               # Static data files (language lists, etc.)
├── hooks/              # Custom React hooks
│   ├── useFetch.jsx    # Data fetching hook
│   └── useThemeSync.js # Theme sync hook
├── pages/              # Route-specific page components
│   ├── 404/           # Not found page
│   ├── CineGraph/     # Force-directed graph
│   ├── CineMatch/     # Swipe discovery
│   ├── CineStream/    # Trailer feed
│   ├── CmsPages/      # About, Blog, Contact, FAQ, Privacy, Terms
│   ├── Comparison/    # Title comparison + BoxOfficeBattle
│   ├── Details/       # Movie/TV detail pages
│   ├── Explore/       # Browse & filter
│   ├── GlobeTrotter/  # 3D globe explorer
│   ├── Home/          # Dashboard
│   ├── Landing/       # Marketing landing page
│   ├── MiddleGround/  # Shared genre finder
│   ├── Moodify/       # Mood-based discovery
│   ├── MysteryBox/    # Random picker
│   ├── PersonDetails/ # Actor/director page
│   ├── RegionalCinema/# Language collections
│   ├── SearchResult/  # Search results
│   ├── Trivia/        # Movie quiz
│   ├── WatchHistory/  # Viewing log
│   └── Watchlist/     # Saved collection
├── store/              # Redux Toolkit state management
│   ├── store.js       # Store configuration
│   ├── homeSlice.js   # API config & genres
│   ├── watchlistSlice.js
│   ├── historySlice.js
│   ├── searchFiltersSlice.js
│   ├── comparisonSlice.js
│   └── themeSlice.js
└── utils/
    ├── api.js         # TMDB API client
    ├── groqApi.js     # Groq AI client
    └── reactSelectTheme.js
```

**Component structure pattern** — each component/page lives in its own folder with a co-located `style.scss`:

```
ComponentName/
├── ComponentName.jsx
└── style.scss
```

---

## Coding Guidelines

### JavaScript / React

- Use **functional components** with hooks — no class components.
- Use **React 18** patterns (e.g., `createRoot` in `main.jsx`).
- Use **named exports** for context providers and **default exports** for page/component files.
- Destructure props at the component definition.
- Keep components **small and focused** — extract reusable logic into custom hooks.
- Use **`useCallback`** and **`useMemo`** only when profiling shows a genuine performance issue.

### State Management

- Use **Redux Toolkit** for global state (watchlist, history, filters, comparison, settings).
- Use **local component state** (`useState`) for UI-only state (modals, toggles, form inputs).
- Keep **Redux slices focused** — each slice should own a single domain of data.

### API Calls

- Use the central `fetchDataFromApi` utility in `src/utils/api.js` for all TMDB requests.
- Use the `useFetch` custom hook (`src/hooks/useFetch.jsx`) as the preferred way to fetch data in components — it automatically handles loading states.
- Use `fetchChatResponse` from `src/utils/groqApi.js` for CineBot AI requests.
- Handle loading, error, and empty states for every API-driven component.

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | `PascalCase` | `MovieCard`, `SearchFilters` |
| Files | `PascalCase` for components | `MovieCard.jsx` |
| Hooks | `camelCase` prefixed with `use` | `useFetch`, `useThemeSync` |
| Functions | `camelCase` | `fetchData`, `handleClick` |
| CSS classes | `kebab-case` with BEM-like naming | `.movie-card`, `.card__title` |
| Redux slices | `camelCase` | `watchlistSlice`, `homeSlice` |
| Constants | `UPPER_SNAKE_CASE` | `BASE_URL`, `TMDB_TOKEN` |

---

## Styling Guidelines

- **SCSS** is the styling language. Each component has a co-located `style.scss`.
- Follow the existing **glassmorphism design system** — use `rgba()` backgrounds with `backdrop-filter: blur()`.
- Use the **Sass variables and mixins** defined in `src/mixins.scss` for responsive breakpoints.
- Maintain **4 responsive breakpoints**:
  - `< 640px` — Mobile
  - `640px – 767px` — Small screens
  - `768px – 1023px` — Tablet
  - `1024px+` — Desktop
- Use the `ContentWrapper` component for consistent page widths.
- Avoid `!important` — use specificity instead.
- Keep animations subtle and purposeful — scroll-reveal effects should use `IntersectionObserver`.

---

## Commit Guidelines

We use **conventional commit messages** for clarity and automated changelog generation:

```
<type>: <short description>

[optional body]
```

### Types

| Type | Usage |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Styling changes (CSS/SCSS) — not code formatting |
| `docs` | Documentation changes |
| `perf` | Performance improvements |
| `chore` | Build process, dependencies, tooling |
| `ci` | CI/CD configuration changes |

### Examples

```
feat: add language filter to regional cinema page
fix: resolve infinite scroll duplicate items
style: improve glassmorphism card hover state
docs: update API key setup instructions
refactor: extract carousel into reusable component
```

---

## Pull Request Process

1. **Keep PRs small and focused** — one feature/fix per PR. Large changes should be broken into multiple PRs.

2. **Ensure your PR description clearly explains:**
   - What the change does
   - Why it's needed
   - How to test it (steps or screenshots)

3. **Before submitting, verify:**

   ```bash
   npm run lint       # No lint errors
   npm run build      # Builds successfully
   ```

4. **Link related issues** by including `Closes #123` or `Relates to #123` in the PR description.

5. **Update documentation** if your change adds or modifies a feature.

6. **Screenshots** are encouraged for UI changes — they help reviewers understand visual impact.

7. A maintainer will review your PR. Address any feedback by pushing new commits — avoid force-pushing unless requested.

---

## Adding New Features

When adding a new page or feature:

1. **Create a dedicated folder** under `src/pages/` (or `src/components/` for reusable components).
2. **Create the component** (`FeatureName.jsx`) and its styles (`style.scss`).
3. **Add the route** in `src/App.jsx` with a descriptive path.
4. **Wire up Redux** if the feature needs global state — create a new slice in `src/store/` if necessary.
5. **Fetch data** using the `useFetch` hook or the `fetchDataFromApi` utility — keep API logic in the component, not in Redux slices.
6. **Implement loading, empty, and error states** for every data-driven view.
7. **Test on mobile, tablet, and desktop** viewports.

### State Pattern

Every data-fetching component should handle these states:

```jsx
const Component = () => {
  if (loading) return <Spinner initial={true} />;
  if (error) return <div className="error-state">Something went wrong</div>;
  if (!data || data.length === 0) return <div className="empty-state">No results</div>;
  return <div>{/* render data */}</div>;
};
```

---

## Reporting Bugs

When opening a bug report, please include:

- **A clear and descriptive title**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots or screen recordings** (if applicable)
- **Browser and OS** information
- **Console errors** (if any) — open DevTools to check

---

## Feature Requests

Feature requests are welcome! When suggesting a new feature:

- **Explain the problem** you're trying to solve
- **Describe the solution** you'd like
- **Provide context** — how does this fit into Movix?
- **Be open to discussion** — the maintainer may have alternative suggestions

---

## Getting Help

If you need help with the setup, have questions about the codebase, or want to discuss an idea:

- **Open a Discussion** on the [GitHub repository](https://github.com/devhimanshuu/Movix/discussions)
- **Contact the maintainer** — Himanshu Gupta:
  - GitHub: [@devhimanshuu](https://github.com/devhimanshuu)
  - Email: devhimanshuu@gmail.com

---

Thank you for contributing to Movix! Every contribution, big or small, makes this project better.
