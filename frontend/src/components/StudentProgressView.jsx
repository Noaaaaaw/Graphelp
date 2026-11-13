import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import AssessmentResult from "./AssessmentResult";
import { useToast } from "./Toast";

/* ---------- Konstanta ---------- */
const KATEGORI_BADGE = {
    BB: { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5", label: "Belum Berkembang" },
    MB: { bg: "#ffedd5", color: "#c2410c", border: "#fdba74", label: "Mulai Berkembang" },
    BSH: { bg: "#dcfce7", color: "#15803d", border: "#86efac", label: "Berkembang Sesuai Harapan" },
    BSB: { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd", label: "Berkembang Sangat Baik" },
};

const SCORE_TO_KAT = { 1: "BB", 2: "MB", 3: "BSH", 4: "BSB" };
const FIT_KATS = ["BSB", "BSH", "SESUAI"];

// Nilai dari backend berbahasa Indonesia, hanya tampilannya yang diterjemahkan
const DELTA_KEYS = {
    Meningkat: "up",
    Stabil: "stable",
    Menurun: "down",
    "Asesmen Awal": "initial",
};

const DELTA_STYLE = {
    up: { bg: "#dcfce7", color: "#15803d", border: "#86efac" },
    stable: { bg: "#f1f5f9", color: "#334155", border: "#cbd5e1" },
    down: { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" },
    initial: { bg: "#e0f2fe", color: "#0369a1", border: "#7dd3fc" },
};

const REMINDER_TONE = {
    jatuh_tempo: { color: "#b91c1c", soft: "#fef2f2", border: "#fecaca", glow: "rgba(185,28,28,.14)" },
    segera: { color: "#b45309", soft: "#fffbeb", border: "#fde68a", glow: "rgba(180,83,9,.14)" },
    terjadwal: { color: "#0f766e", soft: "#f0fdfa", border: "#99f6e4", glow: "rgba(15,118,110,.14)" },
    belum_dijadwalkan: { color: "#475569", soft: "#f8fafc", border: "#e2e8f0", glow: "rgba(71,85,105,.10)" },
};

const INDIKATOR_KEYS = ["kestabilan_goresan", "kontrol_tekanan", "proporsi_spasial", "kontinuitas_garis"];

// Pilihan model grafik: [kunci, teks cadangan jika i18n belum ada]
const CHART_VIEWS = [
    ["line", "Garis"],
    ["bar", "Batang"],
];

/* ---------- Ikon ---------- */
const ICONS = {
    calendar: (
        <>
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    layers: (
        <>
            <path d="m12 2 10 5-10 5L2 7z" />
            <path d="m2 12 10 5 10-5" />
            <path d="m2 17 10 5 10-5" />
        </>
    ),
    trendUp: (
        <>
            <path d="m3 17 6-6 4 4 8-8" />
            <path d="M14 7h7v7" />
        </>
    ),
    trendDown: (
        <>
            <path d="m3 7 6 6 4-4 8 8" />
            <path d="M14 17h7v-7" />
        </>
    ),
    minus: <path d="M5 12h14" />,
    spark: <path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z" />,
    key: (
        <>
            <circle cx="8" cy="15" r="4" />
            <path d="m10.8 12.2 9.2-9.2M16 7l3 3M14 9l2 2" />
        </>
    ),
    copy: (
        <>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </>
    ),
    check: <path d="m5 12 5 5 9-10" />,
    cross: (
        <>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </>
    ),
    bell: (
        <>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </>
    ),
    settings: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    info: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4M12 8h.01" />
        </>
    ),
    chart: (
        <>
            <path d="M3 3v18h18" />
            <path d="M7 15v3M12 10v8M17 6v12" />
        </>
    ),
    folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
};

function Ic({ name, size = 16, sw = 2 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {ICONS[name]}
        </svg>
    );
}

function deltaIconName(key) {
    if (key === "up") return "trendUp";
    if (key === "down") return "trendDown";
    if (key === "initial") return "spark";
    return "minus";
}

// Skor (1-4) satu indikator pada satu penilaian
function getScore(pt, key) {
    return pt.indikator_scores?.[key] || pt.kategori_score || 2;
}

function reminderHeadline(reminder, t) {
    const days = Number(reminder.days_remaining);
    if (reminder.status === "jatuh_tempo") {
        return days < 0
            ? t("common.reminder.overdue", { days: Math.abs(days) })
            : t("common.reminder.today");
    }
    if (reminder.status === "segera") return t("common.reminder.soon", { days });
    if (reminder.status === "terjadwal") return t("common.reminder.scheduled", { days });
    return reminder.label || t("common.reminder.none");
}

export default function StudentProgressView({
    progressData,
    isTeacher = false,
    onOpenNewAssessment,
    onSaveSchedule,
}) {
    const { t } = useTranslation();
    const toast = useToast();
    const student = progressData?.student || {};
    const classInfo = progressData?.class_info || {};
    const summary = progressData?.summary || {};
    const series = Array.isArray(progressData?.progress_series) ? progressData.progress_series : [];
    const assessments = Array.isArray(progressData?.assessments) ? progressData.assessments : [];

    const [selectedAssessmentId, setSelectedAssessmentId] = useState(assessments[0]?.id || null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [schedDate, setSchedDate] = useState(student.next_assessment_date || "");
    const [schedInterval, setSchedInterval] = useState(String(student.assessment_interval_days || 30));
    const [savingSchedule, setSavingSchedule] = useState(false);
    const [copied, setCopied] = useState(false);
    const copyTimer = useRef(null);

    // Model grafik aktif (line | bar)
    const [chartView, setChartView] = useState("line");

    useEffect(() => () => clearTimeout(copyTimer.current), []);

    // Tab periode diurutkan dari yang paling awal (1) ke terbaru; pilihan default tetap yang terbaru
    const tabsAsc = assessments.every((x) => Number.isFinite(Number(x.sequence_number)))
        ? [...assessments].sort((x, y) => Number(x.sequence_number) - Number(y.sequence_number))
        : [...assessments].reverse();

    const activeAssessment =
        assessments.find((a) => a.id === selectedAssessmentId) || assessments[0] || null;

    const reminder = student.reminder || {
        status: "belum_dijadwalkan",
        label: "",
        next_assessment_date: null,
        interval_days: 30,
    };
    const tone = REMINDER_TONE[reminder.status] || REMINDER_TONE.belum_dijadwalkan;
    const hasCountdown = reminder.status !== "belum_dijadwalkan" && !Number.isNaN(Number(reminder.days_remaining));
    const daysNum = Number(reminder.days_remaining);
    const intervalDays = Number(reminder.interval_days) || 30;
    const barPct = hasCountdown
        ? Math.max(4, Math.min(100, Math.round((1 - Math.max(0, daysNum) / intervalDays) * 100)))
        : 0;

    const handleCopyCode = () => {
        if (!student.invitation_code) return;
        navigator.clipboard.writeText(student.invitation_code);
        toast.success(t("progressView.copyToast", { code: student.invitation_code }));
        setCopied(true);
        clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 1800);
    };

    const handleOpenScheduleModal = () => {
        setSchedDate(student.next_assessment_date || "");
        setSchedInterval(String(student.assessment_interval_days || 30));
        setIsScheduleModalOpen(true);
    };

    const handleSubmitSchedule = async (e) => {
        e.preventDefault();
        if (!onSaveSchedule) return;
        setSavingSchedule(true);
        try {
            await onSaveSchedule({
                next_assessment_date: schedDate || null,
                assessment_interval_days: Number(schedInterval) || 30,
            });
            setIsScheduleModalOpen(false);
        } finally {
            setSavingSchedule(false);
        }
    };

    /* ---------- Perhitungan grafik garis ---------- */
    const chartWidth = 720;
    const chartHeight = 300;
    const padLeft = 70;
    const padRight = 56;
    const padTop = 46;
    const padBottom = 80;
    const innerW = chartWidth - padLeft - padRight;
    const innerH = chartHeight - padTop - padBottom;
    const baseY = padTop + innerH;

    const getPointCoords = (idx, total, score) => {
        const x = total <= 1 ? padLeft + innerW / 2 : padLeft + (idx / (total - 1)) * innerW;
        const clamped = Math.max(1, Math.min(4, Number(score) || 1));
        const y = padTop + ((4 - clamped) / 3) * innerH;
        return { x, y };
    };

    const chartPoints = series.map((pt, idx) => ({
        ...pt,
        ...getPointCoords(idx, series.length, pt.kategori_score),
    }));

    const linePoints = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");
    const areaPath =
        chartPoints.length > 1
            ? `M ${chartPoints[0].x} ${baseY} L ${chartPoints.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${chartPoints[chartPoints.length - 1].x} ${baseY} Z`
            : "";

    /* ---------- Perhitungan grafik batang ---------- */
    const barSvgW = 720;
    const barSvgH = 320;
    const barPadL = 78;
    const barPadR = 30;
    const barPadT = 40;
    const barPadB = 74;
    const barInnerW = barSvgW - barPadL - barPadR;
    const barInnerH = barSvgH - barPadT - barPadB;
    const barBaseY = barPadT + barInnerH;
    const barSlot = series.length ? barInnerW / series.length : barInnerW;
    const barWidth = Math.min(72, barSlot * 0.5);

    const latestIsFit = summary.latest_kategori
        ? FIT_KATS.includes(String(summary.latest_kategori).toUpperCase())
        : false;

    const latestDeltaKey = DELTA_KEYS[summary.latest_delta_status];
    const latestDeltaStyle = latestDeltaKey ? DELTA_STYLE[latestDeltaKey] : null;

    const initial = (student.name || "?").trim().charAt(0).toUpperCase();
    const genderLabel = student.gender === "P" ? t("common.female") : t("common.male");

    return (
        <div className="spv">
            {/* BARIS 1: PROFIL & PENGINGAT */}
            <div className="spv-grid">
                {/* Profil */}
                <div className="spv-card spv-profile">
                    <div className="spv-banner">
                        <div className="spv-banner-top">
                            <span className="spv-eyebrow spv-eyebrow-light">{t("progressView.eyebrowProfile")}</span>
                            <span className="spv-gender">
                                {genderLabel} ({student.gender === "P" ? "P" : "L"})
                            </span>
                        </div>
                        <div className="spv-banner-main">
                            <div className="spv-avatar">{initial}</div>
                            <div className="spv-banner-text">
                                <h3 className="spv-name">
                                    {student.absence_number ? `${student.absence_number}. ` : ""}
                                    {student.name}
                                </h3>
                                <div className="spv-chips">
                                    <span className="spv-chip">
                                        {t("progressView.classLabel")} {classInfo.name || "-"} ({classInfo.academic_year || "-"})
                                    </span>
                                    <span className="spv-chip">
                                        {t("progressView.schoolLabel")}: {classInfo.school_name || "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="spv-profile-body">
                        <div className="spv-stats">
                            <div className="spv-stat">
                                <span className="spv-stat-ico"><Ic name="calendar" /></span>
                                <span className="spv-stat-label">{t("progressView.birthDate")}</span>
                                <span className="spv-stat-value">{student.birth_date || "-"}</span>
                            </div>
                            <div className="spv-stat">
                                <span className="spv-stat-ico"><Ic name="clock" /></span>
                                <span className="spv-stat-label">{t("progressView.currentAge")}</span>
                                <span className="spv-stat-value">{t("progressView.months", { n: student.age_months })}</span>
                            </div>
                            <div className="spv-stat">
                                <span className="spv-stat-ico"><Ic name="layers" /></span>
                                <span className="spv-stat-label">{t("progressView.totalAssessments")}</span>
                                <span className="spv-stat-value">{t("progressView.times", { n: summary.total_assessments || 0 })}</span>
                            </div>
                            <div className="spv-stat">
                                <span className="spv-stat-ico"><Ic name="trendUp" /></span>
                                <span className="spv-stat-label">{t("progressView.latestProgress")}</span>
                                <span className="spv-stat-value">
                                    {latestDeltaStyle ? (
                                        <span
                                            className="spv-delta"
                                            style={{
                                                background: latestDeltaStyle.bg,
                                                color: latestDeltaStyle.color,
                                                border: `1px solid ${latestDeltaStyle.border}`,
                                            }}
                                        >
                                            <Ic name={deltaIconName(latestDeltaKey)} size={12} sw={3} />
                                            {t(`common.delta.${latestDeltaKey}`)}
                                        </span>
                                    ) : (
                                        t("progressView.none")
                                    )}
                                </span>
                            </div>
                        </div>

                        {student.invitation_code && (
                            <div className="spv-code">
                                <div>
                                    <div className="spv-code-title">
                                        <Ic name="key" size={15} />
                                        {t("progressView.codeTitle")}
                                    </div>
                                    <p className="spv-code-desc">
                                        {isTeacher ? t("progressView.codeDescTeacher") : t("progressView.codeDescParent")}
                                    </p>
                                </div>
                                <div className="spv-code-box">
                                    <code className="spv-code-pill">{student.invitation_code}</code>
                                    <button
                                        type="button"
                                        onClick={handleCopyCode}
                                        className={`spv-btn spv-btn-sky ${copied ? "done" : ""}`}
                                        title={t("progressView.copyCode")}
                                    >
                                        <Ic name={copied ? "check" : "copy"} size={15} sw={2.4} />
                                        {copied ? t("progressView.copied") : t("progressView.copyCode")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pengingat */}
                <div
                    className="spv-card spv-rem"
                    style={{
                        "--tone": tone.color,
                        "--soft": tone.soft,
                        "--border": tone.border,
                        "--glow": tone.glow,
                    }}
                >
                    <div className="spv-rem-head">
                        <span className="spv-eyebrow">
                            <Ic name="bell" size={14} sw={2.4} />
                            {t("progressView.reminderEyebrow")}
                        </span>
                        {isTeacher && onSaveSchedule && (
                            <button type="button" onClick={handleOpenScheduleModal} className="spv-btn spv-btn-ghost">
                                <Ic name="settings" size={14} />
                                {t("progressView.setSchedule")}
                            </button>
                        )}
                    </div>

                    <div className="spv-count">
                        {hasCountdown && reminder.status !== "jatuh_tempo" && (
                            <span className="spv-count-num">{daysNum}</span>
                        )}
                        <span className="spv-count-text">{reminderHeadline(reminder, t)}</span>
                    </div>

                    {hasCountdown && (
                        <div className="spv-bar" aria-hidden="true">
                            <span style={{ width: `${barPct}%` }} />
                        </div>
                    )}

                    <div className="spv-rem-rows">
                        <div className="spv-rem-row">
                            <span>{t("progressView.nextDate")}</span>
                            <strong>{reminder.next_assessment_date || t("progressView.nextDateAuto")}</strong>
                        </div>
                        <div className="spv-rem-row">
                            <span>{t("progressView.cycle")}</span>
                            <strong>{t("progressView.cycleValue", { n: intervalDays })}</strong>
                        </div>
                    </div>

                    <div className="spv-note">
                        <Ic name="info" size={14} />
                        <span>{t("progressView.reminderNote")}</span>
                    </div>

                    {isTeacher && onOpenNewAssessment && (
                        <div className="spv-rem-cta">
                            <button type="button" onClick={onOpenNewAssessment} className="spv-btn spv-btn-navy">
                                <Ic name="plus" size={16} sw={2.6} />
                                {assessments.length > 0 ? t("progressView.startNew") : t("progressView.startFirst")}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* BARIS 2: GRAFIK */}
            <div className="spv-card">
                <div className="spv-chart-head">
                    <div>
                        <span className="spv-eyebrow">
                            <Ic name="chart" size={14} sw={2.4} />
                            {t("progressView.chartEyebrow")}
                        </span>
                        <h3 className="spv-h">{t("progressView.chartTitle")}</h3>
                    </div>
                    {summary.latest_kategori && (
                        <div className={`spv-status ${latestIsFit ? "ok" : "no"}`}>
                            {t("progressView.statusNow")}
                            <strong>
                                <Ic name={latestIsFit ? "check" : "cross"} size={14} sw={3} />
                                {latestIsFit ? t("progressView.statusYes") : t("progressView.statusNo")}
                            </strong>
                        </div>
                    )}
                </div>

                {series.length === 0 ? (
                    <div className="spv-empty">
                        <h4>{t("progressView.noChartTitle")}</h4>
                        <p>{t("progressView.noChartDesc")}</p>
                    </div>
                ) : (
                    <>
                        {/* Pilihan model grafik */}
                        <div className="spv-view-tabs" role="tablist">
                            {CHART_VIEWS.map(([k, fallback]) => (
                                <button
                                    key={k}
                                    type="button"
                                    role="tab"
                                    aria-selected={chartView === k}
                                    className={`spv-view-tab ${chartView === k ? "active" : ""}`}
                                    onClick={() => setChartView(k)}
                                >
                                    {t(`progressView.view.${k}`, { defaultValue: fallback })}
                                </button>
                            ))}
                        </div>

                        {/* MODEL 1: GARIS */}
                        {chartView === "line" && (
                            <div className="spv-chart-wrap">
                                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={t("progressView.chartTitle")}>
                                    <defs>
                                        <linearGradient id="spv-area" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.28" />
                                            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                                        </linearGradient>
                                        <linearGradient id="spv-line" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#0d9488" />
                                            <stop offset="100%" stopColor="#0284c7" />
                                        </linearGradient>
                                        <filter id="spv-glow" x="-60%" y="-60%" width="220%" height="220%">
                                            <feGaussianBlur stdDeviation="4" />
                                        </filter>
                                    </defs>

                                    {/* Pita level */}
                                    {[4, 3, 2, 1].map((score) => {
                                        const y = padTop + ((4 - score) / 3) * innerH;
                                        const kat = SCORE_TO_KAT[score];
                                        return (
                                            <g key={score}>
                                                <line
                                                    x1={padLeft}
                                                    y1={y}
                                                    x2={chartWidth - padRight}
                                                    y2={y}
                                                    stroke="#e2e8f0"
                                                    strokeDasharray="3 6"
                                                    strokeWidth="1"
                                                />
                                                <text x={padLeft - 12} y={y + 4} textAnchor="end" fontSize="11" fontWeight="800" fill={KATEGORI_BADGE[kat].color}>
                                                    {kat} ({score})
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {areaPath && <path d={areaPath} fill="url(#spv-area)" />}

                                    {chartPoints.length > 1 && (
                                        <polyline
                                            fill="none"
                                            stroke="url(#spv-line)"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            points={linePoints}
                                        />
                                    )}

                                    {chartPoints.map((pt, idx) => {
                                        const isSelected = activeAssessment?.id === pt.assessment_id;
                                        const badge = KATEGORI_BADGE[pt.kategori] || KATEGORI_BADGE.MB;
                                        const isFit = FIT_KATS.includes(String(pt.kategori).toUpperCase());
                                        const prev = chartPoints[idx - 1];
                                        const next = chartPoints[idx + 1];
                                        const isLocalMin =
                                            (prev && pt.y > prev.y && (!next || pt.y >= next.y)) ||
                                            (next && pt.y > next.y && (!prev || pt.y >= prev.y));
                                        const placeBelow = Number(pt.kategori_score) === 1 || isLocalMin;
                                        const labelText = `${isFit ? t("progressView.fit") : t("progressView.notFit")} (${pt.confidence}%)`;
                                        const labelW = labelText.length * 6.3 + 20;
                                        const labelY = placeBelow ? pt.y + 14 : pt.y - 36;
                                        const labelX = Math.max(8, Math.min(chartWidth - 8 - labelW, pt.x - labelW / 2));
                                        return (
                                            <g
                                                key={pt.assessment_id}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setSelectedAssessmentId(pt.assessment_id)}
                                            >
                                                <title>
                                                    {t("progressView.assessmentN", { n: pt.sequence_number })} • {labelText}
                                                </title>
                                                {isSelected && (
                                                    <circle cx={pt.x} cy={pt.y} r="15" fill={badge.color} opacity="0.35" filter="url(#spv-glow)" />
                                                )}
                                                <circle
                                                    className="spv-dot"
                                                    cx={pt.x}
                                                    cy={pt.y}
                                                    r={isSelected ? 9.5 : 7}
                                                    fill={badge.color}
                                                    stroke="#fff"
                                                    strokeWidth="3"
                                                />
                                                <rect
                                                    x={labelX}
                                                    y={labelY}
                                                    width={labelW}
                                                    height="22"
                                                    rx="11"
                                                    fill="#fff"
                                                    stroke={isFit ? "#86efac" : "#fca5a5"}
                                                />
                                                <text
                                                    x={labelX + labelW / 2}
                                                    y={labelY + 15}
                                                    textAnchor="middle"
                                                    fontSize="10.5"
                                                    fontWeight="800"
                                                    fill={isFit ? "#15803d" : "#b91c1c"}
                                                >
                                                    {labelText}
                                                </text>
                                                <text x={pt.x} y={chartHeight - 30} textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">
                                                    {t("progressView.seqShort", { n: pt.sequence_number })}
                                                </text>
                                                <text x={pt.x} y={chartHeight - 14} textAnchor="middle" fontSize="9.5" fill="#94a3b8">
                                                    {(pt.tanggal || "").split(" ")[0]}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        )}

                        {/* MODEL 2: BATANG */}
                        {chartView === "bar" && (
                            <div className="spv-chart-wrap">
                                <svg viewBox={`0 0 ${barSvgW} ${barSvgH}`} role="img" aria-label={t("progressView.chartTitle")}>
                                    <defs>
                                        {Object.entries(KATEGORI_BADGE).map(([kat, b]) => (
                                            <linearGradient key={kat} id={`spv-bar-${kat}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={b.color} stopOpacity="1" />
                                                <stop offset="100%" stopColor={b.color} stopOpacity="0.55" />
                                            </linearGradient>
                                        ))}
                                    </defs>

                                    {/* garis bantu + label level */}
                                    {[1, 2, 3, 4].map((score) => {
                                        const y = barBaseY - (score / 4) * barInnerH;
                                        const kat = SCORE_TO_KAT[score];
                                        return (
                                            <g key={score}>
                                                <line
                                                    x1={barPadL}
                                                    y1={y}
                                                    x2={barSvgW - barPadR}
                                                    y2={y}
                                                    stroke="#e2e8f0"
                                                    strokeDasharray="3 6"
                                                />
                                                <text x={barPadL - 12} y={y + 4} textAnchor="end" fontSize="11" fontWeight="800" fill={KATEGORI_BADGE[kat].color}>
                                                    {kat} ({score})
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {series.map((pt, idx) => {
                                        const score = Math.max(1, Math.min(4, Number(pt.kategori_score) || 1));
                                        const kat = SCORE_TO_KAT[score];
                                        const h = (score / 4) * barInnerH;
                                        const cx = barPadL + barSlot * (idx + 0.5);
                                        const isSelected = activeAssessment?.id === pt.assessment_id;
                                        return (
                                            <g
                                                key={pt.assessment_id}
                                                className="spv-bar-g"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setSelectedAssessmentId(pt.assessment_id)}
                                            >
                                                <title>
                                                    {t("progressView.assessmentN", { n: pt.sequence_number })} • {kat} • {pt.confidence}%
                                                </title>
                                                <rect
                                                    className="spv-bar-rect"
                                                    x={cx - barWidth / 2}
                                                    y={barBaseY - h}
                                                    width={barWidth}
                                                    height={h}
                                                    rx="10"
                                                    fill={`url(#spv-bar-${kat})`}
                                                    stroke={isSelected ? "#1c3446" : "none"}
                                                    strokeWidth="2.5"
                                                    style={{ animationDelay: `${idx * 0.09}s` }}
                                                />
                                                <text x={cx} y={barBaseY - h - 10} textAnchor="middle" fontSize="12" fontWeight="800" fill={KATEGORI_BADGE[kat].color}>
                                                    {pt.confidence}%
                                                </text>
                                                <text x={cx} y={barBaseY + 24} textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">
                                                    {t("progressView.seqShort", { n: pt.sequence_number })}
                                                </text>
                                                <text x={cx} y={barBaseY + 40} textAnchor="middle" fontSize="9.5" fill="#94a3b8">
                                                    {(pt.tanggal || "").split(" ")[0]}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        )}

                        {/* Matriks indikator */}
                        <h4 className="spv-sub-h">{t("progressView.matrixTitle")}</h4>
                        <div className="spv-table-wrap">
                            <table className="spv-table">
                                <thead>
                                    <tr>
                                        <th className="spv-col-no">{t("progressView.matrixNo", { defaultValue: "No" })}</th>
                                        <th className="spv-col-ind">{t("progressView.matrixIndicator")}</th>
                                        {series.map((pt) => (
                                            <th key={pt.assessment_id}>
                                                {t("progressView.assessmentN", { n: pt.sequence_number })}
                                                <small>{(pt.tanggal || "").split(" ")[0]}</small>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {INDIKATOR_KEYS.map((key, i) => (
                                        <tr key={key}>
                                            <td className="spv-col-no">
                                                <span className="spv-no-badge">{i + 1}</span>
                                            </td>
                                            <td className="spv-col-ind">{t(`progressView.indicators.${key}`)}</td>
                                            {series.map((pt) => {
                                                const sc = getScore(pt, key);
                                                const kat = SCORE_TO_KAT[sc] || "MB";
                                                const st = KATEGORI_BADGE[kat];
                                                return (
                                                    <td key={pt.assessment_id}>
                                                        <span
                                                            className="spv-pill"
                                                            style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}
                                                        >
                                                            {kat} ({sc}/4)
                                                        </span>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* BARIS 3: RIWAYAT */}
            <div className="spv-card">
                <span className="spv-eyebrow">
                    <Ic name="folder" size={14} sw={2.4} />
                    {t("progressView.historyEyebrow")}
                </span>
                <h3 className="spv-h">{t("progressView.historyTitle", { n: assessments.length })}</h3>
                <p className="spv-sub" style={{ marginTop: 6 }}>{t("progressView.historyDesc")}</p>

                {assessments.length === 0 ? (
                    <div className="spv-empty">
                        <h4>{t("progressView.noHistoryTitle")}</h4>
                        <p>{t("progressView.noHistoryDesc")}</p>
                    </div>
                ) : (
                    <>
                        <div className="spv-tabs">
                            {tabsAsc.map((item) => {
                                const isSelected = activeAssessment?.id === item.id;
                                const itemIsYa =
                                    (item.kesimpulan && item.kesimpulan.includes("Ya")) ||
                                    FIT_KATS.includes(String(item.kategori).toUpperCase());
                                const dKey = DELTA_KEYS[item.delta_status] || "stable";
                                const dStyle = DELTA_STYLE[dKey];
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedAssessmentId(item.id)}
                                        className={`spv-tab ${isSelected ? "active" : ""}`}
                                    >
                                        <div className="spv-tab-row">
                                            <span className="spv-tab-title">
                                                {item.sequence_number
                                                    ? t("progressView.assessmentN", { n: item.sequence_number })
                                                    : (item.period_label || "").replace(/\s*\(.*\)\s*$/, "")}
                                            </span>
                                            <span className={`spv-fit ${itemIsYa ? "ok" : "no"}`}>
                                                <Ic name={itemIsYa ? "check" : "cross"} size={11} sw={3.2} />
                                                {itemIsYa ? t("progressView.fitShort") : t("progressView.notFitShort")}
                                            </span>
                                        </div>
                                        <span className="spv-tab-meta">
                                            <Ic name="calendar" size={13} />
                                            {item.tanggal}
                                        </span>
                                        <div className="spv-tab-row spv-tab-foot">
                                            {item.delta_status ? (
                                                <span className="spv-tab-delta" style={{ color: dStyle.color }}>
                                                    <Ic name={deltaIconName(dKey)} size={12} sw={3} />
                                                    {t(`common.delta.${dKey}`, { defaultValue: item.delta_status })}
                                                </span>
                                            ) : (
                                                <span />
                                            )}
                                            {item.confidence != null && item.confidence !== "" && (
                                                <span className="spv-tab-conf">{item.confidence}%</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {activeAssessment && (
                            <div className="spv-detail">
                                <AssessmentResult
                                    result={activeAssessment}
                                    schoolName={classInfo.school_name || ""}
                                    gradeClass={classInfo.name || ""}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* MODAL ATUR JADWAL (di-portal ke <body> supaya tidak terjebak transform/animasi .spv) */}
            {isScheduleModalOpen &&
                createPortal(
                    <div className="gc-modal-overlay" onClick={() => !savingSchedule && setIsScheduleModalOpen(false)}>
                        <div className="gc-modal-card" onClick={(e) => e.stopPropagation()}>
                            <div className="gc-modal-header">
                                <h3>{t("progressView.scheduleModalTitle")}</h3>
                                <button
                                    type="button"
                                    className="gc-modal-close"
                                    onClick={() => !savingSchedule && setIsScheduleModalOpen(false)}
                                    aria-label={t("common.close")}
                                >
                                    <Ic name="cross" size={14} sw={2.6} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitSchedule} className="gc-modal-form">
                                <div className="student-field">
                                    <label htmlFor="sched-date-input">{t("progressView.schedDateLabel")}</label>
                                    <input
                                        id="sched-date-input"
                                        type="date"
                                        value={schedDate}
                                        onChange={(e) => setSchedDate(e.target.value)}
                                        className="student-input"
                                    />
                                    <small style={{ color: "#64748b", fontSize: "0.78rem" }}>
                                        {t("progressView.schedDateHelp")}
                                    </small>
                                </div>

                                <div className="student-field">
                                    <label htmlFor="sched-interval-input">{t("progressView.schedIntervalLabel")}</label>
                                    <input
                                        id="sched-interval-input"
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={schedInterval}
                                        onChange={(e) => setSchedInterval(e.target.value)}
                                        required
                                        className="student-input"
                                    />
                                    <small style={{ color: "#64748b", fontSize: "0.78rem" }}>
                                        {t("progressView.schedIntervalHelp")}
                                    </small>
                                </div>

                                <div className="gc-modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => setIsScheduleModalOpen(false)}
                                        className="gc-secondary-btn"
                                        disabled={savingSchedule}
                                    >
                                        {t("common.cancel")}
                                    </button>
                                    <button type="submit" className="gc-navy-btn" disabled={savingSchedule}>
                                        {savingSchedule ? t("progressView.saving") : t("progressView.saveSchedule")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}