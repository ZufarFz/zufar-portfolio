# 🚀 Web Portfolio

An interactive, high-performance, futuristic portfolio application built for Data Analytics and Software Engineering professionals. Features a modular architecture (< 300 lines per component), dynamic theme and layout preset studio, 3D Rapier physics lanyard card, liquid gooey cursor, interactive case studies with pitch-deck slides, ATS resume generator with PDF export, and local data synchronization powered by `portfolioData.ts` as the single source of truth.

---

## ✨ Key Features

- **🌐 Bilingual Synchronization**: Instant seamless switching between English (`EN`) and Bahasa Indonesia (`ID`) across all sections, sub-pages, and metadata without page reloads.
- **🎨 Theme & Layout Template Studio**: Live preset catalog to switch color themes (e.g., *Executive Sapphire*, *Japanese Zen Minimalist*, *Tsukimi Midnight*) and layout blueprints for Hero and Projects sections.
- **🪪 3D Interactive Rapier Physics Lanyard Card**: Real-time 3D identity badge simulated with `@react-three/fiber` and `@react-three/rapier` physical rigid-body physics.
- **✨ Liquid Gooey Cursor**: Dynamic canvas liquid gooey cursor trail that follows mouse movements with customizable physics and colors.
- **🌊 Background Patterns & Floating Ornaments Engine**: High-performance SVG patterns (Traditional Japanese Wagara, Bauhaus/Memphis Geometric, Watercolor) and configurable floating visual assets.
- **📱 Responsive Mobile Mockup Simulator**: Interactive in-browser phone preview with device rotation, bezel styles, and realistic mobile viewport simulation.
- **📊 Interactive Case Studies & Pitch-Deck Viewer**: Full-screen interactive slide presentation viewer with key findings, methodology, and tech stack breakdowns.
- **📄 ATS Resume (CV) Generator & PDF Export**: A4 standard ATS resume preview modal with print-optimized CSS and direct PDF download powered by `html2pdf.js`.
- **⚡ Visual CMS & Quick Editor Drawer**: In-page visual editing drawer with live preview, AI assistant for bullet points and translations, and single-click export to `portfolioData.ts`.
- **✉️ Direct Gmail Contact Integration**: Pre-formatted contact form that automatically opens Gmail with customized subject lines and message bodies.

---

## 🛠️ Tech Stack & Libraries

- **Core Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/) + [esbuild](https://esbuild.github.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion API)
- **3D Graphics & Physics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/rapier](https://github.com/pmndrs/react-three-rapier)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Rich Text & Formatting**: `react-markdown`
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: `html2pdf.js`
- **Server Runtime**: Express (Node.js) via `tsx`

---

## 📁 Modular Project Architecture

The codebase adheres to a strict modular design pattern with **Separation of Concerns** and a **< 300 lines per file** constraint:

```text
├── public/                      # Static assets, avatars, and icons
├── src/
│   ├── components/              # 9 Isolated Domain Subdirectories
│   │   ├── admin/               # Admin panel & authentication pages
│   │   ├── common/              # Reusable UI widgets (MarkdownText, SocialIcon, TechLogo)
│   │   ├── editor/              # Visual CMS Drawer, Theme Studio & Panels
│   │   │   ├── drawer/          # Header, TabBar, BodyRouter, ModalsManager, Handlers
│   │   │   ├── panels/          # Content, Design, and Social/CV panels
│   │   │   └── ThemeTemplateStudio/ # Preset Studio for themes, layouts & SVG catalog
│   │   ├── effects/             # Visual effects & canvas physics
│   │   │   ├── GooeyCursor/     # Liquid cursor physics & elements
│   │   │   ├── Lanyard/         # 3D Rapier ID badge lanyard physics
│   │   │   ├── mockup/          # Mobile phone device simulator
│   │   │   └── BackgroundTextures.tsx, FloatingAssetsOverlay.tsx, BorderGlow.tsx
│   │   ├── layout/              # Shell navigation (Navbar, MobileNav, Footer)
│   │   ├── modals/              # Interactive dialogs (ProjectDetail, AI & Translation modals)
│   │   ├── resume/              # ATS Resume A4 document, layouts & exporter
│   │   ├── sections/            # Landing page sections (Hero, Skills, Projects, Experience, Contact)
│   │   │   └── skills/          # SkillCard, DetailedView, Filter tabs
│   │   ├── subpages/            # Interactive sub-pages
│   │   │   ├── custom/          # Dynamic user-created pages
│   │   │   ├── gallery/         # Case studies visual showcase
│   │   │   ├── presentation/    # Pitch-deck presentation slides
│   │   │   ├── sections/        # Detail sections (Education, Personality, Hobbies, Goals)
│   │   │   └── story/           # Narrative career timeline
│   │   └── index.ts             # Central barrel export
│   │
│   ├── data/                    # Single Source of Truth & Presets
│   │   ├── patterns/            # Isolated SVG patterns (Wagara, Geometric, Watercolor)
│   │   ├── layoutTemplates.ts   # Blueprint layout presets
│   │   ├── themeTemplates.ts    # Color palette & styling presets
│   │   ├── themeAssets.ts       # Standalone SVG ornaments catalog
│   │   └── portfolioData.ts     # Active portfolio configuration & texts
│   │
│   ├── lib/                     # Storage helpers, theme utilities, API clients
│   ├── types/                   # TypeScript interfaces and shared models
│   ├── App.tsx                  # Application layout coordinator
│   ├── main.tsx                 # Client entry point
│   └── index.css                # Global CSS & Tailwind imports
│
├── server.ts                    # Express development & production server
├── package.json                 # Dependencies and build scripts
├── vite.config.ts               # Vite configuration
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ZufarFz/zufar-portfolio.git
   cd zufar-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local fullstack development server on port 3000 |
| `npm run build` | Builds the optimized production bundle with Vite and bundles the Node server with esbuild |
| `npm run start` | Runs the compiled production server (`dist/server.cjs`) |
| `npm run preview` | Previews the production Vite client build locally |
| `npm run lint` | Runs TypeScript static type checking (`tsc --noEmit`) |
| `npm run clean` | Deletes the production `dist/` build directory |

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
