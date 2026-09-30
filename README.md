# Graphelp

Graphelp adalah aplikasi web untuk menganalisis gambar tulisan tangan dengan bantuan kecerdasan buatan. Sistem ini menggunakan model deep learning **EfficientNet-B0** untuk memprediksi salah satu dari sembilan tipe kepribadian Enneagram, lalu menyajikan tingkat keyakinan prediksi dan tiga kandidat tipe dengan probabilitas tertinggi. Aplikasi terdiri atas frontend React dan backend FastAPI.

## Latar Belakang

Penilaian atau pengamatan tulisan tangan secara manual dapat memerlukan waktu, terutama ketika seorang guru perlu meninjau banyak sampel tulisan tangan siswa dalam satu kelas. Graphelp dibuat untuk menyediakan alur digital yang lebih praktis: pengguna dapat mengunggah gambar tulisan tangan, sedangkan guru dapat memasukkan data beberapa siswa sekaligus beserta sampel tulisannya. Backend kemudian memproses setiap gambar secara otomatis dan mengembalikan hasil prediksi agar dapat ditinjau melalui antarmuka web.

Sistem ini juga menyediakan pendaftaran, login, serta pemulihan kata sandi berbasis OTP melalui email. Peran `guru` digunakan oleh frontend untuk membuka halaman input siswa dan riwayat. Prediksi yang dihasilkan merupakan keluaran model dan tidak boleh diperlakukan sebagai penilaian psikologis atau diagnosis profesional.

## Gambaran Kerja Sistem

```text
+------------------------+
| Pengguna / guru        |
| memilih foto tulisan   |
+-----------+------------+
            |
            | multipart/form-data
            v
+------------------------+
| React frontend         |
| /analyze atau /student |
+-----------+------------+
            |
            | POST /analyze-handwriting
            | gambar + data siswa
            v
+------------------------+
| FastAPI (main.py)      |
| iterasi setiap gambar  |
+-----------+------------+
            |
            v
+------------------------+
| predict.py             |
| PIL: buka & RGB        |
| Resize 256x256         |
| CenterCrop 224x224     |
| Tensor & normalisasi   |
+-----------+------------+
            |
            v
+------------------------+
| EfficientNet-B0        |
| best_enneagram_model   |
+-----------+------------+
            |
            | softmax, tipe teratas, top-3
            v
+------------------------+
| Respons JSON           |
| total, status, details |
+-----------+------------+
            |
            v
+------------------------+
| Tampilan hasil React   |
+------------------------+
```

Pada saat backend dimuat, `predict.py` memuat bobot `backend/best_enneagram_model.pth`, memilih CUDA bila tersedia (atau CPU bila tidak), dan mengatur model ke mode evaluasi. Gambar dikonversi ke RGB, diubah ukurannya menjadi 256 × 256, dipotong di tengah menjadi 224 × 224, lalu dinormalisasi dengan statistik ImageNet sebelum inferensi.

## Fitur yang Tersedia

- Analisis satu gambar tulisan tangan melalui halaman **Analyze**.
- Analisis beberapa siswa dalam satu pengiriman melalui halaman **Student** untuk akun berperan `guru`.
- Halaman **Results** yang menampilkan tipe Enneagram, confidence (grafik ring), top-3 probabilitas, interpretasi kepribadian, kekuatan & tantangan, rekomendasi, serta tombol unduh TXT/PDF dan share.
- Pendaftaran akun dengan OTP email, login, lupa kata sandi, dan reset kata sandi.
- Penyimpanan data akun pada database SQLAlchemy yang ditentukan melalui `DATABASE_URL`.
- Antarmuka React dengan unggah gambar, drag-and-drop, serta tampilan kamera dan kanvas tulis manual.

## Struktur Proyek

```text
Graphelp/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # Aplikasi FastAPI dan endpoint prediksi
│   │   ├── predict.py             # Pemuatan EfficientNet-B0 dan inferensi gambar
│   │   ├── auth.py                # Endpoint autentikasi dan OTP
│   │   ├── database.py            # Koneksi dan sesi SQLAlchemy
│   │   ├── models.py              # Model tabel User
│   │   ├── schemas.py             # Skema validasi Pydantic
│   │   └── utils.py               # Generator dan pengiriman OTP email
│   └── ml_models/
│       └── best_enneagram_model.pth  # Bobot model prediksi
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── homepage.jsx       # Halaman beranda
│       │   ├── analyzepage.jsx    # Analisis satu gambar
│       │   ├── resultspage.jsx    # Halaman hasil analisis
│       │   ├── StudentPage.jsx    # Analisis banyak siswa untuk guru
│       │   └── HistoryPage.jsx    # Antarmuka riwayat guru
│       ├── Auth/                  # Halaman autentikasi
│       └── components/            # Layout, navigasi, header, footer, toast
├── requirements.txt               # Dependensi Python
└── package.json                   # Perintah menjalankan frontend dan backend
```

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Frontend | React 19, Vite, React Router 7 |
| Backend | FastAPI, Uvicorn |
| AI | PyTorch (CPU-only di `requirements.txt`), Torchvision, EfficientNet-B0 |
| Pemrosesan gambar | Pillow, NumPy |
| Database | SQLAlchemy (dialect bebas); `psycopg2-binary` tersedia untuk PostgreSQL |
| Autentikasi | Passlib (`pbkdf2_sha256`/`bcrypt`), OTP SMTP Gmail |

## Prasyarat

