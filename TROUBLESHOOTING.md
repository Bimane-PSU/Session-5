# 🔧 Troubleshooting Guide - ChatBot Teman

## ❌ Masalah: "Server Error" ketika menjalankan aplikasi

### 🎯 **Solusi Cepat (Sudah Diperbaiki)**

Aplikasi sekarang menggunakan **Hybrid Mode** yang otomatis detect:

1. **Mode Server (Recommended)** - Jika PHP server tersedia
2. **Mode Fallback** - Jika tidak ada server, bisa input API Key manual

### 🚀 **Cara Menggunakan:**

#### **Opsi 1: Mode Fallback (Langsung Jalan)**
1. ✅ Buka file `index.html` langsung di browser (double-click)
2. ✅ Klik ⚙️ settings 
3. ✅ Masukkan API Key Gemini di form yang muncul
4. ✅ Klik Simpan dan mulai ngobrol!

#### **Opsi 2: Mode Server (Lebih Aman)**
1. 📥 Download & Install [XAMPP](https://www.apachefriends.org/) 
2. 📁 Copy folder chatbot ke `C:\xampp\htdocs\`
3. ▶️ Start XAMPP Control Panel → Start Apache
4. 🌐 Buka browser: `http://localhost/chatbot-teman/`
5. ✅ API Key otomatis dibaca dari file `.env`

### 🔍 **Debug Checklist:**

- ✅ API Key sudah diisi di `.env` (tanpa tanda kutip)
- ✅ File `.env` format: `GEMINI_API_KEY=your_key_here`
- ✅ Browser modern (Chrome/Firefox/Edge)
- ✅ Internet connection active

### 🐛 **Error Messages & Solutions:**

| Error | Penyebab | Solusi |
|-------|----------|--------|
| "Server Error" | PHP tidak jalan | Gunakan Mode Fallback |
| "API Key tidak ditemukan" | File .env salah | Cek format .env |
| "Quota habis" | Limit API tercapai | Tunggu atau buat API Key baru |
| "Network error" | Internet/CORS issue | Cek koneksi internet |

### 📱 **Status Indicator:**

- 🟢 **"Online (Server Mode)"** = PHP server jalan, .env terbaca
- 🟡 **"Online (Fallback Mode)"** = Direct browser, API manual
- 🔴 **"Perlu Setup Manual"** = Perlu input API Key
- ⚫ **"Server Error"** = Ada masalah teknis

### 💡 **Tips:**

1. **Mode Fallback lebih mudah** untuk testing cepat
2. **Mode Server lebih aman** untuk production
3. **API Key disimpan lokal** di browser (Mode Fallback)
4. **Refresh browser** jika ada perubahan

### 🆘 **Kalau Masih Error:**

1. Buka Developer Tools (F12)
2. Lihat tab Console untuk error detail
3. Screenshot dan tanyakan ke developer

---

**Update terbaru:** Aplikasi sudah diperbaiki dengan sistem hybrid yang otomatis fallback jika server tidak tersedia! 🎉