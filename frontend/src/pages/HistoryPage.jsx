import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

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
            {/* alien mungil di dalam kubah */}
            <circle cx="42" cy="19" r="8" fill="#7fcf6a" />
            <ellipse cx="38.5" cy="18" rx="2.2" ry="1.5" fill="#14202a" />
            <ellipse cx="45.5" cy="18" rx="2.2" ry="1.5" fill="#14202a" />
            {/* kubah */}
            <path d="M22 29 C22 6 62 6 62 29Z" fill="url(#ufoDome)" stroke="#fff" strokeWidth="1.2" />
            {/* badan piring */}
            <ellipse cx="42" cy="33" rx="38" ry="11" fill="url(#ufoBody)" stroke="#d7dce2" strokeWidth="1.2" />
            {/* lampu */}
            <circle cx="16" cy="35" r="2.4" fill="#e8734a" />
            <circle cx="29" cy="38" r="2.4" fill="#ffdd8a" />
            <circle cx="42" cy="39" r="2.4" fill="#6fe0bc" />
            <circle cx="55" cy="38" r="2.4" fill="#ffdd8a" />
            <circle cx="68" cy="35" r="2.4" fill="#e8734a" />
            {/* kaki */}
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
            {/* antena */}
            <path d="M22 12 C18 8 16 5 14 3" stroke="#4c9a4f" strokeWidth="2" strokeLinecap="round" />
            <circle cx="13" cy="3" r="3" fill="#e8734a" />
            <path d="M42 12 C46 8 48 5 50 3" stroke="#4c9a4f" strokeWidth="2" strokeLinecap="round" />
            <circle cx="51" cy="3" r="3" fill="#ffdd8a" />
            {/* kaki */}
            <path d="M26 72 L24 87" stroke="#7fcf6a" strokeWidth="6" strokeLinecap="round" />
            <path d="M38 72 L40 87" stroke="#7fcf6a" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="22" cy="91" rx="7" ry="4" fill="#2f6f6b" />
            <ellipse cx="42" cy="91" rx="7" ry="4" fill="#2f6f6b" />
            {/* tangan kiri (turun) */}
            <path d="M18 52 C10 56 8 64 10 70" stroke="#7fcf6a" strokeWidth="5" strokeLinecap="round" />
            <circle cx="10" cy="71" r="3.5" fill="#7fcf6a" />
            {/* tangan kanan (melambai) */}
            <path d="M46 52 C54 46 57 40 56 34" stroke="#7fcf6a" strokeWidth="5" strokeLinecap="round" />
            <circle cx="56" cy="32" r="3.5" fill="#7fcf6a" />
            {/* badan */}
            <rect x="18" y="46" width="28" height="32" rx="12" fill="#2f6f6b" />
            <rect x="24" y="54" width="16" height="10" rx="4" fill="#e8734a" />
            <circle cx="28" cy="59" r="1.5" fill="#fff" />
            <circle cx="36" cy="59" r="1.5" fill="#6fe0bc" />
            {/* kepala */}
            <ellipse cx="32" cy="28" rx="20" ry="22" fill="url(#alienSkin)" />
            {/* mata */}
            <path d="M16 24 C20 22 26 26 27 32 C22 34 16 30 16 24Z" fill="#14202a" />
            <path d="M48 24 C44 22 38 26 37 32 C42 34 48 30 48 24Z" fill="#14202a" />
            <ellipse cx="21" cy="26" rx="1.6" ry="1" fill="#fff" />
            <ellipse cx="43" cy="26" rx="1.6" ry="1" fill="#fff" />
            {/* mulut */}
            <path d="M27 42 Q32 46 37 42" stroke="#2f6f3a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
    );
}

const STAR_COUNT = 24;

function HistoryPage() {
    const navigate = useNavigate();
    const toast = useToast();
    // useMemo biar objek user nggak dibuat ulang tiap render (sebelumnya bikin useEffect looping)
    const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setHistoryList([
                    {
                        id: 1,
                        date: "2026-03-28 10:30",
                        school_name: user.school_name || "Yadika",
                        grade_class: "XII IPA 1",
                        total_students: 25,
                        status: "Selesai"
                    },
                    {
                        id: 2,
                        date: "2026-03-27 14:15",
                        school_name: user.school_name || "Yadika",
                        grade_class: "XII IPA 2",
                        total_students: 28,
                        status: "Selesai"
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, navigate]);

    return (
        <main className="history-page">

            <section className="history-hero">
                {/* starfield */}
                {Array.from({ length: STAR_COUNT }, (_, i) => (
                    <span key={i} className={`az-star az-star-${i + 1}`}></span>
                ))}
                {/* planets */}
                <span className="az-planet az-planet-1"></span>
                <span className="az-planet az-planet-2"></span>
                <span className="az-planet az-planet-3"></span>
                <span className="az-planet az-planet-4"></span>
                <span className="az-planet az-planet-5"></span>
                <span className="az-planet az-planet-6"></span>
                {/* matahari & bumi */}
                <span className="az-sun"></span>
                <span className="az-earth"></span>
                {/* astronaut */}
                <span className="az-astronaut az-astronaut-1"><AstronautIcon /></span>
                {/* pesawat (kanan ke kiri, jalur atas) */}
                <span className="az-spaceship"><SpaceshipIcon /></span>
                {/* ufo (kiri ke kanan, jalur bawah) */}
                <span className="az-ufo"><UfoIcon /></span>
                {/* alien (kanan) */}
                <span className="az-alien"><AlienIcon /></span>
                {/* meteors */}
                <span className="az-meteor az-meteor-1"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-2"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-3"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-4"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-5"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-6"><span className="az-meteor-line"></span></span>
                {/* orbit rings */}
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
                                        onClick={() => navigate(`/history/${item.id}`)}
                                    >
                                        Lihat Detail
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </section>

        </main>
    );
}

export default HistoryPage;