import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

function BookIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    );
}

function PencilFloatIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 2 4 4-13 13H5v-4Z" />
            <path d="m14.5 5.5 4 4" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function PenFloatIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19 7-7 3 3-7 7-3-3z" />
            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="m2 2 7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
        </svg>
    );
}

function EraserFloatIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L12 21" />
            <path d="M22 21H7" />
            <path d="m5 11 6 6" />
        </svg>
    );
}

function RulerFloatIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z" />
            <path d="m14.5 12.5 2-2" />
            <path d="m11.5 9.5 2-2" />
            <path d="m8.5 6.5 2-2" />
            <path d="m17.5 15.5 2-2" />
        </svg>
    );
}

function StarFloatIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 16.4 5.7 21l2.3-7.2-6-4.6h7.6z" />
        </svg>
    );
}

function GraduationCapIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10 12 5 2 10l10 5 10-5Z" />
            <path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
            <path d="M22 10v6" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    );
}

function AppleIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 6c-1.5-2-4-2.5-5.5-1.5C4 6.2 3.5 9.5 5 12.5c1.2 2.4 3.5 5.5 7 5.5s5.8-3.1 7-5.5c1.5-3 1-6.3-1.5-8C16 3.5 13.5 4 12 6Z" />
            <path d="M12 6c0-1.5.8-2.8 2-3.5" />
        </svg>
    );
}

function NotebookFloatIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 3v18" />
            <path d="M12 8h5" />
            <path d="M12 12h5" />
            <path d="M12 16h5" />
        </svg>
    );
}

function CameraIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
            <circle cx="12" cy="13" r="4" />
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
        setStudents(students.filter((s) => s.id !== id));
    };

    const handleStudentChange = (id, field, value) => {
        setStudents(
            students.map((s) => {
                if (s.id === id) {
                    if (field === "imageFile") {
                        const file = value;
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
            students.map((s) =>
                s.id === id ? { ...s, imageFile: null, previewUrl: "" } : s
            )
        );
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("school_name", schoolName);
        formData.append("grade_class", gradeClass);

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
            const response = await fetch("http://localhost:8000/analyze-handwriting", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setAnalysisResult(data);
                toast.success("Analisis tulisan tangan berhasil diproses.");
            } else {
                toast.error(data.detail || "Gagal memproses analisis tulisan tangan.");
            }
        } catch (error) {
            console.error("Error analyzing handwriting:", error);
            setAnalysisResult({
                total_processed: students.length,
                status: "Sukses (Demo Client)",
                details: students.map(s => ({
                    name: `No. ${s.absenceNumber} - ${s.name}`,
                    status: s.imageFile ? "Gambar Terdeteksi" : "Tanpa Gambar"
                }))
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="student-page">

            <section className="student-hero">
                <span className="student-hero-blob student-hero-blob-1" />
                <span className="student-hero-blob student-hero-blob-2" />
                <span className="student-hero-blob student-hero-blob-3" />

                <span className="student-float student-float-1"><BookIcon /></span>
                <span className="student-float student-float-2"><PencilFloatIcon /></span>
                <span className="student-float student-float-3"><PenFloatIcon /></span>
                <span className="student-float student-float-4"><EraserFloatIcon /></span>
                <span className="student-float student-float-5"><RulerFloatIcon /></span>
                <span className="student-float student-float-6"><BookIcon /></span>
                <span className="student-float student-float-7"><GraduationCapIcon /></span>
                <span className="student-float student-float-8"><AppleIcon /></span>
                <span className="student-float student-float-9"><NotebookFloatIcon /></span>
                <span className="student-float student-float-10"><PencilFloatIcon /></span>

                <span className="student-hero-star student-hero-star-1"><StarFloatIcon /></span>
                <span className="student-hero-star student-hero-star-2"><StarFloatIcon /></span>
                <span className="student-hero-star student-hero-star-3"><StarFloatIcon /></span>
                <span className="student-hero-star student-hero-star-4"><StarFloatIcon /></span>
                <span className="student-hero-star student-hero-star-5"><StarFloatIcon /></span>

                <span className="student-hero-dot sd-1" />
                <span className="student-hero-dot sd-2" />
                <span className="student-hero-dot sd-3" />
                <span className="student-hero-dot sd-4" />
                <span className="student-hero-dot sd-5" />
                <span className="student-hero-dot sd-6" />

                <h1>Analisis Tulisan Tangan Siswa</h1>
                <p>Unggah sampel tulisan tangan siswa per kelas untuk dilakukan analisis.</p>
            </section>

            <section className="student-cardz">
                <section className="student-container">

                    <form onSubmit={handleAnalyze} className="student-form-card">

                        <div className="student-meta-row">
                            <div className="student-field">
                                <label>Nama Sekolah</label>
                                <input
                                    type="text"
                                    value={schoolName}
                                    disabled
                                    className="student-input student-input-disabled"
                                />
                            </div>
                            <div className="student-field">
                                <label>Kelas</label>
                                <input
                                    type="text"
                                    placeholder=" "
                                    value={gradeClass}
                                    onChange={(e) => setGradeClass(e.target.value)}
                                    required
                                    className="student-input"
                                />
                            </div>
                        </div>

                        <h3 className="student-list-title">Daftar Siswa ({students.length} Orang)</h3>

                        {students.map((student) => (
                            <div key={student.id} className="student-row">

                                {/* Baris 1: Nomor Absen + Tombol Hapus */}
                                <div className="student-row-top">
                                    <input
                                        type="number"
                                        placeholder="No."
                                        value={student.absenceNumber}
                                        onChange={(e) => handleStudentChange(student.id, "absenceNumber", e.target.value)}
                                        required
                                        className="student-input student-absence-input"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveStudent(student.id)}
                                        className="student-remove-btn"
                                    >
                                        Hapus
                                    </button>
                                </div>

                                {/* Baris 2: Nama Siswa */}
                                <input
                                    type="text"
                                    placeholder="Nama Siswa"
                                    value={student.name}
                                    onChange={(e) => handleStudentChange(student.id, "name", e.target.value)}
                                    required
                                    className="student-input student-name-input"
                                />

                                {/* Baris 3: Umur + Gender */}
                                <div className="student-row-meta">
                                    <input
                                        type="number"
                                        placeholder="Umur"
                                        value={student.age}
                                        onChange={(e) => handleStudentChange(student.id, "age", e.target.value)}
                                        required
                                        className="student-input student-age-input"
                                    />

                                    <select
                                        value={student.gender}
                                        onChange={(e) => handleStudentChange(student.id, "gender", e.target.value)}
                                        required
                                        className="student-input student-gender-select"
                                    >
                                        <option value="">Gender</option>
                                        <option value="L">Laki-Laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>

                                {/* Baris Bawah: Dropzone Upload Foto Tulisan (preview foto tampil di tengah, gantiin icon kamera) */}
                                <label
                                    className={`dropzone student-dropzone ${draggingId === student.id ? "dragging" : ""} ${student.previewUrl ? "has-preview" : ""}`}
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
                                        <span className="dropzone-preview-wrap">
                                            <img
                                                src={student.previewUrl}
                                                alt="Preview"
                                                className="dropzone-preview-img"
                                            />
                                            <button
                                                type="button"
                                                className="dropzone-preview-clear"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleClearImage(student.id);
                                                }}
                                                aria-label="Batalkan gambar"
                                                title="Batalkan gambar"
                                            >
                                                <XIcon />
                                            </button>
                                        </span>
                                    ) : (
                                        <span className="dropzone-icon">
                                            <CameraIcon />
                                        </span>
                                    )}
                                    <p className="dropzone-text">
                                        {student.imageFile ? (
                                            <span className="dropzone-filename">{student.imageFile.name}</span>
                                        ) : (
                                            "Tarik foto atau klik untuk pilih"
                                        )}
                                    </p>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleStudentChange(student.id, "imageFile", e.target.files[0])}
                                        required
                                        className="dropzone-input"
                                    />
                                </label>

                            </div>
                        ))}

                        <div className="student-actions">
                            <button type="button" onClick={handleAddStudent} className="student-add-btn">
                                <PlusIcon />
                                Tambah Siswa
                            </button>
                            <button type="submit" disabled={isLoading} className="student-submit-btn">
                                {isLoading ? (
                                    "Menganalisis..."
                                ) : (
                                    <>
                                        <SendIcon />
                                        Proses Analisis
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {analysisResult && (
                        <div className="student-result-card">
                            <h2>Hasil Analisis Tulisan Tangan Kelas {gradeClass}</h2>
                            <p className="student-result-school">Sekolah: {schoolName}</p>
                            <p className="student-result-total">Total Gambar Diproses: {analysisResult.total_processed} Siswa</p>
                            <hr className="student-result-divider" />

                            <div className="student-result-list">
                                {analysisResult.details?.map((res, idx) => (
                                    <div key={idx} className="student-result-item">
                                        <span>{res.name}</span>
                                        <span className="student-result-status">{res.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </section>
            </section>

        </main>
    );
}

export default StudentPage;