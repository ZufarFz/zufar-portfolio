# 🚀 Web Portfolio

An interactive, high-performance, futuristic portfolio application built for Data Analytics and Software Engineering professionals. Designed with a sleek, responsive aesthetic, dark/light theme switcher, multi-language support (English & Indonesian), interactive case study presentations, dynamic resume generator, and real-time backend integration via Supabase.

---

## ✨ Key Features

- **🌐 Dual Language Support (Bilingual)**: Instant seamless switching between English (`EN`) and Bahasa Indonesia (`ID`).
- **🌓 Dynamic Theme Engine**: Smooth dark/light mode toggle with optimized contrast and WebKit autofill styling.
- **🪪 Interactive Holographic ID Card**: Cyberpunk-inspired 3D animated identity card featuring interactive hover & motion effects.
- **📊 Interactive Case Studies & PPT Slide Editor**: Interactive slide deck viewer for data analysis projects, featuring presentation previews and custom slide editing capabilities.
- **📄 Live Resume (CV) Generator & PDF Export**: Interactive CV modal with instant PDF downloading powered by `html2pdf.js`.
- **🛠️ Tech Skills Arsenal**: Categorized skills showcase with filter tabs, proficiency indicators, and detailed tool breakdowns.
- **✉️ Direct Gmail Contact Integration**: Streamlined contact form that opens pre-filled messages directly in Gmail web composer with customized subject lines and message body.
- **⚡ Admin Panel & Supabase Backend**: Integrated CMS capabilities for dynamic content management and real-time data persistence.
- **📱 Responsive Smart Navigation**: Header navigation bar that automatically auto-hides when scrolling down and reappears when scrolling up.

---

## 🛠️ Tech Stack & Libraries

- **Core Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion API)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase JS Client](https://supabase.com/) (`@supabase/supabase-js`)
- **PDF Generation**: `html2pdf.js`
- **Server Environment**: Express (Node.js)

---

## 📁 Project Architecture

```
├── public/                  # Static assets and icons
├── src/
│   ├── components/          # Reusable UI Components
│   │   ├── AboutMeStoryPage.tsx         # Personal story & timeline
│   │   ├── AboutMeSubPages.tsx          # Detailed bio sub-pages
│   │   ├── AdminPage.tsx                # Supabase content management panel
│   │   ├── BackgroundTextures.tsx       # Decorative canvas backgrounds
│   │   ├── CaseStudyPresentationPage.tsx# Interactive case study deck
│   │   ├── ContactForm.tsx              # Pre-filled Gmail contact form
│   │   ├── InteractiveIDCard.tsx        # 3D Cyberpunk ID Card component
│   │   ├── PPTSlideEditor.tsx           # Slide presentation editor
│   │   ├── ResumeModal.tsx              # Interactive CV preview & PDF exporter
│   │   ├── SkillsArsenal.tsx            # Categorized skills matrix
│   │   └── SocialIcon.tsx               # Brand & social media icons
│   ├── data/                # Static data & configuration files
│   ├── lib/                 # Utility libraries (Supabase client init)
│   │   └── supabaseClient.ts
│   ├── App.tsx              # Main Application Container & Router
│   ├── index.css            # Global CSS, Tailwind import & Autofill styling
│   ├── main.tsx             # Application Entry Point
│   └── types.ts             # Shared TypeScript Interfaces
├── .env.example             # Environment variable template
├── metadata.json            # Application metadata
├── package.json             # NPM dependencies & scripts
└── tsconfig.json            # TypeScript configuration
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

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the local Vite development server on port 3000 |
| `npm run build` | Builds the optimized production bundle in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Executes TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Removes build artifacts (`dist/`) |

---

## 📄 License

This project is licensed under the MIT License.
