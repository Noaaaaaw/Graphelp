import os
import cv2
import numpy as np
import joblib

# Lokasi Model Multi-Output Bagian III Resmi (PelatihanModel baru3010)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml_models", "model_baseline_4_fitur_bagian3.joblib")

_MODEL_PAYLOAD = None

def get_model():
    global _MODEL_PAYLOAD
    if _MODEL_PAYLOAD is None:
        if os.path.exists(MODEL_PATH):
            _MODEL_PAYLOAD = joblib.load(MODEL_PATH)
        else:
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    return _MODEL_PAYLOAD

def extract_clean_features_from_bytes(file_bytes: bytes, target_width: int = 1600):
    """
    Ekstraksi 4 Fitur Biomekanik OpenCV Standar Baru:
    1. cv_tremor (Rasio RDP arcLength vs approxPolyDP)
    2. cv_stroke_cv (Variasi Tebal Garis via Distance Transform)
    3. cv_compactness (Isoperimetric Quotient)
    4. cv_fragmentation (Pecahan Kontur per 1000 piksel tinta)
    Bebas crop buta 15% & bebas margin bayangan scanner 2.5%.
    """
    bytes_arr = np.frombuffer(file_bytes, dtype=np.uint8)
    img = cv2.imdecode(bytes_arr, cv2.IMREAD_COLOR)
    if img is None:
        return None

    h0, w0 = img.shape[:2]

    # 1. Bersihkan margin tepi bayangan scanner (2.5% keliling kertas)
    my, mx = int(h0 * 0.025), int(w0 * 0.025)
    img[:my, :] = 255
    img[h0 - my:, :] = 255
    img[:, :mx] = 255
    img[:, w0 - mx:] = 255

    # 2. Standarisasi resolusi lebar 1600 px
    th = int(round(h0 * (target_width / float(w0))))
    img_std = cv2.resize(img, (target_width, th), interpolation=cv2.INTER_AREA)

    gray = cv2.cvtColor(img_std, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(
        blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 25, 10
    )
    cleaned = cv2.morphologyEx(
        thresh, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    )

    ink_px = int(np.sum(cleaned > 0))
    if ink_px == 0:
        return None

    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    valid_contours = [c for c in contours if cv2.contourArea(c) > 25]

    perim_sum, approx_sum = 0.0, 0.0
    comp_list = []
    for c in valid_contours:
        a = cv2.contourArea(c)
        p = cv2.arcLength(c, True)
        ap = cv2.arcLength(cv2.approxPolyDP(c, 0.02 * p, True), True)
        perim_sum += p
        approx_sum += ap
        if p > 0:
            comp_list.append((4.0 * np.pi * a) / (p ** 2))

    cv_tremor = float(perim_sum / approx_sum) if approx_sum > 0 else 1.0

    dist = cv2.distanceTransform(cleaned, cv2.DIST_L2, 3)
    widths = dist[dist > 0] * 2.0
    w_mean = float(np.mean(widths)) if len(widths) > 0 else 1.0
    w_std = float(np.std(widths)) if len(widths) > 0 else 0.0
    cv_stroke_cv = float(w_std / w_mean) if w_mean > 0 else 0.0

    cv_compactness = float(np.mean(comp_list)) if comp_list else 0.0
    cv_fragmentation = float(len(valid_contours) / ((ink_px / 1000.0) + 1e-5))

    return {
        "cv_tremor": round(cv_tremor, 4),
        "cv_stroke_cv": round(cv_stroke_cv, 4),
        "cv_compactness": round(cv_compactness, 4),
        "cv_fragmentation": round(cv_fragmentation, 4)
    }

def predict_motorik_siswa(image_bytes: bytes, usia_bulan: float = 45.0):
    """
    Prediksi Asesmen Kematangan Motorik Halus Siswa (Multi-Output Bagian III):
    1. Kemampuan Menulis Sesuai Usia: Ya / Tidak
    2. Kemampuan Menggambar Sesuai Usia: Ya / Tidak
    Murni keluaran model Machine Learning tanpa heuristik tabel BB-BSB.
    """
    feats = extract_clean_features_from_bytes(image_bytes)
    if feats is None:
        return {
            "kesimpulan": "Belum Sesuai [Tidak]",
            "status": "Coretan Tidak Terdeteksi",
            "kategori": "Tidak Terdeteksi",
            "kategori_label": "Coretan Belum Terdeteksi",
            "confidence": 0.0,
            "alasan_klinis": "Gambar tidak memiliki kontras yang cukup atau goresan alat tulis tidak terdeteksi.",
            "saran_guru": "Pastikan foto atau scan lembar kerja cukup terang dan goresan pensil terlihat jelas.",
            "kesimpulan_menulis": {
                "sesuai": False,
                "jawaban": "Tidak",
                "confidence": 0.0,
                "alasan": "Coretan lembar kerja tidak terdeteksi dengan jelas."
            },
            "kesimpulan_menggambar": {
                "sesuai": False,
                "jawaban": "Tidak",
                "confidence": 0.0,
                "alasan": "Coretan lembar kerja tidak terdeteksi dengan jelas."
            },
            "indikator": {},
            "indikator_klinis_table": [],
            "fitur_fisik_opencv": {
                "cv_tremor": 0.0,
                "cv_stroke_cv": 0.0,
                "cv_compactness": 0.0,
                "cv_fragmentation": 0.0,
                "usia_bulan": float(usia_bulan) if usia_bulan > 0 else 45.0
            }
        }

    payload = get_model()
    pipeline = payload["pipeline"]

    vector = np.array([[
        feats["cv_tremor"],
        feats["cv_stroke_cv"],
        feats["cv_compactness"],
        feats["cv_fragmentation"],
        float(usia_bulan) if usia_bulan > 0 else 45.0
    ]])

    pred = pipeline.predict(vector)[0]           # [pred_menulis, pred_menggambar]
    probs = pipeline.predict_proba(vector)       # list probabilities [prob_menulis, prob_menggambar]

    prob_w = float(probs[0][0, 1])
    prob_d = float(probs[1][0, 1])

    is_ya_w = bool(pred[0] == 1)
    is_ya_d = bool(pred[1] == 1)

    conf_w = round((prob_w if is_ya_w else (1.0 - prob_w)) * 100.0, 1)
    conf_d = round((prob_d if is_ya_d else (1.0 - prob_d)) * 100.0, 1)

    alasan_w = (
        "Anak sudah mampu mengontrol pegangan alat tulis dengan stabil dan meniru goresan huruf sesuai usianya."
        if is_ya_w else
        "Kontrol pegangan alat tulis belum stabil dan tarikan goresan garis belum konsisten sesuai usianya."
    )
    alasan_d = (
        "Koordinasi mata dan tangan anak sudah mampu membentuk goresan gambar terkontrol sesuai usianya."
        if is_ya_d else
        "Koordinasi visual-motorik dalam pembentukan pola objek gambar masih memerlukan latihan terarah."
    )

    is_sesuai_umum = is_ya_w or is_ya_d
    if is_ya_w and is_ya_d:
        status_umum = "Sesuai Usia (Menulis & Menggambar)"
        saran_guru = "Pertahankan stimulasi dengan latihan menggambar bebas dan memperkaya ragam bentuk huruf/angka."
    elif is_ya_w:
        status_umum = "Sesuai Menulis (Perlu Latihan Menggambar)"
        saran_guru = "Berikan stimulasi berupa latihan menggambar bentuk geometris dan eksplorasi warna secara terbimbing."
    elif is_ya_d:
        status_umum = "Sesuai Menggambar (Perlu Latihan Menulis)"
        saran_guru = "Berikan stimulasi berupa latihan meremas playdough serta menghubungkan garis titik putus-putus pembentuk huruf."
    else:
        status_umum = "Perlu Pendampingan Latihan Motorik"
        saran_guru = "Berikan stimulasi bertahap: latihan meremas plastisin, meronce, dan menebalkan garis pola sederhana bersama guru/orang tua."

    return {
        "kesimpulan": "Sesuai Usia [Ya]" if is_sesuai_umum else "Belum Sesuai [Tidak]",
        "status": status_umum,
        "kategori": "Sesuai" if is_sesuai_umum else "Perlu Latihan",
        "kategori_label": status_umum,
        "confidence": conf_w,
        "alasan_klinis": f"Menulis: {alasan_w} Menggambar: {alasan_d}",
        "saran_guru": saran_guru,
        "kesimpulan_menulis": {
            "sesuai": is_ya_w,
            "jawaban": "Ya" if is_ya_w else "Tidak",
            "confidence": conf_w,
            "alasan": alasan_w
        },
        "kesimpulan_menggambar": {
            "sesuai": is_ya_d,
            "jawaban": "Ya" if is_ya_d else "Tidak",
            "confidence": conf_d,
            "alasan": alasan_d
        },
        "indikator": {},
        "indikator_klinis_table": [],
        "fitur_fisik_opencv": {
            "cv_tremor": feats["cv_tremor"],
            "cv_stroke_cv": feats["cv_stroke_cv"],
            "cv_compactness": feats["cv_compactness"],
            "cv_fragmentation": feats["cv_fragmentation"],
            "usia_bulan": float(usia_bulan) if usia_bulan > 0 else 45.0
        }
    }
