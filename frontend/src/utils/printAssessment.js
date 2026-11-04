import graphelpLogo from "../assets/Graphelp.png";
import { getApiUrl } from "../config/api";

const KATEGORI_META = {
    BSB: {
        label: "Berkembang Sangat Baik",
        badgeBg: "#1d4ed8",
        titleColor: "#0d3b9e",
        cardBg: "#eff6ff",
        cardBorder: "#bfdbfe",
        dividerColor: "#dbeafe",
        barTrack: "#dbeafe",
        barFill: "#1d4ed8",
        getSummary: (name) =>
            `${name} sudah mampu mengontrol pensil dengan stabil. Garis yang dibuat lancar, tekanan merata, dan bentuk pola tergambar rapi sesuai tahap usianya.`,
        guruTips: [
            "Beri tantangan menggambar bebas dan pola yang lebih rumit.",
            "Perkenalkan bentuk huruf dan angka secara bertahap.",
            "Variasikan alat tulis (krayon, spidol, pensil warna).",
        ],
        ortuTips: [
            "Ajak menggambar atau mewarnai bersama 10-15 menit sehari.",
            "Sediakan kegiatan meronce, menempel, dan menggunting.",
            "Puji usahanya, bukan hanya hasilnya.",
        ],
    },
    BSH: {
        label: "Berkembang Sesuai Harapan",
        badgeBg: "#15803d",
        titleColor: "#166534",
        cardBg: "#f0fdf4",
        cardBorder: "#bbf7d0",
        dividerColor: "#dcfce7",
        barTrack: "#dcfce7",
        barFill: "#16a34a",
        getSummary: (name) =>
            `${name} sudah mampu mengontrol alat tulis dengan baik. Goresan garis cukup stabil, tekanan terkendali, dan bentuk pola sesuai tahap usianya.`,
        guruTips: [
            "Latih konsistensi tarikan garis lengkung, zig-zag, dan pola geometri.",
            "Kenalkan latihan menebalkan huruf dan angka sederhana.",
            "Variasikan media gambar untuk memperkuat koordinasi mata-tangan.",
        ],
        ortuTips: [
            "Dampingi kegiatan menggambar dan mewarnai rutin 10-15 menit sehari.",
            "Ajak anak bermain melipat kertas (origami sederhana) dan menggunting pola.",
            "Berikan apresiasi atas ketekunan dan kerapian goresan anak.",
        ],
    },
    MB: {
        label: "Mulai Berkembang",
        badgeBg: "#d97706",
        titleColor: "#b45309",
        cardBg: "#fffbeb",
        cardBorder: "#fde68a",
        dividerColor: "#fef3c7",
        barTrack: "#fef3c7",
        barFill: "#d97706",
        getSummary: (name) =>
            `Kemampuan motorik halus ${name} mulai berkembang, namun kestabilan pegangan pensil dan kelancaran tarikan garis masih memerlukan latihan terarah.`,
        guruTips: [
            "Berikan latihan menghubungkan titik-titik (tracing) garis lurus dan lengkung.",
            "Gunakan alat tulis berukuran agak besar (krayon/pensil segitiga) agar mudah digenggam.",
            "Lakukan pemanasan jari sebelum menulis (meremas plastisin/playdough).",
        ],
        ortuTips: [
            "Sediakan permainan meremas playdough, menjepit jemuran, atau memindahkan biji-bijian.",
            "Ajak anak mencoret-coret bebas dan menebalkan garis sederhana selama 10 menit sehari.",
            "Hindari memaksa anak; bangun suasana bermain yang menyenangkan.",
        ],
    },
    BB: {
        label: "Belum Berkembang",
        badgeBg: "#dc2626",
        titleColor: "#991b1b",
        cardBg: "#fef2f2",
        cardBorder: "#fecaca",
        dividerColor: "#fee2e2",
        barTrack: "#fee2e2",
        barFill: "#dc2626",
        getSummary: (name) =>
            `Kontrol motorik halus ${name} masih dalam tahap awal pembentukan. Pegangan alat tulis dan koordinasi goresan membutuhkan stimulasi otot jari secara rutin.`,
        guruTips: [
            "Fokuskan pada penguatan otot tangan melalui meremas spons, playdough, atau kertas.",
            "Mulai dengan menjiplak garis tebal menggunakan krayon besar atau jari (finger painting).",
            "Dampingi posisi pegangan tiga jari (tripod grasp) secara bertahap.",
        ],
        ortuTips: [
            "Latih kekuatan jari anak lewat aktivitas sehari-hari (membuka tutup botol, mengancing baju).",
            "Ajak bermain meronce manik besar, menyusun balok, dan mencoret bebas di kertas besar.",
            "Puji setiap kemajuan kecil agar kepercayaan diri anak tumbuh.",
        ],
    },
};

