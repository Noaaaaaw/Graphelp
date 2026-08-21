import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/auth.css";

function VerifyOtpForgotPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    if (!email) {
        return (
            <main className="login-page">
                <section className="login-background">
                    <div className="login-card" style={{ textAlign: "center" }}>
                        <h1 className="login-logo">Graphelp_</h1>
                        <p style={{ color: "#ff4d4d", margin: "20px 0" }}>
                            Sesi tidak ditemukan. Silahkan masukkan email terlebih dahulu.
                        </p>
                        <button className="login-button" onClick={() => navigate("/forgot-password")}>
                            Kembali
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    const handleVerify = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (otp.length < 6) {
            setErrorMessage("Masukkan 6 digit kode OTP!");
            return;
        }

        // Simpan OTP dan email lalu lanjut ke form password baru
        navigate("/forgot-password/reset", { state: { email, otp } });
    };

    return (
        <main className="login-page">
            <section className="login-background">
                <form className="login-card" onSubmit={handleVerify}>
                    <h1 className="login-logo" style={{ fontSize: "28px" }}>Verifikasi OTP</h1>
                    <p className="login-subtitle" style={{ fontSize: "14px", marginTop: "5px" }}>
                        Kode OTP telah diberikan ke <br />
                        <strong style={{ color: "#ffffff" }}>{email}</strong>
                    </p>

                    {errorMessage && <p style={{ color: "#ff4d4d", fontSize: "14px", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}

                    <div className="login-field" style={{ marginTop: "25px" }}>
                        <input
                            type="text"
                            placeholder="Masukkan 6 digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            style={{ textAlign: "center", letterSpacing: "2px", fontSize: "16px" }}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" style={{ marginTop: "20px" }}>
                        Verifikasi
                    </button>
                </form>
            </section>
        </main>
    );
}

export default VerifyOtpForgotPage;