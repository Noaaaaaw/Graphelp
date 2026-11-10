import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LANGS = [
    { code: "id", label: "Indonesia", short: "ID" },
    { code: "en", label: "English", short: "EN" },
];

function GlobeIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const currentCode = i18n.language?.startsWith("en") ? "en" : "id";
    const current = LANGS.find((l) => l.code === currentCode);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        const onEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEsc);
        };
    }, []);

    const choose = (code) => {
        i18n.changeLanguage(code);
        setOpen(false);
    };

    return (
        <div className="lang-dd" ref={ref}>
            <button
                type="button"
                className={`lang-dd-trigger ${open ? "open" : ""}`}
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="lang-dd-globe"><GlobeIcon /></span>
                <span className="lang-dd-name">{current.label}</span>
                <span className="lang-dd-code">{current.short}</span>
                <span className="lang-dd-chevron"><ChevronIcon /></span>
            </button>

            {open && (
                <ul className="lang-dd-menu" role="listbox">
                    {LANGS.map((l) => (
                        <li key={l.code}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={l.code === currentCode}
                                className={`lang-dd-option ${l.code === currentCode ? "selected" : ""}`}
                                onClick={() => choose(l.code)}
                            >
                                <span className="lang-dd-option-code">{l.short}</span>
                                <span className="lang-dd-option-label">{l.label}</span>
                                {l.code === currentCode && <CheckIcon />}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LanguageSwitcher;