# ✈️ PENJAGA LANGIT — Air Combat Web Game

![Penjaga Langit Banner](./media/banner.png)

---

## 📌 Tentang Proyek

**Penjaga Langit** adalah game _arcade shoot 'em up_ 2D berbasis web yang dibangun menggunakan **Next.js**, **HTML5 Canvas**, dan **TypeScript**. Game ini menyajikan pertempuran udara seru dengan sistem stage tak terbatas (_endless stages_), pertarungan Boss di setiap kelipatan stage 10, efek suara (SFX) yang dinamis, serta papan peringkat global berbasis **Firebase Cloud Firestore**.

---

## ✨ Fitur Utama

- 🎮 **Endless Arcade Gameplay:** Pertempuran tanpa batas dengan variasi musuh (_Normal_, _Kamikaze_, dan _Boss Level_).
- 🏆 **Global Leaderboard:** Papan peringkat realtime yang terhubung ke Firebase Firestore.
- 🎬 **Cinematic Leaderboard Background:** Fitur _autopilot background_ interaktif saat melihat skor tertinggi.
- 💥 **Dynamic Explosion & Particles:** Efek animasi ledakan 9-frame untuk setiap hantaman dan kehanucran musuh.
- 🎵 **Adaptive BGM & SFX Engine:** Transisi musik (_smooth crossfade_) antara BGM Normal, Boss, dan Victory, serta pemutaran SFX tanpa delay (_audio cloning_).
- 📱 **Mobile Landscape Responsive:** Kontrol sentuh intuitif khusus perangkat seluler dengan penyesuaian otomatis orientation.

---

## 🛠️ Stack Teknologi

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Rendering Engine:** HTML5 Canvas API
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)

---

## 📁 Arsitektur Folder Proyek

```
penjaga-langit/
├── app/                  # Route handlers (App Router) & Next.js API Routes
├── components/           # Komponen UI React (HUD, Modals, Menus, Controls)
├── data/                 # Data statis & skema JSON lokal
├── hooks/                # Custom React Hooks (Core Game Loop Engine)
├── lib/                  # Inisialisasi SDK pihak ketiga (Firebase Setup)
├── public/               # Asset statis (Images, Audio, SFX, Explosions)
├── types/                # Definisi tipe data TypeScript
├── utils/                # Logika matematika, Canvas Renderers, & Audio Manager
├── .env.local            # Environment variables (Firebase Credentials)
├── package.json          # Package manifest & scripts
├── README.md             # Dokumentasi proyek
└── tsconfig.json         # Konfigurasi TypeScript
```

## 🚀 Panduan Instalasi & Jalankan Lokal

### 1. Prasyarat

Pastikan kamu telah menginstal Node.js (versi 18.x atau yang lebih baru).

### 2. Clone Repository

```bash
git clone https://github.com/ka-zukii/penjaga-langit.git
```

```bash
cd penjaga-langit
```

### 3. Install Dependensi

```bash
npm install
```

### 4. Konfigurasi Environment Variables

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Jalankan Server Development

```bash
npm run dev
```

Buka browser dan akses http://localhost:3000 untuk memainkan game.

## Authors

- Rizky Andika Sukma (2413010717)
