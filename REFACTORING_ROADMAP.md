# 🗺️ Roadmap Refactoring & Modularisasi Codebase

Dokumen ini adalah panduan teknis dan checklist bertahap untuk memecah file-file gemuk (*monolithic*) di portofolio menjadi komponen-komponen kecil yang modular, bersih, dan mudah dikelola (target: **150 – 300 baris per file**).

---

## 🎯 Prinsip & Standar Refactoring

1. **Zero Regression (Nol Kerusakan)**:
   - Setiap kali 1 sub-tugas/fase selesai, lakukan tes build (`npm run build`) untuk memastikan tidak ada import yang putus atau tipe TypeScript yang salah.
2. **Keterbacaan & Pemisahan Peran (Single Responsibility Principle)**:
   - File UI hanya berisi layout dan rendering.
   - String data masif (seperti kode SVG ratusan baris) dipisahkan ke file data tersendiri.
   - Logika kalkulasi/helper dipisahkan ke folder utilitas `src/lib/`.
3. **Preservasi Single Source of Truth**:
   - Struktur data aktif tetap bersumber dari `portfolioData.ts` dan sinkronisasi `localStorage` untuk mode preview.

---

## 🏛️ Desain Arsitektur Folder Sasaran

```text
src/
├── components/
│   ├── layout/                  # Navigasi, footer, kursor, dan latar belakang
│   │   ├── Navbar.tsx
│   │   ├── MobileNavDrawer.tsx
│   │   └── GooeyCursor.tsx
│   │
│   ├── sections/                # Seksi-seksi halaman utama (pecahan App.tsx)
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   └── ContactSection.tsx
│   │
│   ├── subpages/                # Sub-halaman detail (pecahan AboutMeSubPages.tsx)
│   │   ├── EducationSubPage.tsx
│   │   ├── PersonalitySubPage.tsx
│   │   ├── HobbiesSubPage.tsx
│   │   ├── CareerGoalsSubPage.tsx
│   │   └── CustomSubPageRenderer.tsx
│   │
│   ├── resume/                  # Modul Resume & CV (pecahan ResumeModal.tsx)
│   │   ├── ResumeModal.tsx      # Modal frame & state
│   │   ├── ResumeControls.tsx   # Toolbar pengaturan margin, font, warna
│   │   ├── layouts/             # Template tampilan CV
│   │   │   ├── SidebarCvLayout.tsx
│   │   │   └── SingleColumnCvLayout.tsx
│   │   └── resumePdfHelper.ts   # Helper ekspor html2pdf & canvas bulat
│   │
│   ├── editor/                  # Modular CMS Drawer (pecahan QuickEditorDrawer.tsx)
│   │   ├── QuickEditorDrawer.tsx# Shell drawer & tab router utama (~200 baris)
│   │   ├── tabs/
│   │   │   ├── ContentEditorTab.tsx
│   │   │   └── DesignStudioTab.tsx
│   │   └── panels/
│   │       ├── ProfileEditorPanel.tsx
│   │       ├── SocialSeoEditorPanel.tsx
│   │       ├── ExperienceEditorPanel.tsx
│   │       ├── ProjectsEditorPanel.tsx
│   │       ├── SkillsEditorPanel.tsx
│   │       ├── SubpagesEditorPanel.tsx
│   │       ├── FloatingAssetsPanel.tsx
│   │       ├── BackgroundPatternPanel.tsx
│   │       └── ThemeColorShadowPanel.tsx
│   │
│   └── common/                  # Komponen pendukung kecil
│       ├── TechLogo.tsx
│       ├── SocialIcon.tsx
│       ├── MarkdownText.tsx
│       └── BorderGlow.tsx
│
├── data/
│   ├── patterns/                # Kode SVG murni pola latar belakang
│   │   ├── japaneseWagara.ts
│   │   └── modernGeometric.ts
│   ├── layoutTemplates.ts
│   ├── themeTemplates.ts
│   ├── themeAssets.ts
│   └── portfolioData.ts
```

---

## 📋 Checklist Eksekusi Bertahap

