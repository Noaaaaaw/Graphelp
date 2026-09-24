import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "../components/Toast";
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

function DownloadIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
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

function CircleCheckIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.8 10A10 10 0 1 1 17 3.3" />
            <path d="m9 11 3 3L22 4" />
        </svg>
    );
}

const RING_R = 50;
const RING_C = 2 * Math.PI * RING_R;

/* Keterangan tiap tipe (Enneagram). Dipakai kalau backend tidak mengirim nama/deskripsi tipe. */
const TYPE_INFO = {
    1: {
        name: "The Reformer", label: "Perfeksionis",
        tagline: "Idealis, teliti, dan berprinsip kuat.",
        description: "Anda memiliki standar tinggi, idealis, dan ingin segala sesuatu berjalan benar. Anda bertanggung jawab dan disiplin, namun sering terlalu keras menilai diri sendiri maupun orang lain.",
        traits: ["Teliti", "Disiplin", "Berprinsip", "Idealis"],
        strengths: "Jujur, bertanggung jawab, dan konsisten menjaga kualitas kerja.",
        challenges: "Mudah frustrasi bila hasil tidak sempurna dan cenderung terlalu kritis.",
        tips: ["Belajarlah menerima ketidaksempurnaan, baik pada diri sendiri maupun orang lain.", "Luangkan waktu untuk relaksasi tanpa merasa bersalah.", "Sadarilah bahwa 'cukup baik' seringkali sudah memadai."],
    },
    2: {
        name: "The Helper", label: "Penolong",
        tagline: "Hangat, peduli, dan senang membantu.",
        description: "Anda hangat, empatik, dan mudah menyadari kebutuhan orang lain. Kebahagiaan Anda sering datang dari merasa dibutuhkan, namun kebutuhan pribadi kadang terabaikan.",
        traits: ["Empatik", "Murah hati", "Perhatian", "Suportif"],
        strengths: "Pandai membangun hubungan hangat dan membuat orang merasa diterima.",
        challenges: "Sulit berkata tidak dan cenderung mengabaikan kebutuhan diri sendiri.",
        tips: ["Belajarlah berkata tidak tanpa merasa bersalah.", "Luangkan waktu untuk memenuhi kebutuhan diri sendiri.", "Ungkapkan kebutuhan Anda secara langsung, bukan lewat bantuan."],
    },
    3: {
        name: "The Achiever", label: "Pencapai",
        tagline: "Ambisius, adaptif, dan berorientasi target.",
        description: "Anda termotivasi oleh tujuan, efisien, dan pandai menyesuaikan diri. Pencapaian penting bagi Anda, tetapi kadang harga diri terlalu bergantung pada pengakuan orang lain.",
        traits: ["Ambisius", "Efisien", "Adaptif", "Percaya diri"],
        strengths: "Fokus pada hasil, produktif, dan mampu memotivasi orang di sekitar.",
        challenges: "Mudah terjebak workaholic dan menilai diri dari prestasi semata.",
        tips: ["Beri ruang untuk istirahat tanpa merasa harus selalu berprestasi.", "Nilai diri dari siapa Anda, bukan dari pencapaian saja.", "Luangkan waktu untuk mengenali perasaan yang sebenarnya."],
    },
    4: {
        name: "The Individualist", label: "Individualis",
        tagline: "Sensitif, kreatif, dan mencari makna diri.",
        description: "Anda memiliki dunia emosi yang dalam, ekspresif, dan menghargai keunikan. Anda sering merasa berbeda dari orang lain dan terdorong menemukan jati diri serta makna dalam hidup.",
        traits: ["Kreatif", "Sensitif", "Autentik", "Ekspresif"],
        strengths: "Imajinatif, peka terhadap perasaan, dan mampu berkarya secara orisinal.",
        challenges: "Mudah larut dalam perasaan dan merasa kurang dimengerti.",
        tips: ["Fokus pada tindakan nyata, tidak hanya pada perasaan yang mendalam.", "Syukuri hal-hal yang sudah dimiliki, bukan yang kurang.", "Bangun rutinitas sederhana untuk menjaga stabilitas emosi."],
    },
    5: {
        name: "The Investigator", label: "Pengamat",
        tagline: "Analitis, mandiri, dan haus pengetahuan.",
        description: "Anda pengamat yang tajam, mandiri, dan suka mendalami sesuatu. Anda menjaga energi dan privasi, sehingga kadang terlihat menjauh dari keramaian.",
        traits: ["Analitis", "Mandiri", "Objektif", "Penasaran"],
        strengths: "Berpikir mendalam, tenang, dan ahli memecahkan masalah kompleks.",
        challenges: "Cenderung menarik diri dan menunda bertindak sebelum merasa siap.",
        tips: ["Bagikan pemikiran dan perasaan Anda kepada orang terdekat.", "Ambil tindakan meski merasa belum tahu cukup banyak.", "Jadwalkan waktu untuk berinteraksi, bukan hanya menyendiri."],
    },
    6: {
        name: "The Loyalist", label: "Setia",
        tagline: "Setia, waspada, dan bertanggung jawab.",
        description: "Anda setia, dapat diandalkan, dan selalu bersiap menghadapi kemungkinan risiko. Rasa aman dan dukungan dari orang tepercaya sangat berarti bagi Anda.",
        traits: ["Setia", "Waspada", "Andal", "Kooperatif"],
        strengths: "Berkomitmen, teliti mengantisipasi masalah, dan menjadi teman yang bisa dipercaya.",
        challenges: "Mudah cemas dan ragu mengambil keputusan tanpa kepastian.",
        tips: ["Percayai penilaian diri sendiri sebelum mencari kepastian dari orang lain.", "Ubah kekhawatiran menjadi langkah persiapan yang konkret.", "Beri diri kesempatan mencoba tanpa bayang-bayang skenario terburuk."],
    },
    7: {
        name: "The Enthusiast", label: "Antusias",
        tagline: "Optimis, spontan, dan penuh energi.",
        description: "Anda ceria, penuh ide, dan menyukai pengalaman baru. Anda cenderung menjaga hidup tetap menyenangkan dan menghindari hal yang membosankan atau menyakitkan.",
        traits: ["Optimis", "Spontan", "Energik", "Serba bisa"],
        strengths: "Mudah menularkan semangat dan cepat melihat peluang.",
        challenges: "Sulit fokus menuntaskan sesuatu dan cenderung menghindari emosi tidak nyaman.",
        tips: ["Selesaikan satu hal sebelum beralih ke hal berikutnya.", "Beri ruang untuk merasakan emosi yang kurang nyaman.", "Latih kehadiran penuh di saat ini."],
    },
    8: {
        name: "The Challenger", label: "Penantang",
        tagline: "Tegas, percaya diri, dan protektif.",
        description: "Anda kuat, tegas, dan berani mengambil kendali. Anda melindungi orang yang Anda pedulikan dan tidak mudah gentar menghadapi tantangan.",
        traits: ["Tegas", "Berani", "Protektif", "Mandiri"],
        strengths: "Pemimpin alami yang berani mengambil keputusan dan membela kebenaran.",
        challenges: "Bisa terlalu dominan dan sulit menunjukkan sisi rentan.",
        tips: ["Dengarkan pendapat orang lain sebelum mengambil keputusan.", "Tunjukkan sisi lembut Anda; kerentanan bukan kelemahan.", "Salurkan kekuatan untuk melindungi dan memberdayakan orang lain."],
    },
    9: {
        name: "The Peacemaker", label: "Pendamai",
        tagline: "Tenang, menerima, dan pencinta damai.",
        description: "Anda tenang, mudah menerima perbedaan, dan pandai menciptakan suasana harmonis. Demi menjaga kedamaian, Anda kadang mengalah dan menghindari konflik.",
        traits: ["Tenang", "Sabar", "Penengah", "Menerima"],
        strengths: "Pendengar yang baik dan mampu menyatukan orang dengan pandangan berbeda.",
        challenges: "Cenderung menunda dan memendam keinginan sendiri.",
        tips: ["Ungkapkan pendapat dan keinginan Anda sendiri.", "Tetapkan prioritas dan langkah kecil yang konkret setiap hari.", "Hadapi konflik yang sehat, bukan menghindarinya."],
    },
};

