# 🚀 Web Portfolio

Aplikasi portofolio web interaktif dan futuristik berkinerja tinggi yang dirancang khusus untuk profesional di bidang Data Analytics dan Software Engineering. Dibangun dengan arsitektur modular yang ramping (< 300 baris per komponen), studio preset tema & tata letak dinamis, kartu ID lanyard fisika 3D Rapier, kursor cair (*liquid gooey cursor*), presentasi studi kasus interaktif bergaya pitch-deck, pembuat Resume ATS otomatis dengan ekspor PDF, serta sinkronisasi data lokal melalui `portfolioData.ts` sebagai sumber kebenaran tunggal (*single source of truth*).

---

## ✨ Fitur Utama

- **🌐 Sinkronisasi Dua Bahasa (Bilingual)**: Beralih mulus antara Bahasa Indonesia (`ID`) dan Bahasa Inggris (`EN`) di seluruh seksi, sub-halaman, dan metadata tanpa memuat ulang halaman (*zero page reload*).
- **🎨 Studio Preset Tema & Tata Letak (Template Studio)**: Katalog preset langsung untuk mengubah tema warna (contoh: *Executive Sapphire*, *Japanese Zen Minimalist*, *Tsukimi Midnight*) serta blueprint tata letak seksi Profil dan Projek.
- **🪪 Kartu ID Lanyard Fisika 3D Interaktif**: Kartu identitas 3D interaktif berbasis simulasi fisika *rigid-body* nyata menggunakan `@react-three/fiber` dan `@react-three/rapier`.
- **✨ Kursor Cair (Liquid Gooey Cursor)**: Efek jejak kursor kanvas dinamis bergaya cairan (*gooey*) yang merespons pergerakan mouse dengan pengaturan fisika dan warna yang dapat dikustomisasi.
- **🌊 Pola Latar Belakang SVG & Mesin Ornamen Melayang**: Pola SVG performa tinggi (Wagara tradisional Jepang, Geometris Bauhaus/Memphis, Cat Air) serta ornamen melayang (*floating assets*) dengan animasi masuk dan mengapung.
- **📱 Simulator Mockup Perangkat Seluler**: Pratinjau interaktif layar HP langsung di browser lengkap dengan rotasi orientasi, gaya bezel, dan simulasi viewport mobile yang akurat.
- **📊 Presentasi Studi Kasus & Viewer Pitch-Deck**: Penampil slide presentasi interaktif layar penuh untuk membedah studi kasus data, metodologi, dan stack teknologi secara mendalam.
- **📄 Resume (CV) Standar ATS & Ekspor PDF**: Modal pratinjau CV format A4 standar ATS dengan optimasi styling cetak dan pengunduhan file PDF langsung menggunakan `html2pdf.js`.
- **⚡ Visual CMS & Quick Editor Drawer**: Laci penyuntingan visual di dalam halaman dengan pratinjau real-time, asisten AI untuk poin pengalaman & alih bahasa, serta ekspor sekali klik ke `portfolioData.ts`.
- **✉️ Formulir Kontak Direct Gmail**: Formulir kontak terintegrasi yang secara otomatis membuka Gmail dengan subjek dan isi pesan yang sudah terformat rapi.

---

## 🛠️ Teknologi & Pustaka

