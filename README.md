# 🪐 Prathamesh Bhagwat | Interactive Developer Portfolio

<div align="center">

[![Live Site](https://img.shields.io/badge/Live_Site-prathamesh--bhagwat--portfolio.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://prathamesh-bhagwat-portfolio.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19.2-20232a?style=for-the-badge&logo=react&logoColor=61dafb)](https://react.dev/)
[![GSAP](https://img.shields.io/badge/GSAP_3.15-88ce02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)
[![Lenis](https://img.shields.io/badge/Lenis_Scroll-purple?style=for-the-badge)](https://github.com/darkroomengineering/lenis)

<p align="center">
  A premium, performance-optimized, interactive space-themed developer portfolio showcasing expertise in <b>Artificial Intelligence</b>, <b>Data Science</b>, and <b>Full-Stack Engineering</b>.
</p>

</div>

---

## 📸 Core Digital Experiences & Highlights

### 🤖 1. AI Portfolio Companion (With Voice Synthesis)
An interactive chat assistant built directly into the site using streaming SSE APIs:
* **LLM Streaming:** Dynamic, real-time message streams utilizing server-sent events for responsive interaction.
* **Imperative UI Actions:** The AI can scroll the user to specific sections, initiate resume downloads, or redirect to social channels based on conversation context.
* **Multilingual TTS Engine:** Integrated Web Speech Synthesis Context API providing localized voice narration in English, Hindi, and Marathi with live tracking.

### 🎙️ 2. Equalizer Voice Introduction Card
A high-fidelity custom media introduction module:
* **Lazy-loaded Audio:** Avoids eager network loads on startup. Prefetches only when played to respect mobile bandwidth constraints.
* **Active Waveform:** A reactive 15-bar equalizer showing a dynamic CSS animation during playback.
* **Player Dashboard:** Variable speed playback toggles (1x, 1.25x, 1.5x), smooth scrubbing timeline, and a slide-out synchronized text transcript drawer.

### 🪐 3. 3D Saturn Tech Orbit & Interactive Holographic Card
* **Interactive Hover Shearing:** The "About Me" profile utilizes real-time mouse-pointer coordinates to apply a perspective rotation matrix and a dynamic radial sheen light spotlight. 
* **Zero-Lag Input Rendering:** Bypasses React rendering cycles by using a single throttled `requestAnimationFrame` loop that writes coordinates directly to DOM styles.
* **Satellite Lang Orbit:** Interactive labels showcasing core competencies orbiting a 3D-axis center around the avatar.

### 📊 4. Interactive LeetCode Heatmap Activity Tracker
A custom client component simulating a live performance grid:
* Tracks active metrics (total solved, active days, current streak).
* Fully interactive columns of problem counts with tooltip states and CSS-themed intensity variations.

---

## 🛠️ The Cosmic Tech Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Framework & Engine** | Next.js 16.2 (App Router), React 19.2, Turbopack |
| **Animation Systems** | GSAP (GreenSock), Framer Motion, CSS Keyframes |
| **Scrolling Engine** | Lenis Scroll (momentum scroll synced with GSAP ScrollTrigger) |
| **Icons & Media** | React Icons (Fa, Si, Fi, Bi, Di, Tb) |
| **Form Management** | Web3Forms Direct Client Integration |

---

## ⚡ Under-the-Hood Mobile Performance Engineering
Optimized to target a sustained **60+ FPS on mid-range Android devices** and smooth inertia scrolling on iOS:

1. **24 GPU Layers Replaced:** Removed heavy `backdrop-filter: blur` properties from the 3D rotating cube faces (Experience grid) and substituted solid semi-transparent layers to reduce rasterization overload.
2. **Paint Cycle Throttling:** Moved continuous CSS shadow rotations off the main thread; looping keyframe shadows were disabled on mobile viewports.
3. **Throttled Chat Stream Rendering:** AI responses batch raw text characters locally and flush to React state inside a `requestAnimationFrame` queue to prevent CPU thrashing.
4. **Optimized Section Boundaries:** Replaced placeholder layout dimensions with precise, section-specific `contain-intrinsic-size` constraints.

---

## 🚀 Setting Up Locally

Clone the spaceship and fire up the local dev server:

### 1. Prerequisite Installations
Make sure you have Node.js installed on your local computer.

### 2. Install Dependencies
```bash
git clone https://github.com/PrathameshBhagwat/Portfolio.git
cd Portfolio
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 📡 Galactic Communication Channels
Let's build something smarter:
- **LinkedIn:** [Prathamesh Bhagwat](https://www.linkedin.com/in/prathamesh-bhagwat-52b651258/)
- **LeetCode Profile:** [@Prathamesh_Bhagwat_31](https://leetcode.com/u/Prathamesh_Bhagwat_31/)
- **Email Contact:** [bhagwatprathamesh2626@gmail.com](mailto:bhagwatprathamesh2626@gmail.com)
- **Live Deployment:** [Visit Site](https://prathamesh-bhagwat-portfolio.vercel.app/)