- Python 3.13 atau lebih baru (sesuai `requires-python` pada `pyproject.toml`).
- Node.js dan npm.
- Database yang URL koneksinya dapat diberikan ke SQLAlchemy. PostgreSQL direkomendasikan; `psycopg2-binary` sudah ada di `requirements.txt`. SQLite juga dapat dipakai untuk lokal.
- Akun SMTP Gmail untuk fitur OTP.
- File model `backend/ml_models/best_enneagram_model.pth` harus tersedia.
- **Catatan GPU:** `requirements.txt` menyertakan `torch==2.13.0+cpu` (CPU-only). Jika menggunakan GPU/CUDA, instal PyTorch versi CUDA secara terpisah sesuai panduan di [pytorch.org](https://pytorch.org/get-started/locally/).

## Konfigurasi

1. Buat dan aktifkan virtual environment Python di direktori proyek.

2. Instal dependensi backend.

   ```bash
   pip install -r requirements.txt
   ```

3. Buat file `backend/.env` dan isi konfigurasi berikut.

   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<nama_database>
   SMTP_EMAIL=alamat@gmail.com
   SMTP_PASSWORD=password_aplikasi_gmail
   ```

   `SMTP_PASSWORD` diperlukan karena pengiriman OTP dilakukan melalui SMTP SSL Gmail pada port 465. File `.env` sudah dikecualikan dari Git.

4. Instal dependensi frontend.

   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Menjalankan Aplikasi

Jalankan backend dan frontend secara bersamaan dari direktori root:

```bash
npm run dev
```

Perintah tersebut menjalankan FastAPI pada `http://localhost:8000` dan Vite pada alamat yang ditampilkan di terminal (secara umum `http://localhost:5173`). Anda juga dapat menjalankannya secara terpisah:

```bash
# Terminal 1 — jalankan dari folder backend/
cd backend
..\venv\Scripts\python.exe -m uvicorn app.main:app --reload

# Terminal 2
cd frontend
npm run dev
```

Saat aplikasi backend mulai, `Base.metadata.create_all()` akan membuat tabel `users` bila belum ada.

## Endpoint Backend

| Metode | Endpoint | Keterangan |
| --- | --- | --- |
| `POST` | `/analyze-handwriting` | Menganalisis satu atau banyak gambar tulisan tangan. |
| `POST` | `/send-otp-register` | Mengirim OTP untuk registrasi. |
| `POST` | `/register-with-otp?otp=<kode>` | Memverifikasi OTP dan membuat akun. |
| `POST` | `/login` | Login dengan format form OAuth2 (`username`, `password`). |
| `POST` | `/forgot-password/send-otp` | Mengirim OTP reset kata sandi. |
| `POST` | `/forgot-password/reset` | Memperbarui kata sandi menggunakan OTP. |

### Format Analisis

Endpoint `POST /analyze-handwriting` menerima `multipart/form-data` dengan field berikut:

| Field | Tipe | Keterangan |
| --- | --- | --- |
| `school_name` | string | Nama sekolah. |
| `grade_class` | string | Kelas. |
| `absence_numbers` | daftar string | Nomor absen, satu untuk setiap gambar. |
| `student_names` | daftar string | Nama siswa, satu untuk setiap gambar. |
| `ages` | daftar string | Usia siswa. |
| `genders` | daftar string | Gender siswa. |
| `handwriting_images` | daftar file | Berkas gambar tulisan tangan. |

Contoh respons yang benar-benar dibentuk oleh `main.py`:

```json
{
  "total_processed": 1,
  "status": "Sukses",
  "details": [
    {
      "name": "No. 1 - Anda",
      "pred_type": 3,
      "confidence": 87.42,
      "top3": [
        { "type": 3, "name": "The Achiever", "prob": 87.42 },
        { "type": 1, "name": "The Reformer", "prob": 7.12 },
        { "type": 6, "name": "The Loyalist", "prob": 2.36 }
      ]
    }
  ]
}
```

## Catatan Implementasi Saat Ini

- Fungsi prediksi memiliki `type_name` dan `description`, tetapi `main.py` saat ini hanya meneruskan `pred_type`, `confidence`, dan `top3` ke `details`. `ResultsPage` mengatasi ketiadaan field ini dengan fallback ke data `TYPE_INFO` lokal yang sudah ditulis lengkap di sisi frontend — sehingga nama tipe, interpretasi, kekuatan, tantangan, dan rekomendasi tetap ditampilkan.
- Kolom `school_name`, `grade_class`, usia, dan gender diterima endpoint analisis, namun hasil analisis belum disimpan ke database. Model database yang tersedia hanya `User`.
- `HistoryPage.jsx` mencoba memanggil `/analysis-history`, tetapi endpoint tersebut belum didefinisikan di backend. Jika pemanggilan gagal, halaman menggunakan data contoh di sisi klien.
- Tab **Tulis Manual** dan **Scan Kamera** telah tersedia di antarmuka, tetapi tombol analisisnya belum mengirim data ke backend. Alur yang tersambung penuh saat ini adalah unggah file gambar.
- OTP disimpan di memori proses (`otp_storage`), sehingga tidak persisten saat server dimulai ulang dan belum memiliki mekanisme kedaluwarsa eksplisit.
- Nama proyek di `pyproject.toml` (baris 2) dan subjek email OTP di `utils.py` (baris 22) mengandung typo `graphhelp`/`Graphhelp`; nama yang benar adalah `Graphelp`. Perbaikan kode belum dilakukan.
