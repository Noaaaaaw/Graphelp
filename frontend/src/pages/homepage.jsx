import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

        targets.forEach((node) => observer.observe(node));

        return () => observer.disconnect();
    }, []);

    return containerRef;
}

function Homepage() {
    const pageRef = useRevealOnScroll();
    const navigate = useNavigate();
    const toast = useToast();
    const { t } = useTranslation();

    const list = (key) => t(key, { returnObjects: true });

    // Cek localStorage "user" sebelum ke /analyze
    const handleMulaiAnalisis = () => {
        const savedUser = localStorage.getItem("user");
        const user = savedUser ? JSON.parse(savedUser) : null;

        if (!user) {
            toast.error(t("nav.loginRequired"));
            navigate("/login");
        } else {
            navigate("/analyze");
        }
    };

    return (
        <main className="homepage" ref={pageRef}>

            {/* HERO */}
            <section className="hero">

                {Array.from({ length: 16 }, (_, i) => (
                    <div key={i} className={`hero-star hs-${i + 1}`} />
                ))}
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
                        {t("home.start")}
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

                    <h2>{t("home.aboutTitle")}</h2>

                    <p>{t("home.aboutP1")}</p>

                    <p>{t("home.aboutP2")}</p>

                    <div className="about-highlight">
                        “{t("home.quote")}”
                    </div>

                    <div className="stats">

                        <div className="stat accuracy" style={{ "--i": 0 }}>
                            <strong>90%</strong>
                            <span>{t("home.stats.accuracy")}</span>
                        </div>

                        <div className="stat online" style={{ "--i": 1 }}>
                            <strong>24/7</strong>
                            <span>{t("home.stats.online")}</span>
                        </div>

                        <div className="stat analysis" style={{ "--i": 2 }}>
                            <strong>1000+</strong>
                            <span>{t("home.stats.analysis")}</span>
                        </div>

                    </div>

                </div>


                {/* TEKNOLOGI */}
                <div className="technology-card reveal">

                    <h2>{t("home.techTitle")}</h2>

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

                    <span className="step-number">1</span>

                    <div>
                        <h2>{t("home.step1.title")}</h2>
                        <p>{t("home.step1.desc")}</p>
                    </div>

                </div>

                <div className="tips-grid">

                    <div className="tips-box tips-do">
                        <h3>{t("home.step1.tipsDo")}</h3>
                        <ul>
                            {list("home.step1.doList").map((item, i) => (
                                <li key={i} style={{ "--i": i }}>
                                    <span className="tips-icon"><CheckIcon /></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="tips-box tips-dont">
                        <h3>{t("home.step1.tipsDont")}</h3>
                        <ul>
                            {list("home.step1.dontList").map((item, i) => (
                                <li key={i} style={{ "--i": i }}>
                                    <span className="tips-icon"><CrossIcon /></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

            </section>

            {/* Step 2 & 3 */}
            <section className="step-row">

                <div className="step-card step-card-half reveal">

                    <div className="step-header">
                        <span className="step-number">2</span>
                        <div>
                            <h2>{t("home.step2.title")}</h2>
                            <p>{t("home.step2.desc")}</p>
                        </div>
                    </div>

                    <ul className="plain-list">
                        {list("home.step2.list").map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>

                </div>

                <div className="step-card step-card-half reveal">

                    <div className="step-header">
                        <span className="step-number">3</span>
                        <div>
                            <h2>{t("home.step3.title")}</h2>
                            <p>{t("home.step3.desc")}</p>
                        </div>
                    </div>

                    <ol className="plain-list plain-list-numbered">
                        {list("home.step3.list").map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ol>

                </div>

            </section>

            {/* Step 4 & 5 */}
            <section className="step-duo reveal">
                <div className="step-duo-col">
                    <div className="step-duo-header">
                        <span className="step-duo-icon"><BrainIcon /></span>
                        <h2>{t("home.step4.title")}</h2>
                    </div>

                    <div className="scope-box">
                        <p className="scope-box-label">{t("home.step4.scopeLabel")}</p>
                        <ul className="scope-box-list">
                            {list("home.step4.scopeList").map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="scope-tip">
                        <span className="scope-tip-icon"><LightbulbIcon /></span>
                        <p>{t("home.step4.tip")}</p>
                    </div>
                </div>

                <div className="step-duo-col">
                    <div className="step-duo-header">
                        <span className="step-duo-icon step-duo-icon-alt"><TrendUpIcon /></span>
                        <h2>{t("home.step5.title")}</h2>
                    </div>

                    <p className="step-duo-text">{t("home.step5.intro")}</p>

                    <ul className="growth-list">
                        {list("home.step5.list").map((item, i) => (
                            <li key={i} style={{ "--i": i }}>
                                <span className="growth-check"><CheckIcon /></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Step 6 & 7 */}
            <section className="step-row">

                <div className="step-card step-card-plain reveal">

                    <div className="plain-card-header">
                        <span className="step-number">6</span>
                        <h2 className="plain-card-title">{t("home.step6.title")}</h2>
                    </div>

                    <ul className="plain-list">
                        {list("home.step6.list").map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>

                </div>

                <div className="step-card step-card-note reveal">

                    <div className="plain-card-header">
                        <span className="step-number">7</span>
                        <h2 className="plain-card-title">{t("home.step7.title")}</h2>
                    </div>

                    <p className="note-text">{t("home.step7.text")}</p>

                </div>

            </section>

            {/* VISI & MISI */}
            <section className="vision-mission">
                <div className="vision-sun" />
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={`vision-star vs-${i + 1}`} />
                ))}

                <div className="vision-meteor vision-meteor-1"><span className="vision-meteor-line" /></div>
                <div className="vision-meteor vision-meteor-2"><span className="vision-meteor-line" /></div>
                <div className="vision-meteor vision-meteor-3"><span className="vision-meteor-line" /></div>

                <div className="vision-planet vision-planet-1" />
                <div className="vision-planet vision-planet-2" />
                <div className="vision-planet vision-planet-3" />

                <h2 className="reveal">{t("home.vision.title")}</h2>

                <div className="vision-container">

                    <div className="vision-card reveal">
                        <div className="vision-card-header">
                            <span className="vision-icon">🎯</span>
                            <h3>{t("home.vision.visionTitle")}</h3>
                        </div>
                        <p>{t("home.vision.visionText")}</p>
                    </div>

                    <div className="vision-card reveal">
                        <div className="vision-card-header">
                            <span className="vision-icon">🚀</span>
                            <h3>{t("home.vision.missionTitle")}</h3>
                        </div>
                        <p>{t("home.vision.missionText")}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Homepage;