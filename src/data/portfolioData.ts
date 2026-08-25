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
  "aboutMe": "Driven and detail-oriented Senior Data Analyst with over 6 years of experience engineering high-impact SQL pipelines, advanced predictive models, and intuitive executive-level BI dashboards. Adept at turning complex unstructured transactional records into optimized operational decisions and actionable revenue insights.\n\nPassionate about data transparency, pipeline performance alignment, and strategic growth. Committed to driving efficiency through statistical verification frameworks and transparent KPIs.",
  "avatarUrl": "/profile.png",
  "avatarScale": 1.24,
  "avatarX": -1,
  "avatarY": 4,
  "homeImageUrl": "/profile-black.png",
  "homeImageUrlDark": "/profile-white.png",
  "homeImageScale": 1.32,
  "homeImageX": -2,
  "homeImageY": 2,
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
      "showOnCvHeader": false,
      "showOnCvFooter": true
    },
    {
      "id": "social-github",
      "name": "WhatsApp",
      "value": "085123333230",
      "usernameOrUrl": "085123333230",
      "showOnWeb": true,
      "showOnCvHeader": true,
      "showOnCvFooter": true
    },
    {
      "id": "social-instagram",
      "name": "GitHub",
      "value": "ZufarFz",
      "usernameOrUrl": "ZufarFz",
      "showOnWeb": true,
      "showOnCvHeader": false,
      "showOnCvFooter": true
    },
    {
      "id": "social-whatsapp",
      "name": "Instagram",
      "value": "Zuf.Fz_",
      "usernameOrUrl": "Zuf.Fz_",
      "showOnWeb": true,
      "showOnCvHeader": false,
      "showOnCvFooter": true
    },
    {
      "id": "social-1787390774706",
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
    "social-github"
  ],
  "footerSocials": [
    "social-linkedin",
    "social-instagram",
    "social-whatsapp"
  ],
  "cardSocials": [
    "social-linkedin",
    "social-github"
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
    "home_image_fade_depth": "66",
    "home_image_fade_width": "84",
    "home_bg_style": "pattern_japanese_clouds",
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
    "home_bg_style_id": "pattern_japanese_clouds",
    "home_bg_style_en": "pattern_japanese_clouds",
    "skills_bg_style": "pattern_japanese_clouds",
    "skills_bg_style_id": "pattern_japanese_clouds",
    "skills_bg_style_en": "pattern_japanese_clouds",
    "contact_bg_style": "pattern_japanese_clouds",
    "contact_bg_style_id": "pattern_japanese_clouds",
    "contact_bg_style_en": "pattern_japanese_clouds",
    "about_story_bg_style": "none",
    "about_story_bg_style_id": "none",
    "about_story_bg_style_en": "none",
    "contact_bg_pattern_opacity": "0.13",
    "contact_bg_pattern_opacity_id": "0.13",
    "contact_bg_pattern_opacity_en": "0.13",
    "skills_bg_pattern_opacity": "0.17",
    "skills_bg_pattern_opacity_id": "0.17",
    "skills_bg_pattern_opacity_en": "0.17",
    "home_bg_pattern_opacity": "0.13",
    "home_bg_pattern_opacity_id": "0.13",
    "home_bg_pattern_opacity_en": "0.13",
    "about_story_bg_pattern_opacity": "0.13",
    "about_story_bg_pattern_opacity_id": "0.13",
    "about_story_bg_pattern_opacity_en": "0.13"
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
  ]
};

// Backwards compatibility exports
export const CASE_STUDIES = DEFAULT_CV_DATA.caseStudies || [];
export const SKILLS = DEFAULT_CV_DATA.skills || [];
export const EXPERIENCES = DEFAULT_CV_DATA.experiences || [];
export const EMPTY_CV_DATA = DEFAULT_CV_DATA;
