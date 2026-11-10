import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useToast } from "../components/Toast";
import { authFetch, extractErrorMessage } from "../config/api";
import { SpaceHero } from "./ClassListPage";
import AssessmentResult from "../components/AssessmentResult";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXT_REGEX = /\.(jpe?g|png|webp)$/i;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

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

const DELTA_KEYS = {
    Meningkat: "up",
    Stabil: "stable",
    Menurun: "down",
    "Asesmen Awal": "initial",
};

function renderKategoriBadge(lastAssessment, t) {
    if (!lastAssessment || (!lastAssessment.kategori && !lastAssessment.kesimpulan)) {
        return <span className="gc-kat-badge gc-kat-empty">{t ? t("classDetail.none") : "Belum ada"}</span>;
    }
    const isYa = (lastAssessment.kesimpulan && lastAssessment.kesimpulan.includes("Ya")) ||
                 ["BSB", "BSH", "SESUAI"].includes(String(lastAssessment.kategori).toUpperCase());
    const deltaMap = {
        Meningkat: "↗",
        Stabil: "→",
        Menurun: "↘",
        "Asesmen Awal": "★",
    };
    const deltaIcon = lastAssessment.delta_status ? deltaMap[lastAssessment.delta_status] || "" : "";
    const deltaKey = DELTA_KEYS[lastAssessment.delta_status];
    const deltaText = deltaKey && t ? t(`common.delta.${deltaKey}`) : lastAssessment.delta_status || "";
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    background: isYa ? "#dcfce7" : "#fee2e2",
                    color: isYa ? "#15803d" : "#b91c1c",
                    border: `1px solid ${isYa ? "#86efac" : "#fca5a5"}`
                }}
            >
                {isYa ? "✓ Sesuai Usia [Ya]" : "✗ Belum Sesuai [Tidak]"}
            </span>
            {(lastAssessment.period_label || lastAssessment.delta_status) && (
                <small className={`gc-delta gc-delta-${deltaKey || "stable"}`}>
                    <span className="gc-delta-ico">{deltaIcon}</span>
                    {deltaText}{" "}
                    {lastAssessment.sequence_number && t ? t("classDetail.seq", { n: lastAssessment.sequence_number }) : ""}
                </small>
            )}
        </div>
    );
}

function reminderText(reminder, t) {
    const days = Number(reminder.days_remaining);
    if (reminder.status === "jatuh_tempo") {
        return days < 0
            ? t("common.reminder.overdue", { days: Math.abs(days) })
            : t("common.reminder.today");
    }
    if (reminder.status === "segera") {
        return t("common.reminder.soon", { days });
    }
    if (reminder.status === "terjadwal") {
        return t("common.reminder.scheduled", { days });
    }
    return reminder.label;
}

function renderReminderBadge(reminder, t) {
    if (!reminder || reminder.status === "belum_dijadwalkan") {
        return <span className="gc-rem-badge gc-rem-none">{t("common.reminder.none")}</span>;
    }
    const clsMap = {
        jatuh_tempo: "gc-rem-due",
        segera: "gc-rem-soon",
        terjadwal: "gc-rem-ok",
    };
    const badgeClass = clsMap[reminder.status] || "gc-rem-none";
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
            <span className={`gc-rem-badge ${badgeClass}`}>
                {reminderText(reminder, t)}
            </span>
            {reminder.next_assessment_date && (
                <small style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>
                    {t("classDetail.scheduleOn", { date: reminder.next_assessment_date })}
                </small>
            )}
        </div>
    );
}

