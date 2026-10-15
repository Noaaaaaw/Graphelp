import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/results.css";

function CheckIcon({ size = 26 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function SunIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
        </svg>
    );
}

function AstronautIcon() {
    return (
        <svg width="56" height="72" viewBox="0 0 56 72" fill="none">
            <rect x="6" y="26" width="10" height="24" rx="4" fill="#c7cdd6" stroke="#9aa3af" strokeWidth="1" />
            <rect x="40" y="26" width="10" height="24" rx="4" fill="#c7cdd6" stroke="#9aa3af" strokeWidth="1" />
            <path d="M14 30 C6 34 4 44 10 50" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="10" cy="50" r="5.5" fill="#e8734a" />
            <path d="M42 30 C50 34 52 44 46 50" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="46" cy="50" r="5.5" fill="#e8734a" />
            <path d="M22 56 C20 62 20 66 22 70" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M34 56 C36 62 36 66 34 70" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <ellipse cx="22" cy="70" rx="6" ry="4" fill="#2f6f6b" />
            <ellipse cx="34" cy="70" rx="6" ry="4" fill="#2f6f6b" />
            <rect x="12" y="24" width="32" height="34" rx="16" fill="#f4f6f8" stroke="#d7dce2" strokeWidth="1.5" />
            <rect x="20" y="34" width="16" height="12" rx="4" fill="#e8734a" />
            <circle cx="24" cy="40" r="1.6" fill="#fff" />
            <circle cx="32" cy="40" r="1.6" fill="#6fe0bc" />
            <circle cx="28" cy="16" r="15" fill="#f4f6f8" stroke="#d7dce2" strokeWidth="1.5" />
            <circle cx="28" cy="16" r="11" fill="url(#astroGlass)" />
            <ellipse cx="24" cy="11" rx="3.5" ry="2.4" fill="rgba(255,255,255,0.75)" />
            <defs>
                <radialGradient id="astroGlass" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#bfe3f7" />
                    <stop offset="55%" stopColor="#5fa8d3" />
                    <stop offset="100%" stopColor="#2c5f82" />
                </radialGradient>
            </defs>
        </svg>
    );
}

function SpaceshipIcon() {
    return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <defs>
                <linearGradient id="flameGrad" x1="30" y1="46" x2="30" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffdd8a" />
                    <stop offset="60%" stopColor="#f2a05a" />
                    <stop offset="100%" stopColor="#e8734a" />
                </linearGradient>
                <radialGradient id="winGrad" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#bfe3f7" />
                    <stop offset="60%" stopColor="#3d8783" />
                    <stop offset="100%" stopColor="#1e4c48" />
                </radialGradient>
            </defs>
            <path d="M30 46 C26 52 26 58 30 60 C34 58 34 52 30 46Z" fill="url(#flameGrad)" />
            <path d="M30 4 C40 14 42 28 40 42 L20 42 C18 28 20 14 30 4Z" fill="#f4f6f8" stroke="#d7dce2" strokeWidth="1.5" />
            <path d="M30 4 C34 9 36 15 36.5 20 L23.5 20 C24 15 26 9 30 4Z" fill="#e8734a" />
            <circle cx="30" cy="24" r="6" fill="url(#winGrad)" stroke="#fff" strokeWidth="1.5" />
            <path d="M20 42 L10 52 L20 50Z" fill="#2f6f6b" />
            <path d="M40 42 L50 52 L40 50Z" fill="#2f6f6b" />
            <rect x="20" y="38" width="20" height="5" rx="2" fill="#e3e8ec" />
        </svg>
    );
}

const STAR_COUNT = 24;

function FileIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M8 13h8M8 17h8" />
        </svg>
    );
}

const RING_R = 50;
const RING_C = 2 * Math.PI * RING_R;

