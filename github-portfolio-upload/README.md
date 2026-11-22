# Aurum Nexus — Executive Portfolio Website
### Siva Prasad Reddy Paleti — Technology Entrepreneur, Business Administrator & Innovator

A premium, cinematic personal portfolio website built with **React 18**, **Three.js / React Three Fiber**, **GSAP**, **Lenis**, **Framer Motion**, and **Tailwind CSS**. Designed under the **"Aurum Nexus"** aesthetic (dark luxury meets future technology: obsidian dark backgrounds, liquid gold gradients, glowing node networks, and subtle film grain).

---

## ✨ Features

- **100% Static & Free to Deploy**: Zero database, zero backend, zero authentication, and zero cloud storage costs. Ready for instant 1-click deployment on **Vercel** or **Netlify**.
- **Dynamic File-Drop Media Engine**: Drop images or videos into subfolders under `src/media/`, and Vite’s build system automatically categorizes, formats, sorts, and displays them across the site without editing a single line of code or JSON.
- **Cinematic 3D Hero Scene**: Thousands of gold nodes slowly forming a rotating constellation globe that responds to mouse parallax, illuminated by postprocessing Bloom, and smoothly dispersing into floating particles on scroll. Includes high-performance mobile scaling and a graceful CSS/SVG fallback if WebGL is unavailable.
- **Buttery-Smooth GSAP & Lenis Choreography**: Synced smooth scrolling, velocity-reactive infinite marquees, and pinned horizontal-scroll pillars.
- **Interactive 3D Wireframe Icosahedron**: An interactive Three.js icosahedron in the About section that rotates and responds to cursor coordinates.
- **Luxury Global Experience**:
  - Monogram "SP" SVG stroke drawing preloader with 0–100 counter and split curtain reveal (runs once per session).
  - Custom trailing cursor with gold ring expansion and contextual "VIEW" and "PLAY" modes (automatically disabled on touch screens).
  - Floating glass pill navbar with scroll-direction awareness and animated active route indicator.
  - Full-screen responsive mobile navigation overlay with staggered entrance.
  - Liquid gold gradient shimmer text and subtle animated film-grain texture.
  - Lightbox media viewer with zoom, swipe gestures, thumbnails, and slideshow support.
  - Support for local MP4/WebM videos with silent hover preview and YouTube/Vimeo embeds.

---

## 🚀 Quick Start (Local Development)

### 1. Requirements
- Node.js `v18.0.0` or higher (tested on Node 20 & 26)
- npm `v9.0.0` or higher

### 2. Install & Run
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build & Static Preview
```bash
# Type-check and compile static bundle into /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Media System: Adding Photos & Videos

The media system in `src/lib/media.ts` uses Vite's `import.meta.glob` to automatically discover all media assets at build time.

### 1. Main Profile Photo
Place your portrait photo at:
```
src/media/profile/profile.jpg
```
*(Accepts `.jpg`, `.png`, `.webp`, or `.avif`).*
If missing, the site gracefully displays an elegant gold "SP" geometric monogram placeholder.

---

### 2. Adding Photos
Create subfolders inside `src/media/photos/` for each category. Any folder name is automatically converted into a clean display title and category filter chip:

```
src/media/photos/
├── keynotes/
│   ├── 2026-global-tech-summit.jpg
│   └── architecture-symposium.png
├── ventures/
│   ├── 2025-fintech-launch.webp
│   └── innovation-board-meeting.jpg
└── leadership/
    └── executive-retreat.jpg
```

- **Folder Name → Category Name**:
  - `keynotes` → `Keynotes`
  - `strategic-partnerships` → `Strategic Partnerships`
  - Photos in the root `src/media/photos/` folder default to `General`.
- **Filename → Title**:
  - `2026-global-tech-summit.jpg` automatically formats to **"Global Tech Summit"**.
  - Prefixing with a date like `2026-02-18-launch.jpg` ensures reverse chronological sorting.

---

### 3. Adding Videos
Drop `.mp4` or `.webm` files into `src/media/videos/<category>/`:

```
src/media/videos/
├── talks/
│   ├── future-of-saas.mp4
│   └── future-of-saas.jpg    <-- Optional custom video poster
└── demos/
    └── automation-pipeline.mp4
