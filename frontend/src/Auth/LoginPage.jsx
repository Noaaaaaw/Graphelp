import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/auth.css";

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <main className="login-page">

            <section className="login-background">

                <div className="login-card">

                    <h1 className="login-logo">
                        Graphelp_
                    </h1>

                    <p className="login-subtitle">
                        Selamat Datang Kembali
                    </p>

                    {/* Username */}
                    <div className="login-field">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            autoComplete="username"
                        />

                    </div>

                    {/* Password */}
                    <div className="login-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
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

                            <span>
                                Ingat saya
                            </span>

                        </label>

                        <a href="#">
                            Lupa Password?
                        </a>

                    </div>

                    {/* Button */}
                    <button
                        type="button"
                        className="login-button"
                    >
                        Masuk
                    </button>

                    {/* Register */}
                    <div className="register-text">

                        <span>
                            Belum punya akun?
                        </span>

                        <Link to="/register">
                            Daftar disini
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default LoginPage;