function ResultsPage() {
    const { state } = useLocation();
    const result = state?.result;
    const image = state?.image;
    const [ready, setReady] = useState(false);

    // animasi ring & bar setelah halaman tampil
    useEffect(() => {
        const t = setTimeout(() => setReady(true), 150);
        return () => clearTimeout(t);
    }, []);

    // Dibuka langsung / di-refresh tanpa data
    if (!result) {
        return (
            <main className="result-page">
                <div className="result-body result-body-empty">
                    <section className="result-card result-empty">
                        <h1>Belum ada hasil analisis</h1>
                        <p>Upload tulisan tangan dulu untuk melihat hasilnya di sini.</p>
                        <Link to="/analyze" className="result-btn result-btn-primary">Mulai Analisis</Link>
                    </section>
                </div>
            </main>
        );
    }

    const confidence = Math.max(0, Math.min(100, Number(result.confidence) || 0));
    const confidenceText = confidence.toFixed(1);
    const isSesuai = result.kesimpulan?.includes("Ya") || result.pred_type === 1;

    const kesimpulanJudul = isSesuai ? "Sesuai Usia [Ya]" : "Belum Sesuai [Tidak]";
    const statusLabel = result.status || (isSesuai ? "Perkembangan Sesuai / Mandiri" : "Perlu Stimulasi Tambahan");
    const interpretation = result.alasan_klinis || result.description || "Hasil evaluasi kematangan motorik halus berdasarkan goresan tulisan tangan anak.";

    // Evaluasi Menulis & Menggambar (Bagian III)
    const evaluasiMenulis = result.kesimpulan_menulis?.alasan || (isSesuai ? "Anak sudah mampu mengontrol goresan alat tulis secara mandiri, stabil, dan tarikan garis kontinu sesuai tahapan usianya." : interpretation);
    const evaluasiMenggambar = result.kesimpulan_menggambar?.alasan || (isSesuai ? "Koordinasi motorik visual dan kemampuan menggambar pola geometri sudah berkembang baik sesuai tahapan usianya." : "Koordinasi kontrol motorik dan reproduksi pola geometri masih dalam tahap pembentukan dan memerlukan latihan terarah.");

    // Indikator Klinis (4 Fitur Fisik)
    const indikator = result.indikator || {};
    const features = [
        {
            icon: "✍️",
            label: "Kontrol Pegangan",
            value: indikator.kontrol_pegangan?.status || (isSesuai ? "Stabil" : "Kurang Stabil (Tremor)"),
            desc: "Kestabilan memegang alat tulis (terdeteksi dari tingkat getaran/tremor goresan).",
            badge: result.indikator_klinis_table?.[0]?.level || (isSesuai ? "BSH" : "MB")
        },
        {
            icon: "📏",
            label: "Konsistensi Tekanan",
            value: indikator.konsistensi_tekanan?.status || (isSesuai ? "Konsisten" : "Belum Merata"),
            desc: "Kekuatan tekanan goresan pensil pada kertas (tidak terlalu tipis/tebal).",
            badge: result.indikator_klinis_table?.[1]?.level || (isSesuai ? "BSH" : "MB")
        },
        {
            icon: "📐",
            label: "Koordinasi Geometri",
            value: indikator.koordinasi_geometri?.status || (isSesuai ? "Terkoordinasi" : "Perlu Latihan"),
            desc: "Kemampuan menyalin atau mereproduksi bentuk/pola geometri visual.",
            badge: result.indikator_klinis_table?.[2]?.level || (isSesuai ? "BSH" : "MB")
        },
        {
            icon: "〰️",
            label: "Kontinuitas Garis",
            value: indikator.kontinuitas_garis?.status || (isSesuai ? "Kontinu" : "Sering Terputus"),
            desc: "Kelancaran menarik garis lurus secara utuh tanpa banyak jeda atau terangkat.",
            badge: result.indikator_klinis_table?.[3]?.level || (isSesuai ? "BSH" : "MB")
        }
    ];

    // Distribusi Probabilitas
    const probSesuai = isSesuai ? confidence : Math.max(0, 100 - confidence);
    const probBelum = isSesuai ? Math.max(0, 100 - confidence) : confidence;
    const probs = [
        { type: "Ya", name: "Sesuai Usia", prob: probSesuai },
        { type: "Tidak", name: "Belum Sesuai", prob: probBelum }
    ];
    const maxProb = Math.max(...probs.map((p) => Number(p.prob) || 0), 1);

    return (
        <main className="result-page">

            {/* Hero: sama seperti halaman Analyze, tapi "malam" sudah jadi "pagi" */}
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
                <h1>Hasil Analisis Selesai</h1>
                <p>
                    Berikut hasil evaluasi kematangan motorik halus anak berdasarkan sampel tulisan tangan yang telah dianalisis oleh AI.
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
                    <h1 className="result-title">Hasil Analisis Lengkap</h1>

                    {/* Gambar + prediksi */}
                    <div className="result-top">
                        <figure className="result-image-card">
                            <figcaption>CITRA TULISAN TANGAN</figcaption>
                            <div className="result-photo">
                                {image ? (
                                    <img src={image} alt="Tulisan tangan yang dianalisis" />
                                ) : (
                                    <div className="result-image-empty">Gambar tidak tersedia</div>
                                )}
                            </div>
                            <p>Foto tulisan yang dianalisis</p>
                        </figure>

                        <div className="result-predict">
                            <span className="result-predict-label">HASIL ASESMEN MOTORIK HALUS</span>

                            <div className="result-type-row">
                                <span 
                                    className="result-type-badge"
                                    style={{
                                        background: isSesuai ? "#22c55e" : "#ef4444",
                                        color: "#ffffff",
                                        fontSize: "1.4rem",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    {isSesuai ? "✓" : "✗"}
                                </span>
                                <div>
                                    <h2>{kesimpulanJudul}</h2>
                                    <p className="result-predict-name">
                                        {statusLabel}
                                    </p>
                                </div>
                            </div>

                            <p className="result-predict-tagline">
                                {isSesuai 
                                    ? "Kontrol motorik visual dan stabilitas goresan tangan anak sudah matang sesuai usianya."
                                    : "Perkembangan motorik halus anak membutuhkan latihan dan stimulasi tambahan secara berkala."}
                            </p>

                            <div className="result-confidence">
                                <div className="result-ring">
                                    <svg viewBox="0 0 120 120">
                                        <circle className="result-ring-track" cx="60" cy="60" r={RING_R} />
                                        <circle
                                            className="result-ring-value"
                                            cx="60" cy="60" r={RING_R}
                                            strokeDasharray={`${ready ? (confidence / 100) * RING_C : 0} ${RING_C}`}
                                        />
                                    </svg>
                                    <span className="result-ring-center">{confidenceText}<small>%</small></span>
                                </div>
                                <div className="result-confidence-text">
                                    <strong>Tingkat Keyakinan AI</strong>
                                    <span>*Probabilitas kematangan model</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interpretasi */}
                    {interpretation && (
                        <div className="result-interpret">
                            <h3>Alasan Klinis & Interpretasi AI</h3>
                            <p>{interpretation}</p>
                        </div>
                    )}

                    {/* Evaluasi Menulis & Menggambar */}
                    <div className="result-sc">
                        <div className="result-sc-card result-sc-good">
                            <span className="result-sc-icon">✓</span>
                            <div>
                                <h4>Evaluasi Menulis</h4>
                                <p>{evaluasiMenulis}</p>
                            </div>
                        </div>
                        <div className={`result-sc-card ${isSesuai ? "result-sc-good" : "result-sc-warn"}`}>
                            <span className="result-sc-icon">{isSesuai ? "✓" : "!"}</span>
                            <div>
                                <h4>Evaluasi Menggambar</h4>
                                <p>{evaluasiMenggambar}</p>
                            </div>
                        </div>
                    </div>

                    {/* Peringkat kemungkinan tipe */}
                    <div className="result-panel">
                        <h3 className="result-panel-title">Distribusi Probabilitas Model</h3>
                        <p className="result-panel-sub">Tingkat keyakinan klasifikasi kematangan motorik halus anak oleh model AI.</p>
                        <div className="result-probs">
                            {probs.map((t, i) => {
                                const prob = Number(t.prob) || 0;
                                return (
                                    <div key={i} className={`result-prob-row ${i === 0 ? "is-top" : ""}`}>
                                        <span className="result-prob-rank">#{i + 1}</span>
                                        <div className="result-prob-main">
                                            <div className="result-prob-head">
                                                <strong>{t.name} [{t.type}]</strong>
                                                <span>{prob.toFixed(1)}%</span>
                                            </div>
                                            <div className="result-prob-bar">
                                                <span style={{ width: ready ? `${(prob / maxProb) * 100}%` : "0%" }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Fitur motorik halus */}
                    {features.length > 0 && (
                        <div className="result-panel">
                            <h3 className="result-panel-title">Analisis 4 Indikator Klinis PAUD</h3>
                            <p className="result-panel-sub">Parameter fisik goresan berdasarkan instrumen asesmen perkembangan anak.</p>
                            <div className="result-features">
                                {features.map((f, i) => (
                                    <div key={i} className="result-feature">
                                        <div className="result-feature-head">
                                            <span className="result-feature-icon">{f.icon || "✍️"}</span>
                                            <span>{f.label}</span>
                                        </div>
                                        <strong>{f.value}</strong>
                                        {f.desc && <p>{f.desc}</p>}
                                        {f.badge && <span className="result-chip result-chip-sm">{f.badge}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Aksi */}
                    <div className="result-actions">
                        <Link to="/analyze" className="result-btn result-btn-primary">
                            🔄 Analisis Gambar Lain
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default ResultsPage;