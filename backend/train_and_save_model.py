import os
import cv2
import numpy as np
import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
KUIS_DIR = os.path.join(DATASET_DIR, "Kuisioner Guru Kb Avicenna")
IMG_DIR = os.path.join(DATASET_DIR, "images")
ML_MODELS_DIR = os.path.join(BASE_DIR, "backend", "ml_models")
os.makedirs(ML_MODELS_DIR, exist_ok=True)

def extract_clinical_features(image_path_or_buffer):
    """
    Ekstraksi 5 Indikator Fisik Klinis Motorik Halus (Bagian I Formulir Guru):
    1. ind1_tremor: Rasio getaran kontur (RDP arcLength vs approxPolyDP)
    2. ind2_stroke_cv: Variasi ketebalan goresan via Distance Transform
    3. ind2_gray_std: Fluktuasi kepekatan warna/tekanan pensil
    4. ind3_compactness: Keteraturan bentuk geometri (4*pi*area/perim^2)
    5. ind4_fragmentation: Tingkat garis putus-putus per luas tinta
    """
    if isinstance(image_path_or_buffer, str):
        img = cv2.imread(image_path_or_buffer)
    else:
        # Buffer / byte stream
        bytes_data = np.asarray(bytearray(image_path_or_buffer.read()), dtype=np.uint8)
        img = cv2.imdecode(bytes_data, cv2.IMREAD_COLOR)

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

def main():
    print("Memuat dataset pemetaan & kuisioner...")
    path_map = os.path.join(KUIS_DIR, "pemetaan_gambar_ke_kuisioner.csv")
    path_rekap = os.path.join(KUIS_DIR, "rekap_validasi_kuisioner_guru.csv")

    df_map = pd.read_csv(path_map)
    df_rekap = pd.read_csv(path_rekap)

    df_map['match_key'] = df_map['nama_anak'].replace({'Sashi': 'Sasi'})
    rekap_cols = ['nama_anak_dataset', 'sesuai_menulis', 'skor_ind1_pegangan', 'skor_ind2_tekanan', 'skor_ind3_koordinasi', 'skor_ind4_garis']
    df_rekap_clean = df_rekap[df_rekap['nama_anak_dataset'] != 'TIDAK ADA'].drop_duplicates(subset=['nama_anak_dataset']).copy()

    df_merged = pd.merge(df_map, df_rekap_clean[rekap_cols], left_on='match_key', right_on='nama_anak_dataset', how='left')
    df_merged['target_menulis_biner'] = df_merged['sesuai_menulis'].map({'Ya': 1, 'Tidak': 0})

    # Ekstraksi fitur untuk berkas yang cocok
    features_list = []
    for idx, row in df_merged.iterrows():
        img_name = row['image_file']
        img_path = os.path.join(IMG_DIR, img_name)
        if os.path.exists(img_path):
            feats = extract_clinical_features(img_path)
            if feats:
                feats['image_file'] = img_name
                features_list.append(feats)

    df_feats = pd.DataFrame(features_list)
    df_dataset = pd.merge(df_merged, df_feats, on='image_file', how='inner')
    df_dataset['usia_bulan_num'] = pd.to_numeric(df_dataset['usia_bulan'].replace('-', np.nan), errors='coerce').fillna(45.0)

    feature_cols = ['ind1_tremor', 'ind2_stroke_cv', 'ind2_gray_std', 'ind3_compactness', 'ind4_fragmentation', 'usia_bulan_num']

    # Filter 33 data berlabel asli
    df_train = df_dataset[df_dataset['status'] == 'MATCHED'].copy().reset_index(drop=True)
    X = df_train[feature_cols].values
    y = df_train['target_menulis_biner'].astype(int).values

    print(f"Melatih model Shrinkage LDA pada {len(df_train)} data berlabel...")
    pipeline = Pipeline([
        ('scaler', RobustScaler()),
        ('clf', LinearDiscriminantAnalysis(solver='lsqr', shrinkage='auto'))
    ])
    pipeline.fit(X, y)

    # Optimal threshold dari Youden's J Index di notebook: 0.544
    optimal_threshold = 0.5440419526157325

    model_payload = {
        'model_name': 'Shrinkage LDA (Ledoit-Wolf)',
        'pipeline': pipeline,
        'optimal_threshold': optimal_threshold,
        'feature_cols': feature_cols,
        'target_classes': {0: 'Belum Sesuai (Tidak)', 1: 'Sesuai Usia (Ya)'}
    }

    target_model_path = os.path.join(ML_MODELS_DIR, "model_kesimpulan_motorik.joblib")
    joblib.dump(model_payload, target_model_path)
    print(f"Model berhasil disimpan ke: {target_model_path}")

    # Verifikasi langsung inference
    test_x = X[0:2]
    probs = pipeline.predict_proba(test_x)[:, 1]
    print(f"Verifikasi Probabilitas: {probs}")
    print("Selesai dengan sukses!")

if __name__ == "__main__":
    main()