- **Framework Utama**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/) + [esbuild](https://esbuild.github.io/)
- **Desain & Tampilan**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi**: [Motion](https://motion.dev/) (Framer Motion API)
- **Grafika 3D & Fisika**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/rapier](https://github.com/pmndrs/react-three-rapier)
- **Integrasi AI**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Rich Text & Format Teks**: `react-markdown`
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Ekspor PDF**: `html2pdf.js`
- **Lingkungan Server**: Express (Node.js) via `tsx`

---

## 📁 Arsitektur Proyek Modular

Codebase menerapkan standar modularitas tinggi dengan prinsip **Separation of Concerns** dan batasan ketat **< 300 baris per file**:

```text
├── public/                      # Aset statis, avatar, dan ikon
├── src/
│   ├── components/              # 9 Subdirektori Domain Terisolasi
│   │   ├── admin/               # Panel admin dan halaman login otentikasi
│   │   ├── common/              # Komponen UI reusable (MarkdownText, SocialIcon, TechLogo)
│   │   ├── editor/              # Quick Editor CMS Drawer, Theme Studio & Panel
│   │   │   ├── drawer/          # Header, TabBar, BodyRouter, ModalsManager, Handlers
│   │   │   ├── panels/          # Panel editor konten, desain grafis, dan medsos/CV
│   │   │   └── ThemeTemplateStudio/ # Studio katalog preset tema, layout & aset SVG
│   │   ├── effects/             # Efek visual kanvas & fisika interaktif
│   │   │   ├── GooeyCursor/     # Fisika kursor cair & elemen head
│   │   │   ├── Lanyard/         # Fisika kartu ID card 3D Rapier
│   │   │   ├── mockup/          # Simulator perangkat mobile
│   │   │   └── BackgroundTextures.tsx, FloatingAssetsOverlay.tsx, BorderGlow.tsx
│   │   ├── layout/              # Shell navigasi web (Navbar, MobileNav, Footer)
│   │   ├── modals/              # Dialog interaktif (ProjectDetail, Asisten AI & Alih Bahasa)
│   │   ├── resume/              # Dokumen Resume A4 ATS, layout & modul cetak
│   │   ├── sections/            # Seksi-seksi utama landing page (Hero, Skills, Projects, Experience, Contact)
│   │   │   └── skills/          # SkillCard, DetailedView, tab filter kategori
│   │   ├── subpages/            # Sub-halaman eksplorasi interaktif
│   │   │   ├── custom/          # Halaman dinamis kustom buatan pengguna
│   │   │   ├── gallery/         # Galeri visual studi kasus
│   │   │   ├── presentation/    # Slide presentasi pitch-deck proyek
│   │   │   ├── sections/        # Blok seksi detail (Pendidikan, Kepribadian, Hobi, Target Karir)
│   │   │   └── story/           # Narasi linimasa perjalanan karir
│   │   └── index.ts             # Central barrel export seluruh domain
│   │
│   ├── data/                    # Single Source of Truth & Katalog Preset
│   │   ├── patterns/            # String SVG motif pola (Wagara Jepang, Geometris, Cat Air)
│   │   ├── layoutTemplates.ts   # Blueprint preset tata letak
│   │   ├── themeTemplates.ts    # Preset palet warna dan tema
│   │   ├── themeAssets.ts       # Katalog ornamen SVG mandiri
│   │   └── portfolioData.ts     # Konfigurasi aktif dan seluruh data teks
│   │
│   ├── lib/                     # Utilitas penyimpanan lokal, tema warna, client API
│   ├── types/                   # Antarmuka (interfaces) & model data TypeScript
│   ├── App.tsx                  # Orkestrator layout aplikasi utama
│   ├── main.tsx                 # Entry point aplikasi sisi klien
│   └── index.css                # CSS Global & impor Tailwind CSS
│
├── server.ts                    # Server Express untuk dev & runtime produksi
├── package.json                 # Dependensi proyek & skrip npm
├── vite.config.ts               # Konfigurasi bundler Vite
└── tsconfig.json                # Konfigurasi compiler TypeScript
```

---

## 🚀 Panduan Memulai

### Prasyarat

Pastikan perangkat Anda telah terpasang:
- **Node.js**: `v18.x` atau versi yang lebih baru
- **npm**: `v9.x` atau versi yang lebih baru

### Langkah Instalasi

1. **Kloning repositori**:
   ```bash
   git clone https://github.com/ZufarFz/zufar-portfolio.git
   cd zufar-portfolio
   ```

2. **Pasang seluruh dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Server Pengembang**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada peramban (*browser*) Anda.

---

## 📜 Skrip yang Tersedia

Di dalam direktori proyek, Anda dapat menjalankan perintah berikut:

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan fullstack lokal pada port 3000 |
| `npm run build` | Melakukan build produksi teroptimasi dengan Vite dan bundling server dengan esbuild |
| `npm run start` | Menjalankan server hasil kompilasi produksi (`dist/server.cjs`) |
| `npm run preview` | Meninjau hasil build klien produksi secara lokal |
| `npm run lint` | Melakukan pengecekan tipe statis TypeScript (`tsc --noEmit`) |
| `npm run clean` | Menghapus folder direktori artefak build produksi (`dist/`) |

---

## 📄 Lisensi

Proyek ini bersifat sumber terbuka (*open-source*) dan dilindungi di bawah [Lisensi MIT](LICENSE).
