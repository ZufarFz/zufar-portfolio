import { BgPatternGroup } from './types';

export const BG_PATTERN_GROUPS: BgPatternGroup[] = [
  {
    name: '⛩️ Motif Tradisional Jepang (Japanese Wagara)',
    icon: '⛩️',
    badge: '13 Motif Jepang',
    options: [
      { id: 'pattern_japanese_clouds', label: 'Kumo to Nami ☁️🌊', desc: 'Awan swirl Ukiyo-e & ombak alir tradisional', badge: 'Pilihan Populer' },
      { id: 'pattern_seigaiha', label: 'Seigaiha Wave 🌊', desc: 'Gelombang ombak konsentris keberuntungan' },
      { id: 'pattern_asanoha', label: 'Asanoha Leaf 🍃', desc: 'Motif geometris bintang daun rami (Hemp leaf)' },
      { id: 'pattern_sakura', label: 'Sakura Blizzard 🌸', desc: 'Bunga sakura & kelopak berterbangan' },
      { id: 'pattern_yagasuri', label: 'Yagasuri Arrow 🏹', desc: 'Bulu anak panah melesat lurus (Keteguhan)' },
      { id: 'pattern_karakusa', label: 'Karakusa Vines 🌿', desc: 'Sulur tanaman abadi & pusaran daun' },
      { id: 'pattern_sayagata', label: 'Sayagata Key ⛩️', desc: 'Kunci kisi manji geometris bersambung' },
      { id: 'pattern_shippo', label: 'Shippou Jewels 🔮', desc: 'Tujuh permata lingkaran harmoni abadi' },
      { id: 'pattern_kikko', label: 'Kikko Tortoise 🐢', desc: 'Tempurung kura-kura heksagonal (Umur panjang)' },
      { id: 'pattern_uroko', label: 'Uroko Scales 🐉', desc: 'Sisik naga segitiga penangkal bala' },
      { id: 'pattern_kanoko', label: 'Kanoko Shibori 🦌', desc: 'Tutul bintik rusa celup ikat tradisional' },
      { id: 'pattern_igeta', label: 'Igeta Kasuri 🎋', desc: 'Kisi sumur tradisional kain indigo' },
      { id: 'pattern_bamboo_weave', label: 'Kagome Bamboo 🎍', desc: 'Anyaman bambu bintang heksagonal' }
    ]
  },
  {
    name: '✨ Pola Geometris Modern (SVG Geometric)',
    icon: '✨',
    badge: '10 Pola Geometris',
    options: [
      { id: 'pattern_honeycomb', label: 'Honeycomb Matrix ⬡', desc: 'Sarang lebah heksagonal ganda' },
      { id: 'pattern_topography', label: 'Topography Map 🗺️', desc: 'Garis kontur elevasi organik' },
      { id: 'pattern_circuit', label: 'PCB Cyber Circuit ⚡', desc: 'Jalur sirkuit digital & node data' },
      { id: 'pattern_moroccan', label: 'Moroccan Quatrefoil 🕌', desc: 'Arsitektur ubin arabesque' },
      { id: 'pattern_isometric_cubes', label: '3D Tumbling Cubes 🧊', desc: 'Kisi kubus 3D isometrik' },
      { id: 'pattern_chevron', label: 'Chevron Herringbone 🪚', desc: 'Anyaman zigzag geometris' },
      { id: 'pattern_constellation', label: 'Constellation Stars ✨', desc: 'Jaringan rasi bintang & neural node' },
      { id: 'pattern_diamonds', label: 'Diamond Rhombus 💎', desc: 'Kisi jaring berlian modern' },
      { id: 'pattern_crosshatch', label: 'Blueprint Crosshatch 📐', desc: 'Kisi drafting teknik arsitektural' },
      { id: 'pattern_waves_sinusoid', label: 'Sine Waveforms 〰️', desc: 'Gelombang sinus kontinu analitik' }
    ]
  },
  {
    name: '🎨 Tekstur Mewah & Watercolor',
    icon: '🎨',
    badge: '4 Tekstur',
    options: [
      { id: 'watercolor_blush', label: 'Watercolor Blush 🌸', desc: 'Soft pink & peach with gold accents' },
      { id: 'watercolor_gold', label: 'Earthy Gold Marble ✨', desc: 'Earthy beige with kintsugi gold veins' },
      { id: 'watercolor_pastel', label: 'Pastel Dream Glow 🎨', desc: 'Lavender, apricot & baby blue' },
      { id: 'watercolor_sunset', label: 'Sunset Crimson 🌅', desc: 'Coral gradient with gold rings' }
    ]
  },
  {
    name: '🔲 Minimalis & Pilihan Standar',
    icon: '🔲',
    badge: '6 Opsi',
    options: [
      { id: 'none', label: 'Polos / None (Default Solid)', desc: 'Tanpa pola overlay tambahan' },
      { id: 'dots', label: 'Pattern Titik (Radial Dots)', desc: 'Overlay titik-titik radial rapi' },
      { id: 'grid', label: 'Engine Grid Layout', desc: 'Kisi blueprint kotak-kotak presisi' },
      { id: 'ambient', label: 'Ambient Glow', desc: 'Pendaran orb warna lembut blurred' },
      { id: 'abstract', label: 'Diagonal Lines', desc: 'Garis silang diagonal berpotongan' },
      { id: 'custom_svg_pattern', label: 'Custom SVG Markup', desc: 'Gunakan kode SVG kustom langsung' },
      { id: 'custom_upload', label: 'Unggah Gambar (Watermark)', desc: 'Gambar watermark kustom' }
    ]
  }
];
