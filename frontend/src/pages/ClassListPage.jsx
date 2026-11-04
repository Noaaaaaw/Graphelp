import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { authFetch, extractErrorMessage } from "../config/api";

const BANNER_GRADIENTS = [
    "linear-gradient(135deg, #1c3446, #2c5063)",
    "linear-gradient(135deg, #2f6f6b, #3d8783)",
    "linear-gradient(135deg, #1e3a8a, #2563eb)",
    "linear-gradient(135deg, #0f766e, #14b8a6)",
    "linear-gradient(135deg, #334155, #475569)",
    "linear-gradient(135deg, #b45309, #e8734a)",
];

function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
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

function FolderIcon() {
    return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

export function SpaceHero({ title, subtitle }) {
    return (
        <section className="student-hero">
            <div className="space-glow space-glow-1" />
            <div className="space-glow space-glow-2" />

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

            <div className="space-moon">
                <span className="moon-crater moon-crater-1" />
                <span className="moon-crater moon-crater-2" />
                <span className="moon-crater moon-crater-3" />
                <span className="moon-crater moon-crater-4" />
            </div>

            <div className="space-sun">
                <div className="sun-core" />
            </div>

            <div className="space-planet planet-orange" />
            <div className="space-planet planet-green" />
            <div className="space-planet planet-purple" />

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

            <div className="space-meteor meteor-1" />
            <div className="space-meteor meteor-2" />
            <div className="space-meteor meteor-3" />

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

            <div className="student-hero-content">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
        </section>
    );
}

export default function ClassListPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
    const schoolName = user?.school_name || "Sekolah Belum Diatur";

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    // State Modal Buat/Ubah Kelas
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [className, setClassName] = useState("");
    const [academicYear, setAcademicYear] = useState("2026/2027");
    const [submitting, setSubmitting] = useState(false);

    // State Modal Konfirmasi Hapus Kelas
    const [classToDelete, setClassToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const reloadClasses = useCallback(async () => {
        try {
            const res = await authFetch("/classes");
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setClasses(Array.isArray(data) ? data : []);
            } else {
                toast.error(extractErrorMessage(data, `Gagal memuat daftar kelas (HTTP ${res.status}).`));
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (!user || user.role !== "guru") {
            toast.error("Akses ditolak. Halaman ini hanya untuk guru.");
            navigate("/");
            return;
        }
        let active = true;
        const initLoad = async () => {
            try {
                const res = await authFetch("/classes");
                const data = await res.json().catch(() => ({}));
                if (!active) return;
                if (res.ok) {
                    setClasses(Array.isArray(data) ? data : []);
                } else {
                    toast.error(extractErrorMessage(data, `Gagal memuat daftar kelas (HTTP ${res.status}).`));
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching classes:", error);
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
    }, [user, navigate]);

    const handleOpenCreateModal = () => {
        setEditingClass(null);
        setClassName("");
        setAcademicYear("2026/2027");
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (e, cls) => {
        e.stopPropagation();
        setEditingClass(cls);
        setClassName(cls.name || "");
        setAcademicYear(cls.academic_year || "2026/2027");
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        if (submitting) return;
        setIsFormModalOpen(false);
        setEditingClass(null);
    };

    const handleSaveClass = async (e) => {
        e.preventDefault();
        const trimmedName = className.trim();
        const trimmedYear = academicYear.trim();

        if (!trimmedName) {
            toast.error("Nama kelas tidak boleh kosong.");
            return;
        }
        if (!trimmedYear) {
            toast.error("Tahun ajaran tidak boleh kosong.");
            return;
        }

        setSubmitting(true);
        try {
            const endpoint = editingClass ? `/classes/${editingClass.id}` : "/classes";
            const method = editingClass ? "PUT" : "POST";

            const res = await authFetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: trimmedName,
                    academic_year: trimmedYear,
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success(editingClass ? "Data kelas berhasil diperbarui." : "Kelas baru berhasil dibuat.");
                setIsFormModalOpen(false);
                setEditingClass(null);
                reloadClasses();
            } else {
                toast.error(extractErrorMessage(data, `Gagal menyimpan data kelas (HTTP ${res.status}).`));
            }
        } catch (error) {
            console.error("Error saving class:", error);
            toast.error("Gagal menghubungi server.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenDeleteModal = (e, cls) => {
        e.stopPropagation();
        setClassToDelete(cls);
    };

    const handleConfirmDelete = async () => {
        if (!classToDelete) return;
        setDeleting(true);
        try {
            const res = await authFetch(`/classes/${classToDelete.id}`, {
                method: "DELETE",
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success(data.message || "Kelas berhasil dihapus.");
                setClassToDelete(null);
                reloadClasses();
            } else {
                toast.error(extractErrorMessage(data, `Gagal menghapus kelas (HTTP ${res.status}).`));
            }
        } catch (error) {
            console.error("Error deleting class:", error);
            toast.error("Gagal menghubungi server.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <main className="student-page">
            <SpaceHero
                title="Kelas Saya"
                subtitle="Kelola folder kelas dan pantau hasil asesmen motorik halus siswa."
            />

            <section className="student-cardz">
                <section className="student-container">
                    {/* Header Kartu Putih: Folder Kelas Anda */}
                    <div className="gc-folder-header">
                        <div>
                            <h2 className="gc-folder-title">Folder Kelas Anda</h2>
                            <p className="gc-folder-subtitle">Sekolah: {schoolName}</p>
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            className="gc-navy-btn"
                        >
                            <PlusIcon />
                            <span>+ Buat Kelas Baru</span>
                        </button>
                    </div>

                    {!loading && classes.some((c) => (c.due_assessment_count || 0) > 0) && (
                        <div className="gc-reminder-banner">
                            <div className="gc-reminder-banner-icon">🔔</div>
                            <div className="gc-reminder-banner-content">
                                <strong>Pengingat Evaluasi Berkala:</strong> Terdapat{" "}
                                <strong>
                                    {classes.reduce((acc, c) => acc + (c.due_assessment_count || 0), 0)} siswa
                                </strong>{" "}
                                di kelas Anda yang sudah memasuki atau mendekati jadwal asesmen ulang bulanan.{" "}
                                <span style={{ color: "#64748b", fontWeight: "500" }}>
                                    (Sistem tetap berjalan normal kapan pun asesmen dilakukan).
                                </span>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="gc-state-box">
                            <span className="history-spinner" />
                            <p>Memuat daftar kelas...</p>
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="gc-state-box">
                            <div className="gc-empty-icon">
                                <FolderIcon />
                            </div>
                            <h3>Belum ada kelas yang dibuat</h3>
                            <p>
                                Klik tombol <strong>+ Buat Kelas Baru</strong> di kanan atas untuk membuat folder kelas pertama Anda.
                            </p>
                        </div>
                    ) : (
                        <div className="gc-class-grid">
                            {classes.map((cls, idx) => {
                                const bannerBg = BANNER_GRADIENTS[idx % BANNER_GRADIENTS.length];
                                return (
                                    <div
                                        key={cls.id}
                                        className="gc-class-card"
                                        onClick={() => navigate(`/student/${cls.id}`)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                navigate(`/student/${cls.id}`);
                                            }
                                        }}
                                    >
                                        <div className="gc-class-banner" style={{ background: bannerBg }}>
                                            <h3 className="gc-class-name">{cls.name}</h3>
                                            <span className="gc-class-year">Tahun Ajaran {cls.academic_year}</span>
                                        </div>

                                        <div className="gc-class-body">
                                            <p className="gc-class-school">
                                                Sekolah: <strong>{cls.school_name || schoolName}</strong>
                                            </p>

                                            <div className="gc-class-footer">
                                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                                                    <span className="gc-student-count-badge">
                                                        <UsersIcon />
                                                        <span>{cls.student_count ?? 0} Siswa</span>
                                                    </span>
                                                    {(cls.due_assessment_count || 0) > 0 && (
                                                        <span className="gc-due-pill" title="Jumlah siswa yang mendekati atau memasuki jadwal asesmen ulang">
                                                            🔔 {cls.due_assessment_count} Perlu Asesmen
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="gc-card-actions" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        className="gc-icon-btn gc-icon-btn-edit"
                                                        onClick={(e) => handleOpenEditModal(e, cls)}
                                                        title="Ubah Kelas"
                                                        aria-label={`Ubah ${cls.name}`}
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="gc-icon-btn gc-icon-btn-delete"
                                                        onClick={(e) => handleOpenDeleteModal(e, cls)}
                                                        title="Hapus Kelas"
                                                        aria-label={`Hapus ${cls.name}`}
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </section>

            {/* Modal Buat / Ubah Kelas */}
            {isFormModalOpen && (
                <div className="gc-modal-overlay" onClick={handleCloseFormModal}>
                    <div className="gc-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="gc-modal-header">
                            <h3>{editingClass ? "Ubah Kelas" : "Buat Kelas Baru"}</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={handleCloseFormModal}
                                aria-label="Tutup"
                            >
                                <XIcon />
                            </button>
                        </div>

                        <form onSubmit={handleSaveClass} className="gc-modal-form">
                            <div className="student-field">
                                <label htmlFor="class-name-input">Nama Kelas</label>
                                <input
                                    id="class-name-input"
                                    type="text"
                                    placeholder="Contoh: Kelas TK A"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    required
                                    className="student-input"
                                />
                            </div>

                            <div className="student-field">
                                <label htmlFor="academic-year-input">Tahun Ajaran</label>
                                <input
                                    id="academic-year-input"
                                    type="text"
                                    placeholder="Contoh: 2026/2027"
                                    value={academicYear}
                                    onChange={(e) => setAcademicYear(e.target.value)}
                                    required
                                    className="student-input"
                                />
                            </div>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={handleCloseFormModal}
                                    className="gc-secondary-btn"
                                    disabled={submitting}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="gc-navy-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? "Menyimpan..." : editingClass ? "Simpan Perubahan" : "Buat Kelas"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Kelas */}
            {classToDelete && (
                <div className="gc-modal-overlay" onClick={() => !deleting && setClassToDelete(null)}>
                    <div className="gc-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="gc-modal-header">
                            <h3>Hapus Kelas</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={() => !deleting && setClassToDelete(null)}
                                aria-label="Tutup"
                            >
                                <XIcon />
                            </button>
                        </div>

                        <div className="gc-modal-body">
                            <p style={{ margin: "0 0 12px", color: "#1e293b", fontSize: "0.95rem", lineHeight: "1.5" }}>
                                Apakah Anda yakin ingin menghapus kelas <strong>{classToDelete.name}</strong> (Tahun Ajaran {classToDelete.academic_year})?
                            </p>
                            <div className="gc-danger-alert">
                                ⚠️ <strong>Peringatan:</strong> Menghapus kelas ini akan menghapus seluruh data siswa ({classToDelete.student_count ?? 0} siswa) beserta seluruh riwayat asesmen motorik halus di dalamnya secara permanen.
                            </div>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setClassToDelete(null)}
                                    className="gc-secondary-btn"
                                    disabled={deleting}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="gc-danger-btn"
                                    disabled={deleting}
                                >
                                    {deleting ? "Menghapus..." : "Ya, Hapus Kelas"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
