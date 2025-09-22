# 🤖 ChatBot Teman - AI Assistant yang Ramah

ChatBot Teman adalah aplikasi web chatbot AI yang menggunakan Google Gemini API dengan personality yang ramah dan asik diajak ngobrol, seperti SimSimi tapi lebih sopan dan friendly!

## ✨ Fitur Utama

- 🎨 **Interface Modern**: Desain seperti aplikasi chat modern dengan bubble messages
- 🤖 **Personality Ramah**: AI yang berperilaku seperti teman dekat yang asik diajak ngobrol
- 🔐 **Keamanan Tinggi**: API Key disimpan di file `.env` (tidak di frontend)
- 💬 **Typing Indicator**: Animasi saat bot sedang mengetik
- 📱 **Responsive**: Tampilan optimal di desktop dan mobile
- 🎯 **Error Handling**: Pesan error yang informatif dan ramah

## 🚀 Cara Install & Setup

### 1. Persiapan
- Download atau clone repository ini
- Pastikan Anda memiliki web server (XAMPP, WAMP, LAMP, atau server PHP lainnya)

### 2. Setup API Key
1. **Dapatkan API Key** gratis dari [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Copy file** `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
3. **Edit file** `.env` dan isi API Key Anda:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Jalankan Aplikasi
1. **Tempatkan folder** ini di direktori web server Anda (htdocs/www/html)
2. **Jalankan web server** (start Apache di XAMPP/WAMP)
3. **Buka browser** dan akses: `http://localhost/nama-folder-anda/`

### 4. Testing
- Klik tombol ⚙️ di header untuk membuka settings
- Klik "Test Koneksi" untuk memastikan API berfungsi
- Mulai ngobrol dengan ChatBot Teman! 🎉

## 📁 Struktur File

```
chatbot-teman/
├── index.html          # File utama HTML
├── style.css          # Styling dan animasi
├── script.js          # Logic JavaScript
├── api.php            # Backend PHP untuk Gemini API
├── .env.example       # Template environment variables
├── .env               # File API Key (JANGAN COMMIT!)
├── .gitignore         # File yang diabaikan git
└── README.md          # Dokumentasi ini
```

## 🔒 Keamanan

- ✅ API Key disimpan di server (file `.env`)
- ✅ Tidak ada API Key yang terexpose di frontend
- ✅ File `.env` otomatis diabaikan git (`.gitignore`)
- ✅ CORS protection di PHP endpoint
- ✅ Input validation & sanitization

## 🛠️ Persyaratan Sistem

- **Web Server**: Apache/Nginx dengan PHP
- **PHP Version**: 7.4+ (recommended 8.0+)
- **Extensions**: curl, json (biasanya sudah aktif)
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

## 🎯 Personality Bot

ChatBot Teman dirancang dengan karakteristik:
- 😊 **Ramah & Ceria**: Selalu positif dan antusias
- 🇮🇩 **Bahasa Natural**: Indonesia sehari-hari yang natural
- 💭 **Empati Tinggi**: Bisa merasakan mood dan memberikan respon yang sesuai
- 🎮 **Topik Beragam**: Hobi, makanan, film, game, curhat, motivasi
- 🤣 **Humor Ringan**: Suka bercanda tanpa menyinggung

## 🐛 Troubleshooting

### "Server Error" atau tidak bisa connect
- Pastikan web server (Apache) sudah running
- Akses melalui `http://localhost/` bukan `file://`

### "API Key tidak ditemukan"
- Cek file `.env` sudah dibuat dan berisi API Key yang benar
- Pastikan format: `GEMINI_API_KEY=your_key_here` (tanpa spasi)

### "Quota habis"
- API Key Gemini mungkin sudah mencapai limit harian
- Cek quota di [Google AI Studio](https://makersuite.google.com/)

### Bot tidak merespon sesuai karakter
- Sistem prompt sudah dioptimasi untuk personality ramah
- Jika perlu, edit `$systemPrompt` di file `api.php`

## 📝 Lisensi

Proyek ini dibuat untuk tujuan edukasi dan penggunaan pribadi. Silakan modify sesuai kebutuhan!

## 🤝 Kontribusi

Feel free untuk:
- Report bugs di Issues
- Suggest fitur baru
- Submit pull requests
- Share pengalaman penggunaan

---

**Selamat ngobrol dengan ChatBot Teman! 🌟**