# Panduan Instalasi dan Penggunaan Graphelp

Panduan ini ditujukan untuk developer yang ingin menjalankan Graphelp secara lokal dan pengguna yang memakai antarmuka webnya. Instruksi didasarkan pada kode yang tersedia saat ini; bagian yang tidak dapat dipastikan ditandai sebagai **perlu dikonfirmasi**.

## 1. Prasyarat

### Software yang diperlukan

| Kebutuhan | Keterangan |
| --- | --- |
| Python | **Python 3.13 atau lebih baru**, sesuai `requires-python = ">=3.13"` pada `pyproject.toml`. |
| Node.js dan npm | Diperlukan untuk React/Vite. Versi Node.js tidak ditetapkan di repository, jadi **perlu dikonfirmasi** bila ada kendala kompatibilitas. |
| Database | Backend membaca `DATABASE_URL` dan menyerahkannya ke SQLAlchemy. Jenis database tidak ditentukan langsung oleh kode. `psycopg2-binary` tersedia di `requirements.txt`, sehingga PostgreSQL didukung oleh dependensi yang ada. SQLite dapat digunakan dengan URL SQLite SQLAlchemy. MySQL **perlu driver tambahan** dan perlu dikonfirmasi/dilengkapi. |
| Akun Gmail/SMTP | Diperlukan untuk mengirim OTP registrasi dan reset password melalui SMTP SSL Gmail. |

Library utama backend yang digunakan oleh import kode meliputi FastAPI, SQLAlchemy, Passlib, PyTorch (`torch`), Torchvision, `python-dotenv`, Pillow, NumPy, Pydantic, serta `python-multipart`. Dependensi Python yang dipin sudah tersedia pada `requirements.txt`.

### Model AI

Backend memuat `best_enneagram_model.pth` dari direktori kerja backend saat `predict.py` diimpor. Pada workspace ini file tersebut tersedia di `backend/best_enneagram_model.pth`.

> **Perlu dikonfirmasi setelah clone:** pastikan file `backend/best_enneagram_model.pth` ikut tersedia. Jika tidak ada pada salinan repository Anda, file bobot model perlu dilengkapi secara manual sebelum backend dapat dijalankan.

## 2. Instalasi Backend

1. Clone repository lalu masuk ke direktori proyek.

   ```bash
   git clone <URL_REPOSITORY>
   cd Graphelp
   ```

2. Buat virtual environment.

   ```bash
   python -m venv .venv
   ```

3. Aktifkan virtual environment.

   ```powershell
   # Windows PowerShell
   .\.venv\Scripts\Activate.ps1
   ```

   ```bash
   # macOS/Linux
   source .venv/bin/activate
   ```

4. Instal dependensi dari file yang sudah tersedia di repository.

   ```bash
   pip install -r requirements.txt
   ```

   File tersebut mencakup, antara lain, `fastapi`, `uvicorn`, `SQLAlchemy`, `passlib`, `torch`, `torchvision`, `pillow`, `numpy`, `python-dotenv`, `python-multipart`, `email-validator`, dan driver PostgreSQL `psycopg2-binary`.

5. Pastikan file model berada di lokasi berikut.

   ```text
   backend/best_enneagram_model.pth
   ```

   Jalankan backend dari folder `backend` agar path relatif `best_enneagram_model.pth` pada `predict.py` sesuai.

## 3. Konfigurasi Environment Variables (`.env`)

Buat file `backend/.env`. Lokasi ini juga tercantum dalam `.gitignore`, sehingga kredensial tidak seharusnya dikomit.

```env
# Contoh PostgreSQL
DATABASE_URL=postgresql://nama_user:password@localhost:5432/nama_database

# Digunakan oleh utils.py untuk mengirim email OTP
SMTP_EMAIL=alamatgmailanda@gmail.com
SMTP_PASSWORD=app_password_gmail
```

Arti setiap variabel:

| Variabel | Dipakai oleh | Fungsi |
| --- | --- | --- |
| `DATABASE_URL` | `database.py` | URL koneksi yang diteruskan ke `create_engine()` SQLAlchemy. |
| `SMTP_EMAIL` | `utils.py` | Alamat pengirim email OTP. |
| `SMTP_PASSWORD` | `utils.py` | Kredensial SMTP untuk login ke Gmail pada SMTP SSL port 465. |

Untuk Gmail, gunakan **App Password**, bukan password akun Gmail biasa. App Password biasanya memerlukan verifikasi 2 langkah pada akun Google. Jika menggunakan layanan email lain, kode saat ini tetap mengarah ke `smtp.gmail.com` pada port `465`; perubahan source diperlukan.

Alternatif SQLite dapat berbentuk berikut bila sesuai kebutuhan lokal:

```env
DATABASE_URL=sqlite:///./graphelp.db
```

Jenis database produksi yang dipakai proyek tetap **perlu dikonfirmasi**, karena `database.py` hanya membaca URL dan tidak menetapkan dialect tertentu.

## 4. Menjalankan Backend

Setelah virtual environment aktif dan `.env` selesai dikonfigurasi, jalankan:

```bash
cd backend
uvicorn main:app --reload
```

Uvicorn menggunakan port **8000** secara default bila port tidak ditentukan. Frontend saat ini memanggil `http://localhost:8000`, jadi gunakan port tersebut untuk pengembangan lokal.

Untuk memilih port lain, gunakan misalnya:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

Jika port diubah, URL API yang hardcoded di frontend juga harus disesuaikan.

Cara memastikan backend berjalan:

- Buka `http://localhost:8000/docs` untuk Swagger UI bawaan FastAPI.
- Buka `http://localhost:8000/openapi.json` untuk spesifikasi OpenAPI.
- Perhatikan terminal: kegagalan konfigurasi database, SMTP, atau file model akan muncul saat startup atau ketika endpoint terkait dipanggil.

Saat aplikasi dimuat, `Base.metadata.create_all(bind=engine)` akan mencoba membuat tabel `users` berdasarkan koneksi `DATABASE_URL`.

## 5. Instalasi dan Menjalankan Frontend

1. Buka terminal baru dari direktori root proyek.

2. Instal dependensi frontend.

   ```bash
   cd frontend
   npm install
   ```

3. Jalankan Vite.

   ```bash
   npm run dev
   ```

4. Buka alamat yang dicetak Vite di terminal; umumnya `http://localhost:5173`, tetapi alamat pastinya ditentukan oleh Vite saat dijalankan.

Repository juga menyediakan perintah dari root:

```bash
npm install
npm run dev
```

Perintah tersebut menjalankan backend dan frontend secara bersamaan dengan `concurrently`. Skrip backend root memakai path Windows `venv\Scripts\python.exe`, bukan `.venv`. Jadi, untuk memakai skrip ini apa adanya, pastikan virtual environment bernama `venv`; atau gunakan dua terminal dengan langkah di atas.

> **Catatan konfigurasi:** beberapa halaman frontend, termasuk `analyzepage.jsx` dan `HistoryPage.jsx`, menulis URL API `http://localhost:8000` langsung di kode. Untuk deployment, pertimbangkan memindahkan base URL ke environment variable Vite, lalu sesuaikan seluruh pemanggilan `fetch`.

## 6. Panduan Penggunaan Aplikasi

### Registrasi akun

1. Buka halaman **Register/Daftar**.
2. Pilih peran **Publik** atau **Guru**.
3. Masukkan username, email, password, dan konfirmasi password.
4. Jika memilih **Guru**, isi nama sekolah, email sekolah, dan nomor pengajar/NUPTK/NIP.
5. Tekan tombol daftar. Sistem mengirim OTP ke alamat email melalui `POST /send-otp-register`.
6. Periksa inbox email, masukkan enam digit OTP pada halaman verifikasi, lalu kirim.
7. Jika kode benar, akun dibuat melalui `POST /register-with-otp` dan Anda dapat login.

