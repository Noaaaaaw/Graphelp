# Panduan Command Deployment Graphelp (Server Lab Trisakti)

Dokumen ini berisi daftar perintah terminal runut yang disesuaikan **100% dengan lingkungan nyata server Lab Trisakti**:
* **URL Akses:** `https://lab1.trisakti.ac.id/graphelp/`
* **Subpath:** `/graphelp/`
* **Host SSH:** `103.28.161.35:22007` (User: `graphelp`, Password: `95860f0a9a0c9a80925fec0751f2befc`)
* **Folder Proyek:** `/home/graphelp/project`
* **Arsitektur:** Native Python Virtual Environment (`.venv`) + Uvicorn di Port 3000 (Melayani API dan Web React SPA sekaligus).

Dokumen ini bersanding langsung dengan [DEPLOYMENT_PLAN.md](file:///c:/Users/faiz/Documents/tgstgs/Semester%207/Graphelp/DEPLOYMENT_PLAN.md).

---

## DAFTAR ISI

1. [Fase 1: Command Eksekusi Internal Lokal (Komputer Anda)](#fase-1-command-eksekusi-internal-lokal-komputer-anda)
2. [Fase 2: Command Eksekusi di Server Trisakti Lab (Via SSH)](#fase-2-command-eksekusi-di-server-trisakti-lab-via-ssh)
3. [Fase 3: Command Verifikasi & Testing](#fase-3-command-verifikasi--testing)
4. [Fase 4: Command Maintenance & Update Cepat](#fase-4-command-maintenance--update-cepat)

---

## Fase 1: Command Eksekusi Internal Lokal (Komputer Anda)

Perintah ini dijalankan di terminal lokal untuk menyiapkan kode sebelum dikirim ke server.

### 1.1 Pastikan Berada di Branch `deployment-vps`
```bash
git branch
# Harus bertanda: * deployment-vps
```

### 1.2 Uji Coba Build Frontend Lokal
Setelah perubahan kode internal selesai, pastikan Vite berhasil mem-build frontend tanpa error:
```bash
cd frontend
npm run build
cd ..
```

### 1.3 Commit dan Push Seluruh Perubahan Internal
```bash
git add .
git commit -m "feat(deploy): penyesuaian internal subpath graphelp, models mysql, requirements, dan spa routing"
git push -u origin deployment-vps
```

---

## Fase 2: Command Eksekusi di Server Trisakti Lab (Via SSH)

Perintah ini dijalankan langsung di server Trisakti.

### 2.1 Login ke Server via SSH
Dari terminal lokal (PowerShell / CMD / Git Bash):
```bash
ssh graphelp@103.28.161.35 -p 22007
```
*(Masukkan password: `95860f0a9a0c9a80925fec0751f2befc`)*

---

### 2.2 Tarik (Pull / Clone) Kode Proyek ke `/home/graphelp/project`
Di terminal server Trisakti:

```bash
cd /home/graphelp/project

# Inisialisasi git jika folder masih kosong:
if [ ! -d ".git" ]; then
    git clone -b deployment-vps https://github.com/Noaaaaaw/Graphelp.git .
else
    git fetch origin
    git checkout deployment-vps
    git pull origin deployment-vps
fi
```

---

### 2.3 Buat File `.env` di Server
```bash
cat << 'EOF' > /home/graphelp/project/.env
DATABASE_URL=mysql+pymysql://graphelp:a811f8bfcce050c424ac1fc0594fa907@mysql-graphelp:3306/graphelp?charset=utf8mb4
SMTP_EMAIL=faizfirdausp@gmail.com
SMTP_PASSWORD=hagd wozq chbs yukz
EOF
```

---

### 2.4 Setup Virtual Environment Python & Install Dependensi
```bash
cd /home/graphelp/project

# 1. Buat venv Python 3.11
python3 -m venv .venv
source .venv/bin/activate

# 2. Upgrade pip
pip install --upgrade pip

# 3. Install PyTorch CPU (Wheel resmi CPU agar hemat disk & memori)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# 4. Install dependensi lainnya (FastAPI, PyMySQL, OpenCV Headless, Scikit-learn, dll.)
pip install -r requirements.txt
```

---

### 2.5 Build Frontend React di Server
```bash
cd /home/graphelp/project/frontend
npm install
npm run build
cd /home/graphelp/project
```

---

### 2.6 Buat Folder Upload Gambar
```bash
mkdir -p /home/graphelp/project/backend/uploads/handwriting
```

---

### 2.7 Matikan Web Server Default dan Jalankan Graphelp di Port 3000

Karena port 3000 adalah port yang langsung terhubung ke publik `https://lab1.trisakti.ac.id/graphelp/`:

```bash
# 1. Matikan python http.server bawaan yang saat ini sedang memakai port 3000:
pkill -f "http.server 3000"

# 2. Jalankan FastAPI (Uvicorn) di port 3000 di background:
cd /home/graphelp/project
source .venv/bin/activate
nohup uvicorn backend.app.main:app --host 0.0.0.0 --port 3000 > /home/graphelp/backend.log 2>&1 &
```

---

## Fase 3: Command Verifikasi & Testing

### 3.1 Periksa Log Backend
Pastikan server FastAPI mulai dengan sukses dan model AI dimuat:
```bash
tail -n 30 /home/graphelp/backend.log
```

### 3.2 Uji Akses Website di Browser
Buka browser Anda dan akses:
👉 **`https://lab1.trisakti.ac.id/graphelp/`**

Verifikasi:
* [x] Halaman beranda Graphelp termuat lengkap dengan styling CSS.
* [x] Navigasi ke halaman `/analyze`, `/student`, dan `/history`.
* [x] Coba fitur registrasi / login (tabel database otomatis dibuat oleh SQLAlchemy).
* [x] Coba unggah gambar tulisan tangan untuk analisis Enneagram & motorik.

---

## Fase 4: Command Maintenance & Update Cepat

Jika di kemudian hari Anda melakukan update kode di GitHub:

```bash
# 1. Masuk ke folder proyek dan tarik kode terbaru
cd /home/graphelp/project
git pull origin deployment-vps

# 2. Re-build frontend jika ada perubahan UI
cd frontend && npm run build && cd ..

# 3. Restart backend FastAPI
pkill -f "uvicorn backend.app.main:app"
source .venv/bin/activate
nohup uvicorn backend.app.main:app --host 0.0.0.0 --port 3000 > /home/graphelp/backend.log 2>&1 &

# 4. Pantau log terbaru
tail -f /home/graphelp/backend.log
```
