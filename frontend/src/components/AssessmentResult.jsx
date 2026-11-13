import { useTranslation } from "react-i18next";
import { handlePrintStudentPDF } from "../utils/printAssessment";
import { getApiUrl } from "../config/api";
import "../style/assasment.css";

/* ---------- Ikon ---------- */
const svgProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
};

const small = { width: 13, height: 13, strokeWidth: 2.6 };

const TrendUpIcon = () => (
    <svg {...svgProps} {...small}>
        <path d="m22 7-8.5 8.5-5-5L2 17" />
        <path d="M16 7h6v6" />
    </svg>
);

const TrendDownIcon = () => (
    <svg {...svgProps} {...small}>
        <path d="m22 17-8.5-8.5-5 5L2 7" />
        <path d="M16 17h6v-6" />
    </svg>
);

const TrendFlatIcon = () => (
    <svg {...svgProps} {...small}>
        <path d="M5 12h14" />
    </svg>
);

const SparkIcon = () => (
    <svg {...svgProps} {...small}>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    </svg>
);

/* status dari backend (bahasa Indonesia) -> kelas CSS, ikon, dan kunci terjemahan */
const DELTA_BADGE = {
    Meningkat: { cls: "ar-tag-up", Icon: TrendUpIcon, key: "up" },
    Stabil: { cls: "ar-tag-stable", Icon: TrendFlatIcon, key: "stable" },
    Menurun: { cls: "ar-tag-down", Icon: TrendDownIcon, key: "down" },
    "Asesmen Awal": { cls: "ar-tag-initial", Icon: SparkIcon, key: "initial" },
};

const PrinterIcon = () => (
    <svg {...svgProps} width={17} height={17}>
        <path d="M6 9V2h12v7" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </svg>
);

