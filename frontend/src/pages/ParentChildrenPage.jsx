import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { authFetch, extractErrorMessage } from "../config/api";

const BANNER_GRADIENTS = [
    "linear-gradient(135deg, #1c3446 0%, #2f6f6b 100%)",
    "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)",
    "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)",
    "linear-gradient(135deg, #134e4a 0%, #0d9488 100%)",
    "linear-gradient(135deg, #3b0764 0%, #7e22ce 100%)",
];

function renderKategoriBadge(lastAssessment) {
    if (!lastAssessment || !lastAssessment.kategori) {
        return <span className="gc-kat-badge gc-kat-empty">Belum ada asesmen</span>;
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
            <span className={`gc-kat-badge ${badgeClass}`} title={label}>
                {kat}{label ? ` - ${label}` : ""}
            </span>
            {lastAssessment.delta_status && (
                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#334155" }}>
                    {deltaIcon} {lastAssessment.delta_status}
                </span>
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
        <span className={`gc-rem-badge ${badgeClass}`}>
            {reminder.label}
        </span>
    );
}

export default function ParentChildrenPage() {
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
                toast.error(extractErrorMessage(data, `Gagal memuat daftar anak (HTTP ${res.status}).`));
            }
        } catch (error) {
            console.error("Error fetching parent children:", error);
            toast.error("Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (!user) {
            toast.error("Silakan masuk terlebih dahulu untuk mengakses halaman Anak Saya.");
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
                    toast.error(extractErrorMessage(data, `Gagal memuat daftar anak (HTTP ${res.status}).`));
                }
            } catch (error) {
                if (active) {
                    console.error("Error fetching parent children:", error);
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

    const handleOpenClaimModal = () => {
        setInvitationCode("");
        setRelationshipLabel("Orang Tua");
        setIsClaimModalOpen(true);
    };

    const handleClaimChild = async (e) => {
        e.preventDefault();
        const cleanCode = invitationCode.trim().toUpperCase();
        if (!cleanCode) {
            toast.error("Silakan masukkan Kode Anak dari guru terlebih dahulu.");
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
                toast.success(`Data anak "${data.student?.name || ""}" berhasil dihubungkan ke akun Anda!`);
                setIsClaimModalOpen(false);
                setInvitationCode("");
                reloadChildren();
            } else {
                toast.error(extractErrorMessage(data, "Gagal menghubungkan Kode Anak."));
            }
        } catch (error) {
            console.error("Error claiming child:", error);
            toast.error("Gagal menghubungi server.");
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
                toast.success(data.message || "Tautan data anak berhasil dilepas.");
                setChildToUnlink(null);
                reloadChildren();
            } else {
                toast.error(extractErrorMessage(data, "Gagal melepas tautan anak."));
            }
        } catch (error) {
            console.error("Error unlinking child:", error);
            toast.error("Gagal menghubungi server.");
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
                    <h1>Anak Saya</h1>
                    <p>
                        Pantau hasil asesmen, grafik perkembangan motorik halus bulanan, dan jadwal evaluasi anak Anda secara langsung.
                    </p>
                </div>
            </section>

            <section className="student-cardz">
                <section className="student-container">
                    {/* Header Kartu Putih */}
                    <div className="gc-folder-header">
                        <div>
                            <h2 className="gc-folder-title">Daftar Anak yang Dipantau ({childrenList.length} Anak)</h2>
                            <p className="gc-folder-subtitle">
                                Satu akun orang tua dapat menghubungkan dan memantau 2 anak atau lebih menggunakan Kode Anak dari guru.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenClaimModal}
                            className="gc-navy-btn"
                        >
                            <span>+ Masukkan Kode Anak</span>
                        </button>
                    </div>

                    {/* Banner Pengingat Jadwal Asesmen Berikutnya untuk Orang Tua */}
                    {!loading && dueChildren.length > 0 && (
                        <div className="gc-reminder-banner">
                            <div className="gc-reminder-banner-icon">🔔</div>
                            <div className="gc-reminder-banner-content">
                                <strong>Pengingat Jadwal Asesmen Berkala:</strong>{" "}
                                {dueChildren.map((c) => c.student?.name).join(", ")} sudah memasuki atau mendekati jadwal evaluasi motorik halus bulanan berikutnya di sekolah.
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="gc-state-box">
                            <span className="history-spinner" />
                            <p>Memuat daftar anak...</p>
                        </div>
                    ) : childrenList.length === 0 ? (
                        <div className="gc-state-box">
                            <div className="gc-empty-icon" style={{ fontSize: "28px" }}>
                                👨‍👩‍👧‍👦
                            </div>
                            <h3>Belum ada data anak yang terhubung</h3>
                            <p>
                                Mintalah <strong>Kode Unik Anak</strong> (contoh: <code>GRH-XXXXXX</code>) kepada guru kelas anak Anda, lalu klik tombol <strong>+ Masukkan Kode Anak</strong> di kanan atas. Anda dapat menambahkan lebih dari satu anak.
                            </p>
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
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                                                <h3 className="gc-class-name">
                                                    No. {st.absence_number} — {st.name}
                                                </h3>
                                                <span className="gc-class-year">
                                                    {item.relationship_label || "Orang Tua"}
                                                </span>
                                            </div>
                                            <span className="gc-class-year" style={{ marginTop: "4px" }}>
                                                {item.class_name} ({item.academic_year})
                                            </span>
                                        </div>

                                        <div className="gc-class-body">
                                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "#475569" }}>
                                                <div>
                                                    Sekolah: <strong style={{ color: "#1e293b" }}>{item.school_name || "-"}</strong>
                                                </div>
                                                <div>
                                                    Usia Saat Ini: <strong style={{ color: "#1e293b" }}>{st.age_months} Bulan</strong> ({st.gender === "P" ? "Perempuan" : "Laki-laki"})
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "3px", fontWeight: "600" }}>
                                                        Capaian Asesmen Terakhir:
                                                    </div>
                                                    {renderKategoriBadge(st.last_assessment)}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "3px", fontWeight: "600" }}>
                                                        Jadwal Asesmen Berikutnya:
                                                    </div>
                                                    {renderReminderBadge(st.reminder)}
                                                </div>
                                            </div>

                                            <div className="gc-class-footer">
                                                <span className="gc-student-count-badge">
                                                    📊 {st.total_assessments || 0} Periode Asesmen
                                                </span>

                                                <div className="gc-card-actions" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        className="gc-assess-btn"
                                                        onClick={() => navigate(`/my-children/${st.id}`)}
                                                    >
                                                        Lihat Rapor
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="gc-icon-btn gc-icon-btn-delete"
                                                        onClick={() => setChildToUnlink(item)}
                                                        title="Lepas Tautan Anak"
                                                        aria-label={`Lepas ${st.name}`}
                                                    >
                                                        ✕
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

            {/* MODAL MASUKKAN KODE ANAK */}
            {isClaimModalOpen && (
                <div className="gc-modal-overlay" onClick={() => !claiming && setIsClaimModalOpen(false)}>
                    <div className="gc-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="gc-modal-header">
                            <h3>Hubungkan Data Anak</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={() => !claiming && setIsClaimModalOpen(false)}
                                aria-label="Tutup"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleClaimChild} className="gc-modal-form">
                            <div className="student-field">
                                <label htmlFor="claim-code-input">Kode Unik Anak (Dari Guru)</label>
                                <input
                                    id="claim-code-input"
                                    type="text"
                                    placeholder="Contoh: GRH-4829KT"
                                    value={invitationCode}
                                    onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                                    required
                                    className="student-input"
                                    style={{ fontFamily: "monospace", fontWeight: "700", letterSpacing: "1px" }}
                                />
                                <small style={{ color: "#64748b", fontSize: "0.78rem" }}>
                                    Jika Anda memiliki 2 anak atau lebih, masukkan kode anak pertama terlebih dahulu lalu ulangi untuk anak berikutnya.
                                </small>
                            </div>

                            <div className="student-field">
                                <label htmlFor="claim-rel-select">Hubungan dengan Anak</label>
                                <select
                                    id="claim-rel-select"
                                    value={relationshipLabel}
                                    onChange={(e) => setRelationshipLabel(e.target.value)}
                                    className="student-input"
                                >
                                    <option value="Orang Tua">Orang Tua</option>
                                    <option value="Ayah">Ayah</option>
                                    <option value="Ibu">Ibu</option>
                                    <option value="Wali">Wali</option>
                                </select>
                            </div>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsClaimModalOpen(false)}
                                    className="gc-secondary-btn"
                                    disabled={claiming}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="gc-navy-btn"
                                    disabled={claiming}
                                >
                                    {claiming ? "Menghubungkan..." : "Hubungkan Anak"}
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
                            <h3>Lepas Tautan Data Anak</h3>
                            <button
                                type="button"
                                className="gc-modal-close"
                                onClick={() => !unlinking && setChildToUnlink(null)}
                                aria-label="Tutup"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="gc-modal-body">
                            <p style={{ margin: 0, color: "#1e293b", fontSize: "0.94rem", lineHeight: "1.5" }}>
                                Apakah Anda yakin ingin melepas pantauan data anak <strong>{childToUnlink.student?.name}</strong> dari akun Anda?
                            </p>
                            <small style={{ color: "#64748b", fontSize: "0.8rem" }}>
                                Catatan: Data asesmen anak di sekolah tidak akan terhapus dan Anda tetap dapat menghubungkannya kembali kapan saja dengan Kode Anak yang sama.
                            </small>

                            <div className="gc-modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setChildToUnlink(null)}
                                    className="gc-secondary-btn"
                                    disabled={unlinking}
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmUnlink}
                                    className="gc-danger-btn"
                                    disabled={unlinking}
                                >
                                    {unlinking ? "Melepas..." : "Ya, Lepas Tautan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
