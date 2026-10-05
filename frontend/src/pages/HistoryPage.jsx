import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { TYPE_INFO } from "../constants/typeInfo";

function XIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function AlertCircleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}

function FileTextIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    );
}

function AstronautIcon() {
    return (
        <svg width="56" height="72" viewBox="0 0 56 72" fill="none">
            <rect x="6" y="26" width="10" height="24" rx="4" fill="#c7cdd6" stroke="#9aa3af" strokeWidth="1" />
            <rect x="40" y="26" width="10" height="24" rx="4" fill="#c7cdd6" stroke="#9aa3af" strokeWidth="1" />
            <path d="M14 30 C6 34 4 44 10 50" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="10" cy="50" r="5.5" fill="#e8734a" />
            <path d="M42 30 C50 34 52 44 46 50" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="46" cy="50" r="5.5" fill="#e8734a" />
            <path d="M22 56 C20 62 20 66 22 70" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M34 56 C36 62 36 66 34 70" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <ellipse cx="22" cy="70" rx="6" ry="4" fill="#2f6f6b" />
            <ellipse cx="34" cy="70" rx="6" ry="4" fill="#2f6f6b" />
            <rect x="12" y="24" width="32" height="34" rx="16" fill="#f4f6f8" stroke="#d7dce2" strokeWidth="1.5" />
            <rect x="20" y="34" width="16" height="12" rx="4" fill="#e8734a" />
            <circle cx="24" cy="40" r="1.6" fill="#fff" />
            <circle cx="32" cy="40" r="1.6" fill="#6fe0bc" />
            <circle cx="28" cy="16" r="15" fill="#f4f6f8" stroke="#d7dce2" strokeWidth="1.5" />
            <circle cx="28" cy="16" r="11" fill="url(#astroGlass)" />
            <ellipse cx="24" cy="11" rx="3.5" ry="2.4" fill="rgba(255,255,255,0.75)" />
            <defs>
                <radialGradient id="astroGlass" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#bfe3f7" />
                    <stop offset="55%" stopColor="#5fa8d3" />
                    <stop offset="100%" stopColor="#2c5f82" />
                </radialGradient>
            </defs>
        </svg>
    );
}

function SpaceshipIcon() {
    return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <defs>
                <linearGradient id="flameGrad" x1="30" y1="46" x2="30" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffdd8a" />
                    <stop offset="60%" stopColor="#f2a05a" />
                    <stop offset="100%" stopColor="#e8734a" />
                </linearGradient>
                <radialGradient id="winGrad" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#bfe3f7" />
                    <stop offset="60%" stopColor="#3d8783" />
                    <stop offset="100%" stopColor="#1e4c48" />
                </radialGradient>
            </defs>
            <path d="M30 46 C26 52 26 58 30 60 C34 58 34 52 30 46Z" fill="url(#flameGrad)" />
            <path d="M30 4 C40 14 42 28 40 42 L20 42 C18 28 20 14 30 4Z" fill="#f4f6f8" stroke="#d7dce2" strokeWidth="1.5" />
            <path d="M30 4 C34 9 36 15 36.5 20 L23.5 20 C24 15 26 9 30 4Z" fill="#e8734a" />
            <circle cx="30" cy="24" r="6" fill="url(#winGrad)" stroke="#fff" strokeWidth="1.5" />
            <path d="M20 42 L10 52 L20 50Z" fill="#2f6f6b" />
            <path d="M40 42 L50 52 L40 50Z" fill="#2f6f6b" />
            <rect x="20" y="38" width="20" height="5" rx="2" fill="#e3e8ec" />
        </svg>
    );
}

