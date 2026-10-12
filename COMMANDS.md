# Panduan Command Deployment Graphelp ke VPS

Dokumen ini berisi daftar lengkap instruksi dan command terminal terurut yang akan dieksekusi selama proses deployment aplikasi **Graphelp** (Backend FastAPI + PyTorch CPU, Database MySQL, dan Frontend React) ke VPS. 

Dokumen ini bersanding dan mengacu langsung pada arsitektur di [DEPLOYMENT_PLAN.md](file:///c:/Users/faiz/Documents/tgstgs/Semester%207/Graphelp/DEPLOYMENT_PLAN.md).

---

## DAFTAR ISI

1. [Fase 1: Command Persiapan Kode Lokal (Branch `deployment-vps`)](#fase-1-command-persiapan-kode-lokal)
2. [Fase 2: Command Setup Awal Server VPS](#fase-2-command-setup-awal-server-vps)
3. [Fase 3: Command Setup Database MySQL](#fase-3-command-setup-database-mysql)
4. [Fase 4: Command Clone & Build Aplikasi (Docker Compose)](#fase-4-command-clone--build-aplikasi-docker-compose)
5. [Fase 5: Command Nginx Reverse Proxy & SSL Let's Encrypt (HTTPS)](#fase-5-command-nginx-reverse-proxy--ssl-lets-encrypt-https)
6. [Fase 6: Command Verifikasi & Smoke Testing](#fase-6-command-verifikasi--smoke-testing)
7. [Fase 7: Command Maintenance, Update Kode, & Troubleshooting](#fase-7-command-maintenance-update-kode--troubleshooting)

---

## Fase 1: Command Persiapan Kode Lokal

Command ini dijalankan di mesin lokal (komputer kerja) untuk memastikan kode siap dan terunggah ke GitHub pada branch `deployment-vps`.

### 1.1 Verifikasi Branch Aktif
```bash
git branch
# Pastikan output menampilkan: * deployment-vps
```

### 1.2 Simpan dan Commit Perubahan Konfigurasi
Setelah file penyesuaian MySQL (`models.py`), dependensi (`requirements.txt`), `.gitignore`, sentralisasi API Frontend, dan Dockerfile dibuat:
```bash
git add .
git commit -m "feat(deploy): penyesuaian mysql models, requirements vps, api url frontend, dan docker compose"
```

### 1.3 Push ke Remote Repository
```bash
git push -u origin deployment-vps
```

---

## Fase 2: Command Setup Awal Server VPS

Command ini dijalankan di terminal VPS (Ubuntu 22.04 / 24.04 LTS).

### 2.1 Update & Upgrade Sistem Operasi
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git ufw htop
```

### 2.2 Alokasi Swap Memory (Wajib untuk PyTorch CPU)
Mencegah server mengalami *Out of Memory (OOM Killer)* saat memuat EfficientNet-B0:
```bash
# 1. Buat file swap sebesar 3 GB
sudo fallocate -l 3G /swapfile

# 2. Atur hak akses file swap
sudo chmod 600 /swapfile

# 3. Format dan aktifkan swap
sudo mkswap /swapfile
sudo swapon /swapfile

# 4. Tambahkan ke /etc/fstab agar swap otomatis aktif saat reboot
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 5. Verifikasi swap aktif
free -h
```

### 2.3 Konfigurasi Firewall UFW
Mengamankan port server agar hanya membuka port SSH, HTTP, dan HTTPS:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

### 2.4 Install Docker Engine & Docker Compose Plugin
```bash
# Unduh dan jalankan skrip instalasi resmi Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Berikan akses Docker ke user saat ini (agar tidak perlu sudo terus menerus)
sudo usermod -aG docker $USER

# Terapkan perubahan grup user
newgrp docker

# Verifikasi instalasi Docker
docker --version
docker compose version
```

---

## Fase 3: Command Setup Database MySQL

Pilih salah satu metode database yang diinginkan:

### Opsi A: MySQL Dikelola via Docker Compose (Direkomendasikan - Otomatis)
Jika menggunakan opsi ini, database MySQL akan otomatis dijalankan oleh `docker compose up` bersama backend. Data disimpan di Docker volume `mysql_data`. Tidak perlu install MySQL manual di host VPS.

---

### Opsi B: MySQL Server Native di Host VPS
Jika Anda ingin MySQL terpasang langsung di sistem Ubuntu VPS:

```bash
# 1. Install MySQL Server
sudo apt install -y mysql-server
sudo systemctl enable --now mysql

# 2. Buat Database dan User Khusus Graphelp
sudo mysql -e "CREATE DATABASE graphelp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'graphelp_user'@'localhost' IDENTIFIED BY 'PasswordRahasiaGraphelp123!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON graphelp_db.* TO 'graphelp_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 3. Verifikasi login user database
mysql -u graphelp_user -p'PasswordRahasiaGraphelp123!' -e "SHOW DATABASES;"
```

---

## Fase 4: Command Clone & Build Aplikasi (Docker Compose)

### 4.1 Clone Repository ke Direktori `/opt/graphelp`
```bash
# Buat folder dan beri hak akses
sudo mkdir -p /opt/graphelp
sudo chown -R $USER:$USER /opt/graphelp

# Clone khusus branch deployment-vps
git clone -b deployment-vps https://github.com/Noaaaaaw/Graphelp.git /opt/graphelp
cd /opt/graphelp
```

### 4.2 Siapkan File Environment Backend (`backend/.env`)
```bash
cat << 'EOF' > backend/.env
DATABASE_URL=mysql+pymysql://graphelp_user:PasswordRahasiaGraphelp123!@mysql:3306/graphelp_db?charset=utf8mb4
SMTP_EMAIL=faizfirdausp@gmail.com
SMTP_PASSWORD=hagd wozq chbs yukz
EOF
```
*(Catatan: Jika memakai MySQL di host Ubuntu luar Docker, ganti host `@mysql:3306` menjadi `@host.docker.internal:3306` atau IP lokal VPS).*

### 4.3 Siapkan Direktori Uploads Persisten
```bash
mkdir -p backend/uploads/handwriting
chmod -R 777 backend/uploads
```

### 4.4 Build dan Nyalakan Seluruh Container
```bash
# Build image backend dan frontend
docker compose build

# Jalankan container di background (detached mode)
docker compose up -d

# Periksa container yang sedang berjalan
docker compose ps
```

---

## Fase 5: Command Nginx Reverse Proxy & SSL Let's Encrypt (HTTPS)

Langkah ini menghubungkan domain Anda ke container aplikasi dan mengaktifkan sertifikat SSL gratis.

### 5.1 Install Nginx & Certbot di VPS Host
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 5.2 Buat Konfigurasi Reverse Proxy Nginx
Buat file konfigurasi di `/etc/nginx/sites-available/graphelp`:
```bash
sudo bash -c 'cat << "EOF" > /etc/nginx/sites-available/graphelp
server {
    listen 80;
    server_name domainanda.com www.domainanda.com;

    client_max_body_size 50M;

    # Frontend React
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend FastAPI & Endpoint Uploads
    location ~ ^/(analyze-handwriting|analyze-students|analysis-history|send-otp-register|register-with-otp|login|forgot-password|uploads) {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
EOF'
```
*(Ganti `domainanda.com` dengan domain atau subdomain Anda).*

### 5.3 Aktifkan Konfigurasi & Reload Nginx
```bash
sudo ln -sf /etc/nginx/sites-available/graphelp /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5.4 Pasang Sertifikat SSL Gratis (Let's Encrypt)
```bash
sudo certbot --nginx -d domainanda.com -d www.domainanda.com --non-interactive --agree-tos -m faizfirdausp@gmail.com
```

---

## Fase 6: Command Verifikasi & Smoke Testing

### 6.1 Cek Log Backend
Memastikan model EfficientNet-B0 dan tabel database berhasil dimuat tanpa error:
```bash
docker compose logs backend --tail=50
```

### 6.2 Test Endpoint Health / API langsung dari VPS
```bash
# Test response endpoint docs FastAPI
curl -I http://localhost:8000/docs
```

### 6.3 Test Status Tabel Database MySQL
```bash
# Masuk ke container database untuk melihat tabel yang digenerate SQLAlchemy
docker compose exec db mysql -u graphelp_user -p'PasswordRahasiaGraphelp123!' graphelp_db -e "SHOW TABLES; DESCRIBE users;"
```

---

## Fase 7: Command Maintenance, Update Kode, & Troubleshooting

### 7.1 Cara Menarik Update Kode Terbaru dari GitHub (Redeploy Cepat)
Jika di kemudian hari ada pembaruan kode di GitHub:
```bash
cd /opt/graphelp
git pull origin deployment-vps
docker compose up -d --build
```

### 7.2 Cara Memantau Pemakaian RAM & CPU Real-time
```bash
# Pantau resource seluruh container Docker
docker stats

# Pantau memori dan swap server
free -h
```

### 7.3 Cara Membaca Log Kesalahan (Debug)
```bash
# Log backend FastAPI
docker compose logs -f backend

# Log Nginx server
sudo tail -f /var/log/nginx/error.log
```

### 7.4 Cara Mematikan dan Menyalakan Ulang Aplikasi
```bash
cd /opt/graphelp

# Restart seluruh service
docker compose restart

# Stop total
docker compose down

# Start kembali
docker compose up -d
```

### 7.5 Backup Database MySQL Berkala
```bash
# Simpan dump database ke file SQL
docker compose exec db mysqldump -u graphelp_user -p'PasswordRahasiaGraphelp123!' graphelp_db > backup_graphelp_$(date +%F).sql
```
