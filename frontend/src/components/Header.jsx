import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Graphelp.png";

function Header({ isMenuOpen, onToggleMenu }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const checkUser = () => {
            const savedUser = localStorage.getItem("user");
            setUser(savedUser ? JSON.parse(savedUser) : null);
        };

        checkUser();
        window.addEventListener("storage", checkUser);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("storage", checkUser);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsDropdownOpen(false);
        navigate("/login");
    };

    return (
        <header 
            className="header" 
            style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                position: "relative",
                zIndex: 1005
            }}
        >
            <div className="logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={logo} alt="Graphelp logo" className="logo-img" />
                Graphelp_
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {/* Profile khusus Desktop */}
                {user && (
                    <div className="desktop-profile" ref={dropdownRef} style={{ position: "relative" }}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "#ffffff",
                                color: "#333",
                                border: "2px solid #ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "16px",
                                textTransform: "uppercase",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
                            }}
                            title={user.username}
                        >
                            {user.username.charAt(0)}
                        </button>

                        {/* Pop-up Dropdown Desktop */}
                        {isDropdownOpen && (
                            <div style={{
                                position: "absolute",
                                right: 0,
                                top: "50px",
                                backgroundColor: "#ffffff",
                                color: "#333333",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                                minWidth: "140px",
                                zIndex: 10000,
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px"
                            }}>
                                <p style={{ 
                                    margin: 0, 
                                    fontWeight: "bold", 
                                    fontSize: "15px", 
                                    borderBottom: "1px solid #eee", 
                                    paddingBottom: "8px",
                                    overflow: "hidden", 
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}>
                                    Hi, {user.username}
                                </p>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        backgroundColor: "#ff4d4d",
                                        color: "white",
                                        border: "none",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        fontSize: "13px"
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <button
                    className={`hamburger ${isMenuOpen ? "active" : ""}`}
                    onClick={onToggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
}

export default Header;