const INDICATOR_DESCRIPTIONS = {
    1: {
        title: "Kontrol Pegangan",
        descByLevel: {
            BSB: "Garis tidak bergetar saat menulis; pensil dipegang dengan stabil.",
            BSH: "Pegangan pensil cukup stabil dengan sedikit getaran halus.",
            MB: "Pegangan pensil masih tampak kaku atau sesekali bergetar.",
            BB: "Pegangan alat tulis belum stabil; terdeteksi getaran (tremor) pada garis.",
        },
    },
    2: {
        title: "Tekanan Goresan",
        descByLevel: {
            BSB: "Goresan tidak terlalu tipis maupun tebal; tekanan merata.",
            BSH: "Tekanan alat tulis pada kertas cukup konsisten dan terbaca jelas.",
            MB: "Tekanan goresan belum merata (kadang terlalu tipis atau terlalu tebal).",
            BB: "Tekanan pensil pada kertas masih sangat lemah atau belum terkontrol.",
        },
    },
    3: {
        title: "Koordinasi Bentuk",
        descByLevel: {
            BSB: "Mampu menyalin atau menggambar pola dengan rapi.",
            BSH: "Mampu mengikuti bentuk pola dasar dengan proporsi cukup baik.",
            MB: "Bentuk pola mulai terlihat namun proporsi belum konsisten.",
            BB: "Koordinasi mata-tangan dalam membentuk pola geometri masih perlu dilatih.",
        },
    },
    4: {
        title: "Kelancaran Garis",
        descByLevel: {
            BSB: "Menarik garis lurus tanpa banyak jeda atau terputus.",
            BSH: "Tarikan garis cukup lancar dengan sedikit jeda.",
            MB: "Garis masih beberapa kali terputus atau berhenti di tengah tarikan.",
            BB: "Tarikan garis sering terangkat atau terputus-putus.",
        },
    },
};

function formatIndonesianDate(input) {
    if (!input) {
        return new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }
    const raw = String(input).trim();
    const normalized = raw.includes(" ") && !raw.includes("T") ? raw.replace(" ", "T") : raw;
    const parsed = new Date(normalized);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }
    const datePart = raw.split(" ")[0];
    const parts = datePart.split("-");
    if (parts.length === 3) {
        const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        if (!Number.isNaN(dt.getTime())) {
            return dt.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        }
    }
    return raw;
}

function formatUsiaDetail(ageVal) {
    const num = parseFloat(ageVal);
    if (Number.isNaN(num) || num <= 0) return "-";
    const years = Math.floor(num / 12);
    const months = Math.floor(num % 12);
    const decStr = String(Number(num.toFixed(1))).replace(".", ",");
    if (years > 0) {
        return `${years} th ${months} bln (${decStr} bulan)`;
    }
    return `${months} bln (${decStr} bulan)`;
}

