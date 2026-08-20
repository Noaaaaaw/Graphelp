import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function CrossIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function SparkleIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 L14 9.5 L21.5 12 L14 14.5 L12 22 L10 14.5 L2.5 12 L10 9.5 Z" />
        </svg>
    );
}

function BrainIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2a2.5 2.5 0 0 0-2.5 2.5v.5A2.5 2.5 0 0 0 4.5 7.5v1A2.5 2.5 0 0 0 3 11v1a2.5 2.5 0 0 0 2 2.45V17.5A2.5 2.5 0 0 0 7.5 20h1a1.5 1.5 0 0 0 1.5-1.5v-14A2.5 2.5 0 0 0 9.5 2Z" />
            <path d="M14.5 2a2.5 2.5 0 0 1 2.5 2.5v.5a2.5 2.5 0 0 1 2.5 2.5v1A2.5 2.5 0 0 1 21 11v1a2.5 2.5 0 0 1-2 2.45V17.5a2.5 2.5 0 0 1-2.5 2.5h-1a1.5 1.5 0 0 1-1.5-1.5v-14A2.5 2.5 0 0 1 14.5 2Z" />
        </svg>
    );
}

function TrendUpIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 17 9 11 13 15 21 7" />
            <polyline points="14 7 21 7 21 14" />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

function RefreshIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
    );
}

function LightbulbIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .8 1.6v.7h6.4v-.7c0-.6.3-1.2.8-1.6A7 7 0 0 0 12 2Z" />
        </svg>
    );
}

function useRevealOnScroll() {
    const containerRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const targets = el.querySelectorAll(".reveal");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        targets.forEach((t) => observer.observe(t));

        return () => observer.disconnect();
    }, []);

    return containerRef;
}

