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