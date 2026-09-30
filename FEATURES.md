# Fitur Sistem Graphelp

Dokumen ini mencatat fitur berdasarkan kode yang tersedia saat ini. Status **✅ Implemented** berarti alur yang diperlukan terlihat tersedia di frontend dan/atau backend sesuai lingkup fiturnya. Status **⚠️ Partial** berarti hanya sebagian alur yang terhubung atau ada kontrak data yang belum selaras. Status **❌ Referenced but not implemented** berarti kode frontend mereferensikan kemampuan yang implementasi backend-nya tidak ditemukan.

## 1. Ringkasan Fitur

| Fitur | Status | File terkait |
| --- | --- | --- |
| Registrasi akun dengan OTP email | ✅ Implemented | `auth.py`, `schemas.py`, `utils.py`, `RegisterPage.jsx`, `VerifyOtpPage.jsx` |
| Login akun | ✅ Implemented | `auth.py`, `models.py`, `LoginPage.jsx` |
| Reset kata sandi dengan OTP | ✅ Implemented | `auth.py`, `schemas.py`, `utils.py`, halaman lupa/reset password |
| Peran `public` dan `guru` pada akun | ⚠️ Partial | `models.py`, `auth.py`, `RegisterPage.jsx`, `Navbar.jsx`, `StudentPage.jsx`, `HistoryPage.jsx` |
| Upload dan analisis satu foto tulisan | ⚠️ Partial | `analyzepage.jsx`, `main.py`, `predict.py` |
| Halaman hasil analisis (ResultsPage) | ⚠️ Partial | `resultspage.jsx`, `main.py`, `predict.py` |
| Analisis batch tulisan siswa | ⚠️ Partial | `StudentPage.jsx`, `main.py`, `predict.py` |
| Menggambar tulisan pada canvas | ⚠️ Partial | `analyzepage.jsx` (`SignaturePad`) |
| Pemindaian dengan kamera | ⚠️ Partial | `analyzepage.jsx` (`CameraView`) |
| Riwayat analisis guru | ❌ Referenced but not implemented | `HistoryPage.jsx` |
| Halaman informasi aplikasi | ✅ Implemented | `homepage.jsx` |
| Navigasi berbasis status user | ✅ Implemented | `App.jsx`, `Navbar.jsx`, `Header.jsx` |
| Logout | ⚠️ Partial — hanya di sidebar mobile | `Navbar.jsx` |

## 2. Fitur Autentikasi dan User Management

### Registrasi dengan verifikasi OTP email

**Status: ✅ Implemented**

Alur registrasi terdiri dari dua endpoint:

1. `RegisterPage.jsx` mengumpulkan `username`, `email`, `password`, `role`, serta data sekolah untuk role `guru`. Halaman lalu mengirim `POST /send-otp-register` dengan body JSON `{ "email": "..." }`.
2. `auth.py` memvalidasi body sebagai `OTPRequest`, memeriksa apakah email sudah ada pada tabel `users`, menghasilkan OTP enam digit, menyimpannya di `otp_storage[email]` dengan tipe `register`, lalu mengirimkannya melalui `send_otp_email()`.
3. `VerifyOtpPage.jsx` meneruskan data formulir dan kode ke `POST /register-with-otp?otp=<kode>`.
4. Endpoint menerima body `UserRegister`, memastikan OTP dan tipe proses cocok, melakukan hash password dengan `pwd_context.hash()`, membuat `User`, melakukan `commit()`, lalu menghapus OTP dari penyimpanan sementara.

Validasi Pydantic pada `UserRegister` mewajibkan `username`, `email` bertipe `EmailStr`, dan `password`. `role` bernilai default `public`; `school_name`, `school_email`, dan `bukti_path` bersifat opsional. Untuk role selain `guru`, backend menyimpan ketiga field sekolah sebagai `None`.

Respons sukses endpoint OTP dan registrasi berbentuk JSON dengan field `message`. Email duplikat atau OTP yang tidak cocok menghasilkan `HTTPException` 400.

### Login dengan role `guru`/`public`

**Status: ✅ Implemented**

`LoginPage.jsx` mengirim `POST /login` dalam format `application/x-www-form-urlencoded` menggunakan field `username` dan `password`. Backend memakai dependency `OAuth2PasswordRequestForm`, mencari `User` berdasarkan username, lalu memverifikasi password melalui `pwd_context.verify()`.

Respons sukses berisi:

