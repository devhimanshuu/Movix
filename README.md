# 🎬 Movix - Your Ultimate Movie Discovery Platform

> A premium, feature-rich movie discovery platform that goes far beyond traditional movie databases. Built with React, Redux, and powered by TMDB API.

![Movix Banner](public/Movix-home.png)

## ✨ What Makes Movix Special

Movix isn't just another movie database—it's a complete entertainment companion with AI-powered features, interactive tools, and a stunning glassmorphism UI that works flawlessly across all devices.

## 🚀 Core Features

### 🎯 **Discovery & Search**
- **Advanced Search**: Lightning-fast search across 1M+ movies and TV shows
- **Smart Filters**: Filter by genre, rating, release date, and more
- **Trending**: Real-time trending content updated hourly from TMDB
- **Browse by Genre**: Explore curated collections across 20+ genres

### 🤖 **AI-Powered Features**

#### **CineBot** - Your AI Movie Assistant
- Ask anything about movies, actors, or directors
- Get instant recommendations based on your mood
- Discover plot summaries, trivia, and behind-the-scenes facts
- Powered by advanced AI for natural conversations

#### **CineMatch** - Similarity Engine
- Find movies that *feel* the same
- Analyzes themes, mood, visuals, and narrative style
- Discover hidden gems you'd never find by genre alone

#### **CineStream** - Where to Watch
- Instantly see where any title is streaming
- Covers 50+ platforms: Netflix, Prime, Hulu, Disney+, and more
- Save time switching between apps

### 🎮 **Interactive Features**

#### **Moodify** - Mood-Based Discovery
- Tell us how you feel
- Get personalized movie recommendations based on your current mood
- Analyzes tone, themes, and emotional resonance

#### **Trivia** - Test Your Film Knowledge
- AI-generated questions across difficulty levels
- Compete, learn, and discover new facts
- Perfect for movie buffs

#### **Mystery Box** - Random Discovery
- Click for a completely random recommendation
- No filters, pure surprise
- Discover films you'd never search for

#### **GlobeTrotter** - World Cinema Explorer
- Interactive world map
- Click any country to explore its best films
- Discover cinema from 190+ countries

### 📊 **Organization & Tracking**

- **Watchlist**: Build and manage your personal watchlist
- **Watch History**: Track everything you've watched
- **Comparison Tool**: Compare any two titles side-by-side
  - Ratings, cast, runtime, revenue, reviews
  - Beautiful visual diff interface
- **Local Storage**: All data stored on your device—zero accounts needed

### 🎨 **Premium UI/UX**

- **Glassmorphism Design**: Modern, translucent card-based interface
- **Scroll-Triggered Animations**: Smooth reveal animations as you scroll
- **Responsive**: Flawless experience on desktop, tablet, and mobile
- **Touch-Optimized**: Perfect touch interactions on mobile devices
- **Dark Theme**: Easy on the eyes with a cinematic dark aesthetic

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **SCSS/Sass** - Styling with mixins and responsive breakpoints
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and dev server

### **APIs & Services**
- **TMDB API** - Movie and TV show data
- **AI Integration** - For CineBot conversational features

### **Key Libraries**
- `react-lazy-load-image-component` - Optimized image loading
- `react-circular-progressbar` - Rating visualizations
- `dayjs` - Date formatting
- `react-icons` - Icon library

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/devhimanshuu/Movix.git
   cd Movix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_APP_TMDB_TOKEN=your_tmdb_api_token_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Responsive Design

Movix is fully responsive with breakpoints at:
- **Mobile**: < 640px
- **Small**: 640px - 767px
- **Medium**: 768px - 1023px
- **Large**: 1024px+

All features work seamlessly across devices with touch-optimized interactions on mobile.

## 🎯 Feature Highlights

### Landing Page
- Cinematic hero section with auto-rotating movie backdrops
- Animated marquee ticker
- Glassmorphism feature cards
- Trending movie showcase with hover overlays
- Interactive genre pills
- Rotating signature badge with LinkedIn link

### Movie/TV Details Page
- Comprehensive information display
- Cast and crew with bios
- Trailers and videos
- Similar recommendations
- User reviews
- Streaming availability

### Search & Filters
- Real-time search results
- Advanced filtering options
- Sort by popularity, rating, release date
- Infinite scroll pagination

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Himanshu Gupta**

- 🐦 Twitter: [@devhimanshuu](https://twitter.com/devhimanshuu)
- 💼 LinkedIn: [Himanshu Gupta](https://www.linkedin.com/in/himanshu-guptaa/)
- 📧 Email: devhimanshuu@gmail.com
- 📝 Blog: [TechSphere](https://techsphere.hashnode.dev/)
- 🐙 GitHub: [@devhimanshuu](https://github.com/devhimanshuu)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the comprehensive movie database API
- [React](https://react.dev/) team for the amazing framework
- All open-source contributors whose libraries made this possible

---

**⭐ If you found this project helpful, please give it a star!**

Made with ❤️ by [Himanshu Gupta](https://github.com/devhimanshuu)
