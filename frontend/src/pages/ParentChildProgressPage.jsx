import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { authFetch, extractErrorMessage } from "../config/api";
import StudentProgressView from "../components/StudentProgressView";

export default function ParentChildProgressPage() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [user] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            toast.error("Silakan masuk terlebih dahulu untuk melihat rapor perkembangan anak.");
            navigate("/login");
            return;
        }
        let active = true;
        const initLoad = async () => {
            try {
                const res = await authFetch(`/parent/children/${studentId}/progress`);
                const data = await res.json().catch(() => ({}));
                if (!active) return;
                if (res.ok) {
                    setProgressData(data);
                } else {
                    toast.error(extractErrorMessage(data, `Gagal memuat rapor perkembangan anak (HTTP ${res.status}).`));
                    if (res.status === 403 || res.status === 404) {
                        navigate("/my-children");
                    }
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching parent child progress:", error);
                    toast.error("Tidak dapat terhubung ke server.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };
        initLoad();
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, studentId, navigate]);

    const student = progressData?.student;
    const classInfo = progressData?.class_info;

    return (
        <main className="student-page">
            {/* Hero Luar Angkasa */}
            <section className="student-hero">
                <div className="student-star ss-1" />
                <div className="student-star ss-2" />
                <div className="student-star ss-3" />
                <div className="student-star ss-4" />
                <div className="student-star ss-5" />
                <div className="student-star ss-6" />
                <div className="student-sun" />

                <div className="student-hero-content">
                    <h1>{student ? `Perkembangan Anak: ${student.name}` : "Rapor Perkembangan Anak"}</h1>
                    <p>
                        {classInfo
                            ? `Kelas ${classInfo.name} • Tahun Ajaran ${classInfo.academic_year} • ${classInfo.school_name}`
                            : "Pantau grafik perkembangan motorik halus bulanan, riwayat asesmen, dan rekomendasi stimulasi di rumah."}
                    </p>
                </div>
            </section>

            <section className="student-cardz">
                <section className="student-container">
                    <div className="gc-back-row">
                        <button
                            type="button"
                            onClick={() => navigate("/my-children")}
                            className="gc-back-btn"
                        >
                            <span>← Kembali ke Daftar Anak Saya</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="gc-state-box">
                            <span className="history-spinner" />
                            <p>Memuat grafik & riwayat asesmen anak...</p>
                        </div>
                    ) : !progressData ? (
                        <div className="gc-state-box">
                            <h3>Data anak tidak ditemukan</h3>
                        </div>
                    ) : (
                        <StudentProgressView
                            progressData={progressData}
                            isTeacher={false}
                        />
                    )}
                </section>
            </section>
        </main>
    );
}