### 🟢 Fase 1: Rampingkan Motif SVG & Background (Paling Aman & Instan)
> *Target: Menyusutkan `BackgroundTextures.tsx` dari ~1.560 baris menjadi < 250 baris (Selesai!).*
- [x] Buat folder `src/data/patterns/`.
- [x] Pindahkan 13 konstanta SVG Wagara Jepang ke `src/data/patterns/japaneseWagara.tsx`.
- [x] Pindahkan 10 konstanta SVG Geometris Modern ke `src/data/patterns/modernGeometric.tsx`.
- [x] Pindahkan 4 tekstur cat air ke `src/data/patterns/watercolorTextures.tsx`.
- [x] Refactor `BackgroundTextures.tsx` menjadi registry dispatcher ramping (~245 baris).
- [x] Jalankan verifikasi build: `npm run build` (Status: PASS 100%).

---

### 🟢 Fase 2: Rampingkan Halaman Utama (`src/App.tsx`)
> *Target: Menyusutkan `App.tsx` dari ~3.570 baris dengan memisahkan seksi modular, layout navigasi, dan lokalisasi (Selesai!).*
- [x] Buat folder `src/components/layout/` dan pindahkan navigasi & footer:
  - [x] `Navbar.tsx` (Bilah navigasi desktop dengan scroll-hide otomatis & down arrow).
  - [x] `MobileNav.tsx` (Bilah navigasi mobile & drawer).
  - [x] `Footer.tsx` (Footer profesional terpadu & tombol medsos).
  - [x] `navUtils.ts` (Helper styling status aktif navigasi).
- [x] Buat folder `src/components/sections/` dan ekstrak masing-masing seksi halaman:
  - [x] `HeroSection.tsx` (Typewriter, avatar masking, CTA buttons, layout fluid).
  - [x] `ProjectsSection.tsx` (Kartu studi kasus, mode popup minimal vs default bento).
  - [x] `SkillsSection.tsx` (SkillsArsenal wrapper & deskripsi seksi).
  - [x] `ExperienceSection.tsx` (Linimasa kerja, accordion animated collapsible).
  - [x] `ContactSection.tsx` (Seksi form kontak terpadu).
- [x] Ekstrak engine terjemahan & kamus ke `src/lib/localization.ts`.
- [x] Ekstrak `TypewriterText` ke `src/components/common/TypewriterText.tsx`.
- [x] Bersihkan `App.tsx` (turun drastis dari 3.573 baris menjadi ~1.360 baris, memangkas lebih dari 2.200 baris kode monolitik!).
- [x] Jalankan verifikasi build: `npm run build` (Status: PASS 100%).

---

### 🟢 Fase 3: Rampingkan Sub-Halaman (`src/components/AboutMeSubPages.tsx`)
> *Target: Menyusutkan `AboutMeSubPages.tsx` dari ~1.488 baris menjadi < 160 baris (Selesai!).*
- [x] Buat folder `src/components/subpages/`.
- [x] Ekstrak modul & helper subhalaman:
  - [x] `ProjectsGallerySubPage.tsx` (Gallery showcase 3D slider melingkar & grid kartu studi kasus, ~320 baris).
  - [x] `SubPageSectionItem.tsx` (Renderer lembar naratif: layout split/stacked/hero, orientasi gambar, mode latar halus, dan tautan kredensial resmi, ~390 baris).
  - [x] `CustomSubPage.tsx` (Renderer template halaman custom/preset, hero header, fallback generation, dan bottom fade, ~235 baris).
  - [x] `subpageUtils.tsx` (Helper `createFadeGradientStyle`, `IconMap`, `renderIcon`, dan komponen `SmoothImage`).
  - [x] `index.ts` (Barrel re-export subpages).
- [x] Refactor `AboutMeSubPages.tsx` menjadi router/switcher yang sangat ramping (turun dari 1.488 baris menjadi 154 baris!).
- [x] Jalankan verifikasi build: `npm run build` (Status: PASS 100%).

---

