function Navbar({ isMenuOpen, onCloseMenu }) {
    const links = [
        { href: "/", label: "Home" },
        { href: "/analyze", label: "Analyze" },
        { href: "/learn-more", label: "Learn More" },
        { href: "/login", label: "Login" },
    ];

    return (
        <>
            <nav className="navbar">
                <div className="navbar-links">
                    {links.map((link) => (
                        <a key={link.href} href={link.href}>
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>

            <div
                className={`sidebar-overlay ${isMenuOpen ? "show" : ""}`}
                onClick={onCloseMenu}
            />

            <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
                <div className="sidebar-links">
                    {links.map((link, i) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={onCloseMenu}
                            style={{ transitionDelay: `${i * 40}ms` }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </aside>
        </>
    );
}

export default Navbar;