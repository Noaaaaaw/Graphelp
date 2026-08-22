import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

function CheckCircleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.8 10A10 10 0 1 1 17 3.34" />
            <path d="m9 11 3 3L22 4" />
        </svg>
    );
}

function AlertCircleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function toastIcon(type) {
    if (type === "success") return <CheckCircleIcon />;
    if (type === "error") return <AlertCircleIcon />;
    return <InfoIcon />;
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        if (timers.current[id]) {
            clearTimeout(timers.current[id]);
            delete timers.current[id];
        }
    }, []);

    const showToast = useCallback((message, options = {}) => {
        const id = Date.now() + Math.random();
        const type = options.type || "info";
        const duration = options.duration ?? 3800;

        setToasts((prev) => [...prev, { id, message, type }]);

        timers.current[id] = setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    }, [removeToast]);

    const toast = {
        show: showToast,
        success: (message, options) => showToast(message, { ...options, type: "success" }),
        error: (message, options) => showToast(message, { ...options, type: "error" }),
        info: (message, options) => showToast(message, { ...options, type: "info" }),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            <div className="toast-stack" aria-live="polite" aria-atomic="true">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast-card toast-${t.type}`} role="status">
                        <span className="toast-icon">{toastIcon(t.type)}</span>
                        <p className="toast-message">{t.message}</p>
                        <button
                            type="button"
                            className="toast-close"
                            onClick={() => removeToast(t.id)}
                            aria-label="Tutup notifikasi"
                        >
                            <XIcon />
                        </button>
                        <span className="toast-progress" style={{ animationDuration: "3.8s" }} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return ctx;
}