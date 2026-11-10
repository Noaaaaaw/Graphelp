import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useToast } from "../components/Toast";
import { authFetch, extractErrorMessage } from "../config/api";
import { SpaceHero } from "./ClassListPage";

const BANNER_GRADIENTS = [
    "linear-gradient(135deg, #1c3446 0%, #2f6f6b 100%)",
    "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)",
    "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)",
    "linear-gradient(135deg, #134e4a 0%, #0d9488 100%)",
    "linear-gradient(135deg, #3b0764 0%, #7e22ce 100%)",
];

// Nilai relasi dikirim ke backend dalam bahasa Indonesia, hanya tampilannya yang diterjemahkan
const RELATION_KEYS = {
    "Orang Tua": "parent",
    Ayah: "father",
    Ibu: "mother",
    Wali: "guardian",
};

function relationLabel(t, value) {
    const key = RELATION_KEYS[value];
    return key ? t(`parentChildren.relations.${key}`) : value;
}

const DELTA_KEYS = {
    Meningkat: "up",
    Stabil: "stable",
    Menurun: "down",
    "Asesmen Awal": "initial",
};

/* ---------- Ikon ---------- */
function Svg({ size = 14, sw = 2.2, children }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
            {children}
        </svg>
    );
}

const FolderIcon = ({ size = 20 }) => (
    <Svg size={size} sw={1.8}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </Svg>
);

const SchoolIcon = () => (
    <Svg size={15} sw={2}>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
        <path d="M10 21v-4h4v4" />
    </Svg>
);