```json
{
  "message": "Login berhasil!",
  "user": {
    "id": 1,
    "username": "...",
    "email": "...",
    "role": "guru",
    "school_name": "..."
  }
}
```

Frontend menyimpan objek `user` tersebut di `localStorage`. Role dipakai oleh `Navbar`, `StudentPage`, dan `HistoryPage` untuk menampilkan menu serta membatasi akses UI guru.

**Catatan:** backend tidak mengeluarkan token atau sesi autentikasi, dan endpoint analisis tidak memeriksa role. Karena itu, kontrol role yang terlihat saat ini terutama berada di sisi frontend; statusnya pada ringkasan ditandai **⚠️ Partial** untuk otorisasi sistem secara menyeluruh. Fungsi logout (`handleLogout`) tersedia di `Navbar.jsx` dan bekerja dengan menghapus key `user` dari `localStorage`, mereset state, lalu mengarahkan pengguna ke `/login`. Tombol logout hanya muncul di **sidebar mobile**; tidak ada tombol logout di navbar desktop.

### Lupa password dengan OTP

**Status: ✅ Implemented**

Alurnya adalah:

1. `ForgotPasswordPage.jsx` mengirim `POST /forgot-password/send-otp` dengan `OTPRequest` berisi `email: EmailStr`.
2. Backend memastikan email terdaftar, menyimpan OTP bertipe `forgot` pada `otp_storage`, dan mengirimkannya melalui SMTP.
3. `VerifyOtpForgotPage.jsx` memeriksa bahwa input OTP setidaknya enam karakter, lalu membawa `email` dan OTP ke `ResetPasswordPage.jsx` melalui state router.
4. `ResetPasswordPage.jsx` mengirim `POST /forgot-password/reset` dengan `ResetPasswordRequest`: `email`, `otp`, dan `new_password`.
5. Backend memverifikasi kode serta tipenya, membuat hash baru, menyimpan password, dan menghapus OTP.

Endpoint reset memakai schema `ResetPasswordRequest`; email divalidasi sebagai `EmailStr`, tetapi tidak ada aturan panjang atau kompleksitas password baru pada schema yang tersedia.

### Data pengguna yang disimpan

Model `User` pada tabel `users` menyediakan `id`, `username`, `email`, `password`, `role`, `school_name`, `school_email`, dan `bukti_path`. Username dan email bersifat unik. Saat ini tidak ditemukan endpoint profil pengguna, daftar pengguna, atau perubahan data profil.

## 3. Fitur Analisis Tulisan Tangan

### Upload foto tulisan tangan

**Status: ⚠️ Partial — inferensi backend tersedia, tetapi sebagian field hasil tidak diteruskan.**

Tab **Upload Foto** di `analyzepage.jsx` menyediakan dropzone yang menerima `image/*` melalui pemilih file atau drag-and-drop. File disimpan pada state `fileObj`. Saat pengguna menekan tombol analisis, `handleAnalyze()` membuat `FormData` dan mengirim:

```text
POST http://localhost:8000/analyze-handwriting
```

Untuk analisis personal, frontend mengirim metadata placeholder (`school_name` dan `grade_class` berupa `-`, nomor absen `1`, nama `Anda`, usia `0`, gender `L`) serta satu field `handwriting_images` berisi file yang dipilih.

Endpoint `/analyze-handwriting` di `main.py` memang menerima daftar `UploadFile`, kemudian memanggil `predict_image(image.file)` untuk setiap gambar. Jadi, mode upload file tersambung ke backend.

### Analisis batch siswa

**Status: ⚠️ Partial — pemrosesan batch tersedia, penyimpanan riwayat belum terlihat.**

`StudentPage.jsx` tersedia untuk user dengan role `guru`. Pengguna dapat menambah atau menghapus baris siswa, mengisi nomor absen, nama, usia, gender, serta mengunggah gambar tiap siswa. Halaman membentuk `FormData` dengan field berulang dan mengirimkannya ke endpoint `/analyze-handwriting` yang sama.

Backend melakukan iterasi pada `handwriting_images`, sehingga inferensi batch untuk file yang dikirim memang tersedia. Namun, `school_name`, `grade_class`, usia, dan gender hanya diterima sebagai input endpoint: kode `main.py` tidak menyimpannya, tidak memakainya dalam inferensi, dan tidak membangun riwayat analisis.

### Input manual dengan SignaturePad

**Status: ⚠️ Partial — UI frontend tersedia, belum ada pengiriman ke backend.**

