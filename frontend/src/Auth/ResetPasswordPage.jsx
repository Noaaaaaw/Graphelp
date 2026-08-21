import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/auth.css";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const otp = location.state?.otp;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!email || !otp) {
        return (
            <main className="login-page">
                <section className="login-background">
                    <div className="login-card" style={{ textAlign: "center" }}>
                        <h1 className="login-logo">Graphelp_</h1>
                        <p style={{ color: "#ff4d4d", margin: "20px 0" }}>
                            Sesi reset password tidak valid.
                        </p>
                        <button className="login-button" onClick={() => navigate("/forgot-password")}>
                            Kembali ke Lupa Password
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (newPassword !== confirmPassword) {
            setErrorMessage("Password dan Konfirmasi Password tidak cocok!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Password berhasil diperbarui! Silahkan login.");
                navigate("/login");
            } else {
                setErrorMessage(data.detail || "Gagal memperbarui password.");
            }
        } catch (error) {
            console.error("Error reset password:", error);
            setErrorMessage("Gagal terhubung ke server backend.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-background">
                <form className="login-card" onSubmit={handleResetPassword}>
                    <h1 className="login-logo">Graphelp_</h1>
                    <p className="login-subtitle">Konfirmasi data untuk ganti password</p>

                    {errorMessage && <p style={{ color: "#ff4d4d", fontSize: "14px", textAlign: "center" }}>{errorMessage}</p>}

                    {/* Password Baru */}
                    <div className="login-field">
                        <label htmlFor="newPassword">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a21.7 21.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Konfirmasi Password */}
                    <div className="login-field">
                        <label htmlFor="confirmPassword">Konfirmasi Password</label>
                        <div className="password-wrapper">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a21.7 21.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading} style={{ marginTop: "15px" }}>
                        {isLoading ? "Memperbarui..." : "Update"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default ResetPasswordPage;