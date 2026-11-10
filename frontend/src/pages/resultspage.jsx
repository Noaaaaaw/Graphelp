import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../components/Toast";
import "../style/results.css";

const STAR_COUNT = 60;

function CheckIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function SunIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
    );
}

function SpaceshipIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 6 C24 16, 20 30, 20 44 L44 44 C44 30, 40 16, 32 6 Z" fill="url(#res-hull)" />
            <path d="M32 6 C28 14, 26 24, 26 34 L38 34 C38 24, 36 14, 32 6 Z" fill="#ffffff" opacity="0.3" />
            <circle cx="32" cy="24" r="5" fill="#1b2a47" stroke="#7aa7ff" strokeWidth="1.5" />
            <path d="M20 36 L10 46 L20 44 Z" fill="#ff7a59" />
            <path d="M44 36 L54 46 L44 44 Z" fill="#ff7a59" />
            <path d="M26 44 L32 54 L38 44 Z" fill="#ffd15c" />
            <defs>
                <linearGradient id="res-hull" x1="20" y1="6" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f4f7fc" />
                    <stop offset="1" stopColor="#cdd7e5" />
                </linearGradient>
            </defs>
        </svg>
    );
}

function AstronautIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="38" rx="14" ry="16" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
            <circle cx="32" cy="20" r="14" fill="#ffffff" stroke="#334155" strokeWidth="2" />
            <rect x="22" y="14" width="20" height="12" rx="6" fill="#0f172a" />
            <path d="M25 17 Q 32 15, 39 17" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    );
}

function ShareIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
        </svg>
    );
}

const RING_R = 46;
const RING_C = 2 * Math.PI * RING_R;

