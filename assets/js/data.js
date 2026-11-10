// Konten disarikan dari CV pemilik. Foto dan URL yang belum tersedia tetap placeholder.
// GANTI INI: perbarui fakta saat ada pengalaman baru; jangan menambahkan skor rekaan.
export const data = {
  // GANTI INI: [[NAMA_TEMA]], [[JUDUL_SEO]], [[DESKRIPSI_SEO]]
  themeName: 'DUSTY TRAIL PORTFOLIO',
  seo: {
    title: 'Alfonsus Ronaldy Hidayat | Dusty Trail Portfolio',
    description: 'Alfonsus Ronaldy Hidayat, mahasiswa Sistem Informasi UMN di Jakarta. Minat pada data, database, data engineering, dan self-hosting.',
    // [[URL_WEBSITE]] contoh: https://username.github.io/nama-repo/
    url: '',
    // [[GAMBAR_OG]] Gunakan JPG/PNG 1200x630 milik sendiri untuk pratinjau sosial.
    image: 'assets/img/project.svg'
  },
  // GANTI INI: [[NAMA_LENGKAP]], [[JULUKAN_ATAU_ROLE]], [[TAGLINE_SINGKAT]], [[LOKASI]]
  name: 'Alfonsus Ronaldy Hidayat',
  role: 'Mahasiswa Sistem Informasi | UMN',
  tagline: 'Menjelajahi data, database, dan layanan yang dikelola sendiri.',
  location: 'Jakarta, Indonesia',
  // GANTI INI: [[FOTO_PROFIL: assets/img/profile.jpg, 600x800]]
  profile: { image: 'assets/img/profile.svg', alt: 'Placeholder foto Alfonsus Ronaldy Hidayat; ganti dengan foto pribadi', caption: 'Alfonsus Ronaldy Hidayat' },
  // GANTI INI: [[TENTANG_SAYA_PARAGRAF_1]], [[TENTANG_SAYA_PARAGRAF_2]]
  about: [
    'Saya Alfonsus Ronaldy Hidayat, mahasiswa Sistem Informasi di Universitas Multimedia Nusantara sejak 2024. Minat saya mencakup database, analisis data, dan data engineering.',
    'Di ISFEST, saya menyusun studi kasus dan rubrik kompetisi data serta mengevaluasi peserta. Di luar kampus, saya mengembangkan home server dari perangkat bekas untuk layanan web, database, dan AI agent.'
  ],
  // GANTI INI: [[PENDIDIKAN]], [[SERTIFIKAT]]; tambah/hapus item bebas.
  education: ['Sistem Informasi, Universitas Multimedia Nusantara (UMN)', '2024–sekarang; target lulus 2028. IPK 3,68 sesuai CV.'],
  certificates: [], // CV tidak mencantumkan sertifikat.
  // GANTI INI: [[LINK_CV: assets/cv.pdf]]; kosong = tombol disembunyikan.
  cv: '', // Contoh setelah file tersedia: 'assets/cv.pdf'
  // GANTI INI: [[SKILL_1..N + persentase/level]]; teks level sesuai CV.
  // Angka 0–100 opsional, hanya jika Anda menetapkan penilaian sendiri.
  skills: [
    { name: 'Python & Java', level: 'Dasar', detail: 'Pemrograman sesuai keterampilan di CV' },
    { name: 'HTML & CSS', level: 'Dasar', detail: 'Fondasi pengembangan web' },
    { name: 'SQL & Excel', level: 'Dasar', detail: 'Database dan pengolahan data' },
    { name: 'Kolaborasi', level: 'Pengalaman organisasi', detail: 'Kerja tim, adaptasi, dan membangun hubungan kerja' },
    { name: 'Bahasa', level: 'Indonesia & Inggris', detail: 'Bahasa yang tercantum di CV; tingkat kefasihan tidak dinyatakan' }
  ],
  // GANTI INI: [[PROJECT_1..N: judul, deskripsi, tech stack, link demo, link GitHub, gambar]]
  // Proyek berdasarkan CV. Jangan tautkan dashboard/internal homelab ke situs publik.
  projects: [
    { title: 'Proxmox Home Server', category: 'Homelab & self-hosting', description: 'Home server dari perangkat bekas dengan Proxmox VE. Menjalankan container Linux untuk Tailscale, Docker, AI routing, media streaming, dan Pi-hole DNS. Dashboard Homepage menampilkan metrik serta status layanan; subnet routing dan DNS lokal mendukung akses jarak jauh.', tech: ['Proxmox VE', 'Linux Containers', 'Docker', 'Tailscale', 'Pi-hole', 'Homepage'], image: 'assets/img/project.svg', alt: 'Placeholder pratinjau proyek Proxmox Home Server', demo: '', github: '', completed: false }
  ],
  // GANTI INI: [[PENGALAMAN_1..N: perusahaan, posisi, periode, deskripsi]]
  experience: [
    { company: 'ISFEST', position: 'Academic Committee Member', period: '24 Maret – 2 November 2026', description: 'Menyusun studi kasus forecasting utilisasi stasiun pengisian kendaraan listrik dan rubrik kompetisi data. Kriteria mencakup persiapan data, EDA, pemodelan prediktif, serta interpretasi. Mendukung pemilihan juri, mengevaluasi semifinal, dan membantu final serta penentuan pemenang.' }
  ],
  // GANTI INI: [[EMAIL]], [[WHATSAPP]], [[LINKEDIN]], [[GITHUB]], [[INSTAGRAM]]
  contact: {
    intro: 'Ingin berdiskusi tentang data, database, atau self-hosting? Kirim telegram melalui email.',
    email: 'ronaldyhdy@gmail.com',
    whatsapp: '', // Contoh format internasional tanpa +: '6281234567890'
    linkedin: '', // Contoh: 'https://www.linkedin.com/in/username/'
    github: '', // Contoh: 'https://github.com/username'
    instagram: '', // Contoh: 'https://www.instagram.com/username/'
    formEndpoint: '[[FORM_ENDPOINT]]' // Contoh: 'https://formspree.io/f/abcdefgh'
  },
  // GANTI INI: [[AUDIO_AMBIENT]]; kosong = tombol suara disembunyikan.
  ambientAudio: '', // Contoh: 'assets/ambient.mp3', wajib milik sendiri/berlisensi.
  // GANTI INI: tempo animasi. Nilai lebih besar = lebih lambat.
  motion: { duration: 0.8, intro: 1.6, particles: 38 }
};
