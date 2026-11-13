import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import AssessmentResult from "../components/AssessmentResult";
import "../style/studentpage.css";

const svgProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
};

function CameraIcon() {
    return (
        <svg {...svgProps} width="26" height="26">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg {...svgProps} width="13" height="13" strokeWidth="2.6">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg {...svgProps} width="16" height="16" strokeWidth="2.4">
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg {...svgProps} width="16" height="16">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg {...svgProps} width="14" height="14">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
    );
}

function StudentPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const schoolName = user.school_name || "Sekolah Tidak Ditemukan";
    const [gradeClass, setGradeClass] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [draggingId, setDraggingId] = useState(null);

    const [students, setStudents] = useState([
        { id: 1, absenceNumber: "1", name: "", age: "", gender: "", imageFile: null, previewUrl: "" }
    ]);

    useEffect(() => {
        if (!user || user.role !== "guru") {
            toast.error("Akses ditolak. Halaman ini hanya untuk guru.");
            navigate("/");
        }
    }, [user, navigate]);

    const handleAddStudent = () => {
        const nextAbsence = (students.length + 1).toString();
        setStudents([
            ...students,
            { id: Date.now(), absenceNumber: nextAbsence, name: "", age: "", gender: "", imageFile: null, previewUrl: "" }
        ]);
    };

    const handleRemoveStudent = (id) => {
        if (students.length === 1) {
            toast.error("Minimal harus ada 1 siswa.");
            return;
        }
        const target = students.find((s) => s.id === id);
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
        setStudents(students.filter((s) => s.id !== id));
    };

    const handleStudentChange = (id, field, value) => {
        setStudents(
            students.map((s) => {
                if (s.id === id) {
                    if (field === "imageFile") {
                        const file = value;
                        if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
                        const previewUrl = file ? URL.createObjectURL(file) : "";
                        return { ...s, imageFile: file, previewUrl };
                    }
                    return { ...s, [field]: value };
                }
                return s;
            })
        );
    };

    const handleClearImage = (id) => {
        setStudents(
            students.map((s) => {
                if (s.id !== id) return s;
                if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
                return { ...s, imageFile: null, previewUrl: "" };
            })
        );
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("school_name", schoolName);
        formData.append("grade_class", gradeClass);
        if (user && user.id) {
            formData.append("user_id", user.id);
        }

        students.forEach((student) => {
            formData.append(`absence_numbers`, student.absenceNumber);
            formData.append(`student_names`, student.name);
            formData.append(`ages`, student.age || "0");
            formData.append(`genders`, student.gender || "L");
            if (student.imageFile) {
                formData.append(`handwriting_images`, student.imageFile);
            }
        });

        try {
            const response = await fetch("http://localhost:8000/analyze-students", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setAnalysisResult(data);
                toast.success("Asesmen motorik halus siswa berhasil diproses.");
            } else {
                toast.error(data.detail || "Gagal memproses asesmen motorik halus siswa.");
            }
        } catch (error) {
            console.error("Error analyzing students:", error);
            setAnalysisResult({
                school_name: schoolName,
                grade_class: gradeClass,
                total_processed: students.length,
                status: "Sukses (Demo Client)",
                details: students.map((s, idx) => ({
                    absence_number: s.absenceNumber || (idx + 1).toString(),
                    student_name: s.name || `Siswa ${idx + 1}`,
                    gender: s.gender || "-",
                    age: s.age || 45,
                    kesimpulan: s.imageFile ? "Sesuai Usia [Ya]" : "Belum Sesuai [Tidak]",
                    status: s.imageFile ? "Perkembangan Sesuai / Mandiri" : "Data Gambar Belum Lengkap",
                    kategori: s.imageFile ? "BSH" : "BB",
                    kategori_label: s.imageFile ? "Berkembang Sesuai Harapan" : "Belum Berkembang",
                    confidence: s.imageFile ? 88.5 : 20.0,
                    alasan_klinis: s.imageFile ? "Kontrol pegangan alat tulis sudah stabil dan tarikan garis kontinu." : "Belum dapat dinilai karena file gambar belum diunggah.",
                    saran_guru: "Pertahankan stimulasi motorik halus dengan kegiatan menggambar dan menjiplak bentuk yang variatif.",
                    indikator: {
                        kontrol_pegangan: { value: 1.18, status: "Stabil" },
                        konsistensi_tekanan: { value: 0.49, status: "Konsisten" },
                        koordinasi_geometri: { value: 0.27, status: "Terkoordinasi" },
                        kontinuitas_garis: { value: 0.38, status: "Kontinu" }
                    }
                }))
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="student-page">

            <section className="student-hero">

                {/* === BACKGROUND SPACE === */}
                <div className="space-glow space-glow-1" />
                <div className="space-glow space-glow-2" />

                {/* === STARS === */}
                <span className="space-star star-1">✦</span>
                <span className="space-star star-2">✦</span>
                <span className="space-star star-3">✧</span>
                <span className="space-star star-4">✦</span>
                <span className="space-star star-5">✧</span>
                <span className="space-star star-6">✦</span>
                <span className="space-star star-7">✧</span>
                <span className="space-star star-8">✦</span>
                <span className="space-star star-9">✧</span>
                <span className="space-star star-10">✦</span>

                {/* titik-titik kecil */}
                <span className="tiny-star tiny-star-1" />
                <span className="tiny-star tiny-star-2" />
                <span className="tiny-star tiny-star-3" />
                <span className="tiny-star tiny-star-4" />
                <span className="tiny-star tiny-star-5" />
                <span className="tiny-star tiny-star-6" />
                <span className="tiny-star tiny-star-7" />
                <span className="tiny-star tiny-star-8" />
                <span className="tiny-star tiny-star-9" />
                <span className="tiny-star tiny-star-10" />

                {/* === BULAN === */}
                <div className="space-moon">
                    <span className="moon-crater moon-crater-1" />
                    <span className="moon-crater moon-crater-2" />
                    <span className="moon-crater moon-crater-3" />
                    <span className="moon-crater moon-crater-4" />
                </div>

                {/* === MATAHARI === */}
                <div className="space-sun">
                    <div className="sun-core" />
                </div>

                {/* === PLANET === */}
                <div className="space-planet planet-orange" />
                <div className="space-planet planet-green" />
                <div className="space-planet planet-purple" />

                {/* === ALIEN === */}
                <div className="space-alien">
                    <div className="alien-antenna alien-antenna-left" />
                    <div className="alien-antenna alien-antenna-right" />

                    <div className="alien-head">
                        <span className="alien-eye alien-eye-left" />
                        <span className="alien-eye alien-eye-right" />
                        <span className="alien-mouth" />
                    </div>

                    <div className="alien-body">
                        <span className="alien-arm alien-arm-left" />
                        <span className="alien-arm alien-arm-right" />
                    </div>
                </div>

                {/* === METEOR / BINTANG JATUH === */}
                <div className="space-meteor meteor-1" />
                <div className="space-meteor meteor-2" />
                <div className="space-meteor meteor-3" />

                {/* === UFO TERBANG ZIGZAG === */}
                <div className="flying-ufo">
                    <div className="ufo-beam" />
                    <div className="ufo-dome" />
                    <div className="ufo-body">
                        <span className="ufo-light ufo-light-1" />
                        <span className="ufo-light ufo-light-2" />
                        <span className="ufo-light ufo-light-3" />
                        <span className="ufo-light ufo-light-4" />
                    </div>
                </div>

                {/* === HERO CONTENT === */}
                <div className="student-hero-content">
                    <h1>Analisis Tulisan Tangan Siswa</h1>
                    <p>
                        Unggah sampel tulisan tangan siswa per kelas
                        untuk dilakukan analisis menggunakan AI.
                    </p>
                </div>

            </section>

            <section className="student-cardz">
                <section className="student-container">

                    <form onSubmit={handleAnalyze} className="sp-form">

                        {/* ===== INFO KELAS ===== */}
                        <div className="sp-class">
                            <div className="sp-field">
                                <label htmlFor="sp-school">Nama sekolah</label>
                                <input
                                    id="sp-school"
                                    type="text"
                                    value={schoolName}
                                    disabled
                                    className="sp-input"
                                />
                            </div>
                            <div className="sp-field">
                                <label htmlFor="sp-class">Kelas</label>
                                <input
                                    id="sp-class"
                                    type="text"
                                    placeholder="Contoh: TK B1"
                                    value={gradeClass}
                                    onChange={(e) => setGradeClass(e.target.value)}
                                    required
                                    className="sp-input"
                                />
                            </div>
                        </div>

                        {/* ===== DAFTAR SISWA ===== */}
                        <div className="sp-list-head">
                            <h3 className="sp-list-title">Daftar siswa</h3>
                            <span className="sp-count">{students.length} siswa</span>
                        </div>

                        <div className="sp-list">
                            {students.map((student, idx) => (
                                <article key={student.id} className="sp-student">

                                    <div className="sp-student-head">
                                        <div className="sp-student-title">
                                            <span className="sp-index">{idx + 1}</span>
                                            <span>{student.name.trim() || "Siswa baru"}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStudent(student.id)}
                                            className="sp-remove"
                                        >
                                            <TrashIcon />
                                            Hapus
                                        </button>
                                    </div>

                                    <div className="sp-student-grid">
                                        <div className="sp-fields">
                                            <div className="sp-field">
                                                <label htmlFor={`sp-name-${student.id}`}>Nama siswa</label>
                                                <input
                                                    id={`sp-name-${student.id}`}
                                                    type="text"
                                                    placeholder="Nama lengkap"
                                                    value={student.name}
                                                    onChange={(e) => handleStudentChange(student.id, "name", e.target.value)}
                                                    required
                                                    className="sp-input"
                                                />
                                            </div>

                                            <div className="sp-row3">
                                                <div className="sp-field">
                                                    <label htmlFor={`sp-no-${student.id}`}>No. absen</label>
                                                    <input
                                                        id={`sp-no-${student.id}`}
                                                        type="number"
                                                        placeholder="No."
                                                        value={student.absenceNumber}
                                                        onChange={(e) => handleStudentChange(student.id, "absenceNumber", e.target.value)}
                                                        required
                                                        className="sp-input"
                                                    />
                                                </div>

                                                <div className="sp-field">
                                                    <label htmlFor={`sp-age-${student.id}`}>Umur (bulan)</label>
                                                    <input
                                                        id={`sp-age-${student.id}`}
                                                        type="number"
                                                        placeholder="Contoh: 60"
                                                        value={student.age}
                                                        onChange={(e) => handleStudentChange(student.id, "age", e.target.value)}
                                                        required
                                                        className="sp-input"
                                                    />
                                                </div>

                                                <div className="sp-field" role="radiogroup" aria-label="Jenis kelamin">
                                                    <span className="sp-label">Jenis kelamin</span>
                                                    <div className="sp-seg">
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`gender-${student.id}`}
                                                                value="L"
                                                                checked={student.gender === "L"}
                                                                onChange={(e) => handleStudentChange(student.id, "gender", e.target.value)}
                                                                required
                                                            />
                                                            <span>Laki-laki</span>
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`gender-${student.id}`}
                                                                value="P"
                                                                checked={student.gender === "P"}
                                                                onChange={(e) => handleStudentChange(student.id, "gender", e.target.value)}
                                                                required
                                                            />
                                                            <span>Perempuan</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Unggah foto tulisan */}
                                        <label
                                            className={`sp-drop ${draggingId === student.id ? "dragging" : ""} ${student.previewUrl ? "has-preview" : ""}`}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setDraggingId(student.id);
                                            }}
                                            onDragLeave={() => setDraggingId(null)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setDraggingId(null);
                                                const file = e.dataTransfer.files?.[0];
                                                if (file) handleStudentChange(student.id, "imageFile", file);
                                            }}
                                        >
                                            {student.previewUrl ? (
                                                <>
                                                    <img
                                                        src={student.previewUrl}
                                                        alt={`Foto tulisan ${student.name || "siswa"}`}
                                                        className="sp-drop-img"
                                                    />
                                                    <span className="sp-drop-name">{student.imageFile?.name}</span>
                                                    <button
                                                        type="button"
                                                        className="sp-drop-clear"
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleClearImage(student.id);
                                                        }}
                                                        aria-label="Hapus foto"
                                                        title="Hapus foto"
                                                    >
                                                        <XIcon />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="sp-drop-ico">
                                                        <CameraIcon />
                                                    </span>
                                                    <p className="sp-drop-text">
                                                        Tarik foto tulisan ke sini atau klik untuk memilih
                                                    </p>
                                                </>
                                            )}

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleStudentChange(student.id, "imageFile", e.target.files[0])}
                                                required={!student.imageFile}
                                                className="sp-file"
                                            />
                                        </label>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* ===== AKSI ===== */}
                        <div className="sp-actions">
                            <button type="button" onClick={handleAddStudent} className="sp-add">
                                <PlusIcon />
                                Tambah siswa
                            </button>
                            <button type="submit" disabled={isLoading} className="sp-submit">
                                {isLoading ? (
                                    <>
                                        <span className="sp-spinner" />
                                        Menganalisis...
                                    </>
                                ) : (
                                    <>
                                        <SendIcon />
                                        Proses analisis
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* ===== HASIL ===== */}
                    {analysisResult && (
                        <section className="sp-results" aria-live="polite">
                            <div>
                                <h2 className="sp-results-title">
                                    Hasil asesmen kematangan motorik halus kelas {gradeClass}
                                </h2>
                                <div className="sp-results-chips">
                                    <span className="sp-results-chip">{schoolName}</span>
                                    <span className="sp-results-chip">
                                        {analysisResult.total_processed} siswa diproses
                                    </span>
                                </div>
                            </div>

                            <div className="sp-results-list">
                                {analysisResult.details?.map((res, idx) => (
                                    <AssessmentResult
                                        key={idx}
                                        result={{ ...res, absence_number: res.absence_number || idx + 1 }}
                                        schoolName={schoolName}
                                        gradeClass={gradeClass}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                </section>
            </section>

        </main>
    );
}

export default StudentPage;