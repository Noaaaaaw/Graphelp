import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { authFetch, extractErrorMessage } from "../config/api";
import { SpaceHero } from "./ClassListPage";
import AssessmentResult from "../components/AssessmentResult";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXT_REGEX = /\.(jpe?g|png|webp)$/i;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

function ArrowLeftIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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

function XIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
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

function renderKategoriBadge(lastAssessment) {
    if (!lastAssessment || !lastAssessment.kategori) {
        return <span className="gc-kat-badge gc-kat-empty">Belum ada</span>;
    }
    const kat = lastAssessment.kategori.toUpperCase();
    const label = lastAssessment.kategori_label || "";
    const clsMap = {
        BB: "gc-kat-bb",
        MB: "gc-kat-mb",
        BSH: "gc-kat-bsh",
        BSB: "gc-kat-bsb",
    };
    const badgeClass = clsMap[kat] || "gc-kat-mb";
    const deltaMap = {
        Meningkat: "📈",
        Stabil: "➖",
        Menurun: "📉",
        "Asesmen Awal": "🆕",
    };
    const deltaIcon = lastAssessment.delta_status ? deltaMap[lastAssessment.delta_status] || "" : "";
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "flex-start" }}>
            <span className={`gc-kat-badge ${badgeClass}`} title={label}>
                {kat}{label ? ` - ${label}` : ""}
            </span>
            {(lastAssessment.period_label || lastAssessment.delta_status) && (
                <small style={{ fontSize: "0.73rem", color: "#475569", fontWeight: "600" }}>
                    {deltaIcon} {lastAssessment.delta_status || ""}{" "}
                    {lastAssessment.sequence_number ? `(Ke-${lastAssessment.sequence_number})` : ""}
                </small>
            )}
        </div>
    );
}

function renderReminderBadge(reminder) {
    if (!reminder || reminder.status === "belum_dijadwalkan") {
        return <span className="gc-rem-badge gc-rem-none">Belum dijadwalkan</span>;
    }
    const clsMap = {
        jatuh_tempo: "gc-rem-due",
        segera: "gc-rem-soon",
        terjadwal: "gc-rem-ok",
    };
    const badgeClass = clsMap[reminder.status] || "gc-rem-none";
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-start" }}>
            <span className={`gc-rem-badge ${badgeClass}`}>
                {reminder.label}
            </span>
            {reminder.next_assessment_date && (
                <small style={{ fontSize: "0.73rem", color: "#64748b" }}>
                    Jadwal: {reminder.next_assessment_date}
                </small>
            )}
        </div>
    );
}

