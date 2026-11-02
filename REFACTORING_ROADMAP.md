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

### 🟠 Fase 3: Rampingkan Sub-Halaman (`src/components/AboutMeSubPages.tsx`)
> *Target: Menyusutkan `AboutMeSubPages.tsx` dari ~1.488 baris menjadi < 150 baris.*
- [ ] Buat folder `src/components/subpages/`.
- [ ] Ekstrak masing-masing subhalaman:
  - [ ] `EducationSubPage.tsx` (Kartu pendidikan, layout split/hero, foto mask).
  - [ ] `PersonalitySubPage.tsx` (Grid kartu prinsip etos kerja).
  - [ ] `HobbiesSubPage.tsx` (Grid kartu hobi & minat personal).
  - [ ] `CareerGoalsSubPage.tsx` (Peta jalan target karir jangka panjang).
  - [ ] `CustomSubPageRenderer.tsx` (Renderer halaman kustom dinamis).
- [ ] Jadikan `AboutMeSubPages.tsx` sebagai switcher/router komponen anak.
- [ ] Jalankan verifikasi build: `npm run build`.

---

### 🟣 Fase 4: Rampingkan Modal Resume / CV (`src/components/ResumeModal.tsx`)
> *Target: Menyusutkan `ResumeModal.tsx` dari ~2.318 baris menjadi < 200 baris.*
- [ ] Buat folder `src/components/resume/`.
- [ ] Pindahkan logika pemrosesan foto bulat & PDF ke `src/components/resume/resumePdfHelper.ts`.
- [ ] Ekstrak toolbar kontrol (pilihan warna, font, spacing, toggle seksi) ke `ResumeControlsToolbar.tsx`.
- [ ] Ekstrak layout tampilan CV:
  - [ ] `SidebarCvLayout.tsx` (Tata letak sidebar kiri & kanan).
  - [ ] `SingleColumnCvLayout.tsx` (Tata letak satu kolom ATS standar).
- [ ] Jadikan `ResumeModal.tsx` sebagai modal wrapper yang bersih.
- [ ] Jalankan verifikasi build: `npm run build`.

---

### 🔴 Fase 5: Rampingkan Quick Editor Drawer (`src/components/QuickEditorDrawer.tsx`)
> *Target: Memecah file raksasa ~10.685 baris menjadi modul-modul panel kecil.*
- [ ] Buat folder `src/components/editor/` dan `src/components/editor/panels/`.
- [ ] Ekstrak panel editor konten:
  - [ ] `ProfileEditorPanel.tsx` (Nama, gelar, bio hero, status badge).
  - [ ] `SocialSeoEditorPanel.tsx` (Kontak, akun medsos, simulasi preview WhatsApp & SEO).
  - [ ] `ExperienceEditorPanel.tsx` (Linimasa kerja, AI bullet generator, editor tanggal).
  - [ ] `ProjectsEditorPanel.tsx` (Studi kasus, metrik dampak, editor slide PPT).
  - [ ] `SkillsEditorPanel.tsx` (Kategori skill, item skill, logo SVG).
  - [ ] `SubpagesEditorPanel.tsx` (Pendidikan, nilai kepribadian, hobi, tujuan karir).
- [ ] Ekstrak panel studio desain & aset:
  - [ ] `FloatingAssetsPanel.tsx` (Pengaturan ornamen floating SVG & mobile coordinates).
  - [ ] `BackgroundPatternPanel.tsx` (Pilihan motif Wagara & geometris).
  - [ ] `ThemeColorShadowPanel.tsx` (Palet warna mode terang/gelap, gradient shadow).
  - [ ] `IdCardPhysicsPanel.tsx` (Kustomisasi lanyard kartu identitas 3D).
- [ ] Rampingkan `QuickEditorDrawer.tsx` menjadi shell navigasi tab (~200 baris).
- [ ] Jalankan verifikasi build akhir: `npm run build`.

---

## 📌 Catatan Riwayat Branch
* Branch aktif pengerjaan refactoring: **`dev`**
* Branch produksi aman: **`main`**