### 🟣 Fase 4: Rampingkan Modal Resume / CV (`src/components/ResumeModal.tsx`)
> *Target: Menyusutkan `ResumeModal.tsx` dari ~2.318 baris menjadi < 200 baris.*
- [x] Buat folder `src/components/resume/`.
- [x] Pindahkan logika pemrosesan foto bulat & PDF ke `src/components/resume/resumePdfHelper.ts`, `resumeStyles.ts`, `resumeWordExporter.ts`.
- [x] Ekstrak komponen header & footer CV: `CvHeader.tsx`, `CvFooter.tsx`.
- [x] Ekstrak renderer seksi CV: `CvSectionRenderer.tsx` (arsenal, education, experience, methodology).
- [x] Satukan dokumen cetak & inline preview ke `layouts/CvDocument.tsx`.
- [x] Jadikan `ResumeModal.tsx` sebagai modal wrapper yang bersih (turun dari 2.318 baris ke ~350 baris).
- [x] Jalankan verifikasi build: `npm run build` (Berhasil 100% tanpa error).

---

### 🔴 Fase 5: Rampingkan Quick Editor Drawer (`src/components/QuickEditorDrawer.tsx`)
> *Target: Memecah file raksasa ~10.850 baris menjadi modul-modul panel kecil (Selesai!).*
- [x] Buat folder `src/components/editor/` dan arsitektur panel `src/components/editor/panels/`:
  - [x] `types.ts` & `editorUtils.ts` (Tipe data, konstanta medsos presets, default categories, dan helper bilingual extraction).
  - [x] **Panel Konten (`src/components/editor/panels/content/`)**:
    - [x] `ProfileEditorPanel.tsx` (Hero & Identitas profil umum, ~210 baris).
    - [x] `AboutStoryEditorPanel.tsx` (Kisah saya, custom subpage list, ~250 baris).
    - [x] `ProjectsEditorPanel.tsx` (Studi kasus & proyek, ~270 baris).
    - [x] `SkillsEditorPanel.tsx` (Kategori skill, item skill, logo SVG, ~630 baris).
    - [x] `ExperienceEditorPanel.tsx` (Linimasa kerja, AI bullet generator, editor tanggal, ~400 baris).
    - [x] `ContactEditorPanel.tsx` (Formulir kontak & footer, ~60 baris).
    - [x] `SubpagesEditorPanel.tsx` (Pendidikan, nilai kepribadian, hobi, tujuan karir, custom subpages, ~935 baris).
    - [x] `index.ts` (Re-export barrel).
  - [x] **Panel Media Sosial & CV Studio (`src/components/editor/panels/social/`)**:
    - [x] `SocialLinksPanel.tsx` (Media sosial, kontak matrix, dan simulasi preview WhatsApp / SEO, ~560 baris).
    - [x] `CvMethodologyPanel.tsx` (Teks metodologi utama, editor bilingual & AI transfer, ~385 baris).
    - [x] `CvLayoutEditorPanel.tsx` (Visualizer mini tata letak kolom skill, header, & foto profil CV, ~620 baris).
    - [x] `index.ts` (Re-export barrel).
  - [x] **Panel Desain & Studio Visual (`src/components/editor/panels/design/`)**:
    - [x] `BackgroundPatternPanel.tsx` (Pola Jepang Wagara, geometris, watercolor, SVG kustom, ~230 baris).
    - [x] `FloatingAssetsPanel.tsx` (Ornamen visual melayang, rotasi, durasi animasi masuk, simulasi HP / Desktop, ~650 baris).
    - [x] `ThemeColorsPanel.tsx` (Palet warna background terang/gelap, aksen tema, navbar, ~460 baris).
    - [x] `ThemeShadowsPanel.tsx` (Bayangan gradasi sisi tepi & ketebalan, ~420 baris).
    - [x] `ImagesBannersPanel.tsx` (Aset foto avatar profil, banner sub-halaman & masking hero, ~830 baris).
    - [x] `IdCardPhysicsPanel.tsx` (ID Card vektor, tag grup, portrait fade, ~100 baris).
    - [x] `GooeyCursorPanel.tsx` (Gooey liquid metaball cursor, reaksi emot hover, splash klik, ~280 baris).
    - [x] `index.ts` (Re-export barrel).
