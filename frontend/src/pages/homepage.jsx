import { useEffect, useRef } from "react";
import graphImage from "../assets/graph.jpg";

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

    return (
        <main className="homepage" ref={pageRef}>

            {/* HERO */}
            <section className="hero">

                <div className="hero-blob-deco hero-blob-deco-1" />
                <div className="hero-blob-deco hero-blob-deco-2" />
                <div className="hero-particle hp-1" />
                <div className="hero-particle hp-2" />
                <div className="hero-particle hp-3" />
                <div className="hero-particle hp-4" />

                <div className="hero-content">
                    <h1>
                        AI-Powered<br />
                        Handwriting<br />
                        Analysis
                    </h1>

                    <button className="analysis-button">
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
                            <span>⚙</span>
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