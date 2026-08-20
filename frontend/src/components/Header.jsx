import logo from "../assets/Graphelp.png";

function Header({ isMenuOpen, onToggleMenu }) {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Graphelp logo" className="logo-img" />
                Graphelp_
            </div>

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
        </header>
    );
}

export default Header;