const ClockIcon = () => (
    <Svg size={15} sw={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </Svg>
);

const ChartIcon = () => (
    <Svg size={14} sw={2.4}>
        <path d="M3 3v18h18" />
        <path d="M7 15v3M12 10v8M17 6v12" />
    </Svg>
);

const ArrowRightIcon = () => (
    <Svg size={14} sw={2.6}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </Svg>
);

const PlusIcon = () => (
    <Svg size={16} sw={2.5}>
        <path d="M12 5v14M5 12h14" />
    </Svg>
);

const XIcon = ({ size = 16 }) => (
    <Svg size={size} sw={2.4}>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </Svg>
);

const UsersIcon = ({ size = 28 }) => (
    <Svg size={size} sw={1.8}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
);

function DeltaIcon({ type }) {
    if (type === "up") return <Svg size={10} sw={3}><path d="m3 17 6-6 4 4 8-8" /><path d="M14 7h7v7" /></Svg>;
    if (type === "down") return <Svg size={10} sw={3}><path d="m3 7 6 6 4-4 8 8" /><path d="M14 17h7v-7" /></Svg>;
    if (type === "initial") return <Svg size={10} sw={3}><path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z" /></Svg>;
    return <Svg size={10} sw={3}><path d="M5 12h14" /></Svg>;
}

/* ---------- Badge ---------- */
function renderKategoriBadge(lastAssessment, t) {
    if (!lastAssessment || !lastAssessment.kategori) {
        return <span className="gc-kat-badge gc-kat-empty">{t("parentChildren.noAssessment")}</span>;
    }
    const kat = lastAssessment.kategori.toUpperCase();
    const label = t(`common.kategori.${kat}`, { defaultValue: lastAssessment.kategori_label || "" });
    const clsMap = {
        BB: "gc-kat-bb",
        MB: "gc-kat-mb",
        BSH: "gc-kat-bsh",
        BSB: "gc-kat-bsb",
    };
    const badgeClass = clsMap[kat] || "gc-kat-mb";
    const deltaKey = DELTA_KEYS[lastAssessment.delta_status];
    const deltaText = deltaKey ? t(`common.delta.${deltaKey}`) : lastAssessment.delta_status;
    return (
        <div className="gc-child-status">
            <span className={`gc-kat-badge ${badgeClass}`} title={label}>
                {kat}{label ? ` - ${label}` : ""}
            </span>
            {lastAssessment.delta_status && (
                <span className={`gc-delta gc-delta-${deltaKey || "stable"}`}>
                    <span className="gc-delta-ico"><DeltaIcon type={deltaKey} /></span>
                    {deltaText}
                </span>
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
        <span className={`gc-rem-badge ${badgeClass}`}>
            {reminderText(reminder, t)}
        </span>
    );
}

export default function ParentChildrenPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();

    const [user] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [childrenList, setChildrenList] = useState([]);
    const [loading, setLoading] = useState(true);

    // State Modal Klaim Kode Anak
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [invitationCode, setInvitationCode] = useState("");
    const [relationshipLabel, setRelationshipLabel] = useState("Orang Tua");
    const [claiming, setClaiming] = useState(false);

    // State Modal Lepas Tautan Anak
    const [childToUnlink, setChildToUnlink] = useState(null);
    const [unlinking, setUnlinking] = useState(false);

    const reloadChildren = useCallback(async () => {
        try {
            const res = await authFetch("/parent/children");
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setChildrenList(Array.isArray(data) ? data : []);
            } else {
                toast.error(extractErrorMessage(data, t("parentChildren.errLoad", { status: res.status })));
            }
        } catch (error) {
            console.error("Error fetching parent children:", error);
            toast.error(t("parentChildren.errConnect"));
        } finally {
            setLoading(false);
        }
    }, [toast, t]);

    useEffect(() => {
        if (!user) {
            toast.error(t("parentChildren.loginRequired"));
            navigate("/login");
            return;
        }
        let active = true;
        const initLoad = async () => {
            try {
                const res = await authFetch("/parent/children");
                const data = await res.json().catch(() => ({}));
                if (!active) return;
                if (res.ok) {
                    setChildrenList(Array.isArray(data) ? data : []);
                } else {
                    toast.error(extractErrorMessage(data, t("parentChildren.errLoad", { status: res.status })));
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching parent children:", error);
                    toast.error(t("parentChildren.errConnect"));
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

    const handleOpenClaimModal = () => {
        setInvitationCode("");
        setRelationshipLabel("Orang Tua");
        setIsClaimModalOpen(true);
    };

    const handleClaimChild = async (e) => {
        e.preventDefault();
        const cleanCode = invitationCode.trim().toUpperCase();
        if (!cleanCode) {
            toast.error(t("parentChildren.errCodeEmpty"));
            return;
        }

        setClaiming(true);
        try {
            const res = await authFetch("/parent/children/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invitation_code: cleanCode,
                    relationship_label: relationshipLabel,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success(t("parentChildren.claimSuccess", { name: data.student?.name || "" }));
                setIsClaimModalOpen(false);
                setInvitationCode("");
                reloadChildren();
            } else {
                toast.error(extractErrorMessage(data, t("parentChildren.claimFailed")));
            }
        } catch (error) {
            console.error("Error claiming child:", error);
            toast.error(t("parentChildren.errServer"));
        } finally {
            setClaiming(false);
        }
    };

    const handleConfirmUnlink = async () => {
        if (!childToUnlink) return;
        setUnlinking(true);
        try {
            const res = await authFetch(`/parent/children/${childToUnlink.student.id}`, {
                method: "DELETE",
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                toast.success(data.message || t("parentChildren.unlinkSuccess"));
                setChildToUnlink(null);
                reloadChildren();
            } else {
                toast.error(extractErrorMessage(data, t("parentChildren.unlinkFailed")));
            }
        } catch (error) {
            console.error("Error unlinking child:", error);
            toast.error(t("parentChildren.errServer"));
        } finally {
            setUnlinking(false);
        }
    };

    const dueChildren = childrenList.filter(
        (item) =>
            item.student?.reminder?.status === "jatuh_tempo" ||
            item.student?.reminder?.status === "segera"
    );

    return (
        <main className="student-page">
            <SpaceHero
                title={t("parentChildren.heroTitle")}
                subtitle={t("parentChildren.heroDesc")}
            />

            <section className="student-cardz">
                <section className="student-container">
                    {/* Header Kartu Putih */}
                    <div className="gc-folder-header">
                        <div>
                            <h2 className="gc-folder-title">
                                {t("parentChildren.listTitle", { n: childrenList.length })}
                            </h2>
                            <p className="gc-folder-subtitle">{t("parentChildren.listSubtitle")}</p>
                        </div>
                    </div>

                    {/* Banner Pengingat */}
                    {!loading && dueChildren.length > 0 && (
                        <div className="gc-reminder-banner">
                            <div className="gc-reminder-banner-icon">🔔</div>
                            <div className="gc-reminder-banner-content">
                                <strong>{t("parentChildren.bannerTitle")}</strong>{" "}
                                {t("parentChildren.bannerText", {
                                    names: dueChildren.map((c) => c.student?.name).join(", "),
                                })}
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="gc-state-box">
                            <span className="history-spinner" />
                            <p>{t("parentChildren.loading")}</p>
                        </div>
                    ) : childrenList.length === 0 ? (
                        <div className="gc-state-box">
                            <div className="gc-empty-icon">
                                <UsersIcon />
                            </div>
                            <h3>{t("parentChildren.emptyTitle")}</h3>
                            <p>
                                <Trans
                                    i18nKey="parentChildren.emptyDesc"
                                    components={{ strong: <strong />, code: <code /> }}
                                />
                            </p>
                            <button
                                type="button"
                                onClick={handleOpenClaimModal}
                                className="gc-navy-btn"
                                style={{ marginTop: 12 }}
                            >
                                <PlusIcon />
                                <span>{t("parentChildren.addCode")}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="gc-class-grid">
                            {childrenList.map((item, idx) => {
                                const st = item.student || {};
                                const bannerBg = BANNER_GRADIENTS[idx % BANNER_GRADIENTS.length];
                                return (
                                    <div
                                        key={item.link_id || st.id}
                                        className="gc-class-card"
                                        onClick={() => navigate(`/my-children/${st.id}`)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                navigate(`/my-children/${st.id}`);
                                            }
                                        }}
                                    >
                                        <div className="gc-class-banner" style={{ background: bannerBg }}>
                                            <div className="gc-class-banner-top">
                                                <span className="gc-class-folder">
                                                    <FolderIcon size={20} />
                                                </span>
                                                <span className="gc-class-go" aria-hidden="true">
                                                    <ArrowRightIcon />
                                                </span>
                                            </div>
                                            <div className="gc-class-banner-text">
                                                <h3 className="gc-class-name" title={st.name}>
                                                    {st.absence_number ? `${st.absence_number}. ` : ""}{st.name}
                                                </h3>
                                                <div className="gc-child-meta-row">
                                                    <span className="gc-class-year">
                                                        {item.class_name} ({item.academic_year})
                                                    </span>
                                                    <span className="gc-class-year">
                                                        {relationLabel(t, item.relationship_label || "Orang Tua")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="gc-class-body">
                                            <ul className="gc-child-info">
                                                <li>
                                                    <span className="gc-child-info-ico"><SchoolIcon /></span>
                                                    <span>
                                                        {t("parentChildren.school")}: <strong>{item.school_name || "-"}</strong>
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="gc-child-info-ico"><ClockIcon /></span>
                                                    <span>
                                                        {t("parentChildren.currentAge")}: <strong>{t("parentChildren.months", { n: st.age_months })}</strong>{" "}
                                                        ({st.gender === "P" ? t("common.female") : t("common.male")})
                                                    </span>
                                                </li>
                                            </ul>

                                            <div className="gc-child-sections">
                                                <div className="gc-child-section">
                                                    <span className="gc-child-section-label">{t("parentChildren.lastResult")}</span>
                                                    {renderKategoriBadge(st.last_assessment, t)}
                                                </div>
                                                <div className="gc-child-section">
                                                    <span className="gc-child-section-label">{t("parentChildren.nextSchedule")}</span>
                                                    <div className="gc-child-status">
                                                        {renderReminderBadge(st.reminder, t)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="gc-class-footer">
                                                <div className="gc-class-badges">
                                                    <span className="gc-student-count-badge">
                                                        <ChartIcon />
                                                        {t("parentChildren.periods", { n: st.total_assessments || 0 })}
                                                    </span>
                                                </div>

                                                <div className="gc-card-actions" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        className="gc-icon-btn gc-icon-btn-edit"
                                                        onClick={() => navigate(`/my-children/${st.id}`)}
                                                        title={t("parentChildren.viewReport")}
                                                        aria-label={t("parentChildren.viewReport")}
                                                    >
                                                        <ChartIcon />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="gc-icon-btn gc-icon-btn-delete"
                                                        onClick={() => setChildToUnlink(item)}
                                                        title={t("parentChildren.unlinkTitle")}
                                                        aria-label={t("parentChildren.unlinkAria", { name: st.name })}
                                                    >
                                                        <XIcon size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Kartu tambah kode anak */}
                            <button type="button" className="gc-class-add" onClick={handleOpenClaimModal}>
                                <span className="gc-class-add-icon">
                                    <PlusIcon />
                                </span>
                                <span>{t("parentChildren.addCode")}</span>
                            </button>
                        </div>
                    )}
                </section>
            </section>

            {/* MODAL MASUKKAN KODE ANAK */}
            {isClaimModalOpen && (
                <div className="gc-modal-overlay" onClick={() => !claiming && setIsClaimModalOpen(false)}>
                    <div className="gc-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="gc-modal-header">
                            <h3>{t("parentChildren.claimTitle")}</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={() => !claiming && setIsClaimModalOpen(false)}
                                aria-label={t("common.close")}
                            >
                                <XIcon />
                            </button>
                        </div>

                        <form onSubmit={handleClaimChild} className="gc-modal-form">
                            <div className="student-field">
                                <label htmlFor="claim-code-input">{t("parentChildren.codeLabel")}</label>
                                <input
                                    id="claim-code-input"
                                    type="text"
                                    placeholder={t("parentChildren.codePlaceholder")}
                                    value={invitationCode}
                                    onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                                    required
                                    className="student-input"
                                    style={{ fontFamily: "monospace", fontWeight: "700", letterSpacing: "1px" }}
                                />
                                <small style={{ color: "#64748b", fontSize: "0.78rem" }}>
                                    {t("parentChildren.codeHelp")}
                                </small>
                            </div>

                            <div className="student-field">
                                <label htmlFor="claim-rel-select">{t("parentChildren.relationLabel")}</label>
                                <select
                                    id="claim-rel-select"
                                    value={relationshipLabel}
                                    onChange={(e) => setRelationshipLabel(e.target.value)}
                                    className="student-input"
                                >
                                    {Object.keys(RELATION_KEYS).map((value) => (
                                        <option key={value} value={value}>
                                            {relationLabel(t, value)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsClaimModalOpen(false)}
                                    className="gc-secondary-btn"
                                    disabled={claiming}
                                >
                                    {t("common.cancel")}
                                </button>
                                <button
                                    type="submit"
                                    className="gc-navy-btn"
                                    disabled={claiming}
                                >
                                    {claiming ? t("parentChildren.claiming") : t("parentChildren.claimBtn")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL KONFIRMASI LEPAS TAUTAN ANAK */}
            {childToUnlink && (
                <div className="gc-modal-overlay" onClick={() => !unlinking && setChildToUnlink(null)}>
                    <div className="gc-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="gc-modal-header">
                            <h3>{t("parentChildren.unlinkModalTitle")}</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={() => !unlinking && setChildToUnlink(null)}
                                aria-label={t("common.close")}
                            >
                                <XIcon />
                            </button>
                        </div>

                        <div className="gc-modal-body">
                            <p style={{ margin: 0, color: "#1e293b", fontSize: "0.94rem", lineHeight: "1.5" }}>
                                <Trans
                                    i18nKey="parentChildren.unlinkConfirm"
                                    values={{ name: childToUnlink.student?.name }}
                                    components={{ strong: <strong /> }}
                                />
                            </p>
                            <small style={{ color: "#64748b", fontSize: "0.8rem" }}>
                                {t("parentChildren.unlinkNote")}
                            </small>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setChildToUnlink(null)}
                                    className="gc-secondary-btn"
                                    disabled={unlinking}
                                >
                                    {t("common.cancel")}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmUnlink}
                                    className="gc-danger-btn"
                                    disabled={unlinking}
                                >
                                    {unlinking ? t("parentChildren.unlinking") : t("parentChildren.unlinkBtn")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}