# AGENTS.md — Standar Arsitektur, Aturan Refactoring & Roadmap Proyek

Dokumen ini adalah pedoman teknis utama (*living specification*) bagi agen AI dan pengembang dalam memodifikasi, menambah fitur, maupun mengelola codebase portofolio ini.

---

## 1. Filosofi & Prinsip Desain Codebase

Sistem portofolio dibangun dengan pendekatan **Separation of Concerns**, **Modularitas Tinggi**, dan **Single Source of Truth**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESET & BLUEPRINT DATA                         │
│             (src/data/*Templates.ts & src/data/patterns/)             │
├──────────────────────────┬─────────────────────────────┬───────────────┤
│   📐 Template Layout     │      🎨 Template Tema       │  🌊 SVG Motif │
│  - Grid & hierarki       │  - Palet Light/Dark         │  - Wagara     │
│  - Skala profil/banner   │  - Aksentuasi & kontras     │  - Geometris  │
│  - Floating assets rule  │  - Warna badge & elemen     │  - Cat air    │
└─────────────┬────────────┴──────────────┬──────────────┴───────┬───────┘
              │                           │                      │
              ▼ [ "Gunakan Template" / "Pilih Motif" / CMS ]      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     SINGLE SOURCE OF TRUTH AKTIF                       │
│             (src/data/portfolioData.ts & Browser localStorage)         │
│                                                                        │
│  - Seluruh teks (bilingual ID/EN), link sosial, dan aset visual        │
│    tersinkronisasi secara otomatis tanpa perlu mengubah index.html.   │
│  - Ekspor data TS selalu menghasilkan konfigurasi siap pakai terbaru.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Aturan Batas Ukuran File (File Length Constraint)

1. **Batas Maksimal Baris File**:
   - **Target ideal**: **150 – 250 baris** per file.
   - **Batas toleransi maksimal**: **300 baris** per file.
   - **DILARANG KERAS** membuat file monolitik atau membiarkan file bertumbuh hingga ribuan baris.

2. **Strategi Pemecahan Jika File Mendekati 300 Baris**:
   - **Coordinator Component**: Komponen utama hanya berfungsi sebagai orkestrator (state level atas, passing props, routing tab).
   - **Domain Sub-components**: Pecah tampilan menjadi komponen kecil (Header, Footer, TabBar, CardItem, dsb.).
   - **Custom Hooks**: Ekstraksi logika state kompleks (misal: dragging window, pengelolaan modal, router context) ke folder `hooks/`.
   - **Handler & Helper Utilities**: Logika mutasi array/objek (CRUD, bilingual syncing) dipisahkan ke file `*Handlers.ts` atau `*Helpers.ts`.
   - **Types & Constants**: Pindahkan interface, type definition, dan konstanta statis ke file `types.ts` atau `constants.ts` terisolasi.

---

## 3. Arsitektur Struktur Folder Komponen (`src/components/`)

**Aturan Root Komponen**:
> Di root `src/components/`, **TIDAK BOLEH** ada file komponen lepasan (`.tsx`, `.ts`, `.css`). Satu-satunya file yang diperbolehkan di root `src/components/` adalah `index.ts` sebagai barrel export utama.

Setiap komponen harus ditempatkan ke dalam subfolder domain yang sesuai:

```text
src/components/
├── 📁 admin/                 # Halaman panel login & dashboard administrasi
│   ├── AdminLoginPage.tsx
│   └── index.ts
│
├── 📁 common/                # Komponen utilitas & UI reusable lintas halaman
│   ├── MarkdownText.tsx      # Rich text renderer (Bold, Link, Code, List)
│   ├── SocialIcon.tsx        # Render ikon medsos & brand styling
│   ├── TechLogo.tsx          # Render logo tech stack & SVG
│   ├── socialSvgMap.tsx
│   ├── techLogoSvgs.tsx
│   └── index.ts
│
├── 📁 editor/                # Sistem Visual CMS & Quick Editor Drawer
│   ├── QuickEditorDrawer.tsx # Drawer shell & coordinator (< 300 baris)
│   ├── BackgroundPatternSelector.tsx
│   ├── ExperiencePeriodEditor.tsx
│   ├── 📁 drawer/            # Header, TabBar, AssetTabBar, BodyRouter, ModalsManager, Handlers
│   ├── 📁 panels/            # Panel editor konten, desain grafis, dan medsos/CV
│   ├── 📁 ThemeTemplateStudio/ # Studio katalog preset tema, layout, & aset SVG
│   └── index.ts
│
├── 📁 effects/               # Efek visual, canvas physics & interaktivitas
│   ├── BackgroundTextures.tsx # Pattern dispatcher
│   ├── BorderGlow.tsx        # Border animasi glow
│   ├── FloatingAssetsOverlay.tsx # Ornamen melayang dengan animasi
│   ├── SectionGradientShadow.tsx # Bayangan gradasi halus
│   ├── MobilePhoneMockup.tsx # Simulator device mobile
│   ├── 📁 GooeyCursor/       # Liquid gooey cursor & physics
│   ├── 📁 Lanyard/           # 3D Rapier lanyard ID card physics
│   └── index.ts
│
├── 📁 layout/                # Shell navigasi web
│   ├── Navbar.tsx
│   ├── MobileNav.tsx
│   ├── Footer.tsx
│   └── index.ts
│
├── 📁 modals/                # Seluruh dialog modal interaktif
│   ├── ProjectDetailModal.tsx
│   ├── AIAssistantModal.tsx
│   ├── JobExperienceAiModal.tsx
│   ├── ExperienceTranslateModal.tsx
│   ├── SubpageItemTranslateModal.tsx
│   └── index.ts
│
├── 📁 resume/                # Modul ATS Resume A4 & export dokumen
│   ├── ResumeModal.tsx
│   ├── ResumeModalHeader.tsx
│   ├── ResumeModalFooter.tsx
│   ├── CvDocument.tsx
│   └── index.ts
│
├── 📁 sections/              # Seksi-seksi utama halaman landing page
│   ├── HeroSection.tsx
│   ├── SkillsSection.tsx
│   ├── SkillsArsenal.tsx     # Tech stack arsenal coordinator
│   ├── 📁 skills/            # Card item, detail view, filter tabs
│   ├── ProjectsSection.tsx
│   ├── ExperienceSection.tsx
│   ├── ContactSection.tsx
│   ├── ContactForm.tsx
│   └── index.ts
│
├── 📁 subpages/              # Sub-halaman interaktif dan detail profil
│   ├── AboutMeSubPages.tsx
│   ├── 📁 custom/            # Halaman dinamis kustom buatan user
│   ├── 📁 gallery/           # Galeri showcase studi kasus projek
│   ├── 📁 presentation/      # Slide presentasi projek gaya pitch-deck
│   ├── 📁 sections/          # Sub-seksi (pendidikan, kepribadian, hobi, target karir)
│   ├── 📁 story/             # Kisah perjalanan karir naratif
│   └── index.ts
│
└── 📄 index.ts               # Central barrel export seluruh domain
```

---

## 4. Standar Modularisasi Data & Pola Latar Belakang

1. **Pemisahan String SVG Masif**:
   - Kode SVG string berukuran besar dilarang diletakkan langsung di dalam komponen UI.
   - Simpan di folder `src/data/patterns/`:
     - `japaneseWagara.tsx`: Motif tradisional Jepang (Asanoha, Seigaiha, Shippo, Sayagata, dll.).
     - `modernGeometric.tsx`: Motif modern (Bauhaus, Memphis, Isometric Grid, Circuit, dll.).
     - `watercolorTextures.tsx`: Tekstur cat air halus.
   - Ornamen mandiri / elemen custom disimpan di `src/data/themeAssets.ts`.

2. **Blueprint Templates**:
   - `src/data/layoutTemplates.ts`: Menyimpan tata letak dan konfigurasi floating asset.
   - `src/data/themeTemplates.ts`: Menyimpan palet warna light/dark dan preset tema lengkap.

---

## 5. Alur Kerja Git & Jaminan Kualitas (Quality Assurance)

1. **Branching Strategy**:
   - Pekerjaan refactoring, perbaikan bug, dan penambahan fitur selalu dilakukan di branch **`dev`** (atau branch fitur turunan dari `dev`).
   - Jangan langsung mengubah branch `main` tanpa pengujian menyeluruh di `dev`.

2. **Zero Regression Build Mandate**:
   - Setiap selesai melakukan modifikasi struktur atau refactoring, **WAJIB** menjalankan:
     ```bash
     npm run build
     ```
   - Build harus menghasilkan **exit code 0** (0 error TypeScript, 0 import putus).

3. **Aturan Push Remote**:
   - Lakukan commit lokal secara bertahap dengan pesan yang deskriptif (misal: `refactor(components): ...`, `fix(editor): ...`).
   - **Hanya lakukan `git push origin dev` jika ada instruksi eksplisit dari pengguna.**

---

## 6. Roadmap Pengembangan Sistem Template

- [x] **Tahap 1**: Fondasi arsitektur, `themeAssets.ts`, Layout Template Profil, Theme Template "Asahi & Tsukimi" (Japanese Zen Minimalist & Midnight), dan isolasi motif latar belakang.
- [x] **Refactoring Codebase**: Modularisasi seluruh `src/components/` ke dalam 9 domain terisolasi dengan batas tegas < 300 baris per file.
- [ ] **Tahap 2**: Template Layout & Tema untuk Seksi Projects / Case Studies (Grid Card, Minimalist List, Showcase Hero).
- [ ] **Tahap 3**: Template Layout & Tema untuk Seksi Skills & Arsenal (Interactive Radar, Minimal Tags, Interactive Grid).
- [ ] **Tahap 4**: Template Layout & Tema untuk Seksi Experience & Sub-Pages (Pendidikan, Kepribadian, Hobi, Target Karir).
- [ ] **Tahap 5**: Ekspor / Impor Custom Preset buatan pengguna (JSON / TS package).
