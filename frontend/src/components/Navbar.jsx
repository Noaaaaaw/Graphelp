import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isMenuOpen, onCloseMenu }) {
    const navigate = useNavigate();
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
        setUser(null);
        onCloseMenu();
        navigate("/login");
    };

    // Suspends/Adds links based on teacher role
    const links = [
        { href: "/", label: "Home" },
        { href: "/analyze", label: "Analyze" },
        ...(user?.role === "guru" ? [{ href: "/student", label: "Student" }] : []),
        { href: "/learn-more", label: "Learn More" },
    ];

    return (
        <>
            <nav className="navbar">
                <div className="navbar-links">
                    {links.map((link) => (
                        <Link key={link.href} to={link.href}>
                            {link.label}
                        </Link>
                    ))}

                    {!user && <Link to="/login">Login</Link>}
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
                        <p className="mobile-username">Hi, {user.username}</p>
                        <button onClick={handleLogout} className="mobile-logout-btn">
                            Logout
                        </button>
                    </div>
                )}

                {/* Menu Navigasi Sidebar */}
                <div className="sidebar-links">
                    {links.map((link, i) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={onCloseMenu}
                            style={{ transitionDelay: `${i * 40}ms` }}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {!user && (
                        <Link to="/login" onClick={onCloseMenu}>
                            Login
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}

export default Navbar;