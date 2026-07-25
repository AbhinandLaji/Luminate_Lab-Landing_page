# Luminate Lab — Landing Page

> A high-performance, animated landing page for **Luminate Lab** — a performance-driven customer acquisition agency. Built with React 19 + Vite 7, featuring rich micro-animations, client-side routing, and a fully responsive mobile experience.

---

## ✨ Features

- 🎨 **Animated Hero** — Typewriter headline, Aurora wave background, magnetic CTA buttons, and a floating particle field
- 📜 **Scroll-driven Sections** — Problem → Our Edge → Why Us → CTA, each with scroll-triggered animations via Framer Motion
- 🌊 **WebGL Aurora** — GPU-accelerated aurora wave rendered via `ogl` (OGL WebGL library)
- 📱 **Mobile-first** — Dedicated mobile nav, floating CTA, and swipe carousel for touch devices
- 🔗 **Client-side Routing** — SPA routing without React Router; custom `popstate`-based link interceptor
- 📄 **Details Page** — Deep-linked `/details` route with anchors (`#solution`, `#process`, `#contact`)
- 🔒 **Security Headers** — `X-Frame-Options`, `X-XSS-Protection`, `CSP` headers pre-configured in `vercel.json`
- ⚡ **Optimised Build** — Manual chunk splitting for `react-vendor` and `framer-motion` for better cache hit rates

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Build Tool | [Vite 7](https://vitejs.dev/) |
| Animations | [Framer Motion 12](https://www.framer.com/motion/) |
| WebGL | [OGL](https://github.com/oframe/ogl) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + Vanilla CSS |
| Linting | [ESLint 9](https://eslint.org/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
luminate-labs/
├── public/                   # Static assets (favicon, og-image, robots.txt, sitemap)
├── src/
│   ├── components/
│   │   ├── mobile/
│   │   │   ├── FloatingCTA.jsx       # Sticky mobile CTA button
│   │   │   ├── MobileNav.jsx         # Slide-in mobile navigation drawer
│   │   │   └── SwipeCarousel.jsx     # Touch swipe carousel
│   │   ├── AmbientAurora.jsx         # Ambient glow background effect
│   │   ├── AnimatedSection.jsx       # Scroll-triggered section wrapper
│   │   ├── AuroraWave.jsx            # WebGL aurora wave (via OGL)
│   │   ├── CTASection.jsx            # Call-to-action section
│   │   ├── ContactSection.jsx        # Contact form section
│   │   ├── DetailsPage.jsx           # /details route page
│   │   ├── Footer.jsx                # Site footer
│   │   ├── GradualBlur.jsx           # Gradual blur scroll effect
│   │   ├── HeroSection.jsx           # Hero with typewriter + magnetic buttons
│   │   ├── Navbar.jsx                # Desktop navigation bar
│   │   ├── OurEdgeSection.jsx        # "Our Edge" differentiators section
│   │   ├── ParticleField.jsx         # Animated particle background
│   │   ├── ProblemSection.jsx        # Problem statement section
│   │   ├── ProcessSection.jsx        # How-we-work process section
│   │   ├── ScrollProgress.jsx        # Top scroll progress indicator bar
│   │   ├── SolutionSection.jsx       # Solution overview section
│   │   ├── Strands.jsx               # Animated strand lines effect
│   │   └── WhyUsSection.jsx          # Why Luminate Lab section
│   ├── hooks/
│   │   ├── TiltCard.jsx              # 3D tilt card component
│   │   ├── useTilt.js                # Mouse-tracking tilt hook
│   │   └── useTypewriter.js          # Typewriter animation hook
│   ├── App.jsx                       # Root component + client-side router
│   ├── App.css                       # App-level styles
│   ├── index.css                     # Global design tokens & base styles
│   └── main.jsx                      # React entry point
├── dist/                             # Production build output (git-ignored)
├── index.html                        # HTML shell
├── vite.config.js                    # Vite + Tailwind config with chunk splitting
├── vercel.json                       # Vercel deployment & security headers config
├── eslint.config.js                  # ESLint flat config
└── package.json                      # Dependencies & npm scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+** (v20 LTS recommended)
- **npm** (bundled with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Luminate_Lab-Landing_page.git
cd Luminate_Lab-Landing_page
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
npm run dev -- --host  ### To start on a specific port
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.  
The page hot-reloads automatically as you edit source files.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR at `localhost:5173` |
| `npm run build` | Build optimised production bundle to `/dist` |
| `npm run preview` | Serve the production build locally at `localhost:4173` |
| `npm run lint` | Run ESLint across the codebase |

---

## 🏗️ Building for Production

```bash
npm run build
```

The `/dist` folder will contain the fully optimised, minified site.  
Chunks are split automatically:

- `react-vendor` — React + ReactDOM (cached separately)
- `framer` — Framer Motion (large library, isolated for better caching)

### Preview Locally After Build

```bash
npm run preview
# → http://localhost:4173
```

### Serve with Python (Alternative)

```bash
python -m http.server 8000 --directory dist
# → http://localhost:8000
```

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)

This project is pre-configured for Vercel via [`vercel.json`](./vercel.json):

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Vercel auto-detects Vite — click **Deploy**

The `vercel.json` handles:
- **SPA rewrites** — all routes fallback to `index.html` (required for client-side routing)
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`
- **Cache headers** — immutable 1-year cache for hashed assets in `/assets/`

### Manual / Other Hosts

Since this is a pure SPA, configure your host to serve `index.html` for all routes (e.g., Nginx `try_files $uri /index.html`).

---

## 🌐 Pages & Routes

| Route | Description |
|---|---|
| `/` | Main landing page (Hero → Problem → Our Edge → Why Us → CTA) |
| `/details` | Detailed systems & infrastructure page |
| `/details#solution` | Deep-links to the Solution section |
| `/details#process` | Deep-links to the Process section |
| `/details#contact` | Deep-links to the Contact section |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the terms of the [LICENSE](./LICENSE) file.