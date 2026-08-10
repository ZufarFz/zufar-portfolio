# 🚀 Web Portfolio

Aplikasi portofolio web interaktif bertema futuristik yang dirancang khusus untuk profesional di bidang Data Analytics dan Software Engineering. Dilengkapi dengan tampilan responsif, pengubah tema gelap/terang (dark/light mode), dukungan dua bahasa (Bahasa Indonesia & Bahasa Inggris), presentasi studi kasus interaktif, pembuat Resume/CV otomatis, serta integrasi backend real-time menggunakan Supabase.

---

## ✨ Fitur Utama

- **🌐 Dukungan Dua Bahasa (Bilingual)**: Beralih dengan mulus antara Bahasa Indonesia (`ID`) dan Bahasa Inggris (`EN`).
- **🌓 Sistem Tema Dinamis**: Fitur beralih mode Gelap/Terang secara halus dengan kontras visual yang disesuaikan serta perbaikan otomatis warna isian formulir (WebKit autofill).
- **🪪 Kartu Identitas Holografik Interaktif**: Kartu identitas 3D dengan gaya cyberpunk yang responsif terhadap gerakan kursor/sentuhan.
- **📊 Presentasi Studi Kasus & Editor Slide PPT**: Modul tampilan slide interaktif untuk proyek analisis data, lengkap dengan fitur pratinjau dan penyuntingan slide presentasi.
- **📄 Resume (CV) Interaktif & Ekspor PDF**: Modal pratinjau CV interaktif yang mendukung pengunduhan file PDF secara langsung menggunakan `html2pdf.js`.
- **🛠️ Matriks Keterampilan (Skills Arsenal)**: Penampil keahlian teknis terstruktur berdasarkan kategori, indikator tingkat kemahiran, dan filter interaktif.
- **✉️ Formulir Kontak Direct Gmail**: Formulir kontak terintegrasi yang membuka halaman pembuat pesan Gmail secara otomatis dengan isi pesan dan subjek yang sudah terisi.
- **⚡ Panel Admin & Backend Supabase**: Sistem CMS terintegrasi untuk pengelolaan konten dinamis dan penyimpanan data real-time.
- **📱 Navigasi Pintar Responsif**: Bilah navigasi atas yang otomatis tersembunyi saat digulir ke bawah dan muncul kembali saat digulir ke atas.

---

## 🛠️ Teknologi & Perpustakaan

- **Framework Utama**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Desain & Tampilan**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi**: [Motion](https://motion.dev/) (Framer Motion API)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Backend & Basis Data**: [Supabase JS Client](https://supabase.com/) (`@supabase/supabase-js`)
- **Ekspor PDF**: `html2pdf.js`
- **Lingkungan Server**: Express (Node.js)

---

## 📁 Struktur Proyek

```
├── public/                  # Aset statis dan ikon
├── src/
│   ├── components/          # Komponen UI Reusable
│   │   ├── AboutMeStoryPage.tsx         # Cerita & rekam jejak karir
│   │   ├── AboutMeSubPages.tsx          # Sub-halaman biografi detail
│   │   ├── AdminPage.tsx                # Panel pengelolaan konten Supabase
│   │   ├── BackgroundTextures.tsx       # Latar belakang kanvas dekoratif
│   │   ├── CaseStudyPresentationPage.tsx# Presentasi studi kasus data
│   │   ├── ContactForm.tsx              # Formulir kontak terisi otomatis Gmail
│   │   ├── InteractiveIDCard.tsx        # Komponen Kartu Identitas 3D Cyberpunk
│   │   ├── PPTSlideEditor.tsx           # Editor slide presentasi
│   │   ├── ResumeModal.tsx              # Pratinjau CV & Ekspor PDF
│   │   ├── SkillsArsenal.tsx            # Matriks keterampilan terintegrasi
│   │   └── SocialIcon.tsx               # Ikon media sosial
│   ├── data/                # File konfigurasi & data statis
│   ├── lib/                 # Utilitas (Inisialisasi Supabase client)
│   │   └── supabaseClient.ts
│   ├── App.tsx              # Komponen Utama & Routing Aplikasi
│   ├── index.css            # CSS Global, Impor Tailwind & Styling Autofill
│   ├── main.tsx             # Entry Point Aplikasi
│   └── types.ts             # Antarmuka TypeScript (Interfaces)
├── .env.example             # Templat variabel lingkungan
├── metadata.json            # Metadata aplikasi
├── package.json             # Dependensi NPM & skrip
└── tsconfig.json            # Konfigurasi TypeScript
```

---

## 🚀 Panduan Memulai

### Prasyarat

Pastikan perangkat Anda sudah terpasang perangkat lunak berikut:
- **Node.js**: `v18.x` atau versi yang lebih baru
- **npm**: `v9.x` atau versi yang lebih baru

### Langkah Instalasi

1. **Kloning repositori ini**:
   ```bash
   git clone https://github.com/ZufarFz/zufar-portfolio.git
   cd zufar-portfolio
   ```

2. **Pasang dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Buat file `.env` di direktori utama berdasarkan templat `.env.example`:
   ```env
   VITE_SUPABASE_URL=url_proyek_supabase_anda
   VITE_SUPABASE_ANON_KEY=kunci_anon_supabase_anda
   ```

4. **Jalankan Server Pengembang**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di peramban (browser) Anda.

---

## 📜 Skrip yang Tersedia

Dalam direktori proyek, Anda dapat menjalankan skrip berikut:

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server lokal Vite pada port 3000 |
| `npm run build` | Membuat bundel produksi teroptimasi di folder `dist/` |
| `npm run preview` | Meninjau hasil build produksi secara lokal |
| `npm run lint` | Menjalankan pemeriksaan tipe TypeScript (`tsc --noEmit`) |
| `npm run clean` | Menghapus artefak build (`dist/`) |

---

## 📄 Lisensi

Proyek ini dilindungi di bawah Lisensi MIT.
