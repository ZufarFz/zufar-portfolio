# AGENTS.md — Arsitektur & Roadmap Sistem Template Web

Dokumen ini adalah panduan teknis dan blueprint arsitektural untuk sistem **Template Layout** dan **Template Tema Warna** di portofolio.

---

## 1. Filosofi & Pemisahan Konsep

Sistem template dirancang dengan pendekatan modular (*separation of concerns*):

```
┌────────────────────────────────────────────────────────┐
│                   PRESET TEMPLATES                     │
│  (Read-only Blueprint di src/data/*Templates.ts)       │
├──────────────────────────┬─────────────────────────────┤
│   📐 Template Layout     │      🎨 Template Tema       │
│  - Tata letak & grid     │  - Palet warna Light/Dark   │
│  - Besaran foto profil   │  - Motif background SVG     │
│  - Posisi floating asset │  - Warna teks, badge, CTA   │
│  - Ukuran hierarki font  │  - Warna ornamen & aksen    │
└─────────────┬────────────┴──────────────┬──────────────┘
              │                           │
              ▼ [ Klik: "Gunakan Template" ] ▼
┌────────────────────────────────────────────────────────┐
│             SINGLE SOURCE OF TRUTH AKTIF               │
│          (portfolioData.ts / localStorage)             │
│                                                        │
│  - Data langsung disuntikkan ke state aktif            │
│  - Pengguna bebas mengubah nilai apa pun secara manual │
│  - Ekspor/Download selalu menghasilkan data terbaru    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Struktur File & Modul

1. **`src/data/themeAssets.ts`**:
   - Wadah terisolasi untuk menyimpan kode SVG murni (ornamen Jepang, geometris, ilustrasi, dll.).
   - Pengguna bisa paste manual kode SVG kustom atau mengganti aset tanpa merusak data utama.

2. **`src/data/layoutTemplates.ts`**:
   - Katalog blueprint tata letak per-halaman/per-muka.
   - Tahap 1: Khusus Halaman Profil / Hero (`heroLayoutTemplates`).

3. **`src/data/themeTemplates.ts`**:
   - Katalog blueprint palet warna, background pattern, dan styling per-halaman/per-muka.
   - Termasuk tema **"Asahi & Tsukimi"** (Japanese Minimalist & Midnight) dan tema bawaan **"Executive Sapphire"**.

4. **`src/components/QuickEditorDrawer.tsx`**:
   - Menyediakan UI pemilihan template per-muka.
   - Tombol *Apply / Gunakan* menyuntikkan template ke `CVData.webTexts`, `CVData.floatingAssets`, dan pengaturan layout.

---

## 3. Roadmap Pengembangan Bertahap (Step-by-Step)

- [x] **Tahap 1 (Sekarang)**: Fondasi arsitektur, `themeAssets.ts`, Layout Template default Profil, dan Theme Template "Asahi & Tsukimi" khusus Halaman Profil / Hero.
- [ ] **Tahap 2**: Template Layout & Tema untuk Seksi Projects / Case Studies.
- [ ] **Tahap 3**: Template Layout & Tema untuk Seksi Skills & Arsenal.
- [ ] **Tahap 4**: Template Layout & Tema untuk Seksi Experience & Sub-Pages (Pendidikan, Kepribadian, Hobi, Target Karir).
- [ ] **Tahap 5**: Ekspor / Impor Custom Preset buatan pengguna.