- [x] Rampingkan `QuickEditorDrawer.tsx` dari monolit 10.850 baris turun drastis menjadi shell controller bersih (~1.250 baris, memangkas lebih dari 9.600 baris kode monolitik!).
- [x] Jalankan verifikasi build: `npm run build` (Status: PASS 100% tanpa error).
- [x] Jalankan verifikasi build akhir: `npm run build` (Status: PASS 100%, 0 error, build time ~10 detik).

---

### 🟢 Fase 6: Modularisasi Sub-pages & Presentation Domain (< 300 Baris Per File)
> *Target: Merapikan seluruh folder `src/components/subpages/` dan memecah file presentasi & story ke sub-folder domain terisolasi dengan batas ketat < 300 baris per file (Selesai!).*
- [x] **Domain `sections/` (`src/components/subpages/sections/`)**:
  - `sectionThemeHelpers.ts` (~219 baris): Resolusi warna latar belakang & pemetaan detail entitas terhubung.
  - `SectionCredentialBadge.tsx` (~33 baris): Badge animasi verifikasi kredensial resmi.
  - `SectionMediaCard.tsx` (~116 baris): Card ilustrasi gambar normal & background overlay dengan masking gradasi.
  - `SubPageSectionItem.tsx` (~249 baris): Koordinator layout split-grid vs centered-hero.
  - `index.ts` (Re-export barrel).
- [x] **Domain `gallery/` (`src/components/subpages/gallery/`)**:
  - `ProjectsGalleryActiveCard.tsx` (~87 baris): Panel kartu aktif dengan deskripsi, tag tools, dan tombol eksternal.
  - `ProjectsGalleryThumbnails.tsx` (~168 baris): Slider carousel 3D melingkar, kalkulasi indeks relatif & tombol navigasi.
  - `ProjectsGallerySubPage.tsx` (~146 baris): Background transisi gambar layar penuh, listener resize responsif, dan orkestrator state.
  - `index.ts` (Re-export barrel).
- [x] **Domain `story/` (`src/components/subpages/story/`)**:
  - `StoryHeaderBanner.tsx` (~90 baris): Banner background gambar atas dengan gradasi fade dinamis & judul.
  - `StoryMobileQuickGrid.tsx` (~103 baris): Tombol navigasi cepat 2-kolom mobile & resolver ikon kustom.
  - `StoryPointsGrid.tsx` (~273 baris): Kartu bilateral desktop 3-kiri & 3-kanan serta seksi bab tambahan.
  - `AboutMeStoryPage.tsx` (~243 baris): Physics canvas 3D lanyard Rapier, tekstur SVG, dan floating assets.
  - `index.ts` (Re-export barrel).
- [x] **Domain `presentation/` (`src/components/subpages/presentation/`)**:
  - `SlideVisualShowcase.tsx` (~171 baris): Showcase visual deck salindia (metrik pertumbuhan, diagram model kurva, bullet points, kutipan tipografi).
  - `CaseStudyPresentationPage.tsx` (~264 baris): Pengendali presentasi, slideshow otomatis 5 detik, navigasi keyboard (panah kiri/kanan), dan bilah progres.
  - `index.ts` (Re-export barrel).
- [x] **Domain `custom/` (`src/components/subpages/custom/`)**:
  - `customSubpageHelpers.ts` (~113 baris): Generator entitas fallback (personality, hobbies, skills, career journey).
  - `CustomSubPage.tsx` (~196 baris): Halaman subpage dinamis fleksibel.
  - `index.ts` (Re-export barrel).
- [x] **Barrel Pusat (`src/components/subpages/index.ts`)**: Re-export terpusat untuk semua domain.
- [x] Seluruh file dalam domain subpages kini **100% di bawah 300 baris** (rata-rata 80 - 270 baris).
- [x] Jalankan verifikasi build: `npm run build` (Status: PASS 100%, 0 error).

---

## 📌 Catatan Riwayat Branch
* Branch aktif pengerjaan refactoring: **`dev`**
* Branch produksi aman: **`main`**

