import os
import cv2
import numpy as np
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml_models", "model_kesimpulan_motorik.joblib")

_model_data = None

def get_model():
    global _model_data
    if _model_data is None:
        if os.path.exists(MODEL_PATH):
            _model_data = joblib.load(MODEL_PATH)
        else:
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    return _model_data

def extract_clinical_features_from_bytes(file_bytes: bytes):
    """
    Mengekstrak 5 fitur fisik klinis dari buffer citra lembar kerja.
    """
    bytes_arr = np.frombuffer(file_bytes, dtype=np.uint8)
    img = cv2.imdecode(bytes_arr, cv2.IMREAD_COLOR)
    if img is None:
        return None

    h, w = img.shape[:2]
    # Pangkas kop header 15% atas lembar kerja
    roi = img[int(h * 0.15):, :]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 25, 10)
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))

    ink_pixels = np.sum(cleaned > 0)
    if ink_pixels == 0:
        return None

    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    perim_sum, approx_sum, area_sum = 0.0, 0.0, 0.0
    cnt_valid = 0
    compactness_list = []

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 30:
            cnt_valid += 1
            perim = cv2.arcLength(cnt, True)
            approx = cv2.arcLength(cv2.approxPolyDP(cnt, 0.02 * perim, True), True)
            perim_sum += perim
            approx_sum += approx
            area_sum += area

            if perim > 0:
                compactness = (4 * np.pi * area) / (perim ** 2)
                compactness_list.append(compactness)

    ind1_tremor = float(perim_sum / approx_sum) if approx_sum > 0 else 1.0

    dist = cv2.distanceTransform(cleaned, cv2.DIST_L2, 3)
    widths = dist[dist > 0] * 2
    w_mean = float(np.mean(widths)) if len(widths) > 0 else 1.0
    w_std = float(np.std(widths)) if len(widths) > 0 else 0.0
    ind2_stroke_cv = float(w_std / w_mean) if w_mean > 0 else 0.0

    ink_grays = gray[cleaned > 0]
    ind2_gray_std = float(np.std(ink_grays)) if len(ink_grays) > 0 else 0.0

    ind3_compactness = float(np.mean(compactness_list)) if len(compactness_list) > 0 else 0.0
    ind4_fragmentation = float(cnt_valid / ((ink_pixels / 1000.0) + 1e-5))

    return {
        'ind1_tremor': ind1_tremor,
        'ind2_stroke_cv': ind2_stroke_cv,
        'ind2_gray_std': ind2_gray_std,
        'ind3_compactness': ind3_compactness,
        'ind4_fragmentation': ind4_fragmentation
    }