export default function ClassDetailPage() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
    const defaultSchool = user?.school_name || "Sekolah Belum Diatur";

    const [classInfo, setClassInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // State Modal Tambah / Ubah Siswa
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentForm, setStudentForm] = useState({
        name: "",
        absence_number: "1",
        birth_date: "",
        gender: "L",
    });
    const [savingStudent, setSavingStudent] = useState(false);

    // State Modal Hapus Siswa
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [deletingStudent, setDeletingStudent] = useState(false);

    // State Modal Mulai Asesmen
    const [assessStudent, setAssessStudent] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [teacherNotes, setTeacherNotes] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState(null);

    const fetchClassStudents = useCallback(async () => {
        try {
            const res = await authFetch(`/classes/${classId}/students`);
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setClassInfo({
                    id: data.id,
                    name: data.name,
                    academic_year: data.academic_year,
                    school_name: data.school_name || defaultSchool,
                });
                setStudents(Array.isArray(data.students) ? data.students : []);
            } else {
                toast.error(extractErrorMessage(data, `Gagal memuat data kelas (HTTP ${res.status}).`));
                if (res.status === 403 || res.status === 404) {
                    navigate("/student");
                }
            }
        } catch (error) {
            console.error("Error fetching class detail:", error);
            toast.error("Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    }, [classId, defaultSchool, navigate, toast]);

    useEffect(() => {
        if (!user || user.role !== "guru") {
            toast.error("Akses ditolak. Halaman ini hanya untuk guru.");
            navigate("/");
            return;
        }
        let active = true;
        const initLoad = async () => {
            try {
                const res = await authFetch(`/classes/${classId}/students`);
                const data = await res.json().catch(() => ({}));
                if (!active) return;
                if (res.ok) {
                    setClassInfo({
                        id: data.id,
                        name: data.name,
                        academic_year: data.academic_year,
                        school_name: data.school_name || defaultSchool,
                    });
                    setStudents(Array.isArray(data.students) ? data.students : []);
                } else {
                    toast.error(extractErrorMessage(data, `Gagal memuat data kelas (HTTP ${res.status}).`));
                    if (res.status === 403 || res.status === 404) {
                        navigate("/student");
                    }
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching class detail:", error);
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
    }, [user, classId, defaultSchool, navigate]);

    const filteredStudents = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return students;
        return students.filter((s) => (s.name || "").toLowerCase().includes(q));
    }, [students, searchQuery]);

    // === HANDLER TAMBAH / UBAH SISWA ===
    const handleOpenAddStudent = () => {
        const nextAbsence = students.length > 0
            ? Math.max(...students.map((s) => Number(s.absence_number) || 0)) + 1
            : 1;
        setEditingStudent(null);
        setStudentForm({
            name: "",
            absence_number: String(nextAbsence),
            birth_date: "",
            gender: "L",
        });
        setIsStudentModalOpen(true);
    };

    const handleOpenEditStudent = (st) => {
        setEditingStudent(st);
        setStudentForm({
            name: st.name || "",
            absence_number: String(st.absence_number ?? 1),
            birth_date: st.birth_date || "",
            gender: st.gender || "L",
        });
        setIsStudentModalOpen(true);
    };

    const handleCloseStudentModal = () => {
        if (savingStudent) return;
        setIsStudentModalOpen(false);
        setEditingStudent(null);
    };

    const handleSaveStudent = async (e) => {
        e.preventDefault();
        const trimmedName = studentForm.name.trim();
        const absNum = Number(studentForm.absence_number);

        if (!trimmedName) {
            toast.error("Nama lengkap siswa tidak boleh kosong.");
            return;
        }
        if (!Number.isInteger(absNum) || absNum < 1) {
            toast.error("Nomor absen harus berupa angka bulat positif.");
            return;
        }
        if (!studentForm.birth_date) {
            toast.error("Tanggal lahir wajib diisi.");
            return;
        }

        setSavingStudent(true);
        try {
            const endpoint = editingStudent
                ? `/students/${editingStudent.id}`
                : `/classes/${classId}/students`;
            const method = editingStudent ? "PUT" : "POST";

            const res = await authFetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: trimmedName,
                    absence_number: absNum,
                    birth_date: studentForm.birth_date,
                    gender: studentForm.gender,
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success(editingStudent ? "Data siswa berhasil diperbarui." : "Siswa berhasil ditambahkan ke kelas.");
                setIsStudentModalOpen(false);
                setEditingStudent(null);
                fetchClassStudents(true);
            } else {
                toast.error(extractErrorMessage(data, `Gagal menyimpan data siswa (HTTP ${res.status}).`));
            }
        } catch (error) {
            console.error("Error saving student:", error);
            toast.error("Gagal menghubungi server.");
        } finally {
            setSavingStudent(false);
        }
    };

    // === HANDLER HAPUS SISWA ===
    const handleConfirmDeleteStudent = async () => {
        if (!studentToDelete) return;
        setDeletingStudent(true);
        try {
            const res = await authFetch(`/students/${studentToDelete.id}`, {
                method: "DELETE",
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success(data.message || "Data siswa berhasil dihapus.");
                setStudentToDelete(null);
                fetchClassStudents(true);
            } else {
                toast.error(extractErrorMessage(data, `Gagal menghapus data siswa (HTTP ${res.status}).`));
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            toast.error("Gagal menghubungi server.");
        } finally {
            setDeletingStudent(false);
        }
    };

    // === HANDLER MULAI ASESMEN ===
    const handleOpenAssessModal = (st) => {
        setAssessStudent(st);
        setImageFile(null);
        setPreviewUrl("");
        setTeacherNotes("");
        setIsDragging(false);
        setAssessmentResult(null);
    };

    const handleCloseAssessModal = () => {
        if (isAnalyzing) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setAssessStudent(null);
        setImageFile(null);
        setPreviewUrl("");
        setTeacherNotes("");
        setAssessmentResult(null);
    };

    const handleCopyStudentCode = (code, studentName) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        toast.success(`Kode Anak ${studentName} (${code}) berhasil disalin!`);
    };

    const handleSelectImageFile = (file) => {
        if (!file) return;

        const isValidType = ALLOWED_MIME_TYPES.includes((file.type || "").toLowerCase()) || ALLOWED_EXT_REGEX.test(file.name || "");
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
        if (!assessStudent) return;
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
            const res = await authFetch(`/students/${assessStudent.id}/assessments`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setAssessmentResult(data);
                toast.success("Asesmen motorik halus siswa berhasil diproses.");
                fetchClassStudents(true);
            } else {
                toast.error(extractErrorMessage(data, `Gagal memproses asesmen motorik halus siswa (HTTP ${res.status}).`));
            }
        } catch (error) {
            console.error("Error processing assessment:", error);
            toast.error("Gagal terhubung ke server saat memproses asesmen.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const todayStr = new Date().toISOString().split("T")[0];

    return (
        <main className="student-page">
            <SpaceHero
                title={classInfo ? `Kelas: ${classInfo.name}` : "Detail Kelas"}
                subtitle={
                    classInfo
                        ? `Tahun Ajaran ${classInfo.academic_year} • ${classInfo.school_name}`
                        : "Memuat informasi kelas..."
                }
            />

            <section className="student-cardz">
                <section className="student-container">
                    {/* Baris Navigasi Kembali */}
                    <div className="gc-back-row">
                        <button
                            type="button"
                            onClick={() => navigate("/student")}
                            className="gc-back-btn"
                        >
                            <ArrowLeftIcon />
                            <span>Kembali ke Daftar Kelas</span>
                        </button>
                    </div>

                    {/* Toolbar: Judul Daftar Siswa, Pencarian, Tombol Tambah Siswa */}
                    <div className="gc-detail-toolbar">
                        <h2 className="gc-folder-title">
                            Daftar Siswa ({students.length} Siswa)
                        </h2>

                        <div className="gc-toolbar-controls">
                            <div className="gc-search-box">
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Cari nama siswa..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="gc-search-input"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleOpenAddStudent}
                                className="gc-navy-btn"
                            >
                                <PlusIcon />
                                <span>+ Tambah Siswa</span>
                            </button>
                        </div>
                    </div>

                    {/* Banner Pengingat Asesmen Berkala di Dalam Kelas */}
                    {!loading && students.some((s) => s.reminder?.status === "jatuh_tempo" || s.reminder?.status === "segera") && (
                        <div className="gc-reminder-banner">
                            <div className="gc-reminder-banner-icon">🔔</div>
                            <div className="gc-reminder-banner-content">
                                <strong>Pengingat Asesmen Berkala:</strong> Ada{" "}
                                <strong>
                                    {students.filter((s) => s.reminder?.status === "jatuh_tempo" || s.reminder?.status === "segera").length} siswa
                                </strong>{" "}
                                di kelas ini yang sudah memasuki atau mendekati jadwal asesmen ulang bulanan:{" "}
                                <strong>
                                    {students
                                        .filter((s) => s.reminder?.status === "jatuh_tempo" || s.reminder?.status === "segera")
                                        .map((s) => s.name)
                                        .join(", ")}
                                </strong>
                                .{" "}
                                <span style={{ color: "#64748b", fontWeight: "500" }}>
                                    (Hanya pengingat; sistem tetap berjalan normal).
                                </span>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="gc-state-box">
                            <span className="history-spinner" />
                            <p>Memuat daftar siswa...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="gc-state-box">
                            <h3>Belum ada siswa di kelas ini</h3>
                            <p>
                                Klik tombol <strong>+ Tambah Siswa</strong> untuk mulai menambahkan data siswa ke kelas ini.
                            </p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="gc-state-box">
                            <h3>Siswa tidak ditemukan</h3>
                            <p>Tidak ada nama siswa yang cocok dengan kata kunci "{searchQuery}".</p>
                        </div>
                    ) : (
                        <div className="gc-table-wrapper">
                            <table className="gc-students-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px", textAlign: "center" }}>No</th>
                                        <th>Nama Lengkap</th>
                                        <th style={{ width: "56px", textAlign: "center" }}>L/P</th>
                                        <th>Usia</th>
                                        <th>Kode Anak (Ortu)</th>
                                        <th>Kategori Terakhir</th>
                                        <th>Pengingat Berikutnya</th>
                                        <th style={{ textAlign: "center" }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((st) => {
                                        const hasAssessed = Boolean(st.last_assessment);
                                        return (
                                            <tr key={st.id}>
                                                <td data-label="No" style={{ textAlign: "center", fontWeight: "700" }}>
                                                    {st.absence_number}
                                                </td>
                                                <td data-label="Nama Lengkap" className="gc-td-name">
                                                    <div
                                                        onClick={() => navigate(`/student/${classId}/siswa/${st.id}`)}
                                                        style={{ cursor: "pointer", color: "#0f172a" }}
                                                        title="Klik untuk membuka grafik & riwayat perkembangan siswa"
                                                    >
                                                        <div>{st.name}</div>
                                                        <small style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "500" }}>
                                                            Lahir: {st.birth_date || "-"}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td data-label="L/P" style={{ textAlign: "center" }}>
                                                    <span className={`gc-gender-pill ${st.gender === "P" ? "gc-gender-p" : "gc-gender-l"}`}>
                                                        {st.gender}
                                                    </span>
                                                </td>
                                                <td data-label="Usia">
                                                    <strong>{st.age_months}</strong> bln
                                                </td>
                                                <td data-label="Kode Anak (Ortu)">
                                                    {st.invitation_code ? (
                                                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                            <code className="gc-code-inline">{st.invitation_code}</code>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopyStudentCode(st.invitation_code, st.name)}
                                                                className="gc-copy-mini-btn"
                                                                title="Salin Kode Anak untuk Orang Tua"
                                                            >
                                                                Salin
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td data-label="Kategori Terakhir">
                                                    {renderKategoriBadge(st.last_assessment)}
                                                </td>
                                                <td data-label="Pengingat Berikutnya">
                                                    {renderReminderBadge(st.reminder)}
                                                </td>
                                                <td data-label="Aksi">
                                                    <div className="gc-row-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenAssessModal(st)}
                                                            className="gc-assess-btn"
                                                        >
                                                            {hasAssessed ? "Asesmen Ulang" : "Mulai Asesmen"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/student/${classId}/siswa/${st.id}`)}
                                                            className="gc-history-btn"
                                                            title="Lihat Grafik Perkembangan Berkala & Riwayat Lengkap"
                                                        >
                                                            Grafik & Riwayat
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEditStudent(st)}
                                                            className="gc-icon-btn gc-icon-btn-edit"
                                                            title="Ubah Data Siswa"
                                                            aria-label={`Ubah ${st.name}`}
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setStudentToDelete(st)}
                                                            className="gc-icon-btn gc-icon-btn-delete"
                                                            title="Hapus Siswa"
                                                            aria-label={`Hapus ${st.name}`}
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </section>

            {/* MODAL TAMBAH / UBAH SISWA */}
            {isStudentModalOpen && (
                <div className="gc-modal-overlay" onClick={handleCloseStudentModal}>
                    <div className="gc-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="gc-modal-header">
                            <h3>{editingStudent ? "Ubah Data Siswa" : "Tambah Siswa Baru"}</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={handleCloseStudentModal}
                                aria-label="Tutup"
                            >
                                <XIcon />
                            </button>
                        </div>

                        <form onSubmit={handleSaveStudent} className="gc-modal-form">
                            <div className="student-field">
                                <label htmlFor="st-name-input">Nama Lengkap Siswa</label>
                                <input
                                    id="st-name-input"
                                    type="text"
                                    placeholder="Masukkan nama lengkap siswa"
                                    value={studentForm.name}
                                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                                    required
                                    className="student-input"
                                />
                            </div>

                            <div className="gc-form-row-2">
                                <div className="student-field">
                                    <label htmlFor="st-absence-input">No. Absen</label>
                                    <input
                                        id="st-absence-input"
                                        type="number"
                                        min="1"
                                        value={studentForm.absence_number}
                                        onChange={(e) => setStudentForm({ ...studentForm, absence_number: e.target.value })}
                                        required
                                        className="student-input"
                                    />
                                </div>

                                <div className="student-field">
                                    <label htmlFor="st-gender-select">Jenis Kelamin (L/P)</label>
                                    <select
                                        id="st-gender-select"
                                        value={studentForm.gender}
                                        onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                                        required
                                        className="student-input"
                                    >
                                        <option value="L">Laki-laki (L)</option>
                                        <option value="P">Perempuan (P)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="student-field">
                                <label htmlFor="st-birthdate-input">Tanggal Lahir</label>
                                <input
                                    id="st-birthdate-input"
                                    type="date"
                                    max={todayStr}
                                    value={studentForm.birth_date}
                                    onChange={(e) => setStudentForm({ ...studentForm, birth_date: e.target.value })}
                                    required
                                    className="student-input"
                                />
                                <small style={{ color: "#64748b", fontSize: "0.78rem" }}>
                                    Usia siswa dalam bulan dihitung secara otomatis berdasarkan tanggal lahir.
                                </small>
                            </div>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={handleCloseStudentModal}
                                    className="gc-secondary-btn"
                                    disabled={savingStudent}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="gc-navy-btn"
                                    disabled={savingStudent}
                                >
                                    {savingStudent ? "Menyimpan..." : editingStudent ? "Simpan Perubahan" : "Tambah Siswa"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL KONFIRMASI HAPUS SISWA */}
            {studentToDelete && (
                <div className="gc-modal-overlay" onClick={() => !deletingStudent && setStudentToDelete(null)}>
                    <div className="gc-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="gc-modal-header">
                            <h3>Hapus Data Siswa</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={() => !deletingStudent && setStudentToDelete(null)}
                                aria-label="Tutup"
                            >
                                <XIcon />
                            </button>
                        </div>

                        <div className="gc-modal-body">
                            <p style={{ margin: "0 0 12px", color: "#1e293b", fontSize: "0.95rem", lineHeight: "1.5" }}>
                                Apakah Anda yakin ingin menghapus siswa <strong>{studentToDelete.name}</strong> (No. Absen {studentToDelete.absence_number})?
                            </p>
                            <div className="gc-danger-alert">
                                ⚠️ Seluruh riwayat asesmen motorik halus milik siswa ini juga akan ikut terhapus.
                            </div>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setStudentToDelete(null)}
                                    className="gc-secondary-btn"
                                    disabled={deletingStudent}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDeleteStudent}
                                    className="gc-danger-btn"
                                    disabled={deletingStudent}
                                >
                                    {deletingStudent ? "Menghapus..." : "Ya, Hapus Siswa"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL MULAI ASESMEN / HASIL ASESMEN */}
            {assessStudent && (
                <div className="gc-modal-overlay" onClick={handleCloseAssessModal}>
                    <div
                        className={`gc-modal-card ${assessmentResult ? "gc-modal-card-wide" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="gc-modal-header">
                            <h3>
                                {assessmentResult
                                    ? `Hasil Asesmen Motorik Halus - ${assessStudent.name}`
                                    : `Asesmen Motorik Halus - ${assessStudent.name}`}
                            </h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={handleCloseAssessModal}
                                aria-label="Tutup"
                            >
                                <XIcon />
                            </button>
                        </div>

                        <div className="gc-modal-body">
                            {!assessmentResult ? (
                                <form onSubmit={handleProcessAssessment}>
                                    <div className="gc-student-summary-bar">
                                        <div>
                                            <strong>Nama Siswa:</strong> No. {assessStudent.absence_number} - {assessStudent.name}
                                        </div>
                                        <div>
                                            <strong>Jenis Kelamin:</strong> {assessStudent.gender === "L" ? "Laki-laki" : "Perempuan"}
                                        </div>
                                        <div>
                                            <strong>Usia Saat Ini:</strong> {assessStudent.age_months} Bulan (Otomatis)
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
                                        <label htmlFor="assess-teacher-notes">Catatan Observasi Guru (Opsional)</label>
                                        <textarea
                                            id="assess-teacher-notes"
                                            rows={2}
                                            placeholder="Contoh: Anak sudah mampu memegang alat tulis lebih stabil dibanding bulan lalu..."
                                            value={teacherNotes}
                                            onChange={(e) => setTeacherNotes(e.target.value)}
                                            className="student-input"
                                            style={{ resize: "vertical", minHeight: "54px" }}
                                        />
                                    </div>

                                    <div className="gc-modal-actions" style={{ marginTop: "20px" }}>
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
                                            {isAnalyzing ? (
                                                "Menganalisis..."
                                            ) : (
                                                <>
                                                    <SendIcon />
                                                    <span>Proses Asesmen</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <AssessmentResult
                                        result={assessmentResult}
                                        schoolName={classInfo?.school_name || defaultSchool}
                                        gradeClass={classInfo?.name || ""}
                                    />

                                    <div className="gc-modal-actions" style={{ marginTop: "18px" }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAssessmentResult(null);
                                                handleClearImage();
                                            }}
                                            className="gc-secondary-btn"
                                        >
                                            Unggah Foto Lain
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseAssessModal}
                                            className="gc-navy-btn"
                                        >
                                            Selesai & Tutup
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
