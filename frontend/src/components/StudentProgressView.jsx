import { useState } from "react";
import AssessmentResult from "./AssessmentResult";
import { useToast } from "./Toast";

const KATEGORI_BADGE = {
    BB: { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5", label: "Belum Berkembang" },
    MB: { bg: "#ffedd5", color: "#c2410c", border: "#fdba74", label: "Mulai Berkembang" },
    BSH: { bg: "#dcfce7", color: "#15803d", border: "#86efac", label: "Berkembang Sesuai Harapan" },
    BSB: { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd", label: "Berkembang Sangat Baik" },
};

const SCORE_TO_KAT = {
    1: "BB",
    2: "MB",
    3: "BSH",
    4: "BSB",
};

const REMINDER_STYLE = {
    jatuh_tempo: { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca", badgeBg: "#fee2e2", icon: "🔔" },
    segera: { bg: "#fffbeb", color: "#b45309", border: "#fde68a", badgeBg: "#fef3c7", icon: "⏳" },
    terjadwal: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", badgeBg: "#dcfce7", icon: "📅" },
    belum_dijadwalkan: { bg: "#f8fafc", color: "#475569", border: "#e2e8f0", badgeBg: "#f1f5f9", icon: "🗓️" },
};

const DELTA_STYLE = {
    Meningkat: { bg: "#dcfce7", color: "#15803d", border: "#86efac", icon: "📈" },
    Stabil: { bg: "#f1f5f9", color: "#334155", border: "#cbd5e1", icon: "➖" },
    Menurun: { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5", icon: "📉" },
    "Asesmen Awal": { bg: "#e0f2fe", color: "#0369a1", border: "#7dd3fc", icon: "🆕" },
};

const INDIKATOR_META = [
    { key: "kestabilan_goresan", label: "1. Kestabilan Goresan & Pegangan" },
    { key: "kontrol_tekanan", label: "2. Kontrol Tekanan Alat Tulis" },
    { key: "proporsi_spasial", label: "3. Koordinasi Mata & Proporsi Geometri" },
    { key: "kontinuitas_garis", label: "4. Kontinuitas Tarikan Garis" },
];

export default function StudentProgressView({
    progressData,
    isTeacher = false,
    onOpenNewAssessment,
    onSaveSchedule,
}) {
    const toast = useToast();
    const student = progressData?.student || {};
    const classInfo = progressData?.class_info || {};
    const summary = progressData?.summary || {};
    const series = Array.isArray(progressData?.progress_series) ? progressData.progress_series : [];
    const assessments = Array.isArray(progressData?.assessments) ? progressData.assessments : [];

    const [selectedAssessmentId, setSelectedAssessmentId] = useState(
        assessments[0]?.id || null
    );
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [schedDate, setSchedDate] = useState(student.next_assessment_date || "");
    const [schedInterval, setSchedInterval] = useState(String(student.assessment_interval_days || 30));
    const [savingSchedule, setSavingSchedule] = useState(false);

    const activeAssessment =
        assessments.find((a) => a.id === selectedAssessmentId) || assessments[0] || null;

    const reminder = student.reminder || {
        status: "belum_dijadwalkan",
        label: "Belum Dijadwalkan",
        next_assessment_date: null,
        interval_days: 30,
    };
    const remStyle = REMINDER_STYLE[reminder.status] || REMINDER_STYLE.belum_dijadwalkan;

    const handleCopyCode = () => {
        if (!student.invitation_code) return;
        navigator.clipboard.writeText(student.invitation_code);
        toast.success(`Kode Anak (${student.invitation_code}) berhasil disalin!`);
    };

    const handleOpenScheduleModal = () => {
        setSchedDate(student.next_assessment_date || "");
        setSchedInterval(String(student.assessment_interval_days || 30));
        setIsScheduleModalOpen(true);
    };

    const handleSubmitSchedule = async (e) => {
        e.preventDefault();
        if (!onSaveSchedule) return;
        setSavingSchedule(true);
        try {
            await onSaveSchedule({
                next_assessment_date: schedDate || null,
                assessment_interval_days: Number(schedInterval) || 30,
            });
            setIsScheduleModalOpen(false);
        } finally {
            setSavingSchedule(false);
        }
    };

    // Perhitungan koordinat SVG Line Chart
    const chartWidth = 680;
    const chartHeight = 230;
    const padLeft = 64;
    const padRight = 36;
    const padTop = 28;
    const padBottom = 46;
    const innerW = chartWidth - padLeft - padRight;
    const innerH = chartHeight - padTop - padBottom;

    const getPointCoords = (idx, total, score) => {
        const x = total <= 1
            ? padLeft + innerW / 2
            : padLeft + (idx / (total - 1)) * innerW;
        const clampedScore = Math.max(1, Math.min(4, Number(score) || 1));
        const y = padTop + ((4 - clampedScore) / 3) * innerH;
        return { x, y };
    };

    const chartPoints = series.map((pt, idx) => ({
        ...pt,
        ...getPointCoords(idx, series.length, pt.kategori_score),
    }));

    const polylinePoints = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");

    return (
        <div className="gc-progress-container">
            {/* BARIS 1: KARTU PROFIL SISWA, KODE ANAK & PENGINGAT BERKALA */}
            <div className="gc-progress-top-grid">
                {/* Kartu Identitas Siswa */}
                <div className="gc-progress-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                        <div>
                            <span className="gc-progress-eyebrow">PROFIL SISWA</span>
                            <h3 style={{ margin: "4px 0 6px", fontSize: "1.28rem", color: "#0f172a", fontWeight: "800" }}>
                                No. {student.absence_number} - {student.name}
                            </h3>
                            <p style={{ margin: 0, fontSize: "0.88rem", color: "#475569" }}>
                                Kelas: <strong>{classInfo.name || "-"}</strong> ({classInfo.academic_year || "-"}) - Sekolah: <strong>{classInfo.school_name || "-"}</strong>
                            </p>
                        </div>
                        <span className={`gc-gender-pill ${student.gender === "P" ? "gc-gender-p" : "gc-gender-l"}`}>
                            {student.gender === "P" ? "Perempuan (P)" : "Laki-laki (L)"}
                        </span>
                    </div>

                    <div className="gc-progress-meta-chips">
                        <div className="gc-meta-chip">
                            <span className="gc-meta-chip-label">Tanggal Lahir</span>
                            <strong>{student.birth_date || "-"}</strong>
                        </div>
                        <div className="gc-meta-chip">
                            <span className="gc-meta-chip-label">Usia Saat Ini</span>
                            <strong>{student.age_months} Bulan</strong>
                        </div>
                        <div className="gc-meta-chip">
                            <span className="gc-meta-chip-label">Total Asesmen</span>
                            <strong>{summary.total_assessments || 0} Kali</strong>
                        </div>
                        <div className="gc-meta-chip">
                            <span className="gc-meta-chip-label">Perkembangan Terakhir</span>
                            {summary.latest_delta_status && DELTA_STYLE[summary.latest_delta_status] ? (
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "2px 8px",
                                        borderRadius: "999px",
                                        fontSize: "0.78rem",
                                        fontWeight: "700",
                                        background: DELTA_STYLE[summary.latest_delta_status].bg,
                                        color: DELTA_STYLE[summary.latest_delta_status].color,
                                        border: `1px solid ${DELTA_STYLE[summary.latest_delta_status].border}`,
                                    }}
                                >
                                    {DELTA_STYLE[summary.latest_delta_status].icon} {summary.latest_delta_status}
                                </span>
                            ) : (
                                <strong>Belum Ada</strong>
                            )}
                        </div>
                    </div>

                    {/* Kotak Kode Klaim Orang Tua */}
                    {student.invitation_code && (
                        <div className="gc-code-banner">
                            <div>
                                <div style={{ fontSize: "0.76rem", fontWeight: "700", color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                                    🔑 Kode Pantau Orang Tua (Akun Umum)
                                </div>
                                <div style={{ fontSize: "0.82rem", color: "#334155", marginTop: "2px" }}>
                                    {isTeacher
                                        ? "Bagikan kode unik ini kepada orang tua siswa agar dapat memantau hasil asesmen anak:"
                                        : "Kode unik anak yang tertaut pada akun Anda:"}
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <code className="gc-code-pill">{student.invitation_code}</code>
                                <button
                                    type="button"
                                    onClick={handleCopyCode}
                                    className="gc-copy-btn"
                                    title="Salin Kode Anak"
                                >
                                    Salin Kode
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Kartu Pengingat Jadwal Asesmen Berikutnya */}
                <div
                    className="gc-progress-card"
                    style={{
                        background: remStyle.bg,
                        borderColor: remStyle.border,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                        <div>
                            <span className="gc-progress-eyebrow" style={{ color: remStyle.color }}>
                                {remStyle.icon} PENGINGAT ASESMEN BERKALA
                            </span>
                            <h3 style={{ margin: "4px 0 6px", fontSize: "1.12rem", color: "#0f172a", fontWeight: "800" }}>
                                {reminder.label}
                            </h3>
                        </div>

                        {isTeacher && onSaveSchedule && (
                            <button
                                type="button"
                                onClick={handleOpenScheduleModal}
                                className="gc-secondary-btn"
                                style={{ padding: "6px 11px", fontSize: "0.78rem", background: "#fff" }}
                            >
                                ⚙️ Atur Jadwal
                            </button>
                        )}
                    </div>

                    <div style={{ fontSize: "0.88rem", color: "#334155", lineHeight: "1.5", margin: "6px 0 12px" }}>
                        <div>
                            <strong>Jadwal Asesmen Berikutnya:</strong>{" "}
                            {reminder.next_assessment_date ? reminder.next_assessment_date : "Otomatis (+30 hari setelah asesmen pertama)"}
                        </div>
                        <div>
                            <strong>Siklus Berkala:</strong> Setiap {reminder.interval_days || 30} hari
                        </div>
                    </div>

                    <div
                        style={{
                            fontSize: "0.78rem",
                            color: "#475569",
                            background: "rgba(255,255,255,0.75)",
                            padding: "8px 10px",
                            borderRadius: "8px",
                            border: "1px dashed #cbd5e1",
                        }}
                    >
                        ℹ️ <strong>Catatan:</strong> Pengingat ini hanya bersifat pemberitahuan agar evaluasi bulanan terjadwal. Sistem tetap berjalan normal kapan pun asesmen dilakukan.
                    </div>

                    {isTeacher && onOpenNewAssessment && (
                        <div style={{ marginTop: "14px" }}>
                            <button
                                type="button"
                                onClick={onOpenNewAssessment}
                                className="gc-navy-btn"
                                style={{ width: "100%", justifyContent: "center" }}
                            >
                                {assessments.length > 0 ? "+ Mulai Asesmen Berkala Baru" : "+ Mulai Asesmen Pertama"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* BARIS 2: GRAFIK PERKEMBANGAN BERKALA ANTAR-BULAN */}
            <div className="gc-progress-card" style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                    <div>
                        <span className="gc-progress-eyebrow">ANALISIS BERKALA (TIME-SERIES)</span>
                        <h3 style={{ margin: "2px 0 0", fontSize: "1.12rem", color: "#0f172a", fontWeight: "800" }}>
                            Grafik Perkembangan Motorik Halus Anak
                        </h3>
                    </div>
                    {summary.first_kategori && summary.latest_kategori && (
                        <div style={{ fontSize: "0.84rem", color: "#334155", background: "#f8fafc", padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                            Awal: <strong>{summary.first_kategori}</strong> → Terkini: <strong>{summary.latest_kategori}</strong>
                        </div>
                    )}
                </div>

                {series.length === 0 ? (
                    <div className="gc-state-box" style={{ padding: "32px 18px" }}>
                        <h3 style={{ fontSize: "1rem" }}>Belum Ada Data Grafik Perkembangan</h3>
                        <p style={{ fontSize: "0.86rem" }}>
                            Grafik tren perkembangan bulanan akan otomatis muncul setelah siswa menjalani minimal 1 kali asesmen.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* SVG Line Chart Tahapan BB -> MB -> BSH -> BSB */}
                        <div style={{ overflowX: "auto", paddingBottom: "6px" }}>
                            <svg
                                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                style={{ width: "100%", minWidth: "520px", maxHeight: "260px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                            >
                                {/* Garis Horizontal Level 1..4 */}
                                {[4, 3, 2, 1].map((score) => {
                                    const y = padTop + ((4 - score) / 3) * innerH;
                                    const kat = SCORE_TO_KAT[score];
                                    return (
                                        <g key={score}>
                                            <line
                                                x1={padLeft}
                                                y1={y}
                                                x2={chartWidth - padRight}
                                                y2={y}
                                                stroke="#e2e8f0"
                                                strokeDasharray="4 4"
                                                strokeWidth="1"
                                            />
                                            <text
                                                x={padLeft - 10}
                                                y={y + 4}
                                                textAnchor="end"
                                                fontSize="11"
                                                fontWeight="700"
                                                fill={KATEGORI_BADGE[kat].color}
                                            >
                                                {kat} ({score})
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Garis Penghubung Antar-Periode */}
                                {chartPoints.length > 1 && (
                                    <polyline
                                        fill="none"
                                        stroke="#0284c7"
                                        strokeWidth="3"
                                        points={polylinePoints}
                                    />
                                )}

                                {/* Titik Data per Asesmen */}
                                {chartPoints.map((pt) => {
                                    const isSelected = activeAssessment?.id === pt.assessment_id;
                                    const badge = KATEGORI_BADGE[pt.kategori] || KATEGORI_BADGE.MB;
                                    return (
                                        <g
                                            key={pt.assessment_id}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setSelectedAssessmentId(pt.assessment_id)}
                                        >
                                            <circle
                                                cx={pt.x}
                                                cy={pt.y}
                                                r={isSelected ? 9 : 6.5}
                                                fill={badge.color}
                                                stroke="#ffffff"
                                                strokeWidth="2.5"
                                            />
                                            <text
                                                x={pt.x}
                                                y={pt.y - 12}
                                                textAnchor="middle"
                                                fontSize="10.5"
                                                fontWeight="700"
                                                fill="#0f172a"
                                            >
                                                {pt.kategori} ({pt.confidence}%)
                                            </text>
                                            <text
                                                x={pt.x}
                                                y={chartHeight - 22}
                                                textAnchor="middle"
                                                fontSize="10.5"
                                                fontWeight="700"
                                                fill="#334155"
                                            >
                                                Ke-{pt.sequence_number}
                                            </text>
                                            <text
                                                x={pt.x}
                                                y={chartHeight - 8}
                                                textAnchor="middle"
                                                fontSize="9.5"
                                                fill="#64748b"
                                            >
                                                {(pt.tanggal || "").split(" ")[0]}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Matriks Komparasi 4 Indikator Klinis Antar-Asesmen */}
                        <div style={{ marginTop: "18px" }}>
                            <h4 style={{ margin: "0 0 8px", fontSize: "0.92rem", color: "#1e293b", fontWeight: "700" }}>
                                Perbandingan 4 Indikator Klinis dari Bulan ke Bulan
                            </h4>
                            <div className="gc-table-wrapper">
                                <table className="gc-students-table" style={{ fontSize: "0.84rem" }}>
                                    <thead>
                                        <tr>
                                            <th>Indikator Klinis</th>
                                            {series.map((pt) => (
                                                <th key={pt.assessment_id} style={{ textAlign: "center" }}>
                                                    <div>Asesmen Ke-{pt.sequence_number}</div>
                                                    <div style={{ fontSize: "0.72rem", fontWeight: "500", color: "#64748b" }}>
                                                        {(pt.tanggal || "").split(" ")[0]}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {INDIKATOR_META.map((ind) => (
                                            <tr key={ind.key}>
                                                <td style={{ fontWeight: "600", color: "#1e293b" }}>{ind.label}</td>
                                                {series.map((pt) => {
                                                    const sc = pt.indikator_scores?.[ind.key] || pt.kategori_score || 2;
                                                    const kat = SCORE_TO_KAT[sc] || "MB";
                                                    const st = KATEGORI_BADGE[kat];
                                                    return (
                                                        <td key={pt.assessment_id} style={{ textAlign: "center" }}>
                                                            <span
                                                                style={{
                                                                    display: "inline-block",
                                                                    padding: "3px 9px",
                                                                    borderRadius: "999px",
                                                                    fontWeight: "700",
                                                                    fontSize: "0.76rem",
                                                                    background: st.bg,
                                                                    color: st.color,
                                                                    border: `1px solid ${st.border}`,
                                                                }}
                                                            >
                                                                {kat} ({sc}/4)
                                                            </span>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* BARIS 3: LINIMASA RIWAYAT ASESMEN & DETAIL LAPORAN */}
            <div className="gc-progress-card" style={{ marginTop: "20px" }}>
                <div style={{ marginBottom: "14px" }}>
                    <span className="gc-progress-eyebrow">RIWAYAT LENGKAP PER PERIODE</span>
                    <h3 style={{ margin: "2px 0 4px", fontSize: "1.12rem", color: "#0f172a", fontWeight: "800" }}>
                        Daftar Lembar Kerja & Rapor Asesmen ({assessments.length} Periode)
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.84rem", color: "#64748b" }}>
                        Pilih periode asesmen di bawah untuk melihat rincian 4 indikator klinis, kesimpulan menulis & menggambar, serta mencetak PDF.
                    </p>
                </div>

                {assessments.length === 0 ? (
                    <div className="gc-state-box" style={{ padding: "28px 18px" }}>
                        <h3 style={{ fontSize: "1rem" }}>Belum Ada Riwayat Asesmen</h3>
                        <p style={{ fontSize: "0.86rem" }}>
                            Siswa ini belum memiliki riwayat asesmen motorik halus.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Tab / Kartu Pilihan Periode */}
                        <div className="gc-period-tabs">
                            {assessments.map((item) => {
                                const isSelected = activeAssessment?.id === item.id;
                                const katBadge = KATEGORI_BADGE[item.kategori] || KATEGORI_BADGE.MB;
                                const dStyle = DELTA_STYLE[item.delta_status] || DELTA_STYLE.Stabil;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedAssessmentId(item.id)}
                                        className={`gc-period-tab ${isSelected ? "active" : ""}`}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", width: "100%" }}>
                                            <strong style={{ fontSize: "0.88rem", color: "#0f172a" }}>
                                                {item.period_label || `Asesmen Ke-${item.sequence_number}`}
                                            </strong>
                                            <span
                                                style={{
                                                    padding: "2px 8px",
                                                    borderRadius: "999px",
                                                    fontSize: "0.74rem",
                                                    fontWeight: "700",
                                                    background: katBadge.bg,
                                                    color: katBadge.color,
                                                    border: `1px solid ${katBadge.border}`,
                                                }}
                                            >
                                                {item.kategori}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "4px", display: "flex", justifyContent: "space-between", width: "100%" }}>
                                            <span>{item.tanggal}</span>
                                            <span style={{ color: dStyle.color, fontWeight: "700" }}>
                                                {dStyle.icon} {item.delta_status}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Rincian Hasil Periode yang Dipilih */}
                        {activeAssessment && (
                            <div style={{ marginTop: "16px" }}>
                                <AssessmentResult
                                    result={activeAssessment}
                                    schoolName={classInfo.school_name || ""}
                                    gradeClass={classInfo.name || ""}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* MODAL ATUR JADWAL PENGINGAT (KHUSUS GURU) */}
            {isScheduleModalOpen && (
                <div className="gc-modal-overlay" onClick={() => !savingSchedule && setIsScheduleModalOpen(false)}>
                    <div className="gc-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="gc-modal-header">
                            <h3>Atur Jadwal Pengingat Asesmen</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={() => !savingSchedule && setIsScheduleModalOpen(false)}
                                aria-label="Tutup"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitSchedule} className="gc-modal-form">
                            <div className="student-field">
                                <label htmlFor="sched-date-input">Tanggal Jadwal Asesmen Berikutnya</label>
                                <input
                                    id="sched-date-input"
                                    type="date"
                                    value={schedDate}
                                    onChange={(e) => setSchedDate(e.target.value)}
                                    className="student-input"
                                />
                                <small style={{ color: "#64748b", fontSize: "0.78rem" }}>
                                    Kosongkan jika belum ingin menjadwalkan pengingat.
                                </small>
                            </div>

                            <div className="student-field">
                                <label htmlFor="sched-interval-input">Interval Siklus Asesmen Berkala (Hari)</label>
                                <input
                                    id="sched-interval-input"
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={schedInterval}
                                    onChange={(e) => setSchedInterval(e.target.value)}
                                    required
                                    className="student-input"
                                />
                                <small style={{ color: "#64748b", fontSize: "0.78rem" }}>
                                    Default: 30 hari (1 bulan). Setiap selesai asesmen baru, jadwal berikutnya otomatis ditambah sesuai siklus ini.
                                </small>
                            </div>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsScheduleModalOpen(false)}
                                    className="gc-secondary-btn"
                                    disabled={savingSchedule}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="gc-navy-btn"
                                    disabled={savingSchedule}
                                >
                                    {savingSchedule ? "Menyimpan..." : "Simpan Jadwal"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