Komponen `SignaturePad` memakai elemen `<canvas>` dan Pointer Events untuk menggambar. Komponen mendukung pena, penghapus, perubahan ukuran garis, serta pembersihan kanvas. State `hasDrawn` dipakai untuk mengaktifkan tombol lanjutan setelah ada goresan.

Tidak ada handler pada tombol tab **Tulis Manual** yang mengonversi canvas menjadi file/data URL dan mengirimkannya ke `/analyze-handwriting`. Endpoint backend juga hanya dideklarasikan menerima `UploadFile`, bukan data canvas secara langsung. Dengan demikian, fitur menggambar ada di frontend, tetapi analisis dari hasil gambar manual **belum ada di backend**.

### Scan langsung via kamera

**Status: ⚠️ Partial — UI frontend tersedia, belum ada pengiriman ke backend.**

Komponen `CameraView` meminta akses kamera dengan `navigator.mediaDevices.getUserMedia()`, menampilkan video, mengambil frame persegi ke canvas, lalu menghasilkan gambar PNG sebagai data URL. Pengguna dapat mengambil ulang atau memakai hasil tangkapan. State `capturedPhoto` menyimpan data URL untuk ditampilkan.

Tombol analisis setelah foto diambil tidak memiliki handler untuk mengirim gambar tersebut. Tidak ada endpoint backend yang menerima data URL/base64 kamera. Jadi, capture kamera merupakan kemampuan UI yang **belum terhubung ke backend** untuk inferensi.

### Output analisis model

`predict.py` memuat EfficientNet-B0 dengan classifier sembilan kelas, memproses gambar menjadi RGB, melakukan resize `256 × 256`, center crop `224 × 224`, konversi tensor, serta normalisasi ImageNet. Model menjalankan inferensi PyTorch dalam `torch.no_grad()`, menerapkan softmax, lalu menentukan probabilitas tertinggi dan tiga kandidat teratas.

Keluaran internal `predict_image()` adalah:

| Field | Keterangan |
| --- | --- |
| `pred_type` | Nomor tipe Enneagram 1–9 dengan probabilitas tertinggi. |
| `type_name` | Nama tipe, misalnya `The Achiever`. |
| `description` | Deskripsi dari `ENNEAGRAM_INFO`; nilainya saat ini placeholder `"..."`. |
| `confidence` | Probabilitas prediksi utama dalam persen. |
| `top3` | Tiga kandidat teratas, masing-masing berisi `type`, `name`, dan `prob`. |
| `features` | ❌ Tidak ada di output backend; diantisipasi oleh `ResultsPage` namun belum dikirim. |
| `recommendations` | ❌ Tidak ada di output backend; `ResultsPage` menggunakan fallback `TYPE_INFO.tips` lokal. |

**Catatan kontrak respons:** `main.py` hanya meneruskan `pred_type`, `confidence`, dan `top3` ke `details` respons endpoint. `type_name` dan `description` tidak dikirim. `ResultsPage` mengatasi ini dengan fallback ke data `TYPE_INFO` lokal yang sudah ditulis lengkap (nama, label, tagline, traits, kekuatan, tantangan, rekomendasi) untuk semua 9 tipe Enneagram. Field `features` dan `recommendations` dari backend juga diantisipasi oleh `ResultsPage`, tetapi keduanya **❌ belum dikirim oleh `main.py`**.

**Catatan typo:** Subjek email OTP yang dikirim `utils.py` adalah `"Kode OTP {tujuan} - Graphhelp"`. Nama proyek yang benar adalah `Graphelp`. Perbaikan kode belum dilakukan.

## 4. Fitur Riwayat Analisis (History)

**Status: ❌ Referenced but not implemented di backend**

`HistoryPage.jsx` memiliki antarmuka riwayat dengan kemampuan berikut:

- Membaca `user` dari `localStorage` dan mengarahkan non-guru ke halaman utama sambil menampilkan toast penolakan.
- Memanggil `GET http://localhost:8000/analysis-history?user_id=<id>` saat halaman dimuat.
- Menampilkan status loading, keadaan kosong, atau daftar kartu riwayat yang memuat kelas, sekolah, waktu, dan total siswa.
- Menyediakan tombol **Lihat Detail** yang menavigasi ke `/history/<id>`.

