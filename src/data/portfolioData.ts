import { CaseStudy, Experience, SkillItem, SkillCategory, PersonalityItem, HobbyItem, CareerGoalItem, EducationSection, EducationItem, CustomSocial, IDCardSvgItem, CVData } from '../types';

// ============================================================================
// 1. TEKS DEFAULT WEBSITE (BILINGUAL: ENGLISH & INDONESIAN)
// ============================================================================

export const DEFAULT_WEB_TEXTS: Record<string, string> = {
  "education_title": "Educational Background & Story",
  "education_intro": "Explore my academic achievements, scientific training foundations, and formal credential roadmaps represented in customized presentation sheets.",
  "personality_title": "Personality & Values",
  "personality_intro": "My operating principles, character ethics, and core professional values that guide my collaborative work style.",
  "hobbies_title": "Hobbies & Interests",
  "hobbies_intro": "What keeps me inspired and energizes my creative problem-solving outside of regular business hours.",
  "career_journey_title": "Career Journey & Milestones",
  "career_journey_intro": "My timeline of professional experiences, highlighting analytical leadership, data strategy, and metric modernization.",
  "career_goals_title": "Career Goals & Aspirations",
  "career_goals_intro": "Strategic trajectory, upcoming technical capabilities, and milestones I aim to achieve.",
  "hero_badge": "DATA ANALYST & BI STRATEGIST",
  "hero_title": "Turning Raw Data\ninto Enterprise Decisions",
  "hero_subtitle": "Specializing in high-impact insights through custom SQL engines, Python workflows, and advanced Business Intelligence. I transform transactional records into clean, validated, and actionable optimization roadmaps.",
  "projects_badge": "CASE CHRONICLES",
  "projects_title": "Selected Case Studies",
  "projects_subtitle": "A structured demonstration of technical proficiency across the entire data deployment stack, highlighting real performance audits.",
  "skills_badge": "STACK CLASSIFICATION",
  "skills_title": "Technical Arsenal",
  "skills_subtitle": "Expertise and architectural know-how across relational SQL databases, mathematical script engines, and custom telemetry filters.",
  "experience_badge": "CAREER TRACEABILITY",
  "experience_title": "Professional Journey",
  "experience_subtitle": "Proven experience designing databases, reporting frameworks, and pipelines inside rapid consumer spaces. Click to toggle bullet point summaries.",
  "contact_badge": "INQUIRY MATRIX",
  "contact_title": "Let's connect",
  "contact_subtitle": "Available for corporate consulting engagements, full-time senior analyst roles, or panel speaking opportunities regarding advanced business intelligence.",
  "about_story_badge": "✦ DISCOVER OUR STORY",
  "about_story_title": "About Me",
  "about_story_intro": "I am a passionate Business Intelligence Analyst and Developer dedicated to synthesizing raw complexity into high-fidelity, interactive applications. With a dual focus on data pipeline architecture and pixel-perfect design craftsmanship, I transform ambitious visions into reality.",
  "about_story_image_url": "",
  "about_story_left_1_title": "Interior / Data Architecture",
  "about_story_left_1_desc": "Structuring clean, robust pipelines and modeling relational schemas to establish a highly performant data foundation.",
  "about_story_left_2_title": "Exterior / Visual Analytics",
  "about_story_left_2_desc": "Crafting intuitive dashboards and reports that deliver immediate insights and elevate decision-making speed.",
  "about_story_left_3_title": "Design / Product Strategy",
  "about_story_left_3_desc": "Blending sleek user interface design with rapid interactions for web portals that are both functional and delightful.",
  "about_story_right_1_title": "Decoration / Business Strategy",
  "about_story_right_1_desc": "Translating corporate requirements into verifiable KPIs that optimize operational performance and unlock growth.",
  "about_story_right_2_title": "Planning / Careful Logic",
  "about_story_right_2_desc": "Iterating carefully through requirements, timelines, schema design, and constraints with high professional standards.",
  "about_story_right_3_title": "Execution / Sleek Delivery",
  "about_story_right_3_desc": "Bringing data projects to life through flawless code integration, thorough validation, and continuous alignment."
};

export const ID_TRANSLATIONS = {
  "webTexts": {
    "education_title": "Latar Belakang & Kisah Pendidikan",
    "education_intro": "Jelajahi pencapaian akademis saya, fondasi pelatihan ilmiah, dan peta jalan kredensial formal yang disajikan dalam lembar presentasi kustom.",
    "personality_title": "Kepribadian & Nilai Utama",
    "personality_intro": "Prinsip kerja, etika karakter, dan nilai profesional utama yang memandu gaya kerja kolaboratif saya.",
    "hobbies_title": "Hobi & Minat",
    "hobbies_intro": "Hal-hal yang menginspirasi dan memberi energi pemecahan masalah kreatif saya di luar jam kerja.",
    "career_journey_title": "Perjalanan Karir & Tonggak Pencapaian",
    "career_journey_intro": "Linimasa pengalaman profesional saya, menyoroti kepemimpinan analitis, strategi data, dan modernisasi metrik.",
    "career_goals_title": "Target & Aspirasi Karir",
    "career_goals_intro": "Lintasan strategis, kapabilitas teknis masa depan, dan target pencapaian yang ingin saya raih.",
    "hero_badge": "ANALIS DATA & STRATEGIST BI",
    "hero_title": "Mengubah Data Mentah\nmenjadi Keputusan Bisnis",
    "hero_subtitle": "Spesialisasi dalam wawasan berdampak tinggi melalui mesin SQL kustom, alur kerja Python, dan Business Intelligence tingkat lanjut. Saya mengubah catatan transaksi menjadi peta jalan optimasi yang bersih, tervalidasi, dan dapat ditindaklanjuti.",
    "projects_badge": "KRONIK KASUS",
    "projects_title": "Studi Kasus Terpilih",
    "projects_subtitle": "Demonstrasi terstruktur kemahiran teknis di seluruh tumpukan penerapan data, menyoroti audit kinerja nyata.",
    "skills_badge": "KLASIFIKASI STACK",
    "skills_title": "Gudang Senjata Teknis",
    "skills_subtitle": "Keahlian dan pengetahuan arsitektural di seluruh database SQL relasional, mesin skrip matematika, dan filter telemetri kustom.",
    "experience_badge": "KETELUSURAN KARIR",
    "experience_title": "Perjalanan Profesional",
    "experience_subtitle": "Pengalaman terbukti dalam merancang database, kerangka pelaporan, dan pipeline di ruang konsumen yang cepat. Klik untuk beralih ringkasan poin-poin.",
    "contact_badge": "MATRIKS PERTANYAAN",
    "contact_title": "Mari terhubung",
    "contact_subtitle": "Tersedia untuk keterlibatan konsultasi perusahaan, peran analis senior purnawaktu, atau peluang berbicara di panel mengenai intelijen bisnis tingkat lanjut.",
    "about_story_badge": "✦ JELAJAHI KISAH SAYA",
    "about_story_title": "Tentang Saya",
    "about_story_intro": "Saya adalah seorang Analis Business Intelligence dan Developer yang berdedikasi untuk menyatukan kompleksitas mentah menjadi aplikasi interaktif berkualitas tinggi. Dengan fokus ganda pada arsitektur pipeline data dan keahlian desain pixel-perfect, saya mengubah visi ambisius menjadi kenyataan.",
    "about_story_left_1_title": "Interior / Arsitektur Data",
    "about_story_left_1_desc": "Menyusun pipeline yang bersih dan kokoh serta memodelkan skema relasional untuk membangun fondasi data berkinerja tinggi.",
    "about_story_left_2_title": "Eksterior / Analisis Visual",
    "about_story_left_2_desc": "Membuat dashboard dan laporan intuitif yang memberikan wawasan instan dan meningkatkan kecepatan pengambilan keputusan.",
    "about_story_left_3_title": "Desain / Strategi Produk",
    "about_story_left_3_desc": "Memadukan desain antarmuka pengguna yang ramping dengan interaksi cepat untuk portal web yang fungsional dan menyenangkan.",
    "about_story_right_1_title": "Dekorasi / Strategi Bisnis",
    "about_story_right_1_desc": "Menerjemahkan persyaratan perusahaan menjadi KPI yang dapat diverifikasi untuk mengoptimalkan kinerja operasional dan membuka pertumbuhan.",
    "about_story_right_2_title": "Perencanaan / Logika Cermat",
    "about_story_right_2_desc": "Melakukan iterasi secara cermat melalui persyaratan, garis waktu, desain skema, dan batasan dengan standar profesional yang tinggi.",
    "about_story_right_3_title": "Eksekusi / Pengiriman Ramping",
    "about_story_right_3_desc": "Menghidupkan proyek data melalui integrasi kode yang sempurna, validasi menyeluruh, dan penyelarasan berkelanjutan."
  },
  "title": "Analis Data Senior & Strategist Keputusan BI",
  "aboutMe": "Analis Data Senior yang berorientasi pada detail dan terdorong oleh hasil dengan pengalaman lebih dari 6 tahun dalam merekayasa pipeline SQL berkinerja tinggi, model prediktif canggih, dan dasbor BI tingkat eksekutif yang intuitif. Mahir dalam mengubah catatan transaksi terstruktur yang kompleks menjadi keputusan operasional yang optimal dan wawasan pendapatan yang dapat ditindaklanjuti.\n\nSangat menyukai transparansi data, penyelarasan kinerja pipeline, dan pertumbuhan strategis. Berkomitmen untuk mendorong efisiensi melalui kerangka verifikasi statistik dan KPI yang transparan.",
  "skills": {
    "sql": {
      "name": "SQL",
      "description": "Desain kueri database, CTE, fungsi jendela, optimasi rencana kueri, pembuatan skema, PostgreSQL, dan konfigurasi Snowflake."
    },
    "python": {
      "name": "Python",
      "description": "Pandas, NumPy, alur kerja pembersihan data, skrip analitik otomatis, agregasi statistik, dan proxy API kustom."
    },
    "power-query": {
      "name": "Power Query",
      "description": "Operasi kode-M tingkat lanjut, koneksi data ETL, penggabungan data tingkat perusahaan, parameterisasi, dan penggabungan skema."
    },
    "powerbi": {
      "name": "PowerBI",
      "description": "Pemodelan DAX, konfigurasi ETL power query, tata letak pelaporan tabular tingkat perusahaan, dan notifikasi email otomatis."
    },
    "excel": {
      "name": "Excel",
      "description": "Dataset PowerPivot, rumus pencarian bertingkat, skenario sensitivitas keuangan, dan pemeriksaan analitik ad-hoc yang cepat."
    }
  },
  "caseStudies": {
    "customer-segmentation": {
      "title": "Analisis Segmentasi Pelanggan",
      "category": "Analitik Pemasaran & Otomatisasi",
      "description": "Mengotomatiskan analisis RFM (Recency, Frequency, Monetary) menggunakan struktur data Python untuk mengkategorikan 50.000+ pelanggan global. Menyediakan kohort langsung mandiri untuk pengguna bisnis agar sesuai dengan kampanye otomatisasi pemasaran secara langsung, meningkatkan indeks kinerja kampanye email."
    },
    "sales-forecasting": {
      "title": "Model Peramalan Penjualan",
      "category": "Perencanaan Bisnis & Keuangan",
      "description": "Mengembangkan dan memvalidasi model regresi prediktif terintegrasi yang menganalisis buku pesanan historis multi-tahun. Memprediksi pendapatan perusahaan yang masuk, pengubah varians musiman, dan respons saluran pemasaran dengan akurasi validasi lebih dari 95%."
    },
    "supply-chain": {
      "title": "Optimasi Rantai Pasok",
      "category": "Logistik Operasional",
      "description": "Mengidentifikasi hambatan pengiriman rantai pasok melalui alokasi rute spasial yang komprehensif dan analisis waktu tunggu. Membangun tata letak dasbor kustom yang responsif di PowerBI menggunakan langkah Power Query yang dibersihkan untuk menandai rute latensi tinggi, mengurangi total waktu tunggu pengiriman melalui realokasi gudang dan pola perutean cerdas."
    }
  },
  "experiences": {
    "exp-1": {
      "role": "Analis Data Senior / Strategist Keputusan",
      "company": "Global Tech Corp",
      "bulletPoints": [
        "Merancang dan memelihara pipeline SQL dan Python yang mengeksekusi segmentasi kohort RFM di 50rb+ pengguna harian, menghasilkan peningkatan CTR email sebesar 24%.",
        "Memimpin audit pemodelan churn yang menganalisis tren konsumen untuk memulihkan kerugian churn berulang tahunan sebesar $2,2 juta.",
        "Membangun papan Tableau visual KPI waktu nyata untuk melacak pipeline pendapatan berkecepatan tinggi untuk rapat VP produk senior."
      ]
    },
    "exp-2": {
      "role": "Analis Data / Ilmuwan Data",
      "company": "Insight Solutions",
      "bulletPoints": [
        "Mengotomatiskan ETL mingguan menggunakan Power Query dan skrip Python, menghemat 15 jam kerja manual per minggu untuk tim keuangan.",
        "Merancang model regresi prediktif untuk meramalkan permintaan musiman dengan akurasi validasi historis sebesar 96%.",
        "Berkolaborasi dalam migrasi database lokal ke Snowflake, menormalisasi skema, dan merancang indeks query untuk mempercepat waktu respons."
      ]
    }
  },
  "educationSections": {
    "edu-sec-1": {
      "title": "Fondasi Pendidikan Saya",
      "content": "Menggabungkan keketatan statistik dengan rekayasa komputasi. Filosofi akademis saya berkisar pada pemahaman mekanika matematika yang mendasari arsitektur analitik modern, memastikan setiap algoritma dan kueri didukung oleh bukti statistik yang kuat."
    },
    "edu-sec-2": {
      "title": "Statistika Teoretis & Terapan",
      "content": "Di Columbia University, saya sangat fokus pada teori probabilitas, analisis regresi, dan statistika komputasi. Pelatihan terstruktur ini mengajarkan saya untuk melihat melampaui agregasi data sederhana dan mengidentifikasi sinyal kausal yang sebenarnya di dalam dataset korporat yang besar dan bising."
    }
  },
  "education": [
    {
      "degree": "B.S. Statistik Terapan & Ilmu Komputer",
      "institution": "Columbia University, NYC"
    }
  ]
};

// ============================================================================
// 2. DATA UTAMA PORTFOLIO & CV (LOKAL - BEBAS BATASAN CLOUD DATABASE)
// ============================================================================

