import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "./Toast";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar({ isMenuOpen, onCloseMenu }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = () => {
            const savedUser = localStorage.getItem("user");
            setUser(savedUser ? JSON.parse(savedUser) : null);
        };

        checkUser();
        window.addEventListener("storage", checkUser);

        return () => window.removeEventListener("storage", checkUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        onCloseMenu();
        navigate("/login");
    };

    // Handler khusus untuk navigasi Analyze agar dicek dulu status login-nya
    const handleAnalyzeClick = (e, callback) => {
        e.preventDefault();
        if (!user) {
            toast.error(t("nav.loginRequired"));
            navigate("/login");
        } else {
            navigate("/analyze");
        }
        if (callback) callback();
    };

    const links = [
        { href: "/", labelKey: "nav.home" },
        { href: "/analyze", labelKey: "nav.analyze", isProtected: true },
        ...(user?.role === "guru"
            ? [
                { href: "/student", labelKey: "nav.student" },
                { href: "/history", labelKey: "nav.history" }
              ]
            : user
            ? [
                { href: "/my-children", labelKey: "nav.monitoring" }
              ]
            : []),
    ];

    return (
        <>
            <nav className="navbar">
                <div className="navbar-links">
                    {links.map((link) => (
                        link.isProtected ? (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleAnalyzeClick(e)}
                                style={{ cursor: "pointer" }}
                            >
                                {t(link.labelKey)}
                            </a>
                        ) : (
                            <Link key={link.href} to={link.href}>
                                {t(link.labelKey)}
                            </Link>
                        )
                    ))}

                    {!user && <Link to="/login">{t("nav.login")}</Link>}
                </div>
            </nav>

            <div
                className={`sidebar-overlay ${isMenuOpen ? "show" : ""}`}
                onClick={onCloseMenu}
            />

            <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
                {/* Profil Khusus Mobile */}
                {user && (
                    <div className="mobile-profile-container">
                        <div className="mobile-avatar">
                            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                        </div>
                        <p className="mobile-username">{t("profile.greeting", { name: user.username })}</p>
                        <LanguageSwitcher />
                        <button onClick={handleLogout} className="mobile-logout-btn">
                            {t("profile.logout")}
                        </button>
                    </div>
                )}

                {/* Menu Navigasi Sidebar */}
                <div className="sidebar-links">
                    {links.map((link, i) => (
                        link.isProtected ? (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleAnalyzeClick(e, onCloseMenu)}
                                style={{ transitionDelay: `${i * 40}ms`, cursor: "pointer" }}
                            >
                                {t(link.labelKey)}
                            </a>
                        ) : (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={onCloseMenu}
                                style={{ transitionDelay: `${i * 40}ms` }}
                            >
                                {t(link.labelKey)}
                            </Link>
                        )
                    ))}

                    {!user && (
                        <Link to="/login" onClick={onCloseMenu}>
                            {t("nav.login")}
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}

export default Navbar;