Pastikan alamat email valid. Backend akan menolak email yang sudah terdaftar dengan pesan `Email sudah terdaftar!`.

### Login

1. Buka halaman **Login**.
2. Masukkan username dan password.
3. Tekan **Masuk**.

Jika berhasil, informasi dasar user disimpan pada browser dan role `guru` akan menampilkan menu **Student** serta **History** pada navigasi. Jika kredensial salah, backend memberi respons `Username atau password salah!`.

### Lupa password

1. Dari halaman login, pilih **Lupa Password?**.
2. Masukkan alamat email akun dan tekan **Kirim OTP**.
3. Periksa email, masukkan kode OTP pada halaman verifikasi, lalu lanjutkan.
4. Masukkan dan konfirmasikan password baru, kemudian tekan **Update**.

Backend memvalidasi OTP pada saat reset password dikirim. Jika email tidak terdaftar, responsnya adalah `Email tidak ditemukan!`; jika kode tidak cocok, responsnya adalah `Kode OTP salah atau kadaluarsa!`.

### Melakukan analisis tulisan tangan

Masuk ke halaman **Analyze**. Halaman menyediakan tiga tab berikut.

#### Upload Foto

Ini adalah mode yang **sudah terhubung ke backend**.

1. Pilih tab **Upload Foto**.
2. Klik area upload untuk memilih gambar, atau tarik dan jatuhkan file gambar ke area tersebut.
3. Gunakan foto tulisan yang jelas. UI menyarankan pencahayaan merata, kertas rata, tulisan 3–5 baris, dan gambar tidak buram/terpotong.
4. Setelah nama file tampil, tekan **Lanjut ke Hasil Analisis**.
5. Frontend mengirim file sebagai `FormData` ke `POST /analyze-handwriting`.
6. Tunggu hasil. Sistem menampilkan nomor tipe prediksi, confidence, dan tiga kandidat teratas apabila respons berhasil diterima.

#### Tulis Manual

Mode ini menyediakan canvas untuk menulis dengan mouse, stylus, atau sentuhan. Anda dapat memilih pena/penghapus, mengubah ukuran goresan, dan menghapus seluruh gambar.

> **Catatan penting:** tombol analisis pada mode **Tulis Manual** saat ini belum terhubung ke backend. Tidak ada handler submit yang mengirim gambar canvas ke API; mode ini belum menghasilkan prediksi dari server.

#### Scan Kamera

1. Pilih tab **Scan Kamera** dan tekan **Buka Kamera**.
2. Izinkan browser mengakses kamera jika diminta.
3. Ambil foto, pilih **Ulang** bila perlu, atau **Gunakan** untuk mempertahankan hasil tangkapan.

> **Catatan penting:** meskipun hasil kamera dapat ditampilkan di UI, tombol analisis setelah capture belum memiliki handler yang memanggil API. Backend juga tidak menyediakan endpoint data URL/base64 kamera. Mode ini **belum terhubung ke backend** untuk prediksi.

### Analisis siswa (khusus role guru)

Jika login sebagai `guru`, buka halaman **Student**. Isi kelas dan data setiap siswa, unggah satu gambar tulisan untuk masing-masing siswa, lalu tekan **Proses Analisis**. Halaman ini membentuk `FormData` dengan field berulang dan mengirimkannya ke `/analyze-handwriting`, sehingga backend dapat memproses banyak gambar dalam satu request.

Hasil tidak disimpan sebagai riwayat pada kode backend yang tersedia.

### Melihat riwayat analisis (khusus role guru)

Setelah login sebagai guru, buka menu **History**. Halaman memeriksa role di browser dan mencoba mengambil data dari `/analysis-history?user_id=<id>`, lalu menampilkan daftar kelas, sekolah, waktu, jumlah siswa, dan tombol detail.

> **Catatan penting:** endpoint `/analysis-history` tidak ditemukan di backend yang tersedia. Bila request gagal, `HistoryPage.jsx` mengisi data contoh/dummy. Karena itu, riwayat nyata dan halaman detail perlu dilengkapi di backend sebelum fitur ini dapat dipakai sebagai rekam data sebenarnya.