Namun, endpoint `/analysis-history` tidak ditemukan pada `main.py` maupun `auth.py`; tidak ditemukan pula model database untuk riwayat atau route `/history/:id` di `App.jsx`. Bila request gagal, kode mengisi dua data contoh di frontend. Dengan demikian, UI riwayat dan fallback dummy ada, tetapi pengambilan/penyimpanan riwayat nyata **belum ada di backend**.

## 5. Fitur Halaman Utama (Homepage)

**Status: ✅ Implemented sebagai konten informasional/statis**

`homepage.jsx` menyediakan:

- Hero section bertajuk *AI-Powered Handwriting Analysis* beserta gambar.
- Bagian tentang aplikasi dan kutipan informasi.
- Kartu teknologi: Computer Vision, Deep Learning, Software Engineering, dan Machine Learning.
- Bagian visi dan misi.
- Efek masuk saat scroll melalui hook `useRevealOnScroll()` dan `IntersectionObserver` untuk elemen dengan class `reveal`.

Halaman ini tidak mengirim request ke backend. Tombol “Mulai Analisis” memiliki handler `handleMulaiAnalisis` yang memeriksa `localStorage` — jika pengguna belum login, menampilkan toast error dan mengarahkan ke `/login`; jika sudah login, mengarahkan ke `/analyze`.



## 6. Fitur yang Terlihat Direncanakan tetapi Belum Ada Implementasinya

Berikut adalah observasi terhadap celah yang terlihat di kode, bukan pernyataan bahwa komponen tersebut seharusnya sudah tersedia.

- **Riwayat dan detail riwayat:** `HistoryPage` mereferensikan endpoint `/analysis-history` dan navigasi detail `/history/:id`, tetapi implementasi endpoint, tabel penyimpanan, dan route detail tidak ditemukan.
- **Pengunggahan dokumen bukti guru:** form registrasi menyimpan nomor pengajar/NUPTK/NIP pada field bernama `bukti_path`; model `User` juga memiliki kolom ini. Tidak ditemukan input file atau endpoint upload dokumen sekolah/identitas terpisah. Jadi field ini saat ini menerima string, bukan bukti file yang diunggah.
- **Analisis dari canvas dan kamera:** frontend menyediakan `SignaturePad` dan `CameraView`, tetapi tidak ada serialisasi/unggah ke endpoint analisis serta tidak ada endpoint khusus data canvas/base64.
- **Deskripsi hasil tipe:** `ENNEAGRAM_INFO` menyediakan field deskripsi, tetapi seluruh nilainya placeholder `"..."`; selain itu `main.py` tidak memasukkannya ke respons.
- **Otorisasi backend untuk fitur guru:** role disimpan dan digunakan untuk UI, tetapi tidak ditemukan dependency autentikasi/token atau pemeriksaan role pada endpoint `/analyze-handwriting`.
- **Validasi password baru:** `ResetPasswordRequest` menerima string `new_password`, tanpa aturan panjang atau kompleksitas yang terlihat pada schema.
- **Endpoint/fitur profil:** model pengguna menyimpan data sekolah, tetapi endpoint untuk melihat atau mengubah profil tidak ditemukan.

## 7. Batasan Fitur Saat Ini

- `/analyze-handwriting` menerima gambar melalui `UploadFile` dalam `multipart/form-data`; tidak ada endpoint yang menerima drawing canvas atau capture kamera dalam bentuk base64/data URL.
- Endpoint upload tidak menunjukkan validasi eksplisit terhadap ukuran berkas, MIME type, ekstensi, jumlah file maksimum, atau penanganan khusus file gambar yang rusak. Atribut frontend `accept="image/*"` hanya membantu di sisi browser.
- Endpoint mengasumsikan jumlah `handwriting_images`, `absence_numbers`, dan `student_names` selaras karena mengakses daftar melalui indeks yang sama. Pemeriksaan keselarasan daftar tidak terlihat di `main.py`.
- Hasil analisis tidak disimpan: kode yang diperiksa hanya memiliki tabel `users`; tidak ada tabel sampel gambar, prediksi, kelas, atau riwayat.
- OTP tersimpan dalam dictionary in-memory `otp_storage`; data hilang ketika proses backend dimulai ulang dan tidak terlihat memiliki waktu kedaluwarsa eksplisit.
- Seluruh pemanggilan API frontend yang diperiksa memakai URL hardcoded `http://localhost:8000`, sehingga konfigurasi untuk lingkungan selain lokal belum terlihat.
- Respons login menyimpan data user di `localStorage`, tetapi tidak ada token atau sesi server yang terlihat pada kode.
