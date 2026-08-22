import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

function HistoryPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
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