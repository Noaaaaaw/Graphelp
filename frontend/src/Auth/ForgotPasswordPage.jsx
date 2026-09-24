import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/auth.css";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                // Pindah ke Halaman OTP sambil membawa email
                navigate("/forgot-password/verify-otp", { state: { email } });
            } else {
                setErrorMessage(data.detail || "Gagal mengirim OTP.");
            }
        } catch (error) {
            console.error("Error send OTP:", error);
            setErrorMessage("Gagal terhubung ke server backend.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-background">

                {/* Dekorasi Galaxy */}
                <div className="login-star ls-1" />
                <div className="login-star ls-2" />
                <div className="login-star ls-3" />
                <div className="login-star ls-4" />
                <div className="login-star ls-5" />
                <div className="login-star ls-6" />
                <div className="login-star ls-7" />
                <div className="login-star ls-8" />
                <div className="login-star ls-9" />
                <div className="login-star ls-10" />
                <div className="login-star ls-11" />
                <div className="login-star ls-12" />
                <div className="login-star ls-13" />
                <div className="login-star ls-14" />
                <div className="login-star ls-15" />
                <div className="login-star ls-16" />
                <div className="login-star ls-17" />
                <div className="login-star ls-18" />
                <div className="login-star ls-19" />
                <div className="login-star ls-20" />
                <div className="login-star ls-21" />
                <div className="login-star ls-22" />
                <div className="login-star ls-23" />
                <div className="login-star ls-24" />
                <div className="login-star ls-25" />

                <div className="login-sun" />

                <div className="login-moon" />

                <div className="login-planet-deco login-planet-deco-1" />
                <div className="login-planet-deco login-planet-deco-2" />
                <div className="login-planet-deco login-planet-deco-3" />
                <div className="login-planet-deco login-planet-deco-4" />
                <div className="login-planet-deco login-planet-deco-5">
                    <span className="login-planet-ring" />
                </div>
                <div className="login-planet-deco login-planet-deco-6" />
                <div className="login-planet-deco login-planet-deco-7" />

                <div className="login-ufo">
                    <span className="login-ufo-beam" />
                    <span className="login-ufo-emoji">🛸</span>
                </div>

                {/* Astronot fullbody melayang */}
                <div className="login-astronaut">
                    <svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg">
                        <rect x="16" y="40" width="28" height="34" rx="6" fill="#c9d1e0" />
                        <rect x="18" y="70" width="10" height="26" rx="5" fill="#f4f6f8" />
                        <rect x="32" y="70" width="10" height="26" rx="5" fill="#f4f6f8" />
                        <rect x="16" y="92" width="14" height="10" rx="4" fill="#e0774a" />
                        <rect x="30" y="92" width="14" height="10" rx="4" fill="#e0774a" />
                        <rect x="4" y="42" width="12" height="30" rx="6" fill="#f4f6f8" />
                        <rect x="44" y="42" width="12" height="30" rx="6" fill="#f4f6f8" />
                        <circle cx="10" cy="74" r="7" fill="#e0774a" />
                        <circle cx="50" cy="74" r="7" fill="#e0774a" />
                        <rect x="14" y="36" width="32" height="40" rx="12" fill="#f4f6f8" />
                        <rect x="22" y="46" width="16" height="12" rx="3" fill="#7fc8e0" />
                        <circle cx="26" cy="52" r="1.6" fill="#3f8aa3" />
                        <circle cx="34" cy="52" r="1.6" fill="#3f8aa3" />
                        <circle cx="30" cy="20" r="19" fill="#f4f6f8" stroke="#c9d1e0" strokeWidth="2" />
                        <ellipse cx="30" cy="20" rx="13" ry="14" fill="#7fc8e0" />
                        <ellipse cx="25" cy="15" rx="4" ry="5" fill="rgba(255,255,255,0.55)" />
                    </svg>
                </div>

                {/* Alien fullbody */}
                <div className="login-alien">
                    <svg viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
                        <rect x="16" y="72" width="6" height="22" rx="3" fill="#4e9174" />
                        <rect x="28" y="72" width="6" height="22" rx="3" fill="#4e9174" />
                        <rect x="4" y="50" width="6" height="24" rx="3" fill="#8fcf9b" transform="rotate(15 7 50)" />
                        <rect x="40" y="50" width="6" height="24" rx="3" fill="#8fcf9b" transform="rotate(-15 43 50)" />
                        <path d="M15 45 C15 65, 35 65, 35 45 C35 35, 15 35, 15 45 Z" fill="#8fcf9b" />
                        <ellipse cx="25" cy="22" rx="17" ry="20" fill="#8fcf9b" />
                        <ellipse cx="17" cy="22" rx="6" ry="9" fill="#0c1e2e" transform="rotate(-10 17 22)" />
                        <ellipse cx="33" cy="22" rx="6" ry="9" fill="#0c1e2e" transform="rotate(10 33 22)" />
                        <ellipse cx="15" cy="19" rx="1.8" ry="2.6" fill="rgba(255,255,255,0.7)" />
                        <ellipse cx="31" cy="19" rx="1.8" ry="2.6" fill="rgba(255,255,255,0.7)" />
                    </svg>
                </div>

                <div className="login-meteor-deco lm-1">
                    <span className="login-meteor-deco-line" />
                </div>
                <div className="login-meteor-deco lm-2">
                    <span className="login-meteor-deco-line" />
                </div>
                <div className="login-meteor-deco lm-3">
                    <span className="login-meteor-deco-line" />
                </div>

                <form className="login-card" onSubmit={handleSendOtp}>
                    <h1 className="login-logo" style={{ fontSize: "28px" }}>Lupa Password</h1>
                    <p className="login-subtitle" style={{ fontSize: "14px", marginTop: "5px" }}>
                        Masukkan email, kami kirim kode <br /> OTP buat reset password.
                    </p>

                    {errorMessage && <p style={{ color: "#ff4d4d", fontSize: "14px", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}

                    <div className="login-field" style={{ marginTop: "25px" }}>
                        <input
                            type="email"
                            placeholder="Masukkan email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading} style={{ marginTop: "20px" }}>
                        {isLoading ? "Mengirim..." : "Kirim OTP"}
                    </button>

                    <div className="register-text" style={{ marginTop: "15px" }}>
                        <Link to="/login">Kembali ke Login</Link>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default ForgotPasswordPage;