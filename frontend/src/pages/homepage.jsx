import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import graphImage from "../assets/graph.jpg";

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CrossIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function BrainIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 2a3.5 3.5 0 0 0-3.5 3.5c0 .4.05.78.15 1.15A3.5 3.5 0 0 0 4 10c0 1.1.5 2.08 1.28 2.74A3.5 3.5 0 0 0 8 18.5V20a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V5.5A3.5 3.5 0 0 0 9.5 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14.5 2A3.5 3.5 0 0 1 18 5.5c0 .4-.05.78-.15 1.15A3.5 3.5 0 0 1 20 10c0 1.1-.5 2.08-1.28 2.74A3.5 3.5 0 0 1 16 18.5V20a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V5.5A3.5 3.5 0 0 1 14.5 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function LightbulbIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.74c.6.44 1 1.17 1 1.96V17h6v-.3c0-.79.4-1.52 1-1.96A7 7 0 0 0 12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function TrendUpIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17l6-6 4 4 8-8M15 7h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function Homepage() {
    const pageRef = useRevealOnScroll();
    const navigate = useNavigate();
    const toast = useToast();

    // Sama seperti logic di Navbar: cek localStorage "user" sebelum ke /analyze
    const handleMulaiAnalisis = () => {
        const savedUser = localStorage.getItem("user");
        const user = savedUser ? JSON.parse(savedUser) : null;

        if (!user) {
            toast.error("Silakan login terlebih dahulu untuk mengakses fitur Analyze.");
            navigate("/login");
        } else {
            navigate("/analyze");
        }
    };

    return (
        <main className="homepage" ref={pageRef}>

            {/* HERO */}
            <section className="hero">

                <div className="hero-star hs-1" />
                <div className="hero-star hs-2" />
                <div className="hero-star hs-3" />
                <div className="hero-star hs-4" />
                <div className="hero-star hs-5" />
                <div className="hero-star hs-6" />
                <div className="hero-star hs-7" />
                <div className="hero-star hs-8" />
                <div className="hero-star hs-9" />
                <div className="hero-star hs-10" />
                <div className="hero-star hs-11" />
                <div className="hero-star hs-12" />
                <div className="hero-star hs-13" />
                <div className="hero-star hs-14" />
                <div className="hero-star hs-15" />
                <div className="hero-star hs-16" />
                <div className="hero-planet-deco hero-planet-deco-1" />
                <div className="hero-planet-deco hero-planet-deco-2" />
                <div className="hero-planet-deco hero-planet-deco-3" />
                <div className="hero-planet-deco hero-planet-deco-4" />
                <div className="hero-meteor-deco">
                    <span className="hero-meteor-deco-line" />
                </div>

                <div className="hero-content">
                    <h1>
                        AI-Powered<br />
                        Handwriting<br />
                        Analysis
                    </h1>

                    <button className="analysis-button" onClick={handleMulaiAnalisis}>
                        Mulai Analisis
                    </button>
                </div>

                <div className="hero-image">
                    <img
                        src={graphImage}
                        alt="Graphelp Handwriting Analysis"
                    />
                </div>

            </section>


            {/* INFORMATION */}
            <section className="information">

                {/* TENTANG GRAPHELP */}
                <div className="about-card reveal">

                    <h2>
                        Tentang Graphelp?
                    </h2>

                    <p>
                        GraphHelp merupakan aplikasi berbasis AI yang dirancang untuk menganalisis tulisan tangan dari gambar yang diunggah pengguna. Sistem memanfaatkan teknologi Artificial Intelligence untuk memberikan hasil analisis secara otomatis dan mudah dipahami.
                    </p>

                    <p>
                        Kami percaya setiap orang berhak memahami diri mereka lebih dalam dengan bantuan teknologi.
                    </p>

                    <div className="about-highlight">
                        “GraphHelp hadir sebagai platform berbasis Artificial Intelligence yang membantu menganalisis tulisan tangan secara cepat, mudah, dan efisien melalui teknologi pengenalan pola tulisan”
                    </div>

                    <div className="stats">

                        <div className="stat accuracy" style={{ "--i": 0 }}>
                            <strong>90%</strong>
                            <span>Akurasi</span>
                        </div>

                        <div className="stat online" style={{ "--i": 1 }}>
                            <strong>24/7</strong>
                            <span>Online</span>
                        </div>

                        <div className="stat analysis" style={{ "--i": 2 }}>
                            <strong>1000+</strong>
                            <span>Analisis</span>
                        </div>

                    </div>

                </div>


                {/* TEKNOLOGI */}
                <div className="technology-card reveal">

                    <h2>
                        Teknologi Kami
                    </h2>

                    <div className="technology-list">

                        <div className="technology computer" style={{ "--i": 0 }}>
                            <span>👁</span>
                            <p>Computer Vision</p>
                        </div>

                        <div className="technology deep" style={{ "--i": 1 }}>
                            <span>✿</span>
                            <p>Deep Learning</p>
                        </div>

                        <div className="technology software" style={{ "--i": 2 }}>
                            <span>&lt;/&gt;</span>
                            <p>Software Engineering</p>
                        </div>

                        <div className="technology machine" style={{ "--i": 3 }}>
                            <span>⚙</span>
                            <p>Machine Learning</p>
                        </div>

                    </div>

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

            {/* VISI & MISI */}
            <section className="vision-mission">
                <div className="vision-sun" />
                <div className="vision-star vs-1" />
                <div className="vision-star vs-2" />
                <div className="vision-star vs-3" />
                <div className="vision-star vs-4" />
                <div className="vision-star vs-5" />
                <div className="vision-star vs-6" />
                <div className="vision-star vs-7" />
                <div className="vision-star vs-8" />
                <div className="vision-star vs-9" />
                <div className="vision-star vs-10" />
                
                <div className="vision-meteor vision-meteor-1"><span className="vision-meteor-line" /></div>
                <div className="vision-meteor vision-meteor-2"><span className="vision-meteor-line" /></div>
                <div className="vision-meteor vision-meteor-3"><span className="vision-meteor-line" /></div>
                
                <div className="vision-planet vision-planet-1" />
                <div className="vision-planet vision-planet-2" />
                <div className="vision-planet vision-planet-3" />
                
                <h2 className="reveal">
                    Visi dan Misi
                </h2>
                
                <div className="vision-container">        
                    
                    <div className="vision-card reveal">
                        <div className="vision-card-header">
                            <span className="vision-icon">🎯</span>
                            <h3>Visi</h3>
                        </div>
                        <p>
                            Menjadi platform analisis tulisan tangan
                            berbasis AI yang mudah digunakan,
                            informatif, dan dapat membantu pengguna
                            memahami perkembangan kemampuan motorik
                            secara lebih efektif.
                        </p>
                    </div>
                    
                    <div className="vision-card reveal">
                        <div className="vision-card-header">
                            <span className="vision-icon">🚀</span>
                            <h3>Misi</h3>
                        </div>
                        <p>
                            Mengembangkan teknologi AI untuk
                            menganalisis tulisan tangan secara otomatis,
                            memberikan hasil analisis yang informatif,
                            serta membantu proses pemantauan
                            perkembangan motorik anak.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Homepage;