export const DEFAULT_CV_DATA: CVData = {
  "name": "Muhammad Zufar Fauzi",
  "nickname": "Zufar",
  "title": "Junior Data Analyst",
  "location": "Klaten, Jawa Tengah",
  "email": "zufar048@gmail.com",
  "linkedin": "Muhammad Zufar Fauzi",
  "github": "ZufarFz",
  "instagram": "Zuf.Fz_",
  "whatsapp": "085123333230",
  "floatingAssets": [
    {
      "id": "asset-1787818725270-ur1r",
      "name": "gapura",
      "section": "home",
      "type": "svg",
      "content": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 500\">\n  <g transform=\"matrix(0.1, 0, 0, -0.1, 14.791995, 544.908813)\" fill=\"#ee210a\" stroke=\"none\">\n    <path d=\"M531 5229 c3 -51 13 -70 50 -89 10 -6 19 -17 19 -26 0 -8 38 -78 85 -154 46 -77 91 -154 99 -172 8 -18 58 -85 111 -148 54 -63 102 -123 109 -132 6 -10 18 -18 27 -18 9 0 29 -6 44 -14 39 -20 137 -35 289 -44 l128 -7 3 -40 c1 -21 6 -40 11 -42 34 -12 35 -19 28 -162 l-7 -143 -55 7 -54 7 4 -39 c3 -21 7 -44 9 -51 3 -10 -39 -13 -212 -12 l-217 1 -15 -73 c-32 -152 -32 -159 9 -214 l37 -50 239 2 239 3 -6 -87 c-3 -48 -12 -240 -20 -427 -8 -187 -24 -542 -35 -788 -11 -247 -18 -453 -15 -458 4 -5 -2 -9 -12 -9 -10 0 -24 -4 -30 -8 -9 -6 -23 -168 -48 -573 -19 -310 -37 -576 -40 -591 -4 -24 0 -28 43 -42 177 -58 411 -62 575 -10 l47 16 0 296 c0 163 3 430 7 593 l6 296 -34 7 -34 6 7 202 c4 112 14 444 22 738 9 294 19 603 22 685 l6 150 1089 0 c961 0 1089 -2 1089 -15 0 -30 30 -1013 40 -1303 12 -357 13 -458 3 -455 -5 1 -18 -2 -31 -6 l-23 -8 3 -593 3 -593 50 -16 c110 -34 280 -45 405 -26 94 15 200 49 207 66 5 12 -2 142 -22 454 -13 185 -35 535 -41 638 -7 109 -7 112 -30 112 -18 0 -24 6 -24 21 0 11 -5 107 -10 212 -6 106 -21 446 -35 757 -13 311 -27 608 -31 661 l-6 95 237 -3 236 -3 25 28 c13 15 31 40 40 56 16 29 13 65 -18 209 l-10 48 -221 -1 c-122 -1 -226 -1 -232 -1 -5 1 -4 6 3 13 7 7 12 30 12 51 l0 39 -44 -6 -43 -7 -7 150 c-7 143 -6 151 13 170 12 12 21 32 21 44 0 24 2 24 143 31 142 6 272 27 291 46 5 5 19 10 31 11 22 0 245 265 256 305 4 12 46 85 93 162 47 76 86 145 86 153 0 8 16 27 35 42 31 24 35 33 35 72 0 56 -12 57 -77 11 -91 -64 -206 -111 -348 -140 -193 -40 -664 -76 -1600 -121 -170 -8 -353 -18 -405 -21 -52 -4 -187 -1 -300 5 -113 6 -340 18 -505 26 -684 35 -1170 70 -1320 95 -198 34 -317 76 -424 150 -40 28 -75 50 -77 50 -3 0 -4 -23 -3 -51z m5028 -30 c-31 -60 -211 -151 -349 -178 -30 -6 -66 -14 -80 -16 -32 -7 -255 -30 -425 -45 -165 -14 -298 -30 -304 -36 -7 -6 45 -5 159 5 58 5 150 12 205 16 179 10 398 41 505 71 65 18 190 74 190 84 0 5 6 10 13 13 24 9 7 -41 -25 -75 -16 -17 -26 -33 -24 -36 6 -6 -11 -22 -47 -45 -16 -10 -26 -21 -23 -24 3 -3 13 2 22 11 25 26 28 12 5 -25 -12 -19 -21 -29 -21 -22 0 31 -29 -3 -35 -40 -10 -67 -15 -76 -43 -91 -15 -8 -36 -23 -47 -33 -29 -27 -82 -40 -235 -58 -125 -15 -382 -43 -405 -44 -6 -1 -9 -26 -7 -61 l4 -60 -59 27 c-53 25 -68 27 -178 27 -112 0 -124 -2 -180 -29 -33 -16 -64 -29 -70 -30 -5 0 -8 24 -6 54 l3 53 -254 -8 c-325 -11 -1260 -12 -1583 0 l-250 8 3 -51 c4 -54 -1 -59 -33 -38 -33 23 -138 47 -201 47 -84 0 -167 -17 -219 -45 -24 -12 -45 -21 -47 -19 -2 1 -1 32 2 67 l5 64 -95 6 c-121 6 -354 34 -446 53 -39 8 -80 23 -91 33 -11 11 -34 26 -51 35 -31 16 -37 28 -46 91 -2 17 -7 38 -11 48 -9 21 -8 21 45 2 155 -55 925 -120 1765 -150 83 -3 177 -8 210 -10 33 -3 101 -7 150 -11 50 -3 230 1 400 10 171 9 405 21 520 26 779 38 1321 92 1438 143 15 6 27 18 27 26 0 11 -3 12 -11 4 -6 -6 -18 -9 -25 -6 -8 3 -24 -1 -37 -9 -12 -8 -40 -18 -62 -21 -22 -4 -60 -11 -85 -16 -41 -9 -151 -20 -240 -26 -19 -1 -55 -5 -80 -8 -25 -4 -110 -12 -190 -17 -80 -6 -167 -13 -195 -15 -47 -4 -266 -17 -530 -31 -66 -3 -142 -7 -170 -9 -27 -1 -126 -6 -220 -9 -93 -4 -215 -11 -270 -15 -65 -6 -101 -5 -104 1 -2 6 -6 5 -11 -2 -6 -9 -50 -9 -196 0 -104 6 -232 13 -284 15 -52 2 -185 8 -295 14 -110 6 -249 13 -310 16 -60 3 -132 7 -160 10 -27 3 -101 7 -164 10 -63 4 -118 8 -122 10 -4 3 -47 7 -95 9 -90 5 -210 14 -274 21 -19 3 -62 7 -95 11 -61 6 -254 42 -265 49 -4 2 -19 6 -35 9 -35 6 -58 -10 -50 -35 10 -30 -1 -22 -24 16 -16 28 -17 35 -6 35 8 0 15 -4 15 -10 0 -5 5 -10 10 -10 22 0 8 19 -27 37 -21 10 -38 24 -38 31 0 7 -6 16 -13 21 -7 4 -14 18 -15 29 -1 12 -7 22 -13 22 -11 0 -28 29 -21 36 2 2 28 -9 58 -25 113 -61 225 -90 448 -115 216 -25 541 -46 541 -36 0 3 -66 12 -147 18 -316 27 -541 55 -648 82 -120 30 -237 80 -258 111 -8 10 -17 16 -20 12 -4 -3 -7 1 -7 10 0 11 -5 14 -17 10 -11 -4 -14 -3 -9 5 4 7 2 12 -3 12 -6 0 -11 7 -11 15 0 21 16 19 53 -8 75 -55 247 -115 393 -137 165 -25 555 -63 628 -62 17 1 35 -2 40 -6 6 -3 27 -5 47 -3 20 1 107 -2 195 -8 145 -10 394 -22 709 -36 148 -6 289 -14 375 -21 36 -3 133 0 215 5 83 6 258 15 390 21 314 13 400 18 675 35 41 2 116 7 167 10 50 3 100 7 110 9 10 2 63 7 118 10 113 8 372 33 425 42 115 20 320 82 340 103 3 4 22 15 42 25 21 10 46 27 55 36 21 20 37 5 22 -21z m-4547 -537 c40 -6 120 -17 178 -24 58 -6 107 -12 110 -13 3 -1 49 -5 103 -9 l97 -8 0 -68 c0 -38 3 -76 7 -86 4 -12 3 -15 -5 -10 -7 4 -76 11 -154 16 -79 6 -179 18 -223 29 -74 18 -83 23 -125 70 -88 100 -130 149 -130 155 0 3 15 -5 34 -18 21 -14 63 -27 108 -34z m4187 -14 c-24 -29 -51 -59 -59 -68 -8 -8 -24 -27 -35 -40 -35 -44 -200 -78 -407 -83 -82 -2 -98 -5 -98 -18 0 -24 -10 -29 -34 -17 -49 25 -57 28 -85 28 -17 0 -33 5 -37 11 -9 15 -155 4 -224 -17 -28 -8 -55 -12 -60 -9 -5 3 -7 0 -4 -8 3 -9 -3 -16 -14 -19 -15 -4 -19 -12 -15 -32 3 -15 1 -26 -5 -26 -17 0 -24 18 -10 23 9 4 9 8 3 14 -5 4 -11 14 -13 22 -14 65 -15 74 -4 67 7 -4 12 -3 12 3 0 6 11 13 25 17 14 3 25 9 25 14 0 4 42 15 93 24 79 15 105 16 170 6 85 -13 171 -40 174 -55 1 -5 5 -11 10 -12 5 -2 7 28 5 66 l-4 68 103 7 c57 4 122 11 144 16 22 5 74 12 115 15 117 9 207 27 237 45 16 10 30 16 32 14 2 -2 -16 -27 -40 -56z m-2559 -77 c367 -10 678 -7 1140 8 156 6 286 8 289 5 3 -2 7 -35 9 -73 3 -63 2 -69 -15 -66 -10 2 -202 4 -426 4 -402 1 -408 1 -405 21 3 19 -3 20 -170 22 -172 3 -172 3 -172 -19 l0 -23 -427 -2 c-236 -2 -428 -3 -428 -3 0 0 1 33 3 73 l4 73 126 -6 c70 -3 282 -10 472 -14z m-783 -27 c32 -4 50 -11 46 -17 -4 -6 0 -8 9 -4 9 3 24 0 34 -7 11 -7 31 -16 46 -20 24 -5 27 -11 26 -41 -1 -19 -4 -35 -8 -35 -4 0 -6 -11 -5 -25 4 -28 -10 -43 -19 -20 -3 8 -1 17 5 21 11 6 -7 34 -22 34 -4 0 -20 5 -36 11 -75 30 -233 30 -318 0 -62 -22 -72 -28 -62 -37 3 -3 34 4 69 16 84 30 200 32 286 6 l63 -20 -5 -65 c-3 -36 -8 -178 -11 -316 -3 -137 -8 -299 -10 -360 -3 -60 -12 -348 -20 -640 -8 -291 -20 -661 -25 -821 -6 -160 -10 -307 -10 -328 0 -32 -2 -35 -17 -28 -55 29 -236 40 -339 21 -32 -6 -63 -12 -68 -12 -6 -1 -9 16 -8 38 1 22 6 141 12 265 5 124 14 322 20 440 13 275 38 844 45 1025 3 77 8 178 10 225 2 47 7 157 10 245 4 88 8 186 10 218 2 48 0 57 -12 53 -8 -4 -20 -3 -26 1 -7 4 -2 10 13 14 l25 7 -22 7 c-13 4 -23 14 -24 21 -5 58 -4 59 43 83 94 46 178 59 295 45z m1353 -87 c1 -7 2 -37 4 -67 5 -63 19 -358 20 -408 l1 -33 -175 0 -175 0 2 38 c1 21 8 138 14 261 l12 222 149 -1 c107 0 148 -3 148 -12z m1220 -18 c36 -5 79 -15 97 -21 30 -11 32 -14 30 -57 -2 -45 12 -392 18 -461 2 -19 6 -123 9 -230 3 -107 8 -233 11 -280 3 -47 7 -141 10 -210 21 -492 46 -1066 51 -1173 l7 -128 -29 8 c-77 21 -355 0 -391 -29 -7 -6 -13 -7 -13 -2 0 25 -28 934 -45 1469 -8 253 -17 566 -20 695 -3 129 -8 267 -11 306 l-4 71 47 18 c25 10 72 21 102 25 31 4 58 8 61 9 3 0 34 -4 70 -10z m-1560 -254 l-13 -235 -404 -2 c-223 -2 -407 0 -409 4 -2 4 0 9 6 13 5 3 10 27 10 52 0 37 -3 44 -16 39 -9 -3 -26 -9 -39 -12 l-24 -6 6 148 c6 140 8 150 30 167 17 14 21 25 17 43 l-6 24 423 2 c233 2 426 2 428 1 2 -2 -2 -108 -9 -238z m1210 199 c0 -34 4 -43 25 -52 24 -11 25 -16 26 -99 0 -49 4 -112 8 -142 l8 -53 -38 6 c-20 3 -45 9 -54 12 -15 6 -17 1 -13 -37 2 -24 6 -50 9 -56 3 -10 -82 -13 -393 -15 l-396 -3 -7 140 c-4 77 -10 184 -14 238 -3 54 -6 99 -5 100 1 1 192 2 423 2 l421 0 0 -41z m510 6 c0 -5 -2 -10 -4 -10 -3 0 -8 5 -11 10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z m-2550 -383 c0 -28 -22 -60 -44 -63 -12 -2 -16 6 -16 36 0 39 0 39 53 49 4 0 7 -9 7 -22z m2080 6 c23 -4 25 -9 22 -39 -3 -28 -8 -33 -26 -30 -11 3 -24 5 -27 5 -8 1 -29 49 -29 68 0 10 5 13 18 8 9 -3 28 -9 42 -12z m-2621 1 c26 -5 31 -11 31 -35 0 -57 -66 -43 -85 19 -7 24 0 26 54 16z m3161 -4 c0 -35 -40 -78 -61 -64 -10 6 -12 57 -2 67 10 11 63 8 63 -3z m-3139 -93 c-1 -4 -1 -47 -1 -97 l0 -90 -265 0 c-205 0 -265 3 -265 13 0 18 20 139 26 159 5 16 28 18 247 20 286 4 259 4 258 -5z m2614 -1 c7 -2 10 -33 8 -76 -2 -39 2 -80 7 -91 11 -19 -5 -19 -1085 -19 l-1096 0 5 98 c2 53 5 97 5 97 690 0 2149 -6 2156 -9z m969 -13 c6 -21 26 -142 26 -160 0 -10 -59 -13 -264 -13 l-264 0 -1 95 -2 95 250 0 c229 0 250 -1 255 -17z m-3592 -205 c-1 -5 -2 -19 -2 -33 l0 -25 -230 0 -229 0 -26 25 c-14 14 -25 29 -25 33 0 4 116 7 257 7 141 0 256 -3 255 -7z m2638 -25 l0 -33 -1090 0 -1090 0 0 33 0 32 1090 0 1090 0 0 -32z m970 26 c0 -3 -11 -18 -25 -33 l-24 -26 -231 0 -230 0 0 33 0 32 255 0 c140 0 255 -3 255 -6z m-462 -1833 c12 -1 22 -7 22 -14 0 -7 5 -10 10 -7 25 16 33 -67 52 -582 2 -44 6 -79 9 -77 3 2 9 -61 13 -139 4 -78 9 -176 12 -217 12 -172 14 -156 -20 -168 -118 -42 -294 -60 -411 -42 -44 7 -86 12 -92 13 -7 0 -13 4 -13 8 0 5 -7 6 -15 2 -9 -3 -24 2 -34 11 -17 15 -18 28 -14 104 6 99 6 124 -2 660 l-5 393 42 19 c24 10 77 23 118 29 41 6 86 13 100 15 14 2 66 2 115 -2 50 -3 100 -6 113 -6z m-2828 -24 c30 -4 67 -16 81 -25 14 -9 29 -14 33 -10 4 4 5 -250 3 -565 -3 -483 -6 -575 -18 -587 -25 -25 -189 -47 -302 -41 -56 3 -109 6 -117 6 -18 2 -119 29 -140 37 -8 3 -19 7 -25 7 -5 1 -11 22 -11 48 -1 26 1 46 5 44 3 -2 5 14 3 36 -3 22 0 38 4 35 5 -3 10 56 10 132 1 75 6 190 13 256 6 66 13 183 16 260 7 207 16 295 29 295 7 0 7 3 1 8 -35 25 16 61 99 69 28 3 53 7 55 9 6 6 197 -4 261 -14z\"/>\n    <path d=\"M1723 4923 c20 -2 54 -2 75 0 20 2 3 4 -38 4 -41 0 -58 -2 -37 -4z\"/>\n    <path d=\"M4210 4918 c-19 -3 8 -5 62 -4 54 1 101 6 105 10 8 8 -116 4 -167 -6z\"/>\n    <path d=\"M1868 4913 c18 -2 45 -2 60 0 15 2 0 4 -33 4 -33 0 -45 -2 -27 -4z\"/>\n    <path d=\"M1965 4910 c3 -5 12 -7 20 -3 21 7 19 13 -6 13 -11 0 -18 -4 -14 -10z\"/>\n    <path d=\"M4025 4913 c-44 -2 -84 -8 -88 -12 -5 -5 11 -8 35 -7 24 1 71 3 106 4 34 1 62 7 62 12 0 6 -8 9 -17 8 -10 -1 -54 -4 -98 -5z\"/>\n    <path d=\"M2042 4905 c8 -9 88 -11 100 -3 8 4 -13 8 -46 8 -33 0 -57 -2 -54 -5z\"/>\n    <path d=\"M2173 4893 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z\"/>\n    <path d=\"M2262 4895 c4 -4 37 -9 75 -11 685 -36 738 -38 954 -25 107 6 262 14 345 17 82 4 153 10 158 15 5 5 -29 6 -75 4 -46 -2 -156 -7 -244 -10 -88 -4 -178 -8 -200 -10 -55 -5 -404 -7 -413 -2 -4 3 -86 7 -182 11 -96 3 -231 9 -300 12 -69 4 -122 3 -118 -1z\"/>\n    <path d=\"M3833 4893 c15 -2 37 -2 50 0 12 2 0 4 -28 4 -27 0 -38 -2 -22 -4z\"/>\n    <path d=\"M1980 771 c0 -6 11 -13 25 -17 14 -3 22 -10 19 -15 -3 -5 1 -9 9 -9 33 0 63 -69 37 -85 -5 -3 -7 -12 -4 -19 6 -16 -32 -46 -58 -46 -10 0 -18 -4 -18 -10 0 -5 -10 -10 -22 -9 -13 0 -34 -3 -48 -6 -97 -21 -161 -25 -299 -21 -86 3 -169 8 -186 11 -83 17 -113 25 -147 39 -38 16 -78 59 -78 84 0 21 48 82 65 82 8 0 17 5 20 10 16 25 -41 6 -71 -24 -79 -79 -17 -161 152 -201 108 -26 405 -32 519 -10 161 30 209 64 203 146 -2 34 -9 47 -38 69 -39 32 -80 47 -80 31z\"/>\n    <path d=\"M4092 763 c-47 -23 -72 -59 -72 -104 0 -108 167 -157 495 -146 282 10 396 52 412 150 5 32 1 41 -30 72 -36 36 -82 49 -70 20 3 -9 11 -14 17 -12 6 2 23 -9 39 -24 43 -45 36 -75 -29 -120 -24 -16 -48 -28 -53 -24 -5 3 -13 1 -16 -5 -4 -6 -15 -8 -26 -5 -11 4 -19 2 -19 -5 0 -6 -15 -10 -32 -10 -18 0 -58 -4 -88 -10 -90 -17 -371 -5 -455 19 -84 25 -120 49 -120 82 0 13 -4 27 -9 31 -10 7 44 64 79 84 32 19 13 24 -23 7z\"/>\n  </g>\n</svg>",
      "color": "#3b82f6",
      "width": 680,
      "x": 91,
      "y": 65,
      "rotation": 0,
      "opacity": 0.75,
      "zIndex": 2,
      "animation": "none",
      "flipX": false,
      "layer": "bg"
    },
    {
      "id": "asset-1787822697862-vxwg",
      "name": "bambu",
      "section": "home",
      "type": "svg",
      "content": "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 20010904//EN\"\n \"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd\">\n<svg version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\"\n width=\"600.000000pt\" height=\"774.000000pt\" viewBox=\"0 0 600.000000 774.000000\"\n preserveAspectRatio=\"xMidYMid meet\">\n<g transform=\"translate(0.000000,774.000000) scale(0.100000,-0.100000)\"\nfill=\"#000000\" stroke=\"none\">\n<path d=\"M4443 7392 c-12 -31 -48 -120 -81 -197 -58 -139 -59 -142 -127 -515\n-93 -512 -98 -563 -20 -205 125 567 196 847 212 832 2 -2 -20 -145 -48 -318\n-66 -409 -145 -721 -220 -870 -51 -102 -57 -137 -15 -84 l23 29 -1 -24 c-1\n-16 -10 -29 -23 -35 -13 -5 -23 -13 -23 -18 0 -4 -5 -5 -12 -1 -7 4 -8 3 -4\n-4 4 -6 0 -24 -9 -39 -9 -16 -14 -20 -11 -10 3 9 1 17 -5 17 -6 0 -7 5 -4 10\n4 6 12 7 18 3 7 -4 6 1 -2 11 -11 13 -11 20 -3 28 15 15 15 139 1 323 l-11\n140 -129 362 c-71 199 -129 370 -129 379 0 10 -3 15 -6 12 -3 -4 2 -120 11\n-260 l16 -253 91 -255 c50 -140 99 -277 109 -304 17 -41 19 -63 13 -155 l-6\n-106 -143 -325 c-78 -179 -145 -332 -148 -340 -4 -8 -6 104 -5 250 l1 265 -46\n225 c-26 123 -47 228 -47 232 0 4 -13 14 -28 22 l-29 15 -12 -292 -12 -292 46\n-285 45 -284 -129 -226 c-485 -846 -456 -798 -716 -1160 -231 -321 -254 -357\n-331 -517 -48 -99 -81 -181 -79 -192 2 -12 -1 -21 -6 -21 -6 0 -8 -4 -5 -9 3\n-4 -7 -19 -22 -32 -14 -13 -21 -17 -15 -9 6 8 9 25 7 37 -3 15 3 24 16 28 11\n4 18 9 16 13 -2 4 16 90 40 192 24 102 44 190 44 196 0 7 -38 23 -84 38 -73\n23 -87 31 -105 61 -11 19 -19 35 -16 35 2 0 48 -16 103 -36 l100 -36 56 38\nc31 20 56 38 56 40 0 2 159 675 257 1088 14 60 74 245 133 412 l108 302 21\n213 c21 211 24 222 165 789 79 316 143 576 142 577 -6 7 -221 32 -226 26 -4\n-5 -46 -181 -93 -393 -83 -372 -90 -395 -193 -680 -101 -278 -113 -322 -101\n-353 3 -7 62 -37 131 -67 97 -41 126 -57 126 -71 0 -23 -6 -23 -60 -4 -69 24\n-80 17 -18 -12 l57 -26 -18 -26 c-26 -37 -59 -115 -67 -159 -4 -20 -19 -73\n-34 -117 -34 -97 -88 -279 -129 -435 -56 -213 -191 -782 -191 -803 0 -43 -59\n-260 -76 -278 -18 -20 -72 -25 -102 -10 -9 5 -43 19 -74 31 -33 13 -58 28 -58\n37 0 7 10 33 21 56 27 51 113 293 203 567 63 190 85 267 171 600 18 69 45 164\n59 212 27 87 35 124 58 263 21 133 18 154 -23 155 -11 0 -18 -17 -26 -67 -6\n-38 -32 -180 -57 -318 -46 -247 -48 -256 -228 -800 -99 -302 -181 -562 -182\n-577 -2 -56 -15 -8 -40 155 l-26 167 74 223 73 223 8 189 c4 105 10 222 14\n262 4 40 5 70 3 68 -2 -2 -26 -55 -53 -117 -44 -102 -53 -136 -89 -337 -22\n-124 -40 -237 -40 -252 0 -34 15 -45 29 -22 6 10 11 13 11 8 0 -6 -7 -21 -16\n-33 -8 -12 -12 -27 -9 -32 3 -6 1 -10 -5 -10 -6 0 -9 -4 -5 -9 3 -5 2 -12 -3\n-15 -5 -3 -7 15 -6 39 2 25 -1 45 -7 45 -5 0 -9 10 -9 23 0 12 -30 144 -66\n292 l-67 270 -109 220 c-60 121 -107 207 -104 190 2 -16 26 -172 52 -345 l47\n-315 119 -278 118 -278 15 -152 c17 -175 22 -200 35 -192 6 4 8 12 4 18 -3 7\n1 3 10 -8 8 -11 19 -24 24 -30 5 -6 5 -23 1 -39 -6 -20 -5 -34 4 -45 9 -12 9\n-13 0 -7 -7 4 -13 2 -13 -3 0 -6 -4 -11 -10 -11 -5 0 -10 7 -10 16 0 9 -8 23\n-17 31 -10 8 -13 12 -7 9 6 -3 10 6 9 22 -1 18 -43 88 -120 195 -115 162 -122\n170 -242 263 -67 53 -125 100 -129 105 -3 5 -9 9 -13 9 -4 0 51 -89 123 -198\n122 -185 139 -207 254 -313 l122 -114 -2 -110 c-3 -159 -61 -372 -251 -920\n-86 -247 -190 -547 -231 -664 -67 -195 -73 -216 -58 -227 15 -11 18 -7 28 24\n6 21 21 54 34 75 23 39 69 159 127 337 19 58 57 164 83 235 27 72 55 160 64\n196 8 36 28 100 45 140 57 145 164 520 196 689 9 47 18 95 20 106 l5 21 47\n-23 c25 -13 54 -24 63 -24 9 0 28 -6 43 -12 34 -16 33 -17 -34 -228 -158 -492\n-174 -542 -172 -551 1 -3 -18 -73 -43 -155 -25 -82 -54 -183 -65 -224 -69\n-270 -94 -376 -139 -605 -12 -60 -23 -115 -25 -121 -2 -6 -42 8 -94 34 -51 24\n-94 42 -97 39 -3 -3 14 -16 38 -28 23 -12 66 -37 95 -55 l52 -33 87 163 c80\n152 102 183 322 457 204 255 245 301 310 347 110 78 108 79 364 -126 183 -146\n225 -175 350 -238 79 -40 143 -72 144 -71 1 1 -24 49 -56 105 -49 90 -75 121\n-190 237 -132 132 -133 133 -235 175 l-104 42 -93 -7 c-56 -4 -89 -3 -83 2 6\n5 29 24 52 42 40 31 59 35 470 112 405 76 440 84 658 156 127 42 232 77 234\n80 3 2 -2 10 -10 18 -11 11 -66 14 -274 16 -241 1 -270 0 -398 -24 -111 -21\n-172 -40 -315 -97 -175 -70 -179 -72 -322 -184 -80 -63 -147 -112 -149 -110\n-2 1 12 22 31 46 19 24 131 180 248 348 201 286 219 315 286 468 40 89 71 162\n68 162 -2 0 -98 -93 -213 -206 l-210 -206 -122 -221 c-116 -211 -124 -229\n-160 -365 -27 -101 -46 -155 -66 -180 -15 -21 -133 -170 -262 -332 -128 -162\n-239 -303 -245 -313 -16 -25 -27 -21 -15 6 5 12 74 256 152 542 l143 520 234\n385 c275 453 268 443 389 596 l94 119 319 160 319 160 112 -118 c62 -65 175\n-184 252 -265 l140 -148 205 -109 c113 -60 222 -119 243 -133 22 -13 40 -22\n42 -20 2 2 -21 44 -52 93 -42 67 -114 151 -280 327 -216 228 -229 240 -351\n318 -101 64 -135 80 -165 80 -36 0 -29 -6 146 -123 l185 -122 215 -250 c118\n-137 213 -252 211 -254 -1 -2 -15 6 -31 16 -15 11 -98 59 -184 107 l-155 86\n-175 197 c-96 108 -191 216 -213 240 l-39 44 111 -70 c212 -133 204 -119 -16\n29 l-152 103 77 27 c452 159 579 213 853 357 228 120 283 154 321 194 25 27\n43 49 39 49 -4 0 -93 -16 -197 -35 -255 -48 -481 -128 -700 -251 -142 -80\n-156 -90 -216 -162 l-64 -77 -354 -169 c-195 -93 -373 -179 -396 -191 -24 -13\n-43 -22 -43 -19 0 2 47 86 104 186 57 101 246 437 421 748 174 311 328 583\n340 605 22 38 30 43 147 85 403 146 413 150 731 355 163 105 296 193 296 196\n1 3 -15 6 -35 7 -24 1 -143 -41 -372 -130 l-337 -132 -177 -119 c-169 -112\n-209 -147 -153 -133 35 9 33 -17 -2 -33 -21 -10 -29 -9 -41 2 -12 13 -11 19 7\n43 11 16 45 91 74 167 l54 137 234 165 234 165 241 282 c133 156 240 284 239\n286 -1 1 -24 -11 -51 -28 -27 -17 -113 -68 -191 -114 -125 -72 -162 -100 -300\n-226 -86 -80 -184 -170 -217 -200 -35 -32 -57 -47 -52 -35 4 11 50 278 102\n594 52 315 97 578 100 582 3 5 2 9 -3 9 -4 0 -18 -26 -30 -58z m-575 -414 c13\n-52 29 -100 98 -283 67 -180 79 -224 104 -375 22 -136 26 -225 10 -200 -5 8\n-10 39 -10 68 0 82 -89 432 -110 432 -6 0 41 -213 75 -334 9 -29 11 -55 6 -64\n-11 -19 -141 371 -165 493 -15 78 -36 238 -36 283 0 37 18 25 28 -20z m-484\n-99 c5 -4 2 -28 -7 -56 -8 -26 -18 -68 -22 -93 -4 -25 -16 -67 -27 -95 -18\n-48 -138 -506 -191 -730 -37 -154 -56 -272 -64 -387 -4 -73 -9 -98 -20 -98\n-19 0 -129 51 -181 84 l-43 27 19 27 c57 83 152 367 227 681 95 395 114 475\n125 531 6 30 15 72 21 93 l10 38 72 -7 c40 -3 76 -10 81 -15z m1555 -147 c-25\n-26 -72 -81 -104 -122 -79 -100 -327 -348 -390 -390 -27 -18 -65 -47 -84 -63\n-19 -16 -51 -36 -70 -44 -20 -8 -43 -24 -52 -35 -17 -18 -18 -18 -29 -1 -8 12\n-10 13 -7 3 3 -9 -1 -24 -9 -35 -8 -10 -14 -16 -14 -12 0 16 -2 23 -12 35 -7\n8 -7 12 0 12 7 0 9 7 5 17 -4 10 -2 14 4 10 10 -6 27 27 24 46 -1 5 3 6 8 3\n11 -7 22 19 15 37 -3 8 2 20 10 27 9 7 13 16 10 21 -3 5 -1 9 4 9 18 0 21 -30\n4 -42 -19 -14 -28 -58 -12 -58 6 0 10 -7 10 -15 0 -8 -4 -15 -9 -15 -5 0 -11\n-7 -15 -15 -9 -25 2 -17 78 53 41 37 131 118 200 181 69 62 126 120 126 129 0\n11 -14 2 -42 -25 -24 -23 -60 -54 -80 -70 -20 -15 -85 -70 -143 -121 -58 -51\n-105 -89 -105 -85 1 34 270 295 456 443 95 76 255 182 262 175 3 -3 -14 -27\n-39 -53z m-1294 -624 c2 -13 9 -68 15 -123 6 -55 17 -122 24 -150 30 -110 41\n-224 41 -425 0 -151 -4 -214 -14 -237 -13 -33 -25 -41 -35 -24 -6 9 -28 177\n-51 386 -14 122 -18 454 -8 553 5 45 20 56 28 20z m1369 14 c3 -5 -1 -9 -9 -9\n-8 0 -12 4 -9 9 3 4 7 8 9 8 2 0 6 -4 9 -8z m-41 -19 c3 -5 -17 -22 -44 -39\n-39 -26 -50 -29 -59 -19 -17 20 28 49 49 32 11 -9 13 -9 8 0 -4 7 0 16 10 22\n22 13 30 13 36 4z m-136 -86 c-74 -58 -315 -205 -427 -259 -208 -100 -229\n-110 -247 -105 -12 2 6 15 50 35 119 55 247 135 236 147 -7 6 -243 -108 -311\n-151 -57 -36 -70 -24 -18 15 82 59 234 152 305 185 39 19 140 57 225 86 85 29\n159 56 165 61 5 5 18 9 30 8 18 0 17 -2 -8 -22z m-807 -267 c0 -5 -2 -10 -4\n-10 -3 0 -8 5 -11 10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z m-35 -90 c-17 -19\n-17 -21 0 -40 18 -19 17 -20 -3 -20 -12 0 -22 -6 -23 -12 0 -10 -2 -10 -6 0\n-2 6 -10 10 -16 6 -7 -3 -4 1 6 9 9 8 17 23 17 34 0 20 18 43 34 43 5 0 1 -9\n-9 -20z m-1215 -439 c-6 -12 -8 -27 -4 -34 5 -9 4 -9 -5 -1 -10 9 -10 17 -1\n33 6 12 8 27 4 34 -5 9 -4 9 5 1 10 -9 10 -17 1 -33z m261 20 c-8 -5 -10 -14\n-6 -21 6 -9 4 -11 -4 -6 -8 5 -12 3 -10 -5 3 -26 -1 -45 -14 -64 -13 -17 -14\n-17 -12 3 0 11 6 27 13 35 7 7 9 16 6 20 -9 8 15 47 29 47 8 0 8 -3 -2 -9z\nm-284 -143 c-3 -7 -5 -2 -5 12 0 14 2 19 5 13 2 -7 2 -19 0 -25z m238 12 c3\n-5 1 -10 -4 -10 -6 0 -11 5 -11 10 0 6 2 10 4 10 3 0 8 -4 11 -10z m-1030\n-173 c26 -78 65 -183 86 -233 45 -107 91 -265 119 -410 20 -105 25 -228 9\n-218 -27 16 -130 267 -155 375 -9 41 -26 119 -39 174 -51 219 -95 443 -95 474\n1 37 29 -24 75 -162z m776 106 c-12 -20 -14 -14 -5 12 4 9 9 14 11 11 3 -2 0\n-13 -6 -23z m2245 -195 c4 -7 4 -10 -1 -6 -4 4 -17 -2 -27 -15 -19 -21 -20\n-21 -16 -2 2 16 12 26 35 34 1 1 5 -5 9 -11z m-66 -32 c-21 -20 -152 -91 -370\n-201 -180 -90 -339 -155 -383 -155 -12 0 -46 -11 -75 -25 -58 -27 -72 -30 -72\n-16 0 5 44 27 98 50 53 23 108 50 122 61 25 19 25 20 3 20 -12 0 -77 -25 -144\n-55 -68 -30 -125 -53 -127 -50 -6 6 115 92 185 131 177 100 618 249 743 253\n30 1 32 -1 20 -13z m-2554 -158 c-13 -193 -47 -389 -88 -503 -20 -57 -48 -105\n-35 -60 3 11 15 50 26 87 11 37 22 93 26 125 4 32 13 93 21 137 17 92 18 119\n4 111 -14 -9 -12 17 4 56 8 19 17 57 21 84 4 28 9 53 12 58 13 22 15 -3 9 -95z\nm-76 -270 c-12 -56 -23 -104 -26 -107 -15 -15 7 147 33 239 l7 25 4 -27 c2\n-15 -6 -74 -18 -130z m1696 25 c-3 -8 -2 -12 3 -9 5 3 15 -2 22 -11 10 -12 10\n-14 2 -9 -7 4 -13 2 -13 -3 0 -6 -6 -11 -12 -11 -7 0 -26 -7 -42 -15 -15 -8\n-32 -13 -36 -10 -5 3 -11 -1 -13 -7 -3 -8 -6 -5 -6 5 -1 14 4 17 22 12 15 -4\n18 -4 8 3 -15 11 -6 36 10 26 5 -3 8 0 7 8 -2 7 3 12 10 11 6 -2 11 0 11 5 -3\n14 1 19 16 19 9 0 14 -6 11 -14z m-236 -171 c-7 -3 -19 3 -28 13 -16 15 -15\n16 12 4 15 -7 23 -15 16 -17z m-1490 3 c0 -8 -4 -15 -10 -15 -5 0 -7 7 -4 15\n4 8 8 15 10 15 2 0 4 -7 4 -15z m1510 -26 c0 -5 5 -7 12 -3 7 4 8 3 4 -5 -6\n-9 -11 -9 -22 0 -17 14 -18 19 -4 19 6 0 10 -5 10 -11z m35 -18 c-3 -5 2 -17\n11 -25 8 -9 11 -16 6 -16 -15 0 -34 28 -27 40 3 5 8 10 11 10 3 0 3 -4 -1 -9z\nm-1874 -238 c108 -111 194 -215 222 -268 8 -17 24 -39 36 -49 12 -11 21 -26\n21 -35 0 -27 -96 78 -126 138 -19 38 -63 91 -136 163 -105 105 -149 158 -131\n158 4 0 56 -48 114 -107z m294 76 c-8 -14 -11 -30 -7 -34 4 -5 1 -5 -6 0 -8 4\n-12 16 -9 26 3 11 1 17 -4 13 -5 -3 -9 -1 -9 4 0 14 11 21 30 19 17 -1 17 -4\n5 -28z m995 -13 c0 -2 -8 -10 -17 -17 -16 -13 -17 -12 -4 4 13 16 21 21 21 13z\nm-40 -20 c0 -2 -12 -11 -27 -20 l-28 -17 24 20 c23 21 31 25 31 17z m-64 -38\nc4 4 4 2 0 -5 -4 -7 -13 -10 -21 -6 -8 3 -15 0 -15 -7 0 -6 -4 -8 -10 -5 -5 3\n-10 1 -10 -5 0 -6 -5 -8 -12 -4 -8 5 -6 11 5 19 9 7 13 15 10 19 -4 4 4 3 19\n-3 14 -5 29 -7 34 -3z m-1138 -112 c29 -43 48 -76 41 -74 -15 5 -119 138 -119\n151 0 23 29 -7 78 -77z m1058 52 c-9 -5 -13 -15 -10 -21 4 -7 4 -9 0 -5 -9 8\n-36 -13 -30 -23 2 -4 -3 -12 -11 -19 -10 -9 -15 -9 -15 -1 0 6 5 11 10 11 6 0\n9 3 8 8 -2 13 18 53 27 55 6 1 9 5 8 9 -2 4 4 5 13 1 15 -5 15 -7 0 -15z\nm-127 -158 c-18 -22 -34 -40 -36 -40 -8 0 52 80 60 80 4 0 -7 -18 -24 -40z\nm-855 4 c4 -10 1 -14 -6 -12 -15 5 -23 28 -10 28 5 0 13 -7 16 -16z m766 -133\nc-5 -11 -15 -23 -21 -27 -6 -3 -3 5 6 20 20 30 30 35 15 7z m-53 -79 c-15 -16\n-25 -31 -22 -34 3 -3 -1 -11 -10 -18 -8 -7 -15 -19 -15 -27 0 -7 -6 -16 -14\n-19 -8 -3 -12 -13 -10 -22 5 -14 3 -13 -10 2 -17 21 -13 38 9 30 10 -4 12 0 8\n16 -4 14 -1 20 8 18 7 -2 13 2 14 9 0 13 58 82 64 77 3 -2 -8 -17 -22 -32z\nm506 -124 c-21 -40 -78 -135 -128 -210 -49 -76 -116 -177 -147 -225 -83 -127\n-207 -285 -219 -277 -7 4 -5 12 5 23 8 9 31 48 50 86 35 68 94 163 192 314 27\n40 63 96 81 123 17 28 40 59 49 69 9 10 12 19 6 19 -6 0 -19 -12 -29 -26 -10\n-14 -37 -49 -61 -77 -24 -29 -59 -81 -79 -117 -19 -36 -68 -114 -108 -175 -40\n-60 -83 -129 -96 -152 -19 -37 -39 -55 -39 -38 0 3 22 53 49 110 52 111 131\n238 214 345 56 73 290 302 295 289 2 -5 -14 -41 -35 -81z m-993 37 c0 -27 -25\n-9 -27 19 -1 28 0 29 13 11 8 -10 14 -24 14 -30z m390 -53 c0 -16 -85 -136\n-100 -141 -12 -3 -11 0 3 20 9 13 31 48 49 77 30 47 48 64 48 44z m-97 -168\nc3 -3 3 -13 0 -21 -5 -12 -7 -12 -14 -1 -7 10 -9 9 -10 -4 -3 -31 -3 -33 -27\n-63 -26 -34 -26 -30 8 43 23 51 30 58 43 46z m-83 -144 c-6 -11 -13 -20 -16\n-20 -2 0 0 9 6 20 6 11 13 20 16 20 2 0 0 -9 -6 -20z m1579 -169 c16 -10 -70\n-45 -139 -55 -25 -4 -74 -16 -110 -27 -36 -10 -99 -25 -140 -33 -41 -8 -129\n-26 -195 -41 -66 -15 -151 -31 -190 -36 -38 -5 -100 -13 -136 -18 -37 -4 -70\n-11 -76 -14 -5 -3 -15 -2 -23 4 -12 7 -11 9 5 9 11 0 58 18 105 39 47 22 110\n48 140 59 36 14 47 21 31 21 -31 1 -188 -52 -263 -89 -34 -17 -66 -29 -71 -27\n-10 3 145 97 160 97 5 0 26 10 48 21 76 41 115 51 325 84 96 15 507 20 529 6z\nm-1699 -45 c0 -3 -4 -8 -10 -11 -5 -3 -10 -1 -10 4 0 6 5 11 10 11 6 0 10 -2\n10 -4z m-69 -153 c-12 -20 -14 -14 -5 12 4 9 9 14 11 11 3 -2 0 -13 -6 -23z\nm454 7 c4 -6 2 -17 -5 -25 -8 -10 -8 -15 1 -21 8 -4 9 -3 5 4 -4 8 -2 10 8 6\n9 -3 12 -12 9 -22 -9 -26 -24 -42 -33 -37 -5 3 -11 1 -14 -4 -4 -5 -1 -13 5\n-17 8 -5 9 -3 4 6 -5 9 -4 11 3 6 9 -5 4 -18 -14 -42 -21 -27 -24 -37 -15 -48\n7 -8 19 -12 29 -9 9 2 26 -5 38 -15 16 -15 25 -17 39 -9 11 6 52 10 92 10 64\n0 82 -4 150 -38 66 -32 96 -56 192 -154 131 -134 221 -241 221 -265 0 -22 -1\n-22 -77 24 -134 82 -312 216 -432 326 -95 86 -116 99 -145 86 -17 -7 -27 -7\n-34 0 -11 11 -75 -12 -87 -32 -4 -6 -11 -8 -16 -4 -5 3 -8 0 -7 -8 2 -7 -4\n-13 -12 -13 -15 0 -15 3 2 65 6 19 12 52 15 73 3 20 9 37 15 37 5 0 8 8 7 18\n-3 37 2 61 17 76 8 9 13 16 9 16 -3 0 -3 5 0 10 8 13 22 13 30 0z m232 -34\nc-4 -10 4 -12 31 -10 33 2 35 1 19 -11 -11 -8 -25 -11 -32 -9 -7 3 -16 1 -20\n-5 -3 -6 -12 -11 -18 -11 -7 0 -6 4 3 10 13 8 13 10 -2 10 -9 0 -23 -6 -30\n-12 -7 -7 -22 -14 -33 -16 -11 -2 2 12 30 31 59 41 59 41 52 23z m-706 -43\nc-12 -20 -14 -14 -5 12 4 9 9 14 11 11 3 -2 0 -13 -6 -23z m-314 -265 c-3 -8\n-6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z m-14 -63 c-3 -9 -8 -14 -10 -11\n-3 3 -2 9 2 15 9 16 15 13 8 -4z m217 -95 c0 -5 -2 -10 -4 -10 -3 0 -8 5 -11\n10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z m-23 -52 c-3 -8 -6 -5 -6 6 -1 11 2 17\n5 13 3 -3 4 -12 1 -19z m-81 -470 c5 -7 3 -8 -6 -3 -10 6 -12 4 -7 -8 3 -10 2\n-17 -3 -17 -6 0 -10 -9 -10 -20 0 -11 -5 -20 -11 -20 -6 0 -8 9 -4 21 4 12 9\n29 10 38 2 9 4 17 4 19 2 7 21 0 27 -10z\"/>\n<path d=\"M3674 5629 c2 -52 5 -168 6 -259 l3 -165 9 90 c13 125 7 400 -9 416\n-10 10 -12 -7 -9 -82z\"/>\n<path d=\"M4875 6061 c-3 -5 -2 -12 3 -15 5 -3 9 1 9 9 0 17 -3 19 -12 6z\"/>\n<path d=\"M2074 4430 c31 -125 57 -212 75 -250 20 -44 30 -34 12 12 -5 13 -14\n41 -20 63 -23 86 -52 171 -62 185 -8 12 -9 9 -5 -10z\"/>\n<path d=\"M3495 2844 c-81 -16 -125 -28 -125 -34 0 -4 25 -3 55 2 56 9 105 24\n105 33 0 5 -2 5 -35 -1z\"/>\n<path d=\"M2890 2491 c0 -6 12 -14 28 -17 39 -10 114 -49 148 -77 37 -31 94\n-60 94 -48 0 17 -71 71 -138 105 -75 38 -132 54 -132 37z\"/>\n<path d=\"M3960 6905 c0 -5 5 -17 10 -25 5 -8 10 -10 10 -5 0 6 -5 17 -10 25\n-5 8 -10 11 -10 5z\"/>\n<path d=\"M5089 6793 c-13 -16 -12 -17 4 -4 16 13 21 21 13 21 -2 0 -10 -8 -17\n-17z\"/>\n<path d=\"M4656 6658 c3 -5 10 -6 15 -3 13 9 11 12 -6 12 -8 0 -12 -4 -9 -9z\"/>\n<path d=\"M2885 5380 c3 -5 16 -10 28 -9 21 0 21 1 2 9 -28 12 -37 12 -30 0z\"/>\n<path d=\"M3680 4176 c0 -2 8 -10 18 -17 15 -13 16 -12 3 4 -13 16 -21 21 -21\n13z\"/>\n<path d=\"M2886 3892 c-3 -5 1 -9 9 -9 8 0 12 4 9 9 -3 4 -7 8 -9 8 -2 0 -6 -4\n-9 -8z\"/>\n<path d=\"M1846 3882 c-3 -5 1 -9 9 -9 8 0 12 4 9 9 -3 4 -7 8 -9 8 -2 0 -6 -4\n-9 -8z\"/>\n<path d=\"M1849 3833 c-13 -16 -12 -17 4 -4 9 7 17 15 17 17 0 8 -8 3 -21 -13z\"/>\n<path d=\"M2935 3691 c-3 -5 -2 -12 3 -15 5 -3 9 1 9 9 0 17 -3 19 -12 6z\"/>\n<path d=\"M4220 2910 c-9 -6 -10 -10 -3 -10 6 0 15 5 18 10 8 12 4 12 -15 0z\"/>\n<path d=\"M1720 1591 c0 -9 30 -24 36 -18 2 1 -6 8 -16 15 -11 7 -20 8 -20 3z\"/>\n<path d=\"M1632 1530 c-6 -11 -12 -47 -12 -81 0 -61 -32 -204 -70 -314 -12 -33\n-28 -87 -36 -120 -9 -33 -21 -83 -29 -111 -13 -55 -74 -251 -107 -349 -11 -33\n-31 -98 -44 -144 -31 -113 -81 -263 -110 -333 -29 -69 -29 -68 -5 -68 15 0 29\n28 69 138 28 75 58 164 67 198 8 34 22 79 31 100 21 50 151 470 169 550 8 33\n22 80 30 105 9 24 23 76 32 114 8 39 19 75 23 80 8 11 25 95 35 168 3 26 9 47\n12 47 15 0 171 -81 197 -103 l28 -23 -21 -41 c-33 -66 -82 -192 -107 -278 -27\n-95 -80 -256 -100 -305 -7 -19 -27 -91 -44 -160 -17 -69 -44 -161 -59 -205\n-16 -44 -34 -105 -41 -135 -7 -30 -17 -60 -22 -66 -5 -7 -15 -43 -23 -82 -8\n-38 -18 -78 -21 -87 -5 -13 -2 -16 15 -13 27 4 47 53 96 233 17 66 43 158 57\n205 14 47 36 123 48 170 53 195 215 668 256 743 15 27 15 29 -22 62 -21 19\n-47 38 -58 41 -12 4 -28 13 -37 20 -15 14 -152 64 -173 64 -6 0 -17 -9 -24\n-20z\"/>\n</g>\n</svg>\n",
      "color": "#3b82f6",
      "width": 465,
      "x": 0,
      "y": 44,
      "rotation": 0,
      "opacity": 0.85,
      "zIndex": 2,
      "animation": "none",
      "flipX": false,
      "layer": "bg"
    },
    {
      "id": "asset-1787822851966-savh",
      "name": "Aset Melayang Baru",
      "section": "home",
      "type": "svg",
      "content": "<svg viewBox=\"0 0 100 100\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z\" fill=\"currentColor\"/></svg>",
      "color": "#000000",
      "width": 45,
      "x": 88,
      "y": 11,
      "rotation": 0,
      "opacity": 0.85,
      "zIndex": 15,
      "animation": "float",
      "flipX": false
    },
    {
      "id": "asset-1787822885214-m11m",
      "name": "Aset Melayang Baru",
      "section": "home",
      "type": "svg",
      "content": "<svg viewBox=\"0 0 100 100\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z\" fill=\"currentColor\"/></svg>",
      "color": "#000000",
      "width": 70,
      "x": 88,
      "y": 16,
      "rotation": 0,
      "opacity": 0.85,
      "zIndex": 15,
      "animation": "float",
      "flipX": false
    },
    {
      "id": "asset-1787822886040-zfaa",
      "name": "Aset Melayang Baru",
      "section": "home",
      "type": "svg",
      "content": "<svg viewBox=\"0 0 100 100\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z\" fill=\"currentColor\"/></svg>",
      "color": "#000000",
      "width": 45,
      "x": 92,
      "y": 12,
      "rotation": 0,
      "opacity": 0.85,
      "zIndex": 15,
      "animation": "float",
      "flipX": false
    },
    {
      "id": "asset-1787822965751-ib8i",
      "name": "Aset Melayang Baru",
      "section": "home",
      "type": "svg",
      "content": "<svg viewBox=\"0 0 100 100\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10 50 Q 30 15 50 45 Q 70 15 90 50 Q 70 32 50 52 Q 30 32 10 50 Z\" fill=\"currentColor\"/></svg>",
      "color": "#000000",
      "width": 53,
      "x": 84,
      "y": 13,
      "rotation": 0,
      "opacity": 0.85,
      "zIndex": 15,
      "animation": "float",
      "flipX": false
    }
  ],
  "aboutMe": "Driven and detail-oriented Senior Data Analyst with over 6 years of experience engineering high-impact SQL pipelines, advanced predictive models, and intuitive executive-level BI dashboards. Adept at turning complex unstructured transactional records into optimized operational decisions and actionable revenue insights.\n\nPassionate about data transparency, pipeline performance alignment, and strategic growth. Committed to driving efficiency through statistical verification frameworks and transparent KPIs.",
  "avatarUrl": "/profile.png",
  "avatarScale": 1.3,
  "avatarX": -1,
  "avatarY": 4,
  "homeImageUrl": "/profile-black.png",
  "homeImageUrlDark": "/profile-white.png",
  "homeImageScale": 1.35,
  "homeImageX": 0,
  "homeImageY": -11,
  "aboutStoryImageScale": 1,
  "aboutStoryImageX": 0,
  "aboutStoryImageY": 0,
  "idCardGroup": "354",
  "idCardSubText": "UNIVERSITAS KELAS",
  "idCardText3": "DATA ANALYST",
  "idCardBgTextSize": 38,
  "idCardPortraitFadeEnabled": true,
  "idCardPortraitFadeStart": 50,
  "idCardPortraitFadeEnd": 100,
  "useNicknameOnCard": false,
  "idCardSvgLight": "/id_card.webp",
  "idCardSvgDark": "/id_card.webp",
  "idCardSvgScale": 1,
  "idCardSvgX": 0,
  "idCardSvgY": 0,
  "idCardTextX": 0,
  "idCardTextY": 0,
  "idCardBadgeX": 0,
  "idCardBadgeY": 0,
  "idCardSvgs": [],
  "customSocials": [
    {
      "id": "social-linkedin",
      "name": "LinkedIn",
      "value": "Muhammad Zufar Fauzi",
      "usernameOrUrl": "muhammad-zufar-fauzi",
      "showOnWeb": true,
      "showOnCvHeader": true,
      "showOnCvFooter": true
    },
    {
      "id": "social-github",
      "name": "GitHub",
      "value": "ZufarFz",
      "usernameOrUrl": "ZufarFz",
      "showOnWeb": true,
      "showOnCvHeader": true,
      "showOnCvFooter": true
    },
    {
      "id": "social-whatsapp",
      "name": "WhatsApp",
      "value": "085123333230",
      "usernameOrUrl": "085123333230",
      "showOnWeb": true,
      "showOnCvHeader": true,
      "showOnCvFooter": true
    },
    {
      "id": "social-instagram",
      "name": "Instagram",
      "value": "Zuf.Fz_",
      "usernameOrUrl": "Zuf.Fz_",
      "showOnWeb": true,
      "showOnCvHeader": true,
      "showOnCvFooter": true
    },
    {
      "id": "social-website",
      "name": "Website",
      "value": "portfolio-zufar.netlify.app",
      "usernameOrUrl": "https://portfolio-zufar.netlify.app/",
      "showOnWeb": false,
      "showOnCvHeader": false,
      "showOnCvFooter": true
    }
  ],
  "headerContacts": [
    "location",
    "email",
    "social-linkedin",
    "social-github",
    "social-whatsapp"
  ],
  "footerSocials": [
    "social-linkedin",
    "social-github",
    "social-instagram",
    "social-whatsapp",
    "social-website"
  ],
  "cardSocials": [
    "social-linkedin",
    "social-github",
    "social-whatsapp"
  ],
  "methodologyTitle": "Core Methodology",
  "methodologyText": "My analyst philosophy centers around absolute transparency of pipeline metrics. Rather than larping with mock structures, I prioritize rigorous statistical validation (ANOVA, significance tests) and intuitive visual UX dashboards that drive executive-level decision making.",
  "technicalArsenal": {
    "dbms": "SQL, PostgreSQL, Snowflake, BigQuery, CTEs, Window Functions",
    "scientificLanguages": "Python (Pandas, Numpy, Scikit-learn), R Stats (ggplot2, ANOVA)",
    "dataPresentation": "Tableau, PowerBI (DAX Modeling), Excel, PowerPivot",
    "analyticsSpecialties": "RFM Customer Clustering, Time-Series Forecasting, Logistic Nodes Optimization"
  },
  "webTexts": {
    "education_title": "Educational Background & Story",
    "education_intro": "Explore my academic achievements, scientific training foundations, and formal credential roadmaps represented in customized presentation sheets.",
    "personality_title": "Personality & Values",
    "personality_intro": "My operating principles, character ethics, and core professional values that guide my collaborative work style.",
    "hobbies_title": "Hobbies & Interests",
    "hobbies_intro": "What keeps me inspired and energizes my creative problem-solving outside of regular business hours.",
    "career_journey_title": "Career Journey & Milestones",
    "career_journey_intro": "My timeline of professional experiences, highlighting analytical leadership, data strategy, and metric modernization.",
    "career_goals_title": "Career Goals & Aspirations",
    "career_goals_intro": "Strategic trajectory, upcoming technical capabilities, and milestones I aim to achieve.",
    "hero_badge": "My Profil",
    "hero_title": "JUNIOR DATA ANALYST",
    "hero_subtitle": "Data Analyst with proven experience in process automation and data workflow optimization. Recognized for transforming tedious manual Excel reporting into automated, ERP-integrated Power Query solutions, successfully cutting team operational time by 50%. Equipped with foundational skills in SQL and an adaptive capability to leverage AI-assisted Python for streamlined data tasks.\n\nCurrently expanding expertise into advanced SQL and Machine Learning to drive deeper predictive insights. Highly motivated to bring high-impact efficiency and robust data-driven solutions to a forward-thinking team.",
    "projects_badge": "My Project",
    "projects_title": "SELECTED CASE STUDIES",
    "projects_subtitle": "A curated selection of projects demonstrating how I transform raw data into actionable insights. Leveraging Excel and Power Query for data efficiency, combined with SQL and Python for deeper analysis and automation.",
    "skills_badge": "My Skills",
    "skills_title": "TECHNICAL SKILLS",
    "skills_subtitle": "A technical skill set tailored for the data lifecycle. From efficient data preparation with Power Query, robust analysis using Excel and SQL, to data programming with Python.",
    "experience_badge": "My Work Experience",
    "experience_title": "WORK EXPERIENCE",
    "experience_subtitle": "My career journey and professional experience in dynamic work environments, where attention to detail, collaboration, and data management were key to success.",
    "contact_badge": "Contact Me",
    "contact_title": "LET'S CONNECT",
    "contact_subtitle": "I am always open to Junior Data Analyst opportunities, collaborative projects, or just chatting about data. Feel free to reach out via email or LinkedIn—I’d love to connect!",
    "about_story_badge": "✦ DISCOVER OUR STORY",
    "about_story_title": "About Me",
    "about_story_intro": "I am a passionate Business Intelligence Analyst and Developer dedicated to synthesizing raw complexity into high-fidelity, interactive applications. With a dual focus on data pipeline architecture and pixel-perfect design craftsmanship, I transform ambitious visions into reality.",
    "about_story_image_url": "{\"backgroundImageUrl\":\"/aboutme_header.webp\",\"lanyardLightUrl\":\"/id_card.webp\",\"lanyardDarkUrl\":\"/id_card.webp\"}",
    "about_story_left_1_title": "Interior / Data Architecture",
    "about_story_left_1_desc": "Structuring clean, robust pipelines and modeling relational schemas to establish a highly performant data foundation.",
    "about_story_left_2_title": "Exterior / Visual Analytics",
    "about_story_left_2_desc": "Crafting intuitive dashboards and reports that deliver immediate insights and elevate decision-making speed.",
    "about_story_left_3_title": "Design / Product Strategy",
    "about_story_left_3_desc": "Blending sleek user interface design with rapid interactions for web portals that are both functional and delightful.",
    "about_story_right_1_title": "Decoration / Business Strategy",
    "about_story_right_1_desc": "Translating corporate requirements into verifiable KPIs that optimize operational performance and unlock growth.",
    "about_story_right_2_title": "Planning / Careful Logic",
    "about_story_right_2_desc": "Iterating carefully through requirements, timelines, schema design, and constraints with high professional standards.",
    "about_story_right_3_title": "Execution / Sleek Delivery",
    "about_story_right_3_desc": "Bringing data projects to life through flawless code integration, thorough validation, and continuous alignment.",
    "about_story_header_bg": "/aboutme_header.webp",
    "about_story_header_bg_scale": "1",
    "about_story_header_bg_x": "0",
    "about_story_header_bg_y": "0",
    "home_image_mask_style": "fade_bottom",
    "home_image_fade_depth": "73",
    "home_image_fade_width": "89",
    "home_bg_style": "pattern_seigaiha",
    "name_id": "Muhammad Zufar Fauzi",
    "nickname_id": "Zufar",
    "title_en": "Junior Data Analyst",
    "title_id": "Data Analis Junior",
    "location_en": "Klaten, Jawa Tengah",
    "education_header_bg": "/edu-header.webp",
    "education_header_bg_scale": "1.22",
    "education_header_bg_y": "22",
    "hero_badge_id": "Profil",
    "hero_title_id": "DATA ANALIS JUNIOR",
    "hero_subtitle_id": "Analis Data dengan pengalaman terbukti dalam otomatisasi proses dan optimalisasi alur kerja data. Dikenal karena keberhasilannya mengubah pelaporan manual Excel yang memakan waktu menjadi solusi otomatis berbasis Power Query yang terintegrasi dengan ERP, sehingga berhasil memangkas waktu operasional tim hingga 50%. Memiliki keterampilan dasar SQL serta kemampuan adaptif dalam memanfaatkan Python yang didukung AI untuk mengefisienkan tugas-tugas pengolahan data.\n\nSaat ini sedang mengembangkan keahlian di bidang SQL tingkat lanjut dan *Machine Learning* guna menghasilkan wawasan prediktif yang lebih mendalam. Memiliki motivasi tinggi untuk menghadirkan efisiensi berdampak besar serta solusi berbasis data yang tangguh bagi tim yang berorientasi ke masa depan.",
    "projects_badge_id": "Project",
    "projects_title_id": "STUDI KASUS TERPILIH",
    "projects_subtitle_id": "Kumpulan proyek pilihan yang menunjukkan bagaimana saya mengubah data mentah menjadi wawasan yang dapat ditindaklanjuti. Saya memanfaatkan Excel dan Power Query untuk efisiensi data, serta memadukannya dengan SQL dan Python untuk analisis yang lebih mendalam dan otomatisasi.",
    "skills_badge_id": "Keahlian",
    "skills_title_id": "KEAHLIAN Teknis",
    "skills_subtitle_id": "Kumpulan keterampilan teknis yang dirancang khusus untuk siklus hidup data—mulai dari persiapan data yang efisien menggunakan Power Query dan analisis tangguh dengan Excel serta SQL, hingga pemrograman data menggunakan Python.",
    "contact_badge_id": "Info Kontak",
    "contact_title_id": "MARI TERHUBUNG",
    "contact_subtitle_id": "Saya selalu terbuka terhadap peluang sebagai Junior Data Analyst, proyek kolaboratif, atau sekadar berbincang mengenai data. Jangan ragu untuk menghubungi saya melalui email atau LinkedIn—saya senang bisa terhubung dengan Anda!",
    "experience_badge_id": "Pengalaman Kerja",
    "experience_title_id": "PERJALANAN PROFESIONAL",
    "experience_subtitle_id": "Perjalanan karier dan pengalaman profesional saya di lingkungan kerja yang dinamis, di mana ketelitian, kolaborasi, dan pengelolaan data menjadi kunci keberhasilan.",
    "home_bg_style_id": "pattern_seigaiha",
    "home_bg_style_en": "pattern_seigaiha",
    "skills_bg_style": "pattern_japanese_clouds",
    "skills_bg_style_id": "pattern_japanese_clouds",
    "skills_bg_style_en": "pattern_japanese_clouds",
    "contact_bg_style": "pattern_japanese_clouds",
    "contact_bg_style_id": "pattern_japanese_clouds",
    "contact_bg_style_en": "pattern_japanese_clouds",
    "about_story_bg_style": "none",
    "about_story_bg_style_id": "none",
    "about_story_bg_style_en": "none",
    "contact_bg_pattern_opacity": "0.07",
    "contact_bg_pattern_opacity_id": "0.07",
    "contact_bg_pattern_opacity_en": "0.07",
    "skills_bg_pattern_opacity": "0.07",
    "skills_bg_pattern_opacity_id": "0.07",
    "skills_bg_pattern_opacity_en": "0.07",
    "home_bg_pattern_opacity": "0.15",
    "home_bg_pattern_opacity_id": "0.15",
    "home_bg_pattern_opacity_en": "0.15",
    "about_story_bg_pattern_opacity": "0.13",
    "about_story_bg_pattern_opacity_id": "0.13",
    "about_story_bg_pattern_opacity_en": "0.13",
    "home_image_mask_style_id": "fade_bottom",
    "home_image_mask_style_en": "fade_bottom",
    "home_image_fade_depth_id": "73",
    "home_image_fade_depth_en": "73",
    "home_image_fade_width_id": "89",
    "home_image_fade_width_en": "89",
    "home_bg_color": "#f0f7ff",
    "home_bg_color_id": "#f0f7ff",
    "home_bg_color_en": "#f0f7ff",
    "navbar_bg_color": "#ffffff",
    "navbar_bg_color_id": "#ffffff",
    "navbar_bg_color_en": "#ffffff",
    "hero_bg_color": "#f0f7ff",
    "hero_bg_color_id": "#f0f7ff",
    "hero_bg_color_en": "#f0f7ff",
    "home_shadow_enabled": "true",
    "home_shadow_enabled_id": "true",
    "home_shadow_enabled_en": "true",
    "hero_shadow_enabled": "true",
    "hero_shadow_enabled_id": "true",
    "hero_shadow_enabled_en": "true",
    "home_shadow_depth": "95",
    "home_shadow_depth_id": "95",
    "home_shadow_depth_en": "95",
    "hero_shadow_depth": "95",
    "hero_shadow_depth_id": "95",
    "hero_shadow_depth_en": "95",
    "home_shadow_opacity": "0.4",
    "home_shadow_opacity_id": "0.4",
    "home_shadow_opacity_en": "0.4",
    "hero_shadow_opacity": "0.4",
    "hero_shadow_opacity_id": "0.4",
    "hero_shadow_opacity_en": "0.4",
    "home_shadow_color_mode": "custom",
    "home_shadow_color_mode_id": "custom",
    "home_shadow_color_mode_en": "custom",
    "hero_shadow_color_mode": "custom",
    "hero_shadow_color_mode_id": "custom",
    "hero_shadow_color_mode_en": "custom",
    "home_shadow_custom_color": "#2196f3",
    "home_shadow_custom_color_id": "#2196f3",
    "home_shadow_custom_color_en": "#2196f3",
    "hero_shadow_custom_color": "#2196f3",
    "hero_shadow_custom_color_id": "#2196f3",
    "hero_shadow_custom_color_en": "#2196f3"
  },
  "caseStudies": [
    {
      "id": "customer-segmentation",
      "title": "Customer Segmentation Analysis",
      "category": "Marketing Analytics & Automation",
      "description": "Automated RFM (Recency, Frequency, Monetary) analysis using Python data structures to categorize 50,000+ global customers. Provided business users with live, self-serve cohorts to match marketing automation campaigns directly, boosting email campaign performance indices.",
      "tags": [
        "Python",
        "Power Query",
        "RFM Analysis",
        "Customer Cohorts"
      ],
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuFlL71mrCRfgkuPhdCAF98ij9wxg8CYLIpZ9-eLW7h4uYyJ3RK2vqfoTW-aEPtiwTloMPQUuzIimFyqJ62QDdsTxNT9V9l2dQQp3D8CsXiA5EcPdQFCYSqBrTkET1Lv_-6cLC38OVUm9k2ZDBgSW_nV0u-DVcX7jxS0Od8R6j6p7MF0JG-_eLpOay3rYolqMQEY9ihRsxkZ5XeBeSj7gEVSqO7l7Qm-S_fTzqNKCFqLTRAGH-zuMCMhVa5HVTLyD6jwldzeGj1geA",
      "impactMetric": "+24% Email CTR",
      "tools": [
        "Python",
        "Power Query",
        "SQL"
      ],
      "slides": [
        {
          "id": "cs-slide-1",
          "title": "Executive Problem & Hypothesis",
          "content": "We analyzed 50,000+ global customers to identify severe marketing churn pockets and optimize automated campaigns. Stagnant customer segmentation triggered high marketing decay rate, resulting in over $2.2M of potential lost cohorts annually.",
          "visualType": "metric",
          "metricLabel": "Identified Annual Risk Exposure",
          "metricValue": "$2.20M USD"
        },
        {
          "id": "cs-slide-2",
          "title": "RFM Cohorts Breakdown Pattern",
          "content": "Constructed precise SQL pipelines (using recursive CTEs and windowing functions) to group users dynamically by Recency, Frequency, and Monetary indices, feeding back directly to live mailing cohorts.",
          "visualType": "bullet_points",
          "bulletsList": [
            "Champions Segment: High frequency, high monetary, recently active target group.",
            "Average/Loyal Consumers: Medium recency, stable recurring orders index.",
            "Severe Churn Risk Cohorts: Haven't checked out in 120+ days. Prime reactivation target."
          ]
        },
        {
          "id": "cs-slide-3",
          "title": "Performance Uplift & Final Impact",
          "content": "Automating this RFM segmentation and connecting it to our campaign triggers unlocked an exceptional CTR upgrade. This minimized manual cohorts querying time from 12 hours a week to zero.",
          "visualType": "metric",
          "metricLabel": "Campaign Email CTR Growth",
          "metricValue": "+24.0%"
        }
      ]
    },
    {
      "id": "sales-forecasting",
      "title": "Sales Forecasting Model",
      "category": "Business Planning & Finance",
      "description": "Developed and validated an integrated predictive regression model analyzing multi-year historical order books. Predicts incoming enterprise revenue, seasonal variance modifiers, and marketing channel responses with over 95% validation accuracy.",
      "tags": [
        "SQL",
        "PowerBI",
        "Sales Trends",
        "Business Intelligence"
      ],
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuB4at_MfB3KVhLLsSAvR5O74aQ77QDJm5dapXWTiarjOduQPHE1pBfcrbGjeCW7o9usfS9TX8d-Gin7Kp0dJ0WTbNDL_ZwHe_JHbcmlZw3c_EWFbdd415cMyJy6qotSUSzinHUaJ-eINpz4Gh5Pk4Rz-_Qd3bmOcuA-_hPnMZvnayUVcsWZt7S_6mV71rvlkCXIdcCNenlUaSbFdmLog6E26dnCv-_hqCx5PcV-Klbi-t7cgynNu6p_Hz2Yt_F0IKOaCPVGlRmEI4Y",
      "impactMetric": "95% Model Accuracy",
      "tools": [
        "SQL",
        "PowerBI",
        "Python",
        "Excel"
      ],
      "slides": [
        {
          "id": "sf-slide-1",
          "title": "The Forecasting Challenge",
          "content": "Corporate financial analysts struggled with predicting high-velocity invoice variations due to rapid sea cargo seasonal lag conditions.",
          "visualType": "metric",
          "metricLabel": "Historic Quarterly Latency",
          "metricValue": "18.5 Days"
        },
        {
          "id": "sf-slide-2",
          "title": "Predictive Analytics Architecture",
          "content": "Fitted dynamic linear regression algorithms and trend models over a 5-year transactional dataset using Python scientific libraries.",
          "visualType": "bullet_points",
          "bulletsList": [
            "Data Extraction: Cleaned outlier raw data sequences via custom SQL scripts.",
            "Smoothing Patterns: Additive seasonality factor modeling.",
            "Deployment: Built an executive dashboard in PowerBI reflecting incoming trends."
          ]
        },
        {
          "id": "sf-slide-3",
          "title": "Accuracy Verification Statistics",
          "content": "Achieved exceptionally robust statistical scores under training cross-validations, meaning senior leaders can budget with maximum confidence.",
          "visualType": "metric",
          "metricLabel": "Cross-Validated Accuracy",
          "metricValue": "95.0%"
        }
      ]
    },
    {
      "id": "supply-chain",
      "title": "Supply Chain Optimization",
      "category": "Operational Logistics",
      "description": "Identified supply chain delivery bottlenecks through comprehensive spatial route allocation and lead-time analysis. Built responsive custom dashboard layouts in PowerBI using cleaned Power Query steps to flag high-latency routes, reducing total delivery lead times through warehouse re-allocation and smart routing patterns.",
      "tags": [
        "PowerBI",
        "Power Query",
        "Excel",
        "KPI Dashboard"
      ],
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDo-a6SXIcAxZjhbhWokPhtATOqTJOhP06ZPDuhdhhIbiZ6m4A8GLXhZNZrbXkcNF19Q85CjV-drdvyruBf0JWduWK9DvUM0lxCwK6jOnZNbbxJA98RlagxFrEdRld5IBNJti-Yacm4AGtAxKMLvi3-1shwH-cCcEdJW8N1dPls9YTrOO8meoT780A_8NMYuoy_soP_Rz82vTIPQ104Ht3AzarfvimQQGILH7zWiPyuZKlRwEnhLCxovkZQuXj7o0qLiWV2pyMgmNY",
      "impactMetric": "-15% Lead Time",
      "tools": [
        "PowerBI",
        "Power Query",
        "Excel",
        "SQL"
      ],
      "slides": [
        {
          "id": "sc-slide-1",
          "title": "Identifying Route Bottlenecks",
          "content": "Discovered critical lag sources in multi-point spatial route allocations, specifically where transport handoffs were delayed by carrier misalignments.",
          "visualType": "metric",
          "metricLabel": "Average Total Lead Time",
          "metricValue": "12.8 Days"
        },
        {
          "id": "sc-slide-2",
          "title": "BI Real-Time Dashboard Integration",
          "content": "Mapped custom geographic points using Power Query steps and automated APIs. Integrated interactive live warnings inside PowerBI to alert warehouse dispatch officers when an order risks entering high-latency paths.",
          "visualType": "bullet_points",
          "bulletsList": [
            "Dynamic Dispatch Alerts: Highlights active carriers carrying backlog warnings.",
            "Unified Schema: Converted diverse CSV outputs into centralized SQL schemas.",
            "Interactive Reports: Executives drill down into individual terminal wait logs."
          ]
        },
        {
          "id": "sc-slide-3",
          "title": "Operational Cost Savings",
          "content": "Enabled logistics managers to instantly reroute critical orders, bypassing carrier backlogs and achieving a highly visual reduction in transit delays.",
          "visualType": "metric",
          "metricLabel": "Lead Time Latency Decrease",
          "metricValue": "-15.0%"
        }
      ]
    }
  ],
  "skills": [
    {
      "id": "sql-en",
      "name": "SQL",
      "icon": "Database",
      "category": "dbms",
      "description": "Database query design, CTEs, window functions, query plan optimization, schema creation, PostgreSQL, and Snowflake setups.",
      "showOnWeb": true,
      "showOnCV": true,
      "customSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 100 100\"><path fill=\"#000\" d=\"M98.472 59.902c-.582-1.766-2.105-2.995-4.074-3.29-.929-.14-1.992-.08-3.251.18-2.194.454-3.821.627-5.009.66 4.483-7.59 8.129-16.246 10.227-24.393 3.394-13.175 1.58-19.177-.539-21.892C90.218 3.981 82.036.121 72.166.003c-5.267-.065-9.89.978-12.3 1.728-2.246-.398-4.66-.62-7.193-.66-4.749-.076-8.944.962-12.529 3.095a57 57 0 0 0-8.848-2.227C22.644.514 15.672 1.624 10.57 5.237c-6.175 4.375-9.038 11.975-8.509 22.59.168 3.37 2.048 13.625 5.009 23.35 1.701 5.59 3.515 10.232 5.392 13.798 2.661 5.058 5.51 8.035 8.706 9.105 1.792.599 5.048 1.018 8.472-1.842.434.527 1.013 1.05 1.782 1.537.976.618 2.17 1.122 3.361 1.42 4.296 1.078 8.319.808 11.752-.701.02.612.037 1.197.05 1.702.023.82.046 1.623.076 2.374.203 5.08.548 9.029 1.57 11.792.055.152.13.384.21.63.51 1.564 1.361 4.182 3.529 6.232C54.215 99.35 56.929 100 59.415 100c1.247 0 2.437-.164 3.48-.388 3.72-.8 7.944-2.017 11-6.38 2.889-4.125 4.293-10.337 4.547-20.126l.093-.793.06-.517.68.06.176.012c3.788.173 8.42-.633 11.265-1.958 2.248-1.046 9.452-4.86 7.756-10.008\"/><path fill=\"#336791\" d=\"M91.994 60.903c-11.264 2.33-12.038-1.494-12.038-1.494C91.848 41.713 96.82 19.251 92.53 13.753 80.825-1.243 60.564 5.85 60.226 6.033l-.109.02c-2.225-.463-4.716-.74-7.515-.785-5.096-.084-8.963 1.34-11.896 3.57 0 0-36.145-14.93-34.463 18.78.357 7.17 10.25 54.262 22.05 40.039 4.313-5.202 8.48-9.6 8.48-9.6 2.07 1.38 4.547 2.082 7.145 1.83l.202-.172c-.063.646-.034 1.277.08 2.025-3.04 3.406-2.146 4.004-8.223 5.258-6.149 1.271-2.537 3.533-.178 4.125 2.859.717 9.474 1.732 13.943-4.542l-.178.716c1.19.957 2.027 6.222 1.887 10.996-.14 4.773-.234 8.05.704 10.61.94 2.56 1.874 8.32 9.863 6.604 6.674-1.435 10.134-5.152 10.615-11.353.341-4.407 1.114-3.756 1.163-7.697l.62-1.865c.715-5.976.113-7.904 4.225-7.007l1 .088c3.027.138 6.988-.488 9.313-1.572 5.007-2.33 7.976-6.22 3.04-5.198\"/><path fill=\"#fff\" d=\"M42.821 30.825c-1.015-.142-1.934-.011-2.4.342a.88.88 0 0 0-.364.587c-.058.42.235.884.415 1.123.51.678 1.255 1.143 1.992 1.246q.16.022.319.022c1.229 0 2.347-.96 2.445-1.668.123-.887-1.161-1.479-2.407-1.652m33.627.028c-.097-.696-1.33-.894-2.502-.73-1.17.162-2.303.692-2.209 1.389.076.542 1.052 1.467 2.207 1.467q.146 0 .296-.02c.77-.108 1.337-.599 1.605-.882.41-.431.647-.912.603-1.224\"/><path fill=\"#fff\" d=\"M95.743 60.639c-.43-1.303-1.812-1.721-4.109-1.246-6.82 1.411-9.262.434-10.063-.158 5.3-8.098 9.66-17.886 12.013-27.018 1.114-4.326 1.73-8.343 1.78-11.618.056-3.594-.555-6.235-1.814-7.848-5.076-6.505-12.526-9.993-21.544-10.09-6.2-.069-11.437 1.522-12.453 1.97a31 31 0 0 0-7.008-.903c-4.654-.076-8.677 1.042-12.007 3.32a53.5 53.5 0 0 0-9.759-2.566c-7.905-1.277-14.187-.31-18.67 2.875-5.35 3.8-7.819 10.593-7.34 20.19.16 3.229 1.995 13.161 4.89 22.673 3.811 12.52 7.954 19.607 12.313 21.065.51.17 1.098.29 1.747.29 1.59 0 3.54-.719 5.568-3.164a201 201 0 0 1 7.674-8.707 12.34 12.34 0 0 0 5.52 1.489l.014.151q-.497.594-.973 1.206c-1.334 1.698-1.612 2.052-5.906 2.938-1.221.253-4.465.923-4.513 3.204-.052 2.491 3.835 3.538 4.277 3.648 1.543.388 3.03.579 4.448.579 3.447 0 6.482-1.136 8.906-3.335-.074 8.882.295 17.634 1.359 20.3.87 2.183 2.999 7.519 9.72 7.518.986 0 2.072-.115 3.266-.372 7.015-1.508 10.061-4.617 11.24-11.47.63-3.664 1.712-12.411 2.221-17.103 1.074.336 2.457.49 3.952.49 3.118 0 6.715-.665 8.972-1.715 2.534-1.18 7.108-4.077 6.279-6.593M79.038 28.933c-.024 1.385-.214 2.643-.415 3.956-.217 1.411-.442 2.87-.498 4.642-.056 1.725.16 3.517.367 5.251.42 3.502.85 7.107-.817 10.664q-.415-.739-.738-1.522c-.208-.504-.658-1.313-1.28-2.433-2.424-4.358-8.1-14.565-5.194-18.73.865-1.24 3.061-2.514 8.575-1.828M72.355 5.467c8.08.179 14.472 3.21 18.997 9.009 3.471 4.447-.35 24.686-11.415 42.145l-.336-.424-.14-.175c2.86-4.735 2.3-9.42 1.802-13.574-.204-1.704-.397-3.314-.348-4.827.05-1.602.262-2.977.467-4.306.25-1.638.506-3.333.436-5.332.053-.21.074-.457.046-.75-.18-1.917-2.361-7.652-6.808-12.842-2.432-2.839-5.98-6.016-10.822-8.159 2.083-.433 4.931-.836 8.12-.765M27.14 66.622c-2.234 2.694-3.777 2.177-4.285 2.008-3.306-1.106-7.143-8.114-10.526-19.227-2.927-9.615-4.637-19.285-4.773-21.996-.427-8.575 1.646-14.551 6.162-17.763 7.35-5.226 19.432-2.098 24.287-.511-.07.069-.142.133-.211.203-7.967 8.069-7.778 21.854-7.759 22.697 0 .325.027.785.064 1.418.137 2.319.392 6.634-.29 11.521-.633 4.541.763 8.986 3.83 12.195q.472.494.991.937a205 205 0 0 0-7.49 8.518m8.514-11.391c-2.471-2.587-3.594-6.184-3.08-9.872.72-5.162.454-9.658.311-12.073-.02-.338-.038-.635-.048-.868 1.164-1.035 6.558-3.933 10.404-3.05 1.755.404 2.825 1.603 3.27 3.664 2.301 10.674.304 15.122-1.3 18.697-.33.737-.643 1.433-.91 2.153l-.207.557c-.523 1.407-1.01 2.716-1.312 3.959-2.628-.008-5.184-1.134-7.128-3.168m.404 14.394c-.768-.192-1.458-.526-1.863-.803.339-.16.94-.377 1.984-.593 5.052-1.042 5.832-1.778 7.535-3.947.391-.498.834-1.061 1.447-1.748.914-1.026 1.332-.852 2.09-.537.613.254 1.211 1.026 1.454 1.875.114.401.243 1.163-.178 1.755-3.56 4.997-8.745 4.933-12.47 3.998m26.436 24.668c-6.18 1.328-8.368-1.834-9.81-5.448-.93-2.334-1.388-12.856-1.063-24.477a1.4 1.4 0 0 0-.06-.444 6 6 0 0 0-.173-.821c-.483-1.691-1.659-3.106-3.07-3.692-.56-.233-1.589-.66-2.825-.343.264-1.09.72-2.32 1.217-3.651l.208-.56c.234-.632.528-1.287.838-1.98 1.68-3.74 3.978-8.863 1.483-20.436-.935-4.335-4.056-6.452-8.789-5.96-2.836.294-5.432 1.442-6.727 2.1-.278.141-.532.278-.77.41.361-4.367 1.726-12.53 6.832-17.694C43 8.045 47.281 6.439 52.498 6.526c10.28.168 16.871 5.458 20.591 9.866 3.206 3.799 4.942 7.625 5.635 9.69-5.21-.532-8.753.499-10.55 3.074-3.907 5.601 2.138 16.473 5.044 21.698.533.957.993 1.785 1.137 2.136.946 2.3 2.171 3.835 3.065 4.955.275.343.54.677.743.967-1.578.457-4.412 1.51-4.154 6.779-.208 2.643-1.69 15.02-2.442 19.392-.994 5.776-3.114 7.928-9.074 9.21m25.795-29.6c-1.614.751-4.314 1.315-6.879 1.436-2.833.133-4.275-.319-4.615-.596-.159-3.283 1.06-3.626 2.35-3.99.202-.056.4-.112.59-.179q.179.146.391.287c2.277 1.507 6.339 1.67 12.073.483l.063-.013c-.774.726-2.097 1.699-3.974 2.572\"/></svg>"
    },
    {
      "id": "sql-id",
      "name": "SQL",
      "icon": "Database",
      "category": "dbms",
      "description": "Database query design, CTEs, window functions, query plan optimization, schema creation, PostgreSQL, and Snowflake setups.",
      "showOnWeb": true,
      "showOnCV": true,
      "customSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 100 100\"><path fill=\"#000\" d=\"M98.472 59.902c-.582-1.766-2.105-2.995-4.074-3.29-.929-.14-1.992-.08-3.251.18-2.194.454-3.821.627-5.009.66 4.483-7.59 8.129-16.246 10.227-24.393 3.394-13.175 1.58-19.177-.539-21.892C90.218 3.981 82.036.121 72.166.003c-5.267-.065-9.89.978-12.3 1.728-2.246-.398-4.66-.62-7.193-.66-4.749-.076-8.944.962-12.529 3.095a57 57 0 0 0-8.848-2.227C22.644.514 15.672 1.624 10.57 5.237c-6.175 4.375-9.038 11.975-8.509 22.59.168 3.37 2.048 13.625 5.009 23.35 1.701 5.59 3.515 10.232 5.392 13.798 2.661 5.058 5.51 8.035 8.706 9.105 1.792.599 5.048 1.018 8.472-1.842.434.527 1.013 1.05 1.782 1.537.976.618 2.17 1.122 3.361 1.42 4.296 1.078 8.319.808 11.752-.701.02.612.037 1.197.05 1.702.023.82.046 1.623.076 2.374.203 5.08.548 9.029 1.57 11.792.055.152.13.384.21.63.51 1.564 1.361 4.182 3.529 6.232C54.215 99.35 56.929 100 59.415 100c1.247 0 2.437-.164 3.48-.388 3.72-.8 7.944-2.017 11-6.38 2.889-4.125 4.293-10.337 4.547-20.126l.093-.793.06-.517.68.06.176.012c3.788.173 8.42-.633 11.265-1.958 2.248-1.046 9.452-4.86 7.756-10.008\"/><path fill=\"#336791\" d=\"M91.994 60.903c-11.264 2.33-12.038-1.494-12.038-1.494C91.848 41.713 96.82 19.251 92.53 13.753 80.825-1.243 60.564 5.85 60.226 6.033l-.109.02c-2.225-.463-4.716-.74-7.515-.785-5.096-.084-8.963 1.34-11.896 3.57 0 0-36.145-14.93-34.463 18.78.357 7.17 10.25 54.262 22.05 40.039 4.313-5.202 8.48-9.6 8.48-9.6 2.07 1.38 4.547 2.082 7.145 1.83l.202-.172c-.063.646-.034 1.277.08 2.025-3.04 3.406-2.146 4.004-8.223 5.258-6.149 1.271-2.537 3.533-.178 4.125 2.859.717 9.474 1.732 13.943-4.542l-.178.716c1.19.957 2.027 6.222 1.887 10.996-.14 4.773-.234 8.05.704 10.61.94 2.56 1.874 8.32 9.863 6.604 6.674-1.435 10.134-5.152 10.615-11.353.341-4.407 1.114-3.756 1.163-7.697l.62-1.865c.715-5.976.113-7.904 4.225-7.007l1 .088c3.027.138 6.988-.488 9.313-1.572 5.007-2.33 7.976-6.22 3.04-5.198\"/><path fill=\"#fff\" d=\"M42.821 30.825c-1.015-.142-1.934-.011-2.4.342a.88.88 0 0 0-.364.587c-.058.42.235.884.415 1.123.51.678 1.255 1.143 1.992 1.246q.16.022.319.022c1.229 0 2.347-.96 2.445-1.668.123-.887-1.161-1.479-2.407-1.652m33.627.028c-.097-.696-1.33-.894-2.502-.73-1.17.162-2.303.692-2.209 1.389.076.542 1.052 1.467 2.207 1.467q.146 0 .296-.02c.77-.108 1.337-.599 1.605-.882.41-.431.647-.912.603-1.224\"/><path fill=\"#fff\" d=\"M95.743 60.639c-.43-1.303-1.812-1.721-4.109-1.246-6.82 1.411-9.262.434-10.063-.158 5.3-8.098 9.66-17.886 12.013-27.018 1.114-4.326 1.73-8.343 1.78-11.618.056-3.594-.555-6.235-1.814-7.848-5.076-6.505-12.526-9.993-21.544-10.09-6.2-.069-11.437 1.522-12.453 1.97a31 31 0 0 0-7.008-.903c-4.654-.076-8.677 1.042-12.007 3.32a53.5 53.5 0 0 0-9.759-2.566c-7.905-1.277-14.187-.31-18.67 2.875-5.35 3.8-7.819 10.593-7.34 20.19.16 3.229 1.995 13.161 4.89 22.673 3.811 12.52 7.954 19.607 12.313 21.065.51.17 1.098.29 1.747.29 1.59 0 3.54-.719 5.568-3.164a201 201 0 0 1 7.674-8.707 12.34 12.34 0 0 0 5.52 1.489l.014.151q-.497.594-.973 1.206c-1.334 1.698-1.612 2.052-5.906 2.938-1.221.253-4.465.923-4.513 3.204-.052 2.491 3.835 3.538 4.277 3.648 1.543.388 3.03.579 4.448.579 3.447 0 6.482-1.136 8.906-3.335-.074 8.882.295 17.634 1.359 20.3.87 2.183 2.999 7.519 9.72 7.518.986 0 2.072-.115 3.266-.372 7.015-1.508 10.061-4.617 11.24-11.47.63-3.664 1.712-12.411 2.221-17.103 1.074.336 2.457.49 3.952.49 3.118 0 6.715-.665 8.972-1.715 2.534-1.18 7.108-4.077 6.279-6.593M79.038 28.933c-.024 1.385-.214 2.643-.415 3.956-.217 1.411-.442 2.87-.498 4.642-.056 1.725.16 3.517.367 5.251.42 3.502.85 7.107-.817 10.664q-.415-.739-.738-1.522c-.208-.504-.658-1.313-1.28-2.433-2.424-4.358-8.1-14.565-5.194-18.73.865-1.24 3.061-2.514 8.575-1.828M72.355 5.467c8.08.179 14.472 3.21 18.997 9.009 3.471 4.447-.35 24.686-11.415 42.145l-.336-.424-.14-.175c2.86-4.735 2.3-9.42 1.802-13.574-.204-1.704-.397-3.314-.348-4.827.05-1.602.262-2.977.467-4.306.25-1.638.506-3.333.436-5.332.053-.21.074-.457.046-.75-.18-1.917-2.361-7.652-6.808-12.842-2.432-2.839-5.98-6.016-10.822-8.159 2.083-.433 4.931-.836 8.12-.765M27.14 66.622c-2.234 2.694-3.777 2.177-4.285 2.008-3.306-1.106-7.143-8.114-10.526-19.227-2.927-9.615-4.637-19.285-4.773-21.996-.427-8.575 1.646-14.551 6.162-17.763 7.35-5.226 19.432-2.098 24.287-.511-.07.069-.142.133-.211.203-7.967 8.069-7.778 21.854-7.759 22.697 0 .325.027.785.064 1.418.137 2.319.392 6.634-.29 11.521-.633 4.541.763 8.986 3.83 12.195q.472.494.991.937a205 205 0 0 0-7.49 8.518m8.514-11.391c-2.471-2.587-3.594-6.184-3.08-9.872.72-5.162.454-9.658.311-12.073-.02-.338-.038-.635-.048-.868 1.164-1.035 6.558-3.933 10.404-3.05 1.755.404 2.825 1.603 3.27 3.664 2.301 10.674.304 15.122-1.3 18.697-.33.737-.643 1.433-.91 2.153l-.207.557c-.523 1.407-1.01 2.716-1.312 3.959-2.628-.008-5.184-1.134-7.128-3.168m.404 14.394c-.768-.192-1.458-.526-1.863-.803.339-.16.94-.377 1.984-.593 5.052-1.042 5.832-1.778 7.535-3.947.391-.498.834-1.061 1.447-1.748.914-1.026 1.332-.852 2.09-.537.613.254 1.211 1.026 1.454 1.875.114.401.243 1.163-.178 1.755-3.56 4.997-8.745 4.933-12.47 3.998m26.436 24.668c-6.18 1.328-8.368-1.834-9.81-5.448-.93-2.334-1.388-12.856-1.063-24.477a1.4 1.4 0 0 0-.06-.444 6 6 0 0 0-.173-.821c-.483-1.691-1.659-3.106-3.07-3.692-.56-.233-1.589-.66-2.825-.343.264-1.09.72-2.32 1.217-3.651l.208-.56c.234-.632.528-1.287.838-1.98 1.68-3.74 3.978-8.863 1.483-20.436-.935-4.335-4.056-6.452-8.789-5.96-2.836.294-5.432 1.442-6.727 2.1-.278.141-.532.278-.77.41.361-4.367 1.726-12.53 6.832-17.694C43 8.045 47.281 6.439 52.498 6.526c10.28.168 16.871 5.458 20.591 9.866 3.206 3.799 4.942 7.625 5.635 9.69-5.21-.532-8.753.499-10.55 3.074-3.907 5.601 2.138 16.473 5.044 21.698.533.957.993 1.785 1.137 2.136.946 2.3 2.171 3.835 3.065 4.955.275.343.54.677.743.967-1.578.457-4.412 1.51-4.154 6.779-.208 2.643-1.69 15.02-2.442 19.392-.994 5.776-3.114 7.928-9.074 9.21m25.795-29.6c-1.614.751-4.314 1.315-6.879 1.436-2.833.133-4.275-.319-4.615-.596-.159-3.283 1.06-3.626 2.35-3.99.202-.056.4-.112.59-.179q.179.146.391.287c2.277 1.507 6.339 1.67 12.073.483l.063-.013c-.774.726-2.097 1.699-3.974 2.572\"/></svg>"
    },
    {
      "id": "python-en",
      "name": "Python",
      "icon": "Terminal",
      "category": "scientific",
      "description": "Pandas, NumPy, data cleaning workflows, automated analytics scripts, statistical aggregations, and custom API proxies.",
      "showOnWeb": true,
      "showOnCV": true,
      "customSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 100 100\"><g clip-path=\"url(#a)\"><path fill=\"url(#b)\" d=\"M49.866 0c-4.08.02-7.973.367-11.4.974C28.368 2.757 26.537 6.49 26.537 13.376v9.092h23.856v3.03h-32.81c-6.934 0-13.005 4.168-14.904 12.098-2.191 9.086-2.288 14.758 0 24.246 1.695 7.063 5.745 12.095 12.68 12.095h8.203v-10.9c0-7.875 6.812-14.82 14.903-14.82h23.83c6.633 0 11.928-5.463 11.928-12.123V13.377c0-6.466-5.455-11.323-11.928-12.402-4.1-.682-8.352-.993-12.43-.974M36.964 7.314c2.464 0 4.477 2.046 4.477 4.562 0 2.505-2.013 4.53-4.477 4.53-2.473 0-4.476-2.025-4.476-4.53-.001-2.516 2.003-4.562 4.476-4.562\"/><path fill=\"url(#c)\" d=\"M77.198 25.498v10.594c0 8.212-6.964 15.125-14.903 15.125h-23.83c-6.527 0-11.928 5.587-11.928 12.124V86.06c0 6.464 5.621 10.268 11.928 12.122 7.551 2.219 14.793 2.621 23.83 0 6.005-1.74 11.927-5.24 11.927-12.122v-9.094H50.394v-3.031h35.758c6.933 0 9.519-4.836 11.93-12.095 2.491-7.473 2.383-14.66 0-24.246-1.714-6.903-4.986-12.097-11.93-12.097zm-13.403 57.53c2.474 0 4.477 2.026 4.477 4.533 0 2.514-2.004 4.56-4.477 4.56-2.464 0-4.476-2.046-4.476-4.56 0-2.507 2.012-4.533 4.476-4.533\"/></g><defs><linearGradient id=\"b\" x1=\"-1.392\" x2=\"53.633\" y1=\"2.844\" y2=\"49.769\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#5a9fd4\"/><stop offset=\"1\" stop-color=\"#306998\"/></linearGradient><linearGradient id=\"c\" x1=\"74.335\" x2=\"54.603\" y1=\"78.937\" y2=\"51.265\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#ffd43b\"/><stop offset=\"1\" stop-color=\"#ffe873\"/></linearGradient><clipPath id=\"a\"><path fill=\"#fff\" d=\"M0 0h100v100H0z\"/></clipPath></defs></svg>"
    },
    {
      "id": "python-id",
      "name": "Python",
      "icon": "Terminal",
      "category": "scientific",
      "description": "Pandas, NumPy, data cleaning workflows, automated analytics scripts, statistical aggregations, and custom API proxies.",
      "showOnWeb": true,
      "showOnCV": true,
      "customSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 100 100\"><g clip-path=\"url(#a)\"><path fill=\"url(#b)\" d=\"M49.866 0c-4.08.02-7.973.367-11.4.974C28.368 2.757 26.537 6.49 26.537 13.376v9.092h23.856v3.03h-32.81c-6.934 0-13.005 4.168-14.904 12.098-2.191 9.086-2.288 14.758 0 24.246 1.695 7.063 5.745 12.095 12.68 12.095h8.203v-10.9c0-7.875 6.812-14.82 14.903-14.82h23.83c6.633 0 11.928-5.463 11.928-12.123V13.377c0-6.466-5.455-11.323-11.928-12.402-4.1-.682-8.352-.993-12.43-.974M36.964 7.314c2.464 0 4.477 2.046 4.477 4.562 0 2.505-2.013 4.53-4.477 4.53-2.473 0-4.476-2.025-4.476-4.53-.001-2.516 2.003-4.562 4.476-4.562\"/><path fill=\"url(#c)\" d=\"M77.198 25.498v10.594c0 8.212-6.964 15.125-14.903 15.125h-23.83c-6.527 0-11.928 5.587-11.928 12.124V86.06c0 6.464 5.621 10.268 11.928 12.122 7.551 2.219 14.793 2.621 23.83 0 6.005-1.74 11.927-5.24 11.927-12.122v-9.094H50.394v-3.031h35.758c6.933 0 9.519-4.836 11.93-12.095 2.491-7.473 2.383-14.66 0-24.246-1.714-6.903-4.986-12.097-11.93-12.097zm-13.403 57.53c2.474 0 4.477 2.026 4.477 4.533 0 2.514-2.004 4.56-4.477 4.56-2.464 0-4.476-2.046-4.476-4.56 0-2.507 2.012-4.533 4.476-4.533\"/></g><defs><linearGradient id=\"b\" x1=\"-1.392\" x2=\"53.633\" y1=\"2.844\" y2=\"49.769\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#5a9fd4\"/><stop offset=\"1\" stop-color=\"#306998\"/></linearGradient><linearGradient id=\"c\" x1=\"74.335\" x2=\"54.603\" y1=\"78.937\" y2=\"51.265\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#ffd43b\"/><stop offset=\"1\" stop-color=\"#ffe873\"/></linearGradient><clipPath id=\"a\"><path fill=\"#fff\" d=\"M0 0h100v100H0z\"/></clipPath></defs></svg>"
    },
    {
      "id": "power-query-en",
      "name": "Power Query",
      "icon": "Layers",
      "category": "visualization",
      "description": "Advanced M-code operations, ETL data connections, enterprise-level data mashups, parameterization, and schema merges.",
      "showOnWeb": true,
      "showOnCV": true
    },
    {
      "id": "power-query-id",
      "name": "Power Query",
      "icon": "Layers",
      "category": "visualization",
      "description": "Advanced M-code operations, ETL data connections, enterprise-level data mashups, parameterization, and schema merges.",
      "showOnWeb": true,
      "showOnCV": true
    },
    {
      "id": "powerbi-en",
      "name": "PowerBI",
      "icon": "TrendingUp",
      "category": "visualization",
      "description": "DAX modeling, power query ETL setups, enterprise level tabular reporting layouts, and automated emails notifications.",
      "showOnWeb": true,
      "showOnCV": true,
      "svgUrl": "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"630px\" height=\"630px\" viewBox=\"0 0 630 630\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">     <!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com -->     <title>PBI Logo</title>     <desc>Created with Sketch.</desc>     <defs>         <linearGradient x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\" id=\"linearGradient-1\">             <stop stop-color=\"#EBBB14\" offset=\"0%\"></stop>             <stop stop-color=\"#B25400\" offset=\"100%\"></stop>         </linearGradient>         <linearGradient x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\" id=\"linearGradient-2\">             <stop stop-color=\"#F9E583\" offset=\"0%\"></stop>             <stop stop-color=\"#DE9800\" offset=\"100%\"></stop>         </linearGradient>         <path d=\"M346,604 L346,630 L320,630 L153,630 C138.640597,630 127,618.359403 127,604 L127,183 C127,168.640597 138.640597,157 153,157 L320,157 C334.359403,157 346,168.640597 346,183 L346,604 Z\" id=\"path-3\"></path>         <filter x=\"-9.1%\" y=\"-6.3%\" width=\"136.5%\" height=\"116.9%\" filterUnits=\"objectBoundingBox\" id=\"filter-4\">             <feOffset dx=\"20\" dy=\"10\" in=\"SourceAlpha\" result=\"shadowOffsetOuter1\"></feOffset>             <feGaussianBlur stdDeviation=\"10\" in=\"shadowOffsetOuter1\" result=\"shadowBlurOuter1\"></feGaussianBlur>             <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.0530211976 0\" type=\"matrix\" in=\"shadowBlurOuter1\"></feColorMatrix>         </filter>         <linearGradient x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\" id=\"linearGradient-5\">             <stop stop-color=\"#F9E68B\" offset=\"0%\"></stop>             <stop stop-color=\"#F3CD32\" offset=\"100%\"></stop>         </linearGradient>     </defs>     <g id=\"PBI-Logo\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">         <g id=\"Group\" transform=\"translate(77.500000, 0.000000)\">             <rect id=\"Rectangle\" fill=\"url(#linearGradient-1)\" x=\"256\" y=\"0\" width=\"219\" height=\"630\" rx=\"26\"></rect>             <g id=\"Combined-Shape\">                 <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-4)\" xlink:href=\"#path-3\"></use>                 <use fill=\"url(#linearGradient-2)\" fill-rule=\"evenodd\" xlink:href=\"#path-3\"></use>             </g>             <path d=\"M219,604 L219,630 L193,630 L26,630 C11.6405965,630 1.75851975e-15,618.359403 0,604 L0,341 C-1.75851975e-15,326.640597 11.6405965,315 26,315 L193,315 C207.359403,315 219,326.640597 219,341 L219,604 Z\" id=\"Combined-Shape\" fill=\"url(#linearGradient-5)\"></path>         </g>     </g> </svg>"
    },
    {
      "id": "powerbi-id",
      "name": "PowerBI",
      "icon": "TrendingUp",
      "category": "visualization",
      "description": "DAX modeling, power query ETL setups, enterprise level tabular reporting layouts, and automated emails notifications.",
      "showOnWeb": true,
      "showOnCV": true,
      "svgUrl": "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"630px\" height=\"630px\" viewBox=\"0 0 630 630\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">     <!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com -->     <title>PBI Logo</title>     <desc>Created with Sketch.</desc>     <defs>         <linearGradient x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\" id=\"linearGradient-1\">             <stop stop-color=\"#EBBB14\" offset=\"0%\"></stop>             <stop stop-color=\"#B25400\" offset=\"100%\"></stop>         </linearGradient>         <linearGradient x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\" id=\"linearGradient-2\">             <stop stop-color=\"#F9E583\" offset=\"0%\"></stop>             <stop stop-color=\"#DE9800\" offset=\"100%\"></stop>         </linearGradient>         <path d=\"M346,604 L346,630 L320,630 L153,630 C138.640597,630 127,618.359403 127,604 L127,183 C127,168.640597 138.640597,157 153,157 L320,157 C334.359403,157 346,168.640597 346,183 L346,604 Z\" id=\"path-3\"></path>         <filter x=\"-9.1%\" y=\"-6.3%\" width=\"136.5%\" height=\"116.9%\" filterUnits=\"objectBoundingBox\" id=\"filter-4\">             <feOffset dx=\"20\" dy=\"10\" in=\"SourceAlpha\" result=\"shadowOffsetOuter1\"></feOffset>             <feGaussianBlur stdDeviation=\"10\" in=\"shadowOffsetOuter1\" result=\"shadowBlurOuter1\"></feGaussianBlur>             <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.0530211976 0\" type=\"matrix\" in=\"shadowBlurOuter1\"></feColorMatrix>         </filter>         <linearGradient x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\" id=\"linearGradient-5\">             <stop stop-color=\"#F9E68B\" offset=\"0%\"></stop>             <stop stop-color=\"#F3CD32\" offset=\"100%\"></stop>         </linearGradient>     </defs>     <g id=\"PBI-Logo\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">         <g id=\"Group\" transform=\"translate(77.500000, 0.000000)\">             <rect id=\"Rectangle\" fill=\"url(#linearGradient-1)\" x=\"256\" y=\"0\" width=\"219\" height=\"630\" rx=\"26\"></rect>             <g id=\"Combined-Shape\">                 <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-4)\" xlink:href=\"#path-3\"></use>                 <use fill=\"url(#linearGradient-2)\" fill-rule=\"evenodd\" xlink:href=\"#path-3\"></use>             </g>             <path d=\"M219,604 L219,630 L193,630 L26,630 C11.6405965,630 1.75851975e-15,618.359403 0,604 L0,341 C-1.75851975e-15,326.640597 11.6405965,315 26,315 L193,315 C207.359403,315 219,326.640597 219,341 L219,604 Z\" id=\"Combined-Shape\" fill=\"url(#linearGradient-5)\"></path>         </g>     </g> </svg>"
    },
    {
      "id": "excel-en",
      "name": "Excel",
      "icon": "Grid",
      "category": "analytical",
      "description": "PowerPivot datasets, nested lookup formulas, financial sensitivity scenarios, and rapid ad-hoc analytical checks.",
      "showOnWeb": true,
      "showOnCV": true,
      "svgUrl": "<sv",
      "customSvg": "<svg width=\"800px\" height=\"800px\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"><title>file_type_excel2</title><path d=\"M28.781,4.405H18.651V2.018L2,4.588V27.115l16.651,2.868V26.445H28.781A1.162,1.162,0,0,0,30,25.349V5.5A1.162,1.162,0,0,0,28.781,4.405Zm.16,21.126H18.617L18.6,23.642h2.487v-2.2H18.581l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2H28.941Z\" style=\"fill:#20744a;fill-rule:evenodd\"/><rect x=\"22.487\" y=\"7.439\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><rect x=\"22.487\" y=\"10.94\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><rect x=\"22.487\" y=\"14.441\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><rect x=\"22.487\" y=\"17.942\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><rect x=\"22.487\" y=\"21.443\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><polygon points=\"6.347 10.673 8.493 10.55 9.842 14.259 11.436 10.397 13.582 10.274 10.976 15.54 13.582 20.819 11.313 20.666 9.781 16.642 8.248 20.513 6.163 20.329 8.585 15.666 6.347 10.673\" style=\"fill:#ffffff;fill-rule:evenodd\"/></svg>"
    },
    {
      "id": "excel-id",
      "name": "Excel",
      "icon": "Grid",
      "category": "analytical",
      "description": "PowerPivot datasets, nested lookup formulas, financial sensitivity scenarios, and rapid ad-hoc analytical checks.",
      "showOnWeb": true,
      "showOnCV": true,
      "customSvg": "<svg width=\"800px\" height=\"800px\" viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"><title>file_type_excel2</title><path d=\"M28.781,4.405H18.651V2.018L2,4.588V27.115l16.651,2.868V26.445H28.781A1.162,1.162,0,0,0,30,25.349V5.5A1.162,1.162,0,0,0,28.781,4.405Zm.16,21.126H18.617L18.6,23.642h2.487v-2.2H18.581l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2H28.941Z\" style=\"fill:#20744a;fill-rule:evenodd\"/><rect x=\"22.487\" y=\"7.439\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><rect x=\"22.487\" y=\"10.94\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><rect x=\"22.487\" y=\"14.441\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><rect x=\"22.487\" y=\"17.942\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><rect x=\"22.487\" y=\"21.443\" width=\"4.323\" height=\"2.2\" style=\"fill:#20744a\"/><polygon points=\"6.347 10.673 8.493 10.55 9.842 14.259 11.436 10.397 13.582 10.274 10.976 15.54 13.582 20.819 11.313 20.666 9.781 16.642 8.248 20.513 6.163 20.329 8.585 15.666 6.347 10.673\" style=\"fill:#ffffff;fill-rule:evenodd\"/></svg>",
      "svgUrl": "<sv"
    }
  ],
  "skillCategories": [],
  "experiences": [
    {
      "id": "exp-1-en",
      "period": "2025 — PRESENT",
      "role": "Junior Data Analyst",
      "company": "Semar Nusantara",
      "bulletPoints": [
        "Successfully modernized the data processing workflow from a manual to an automated system using Power Query, accelerating daily report delivery by 50%.",
        "Significantly improved the team's operational efficiency, enabling a restructuring of the team size from four members to two without compromising output quality.",
        "Developed and managed automated report templates integrated with data exports from the ERP system, drastically reducing the team's daily workload (refresh-and-go).",
        "Optimizing Excel formula structures during the initial transition phase by implementing nested IF logic to simplify the creation of intermediate reports.",
        "Perform data cleansing, transformation, and merging of data from various sources into a format ready for consistent analysis.",
        "Leveraged Python programming and AI prompt engineering skills to accelerate simple data processing tasks, demonstrating rapid adaptability to new technologies."
      ],
      "tools": [
        "SQL",
        "Python",
        "PowerBI",
        "Power Query"
      ]
    },
    {
      "id": "exp-1-id",
      "period": "2025 — SEKARANG",
      "role": "Analis Data Junior",
      "company": "Semar Nusantara",
      "bulletPoints": [
        "Berhasil memodernisasi alur kerja pengolahan data dari sistem manual menjadi otomatis menggunakan Power Query, mempercepat waktu penyajian laporan harian sebesar 50%.",
        "Meningkatkan efisiensi operasional tim secara signifikan, sehingga mampu merestrukturisasi jumlah anggota tim dari 4 orang menjadi 2 orang tanpa menurunkan kualitas output.",
        "Membangun dan mengelola template laporan otomatis yang terintegrasi dengan ekspor data dari sistem ERP, memangkas waktu kerja harian tim secara drastis (refresh-and-go).",
        "Mengoptimalkan struktur formula Excel pada masa awal transisi dengan mengimplementasikan logika nested IF (IF bertingkat) untuk menyederhanakan pembuatan laporan setengah jadi.",
        "Melakukan data cleansing, transformasi, dan penggabungan data dari berbagai sumber ke dalam format yang siap dianalisis secara konsisten.",
        "Memanfaatkan pemrograman Python dan keahlian AI prompt engineering untuk mempercepat proses pengolahan data sederhana, membuktikan kemampuan adaptasi yang cepat terhadap teknologi baru."
      ],
      "tools": [
        "SQL",
        "Python",
        "PowerBI",
        "Power Query"
      ]
    }
  ],
  "education": [
    {
      "period": "2020 — 2024",
      "degree": "Accounting",
      "institution": "Muhammadiyah University of Surakarta",
      "id": "edu-1-en"
    },
    {
      "id": "edu-1-id",
      "period": "2020 — 2024",
      "degree": "Akuntansi",
      "institution": "Universitas Muhammadiyah Surakarta",
      "description": ""
    },
    {
      "id": "edu-1787199186009-en",
      "period": "2017 — 2020",
      "degree": "Accounting",
      "institution": "State Vocational School 1 of Pedan",
      "description": ""
    },
    {
      "id": "edu-1787199186009-id",
      "period": "2017 — 2020",
      "degree": "Akuntansi",
      "institution": "SMK N 1 Pedan",
      "description": ""
    },
    {
      "id": "edu-1787199228850-en",
      "period": "2014 — 2017",
      "degree": "",
      "institution": "State Junior High School 1 of Ceper",
      "description": ""
    },
    {
      "id": "edu-1787199228850-id",
      "period": "2014 — 2017",
      "degree": "",
      "institution": "SMP N 1 Ceper",
      "description": ""
    },
    {
      "id": "edu-1787199259857-en",
      "period": "2008 — 2014",
      "degree": "",
      "institution": "State Elementary School 3 of Kujon",
      "description": ""
    },
    {
      "id": "edu-1787199259857-id",
      "period": "2008 — 2014",
      "degree": "",
      "institution": "SD N 3 Kujon",
      "description": ""
    }
  ],
  "educationSections": [
    {
      "id": "edu-sec-1-en",
      "title": "My Educational Foundations",
      "content": "During my higher education at Universitas Muhammadiyah Surakarta, I did not merely focus on classroom accounting theory but also actively pursued holistic personal development. Balancing a rigorous academic schedule with organizational commitments proved to be a challenge that effectively shaped my character, discipline, and time-management skills throughout my four years of study.\n\nA key platform for my personal growth was the Accounting Student Association (HIMATANSI). Within this organization, I played an active role in managing various programs, thereby honing my teamwork, communication, and real-world problem-solving abilities. This organizational experience provided me with a broad perspective on applying management and accounting principles at an interpersonal level.\n\nAs the culmination of my studies, I successfully completed a final project resulting in the publication of a Sinta 4-accredited journal article titled \"ANALYSIS OF STOCK PERFORMANCE IN TECHNOLOGY SECTOR COMPANIES LISTED ON IDX 2021-2022: INDONESIA POINT OF VIEW.\" This research stands as a testament to my dedication to capital market analysis, and I ultimately graduated with a GPA of 3.45.",
      "imageUrl": "https://storage.googleapis.com/web_ums_object_storage/uploads/AjMaZ2N7nzFYp5O7ADL1DEOcjgW8hnaUoZYITRhp.webp",
      "layoutType": "image_right",
      "bgColor": "emerald",
      "linkedEducationDegree": "edu-1",
      "sortOrder": 0,
      "textAlign": "justify"
    },
    {
      "id": "edu-sec-2-en",
      "title": "Theoretical & Applied Statistics",
      "content": "My time at vocational high school laid the initial foundation for me to delve specifically into the world of accounting. At SMK Negeri 1 Pedan, I acquired strong technical skills in bookkeeping and basic finance. However, for me, vocational school was not merely about chasing grades on paper; it was a crucial period for developing my leadership qualities.\n\nI chose to be active in several school organizations simultaneously: the Student Council (OSIS), the Scout Council (Dewan Ambalan), and the Flag-Raising Squad (Paskibra). Involvement in these three distinct organizations taught me about loyalty, hard work, and how to adapt to a wide range of personalities.\n\nThe highlight of my organizational experience was being entrusted with the role of Paskibra Chairperson. This leadership position honed my decision-making mindset, taught me to coordinate team members under pressure, and instilled in me a sense of full responsibility for the team's success in every activity.",
      "imageUrl": "/Paskib.webp",
      "layoutType": "image_right",
      "bgColor": "indigo",
      "linkedEducationDegree": "edu-1787199186009",
      "sortOrder": 1,
      "textAlign": "justify",
      "imageOrientation": "background_edge",
      "imageFadeDirection": "oval",
      "ovalHeight": 120,
      "ovalWidth": 115,
      "imageOpacity": 0.86,
      "maskWidth": 60,
      "imageScale": 1.06,
      "imageX": 598,
      "ovalPointiness": 45,
      "imageY": 0
    },
    {
      "id": "edu-sec-1-id",
      "title": "My Educational Foundations",
      "content": "Selama menempuh pendidikan tinggi di Universitas Muhammadiyah Surakarta, saya tidak hanya berfokus pada teori akuntansi di kelas, tetapi juga aktif mengembangkan diri secara holistik. Menyeimbangkan jadwal akademik yang padat dengan komitmen berorganisasi menjadi tantangan yang berhasil membentuk karakter, kedisiplinan, dan manajemen waktu saya dengan sangat baik selama empat tahun masa perkuliahan. \n\nSalah satu wadah utama pengembangan diri saya adalah Himpunan Mahasiswa Akuntansi (HIMATANSI). Di organisasi ini, saya terlibat aktif dalam mengelola berbagai program kerja, mengasah kemampuan kerja sama tim, komunikasi, serta pemecahan masalah secara nyata. Pengalaman berorganisasi ini memberikan saya perspektif luas tentang bagaimana menerapkan ilmu manajemen dan akuntansi dalam skala interpersonal. \n\nSebagai puncak studi, saya berhasil menyelesaikan tugas akhir berupa publikasi jurnal ilmiah terakreditasi Sinta 4 yang berjudul \"ANALYSIS OF STOCK PERFORMANCE IN TECHNOLOGY SECTOR COMPANIES LISTED ON IDX 2021-2022: INDONESIA POINT OF VIEW\". Riset ini menjadi bukti dedikasi saya di bidang analisis pasar modal, hingga akhirnya saya dinyatakan lulus dengan IPK 3,45.",
      "imageUrl": "https://storage.googleapis.com/web_ums_object_storage/uploads/AjMaZ2N7nzFYp5O7ADL1DEOcjgW8hnaUoZYITRhp.webp",
      "layoutType": "image_right",
      "bgColor": "emerald",
      "linkedEducationDegree": "edu-1",
      "sortOrder": 0,
      "textAlign": "justify"
    },
    {
      "id": "edu-sec-2-id",
      "title": "Theoretical & Applied Statistics",
      "content": "Masa sekolah menengah kejuruan menjadi pondasi awal bagi saya untuk mendalami dunia akuntansi secara spesifik. Di SMK Negeri 1 Pedan, saya dibekali dengan keterampilan teknis pembukuan dan keuangan dasar yang kuat. Namun, bagi saya, masa SMK bukan sekadar tentang mengejar nilai di atas kertas, melainkan momen penting untuk melatih jiwa kepemimpinan.\n\nSaya memilih untuk aktif di berbagai organisasi sekolah sekaligus, yaitu Organisasi Siswa Intra Sekolah (OSIS), Dewan Ambalan (Pramuka), dan Paskibra. Terlibat dalam tiga organisasi berbeda mengajarkan saya tentang loyalitas, kerja keras, dan bagaimana cara beradaptasi dengan berbagai karakter orang yang berbeda-beda.\n\nPuncak pengalaman organisasi saya di sekolah adalah ketika dipercaya untuk mengemban amanah sebagai Ketua Paskibra. Peran sebagai pemimpin ini menempa mentalitas saya dalam mengambil keputusan, mengkoordinasi anggota di bawah tekanan, serta bertanggung jawab penuh atas keberhasilan tim dalam setiap kegiatan.",
      "imageUrl": "/Paskib.webp",
      "layoutType": "image_right",
      "bgColor": "indigo",
      "linkedEducationDegree": "edu-1787199186009",
      "sortOrder": 1,
      "textAlign": "justify",
      "imageOrientation": "background_edge",
      "imageFadeDirection": "oval",
      "ovalHeight": 120,
      "ovalWidth": 115,
      "imageOpacity": 0.86,
      "maskWidth": 60,
      "imageScale": 1.06,
      "imageX": 598,
      "ovalPointiness": 45,
      "imageY": 0
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvF0DBOAZDg7q7VWO3RB70HIlRyHFrhDeCsBl0vMJQvIw5czavw024cqc&s=10",
      "layoutType": "image_left",
      "bgColor": "slate",
      "linkedEducationDegree": "edu-1787199228850",
      "sortOrder": 2,
      "textAlign": "justify",
      "id": "sec-education-1787199591233-en",
      "title": "New Story Slide",
      "content": "My time at SMP Negeri 1 Ceper served as a valuable transitional phase for my personal development. At this school, I began adapting to a more competitive academic environment and learned to expand my circle of friends. This period marked the beginning of my character formation as an adolescent before I entered the world of vocational education.\n\nAlthough my primary focus at the time was successfully fulfilling my academic obligations, I also used my spare time to explore various personal interests. I learned to build self-confidence through daily social interactions with teachers and my peers.\n\nOverall, my three years at SMP Negeri 1 Ceper provided me with a solid social and academic foundation. The simple yet memorable experiences I had there mentally prepared me to face the greater challenges awaiting me at the next level of education.",
      "paragraphLayout": "right"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvF0DBOAZDg7q7VWO3RB70HIlRyHFrhDeCsBl0vMJQvIw5czavw024cqc&s=10",
      "layoutType": "image_left",
      "bgColor": "slate",
      "linkedEducationDegree": "edu-1787199228850",
      "sortOrder": 2,
      "textAlign": "justify",
      "id": "sec-education-1787199591233-id",
      "title": "Lembar Cerita Baru",
      "content": "Pendidikan di SMP Negeri 1 Ceper merupakan fase transisi yang sangat berharga bagi perkembangan diri saya. Di sekolah ini, saya mulai beradaptasi dengan lingkungan akademik yang lebih kompetitif dan belajar memperluas jaringan pertemanan. Masa-masa ini menjadi awal pembentukan karakter remaja saya sebelum memasuki dunia kejuruan.\n\nMeskipun fokus utama saya pada saat itu adalah menyelesaikan kewajiban akademik dengan baik, saya memanfaatkan waktu luang untuk mengeksplorasi berbagai minat dasar. Saya belajar membangun rasa percaya diri melalui interaksi sosial sehari-hari dengan guru dan teman-teman seangkatan.\n\nSecara keseluruhan, tiga tahun di SMP Negeri 1 Ceper memberikan saya landasan sosial dan akademik yang cukup. Pengalaman sederhana namun berkesan di sekolah ini berhasil mempersiapkan mental saya untuk menjadi pribadi yang lebih siap menghadapi tantangan yang lebih besar di jenjang pendidikan berikutnya.",
      "paragraphLayout": "right"
    },
    {
      "imageUrl": "https://cdn-sekolah.annibuku.com/20309300/2.jpg",
      "layoutType": "image_right",
      "bgColor": "emerald",
      "linkedEducationDegree": "edu-1787199259857",
      "sortOrder": 3,
      "textAlign": "justify",
      "id": "sec-education-1787199641529-en",
      "title": "New Story Slide",
      "content": "My primary education began at SD Negeri 3 Kujon. It was here that I was first introduced to the world of formal education and where fundamental life values ​​were instilled in me. Over the course of six years, I was guided to understand the importance of honesty, hard work, and a strong sense of curiosity.\n\nMy time in elementary school was filled with enjoyable learning experiences and the cultivation of positive habits. I learned how to collaborate, respect differences, and maintain discipline in balancing study with play alongside my peers.\n\nAlthough the setting was modest, my experience at SD Negeri 3 Kujon laid the foundation for my long journey. All the achievements and character traits I possess today are rooted in the fundamental values ​​instilled in me during those elementary school years."
    },
    {
      "imageUrl": "https://cdn-sekolah.annibuku.com/20309300/2.jpg",
      "layoutType": "image_right",
      "bgColor": "emerald",
      "linkedEducationDegree": "edu-1787199259857",
      "sortOrder": 3,
      "textAlign": "justify",
      "id": "sec-education-1787199641529-id",
      "title": "Lembar Cerita Baru",
      "content": "Pendidikan dasar saya dimulai di SD Negeri 3 Kujon. Di sinilah tempat pertama kali saya mengenal dunia pendidikan formal dan menanamkan nilai-nilai dasar kehidupan. Selama enam tahun, saya dibimbing untuk memahami pentingnya kejujuran, kerja keras, dan rasa ingin tahu yang tinggi.\n\nMasa sekolah dasar ini penuh dengan proses belajar yang menyenangkan dan pembentukan kebiasaan positif. Saya belajar bagaimana caranya bekerja sama, menghargai perbedaan, dan disiplin dalam membagi waktu antara belajar dan bermain bersama teman-teman sebayanya.\n\nMeskipun masih dalam lingkup yang sederhana, pengalaman di SD Negeri 3 Kujon adalah akar dari perjalanan panjang saya. Semua pencapaian dan karakter yang saya miliki hari ini tidak lepas dari nilai-nilai dasar yang telah ditanamkan sejak saya duduk di bangku sekolah dasar ini."
    }
  ],
  "personality": [
    {
      "id": "pers-1",
      "title": "Analytical Thinker",
      "description": "Deep-dive approach into system details and transactional integrity to drive optimization.",
      "icon": "Cpu"
    },
    {
      "id": "pers-2",
      "title": "Continuous Learner",
      "description": "Constantly exploring modern architectures, new database technologies, and machine learning models.",
      "icon": "Flame"
    },
    {
      "id": "pers-3",
      "title": "User-Centric Developer",
      "description": "Designing visual dashboard interfaces that provide an immediate and satisfying user experience.",
      "icon": "Smile"
    }
  ],
  "hobbies": [
    {
      "id": "hobby-1",
      "title": "Data Visual Art",
      "description": "Creating interactive data visualizations, generative graphs, and canvas-based layout experiments.",
      "icon": "PenTool"
    },
    {
      "id": "hobby-2",
      "title": "Technical Writing",
      "description": "Publishing deep-dives on SQL indexing strategies, database optimizations, and pipeline patterns.",
      "icon": "Bookmark"
    },
    {
      "id": "hobby-3",
      "title": "Hiking & Exploration",
      "description": "Unplugging in national parks and trails to recharge creativity and find systemic inspirations.",
      "icon": "Compass"
    }
  ],
  "careerGoals": [
    {
      "id": "goal-1",
      "title": "Lead Data Architect",
      "description": "Steering high-volume real-time pipeline migrations and implementing enterprise analytics standards.",
      "target_year": "2027",
      "icon": "Award"
    },
    {
      "id": "goal-2",
      "title": "Open-Source Contributor",
      "description": "Contributing scalable DB drivers, custom visual components, and open analytical engines.",
      "target_year": "2028",
      "icon": "GitBranch"
    },
    {
      "id": "goal-3",
      "title": "Keynote Speaker",
      "description": "Sharing technical discoveries on global analytics conventions regarding data scalability and design.",
      "target_year": "2029",
      "icon": "Share2"
    }
  ],
  "layoutSettings": {
    "fontSize": "standard",
    "spacing": "standard",
    "layoutStyle": "left-sidebar",
    "fontFamily": "sans",
    "sectionOrder": ["arsenal", "education", "experience", "methodology"],
    "themeColor": "blue"
  },
  "homeImageFade": 0,
  "homeImageCircleX": -4,
  "homeImageCircleScale": 0.9,
  "homeImageCircleY": -48
};

// Backwards compatibility exports
export const CASE_STUDIES = DEFAULT_CV_DATA.caseStudies || [];
export const SKILLS = DEFAULT_CV_DATA.skills || [];
export const EXPERIENCES = DEFAULT_CV_DATA.experiences || [];
export const EMPTY_CV_DATA = DEFAULT_CV_DATA;