export default function ResultsPage() {
    const { t } = useTranslation();
    const { state } = useLocation();
    const result = state?.result;
    const image = state?.image;
    const [copied, setCopied] = useState(false);
    const [ready, setReady] = useState(false);

    let toast = null;
    try { toast = useToast(); } catch { toast = null; }

    useEffect(() => {
        const timer = setTimeout(() => setReady(true), 150);
        return () => clearTimeout(timer);
    }, []);

    if (!result) {
        return (
            <main className="result-page">
                <div className="result-body result-body-empty">
                    <section className="result-card result-empty">
                        <h1>Belum Ada Hasil Analisis</h1>
                        <p>Silakan unggah lembar kerja tulisan tangan terlebih dahulu untuk melihat hasil asesmen di sini.</p>
                        <Link to="/analyze" className="result-btn result-btn-primary">Mulai Analisis</Link>
                    </section>
                </div>
            </main>
        );
    }

    const menulis = result.kesimpulan_menulis || {
        sesuai: "Ya" in (result.kesimpulan || ""),
        jawaban: "Ya" in (result.kesimpulan || "") ? "Ya" : "Tidak",
        confidence: Number(result.confidence) || 85.0,
        alasan: result.alasan_klinis || "Goresan alat tulis stabil sesuai usianya."
    };

    const menggambar = result.kesimpulan_menggambar || {
        sesuai: "Ya" in (result.kesimpulan || ""),
        jawaban: "Ya" in (result.kesimpulan || "") ? "Ya" : "Tidak",
        confidence: Number(result.confidence) || 85.0,
        alasan: result.alasan_klinis || "Koordinasi pola gambar baik sesuai usianya."
    };

    const confW = Math.max(0, Math.min(100, Number(menulis.confidence) || 0));
    const confD = Math.max(0, Math.min(100, Number(menggambar.confidence) || 0));

    async function handleShare() {
        const text = `Hasil Asesmen Motorik Halus Graphelp:\n- Menulis: ${menulis.jawaban === "Ya" ? "Sesuai Usia" : "Belum Sesuai"}\n- Menggambar: ${menggambar.jawaban === "Ya" ? "Sesuai Usia" : "Belum Sesuai"}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: "Hasil Asesmen Motorik Halus", text });
            } else {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                toast?.success?.("Ringkasan berhasil disalin ke clipboard!");
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            /* cancelled */
        }
    }

    return (
        <main className="result-page">
            <section className="result-hero">
                {Array.from({ length: STAR_COUNT }, (_, i) => (
                    <span key={i} className={`az-star az-star-${i + 1}`}></span>
                ))}
                <span className="az-planet az-planet-4"></span>
                <span className="az-planet az-planet-5"></span>
                <span className="az-planet az-planet-6"></span>
                <span className="az-astronaut"><AstronautIcon /></span>
                <span className="az-spaceship"><SpaceshipIcon /></span>
                <span className="az-planet az-planet-1"></span>
                <span className="az-planet az-planet-2"></span>
                <span className="az-planet az-planet-3"></span>
                <span className="az-meteor az-meteor-1"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-2"><span className="az-meteor-line"></span></span>
                <span className="az-meteor az-meteor-3"><span className="az-meteor-line"></span></span>
                <span className="hero-ring-a"></span>
                <span className="hero-ring-b"></span>
                <h1>Hasil Asesmen Selesai</h1>
                <p>
                    Berikut hasil analisis kemampuan motorik halus anak berdasarkan instrumen resmi kuisioner PAUD (Bagian III).
                </p>
                <div className="hero-flow">
                    <span className="hero-flow-icon hero-flow-icon-done">
                        <CheckIcon />
                    </span>
                    <span className="hero-flow-line hero-flow-line-done" />
                    <span className="hero-flow-icon hero-flow-icon-sun">
                        <SunIcon />
                    </span>
                </div>
            </section>

            <div className="result-body">
                <section className="result-card">
                    <h1 className="result-title">Hasil Asesmen Kematangan Motorik Halus</h1>

                    {/* Foto Sampel Lembar Kerja */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px", alignItems: "center", background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        {image ? (
                            <img
                                src={image}
                                alt="Lembar kerja anak"
                                style={{ width: "110px", height: "110px", objectFit: "cover", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#ffffff" }}
                            />
                        ) : (
                            <div style={{ width: "110px", height: "110px", background: "#e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: "0.8rem" }}>
                                Lembar Kerja
                            </div>
                        )}
                        <div style={{ flex: 1, minWidth: "220px" }}>
                            <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Status Asesmen Keseluruhan
                            </div>
                            <h2 style={{ margin: "4px 0 6px 0", fontSize: "1.25rem", color: "#0f172a" }}>
                                {result.status || result.kesimpulan || "Sesuai Usia"}
                            </h2>
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569" }}>
                                Model Machine Learning menganalisis tarikan garis, getaran kontur, dan kontinuitas goresan anak.
                            </p>
                        </div>
                    </div>

                    {/* 2 KARTU UTAMA ASESMEN (MENULIS & MENGGAMBAR) */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                        {/* KARTU 1: MENULIS */}
                        <div style={{
                            padding: "18px",
                            borderRadius: "10px",
                            border: `1.5px solid ${menulis.sesuai ? "#86efac" : "#fca5a5"}`,
                            background: menulis.sesuai ? "#f0fdf4" : "#fef2f2",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                    <div>
                                        <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: menulis.sesuai ? "#15803d" : "#b91c1c", letterSpacing: "0.5px" }}>
                                            Output 1 · Bagian III
                                        </span>
                                        <h3 style={{ margin: "2px 0 0 0", fontSize: "1.1rem", color: "#0f172a" }}>
                                            Kemampuan Menulis
                                        </h3>
                                    </div>
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "20px",
                                        fontSize: "0.8rem",
                                        fontWeight: "700",
                                        background: menulis.sesuai ? "#dcfce7" : "#fee2e2",
                                        color: menulis.sesuai ? "#15803d" : "#b91c1c",
                                        border: `1px solid ${menulis.sesuai ? "#86efac" : "#fca5a5"}`
                                    }}>
                                        {menulis.sesuai ? "✓ Sesuai Usia [Ya]" : "✗ Belum Sesuai [Tidak]"}
                                    </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "14px 0" }}>
                                    <div style={{ width: "64px", height: "64px", position: "relative", flexShrink: 0 }}>
                                        <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                                            <circle cx="50" cy="50" r={RING_R} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                            <circle
                                                cx="50" cy="50" r={RING_R} fill="none"
                                                stroke={menulis.sesuai ? "#22c55e" : "#ef4444"}
                                                strokeWidth="8"
                                                strokeDasharray={RING_C}
                                                strokeDashoffset={ready ? RING_C * (1 - confW / 100) : RING_C}
                                                strokeLinecap="round"
                                                style={{ transition: "stroke-dashoffset 1s ease" }}
                                            />
                                        </svg>
                                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "800", color: "#0f172a" }}>
                                            {confW}%
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "0.82rem", color: "#475569" }}>
                                        <strong>Tingkat Keyakinan AI</strong>
                                        <div>Probabilitas model klasifikasi menulis</div>
                                    </div>
                                </div>

                                <div style={{ fontSize: "0.84rem", color: "#334155", background: "#ffffff", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                    <strong>Alasan Klinis:</strong> "{menulis.alasan}"
                                </div>
                            </div>
                        </div>

                        {/* KARTU 2: MENGGAMBAR */}
                        <div style={{
                            padding: "18px",
                            borderRadius: "10px",
                            border: `1.5px solid ${menggambar.sesuai ? "#86efac" : "#fca5a5"}`,
                            background: menggambar.sesuai ? "#f0fdf4" : "#fef2f2",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                    <div>
                                        <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: menggambar.sesuai ? "#15803d" : "#b91c1c", letterSpacing: "0.5px" }}>
                                            Output 2 · Bagian III
                                        </span>
                                        <h3 style={{ margin: "2px 0 0 0", fontSize: "1.1rem", color: "#0f172a" }}>
                                            Kemampuan Menggambar
                                        </h3>
                                    </div>
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "20px",
                                        fontSize: "0.8rem",
                                        fontWeight: "700",
                                        background: menggambar.sesuai ? "#dcfce7" : "#fee2e2",
                                        color: menggambar.sesuai ? "#15803d" : "#b91c1c",
                                        border: `1px solid ${menggambar.sesuai ? "#86efac" : "#fca5a5"}`
                                    }}>
                                        {menggambar.sesuai ? "✓ Sesuai Usia [Ya]" : "✗ Belum Sesuai [Tidak]"}
                                    </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "14px 0" }}>
                                    <div style={{ width: "64px", height: "64px", position: "relative", flexShrink: 0 }}>
                                        <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                                            <circle cx="50" cy="50" r={RING_R} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                            <circle
                                                cx="50" cy="50" r={RING_R} fill="none"
                                                stroke={menggambar.sesuai ? "#22c55e" : "#ef4444"}
                                                strokeWidth="8"
                                                strokeDasharray={RING_C}
                                                strokeDashoffset={ready ? RING_C * (1 - confD / 100) : RING_C}
                                                strokeLinecap="round"
                                                style={{ transition: "stroke-dashoffset 1s ease" }}
                                            />
                                        </svg>
                                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "800", color: "#0f172a" }}>
                                            {confD}%
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "0.82rem", color: "#475569" }}>
                                        <strong>Tingkat Keyakinan AI</strong>
                                        <div>Probabilitas model klasifikasi menggambar</div>
                                    </div>
                                </div>

                                <div style={{ fontSize: "0.84rem", color: "#334155", background: "#ffffff", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                    <strong>Alasan Klinis:</strong> "{menggambar.alasan}"
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* REKOMENDASI STIMULASI GURU & ORANG TUA */}
                    {result.saran_guru && (
                        <div style={{ padding: "14px 16px", background: "#eff6ff", borderRadius: "8px", borderLeft: "4px solid #0284c7", marginBottom: "24px" }}>
                            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0369a1", marginBottom: "4px" }}>
                                💡 Rekomendasi Stimulasi Guru & Orang Tua
                            </div>
                            <p style={{ margin: 0, fontSize: "0.86rem", color: "#1e3a8a", lineHeight: "1.5" }}>
                                {result.saran_guru}
                            </p>
                        </div>
                    )}

                    {/* AKSI CETAK & SHARE */}
                    <div className="result-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                        <button type="button" className="result-btn result-btn-primary" onClick={() => window.print()}>
                            <FileIcon /> Cetak / Simpan PDF
                        </button>
                        <button type="button" className="result-btn result-btn-ghost" onClick={handleShare}>
                            <ShareIcon /> {copied ? "Tersalin!" : "Bagikan Ringkasan"}
                        </button>
                        <Link to="/analyze" className="result-btn result-btn-soft">
                            Analisis Gambar Lain
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