const ClockIcon = () => (
    <svg {...svgProps} width={14} height={14}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const PencilIcon = () => (
    <svg {...svgProps} width={20} height={20}>
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
);

const ShapesIcon = () => (
    <svg {...svgProps} width={20} height={20}>
        <path d="M8.3 10a.7.7 0 0 1-.6-1l3.7-6a.7.7 0 0 1 1.2 0l3.7 6a.7.7 0 0 1-.6 1Z" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <circle cx="17.5" cy="17.5" r="3.5" />
    </svg>
);

const BulbIcon = () => (
    <svg {...svgProps}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
    </svg>
);

const NoteIcon = () => (
    <svg {...svgProps}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
    </svg>
);

const BellIcon = () => (
    <svg {...svgProps}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

const CheckIcon = ({ size = 13 }) => (
    <svg {...svgProps} width={size} height={size} strokeWidth={3}>
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const CrossIcon = ({ size = 13 }) => (
    <svg {...svgProps} width={size} height={size} strokeWidth={3}>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

/* ---------- Kartu penilaian ---------- */
function CriterionCard({ icon, name, question, isYa, reason }) {
    const { t } = useTranslation();

    return (
        <article className={`ar-crit ${isYa ? "ar-ok" : "ar-no"}`}>
            <div className="ar-crit-top">
                <div className="ar-crit-name">
                    <span className="ar-crit-ico">{icon}</span>
                    {name}
                </div>
                <span className="ar-pill">
                    {isYa ? <CheckIcon /> : <CrossIcon />}
                    {isYa ? t("assessmentResult.fit") : t("assessmentResult.notFit")}
                </span>
            </div>

            <p className="ar-crit-q">{question}</p>

            <p className="ar-reason">
                <b>{t("assessmentResult.reasonLabel")}</b>
                {reason}
            </p>
        </article>
    );
}

export default function AssessmentResult({ result, schoolName, gradeClass }) {
    const { t } = useTranslation();

    if (!result) return null;

    const isYa = result.kesimpulan?.includes("Ya");
    const tone = isYa ? "ar-ok" : "ar-no";
    const ageVal = result.age_months ?? result.age;
    const studentName = result.student_name || result.name || t("student.studentFallback");
    const imageUrl = result.image_url || result.image_path;
    const delta = DELTA_BADGE[result.delta_status];
    const initial = studentName.trim().charAt(0).toUpperCase() || "S";

    const confidence = Math.min(100, Math.max(0, Number(result.confidence) || 0));
    const confidenceLabel = Number.isInteger(confidence) ? confidence : confidence.toFixed(1);

    const genderLabel = result.gender
        ? result.gender === "L"
            ? t("common.male")
            : result.gender === "P"
              ? t("common.female")
              : ""
        : "";

    const reasonWriting = result.kesimpulan_menulis?.alasan || result.alasan_klinis || "-";
    const reasonDrawing = result.kesimpulan_menggambar?.alasan || result.alasan_klinis || "-";

    return (
        <section className="ar-card">
            {/* ===== HEADER ===== */}
            <header className="ar-head">
                <div className="ar-identity">
                    <div className="ar-avatar">{initial}</div>
                    <div>
                        <h4 className="ar-name">
                            {result.absence_number ? `No. ${result.absence_number} - ` : ""}
                            {studentName}
                        </h4>
                        {(ageVal || genderLabel) && (
                            <div className="ar-chips">
                                {ageVal ? <span className="ar-chip">{t("assessmentResult.ageMonths", { n: ageVal })}</span> : null}
                                {genderLabel ? <span className="ar-chip">{genderLabel}</span> : null}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    className="ar-print"
                    onClick={() => handlePrintStudentPDF(result, schoolName, gradeClass)}
                    title={t("student.printTitle")}
                >
                    <PrinterIcon />
                    <span>{t("student.printBtn")}</span>
                </button>
            </header>

            {/* ===== ISI ===== */}
            <div className="ar-body">
                {result.tanggal && (
                    <div className="ar-meta">
                        <span className="ar-meta-time">
                            <ClockIcon />
                            {t("assessmentResult.assessedAt", { date: result.tanggal })}
                        </span>
                        {result.period_label && (
                            <span className="ar-tag ar-tag-period">{result.period_label}</span>
                        )}
                        {delta && (
                            <span className={`ar-tag ${delta.cls}`}>
                                <delta.Icon />
                                {t(`common.delta.${delta.key}`)}
                            </span>
                        )}
                    </div>
                )}

                {/* Ringkasan: foto, kesimpulan, keyakinan */}
                <div className={`ar-summary ${tone}`}>
                    {imageUrl && (
                        <img
                            className="ar-photo"
                            src={getApiUrl(imageUrl)}
                            alt={t("assessmentResult.worksheetAlt", { name: studentName })}
                        />
                    )}

                    <div className="ar-summary-main">
                        <div className="ar-verdict">
                            <span className="ar-verdict-ico">
                                {isYa ? <CheckIcon size={22} /> : <CrossIcon size={22} />}
                            </span>
                            <div>
                                <div className="ar-verdict-text">
                                    {isYa ? t("assessmentResult.verdictYes") : t("assessmentResult.verdictNo")}
                                </div>
                                {result.status && <p className="ar-verdict-sub">{result.status}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="ar-conf-row">
                                <span>{t("assessmentResult.confidence")}</span>
                                <span className="ar-conf-num">{confidenceLabel}%</span>
                            </div>
                            <div
                                className="ar-meter"
                                role="progressbar"
                                aria-label={t("assessmentResult.confidence")}
                                aria-valuenow={confidence}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <span style={{ width: `${confidence}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Penilaian motorik halus */}
                <div className="ar-section">
                    <h4 className="ar-section-title">{t("assessmentResult.sectionTitle")}</h4>

                    <div className="ar-crit-grid">
                        <CriterionCard
                            icon={<PencilIcon />}
                            name={t("assessmentResult.writing")}
                            question={t("assessmentResult.writingQ")}
                            isYa={isYa}
                            reason={reasonWriting}
                        />
                        <CriterionCard
                            icon={<ShapesIcon />}
                            name={t("assessmentResult.drawing")}
                            question={t("assessmentResult.drawingQ")}
                            isYa={isYa}
                            reason={reasonDrawing}
                        />
                    </div>
                </div>

                {(result.saran_guru || result.teacher_notes || result.next_assessment_date) && (
                    <div className="ar-notes">
                        {result.saran_guru && (
                            <div className="ar-note ar-note-tip">
                                <span className="ar-note-ico">
                                    <BulbIcon />
                                </span>
                                <div>
                                    <strong>{t("assessmentResult.noteStimulation")}</strong>
                                    {result.saran_guru}
                                </div>
                            </div>
                        )}

                        {result.teacher_notes && (
                            <div className="ar-note ar-note-teacher">
                                <span className="ar-note-ico">
                                    <NoteIcon />
                                </span>
                                <div>
                                    <strong>{t("assessmentResult.noteTeacher")}</strong>
                                    {result.teacher_notes}
                                </div>
                            </div>
                        )}

                        {result.next_assessment_date && (
                            <div className="ar-note ar-note-next">
                                <span className="ar-note-ico">
                                    <BellIcon />
                                </span>
                                <div>
                                    <strong>{t("assessmentResult.noteNext")}</strong>
                                    {t("assessmentResult.nextDate", { date: result.next_assessment_date })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}