function UfoIcon() {
    return (
        <svg width="84" height="52" viewBox="0 0 84 52" fill="none">
            <defs>
                <radialGradient id="ufoDome" cx="35%" cy="30%" r="80%">
                    <stop offset="0%" stopColor="#dff6ff" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#7fd1e8" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#3d8783" stopOpacity="0.85" />
                </radialGradient>
                <linearGradient id="ufoBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eef1f4" />
                    <stop offset="100%" stopColor="#8a97a6" />
                </linearGradient>
            </defs>
            <circle cx="42" cy="19" r="8" fill="#7fcf6a" />
            <ellipse cx="38.5" cy="18" rx="2.2" ry="1.5" fill="#14202a" />
            <ellipse cx="45.5" cy="18" rx="2.2" ry="1.5" fill="#14202a" />
            <path d="M22 29 C22 6 62 6 62 29Z" fill="url(#ufoDome)" stroke="#fff" strokeWidth="1.2" />
            <ellipse cx="42" cy="33" rx="38" ry="11" fill="url(#ufoBody)" stroke="#d7dce2" strokeWidth="1.2" />
            <circle cx="16" cy="35" r="2.4" fill="#e8734a" />
            <circle cx="29" cy="38" r="2.4" fill="#ffdd8a" />
            <circle cx="42" cy="39" r="2.4" fill="#6fe0bc" />
            <circle cx="55" cy="38" r="2.4" fill="#ffdd8a" />
            <circle cx="68" cy="35" r="2.4" fill="#e8734a" />
            <path d="M32 43 L28 50 M52 43 L56 50" stroke="#8a97a6" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
    );
}

function AlienIcon() {
    return (
        <svg width="64" height="96" viewBox="0 0 64 96" fill="none">
            <defs>
                <radialGradient id="alienSkin" cx="40%" cy="30%" r="80%">
                    <stop offset="0%" stopColor="#c4f29a" />
                    <stop offset="60%" stopColor="#7fcf6a" />
                    <stop offset="100%" stopColor="#4c9a4f" />
                </radialGradient>
            </defs>
            <path d="M22 12 C18 8 16 5 14 3" stroke="#4c9a4f" strokeWidth="2" strokeLinecap="round" />
            <circle cx="13" cy="3" r="3" fill="#e8734a" />
            <path d="M42 12 C46 8 48 5 50 3" stroke="#4c9a4f" strokeWidth="2" strokeLinecap="round" />
            <circle cx="51" cy="3" r="3" fill="#ffdd8a" />
            <path d="M26 72 L24 87" stroke="#7fcf6a" strokeWidth="6" strokeLinecap="round" />
            <path d="M38 72 L40 87" stroke="#7fcf6a" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="22" cy="91" rx="7" ry="4" fill="#2f6f6b" />
            <ellipse cx="42" cy="91" rx="7" ry="4" fill="#2f6f6b" />
            <path d="M18 52 C10 56 8 64 10 70" stroke="#7fcf6a" strokeWidth="5" strokeLinecap="round" />
            <circle cx="10" cy="71" r="3.5" fill="#7fcf6a" />
            <path d="M46 52 C54 46 57 40 56 34" stroke="#7fcf6a" strokeWidth="5" strokeLinecap="round" />
            <circle cx="56" cy="32" r="3.5" fill="#7fcf6a" />
            <rect x="18" y="46" width="28" height="32" rx="12" fill="#2f6f6b" />
            <rect x="24" y="54" width="16" height="10" rx="4" fill="#e8734a" />
            <circle cx="28" cy="59" r="1.5" fill="#fff" />
            <circle cx="36" cy="59" r="1.5" fill="#6fe0bc" />
            <ellipse cx="32" cy="28" rx="20" ry="22" fill="url(#alienSkin)" />
            <path d="M16 24 C20 22 26 26 27 32 C22 34 16 30 16 24Z" fill="#14202a" />
            <path d="M48 24 C44 22 38 26 37 32 C42 34 48 30 48 24Z" fill="#14202a" />
            <ellipse cx="21" cy="26" rx="1.6" ry="1" fill="#fff" />
            <ellipse cx="43" cy="26" rx="1.6" ry="1" fill="#fff" />
            <path d="M27 42 Q32 46 37 42" stroke="#2f6f3a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
    );
}

const STAR_COUNT = 24;

function HistoryPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sessionDetails, setSessionDetails] = useState({});

    // State untuk Modal Detail Sesi
    const [activeModalSession, setActiveModalSession] = useState(null);
    const [activeModalStudents, setActiveModalStudents] = useState([]);
    const [activeStudentIndex, setActiveStudentIndex] = useState(0);
    const [loadingSessionModal, setLoadingSessionModal] = useState(false);

    useEffect(() => {
        if (!user || user.role !== "guru") {
            toast.error("Akses ditolak. Halaman ini hanya untuk guru.");
            navigate("/");
            return;
        }

        const fetchHistory = async () => {
            try {
                const response = await fetch(`http://localhost:8000/analysis-history?user_id=${user.id}`);
                const data = await response.json();
                if (response.ok) {
                    setHistoryList(data);
                }
            } catch (error) {
                console.error("Gagal mengambil data riwayat:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, navigate, toast]);

    const handleOpenSessionModal = async (sessionItem) => {
        setActiveModalSession(sessionItem);
        setActiveStudentIndex(0);

        if (sessionDetails[sessionItem.id]) {
            setActiveModalStudents(sessionDetails[sessionItem.id].students || []);
            return;
        }

        setLoadingSessionModal(true);
        try {
            const res = await fetch(`http://localhost:8000/analysis-history/${sessionItem.id}`);
            const data = await res.json();
            if (res.ok) {
                setSessionDetails((prev) => ({ ...prev, [sessionItem.id]: data }));
                setActiveModalStudents(data.students || []);
            } else {
                toast.error(data.detail || "Gagal memuat detail sesi analisis.");
                setActiveModalSession(null);
            }
        } catch (err) {
            console.error("Gagal memuat detail sesi:", err);
            toast.error("Tidak dapat terhubung ke server.");
            setActiveModalSession(null);
        } finally {
            setLoadingSessionModal(false);
        }
    };

    const handleCloseModal = () => {
        setActiveModalSession(null);
        setActiveModalStudents([]);
        setActiveStudentIndex(0);
    };

    const currentStudent = activeModalStudents[activeStudentIndex] || null;
    const info = currentStudent ? TYPE_INFO[Number(currentStudent.pred_type)] : null;
    const confidence = currentStudent ? Math.max(0, Math.min(100, Number(currentStudent.confidence) || 0)) : 0;
    const top3 = currentStudent && Array.isArray(currentStudent.top3) ? currentStudent.top3 : [];
    const maxProb = top3.length ? Math.max(...top3.map((p) => Number(p.prob) || 0), 1) : 1;
    const traits = info?.traits || [];
    const recommendations = info?.tips || [];
    const interpretation = currentStudent?.description || info?.description;

    return (
        <main className="history-page">

            <section className="history-hero">
                {Array.from({ length: STAR_COUNT }, (_, i) => (
                    <span key={i} className={`az-star az-star-${i + 1}`}></span>
                ))}
                <span className="az-planet az-planet-1"></span>
                <span className="az-planet az-planet-2"></span>
                <span className="az-planet az-planet-3"></span>
                <span className="az-planet az-planet-4"></span>
                <span className="az-planet az-planet-5"></span>
                <span className="az-planet az-planet-6"></span>
                <span className="az-sun"></span>
                <span className="az-earth"></span>
                <span className="az-astronaut az-astronaut-1"><AstronautIcon /></span>
                <span className="az-spaceship"><SpaceshipIcon /></span>
                <span className="az-ufo"><UfoIcon /></span>
                <span className="az-alien"><AlienIcon /></span>
                <span className="az-meteor az-meteor-1"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-2"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-3"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-4"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-5"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-6"><span className="az-meteor-line"></span></span>
                <span className="hero-ring-a"></span>
                <span className="hero-ring-b"></span>

                <h1>Riwayat Analisis Tulisan Tangan</h1>
                <p>Daftar hasil analisis kelas yang pernah di-generate sebelumnya.</p>
            </section>

            <section className="history-container">

                {loading ? (
                    <div className="history-loading">
                        <span className="history-spinner" />
                        <p>Memuat riwayat...</p>
                    </div>
                ) : historyList.length === 0 ? (
                    <div className="history-empty">
                        <p>Belum ada riwayat analisis yang tersimpan.</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {historyList.map((item) => (
                            <div key={item.id} className="history-item">
                                <div className="history-item-info">
                                    <h3>Kelas: {item.grade_class}</h3>
                                    <p className="history-item-school">Sekolah: {item.school_name}</p>
                                    <p className="history-item-date">Waktu: {item.date}</p>
                                </div>

                                <div className="history-item-side">
                                    <span className="history-badge">
                                        {item.total_students} Siswa
                                    </span>
                                    <button
                                        type="button"
                                        className="history-detail-btn"
                                        onClick={() => handleOpenSessionModal(item)}
                                    >
                                        Lihat Detail Sesi
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </section>

            {/* Modal Detail Analisis Siswa */}
            {activeModalSession && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(8, 12, 22, 0.85)",
                        backdropFilter: "blur(10px)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px"
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        style={{
                            background: "linear-gradient(150deg, #182338, #0e1626)",
                            borderRadius: "20px",
                            maxWidth: "780px",
                            width: "100%",
                            maxHeight: "92vh",
                            overflowY: "auto",
                            padding: "28px",
                            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.65), 0 0 25px rgba(111, 224, 188, 0.12)",
                            border: "1px solid rgba(255, 255, 255, 0.14)",
                            color: "#f8fafc",
                            position: "relative"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                            <div>
                                <span style={{ fontSize: "0.78rem", color: "#6fe0bc", textTransform: "uppercase", letterSpacing: "1.2px", fontWeight: "700" }}>
                                    DETAIL ANALISIS SISWA · {activeModalSession.grade_class} ({activeModalSession.school_name})
                                </span>
                                {currentStudent && (
                                    <h2 style={{ margin: "6px 0 0 0", fontSize: "1.45rem", color: "#fff", fontWeight: "700" }}>
                                        No. {currentStudent.absence_number} - {currentStudent.student_name}
                                    </h2>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                style={{
                                    background: "rgba(255, 255, 255, 0.1)",
                                    border: "none",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: "34px",
                                    height: "34px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    transition: "background 0.2s"
                                }}
                                aria-label="Tutup"
                            >
                                <XIcon />
                            </button>
                        </div>

                        {loadingSessionModal ? (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <span className="history-spinner" style={{ margin: "0 auto 12px auto" }} />
                                <p style={{ color: "#94a3b8", margin: 0 }}>Memuat detail analisis siswa...</p>
                            </div>
                        ) : activeModalStudents.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8" }}>
                                <p>Tidak ada data siswa dalam sesi ini.</p>
                            </div>
                        ) : (
                            <>
                                {/* Bilah Selektor Tab/Pills Jika Lebih Dari 1 Siswa */}
                                {activeModalStudents.length > 1 && (
                                    <div style={{ marginBottom: "22px" }}>
                                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "8px", fontWeight: "600" }}>
                                            Pilih Siswa ({activeModalStudents.length} Siswa):
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "8px",
                                                overflowX: "auto",
                                                paddingBottom: "6px",
                                                scrollbarWidth: "thin"
                                            }}
                                        >
                                            {activeModalStudents.map((st, idx) => {
                                                const isActive = idx === activeStudentIndex;
                                                return (
                                                    <button
                                                        key={st.id || idx}
                                                        type="button"
                                                        onClick={() => setActiveStudentIndex(idx)}
                                                        style={{
                                                            background: isActive ? "linear-gradient(135deg, #14b8a6, #0f766e)" : "rgba(255, 255, 255, 0.06)",
                                                            color: isActive ? "#ffffff" : "#cbd5e1",
                                                            border: isActive ? "1.5px solid #5eead4" : "1px solid rgba(255, 255, 255, 0.1)",
                                                            borderRadius: "20px",
                                                            padding: "7px 15px",
                                                            fontSize: "0.82rem",
                                                            fontWeight: isActive ? "700" : "500",
                                                            cursor: "pointer",
                                                            whiteSpace: "nowrap",
                                                            transition: "all 0.15s ease",
                                                            boxShadow: isActive ? "0 0 14px rgba(94, 234, 212, 0.35)" : "none"
                                                        }}
                                                    >
                                                        No. {st.absence_number} · {st.student_name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {currentStudent && (
                                    <>
                                        {/* Dua Kolom: Sampel Tulisan Tangan & Hasil Prediksi AI */}
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: currentStudent.image_path ? "repeat(auto-fit, minmax(290px, 1fr))" : "1fr",
                                                gap: "18px",
                                                marginBottom: "20px"
                                            }}
                                        >
                                            {/* Kolom 1: Sampel Tulisan Tangan */}
                                            {currentStudent.image_path && (
                                                <div
                                                    style={{
                                                        background: "rgba(0, 0, 0, 0.3)",
                                                        borderRadius: "12px",
                                                        padding: "14px",
                                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <span style={{ fontSize: "0.74rem", color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "700", marginBottom: "10px", alignSelf: "flex-start" }}>
                                                        SAMPEL TULISAN TANGAN
                                                    </span>
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            height: "190px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            background: "#0a0f1d",
                                                            borderRadius: "8px",
                                                            overflow: "hidden"
                                                        }}
                                                    >
                                                        <img
                                                            src={`http://localhost:8000${currentStudent.image_path}`}
                                                            alt={`Tulisan tangan ${currentStudent.student_name}`}
                                                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                                        />
                                                    </div>
                                                    <span style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "8px" }}>
                                                        Sampel foto yang dianalisis oleh AI
                                                    </span>
                                                </div>
                                            )}

                                            {/* Kolom 2: Hasil Prediksi AI */}
                                            <div
                                                style={{
                                                    background: "rgba(232, 115, 74, 0.08)",
                                                    borderRadius: "12px",
                                                    padding: "18px",
                                                    border: "1px solid rgba(232, 115, 74, 0.28)",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between"
                                                }}
                                            >
                                                <div>
                                                    <span style={{ fontSize: "0.74rem", color: "#ffaa8a", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "700" }}>
                                                        HASIL PREDIKSI AI
                                                    </span>

                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                                                        <span
                                                            style={{
                                                                background: "#e8734a",
                                                                color: "#fff",
                                                                fontSize: "1.45rem",
                                                                fontWeight: "800",
                                                                padding: "6px 14px",
                                                                borderRadius: "10px",
                                                                boxShadow: "0 4px 10px rgba(232, 115, 74, 0.35)"
                                                            }}
                                                        >
                                                            {currentStudent.pred_type}
                                                        </span>
                                                        <div>
                                                            <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#fff", fontWeight: "700" }}>
                                                                Tipe {currentStudent.pred_type}
                                                            </h3>
                                                            <p style={{ margin: "2px 0 0 0", color: "#cbd5e1", fontSize: "0.95rem" }}>
                                                                {currentStudent.type_name || info?.name}
                                                                {info?.label && <em style={{ fontStyle: "normal", color: "#6fe0bc" }}> · {info.label}</em>}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {info?.tagline && (
                                                        <p style={{ margin: "10px 0 10px 0", color: "#e2e8f0", fontSize: "0.88rem", fontStyle: "italic" }}>
                                                            "{info.tagline}"
                                                        </p>
                                                    )}

                                                    {/* Badge Sifat / Traits */}
                                                    {traits.length > 0 && (
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                                                            {traits.map((tr) => (
                                                                <span
                                                                    key={tr}
                                                                    style={{
                                                                        background: "rgba(255, 255, 255, 0.08)",
                                                                        color: "#e2e8f0",
                                                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                                                        borderRadius: "14px",
                                                                        padding: "3px 10px",
                                                                        fontSize: "0.78rem",
                                                                        fontWeight: "500"
                                                                    }}
                                                                >
                                                                    {tr}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: "16px",
                                                        background: "rgba(0, 0, 0, 0.28)",
                                                        borderRadius: "8px",
                                                        padding: "10px 14px",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Tingkat Keyakinan AI:</span>
                                                    <strong style={{ color: "#6fe0bc", fontSize: "1.15rem" }}>
                                                        {confidence.toFixed(1)}%
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section: Interpretasi Kepribadian */}
                                        {interpretation && (
                                            <div
                                                style={{
                                                    background: "rgba(255, 255, 255, 0.04)",
                                                    borderRadius: "12px",
                                                    padding: "16px 18px",
                                                    marginBottom: "18px",
                                                    border: "1px solid rgba(255, 255, 255, 0.08)"
                                                }}
                                            >
                                                <h4 style={{ margin: "0 0 8px 0", color: "#6fe0bc", fontSize: "0.95rem", fontWeight: "700" }}>
                                                    Interpretasi Kepribadian
                                                </h4>
                                                <p style={{ margin: 0, color: "#e2e8f0", fontSize: "0.9rem", lineHeight: "1.6" }}>
                                                    {interpretation}
                                                </p>
                                            </div>
                                        )}

                                        {/* Section: Kekuatan & Tantangan Side-by-Side */}
                                        {info && (
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                                                    gap: "14px",
                                                    marginBottom: "18px"
                                                }}
                                            >
                                                {/* Kekuatan */}
                                                <div
                                                    style={{
                                                        background: "rgba(16, 185, 129, 0.08)",
                                                        borderRadius: "12px",
                                                        padding: "16px",
                                                        border: "1px solid rgba(16, 185, 129, 0.28)",
                                                        display: "flex",
                                                        gap: "12px",
                                                        alignItems: "flex-start"
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            background: "rgba(16, 185, 129, 0.2)",
                                                            color: "#34d399",
                                                            borderRadius: "50%",
                                                            width: "30px",
                                                            height: "30px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        <CheckIcon />
                                                    </span>
                                                    <div>
                                                        <h5 style={{ margin: "0 0 4px 0", color: "#34d399", fontSize: "0.92rem", fontWeight: "700" }}>
                                                            Kekuatan
                                                        </h5>
                                                        <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.86rem", lineHeight: "1.5" }}>
                                                            {info.strengths}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Tantangan */}
                                                <div
                                                    style={{
                                                        background: "rgba(249, 115, 22, 0.08)",
                                                        borderRadius: "12px",
                                                        padding: "16px",
                                                        border: "1px solid rgba(249, 115, 22, 0.28)",
                                                        display: "flex",
                                                        gap: "12px",
                                                        alignItems: "flex-start"
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            background: "rgba(249, 115, 22, 0.2)",
                                                            color: "#fb923c",
                                                            borderRadius: "50%",
                                                            width: "30px",
                                                            height: "30px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        <AlertCircleIcon />
                                                    </span>
                                                    <div>
                                                        <h5 style={{ margin: "0 0 4px 0", color: "#fb923c", fontSize: "0.92rem", fontWeight: "700" }}>
                                                            Tantangan
                                                        </h5>
                                                        <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.86rem", lineHeight: "1.5" }}>
                                                            {info.challenges}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Section: Peringkat Kemungkinan Tipe (Progress Bar Horizontal) */}
                                        {top3.length > 0 && (
                                            <div
                                                style={{
                                                    background: "rgba(255, 255, 255, 0.03)",
                                                    borderRadius: "12px",
                                                    padding: "16px 18px",
                                                    marginBottom: "18px",
                                                    border: "1px solid rgba(255, 255, 255, 0.08)"
                                                }}
                                            >
                                                <h4 style={{ margin: "0 0 2px 0", color: "#fff", fontSize: "0.95rem", fontWeight: "700" }}>
                                                    Peringkat Kemungkinan Tipe
                                                </h4>
                                                <p style={{ margin: "0 0 14px 0", color: "#94a3b8", fontSize: "0.8rem" }}>
                                                    Tiga tipe dengan probabilitas tertinggi menurut model AI.
                                                </p>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                    {top3.map((t, idx) => {
                                                        const prob = Number(t.prob) || 0;
                                                        const isTop = idx === 0;
                                                        return (
                                                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                                <span
                                                                    style={{
                                                                        background: isTop ? "#6fe0bc" : "rgba(255, 255, 255, 0.1)",
                                                                        color: isTop ? "#0f172a" : "#cbd5e1",
                                                                        borderRadius: "6px",
                                                                        padding: "2px 8px",
                                                                        fontSize: "0.78rem",
                                                                        fontWeight: "700",
                                                                        minWidth: "28px",
                                                                        textAlign: "center"
                                                                    }}
                                                                >
                                                                    #{idx + 1}
                                                                </span>
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                                                                        <strong style={{ color: isTop ? "#fff" : "#cbd5e1" }}>
                                                                            Tipe {t.type} {t.name ? `· ${t.name}` : ""}
                                                                        </strong>
                                                                        <span style={{ color: isTop ? "#6fe0bc" : "#94a3b8", fontWeight: "600" }}>
                                                                            {prob.toFixed(1)}%
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            background: "rgba(255, 255, 255, 0.08)",
                                                                            borderRadius: "4px",
                                                                            height: "7px",
                                                                            overflow: "hidden"
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                width: `${(prob / maxProb) * 100}%`,
                                                                                height: "100%",
                                                                                background: isTop ? "linear-gradient(90deg, #2f6f6b, #6fe0bc)" : "rgba(255, 255, 255, 0.3)",
                                                                                borderRadius: "4px",
                                                                                transition: "width 0.4s ease"
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Section: Rekomendasi Pengembangan Diri */}
                                        {recommendations.length > 0 && (
                                            <div
                                                style={{
                                                    background: "rgba(255, 255, 255, 0.03)",
                                                    borderRadius: "12px",
                                                    padding: "16px 18px",
                                                    marginBottom: "22px",
                                                    border: "1px solid rgba(255, 255, 255, 0.08)"
                                                }}
                                            >
                                                <h4 style={{ margin: "0 0 12px 0", color: "#6fe0bc", fontSize: "0.95rem", fontWeight: "700" }}>
                                                    Rekomendasi Pengembangan Diri
                                                </h4>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                    {recommendations.map((rec, i) => (
                                                        <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                                            <span
                                                                style={{
                                                                    background: "rgba(111, 224, 188, 0.15)",
                                                                    color: "#6fe0bc",
                                                                    borderRadius: "50%",
                                                                    width: "24px",
                                                                    height: "24px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontSize: "0.78rem",
                                                                    fontWeight: "700",
                                                                    flexShrink: 0
                                                                }}
                                                            >
                                                                {i + 1}
                                                            </span>
                                                            <p style={{ margin: 0, color: "#e2e8f0", fontSize: "0.88rem", lineHeight: "1.5" }}>
                                                                {rec}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Footer Action: SATU tombol Download PDF */}
                                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px" }}>
                                            <button
                                                type="button"
                                                onClick={() => window.print()}
                                                style={{
                                                    background: "linear-gradient(135deg, #2f6f6b, #3d8783)",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    padding: "11px 26px",
                                                    borderRadius: "10px",
                                                    fontWeight: "600",
                                                    fontSize: "0.92rem",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    cursor: "pointer",
                                                    boxShadow: "0 4px 14px rgba(47, 111, 107, 0.4)",
                                                    transition: "all 0.15s ease"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "translateY(-1px)";
                                                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(47, 111, 107, 0.5)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "translateY(0)";
                                                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(47, 111, 107, 0.4)";
                                                }}
                                            >
                                                <FileTextIcon />
                                                Download PDF
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

        </main>
    );
}

export default HistoryPage;