## 7. Troubleshooting Umum

### Tidak bisa terhubung ke server backend

- Pastikan backend sedang berjalan pada `http://localhost:8000`.
- Buka `http://localhost:8000/docs` untuk memastikan server merespons.
- Pastikan frontend memakai port backend yang sama. URL saat ini ditulis langsung sebagai `http://localhost:8000`.
- CORS sudah diaktifkan di backend dengan `allow_origins=["*"]`. Bila tetap gagal, cek log browser dan terminal untuk error jaringan atau port yang dipakai aplikasi lain.

### OTP email tidak terkirim

- Periksa `SMTP_EMAIL` dan `SMTP_PASSWORD` dalam `backend/.env`.
- Gunakan Gmail App Password, bukan password akun reguler.
- Pastikan akun Gmail dan jaringan diizinkan memakai SMTP SSL ke `smtp.gmail.com:465`.
- Jika variabel belum diisi, kode akan menampilkan error: `Konfigurasi SMTP_EMAIL atau SMTP_PASSWORD di .env belum terisi!`.

### Model gagal dimuat

- Pastikan `backend/best_enneagram_model.pth` tersedia.
- Jalankan perintah Uvicorn dari folder `backend` agar path relatif model benar.
- Pastikan instalasi `torch`, `torchvision`, `pillow`, dan `numpy` berhasil.
- Periksa log terminal untuk detail checkpoint atau perangkat CPU/CUDA.

### Login atau registrasi gagal

- Periksa pesan respons yang ditampilkan aplikasi. Contoh dari backend: `Email sudah terdaftar!`, `Username atau password salah!`, `Email tidak ditemukan!`, dan `Kode OTP salah atau kadaluarsa!`.
- Pastikan `DATABASE_URL` valid dan database dapat diakses.
- Untuk registrasi, gunakan alamat email dengan format valid karena Pydantic memakai `EmailStr`.
- Untuk reset, pastikan OTP yang digunakan berasal dari proses reset, bukan OTP registrasi.

### Upload analisis gagal

- Pilih berkas gambar pada mode **Upload Foto**; tombol analisis akan nonaktif tanpa file.
- Pastikan semua field `FormData` yang diwajibkan dikirim oleh frontend. Endpoint membutuhkan metadata sekolah/kelas dan daftar data siswa selain file.
- Gunakan gambar yang dapat dibuka Pillow. Endpoint tidak memiliki validasi tipe/ukuran file yang eksplisit, sehingga error file dapat muncul dari proses pemrosesan gambar.

## 8. FAQ Singkat

### Apakah saya bisa memakai aplikasi tanpa akun?

Halaman analisis tersedia di routing frontend. Namun, akun diperlukan untuk alur login dan fitur UI khusus guru seperti halaman Student serta History.

### Apakah semua tab analisis sudah memberi hasil AI?

Belum. Saat ini hanya **Upload Foto** yang memanggil endpoint prediksi. Tab **Tulis Manual** dan **Scan Kamera** baru menyediakan antarmuka input di browser.

### Mengapa riwayat yang saya lihat tampak seperti contoh?

`HistoryPage` memiliki fallback data dummy ketika request riwayat gagal. Endpoint `/analysis-history` dan penyimpanan riwayat belum ditemukan pada backend yang tersedia.

### Database apa yang harus saya pakai?

Gunakan URL SQLAlchemy pada `DATABASE_URL`. PostgreSQL cocok dengan driver yang sudah ada di `requirements.txt`; SQLite dapat digunakan untuk lokal. Pilihan database target proyek **perlu dikonfirmasi** karena tidak ditetapkan eksplisit oleh kode.

### Apakah hasil prediksi merupakan penilaian profesional?

Kode menghasilkan probabilitas tipe dari model EfficientNet-B0. Hasil ini adalah keluaran model aplikasi dan tidak tercatat sebagai diagnosis atau penilaian psikologis profesional pada implementasi yang tersedia.