export default function ClassDetailPage() {
    const { t } = useTranslation();
    const { classId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
    const defaultSchool = user?.school_name || t("classList.schoolNotSet");

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
                toast.error(extractErrorMessage(data, t("classDetail.errLoad", { status: res.status })));
                if (res.status === 403 || res.status === 404) {
                    navigate("/student");
                }
            }
        } catch (error) {
            console.error("Error fetching class detail:", error);
            toast.error(t("classList.errConnect"));
        } finally {
            setLoading(false);
        }
    }, [classId, defaultSchool, navigate, toast, t]);

    useEffect(() => {
        if (!user || user.role !== "guru") {
            toast.error(t("classList.accessDenied"));
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
                    toast.error(extractErrorMessage(data, t("classDetail.errLoad", { status: res.status })));
                    if (res.status === 403 || res.status === 404) {
                        navigate("/student");
                    }
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching class detail:", error);
                    toast.error(t("classList.errConnect"));
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

    const dueStudents = students.filter(
        (s) => s.reminder?.status === "jatuh_tempo" || s.reminder?.status === "segera"
    );

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
            toast.error(t("classDetail.errNameEmpty"));
            return;
        }
        if (!Number.isInteger(absNum) || absNum < 1) {
            toast.error(t("classDetail.errAbsence"));
            return;
        }
        if (!studentForm.birth_date) {
            toast.error(t("classDetail.errBirth"));
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
                toast.success(editingStudent ? t("classDetail.studentUpdated") : t("classDetail.studentAdded"));
                setIsStudentModalOpen(false);
                setEditingStudent(null);
                fetchClassStudents(true);
            } else {
                toast.error(extractErrorMessage(data, t("classDetail.errSaveStudent", { status: res.status })));
            }
        } catch (error) {
            console.error("Error saving student:", error);
            toast.error(t("classList.errServer"));
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
                toast.success(data.message || t("classDetail.studentDeleted"));
                setStudentToDelete(null);
                fetchClassStudents(true);
            } else {
                toast.error(extractErrorMessage(data, t("classDetail.errDeleteStudent", { status: res.status })));
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            toast.error(t("classList.errServer"));
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
        toast.success(t("classDetail.codeCopied", { name: studentName, code }));
    };

    const handleSelectImageFile = (file) => {
        if (!file) return;

        const isValidType = ALLOWED_MIME_TYPES.includes((file.type || "").toLowerCase()) || ALLOWED_EXT_REGEX.test(file.name || "");
        if (!isValidType) {
            toast.error(t("classDetail.errFormat"));
            return;
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            toast.error(t("classDetail.errSize", { size: (file.size / (1024 * 1024)).toFixed(2) }));
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
            toast.error(t("classDetail.errNoImage"));
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
                toast.success(t("student.success"));
                fetchClassStudents(true);
            } else {
                toast.error(extractErrorMessage(data, t("classDetail.errAssess", { status: res.status })));
            }
        } catch (error) {
            console.error("Error processing assessment:", error);
            toast.error(t("classDetail.errAssessServer"));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const todayStr = new Date().toISOString().split("T")[0];

    return (
        <main className="student-page">
            <SpaceHero
                title={classInfo ? t("classDetail.heroTitle", { name: classInfo.name }) : t("classDetail.heroTitleLoading")}
                subtitle={
                    classInfo
                        ? t("classDetail.heroSubtitle", { year: classInfo.academic_year, school: classInfo.school_name })
                        : t("classDetail.heroLoading")
                }
            />

            <section className="student-cardz">
                <section className="student-container">

                    {/* Toolbar */}
                    <div className="gc-detail-toolbar">
                        <h2 className="gc-folder-title">
                            {t("classDetail.listTitle", { n: students.length })}
                        </h2>

                        <div className="gc-toolbar-controls">
                            <div className="gc-search-box">
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder={t("classDetail.searchPh")}
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
                                <span>{t("student.addStudent")}</span>
                            </button>
                        </div>
                    </div>

                    {/* Banner Pengingat Asesmen Berkala */}
                    {!loading && dueStudents.length > 0 && (
                        <div className="gc-reminder-banner">
                            <div className="gc-reminder-banner-icon">🔔</div>
                            <div className="gc-reminder-banner-content">
                                <Trans
                                    i18nKey="classDetail.banner"
                                    values={{
                                        n: dueStudents.length,
                                        names: dueStudents.map((s) => s.name).join(", "),
                                    }}
                                    components={{
                                        strong: <strong />,
                                        muted: <span style={{ color: "#64748b", fontWeight: "500" }} />,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="gc-state-box">
                            <span className="history-spinner" />
                            <p>{t("classDetail.loading")}</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="gc-state-box">
                            <h3>{t("classDetail.emptyTitle")}</h3>
                            <p>
                                <Trans i18nKey="classDetail.emptyDesc" components={{ strong: <strong /> }} />
                            </p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="gc-state-box">
                            <h3>{t("classDetail.notFoundTitle")}</h3>
                            <p>{t("classDetail.notFoundDesc", { q: searchQuery })}</p>
                        </div>
                    ) : (
                        <div className="gc-table-wrapper">
                            <table className="gc-students-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "56px", textAlign: "center" }}>{t("student.colNo")}</th>
                                        <th>{t("classDetail.colName")}</th>
                                        <th style={{ width: "64px", textAlign: "center" }}>{t("classDetail.colGender")}</th>
                                        <th>{t("classDetail.colAge")}</th>
                                        <th>{t("classDetail.colCode")}</th>
                                        <th>{t("classDetail.colLast")}</th>
                                        <th>{t("classDetail.colNext")}</th>
                                        <th style={{ textAlign: "center" }}>{t("classDetail.colAction")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((st) => {
                                        const hasAssessed = Boolean(st.last_assessment);
                                        return (
                                            <tr key={st.id}>
                                                <td data-label={t("student.colNo")} style={{ textAlign: "center" }}>
                                                    <span className="gc-no">{st.absence_number}</span>
                                                </td>
                                                <td data-label={t("classDetail.colName")} className="gc-td-name">
                                                    <div
                                                        className="gc-student-cell"
                                                        onClick={() => navigate(`/student/${classId}/siswa/${st.id}`)}
                                                        title={t("classDetail.openProgressTitle")}
                                                    >
                                                        <div className="gc-student-info">
                                                            <span className="gc-student-name">{st.name}</span>
                                                            <small className="gc-student-born">
                                                                {t("classDetail.born", { date: st.birth_date || "-" })}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td data-label={t("classDetail.colGender")} style={{ textAlign: "center" }}>
                                                    <span className={`gc-gender-pill ${st.gender === "P" ? "gc-gender-p" : "gc-gender-l"}`}>
                                                        {st.gender}
                                                    </span>
                                                </td>
                                                <td data-label={t("classDetail.colAge")}>
                                                    <Trans
                                                        i18nKey="classDetail.ageMonths"
                                                        values={{ n: st.age_months }}
                                                        components={{ strong: <strong /> }}
                                                    />
                                                </td>
                                                <td data-label={t("classDetail.colCode")}>
                                                    {st.invitation_code ? (
                                                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                            <code className="gc-code-inline">{st.invitation_code}</code>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopyStudentCode(st.invitation_code, st.name)}
                                                                className="gc-copy-mini-btn"
                                                                title={t("classDetail.copyTitle")}
                                                            >
                                                                {t("classDetail.copy")}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td data-label={t("classDetail.colLast")}>
                                                    {renderKategoriBadge(st.last_assessment, t)}
                                                </td>
                                                <td data-label={t("classDetail.colNext")}>
                                                    {renderReminderBadge(st.reminder, t)}
                                                </td>
                                                <td data-label={t("classDetail.colAction")}>
                                                    <div className="gc-row-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenAssessModal(st)}
                                                            className="gc-assess-btn"
                                                        >
                                                            {hasAssessed ? t("classDetail.reassess") : t("classDetail.startAssess")}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/student/${classId}/siswa/${st.id}`)}
                                                            className="gc-history-btn"
                                                            title={t("classDetail.chartTitle")}
                                                        >
                                                            {t("classDetail.chartBtn")}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEditStudent(st)}
                                                            className="gc-icon-btn gc-icon-btn-edit"
                                                            title={t("classDetail.editStudentTitle")}
                                                            aria-label={t("classList.editAria", { name: st.name })}
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setStudentToDelete(st)}
                                                            className="gc-icon-btn gc-icon-btn-delete"
                                                            title={t("classDetail.deleteStudentTitle")}
                                                            aria-label={t("classList.deleteAria", { name: st.name })}
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
                            <h3>{editingStudent ? t("classDetail.editStudentTitle") : t("classDetail.addStudentTitle")}</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={handleCloseStudentModal}
                                aria-label={t("common.close")}
                            >
                                <XIcon />
                            </button>
                        </div>

                        <form onSubmit={handleSaveStudent} className="gc-modal-form">
                            <div className="student-field">
                                <label htmlFor="st-name-input">{t("classDetail.fullName")}</label>
                                <input
                                    id="st-name-input"
                                    type="text"
                                    placeholder={t("classDetail.fullNamePh")}
                                    value={studentForm.name}
                                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                                    required
                                    className="student-input"
                                />
                            </div>

                            <div className="gc-form-row-2">
                                <div className="student-field">
                                    <label htmlFor="st-absence-input">{t("classDetail.absenceNo")}</label>
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
                                    <label htmlFor="st-gender-select">{t("classDetail.genderLabel")}</label>
                                    <select
                                        id="st-gender-select"
                                        value={studentForm.gender}
                                        onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                                        required
                                        className="student-input"
                                    >
                                        <option value="L">{t("common.male")} (L)</option>
                                        <option value="P">{t("common.female")} (P)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="student-field">
                                <label htmlFor="st-birthdate-input">{t("classDetail.birthDate")}</label>
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
                                    {t("classDetail.birthHelp")}
                                </small>
                            </div>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={handleCloseStudentModal}
                                    className="gc-secondary-btn"
                                    disabled={savingStudent}
                                >
                                    {t("common.cancel")}
                                </button>
                                <button
                                    type="submit"
                                    className="gc-navy-btn"
                                    disabled={savingStudent}
                                >
                                    {savingStudent
                                        ? t("classList.saving")
                                        : editingStudent
                                        ? t("classList.saveChanges")
                                        : t("student.addStudent")}
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
                            <h3>{t("classDetail.deleteModalTitle")}</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={() => !deletingStudent && setStudentToDelete(null)}
                                aria-label={t("common.close")}
                            >
                                <XIcon />
                            </button>
                        </div>

                        <div className="gc-modal-body">
                            <p style={{ margin: "0 0 12px", color: "#1e293b", fontSize: "0.95rem", lineHeight: "1.5" }}>
                                <Trans
                                    i18nKey="classDetail.deleteConfirm"
                                    values={{ name: studentToDelete.name, no: studentToDelete.absence_number }}
                                    components={{ strong: <strong /> }}
                                />
                            </p>
                            <div className="gc-danger-alert">
                                ⚠️ {t("classDetail.deleteWarning")}
                            </div>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setStudentToDelete(null)}
                                    className="gc-secondary-btn"
                                    disabled={deletingStudent}
                                >
                                    {t("common.cancel")}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDeleteStudent}
                                    className="gc-danger-btn"
                                    disabled={deletingStudent}
                                >
                                    {deletingStudent ? t("classList.deleting") : t("classDetail.confirmDeleteStudent")}
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
                        className={`gc-modal-card ${assessmentResult ? "gc-modal-card-wide" : "gc-modal-card-assess"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="gc-modal-header">
                            <h3>
                                {assessmentResult
                                    ? t("classDetail.resultModalTitle", { name: assessStudent.name })
                                    : t("classDetail.assessModalTitle", { name: assessStudent.name })}
                            </h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={handleCloseAssessModal}
                                aria-label={t("common.close")}
                            >
                                <XIcon />
                            </button>
                        </div>

                        <div className="gc-modal-body">
                            {!assessmentResult ? (
                                <form onSubmit={handleProcessAssessment} className="gc-assess-form">
                                    {/* Ringkasan siswa */}
                                    <div className="gc-assess-table-wrap">
                                        <table className="gc-assess-table">
                                            <thead>
                                                <tr>
                                                    <th>{t("student.metaName")}</th>
                                                    <th>{t("student.metaGender")}</th>
                                                    <th>{t("parentChildren.currentAge")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="gc-assess-name">
                                                            <span>{assessStudent.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {assessStudent.gender === "L" ? t("common.male") : t("common.female")}
                                                    </td>
                                                    <td className="gc-assess-age">
                                                        <Trans
                                                            i18nKey="classDetail.ageMonths"
                                                            values={{ n: assessStudent.age_months }}
                                                            components={{ strong: <strong /> }}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Unggah foto */}
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
                                                    alt={t("classDetail.previewAlt")}
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
                                                    aria-label={t("student.cancelImage")}
                                                    title={t("student.cancelImage")}
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
                                                t("classDetail.dropHint")
                                            )}
                                        </p>

                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                            onChange={(e) => handleSelectImageFile(e.target.files?.[0])}
                                            className="dropzone-input"
                                        />
                                    </label>

                                    {/* Catatan guru */}
                                    <div className="student-field">
                                        <label htmlFor="assess-teacher-notes">{t("classDetail.notesLabel")}</label>
                                        <textarea
                                            id="assess-teacher-notes"
                                            rows={3}
                                            placeholder={t("classDetail.notesPh")}
                                            value={teacherNotes}
                                            onChange={(e) => setTeacherNotes(e.target.value)}
                                            className="student-input"
                                        />
                                    </div>

                                    {/* Aksi */}
                                    <div className="gc-assess-actions">
                                        <button
                                            type="button"
                                            onClick={handleCloseAssessModal}
                                            className="gc-secondary-btn"
                                            disabled={isAnalyzing}
                                        >
                                            {t("common.cancel")}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isAnalyzing || !imageFile}
                                            className="gc-primary-submit"
                                        >
                                            {isAnalyzing ? (
                                                t("student.analyzing")
                                            ) : (
                                                <>
                                                    <SendIcon />
                                                    <span>{t("classDetail.processAssess")}</span>
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
                                            {t("classDetail.uploadAnother")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseAssessModal}
                                            className="gc-navy-btn"
                                        >
                                            {t("classDetail.doneClose")}
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