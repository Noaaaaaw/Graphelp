import { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Header
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
            />
            <Navbar isMenuOpen={isMenuOpen} onCloseMenu={() => setIsMenuOpen(false)} />

            {children}

            <Footer />
        </>
    );
}

export default Layout;