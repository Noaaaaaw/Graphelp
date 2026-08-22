import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import "../style/auth.css";

function VerifyOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const registerData = location.state?.registerData;

    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!registerData) {
        return (
            <main className="login-page">
                <section className="login-background">
                    <div className="login-card" style={{ textAlign: "center" }}>
                        <h1 className="login-logo">Graphelp_</h1>
                        <p style={{ color: "#ff4d4d", margin: "20px 0" }}>
                            Sesi registrasi tidak ditemukan. Silahkan isi form daftar terlebih dahulu.
                        </p>
                        <button className="login-button" onClick={() => navigate("/register")}>
                            Kembali ke Registrasi
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/register-with-otp?otp=${otp}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Registrasi berhasil! Silahkan login.");
                navigate("/login");
            } else {
                setErrorMessage(data.detail || "Kode OTP salah atau kadaluarsa!");
            }
        } catch (error) {
            console.error("Error verify OTP:", error);
            setErrorMessage("Gagal terhubung ke server backend.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-background">
                <form className="login-card" onSubmit={handleVerifyOtp}>
                    <h1 className="login-logo" style={{ fontSize: "28px" }}>Verifikasi OTP</h1>
                    <p className="login-subtitle" style={{ fontSize: "14px", marginTop: "5px" }}>
                        Kode OTP telah diberikan ke <br />
                        <strong style={{ color: "#ffffff" }}>{registerData.email}</strong>
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

                    <button type="submit" className="login-button" disabled={isLoading} style={{ marginTop: "20px" }}>
                        {isLoading ? "Memverifikasi..." : "Verifikasi"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default VerifyOtpPage;