```

- **Video Posters**: Place an image with the **exact same name** (e.g. `future-of-saas.jpg`) alongside the video. If omitted, the browser automatically captures the first frame.
- **Desktop Hover Preview**: Hovering over any video card on desktop plays a silent muted preview!

#### 💡 Avoiding GitHub's 100 MB Limit (YouTube & Vimeo Links)
GitHub has a strict **100 MB per file limit**, and repositories can become slow if large `.mp4` files are committed.
You can host videos for free on YouTube or Vimeo and list them in `src/media/videos/links.json`:

```json
[
  {
    "title": "Building Resilient SaaS Products & Strategic Architecture",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "category": "Talks",
    "description": "Keynote presentation detailing architectural principles for high-availability enterprise SaaS solutions."
  }
]
```
The site automatically pulls high-resolution video thumbnails and launches an ad-free embedded player in the modal!

---

### 4. Custom Captions & Dates
To provide rich custom titles, descriptions, and dates, edit `src/media/captions.json`:

```json
{
  "keynote-global-strategy.jpg": {
    "title": "Global Tech Strategy Summit",
    "description": "Keynote address on identifying exponential market curves, scaling organizational capabilities, and leading transformative change.",
    "date": "2026-02-18"
  }
}
```

---

### 5. Media Compression Script
To ensure fast load times and a 90+ Lighthouse score, optimize your photos to compressed WebP with a single command:

```bash
npm run optimize
```
This script:
1. Backs up original full-res photos to `src/media/photos_backup/`.
2. Resizes large images to max width 2000px.
3. Converts images into lightweight WebP format.

---

## ⚙️ Customizing Content & Social Links

All text content, email, and social profiles are managed in a single file:
👉 `src/config/site.ts`

```typescript
export const siteConfig = {
  name: 'Siva Prasad Reddy Paleti',
  eyebrow: 'TECHNOLOGY ENTREPRENEUR · BUSINESS ADMINISTRATOR · INNOVATOR',
  tagline: 'Business Builder | Strategy, Leadership & Growth',
  email: 'paletispreddy@gmail.com',
  
  socials: {
    linkedin: 'https://www.linkedin.com/in/paletispreddy',
    x: 'https://x.com/paletispreddy',
    instagram: 'https://www.instagram.com/paletispreddy',
    youtube: 'https://www.youtube.com/@paletispreddy',
    github: 'https://github.com/paletispreddy',
    whatsapp: 'https://wa.me/919912211045',
  },
  // ...
};
```

---

## 🌐 Free Deployment Guide

### Option 1: Deploy Free on Vercel
1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Aurum Nexus portfolio"
   git branch -M main
   git remote add origin https://github.com/your-username/portfolio.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**.
6. The included `vercel.json` already contains SPA route rewrites so deep links like `/about` or `/photos` never 404!

### Option 2: Deploy Free on Netlify
1. Log in to [Netlify](https://netlify.com).
2. Click **"Add new site"** → **"Import an existing project"** → Select **GitHub**.
3. Select your repository.
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy site**.
6. The included `public/_redirects` file (`/* /index.html 200`) ensures client-side routing works seamlessly on reload.

---

## 🛡️ Architecture & Tech Stack

| Layer | Library / Tool |
|---|---|
| **Framework** | React 18 + TypeScript + Vite |
| **Routing** | React Router (`react-router-dom` v6) |
| **3D Rendering** | Three.js + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` (Bloom) |
| **Animations** | GSAP (ScrollTrigger) + Framer Motion |
| **Smooth Scrolling** | Lenis |
| **Styling** | Tailwind CSS (Custom Aurum Nexus Obsidian & Gold Tokens) |
| **Media Lightbox** | Yet Another React Lightbox (Zoom, Captions, Thumbnails, Slideshow) |
| **Icons** | Lucide React |
| **Typography** | Google Fonts: Fraunces (Optical Size/Soft), Inter, JetBrains Mono |
| **Image Pipeline** | Sharp |

---

© 2026 Siva Prasad Reddy Paleti. Built with Aurum Nexus.