function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function handlePrintStudentPDF(res, schoolName, gradeClass) {
    if (!res) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        alert("Pop-up diblokir browser. Harap izinkan pop-up untuk mencetak atau menyimpan dokumen PDF.");
        return;
    }

    const isYa = Boolean(res.kesimpulan?.includes("Ya") || res.kesimpulan_menulis?.sesuai);
    const rawName = res.student_name || res.name || "Siswa";
    const studentName = String(rawName).replace(/^No\.\s*\d+\s*-\s*/i, "").trim() || "Siswa";
    const ageVal = res.age_months ?? res.age;
    const usiaFormatted = formatUsiaDetail(ageVal);
    const genderFormatted =
        res.gender === "L" ? "Laki-laki" : res.gender === "P" ? "Perempuan" : res.gender || "-";

    const tanggalAsesmen = formatIndonesianDate(res.created_at || res.tanggal);
    const tanggalCetak = formatIndonesianDate(new Date());

    const yearNow = new Date().getFullYear();
    const reportSeq = res.id || res.assessment_id || res.sequence_number || 1;
    const reportNumber = `GH-${yearNow}-${String(reportSeq).padStart(4, "0")}`;

    const kategoriKey = ["BSB", "BSH", "MB", "BB"].includes(res.kategori)
        ? res.kategori
        : isYa
        ? "BSH"
        : "MB";
    const katMeta = KATEGORI_META[kategoriKey] || KATEGORI_META.MB;
    const kategoriLabel = res.kategori_label || katMeta.label;

    const confNum = Math.max(0, Math.min(100, Number(res.confidence) || 0));
    const confFormatted = `${String(Number(confNum.toFixed(1))).replace(".", ",")}%`;

    const logoSrc = new URL(graphelpLogo, window.location.origin).href;
    const rawImgPath = res.image_url || res.image_path || "";
    const worksheetImgUrl = rawImgPath ? getApiUrl(rawImgPath) : "";

    const rawIndTable = Array.isArray(res.indikator_klinis_table) && res.indikator_klinis_table.length > 0
        ? res.indikator_klinis_table
        : [
              { no: 1, level: kategoriKey },
              { no: 2, level: kategoriKey },
              { no: 3, level: kategoriKey },
              { no: 4, level: kategoriKey },
          ];

    const indicatorRows = [1, 2, 3, 4].map((no, idx) => {
        const found = rawIndTable[idx] || {};
        const rawLevel = String(found.level || found.kategori || found.capaian || kategoriKey).toUpperCase();
        const level = ["BB", "MB", "BSH", "BSB"].includes(rawLevel) ? rawLevel : kategoriKey;
        const meta = INDICATOR_DESCRIPTIONS[no];
        return {
            no,
            title: meta.title,
            desc: meta.descByLevel[level] || meta.descByLevel.BSB,
            level,
        };
    });

    const summaryParagraph = katMeta.getSummary(studentName);

    const menulisSesuai = res.kesimpulan_menulis?.sesuai !== undefined ? Boolean(res.kesimpulan_menulis.sesuai) : isYa;
    const menggambarSesuai = res.kesimpulan_menggambar?.sesuai !== undefined ? Boolean(res.kesimpulan_menggambar.sesuai) : isYa;

    const menulisText = menulisSesuai
        ? "Sesuai usia. Goresan stabil dan kontinu."
        : "Belum sesuai usia. Perlu latihan kestabilan goresan.";
    const menggambarText = menggambarSesuai
        ? "Sesuai usia. Koordinasi mata-tangan baik."
        : "Belum sesuai usia. Perlu latihan koordinasi pola.";

    const pillActiveColor = (lvl) => {
        if (lvl === "BSB") return "#1d4ed8";
        if (lvl === "BSH") return "#15803d";
        if (lvl === "MB") return "#d97706";
        return "#dc2626";
    };

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Asesmen Motorik Halus - ${escapeHtml(studentName)}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        html, body {
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
            font-family: 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
        }
        .page {
            width: 210mm;
            height: 297mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: #ffffff;
            overflow: hidden;
        }
        /* HEADER BAR */
        .top-header {
            background: #0b3591;
            color: #ffffff;
            padding: 14px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .brand-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .brand-logo {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: contain;
            background: transparent;
            flex-shrink: 0;
        }
        .brand-title {
            font-size: 20pt;
            font-weight: 800;
            letter-spacing: -0.3px;
            line-height: 1.05;
            margin: 0;
            color: #ffffff;
        }
        .brand-subtitle {
            font-size: 8.5pt;
            color: #bfdbfe;
            margin: 3px 0 0 0;
            font-weight: 400;
        }
        .report-meta {
            text-align: right;
            line-height: 1.3;
        }
        .report-meta-label {
            font-size: 7.5pt;
            color: #bfdbfe;
        }
        .report-meta-no {
            font-size: 11pt;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 0.3px;
        }
        .report-meta-date {
            font-size: 8pt;
            color: #dbeafe;
            margin-top: 1px;
        }

        /* MAIN BODY */
        .main-content {
            flex: 1;
            padding: 14px 28px 10px 28px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* DOC TITLE */
        .doc-title-block {
            text-align: center;
            margin-bottom: 10px;
        }
        .doc-title {
            font-size: 13.5pt;
            font-weight: 800;
            color: #0b3591;
            margin: 0;
            letter-spacing: 0.4px;
            text-transform: uppercase;
        }
        .doc-subtitle {
            font-size: 8.5pt;
            color: #64748b;
            margin: 3px 0 0 0;
        }

        /* IDENTITY GRID */
        .identity-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 9px 16px;
            display: grid;
            grid-template-columns: 1.15fr 1.15fr 0.9fr;
            gap: 8px 16px;
            margin-bottom: 10px;
        }
        .id-item-label {
            font-size: 6.8pt;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 1px;
        }
        .id-item-val {
            font-size: 9.5pt;
            font-weight: 700;
            color: #0f172a;
        }

        /* SUMMARY + WORKSHEET ROW */
        .hero-row {
            display: grid;
            grid-template-columns: 1.42fr 1fr;
            gap: 12px;
            margin-bottom: 11px;
        }
        .summary-card {
            background: ${katMeta.cardBg};
            border: 1px solid ${katMeta.cardBorder};
            border-radius: 10px;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .summary-top {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .kat-circle {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: ${katMeta.badgeBg};
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18pt;
            font-weight: 800;
            flex-shrink: 0;
            letter-spacing: 0.5px;
        }
        .summary-text-col {
            flex: 1;
        }
        .summary-eyebrow {
            font-size: 6.8pt;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .summary-kat-title {
            font-size: 12.5pt;
            font-weight: 800;
            color: ${katMeta.titleColor};
            margin: 1px 0 4px 0;
        }
        .age-status-pill {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: 7.8pt;
            font-weight: 700;
            background: ${isYa ? "#dcfce7" : "#fee2e2"};
            color: ${isYa ? "#15803d" : "#b91c1c"};
            margin-bottom: 6px;
        }
        .summary-desc {
            font-size: 8.2pt;
            color: #1e293b;
            line-height: 1.38;
            margin: 0;
        }
        .confidence-row {
            border-top: 1px solid ${katMeta.dividerColor};
            margin-top: 9px;
            padding-top: 7px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .confidence-label {
            font-size: 7.6pt;
            color: #64748b;
            white-space: nowrap;
        }
        .confidence-track {
            flex: 1;
            height: 6px;
            background: ${katMeta.barTrack};
            border-radius: 999px;
            overflow: hidden;
        }
        .confidence-fill {
            width: ${confNum}%;
            height: 100%;
            background: ${katMeta.barFill};
            border-radius: 999px;
        }
        .confidence-val {
            font-size: 8.2pt;
            font-weight: 800;
            color: ${katMeta.titleColor};
            white-space: nowrap;
        }

        /* WORKSHEET CARD */
        .worksheet-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
        }
        .worksheet-title {
            font-size: 7.2pt;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 6px;
        }
        .worksheet-frame {
            border: 1.5px dashed #cbd5e1;
            border-radius: 6px;
            height: 112px;
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 4px;
        }
        .worksheet-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 4px;
        }
        .worksheet-caption {
            font-size: 7pt;
            color: #94a3b8;
            font-style: italic;
            margin-top: 5px;
        }

        /* SECTION HEADER */
        .sec-header {
            margin-bottom: 6px;
        }
        .sec-title {
            font-size: 9pt;
            font-weight: 800;
            color: #0b3591;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin: 0;
        }
        .sec-accent {
            width: 50px;
            height: 2.5px;
            background: #ea580c;
            margin-top: 2px;
            border-radius: 2px;
        }

        /* 4 INDIKATOR LIST */
        .ind-list {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-bottom: 6px;
        }
        .ind-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 8px;
            border-bottom: 1px solid #f1f5f9;
            gap: 10px;
        }
        .ind-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .ind-num {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #0b3591;
            color: #ffffff;
            font-size: 8pt;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .ind-name {
            font-size: 8.8pt;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 1px 0;
        }
        .ind-desc {
            font-size: 7.6pt;
            color: #64748b;
            margin: 0;
        }
        .ind-pills {
            display: flex;
            gap: 5px;
            flex-shrink: 0;
        }
        .ind-pill {
            width: 42px;
            padding: 3.5px 0;
            text-align: center;
            border-radius: 5px;
            font-size: 7.6pt;
            font-weight: 700;
            background: #f1f5f9;
            color: #94a3b8;
        }
        .ind-legend {
            text-align: center;
            font-size: 7pt;
            color: #64748b;
            padding: 4px 0 6px 0;
            border-top: 1px solid #e2e8f0;
            margin-bottom: 6px;
        }

        /* MENULIS & MENGGAMBAR CARDS */
        .dual-status-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 10px;
        }
        .status-card {
            border-radius: 8px;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .status-card.ok {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
        }
        .status-card.warn {
            background: #fef2f2;
            border: 1px solid #fecaca;
        }
        .status-icon {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10pt;
            font-weight: 800;
            color: #ffffff;
            flex-shrink: 0;
        }
        .status-icon.ok {
            background: #16a34a;
        }
        .status-icon.warn {
            background: #dc2626;
        }
        .status-card-title {
            font-size: 8.6pt;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 1px 0;
        }
        .status-card-sub {
            font-size: 7.6pt;
            color: #334155;
            margin: 0;
        }

        /* REKOMENDASI STIMULASI */
        .rekom-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 10px;
        }
        .rekom-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            background: #ffffff;
        }
        .rekom-head {
            padding: 5.5px 12px;
            font-size: 8.2pt;
            font-weight: 700;
            color: #ffffff;
        }
        .rekom-head.guru {
            background: #ea580c;
        }
        .rekom-head.ortu {
            background: #0b3591;
        }
        .rekom-body {
            padding: 7px 12px;
            margin: 0;
            list-style: none;
        }
        .rekom-body li {
            position: relative;
            padding-left: 12px;
            font-size: 7.7pt;
            color: #1e293b;
            line-height: 1.38;
            margin-bottom: 4px;
        }
        .rekom-body li:last-child {
            margin-bottom: 0;
        }
        .rekom-body.guru li::before {
            content: "•";
            position: absolute;
            left: 0;
            top: 0;
            color: #ea580c;
            font-weight: 900;
            font-size: 10pt;
            line-height: 1.1;
        }
        .rekom-body.ortu li::before {
            content: "•";
            position: absolute;
            left: 0;
            top: 0;
            color: #0b3591;
            font-weight: 900;
            font-size: 10pt;
            line-height: 1.1;
        }

        /* BOTTOM NOTE & SIGNATURE */
        .bottom-row {
            display: grid;
            grid-template-columns: 1.55fr 1fr;
            gap: 16px;
            align-items: end;
            margin-top: 2px;
        }
        .note-box {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 8px 12px;
        }
        .note-title {
            font-size: 7.8pt;
            font-weight: 700;
            color: #92400e;
            margin: 0 0 2px 0;
        }
        .note-text {
            font-size: 7.2pt;
            color: #78350f;
            line-height: 1.35;
            margin: 0;
        }
        .sig-block {
            text-align: center;
            font-size: 7.8pt;
            color: #334155;
        }
        .sig-role {
            font-size: 7.2pt;
            color: #64748b;
            margin-top: 1px;
        }
        .sig-space {
            height: 30px;
        }
        .sig-line {
            border-top: 1px solid #cbd5e1;
            padding-top: 3px;
            color: #64748b;
            font-size: 7.8pt;
            display: flex;
            justify-content: space-between;
            padding-left: 8px;
            padding-right: 8px;
        }

        /* FOOTER BAR */
        .footer-bar {
            background: #0b3591;
            color: #ffffff;
            padding: 6px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 7.5pt;
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- TOP HEADER -->
        <div class="top-header">
            <div class="brand-wrap">
                <img src="${logoSrc}" alt="Graphelp" class="brand-logo" />
                <div>
                    <div class="brand-title">Graphelp_</div>
                    <div class="brand-subtitle">Early Fine-Motor Assessment Platform</div>
                </div>
            </div>
            <div class="report-meta">
                <div class="report-meta-label">No. Laporan</div>
                <div class="report-meta-no">${escapeHtml(reportNumber)}</div>
                <div class="report-meta-date">${escapeHtml(tanggalCetak)}</div>
            </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="main-content">
            <!-- TITLE -->
            <div class="doc-title-block">
                <h1 class="doc-title">LAPORAN ASESMEN MOTORIK HALUS ANAK</h1>
                <p class="doc-subtitle">Skrining awal kematangan motorik halus berbasis analisis goresan tulisan tangan</p>
            </div>

            <!-- IDENTITY BOX -->
            <div class="identity-box">
                <div>
                    <div class="id-item-label">NAMA ANAK</div>
                    <div class="id-item-val">${escapeHtml(studentName)}</div>
                </div>
                <div>
                    <div class="id-item-label">USIA</div>
                    <div class="id-item-val">${escapeHtml(usiaFormatted)}</div>
                </div>
                <div>
                    <div class="id-item-label">JENIS KELAMIN</div>
                    <div class="id-item-val">${escapeHtml(genderFormatted)}</div>
                </div>
                <div>
                    <div class="id-item-label">SEKOLAH</div>
                    <div class="id-item-val">${escapeHtml(schoolName || res.school_name || "-")}</div>
                </div>
                <div>
                    <div class="id-item-label">KELAS</div>
                    <div class="id-item-val">${escapeHtml(gradeClass || res.grade_class || "-")}</div>
                </div>
                <div>
                    <div class="id-item-label">TANGGAL ASESMEN</div>
                    <div class="id-item-val">${escapeHtml(tanggalAsesmen)}</div>
                </div>
            </div>

            <!-- HERO SUMMARY + WORKSHEET -->
            <div class="hero-row">
                <div class="summary-card">
                    <div class="summary-top">
                        <div class="kat-circle">${escapeHtml(kategoriKey)}</div>
                        <div class="summary-text-col">
                            <div class="summary-eyebrow">RINGKASAN HASIL</div>
                            <div class="summary-kat-title">${escapeHtml(kategoriLabel)}</div>
                            <div class="age-status-pill">${isYa ? "✓ Sesuai usia" : "✗ Belum sesuai usia"}</div>
                            <p class="summary-desc">${escapeHtml(summaryParagraph)}</p>
                        </div>
                    </div>
                    <div class="confidence-row">
                        <span class="confidence-label">Tingkat keyakinan AI</span>
                        <div class="confidence-track">
                            <div class="confidence-fill"></div>
                        </div>
                        <span class="confidence-val">${escapeHtml(confFormatted)}</span>
                    </div>
                </div>

                <div class="worksheet-card">
                    <div class="worksheet-title">LEMBAR KERJA ANAK</div>
                    <div class="worksheet-frame">
                        ${
                            worksheetImgUrl
                                ? `<img src="${worksheetImgUrl}" alt="Lembar Kerja ${escapeHtml(studentName)}" class="worksheet-img" />`
                                : `<svg width="180" height="75" viewBox="0 0 180 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 20 Q 18 8, 28 20 T 48 20 T 68 20 T 88 20 T 108 20 T 128 20 T 148 20 T 168 20" stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round"/>
                                    <path d="M8 52 L 22 38 L 36 52 L 50 38 L 64 52 L 78 38 L 92 52 L 106 38 L 120 52 L 134 38 L 148 52 L 162 38" stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                   </svg>`
                        }
                    </div>
                    <div class="worksheet-caption">(foto asli ditampilkan di sini)</div>
                </div>
            </div>

            <!-- 4 INDIKATOR PERKEMBANGAN -->
            <div>
                <div class="sec-header">
                    <h2 class="sec-title">4 INDIKATOR PERKEMBANGAN</h2>
                    <div class="sec-accent"></div>
                </div>
                <div class="ind-list">
                    ${indicatorRows
                        .map(
                            (row) => `
                        <div class="ind-row">
                            <div class="ind-left">
                                <div class="ind-num">${row.no}</div>
                                <div>
                                    <div class="ind-name">${escapeHtml(row.title)}</div>
                                    <div class="ind-desc">${escapeHtml(row.desc)}</div>
                                </div>
                            </div>
                            <div class="ind-pills">
                                ${["BB", "MB", "BSH", "BSB"]
                                    .map((lvl) => {
                                        const active = row.level === lvl;
                                        const bg = active ? pillActiveColor(lvl) : "#f1f5f9";
                                        const col = active ? "#ffffff" : "#94a3b8";
                                        return `<span class="ind-pill" style="background:${bg};color:${col};">${lvl}</span>`;
                                    })
                                    .join("")}
                            </div>
                        </div>
                    `
                        )
                        .join("")}
                </div>
                <div class="ind-legend">
                    BB = Belum Berkembang &nbsp;|&nbsp; MB = Mulai Berkembang &nbsp;|&nbsp; BSH = Berkembang Sesuai Harapan &nbsp;|&nbsp; BSB = Berkembang Sangat Baik
                </div>
            </div>

            <!-- KEMAMPUAN MENULIS & MENGGAMBAR -->
            <div class="dual-status-row">
                <div class="status-card ${menulisSesuai ? "ok" : "warn"}">
                    <div class="status-icon ${menulisSesuai ? "ok" : "warn"}">${menulisSesuai ? "✓" : "!"}</div>
                    <div>
                        <div class="status-card-title">Kemampuan Menulis</div>
                        <div class="status-card-sub">${escapeHtml(menulisText)}</div>
                    </div>
                </div>
                <div class="status-card ${menggambarSesuai ? "ok" : "warn"}">
                    <div class="status-icon ${menggambarSesuai ? "ok" : "warn"}">${menggambarSesuai ? "✓" : "!"}</div>
                    <div>
                        <div class="status-card-title">Kemampuan Menggambar</div>
                        <div class="status-card-sub">${escapeHtml(menggambarText)}</div>
                    </div>
                </div>
            </div>

            <!-- REKOMENDASI STIMULASI -->
            <div>
                <div class="sec-header">
                    <h2 class="sec-title">REKOMENDASI STIMULASI</h2>
                    <div class="sec-accent"></div>
                </div>
                <div class="rekom-grid">
                    <div class="rekom-card">
                        <div class="rekom-head guru">Untuk Guru</div>
                        <ul class="rekom-body guru">
                            ${katMeta.guruTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
                        </ul>
                    </div>
                    <div class="rekom-card">
                        <div class="rekom-head ortu">Untuk Orang Tua</div>
                        <ul class="rekom-body ortu">
                            ${katMeta.ortuTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- CATATAN PENTING & SIGNATURE -->
            <div class="bottom-row">
                <div class="note-box">
                    <div class="note-title">Catatan penting</div>
                    <p class="note-text">
                        Hasil ini adalah skrining awal berbantuan AI dan bukan diagnosis. Mohon dikonfirmasi oleh guru atau tenaga ahli. Perkembangan anak dapat berubah dengan stimulasi.
                    </p>
                </div>
                <div class="sig-block">
                    <div>Mengetahui,</div>
                    <div class="sig-role">Guru Pembimbing / Asesor PAUD</div>
                    <div class="sig-space"></div>
                    <div class="sig-line">
                        <span>(</span>
                        <span>)</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- FOOTER BAR -->
        <div class="footer-bar">
            <span>Graphelp &nbsp;|&nbsp; Early Fine-Motor Assessment Platform</span>
            <span>Halaman 1/1</span>
        </div>
    </div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // Tunggu gambar logo & lembar kerja termuat sebelum memanggil dialog cetak
    const images = Array.from(printWindow.document.images || []);
    if (images.length === 0) {
        setTimeout(() => printWindow.print(), 250);
        return;
    }

    let printed = false;
    const triggerPrint = () => {
        if (printed) return;
        printed = true;
        printWindow.print();
    };

    let loadedCount = 0;
    images.forEach((img) => {
        if (img.complete) {
            loadedCount += 1;
            if (loadedCount === images.length) {
                setTimeout(triggerPrint, 150);
            }
        } else {
            img.addEventListener("load", () => {
                loadedCount += 1;
                if (loadedCount === images.length) {
                    setTimeout(triggerPrint, 150);
                }
            });
            img.addEventListener("error", () => {
                loadedCount += 1;
                if (loadedCount === images.length) {
                    setTimeout(triggerPrint, 150);
                }
            });
        }
    });

    // Fallback jika ada gambar lambat dimuat
    setTimeout(triggerPrint, 1200);
}

export default handlePrintStudentPDF;
