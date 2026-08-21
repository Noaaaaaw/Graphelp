import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/auth.css";

function RegisterPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState("public");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State Input Form
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [schoolEmail, setSchoolEmail] = useState("");
    const [buktiFile, setBuktiFile] = useState(null);
    const [buktiFileName, setBuktiFileName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Validasi Konfirmasi Password
        if (password !== confirmPassword) {
            setErrorMessage("Password dan Konfirmasi Password tidak cocok!");
            return;
        }

        setIsLoading(true);

        // Menggunakan FormData karena backend menerima Form Data + File Upload
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);

        if (role === "guru") {
            formData.append("schoolName", schoolName);
            formData.append("schoolEmail", schoolEmail);
            if (buktiFile) {
                formData.append("buktiFile", buktiFile);
            }
        }

        try {
            const response = await fetch("http://localhost:8000/register", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registrasi berhasil! Silahkan login.");
                navigate("/login");
            } else {
                setErrorMessage(data.detail || "Registrasi gagal!");
            }
        } catch (error) {
            console.error("Error register:", error);
            setErrorMessage("Gagal terhubung ke server backend.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-background">
                <form className="login-card" onSubmit={handleRegister}>
                    <h1 className="login-logo">Graphelp_</h1>
                    <p className="login-subtitle">Silahkan daftarkan akun</p>

                    {errorMessage && <p style={{ color: "#ff4d4d", fontSize: "14px", textAlign: "center" }}>{errorMessage}</p>}

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

                    {/* Email */}
                    <div className="login-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Field khusus guru */}
                    {role === "guru" && (
                        <>
                            <div className="login-field">
                                <label htmlFor="schoolName">Nama Sekolah</label>
                                <input
                                    id="schoolName"
                                    type="text"
                                    value={schoolName}
                                    onChange={(e) => setSchoolName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="login-field">
                                <label htmlFor="schoolEmail">Email Sekolah</label>
                                <input
                                    id="schoolEmail"
                                    type="email"
                                    value={schoolEmail}
                                    onChange={(e) => setSchoolEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="login-field">
                                <label htmlFor="buktiFile">Bukti Mengajar (SK/Surat Tugas/ID Sekolah)</label>
                                <label htmlFor="buktiFile" className="file-upload">
                                    {buktiFileName || "Pilih file bukti"}
                                </label>
                                <input
                                    id="buktiFile"
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="file-input-hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setBuktiFile(file);
                                        setBuktiFileName(file?.name || "");
                                    }}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Password */}
                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
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

                    {/* Confirm Password */}
                    <div className="login-field">
                        <label htmlFor="confirmPassword">Konfirmasi Password</label>
                        <div className="password-wrapper">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
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
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? "Memproses..." : "Daftar"}
                    </button>

                    {/* Login Link */}
                    <div className="register-text">
                        <span>Sudah punya akun?</span>
                        <Link to="/login">Masuk</Link>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default RegisterPage;