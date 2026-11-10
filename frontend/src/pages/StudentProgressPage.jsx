import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { authFetch, extractErrorMessage } from "../config/api";
import AssessmentResult from "../components/AssessmentResult";
import StudentProgressView from "../components/StudentProgressView";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXT_REGEX = /\.(jpg|jpeg|png|webp)$/i;

export default function StudentProgressPage() {
    const { classId, studentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [user] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    // State Modal Asesmen Berkala Baru
    const [isAssessModalOpen, setIsAssessModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [teacherNotes, setTeacherNotes] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState(null);

    const fetchProgress = useCallback(async () => {
        try {
            const res = await authFetch(`/students/${studentId}/progress`);
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setProgressData(data);
            } else {
                toast.error(extractErrorMessage(data, `Gagal memuat data perkembangan siswa (HTTP ${res.status}).`));
                if (res.status === 403 || res.status === 404) {
                    navigate(`/student/${classId}`);
                }
            }
        } catch (error) {
            console.error("Error fetching student progress:", error);
            toast.error("Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    }, [studentId, classId, navigate, toast]);

    useEffect(() => {
        if (!user || user.role !== "guru") {
            toast.error("Akses ditolak. Halaman ini hanya untuk guru.");
            navigate("/");
            return;
        }
        let active = true;
        const initLoad = async () => {
            try {
                const res = await authFetch(`/students/${studentId}/progress`);
                const data = await res.json().catch(() => ({}));
                if (!active) return;
                if (res.ok) {
                    setProgressData(data);
                } else {
                    toast.error(extractErrorMessage(data, `Gagal memuat data perkembangan siswa (HTTP ${res.status}).`));
                    if (res.status === 403 || res.status === 404) {
                        navigate(`/student/${classId}`);
                    }
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching student progress:", error);
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
    }, [user, studentId, classId, navigate]);

    const handleSaveSchedule = async (schedulePayload) => {
        try {
            const res = await authFetch(`/students/${studentId}/schedule`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(schedulePayload),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success("Jadwal pengingat asesmen berhasil diperbarui.");
                fetchProgress();
            } else {
                toast.error(extractErrorMessage(data, "Gagal menyimpan jadwal pengingat."));
            }
        } catch (error) {
            console.error("Error updating schedule:", error);
            toast.error("Gagal menghubungi server.");
        }
    };

    const handleOpenAssessModal = () => {
        setImageFile(null);
        setPreviewUrl("");
        setTeacherNotes("");
        setIsDragging(false);
        setAssessmentResult(null);
        setIsAssessModalOpen(true);
    };

    const handleCloseAssessModal = () => {
        if (isAnalyzing) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setIsAssessModalOpen(false);
        setImageFile(null);
        setPreviewUrl("");
        setTeacherNotes("");
        setAssessmentResult(null);
    };

    const handleSelectImageFile = (file) => {
        if (!file) return;
        const isValidType =
            ALLOWED_MIME_TYPES.includes((file.type || "").toLowerCase()) ||
            ALLOWED_EXT_REGEX.test(file.name || "");
        if (!isValidType) {
            toast.error("Format berkas tidak didukung. Harap unggah gambar JPG, JPEG, PNG, atau WEBP.");
            return;
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            toast.error(`Ukuran berkas melebihi batas maksimum 5 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
            return;
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleClearImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setImageFile(null);
        setPreviewUrl("");
    };

    const handleProcessAssessment = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Silakan pilih atau tarik foto lembar kerja siswa terlebih dahulu.");
            return;
        }

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("image", imageFile);
        if (teacherNotes.trim()) {
            formData.append("teacher_notes", teacherNotes.trim());
        }

        try {
            const res = await authFetch(`/students/${studentId}/assessments`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setAssessmentResult(data);
                toast.success("Asesmen berkala siswa berhasil diproses!");
                fetchProgress();
            } else {
                toast.error(extractErrorMessage(data, `Gagal memproses asesmen (HTTP ${res.status}).`));
            }
        } catch (error) {
            console.error("Error processing assessment:", error);
            toast.error("Gagal terhubung ke server saat memproses asesmen.");
        } finally {
            setIsAnalyzing(false);
        }
    };

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
                    <h1>{student ? `Rapor Berkala: ${student.name}` : "Perkembangan Motorik Siswa"}</h1>
                    <p>
                        {classInfo
                            ? `Kelas ${classInfo.name} - Tahun Ajaran ${classInfo.academic_year} - ${classInfo.school_name}`
                            : "Pantau grafik perkembangan bulanan, riwayat asesmen, dan jadwal evaluasi berikutnya."}
                    </p>
                </div>
            </section>

            <section className="student-cardz">
                <section className="student-container">
                    <div className="gc-back-row">
                        <button
                            type="button"
                            onClick={() => navigate(`/student/${classId}`)}
                            className="gc-back-btn"
                        >
                            <span>← Kembali ke Daftar Siswa Kelas</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="gc-state-box">
                            <span className="history-spinner" />
                            <p>Memuat grafik & riwayat perkembangan siswa...</p>
                        </div>
                    ) : !progressData ? (
                        <div className="gc-state-box">
                            <h3>Data siswa tidak ditemukan</h3>
                        </div>
                    ) : (
                        <StudentProgressView
                            progressData={progressData}
                            isTeacher={true}
                            onOpenNewAssessment={handleOpenAssessModal}
                            onSaveSchedule={handleSaveSchedule}
                        />
                    )}
                </section>
            </section>

            {/* MODAL MULAI ASESMEN BERKALA BARU */}
            {isAssessModalOpen && student && (
                <div className="gc-modal-overlay" onClick={handleCloseAssessModal}>
                    <div
                        className={`gc-modal-card ${assessmentResult ? "gc-modal-card-wide" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="gc-modal-header">
                            <h3>
                                {assessmentResult
                                    ? `Hasil Asesmen Berkala - ${student.name}`
                                    : `Asesmen Berkala Ke-${(student.total_assessments || 0) + 1} - ${student.name}`}
                            </h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={handleCloseAssessModal}
                                aria-label="Tutup"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="gc-modal-body">
                            {!assessmentResult ? (
                                <form onSubmit={handleProcessAssessment}>
                                    <div className="gc-student-summary-bar">
                                        <div>
                                            <strong>Nama Siswa:</strong> No. {student.absence_number} - {student.name}
                                        </div>
                                        <div>
                                            <strong>Usia Saat Ini:</strong> {student.age_months} Bulan
                                        </div>
                                        <div>
                                            <strong>Periode:</strong> Asesmen Ke-{(student.total_assessments || 0) + 1}
                                        </div>
                                    </div>

                                    <label
                                        className={`dropzone student-dropzone ${isDragging ? "dragging" : ""} ${previewUrl ? "has-preview" : ""}`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragging(true);
                                        }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            const file = e.dataTransfer.files?.[0];
                                            if (file) handleSelectImageFile(file);
                                        }}
                                    >
                                        {previewUrl ? (
                                            <span className="dropzone-preview-wrap">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview Lembar Kerja"
                                                    className="dropzone-preview-img"
                                                />
                                                <button
                                                    type="button"
                                                    className="dropzone-preview-clear"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleClearImage();
                                                    }}
                                                    title="Batalkan gambar"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ) : (
                                            <span className="dropzone-icon">📷</span>
                                        )}
                                        <p className="dropzone-text">
                                            {imageFile ? (
                                                <span className="dropzone-filename">{imageFile.name}</span>
                                            ) : (
                                                "Tarik foto lembar kerja atau klik untuk pilih (JPG, PNG, WEBP maks. 5 MB)"
                                            )}
                                        </p>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                            onChange={(e) => handleSelectImageFile(e.target.files?.[0])}
                                            className="dropzone-input"
                                        />
                                    </label>

                                    <div className="student-field" style={{ marginTop: "14px" }}>
                                        <label htmlFor="progress-teacher-notes">Catatan Observasi Guru (Opsional)</label>
                                        <textarea
                                            id="progress-teacher-notes"
                                            rows={2}
                                            placeholder="Contoh: Anak sudah lebih tenang saat memegang pensil dibanding bulan lalu..."
                                            value={teacherNotes}
                                            onChange={(e) => setTeacherNotes(e.target.value)}
                                            className="student-input"
                                            style={{ resize: "vertical", minHeight: "56px" }}
                                        />
                                    </div>

                                    <div className="gc-modal-actions" style={{ marginTop: "18px" }}>
                                        <button
                                            type="button"
                                            onClick={handleCloseAssessModal}
                                            className="gc-secondary-btn"
                                            disabled={isAnalyzing}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isAnalyzing || !imageFile}
                                            className="student-submit-btn"
                                            style={{ flex: "0 0 auto", minWidth: "180px" }}
                                        >
                                            {isAnalyzing ? "Menganalisis..." : "Proses Asesmen"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <AssessmentResult
                                        result={assessmentResult}
                                        schoolName={classInfo?.school_name || ""}
                                        gradeClass={classInfo?.name || ""}
                                    />

                                    <div className="gc-modal-actions" style={{ marginTop: "18px" }}>
                                        <button
                                            type="button"
                                            onClick={handleCloseAssessModal}
                                            className="gc-navy-btn"
                                        >
                                            Selesai & Lihat Grafik Terbaru
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