function LearnMorePage() {
    const pageRef = useRevealOnScroll();
    const navigate = useNavigate();

    const handleStartAnalysis = () => {
        navigate("/analyze");
    };

    return (
        <main className="learnmore-page" ref={pageRef}>

            {/* Hero */}
            <section className="learnmore-hero">

                <div className="hero-blob hero-blob-1" />
                <div className="hero-blob hero-blob-2" />
                <div className="hero-blob hero-blob-3" />
                <div className="hero-blob hero-blob-4" />
                <div className="hero-ring hero-ring-1" />
                <div className="hero-ring hero-ring-2" />
                <div className="hero-particle hero-particle-1" />
                <div className="hero-particle hero-particle-2" />
                <div className="hero-particle hero-particle-3" />
                <div className="hero-particle hero-particle-4" />
                <div className="hero-particle hero-particle-5" />
                <div className="hero-particle hero-particle-6" />

                <div className="hero-content">

                    <h1>
                        Tips menggunakan Graphelp secara optimal
                    </h1>

                    <p>
                        Dapatkan hasil analisis kepribadian yang paling akurat dan bermakna dengan mengikuti panduan berbasis AI kami.
                    </p>

                    <button type="button" className="guide-button">
                        Panduan pengguna
                    </button>

                </div>

            </section>

            {/* Step 1 */}
            <section className="step-card reveal">

                <div className="step-header">

                    <span className="step-number">
                        1
                    </span>

                    <div>
                        <h2>
                            Persiapkan tulisan tangan
                        </h2>
                        <p>
                            Tulisan tangan yang baik adalah kunci analisis yang akurat. Pastikan kondisi fisik tulisan mendukung keterbacaan AI.
                        </p>
                    </div>

                </div>

                <div className="tips-grid">

                    <div className="tips-box tips-do">

                        <h3>
                            Tips (Do)
                        </h3>

                        <ul>
                            <li style={{ "--i": 0 }}>
                                <span className="tips-icon"><CheckIcon /></span>
                                Gunakan kertas polos atau bergaris tipis
                            </li>
                            <li style={{ "--i": 1 }}>
                                <span className="tips-icon"><CheckIcon /></span>
                                Tulis secara natural, jangan dibuat-buat
                            </li>
                            <li style={{ "--i": 2 }}>
                                <span className="tips-icon"><CheckIcon /></span>
                                Panjang tulisan minimal 3-5 baris
                            </li>
                        </ul>

                    </div>

                    <div className="tips-box tips-dont">

                        <h3>
                            Hindari (Dont)
                        </h3>

                        <ul>
                            <li style={{ "--i": 0 }}>
                                <span className="tips-icon"><CrossIcon /></span>
                                Tulisan terlalu kecil atau besar
                            </li>
                            <li style={{ "--i": 1 }}>
                                <span className="tips-icon"><CrossIcon /></span>
                                Coretan yang berlebihan
                            </li>
                            <li style={{ "--i": 2 }}>
                                <span className="tips-icon"><CrossIcon /></span>
                                Tulisan hasil edit digital
                            </li>
                        </ul>

                    </div>

                </div>

            </section>

            {/* Step 2 & 3 */}
            <section className="step-row">

                <div className="step-card step-card-half reveal">

                    <div className="step-header">

                        <span className="step-number">
                            2
                        </span>

                        <div>
                            <h2>
                                Foto &amp; scan berkualitas
                            </h2>
                            <p>
                                AI membaca detail visual. Pastikan gambar:
                            </p>
                        </div>

                    </div>

                    <ul className="plain-list">
                        <li>Jelas dan tidak blur</li>
                        <li>Pencahayaan cukup (terang)</li>
                        <li>Tulisan utuh tidak terpotong</li>
                    </ul>

                </div>

                <div className="step-card step-card-half reveal">

                    <div className="step-header">

                        <span className="step-number">
                            3
                        </span>

                        <div>
                            <h2>
                                Upload &amp; analisis
                            </h2>
                            <p>
                                Langkah mudah memulai:
                            </p>
                        </div>

                    </div>

                    <ol className="plain-list plain-list-numbered">
                        <li>Buka menu Handwriting Analyst</li>
                        <li>Upload foto/scan tulisan</li>
                        <li>Tunggu proses AI (beberapa detik)</li>
                    </ol>

                </div>

            </section>

            {/* Step 4 & 5 */}
            <section className="step-duo reveal">
                <div className="step-duo-col">
                    <div className="step-duo-header">
                        <span className="step-duo-icon"><BrainIcon /></span>
                        <h2>4. Memahami Hasil</h2>
                    </div>
                    
                    <div className="scope-box">
                        <p className="scope-box-label">Cakupan Analisis</p>
                        <ul className="scope-box-list">
                            <li>Karakter dominan &amp; pola kepribadian</li>
                            <li>Kecenderungan emosional</li>
                            <li>Insight untuk pengembangan diri</li>
                        </ul>
                    </div>
                    
                    <div className="scope-tip">
                        <span className="scope-tip-icon"><LightbulbIcon /></span>
                        <p>
                            Tips: Fokus pada pola utama, bukan satu indikator saja. Gunakan sebagai alat refleksi diri.
                        </p>
                    </div>
                </div>
                
                <div className="step-duo-col">
                    <div className="step-duo-header">
                        <span className="step-duo-icon step-duo-icon-alt"><TrendUpIcon /></span>
                        <h2>5. Pengembangan Diri</h2>
                    </div>
                    
                    <p className="step-duo-text">
                        Grapholyze bukan hanya alat analisis, tapi sarana untuk bertumbuh. Gunakan untuk:
                    </p>
                    
                    <ul className="growth-list">
                        <li style={{ "--i": 0 }}>
                            <span className="growth-check"><CheckIcon /></span>
                            Mengenali gaya belajar &amp; kerja
                        </li>
                        <li style={{ "--i": 1 }}>
                            <span className="growth-check"><CheckIcon /></span>
                            Memahami cara komunikasi efektif
                        </li>
                        <li style={{ "--i": 2 }}>
                            <span className="growth-check"><CheckIcon /></span>
                            Mengelola emosi &amp; keputusan
                        </li>
                        <li style={{ "--i": 3 }}>
                            <span className="growth-check"><CheckIcon /></span>
                            Refleksi diri harian
                        </li>
                    </ul>
                </div>
            </section>
            
            {/* Step 6 & 7 */}
<section className="step-row">

    <div className="step-card step-card-plain reveal">

        <div className="plain-card-header">
            <span className="step-number">6</span>
            <h2 className="plain-card-title">Hal yang Perlu Diketahui</h2>
        </div>

        <ul className="plain-list">
            <li>Hasil bersifat non-medis &amp; pendukung.</li>
            <li>Dipengaruhi kondisi fisik saat menulis.</li>
            <li>Tidak menggantikan diagnosis profesional.</li>
        </ul>

    </div>

    <div className="step-card step-card-note reveal">

        <div className="plain-card-header">
            <span className="step-number">7</span>
            <h2 className="plain-card-title">Analisis Ulang</h2>
        </div>

        <p className="note-text">
            Kepribadian berkembang. Disarankan melakukan analisis ulang setelah beberapa bulan atau dalam kondisi emosional berbeda.
        </p>

    </div>

</section>

            {/* CTA penutup */}
            <section className="learnmore-cta reveal">

                <div className="cta-blob cta-blob-1" />
                <div className="cta-blob cta-blob-2" />
                <div className="cta-sparkle cta-sparkle-1"><SparkleIcon /></div>
                <div className="cta-star cs-1" />
                <div className="cta-star cs-2" />
                <div className="cta-star cs-3" />
                <div className="cta-star cs-4" />
                <div className="cta-star cs-5" />
                <div className="cta-star cs-6" />
                <div className="cta-star cs-7" />
                <div className="cta-star cs-8" />
                <div className="cta-star cs-9" />
                <div className="cta-star cs-10" />
                <div className="cta-star cs-11" />
                <div className="cta-star cs-12" />
                <div className="cta-star cs-13" />
                <div className="cta-star cs-14" />
                <div className="cta-star cs-15" />

                <div className="cta-content">

                    <h2>
                        Siap coba analisis tulisan tangan?
                    </h2>

                    <button
                        type="button"
                        className="cta-button"
                        onClick={handleStartAnalysis}
                    >
                        Mulai analisis sekarang
                    </button>

                </div>

            </section>

        </main>
    );
}

export default LearnMorePage;