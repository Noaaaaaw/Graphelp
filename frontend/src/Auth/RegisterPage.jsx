import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/auth.css";

function RegisterPage() {
    const [role, setRole] = useState("public");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [buktiFileName, setBuktiFileName] = useState("");

    return (
        <main className="login-page">

            <section className="login-background">

                <div className="login-card">

                    <h1 className="login-logo">
                        Graphelp_
                    </h1>

                    <p className="login-subtitle">
                        Silahkan daftarkan akun
                    </p>

                    {/* Role selector */}
                    <div className="role-select">

                        <button
                            type="button"
                            className={`role-option ${role === "public" ? "active" : ""}`}
                            onClick={() => setRole("public")}
                        >
                            Publik
                        </button>

                        <button
                            type="button"
                            className={`role-option ${role === "guru" ? "active" : ""}`}
                            onClick={() => setRole("guru")}
                        >
                            Guru
                        </button>

                    </div>

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

                    {/* Email */}
                    <div className="login-field">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                        />

                    </div>

                    {/* Field khusus guru */}
                    {role === "guru" && (
                        <>

                            {/* Nama sekolah */}
                            <div className="login-field">

                                <label htmlFor="schoolName">
                                    Nama Sekolah
                                </label>

                                <input
                                    id="schoolName"
                                    type="text"
                                    placeholder=" "
                                />

                            </div>

                            {/* Email sekolah untuk verifikasi */}
                            <div className="login-field">

                                <label htmlFor="schoolEmail">
                                    Email Sekolah
                                </label>

                                <input
                                    id="schoolEmail"
                                    type="email"
                                    placeholder=" "
                                />

                            </div>

                            {/* Upload bukti konkret */}
                            <div className="login-field">

                                <label htmlFor="buktiFile">
                                    Bukti Mengajar (SK/Surat Tugas/ID Sekolah)
                                </label>

                                <label htmlFor="buktiFile" className="file-upload">
                                    {buktiFileName || "Pilih file bukti"}
                                </label>

                                <input
                                    id="buktiFile"
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="file-input-hidden"
                                    onChange={(e) =>
                                        setBuktiFileName(e.target.files[0]?.name || "")
                                    }
                                />

                            </div>

                        </>
                    )}

                    {/* Password */}
                    <div className="login-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
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

                    {/* Confirm Password */}
                    <div className="login-field">

                        <label htmlFor="confirmPassword">
                            Konfirmasi Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
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

                    {/* Button */}
                    <button
                        type="button"
                        className="login-button"
                    >
                        Daftar
                    </button>

                    {/* Login */}
                    <div className="register-text">

                        <span>
                            Sudah punya akun?
                        </span>

                        <Link to="/login">
                            Masuk
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default RegisterPage;