function ResultsPage() {
    const { state } = useLocation();
    const result = state?.result;
    const image = state?.image;
    const [shareLabel, setShareLabel] = useState("Share Result");
    const [ready, setReady] = useState(false);
    // toast opsional: kalau provider-nya nggak ada, tetap aman
    let toast = null;
    try { toast = useToast(); } catch { toast = null; }

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
    const info = TYPE_INFO[Number(result.pred_type)];
    const top3 = Array.isArray(result.top3) ? result.top3 : [];
    const typeName = result.type_name || info?.name || top3[0]?.name || "";
    const typeLabel = info?.label;
    const tagline = info?.tagline;
    const traits = info?.traits ?? [];
    const interpretation = result.interpretation || result.description || info?.description;
    const features = Array.isArray(result.features) ? result.features : [];
    const recommendations =
        Array.isArray(result.recommendations) && result.recommendations.length
            ? result.recommendations
            : info?.tips ?? [];

    const probs = top3.length
        ? top3
        : [{ type: result.pred_type, name: typeName, prob: confidence }];
    const maxProb = Math.max(...probs.map((p) => Number(p.prob) || 0), 1);

    function buildText() {
        const lines = [
            "HASIL ANALISIS TULISAN TANGAN",
            "==============================",
            `Tipe ${result.pred_type}: ${typeName}${typeLabel ? ` (${typeLabel})` : ""}`,
            `Tingkat keyakinan AI: ${confidenceText}%`,
            "",
            "Interpretasi Kepribadian",
            interpretation || "-",
        ];
        if (info) {
            lines.push("", `Kekuatan: ${info.strengths}`, `Tantangan: ${info.challenges}`);
        }
        if (features.length) {
            lines.push("", "Analisis Fitur Grafologi");
            features.forEach((f) => lines.push(`- ${f.label}: ${f.value}${f.desc ? ` (${f.desc})` : ""}`));
        }
        if (recommendations.length) {
            lines.push("", "Rekomendasi Pengembangan Diri");
            recommendations.forEach((r, i) => lines.push(`${i + 1}. ${r}`));
        }
        return lines.join("\n");
    }

    function handleDownloadTxt() {
        const blob = new Blob([buildText()], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hasil-analisis-tipe-${result.pred_type}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast?.success?.("File TXT berhasil diunduh");
    }

    async function handleShare() {
        const text = `Hasil analisis tulisan tanganku: Tipe ${result.pred_type} - ${typeName} (${confidenceText}%)`;
        try {
            if (navigator.share) {
                await navigator.share({ title: "Hasil Analisis Tulisan Tangan", text });
            } else {
                await navigator.clipboard.writeText(text);
                setShareLabel("Tersalin!");
                toast?.success?.("Hasil disalin ke clipboard");
                setTimeout(() => setShareLabel("Share Result"), 2000);
            }
        } catch {
            /* dibatalkan user */
        }
    }

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
                    Berikut karakteristik kepribadian Anda berdasarkan tulisan tangan yang telah dianalisis oleh AI.
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
                            <span className="result-predict-label">HASIL PREDIKSI AI</span>

                            <div className="result-type-row">
                                <span className="result-type-badge">{result.pred_type}</span>
                                <div>
                                    <h2>Tipe {result.pred_type}</h2>
                                    <p className="result-predict-name">
                                        {typeName}
                                        {typeLabel && <em> · {typeLabel}</em>}
                                    </p>
                                </div>
                            </div>

                            {tagline && <p className="result-predict-tagline">{tagline}</p>}

                            {traits.length > 0 && (
                                <div className="result-trait-list">
                                    {traits.map((t) => (
                                        <span key={t} className="result-trait">{t}</span>
                                    ))}
                                </div>
                            )}

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
                                    <span>*Probabilitas output model</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interpretasi */}
                    {interpretation && (
                        <div className="result-interpret">
                            <h3>Interpretasi Kepribadian</h3>
                            <p>{interpretation}</p>
                        </div>
                    )}

                    {/* Kekuatan & tantangan */}
                    {info && (
                        <div className="result-sc">
                            <div className="result-sc-card result-sc-good">
                                <span className="result-sc-icon">✓</span>
                                <div>
                                    <h4>Kekuatan</h4>
                                    <p>{info.strengths}</p>
                                </div>
                            </div>
                            <div className="result-sc-card result-sc-warn">
                                <span className="result-sc-icon">!</span>
                                <div>
                                    <h4>Tantangan</h4>
                                    <p>{info.challenges}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Peringkat kemungkinan tipe */}
                    <div className="result-panel">
                        <h3 className="result-panel-title">Peringkat Kemungkinan Tipe</h3>
                        <p className="result-panel-sub">Tiga tipe dengan probabilitas tertinggi menurut model.</p>
                        <div className="result-probs">
                            {probs.map((t, i) => {
                                const prob = Number(t.prob) || 0;
                                return (
                                    <div key={i} className={`result-prob-row ${i === 0 ? "is-top" : ""}`}>
                                        <span className="result-prob-rank">#{i + 1}</span>
                                        <div className="result-prob-main">
                                            <div className="result-prob-head">
                                                <strong>Tipe {t.type}{t.name ? ` · ${t.name}` : ""}</strong>
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

                    {/* Fitur grafologi (muncul kalau backend mengirim `features`) */}
                    {features.length > 0 && (
                        <div className="result-panel">
                            <h3 className="result-panel-title">Analisis Fitur Grafologi</h3>
                            <p className="result-panel-sub">Penjelasan karakteristik visual berdasarkan literatur.</p>
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

                    {/* Rekomendasi */}
                    {recommendations.length > 0 && (
                        <div className="result-panel">
                            <h3 className="result-panel-title result-panel-title-icon">
                                <CircleCheckIcon /> Rekomendasi Pengembangan Diri
                            </h3>
                            <ol className="result-recs">
                                {recommendations.map((r, i) => (
                                    <li key={i}>
                                        <span className="result-rec-num">{i + 1}</span>
                                        {r}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Aksi */}
                    <div className="result-actions">
                        <button type="button" className="result-btn result-btn-primary" onClick={() => window.print()}>
                            <FileIcon /> Download PDF
                        </button>
                        <button type="button" className="result-btn result-btn-soft" onClick={handleDownloadTxt}>
                            <DownloadIcon /> Download TXT
                        </button>
                        <button type="button" className="result-btn result-btn-ghost" onClick={handleShare}>
                            <ShareIcon /> {shareLabel}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default ResultsPage;