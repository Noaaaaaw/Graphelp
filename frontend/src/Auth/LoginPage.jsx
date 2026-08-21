import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/auth.css";

function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // State Input
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        // FastAPI OAuth2 / Form handling membutuhkan x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                // Simpan data user / token ke localStorage
                localStorage.setItem("user", JSON.stringify(data.user || data));
                alert("Login berhasil!");
                navigate("/");
            } else {
                // Konversi error object ke string agar React tidak crash
                if (typeof data.detail === "string") {
                    setErrorMessage(data.detail);
                } else if (Array.isArray(data.detail)) {
                    setErrorMessage(data.detail[0]?.msg || "Username atau password salah.");
                } else {
                    setErrorMessage("Login gagal! Periksa username/password.");
                }
            }
        } catch (error) {
            console.error("Error login:", error);
            setErrorMessage("Gagal terhubung ke server backend.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-background">
                <form className="login-card" onSubmit={handleLogin}>
                    <h1 className="login-logo">Graphelp_</h1>
                    <p className="login-subtitle">Selamat Datang Kembali</p>

                    {errorMessage && <p style={{ color: "#ff4d4d", fontSize: "14px", textAlign: "center" }}>{errorMessage}</p>}

                    {/* Username */}
                    <div className="login-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
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

                    {/* Remember & Forgot */}
                    <div className="login-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span>Ingat saya</span>
                        </label>
                        {/* Link ke Halaman Lupa Password */}
                        <Link to="/forgot-password">Lupa Password?</Link>
                    </div>

                    {/* Button */}
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? "Memproses..." : "Masuk"}
                    </button>

                    {/* Register Link */}
                    <div className="register-text">
                        <span>Belum punya akun?</span>
                        <Link to="/register">Daftar disini</Link>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;