import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useToast } from "../components/Toast";
import { authFetch, extractErrorMessage } from "../config/api";
import { SpaceHero } from "./ClassListPage";
import AssessmentResult from "../components/AssessmentResult";
import StudentProgressView from "../components/StudentProgressView";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXT_REGEX = /\.(jpe?g|png|webp)$/i;

/* ---------- Ikon ---------- */
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

export default function StudentProgressPage() {
    const { t } = useTranslation();
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
                toast.error(extractErrorMessage(data, t("studentProgress.errLoad", { status: res.status })));
                if (res.status === 403 || res.status === 404) {
                    navigate(`/student/${classId}`);
                }
            }
        } catch (error) {
            console.error("Error fetching student progress:", error);
            toast.error(t("classList.errConnect"));
        } finally {
            setLoading(false);
        }
    }, [studentId, classId, navigate, toast, t]);

    useEffect(() => {
        if (!user || user.role !== "guru") {
            toast.error(t("classList.accessDenied"));
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
                    toast.error(extractErrorMessage(data, t("studentProgress.errLoad", { status: res.status })));
                    if (res.status === 403 || res.status === 404) {
                        navigate(`/student/${classId}`);
                    }
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching student progress:", error);
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
                toast.success(t("studentProgress.scheduleSaved"));
                fetchProgress();
            } else {
                toast.error(extractErrorMessage(data, t("studentProgress.errSchedule")));
            }
        } catch (error) {
            console.error("Error updating schedule:", error);
            toast.error(t("classList.errServer"));
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
            const res = await authFetch(`/students/${studentId}/assessments`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setAssessmentResult(data);
                toast.success(t("student.success"));
                fetchProgress();
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

    const student = progressData?.student;
    const classInfo = progressData?.class_info;
    const nextPeriod = (student?.total_assessments || 0) + 1;

    const heroTitle = student
        ? t("studentProgress.heroTitleNamed", { name: student.name })
        : t("studentProgress.heroTitle");

    const heroSubtitle = classInfo
        ? t("studentProgress.heroDescClass", {
              className: classInfo.name,
              year: classInfo.academic_year,
              school: classInfo.school_name,
          })
        : t("studentProgress.heroDesc");

    return (
        <main className="student-page">
            <SpaceHero title={heroTitle} subtitle={heroSubtitle} />

            <section className="student-cardz">
                <section className="student-container">
                    {loading ? (
                        <div className="gc-state-box">
                            <span className="history-spinner" />
                            <p>{t("studentProgress.loading")}</p>
                        </div>
                    ) : !progressData ? (
                        <div className="gc-state-box">
                            <h3>{t("studentProgress.notFound")}</h3>
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

            {/* MODAL ASESMEN BERKALA BARU / HASIL ASESMEN */}
            {isAssessModalOpen && student && (
                <div className="gc-modal-overlay" onClick={handleCloseAssessModal}>
                    <div
                        className={`gc-modal-card ${assessmentResult ? "gc-modal-card-wide" : "gc-modal-card-assess"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="gc-modal-header">
                            <h3>
                                {assessmentResult
                                    ? t("classDetail.resultModalTitle", { name: student.name })
                                    : t("studentProgress.assessModalTitle", { n: nextPeriod, name: student.name })}
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
                                                    <th>{t("studentProgress.period")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="gc-assess-name">
                                                            <span>
                                                                {student.absence_number ? `${student.absence_number}. ` : ""}
                                                                {student.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {student.gender === "P" ? t("common.female") : t("common.male")}
                                                    </td>
                                                    <td className="gc-assess-age">
                                                        <Trans
                                                            i18nKey="classDetail.ageMonths"
                                                            values={{ n: student.age_months }}
                                                            components={{ strong: <strong /> }}
                                                        />
                                                    </td>
                                                    <td>{t("studentProgress.periodValue", { n: nextPeriod })}</td>
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
                                        <label htmlFor="progress-teacher-notes">{t("classDetail.notesLabel")}</label>
                                        <textarea
                                            id="progress-teacher-notes"
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
                                        schoolName={classInfo?.school_name || ""}
                                        gradeClass={classInfo?.name || ""}
                                    />

                                    <div className="gc-modal-actions" style={{ marginTop: "18px" }}>
                                        <button
                                            type="button"
                                            onClick={handleCloseAssessModal}
                                            className="gc-navy-btn"
                                        >
                                            {t("studentProgress.doneViewChart")}
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