def predict_motorik_siswa(image_bytes: bytes, usia_bulan: float = 45.0):
    """
    Prediksi Asesmen Kematangan Motorik Halus Siswa:
    Output:
    - Kesimpulan: Sesuai Usia [Ya] vs Belum Sesuai [Tidak]
    - Status & Kategori (BB, MB, BSH, BSB)
    - Probabilitas Keyakinan AI
    - 4 Indikator Fisik Klinis
    - Alasan Klinis (Explainable AI) & Rekomendasi Guru
    """
    feats = extract_clinical_features_from_bytes(image_bytes)
    if feats is None:
        # Fallback jika gambar kosong / tidak terdeteksi coretan
        return {
            "kesimpulan": "Belum Sesuai [Tidak]",
            "status": "Coretan Tidak Terdeteksi",
            "kategori": "BB",
            "confidence": 0.0,
            "alasan_klinis": "Gambar tidak memiliki kontras yang cukup atau tidak ada goresan tinta yang terdeteksi.",
            "saran_guru": "Pastikan hasil foto atau scan lembar kerja cukup terang dan goresan pensil terlihat jelas.",
            "indikator": {
                "kontrol_pegangan": {"value": 1.0, "status": "Tidak Terdeteksi"},
                "konsistensi_tekanan": {"value": 0.0, "status": "Tidak Terdeteksi"},
                "koordinasi_geometri": {"value": 0.0, "status": "Tidak Terdeteksi"},
                "kontinuitas_garis": {"value": 0.0, "status": "Tidak Terdeteksi"}
            }
        }

    model_data = get_model()
    pipeline = model_data['pipeline']
    optimal_threshold = model_data.get('optimal_threshold', 0.544)

    # Susun vektor fitur: ['ind1_tremor', 'ind2_stroke_cv', 'ind2_gray_std', 'ind3_compactness', 'ind4_fragmentation', 'usia_bulan_num']
    vector = np.array([[
        feats['ind1_tremor'],
        feats['ind2_stroke_cv'],
        feats['ind2_gray_std'],
        feats['ind3_compactness'],
        feats['ind4_fragmentation'],
        float(usia_bulan) if usia_bulan > 0 else 45.0
    ]])

    prob_sesuai = float(pipeline.predict_proba(vector)[0, 1])
    is_sesuai = prob_sesuai >= optimal_threshold

    # Penentuan Kategori Motorik PAUD (Kemendikbud)
    if is_sesuai:
        kesimpulan = "Sesuai Usia [Ya]"
        status = "Perkembangan Sesuai / Mandiri"
        confidence = prob_sesuai * 100.0
        if prob_sesuai >= 0.88:
            kategori = "BSB"
            kategori_label = "Berkembang Sangat Baik"
        else:
            kategori = "BSH"
            kategori_label = "Berkembang Sesuai Harapan"

        alasan_klinis = "Anak sudah mampu mengontrol goresan alat tulis secara mandiri, stabil, dan tarikan garis kontinu sesuai tahapan usianya."
        saran_guru = "Pertahankan stimulasi dengan latihan menggambar bebas dan memperkaya ragam bentuk huruf/angka."
    else:
        kesimpulan = "Belum Sesuai [Tidak]"
        status = "Perlu Stimulasi Tambahan"
        confidence = (1.0 - prob_sesuai) * 100.0
        if prob_sesuai <= 0.30:
            kategori = "BB"
            kategori_label = "Belum Berkembang"
        else:
            kategori = "MB"
            kategori_label = "Mulai Berkembang"

        # Generate Explainable AI breakdown
        reasons = []
        if feats['ind1_tremor'] > 1.30:
            reasons.append("kontrol pegangan belum stabil (terdeteksi getaran/tremor garis)")
        if feats['ind4_fragmentation'] > 0.70:
            reasons.append("goresan garis sering terangkat atau putus-putus")
        if feats['ind2_stroke_cv'] > 0.52:
            reasons.append("tekanan pensil pada kertas belum konsisten")
        if feats['ind3_compactness'] < 0.24:
            reasons.append("koordinasi bentuk geometri pola belum terbentuk rapi")

        if reasons:
            alasan_klinis = f"Karena {', '.join(reasons)}."
        else:
            alasan_klinis = "Kontrol motorik halus anak masih dalam tahap awal pembentukan dan membutuhkan latihan rutin."

        saran_guru = "Berikan stimulasi berupa latihan meremas playdough/plastisin, menghubungkan titik garis putus-putus, serta melatih koordinasi jemari."

    # Breakdown 4 Indikator Fisik
    indikator = {
        "kontrol_pegangan": {
            "value": round(feats['ind1_tremor'], 2),
            "status": "Stabil" if feats['ind1_tremor'] <= 1.30 else "Kurang Stabil (Tremor)"
        },
        "konsistensi_tekanan": {
            "value": round(feats['ind2_stroke_cv'], 2),
            "status": "Konsisten" if feats['ind2_stroke_cv'] <= 0.52 else "Belum Merata"
        },
        "koordinasi_geometri": {
            "value": round(feats['ind3_compactness'], 2),
            "status": "Terkoordinasi" if feats['ind3_compactness'] >= 0.24 else "Perlu Latihan"
        },
        "kontinuitas_garis": {
            "value": round(feats['ind4_fragmentation'], 2),
            "status": "Kontinu" if feats['ind4_fragmentation'] <= 0.70 else "Sering Terputus"
        }
    }

    return {
        "kesimpulan": kesimpulan,
        "status": status,
        "kategori": kategori,
        "kategori_label": kategori_label,
        "confidence": round(confidence, 1),
        "alasan_klinis": alasan_klinis,
        "saran_guru": saran_guru,
        "indikator": indikator
    }
