import { handlePrintStudentPDF } from "../utils/printAssessment";
import { getApiUrl } from "../config/api";

const KATEGORI_BADGE_STYLE = {
    BB: { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" },
    MB: { bg: "#ffedd5", color: "#c2410c", border: "#fdba74" },
    BSH: { bg: "#dcfce7", color: "#15803d", border: "#86efac" },
    BSB: { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
};

const DELTA_BADGE_STYLE = {
    Meningkat: { bg: "#dcfce7", color: "#15803d", border: "#86efac", icon: "📈" },
    Stabil: { bg: "#f1f5f9", color: "#334155", border: "#cbd5e1", icon: "➖" },
    Menurun: { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5", icon: "📉" },
    "Asesmen Awal": { bg: "#e0f2fe", color: "#0369a1", border: "#7dd3fc", icon: "🆕" },
};

export default function AssessmentResult({ result, schoolName, gradeClass }) {
    if (!result) return null;

    const isYa = result.kesimpulan?.includes("Ya");
    const ageVal = result.age_months ?? result.age;
    const studentName = result.student_name || result.name || "Siswa";
    const katStyle = KATEGORI_BADGE_STYLE[result.kategori] || KATEGORI_BADGE_STYLE.MB;
    const imageUrl = result.image_url || result.image_path;

    const indTable = result.indikator_klinis_table && result.indikator_klinis_table.length > 0
        ? result.indikator_klinis_table
        : [
            { no: 1, nama: "Kontrol Pegangan: kemampuan memegang alat tulis secara stabil", level: result.kategori || "MB" },
            { no: 2, nama: "Kekuatan goresan konsisten (tidak terlalu tipis/gemetar dan tidak terlalu tebal)", level: result.kategori || "MB" },
            { no: 3, nama: "Koordinasi mata: kemampuan menyalin atau menggambar pola geometri", level: result.kategori || "MB" },
            { no: 4, nama: "Kemampuan menarik garis lurus secara kontinu tanpa banyak jeda", level: result.kategori || "MB" }
        ];

    return (
        <div className="student-result-item" style={{ border: "1px solid #e2e8f0", boxShadow: "none" }}>
            <div
                className="student-result-header"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}
            >
                <div>
                    <span style={{ fontWeight: "700", fontSize: "1.05rem", color: "#1e293b" }}>
                        {result.absence_number ? `No. ${result.absence_number} - ` : ""}{studentName}
                        <small style={{ marginLeft: "8px", color: "#64748b", fontWeight: "normal", fontSize: "0.85em" }}>
                            ({ageVal ? `${ageVal} bln` : ""}{result.gender ? ` - ${result.gender === "L" ? "Laki-laki" : "Perempuan"}` : ""})
                        </small>
                    </span>
                    {result.tanggal && (
                        <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "500", marginTop: "2px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                            <span>Waktu Asesmen: {result.tanggal}</span>
                            {result.period_label && (
                                <span style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "1px 7px", borderRadius: "999px", fontWeight: "700", fontSize: "0.74rem" }}>
                                    {result.period_label}
                                </span>
                            )}
                            {result.delta_status && DELTA_BADGE_STYLE[result.delta_status] && (
                                <span
                                    style={{
                                        background: DELTA_BADGE_STYLE[result.delta_status].bg,
                                        color: DELTA_BADGE_STYLE[result.delta_status].color,
                                        border: `1px solid ${DELTA_BADGE_STYLE[result.delta_status].border}`,
                                        padding: "1px 7px",
                                        borderRadius: "999px",
                                        fontWeight: "700",
                                        fontSize: "0.74rem",
                                    }}
                                >
                                    {DELTA_BADGE_STYLE[result.delta_status].icon} {result.delta_status}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    {result.kategori && (
                        <span
                            style={{
                                padding: "5px 10px",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                fontWeight: "700",
                                background: katStyle.bg,
                                color: katStyle.color,
                                border: `1px solid ${katStyle.border}`,
                            }}
                        >
                            {result.kategori} {result.kategori_label ? `(${result.kategori_label})` : ""}
                        </span>
                    )}
                    <span
                        style={{
                            padding: "5px 12px",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: "700",
                            background: isYa ? "#dcfce7" : "#fee2e2",
                            color: isYa ? "#15803d" : "#b91c1c",
                            border: `1px solid ${isYa ? "#86efac" : "#fca5a5"}`,
                        }}
                    >
                        {isYa ? "✓ Sesuai Usia [Ya]" : "✗ Belum Sesuai [Tidak]"} ({result.confidence}%)
                    </span>
                    <button
                        type="button"
                        onClick={() => handlePrintStudentPDF(result, schoolName, gradeClass)}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "0.83rem",
                            fontWeight: "600",
                            background: "#0284c7",
                            color: "#ffffff",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                            transition: "all 0.15s ease",
                        }}
                        title="Cetak atau simpan lembar laporan sebagai PDF"
                    >
                        🖨️ Cetak / Unduh PDF
                    </button>
                </div>
            </div>

            {imageUrl && (
                <div
                    style={{
                        marginTop: "12px",
                        marginBottom: "14px",
                        padding: "10px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <img
                        src={getApiUrl(imageUrl)}
                        alt={`Lembar kerja ${studentName}`}
                        style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            background: "#fff",
                        }}
                    />
                    <div style={{ fontSize: "0.83rem", color: "#475569" }}>
                        <div style={{ fontWeight: "700", color: "#1e293b", marginBottom: "2px" }}>
                            Status Perkembangan: {result.status || "-"}
                        </div>
                        <div>Sampel foto lembar kerja yang dianalisis oleh AI</div>
                    </div>
                </div>
            )}

            {/* BAGIAN I: ASESMEN 4 INDIKATOR KLINIS */}
            <div style={{ marginTop: "14px", marginBottom: "12px" }}>
                <h4
                    style={{
                        margin: "0 0 6px 0",
                        fontSize: "0.95rem",
                        fontWeight: "700",
                        color: "#0f172a",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                    }}
                >
                    I. Asesmen 4 Indikator Klinis Motorik Halus (Bagian I)
                </h4>
                <div style={{ overflowX: "auto", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#ffffff" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#f1f5f9", borderBottom: "1px solid #cbd5e1", color: "#334155" }}>
                                <th style={{ padding: "8px 10px", width: "36px", textAlign: "center" }}>No</th>
                                <th style={{ padding: "8px 10px" }}>Indikator Klinis</th>
                                <th style={{ padding: "8px 10px", width: "60px", textAlign: "center" }}>BB (1)</th>
                                <th style={{ padding: "8px 10px", width: "60px", textAlign: "center" }}>MB (2)</th>
                                <th style={{ padding: "8px 10px", width: "60px", textAlign: "center" }}>BSH (3)</th>
                                <th style={{ padding: "8px 10px", width: "60px", textAlign: "center" }}>BSB (4)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {indTable.map((item, i) => (
                                <tr key={i} style={{ borderBottom: i < 3 ? "1px solid #e2e8f0" : "none" }}>
                                    <td style={{ padding: "8px 10px", textAlign: "center", color: "#64748b" }}>{item.no || i + 1}</td>
                                    <td style={{ padding: "8px 10px", color: "#1e293b", fontWeight: "500" }}>{item.nama}</td>
                                    <td
                                        style={{
                                            padding: "8px 10px",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                            color: item.level === "BB" ? "#dc2626" : "#cbd5e1",
                                        }}
                                    >
                                        {item.level === "BB" ? "✓" : "-"}
                                    </td>
                                    <td
                                        style={{
                                            padding: "8px 10px",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                            color: item.level === "MB" ? "#d97706" : "#cbd5e1",
                                        }}
                                    >
                                        {item.level === "MB" ? "✓" : "-"}
                                    </td>
                                    <td
                                        style={{
                                            padding: "8px 10px",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                            color: item.level === "BSH" ? "#16a34a" : "#cbd5e1",
                                        }}
                                    >
                                        {item.level === "BSH" ? "✓" : "-"}
                                    </td>
                                    <td
                                        style={{
                                            padding: "8px 10px",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                            color: item.level === "BSB" ? "#2563eb" : "#cbd5e1",
                                        }}
                                    >
                                        {item.level === "BSB" ? "✓" : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <small style={{ color: "#64748b", fontSize: "0.78rem", display: "block", marginTop: "4px" }}>
                    *Keterangan: BB (Belum Berkembang), MB (Mulai Berkembang), BSH (Berkembang Sesuai Harapan), BSB (Berkembang Sangat Baik)
                </small>
            </div>

            {/* BAGIAN III: KESIMPULAN PERKEMBANGAN */}
            <div style={{ marginTop: "12px", marginBottom: "12px" }}>
                <h4
                    style={{
                        margin: "0 0 8px 0",
                        fontSize: "0.95rem",
                        fontWeight: "700",
                        color: "#0f172a",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                    }}
                >
                    II. Kesimpulan Asesmen Perkembangan (Bagian III)
                </h4>

                {/* Pertanyaan 1: Menulis */}
                <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "8px" }}>
                    <p style={{ margin: "0 0 6px 0", fontWeight: "600", fontSize: "0.88rem", color: "#1e293b" }}>
                        1) Apakah kemampuan menulis anak sudah sesuai dengan perkembangan usianya?
                    </p>
                    <div style={{ display: "flex", gap: "20px", marginBottom: "6px", fontSize: "0.85rem", fontWeight: "600" }}>
                        <span style={{ color: isYa ? "#15803d" : "#94a3b8" }}>
                            {isYa ? "[✓]" : "[  ]"} Sesuai Usia (Ya)
                        </span>
                        <span style={{ color: !isYa ? "#b91c1c" : "#94a3b8" }}>
                            {!isYa ? "[✓]" : "[  ]"} Belum Sesuai (Tidak)
                        </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#475569", fontStyle: "italic" }}>
                        <strong>Mohon sertakan alasannya:</strong> "{result.kesimpulan_menulis?.alasan || result.alasan_klinis || "-"}"
                    </p>
                </div>

                {/* Pertanyaan 2: Menggambar */}
                <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: "0 0 6px 0", fontWeight: "600", fontSize: "0.88rem", color: "#1e293b" }}>
                        2) Apakah kemampuan menggambar anak sudah sesuai dengan perkembangan usianya?
                    </p>
                    <div style={{ display: "flex", gap: "20px", marginBottom: "6px", fontSize: "0.85rem", fontWeight: "600" }}>
                        <span style={{ color: isYa ? "#15803d" : "#94a3b8" }}>
                            {isYa ? "[✓]" : "[  ]"} Sesuai Usia (Ya)
                        </span>
                        <span style={{ color: !isYa ? "#b91c1c" : "#94a3b8" }}>
                            {!isYa ? "[✓]" : "[  ]"} Belum Sesuai (Tidak)
                        </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#475569", fontStyle: "italic" }}>
                        <strong>Mohon sertakan alasannya:</strong> "{result.kesimpulan_menggambar?.alasan || result.alasan_klinis || "-"}"
                    </p>
                </div>
            </div>

            {/* REKOMENDASI STIMULASI GURU & ORANG TUA */}
            {result.saran_guru && (
                <div
                    style={{
                        margin: "10px 0 4px 0",
                        fontSize: "0.85rem",
                        color: "#1e3a8a",
                        background: "#f0fdf4",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        borderLeft: "4px solid #22c55e",
                        lineHeight: "1.4",
                    }}
                >
                    💡 <strong>Rekomendasi Stimulasi Guru & Orang Tua:</strong> {result.saran_guru}
                </div>
            )}

            {/* CATATAN GURU (JIKA ADA) */}
            {result.teacher_notes && (
                <div
                    style={{
                        margin: "8px 0 4px 0",
                        fontSize: "0.84rem",
                        color: "#334155",
                        background: "#fffbeb",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        borderLeft: "4px solid #f59e0b",
                        lineHeight: "1.45",
                    }}
                >
                    📝 <strong>Catatan Observasi Guru:</strong> {result.teacher_notes}
                </div>
            )}

            {/* PENGINGAT JADWAL ASESMEN BERIKUTNYA (JIKA BARU SELESAI ASESMEN) */}
            {result.next_assessment_date && (
                <div
                    style={{
                        margin: "8px 0 2px 0",
                        fontSize: "0.82rem",
                        color: "#0f766e",
                        background: "#f0fdfa",
                        padding: "9px 14px",
                        borderRadius: "8px",
                        border: "1px solid #99f6e4",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <span>🔔</span>
                    <span>
                        <strong>Jadwal Pengingat Asesmen Berkala Berikutnya:</strong> {result.next_assessment_date} (Otomatis +30 hari)
                    </span>
                </div>
            )}
        </div>
    );
}
