import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function CloudUploadIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 16l-4-4-4 4" />
            <path d="M12 12v9" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

function CameraIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    );
}

function UploadTabIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12" />
            <path d="m7 8 5-5 5 5" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
    );
}

function PencilTabIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 2 4 4-13 13H5v-4Z" />
            <path d="m14.5 5.5 4 4" />
        </svg>
    );
}

function CameraTabIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
            <circle cx="12" cy="13" r="3.2" />
        </svg>
    );
}

function EraserIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L12 21" />
            <path d="M22 21H7" />
            <path d="m5 11 6 6" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function RotateIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
        </svg>
    );
}

function AstronautIcon() {
    return (
        <svg width="56" height="72" viewBox="0 0 56 72" fill="none">
            <rect x="6" y="26" width="10" height="24" rx="4" fill="#c7cdd6" stroke="#9aa3af" strokeWidth="1" />
            <rect x="40" y="26" width="10" height="24" rx="4" fill="#c7cdd6" stroke="#9aa3af" strokeWidth="1" />
            <path d="M14 30 C6 34 4 44 10 50" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="10" cy="50" r="5.5" fill="#e8734a" />
            <path d="M42 30 C50 34 52 44 46 50" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <circle cx="46" cy="50" r="5.5" fill="#e8734a" />
            <path d="M22 56 C20 62 20 66 22 70" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M34 56 C36 62 36 66 34 70" stroke="#f4f6f8" strokeWidth="9" strokeLinecap="round" fill="none" />
            <ellipse cx="22" cy="70" rx="6" ry="4" fill="#2f6f6b" />
            <ellipse cx="34" cy="70" rx="6" ry="4" fill="#2f6f6b" />
            <rect x="12" y="24" width="32" height="34" rx="16" fill="#f4f6f8" stroke="#d7dce2" strokeWidth="1.5" />
            <rect x="20" y="34" width="16" height="12" rx="4" fill="#e8734a" />
            <circle cx="24" cy="40" r="1.6" fill="#fff" />
            <circle cx="32" cy="40" r="1.6" fill="#6fe0bc" />
            <circle cx="28" cy="16" r="15" fill="#f4f6f8" stroke="#d7dce2" strokeWidth="1.5" />
            <circle cx="28" cy="16" r="11" fill="url(#astroGlass)" />
            <ellipse cx="24" cy="11" rx="3.5" ry="2.4" fill="rgba(255,255,255,0.75)" />
            <defs>
                <radialGradient id="astroGlass" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#bfe3f7" />
                    <stop offset="55%" stopColor="#5fa8d3" />
                    <stop offset="100%" stopColor="#2c5f82" />
                </radialGradient>
            </defs>
        </svg>
    );
}

function SpaceshipIcon() {
    return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <defs>
                <linearGradient id="flameGrad" x1="30" y1="46" x2="30" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffdd8a" />
                    <stop offset="60%" stopColor="#f2a05a" />
                    <stop offset="100%" stopColor="#e8734a" />
                </linearGradient>
                <radialGradient id="winGrad" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#bfe3f7" />
                    <stop offset="60%" stopColor="#3d8783" />
                    <stop offset="100%" stopColor="#1e4c48" />
                </radialGradient>
            </defs>
            <path d="M30 46 C26 52 26 58 30 60 C34 58 34 52 30 46Z" fill="url(#flameGrad)" />
            <path d="M30 4 C40 14 42 28 40 42 L20 42 C18 28 20 14 30 4Z" fill="#f4f6f8" stroke="#d7dce2" strokeWidth="1.5" />
            <path d="M30 4 C34 9 36 15 36.5 20 L23.5 20 C24 15 26 9 30 4Z" fill="#e8734a" />
            <circle cx="30" cy="24" r="6" fill="url(#winGrad)" stroke="#fff" strokeWidth="1.5" />
            <path d="M20 42 L10 52 L20 50Z" fill="#2f6f6b" />
            <path d="M40 42 L50 52 L40 50Z" fill="#2f6f6b" />
            <rect x="20" y="38" width="20" height="5" rx="2" fill="#e3e8ec" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function tipIcon(type) {
    switch (type) {
        case "sun":
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            );
        case "paper":
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="16" y2="17" />
                </svg>
            );
        case "pencil":
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m18 2 4 4-13 13H5v-4Z" />
                </svg>
            );
        case "focus":
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8V5a2 2 0 0 1 2-2h3" />
                    <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                    <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                    <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            );
        default:
            return null;
    }
}

function photoTipIcon(type) {
    const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
    switch (type) {
        case "sun":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            );
        case "pencil":
            return (
                <svg {...common}>
                    <path d="m18 2 4 4-13 13H5v-4Z" />
                    <path d="m14.5 5.5 4 4" />
                </svg>
            );
        case "ruler":
            return (
                <svg {...common}>
                    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z" />
                    <path d="m14.5 12.5 2-2" />
                    <path d="m11.5 9.5 2-2" />
                    <path d="m8.5 6.5 2-2" />
                    <path d="m17.5 15.5 2-2" />
                </svg>
            );
        case "phone":
            return (
                <svg {...common}>
                    <rect x="6" y="2" width="12" height="20" rx="3" />
                    <path d="M12 18h.01" />
                </svg>
            );
        case "camera":
            return (
                <svg {...common}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
                    <circle cx="12" cy="13" r="4" />
                </svg>
            );
        default:
            return null;
    }
}

const PHOTO_TIPS = [
    { icon: "pencil", color: "photo-tip-pencil", title: "Tulis dengan ukuran & tekanan bervariasi", desc: "Seperti menulis biasa di kertas" },
    { icon: "ruler", color: "photo-tip-ruler", title: "Buat minimal 3-5 baris kalimat lengkap", desc: "Agar analisis lebih akurat" },
    { icon: "phone", color: "photo-tip-phone", title: "Gunakan stylus jika ada", desc: "Hasil lebih natural dan presisi" },
    { icon: "sun", color: "photo-tip-sun", title: "Pilih ukuran pena yang nyaman", desc: "Klik ikon pensil untuk mengatur" },
];

const TABS = [
    { id: "foto", label: "Upload Foto", icon: <UploadTabIcon /> },
    { id: "manual", label: "Tulis Manual", icon: <PencilTabIcon /> },
    { id: "kamera", label: "Scan Kamera", icon: <CameraTabIcon /> },
];

const TAB_META = {
    foto: {
        title: "Upload Foto Tulisan",
        hint: "Foto Tulisan dengan Jelas",
    },
    manual: {
        title: "Tulis Manual di Layar",
        hint: "Tulis kalimat langsung di area di bawah, seperti menulis di kertas",
    },
    kamera: {
        title: "Scan Kamera",
        hint: "Ambil foto langsung menggunakan kamera perangkat",
    },
};

const TIPS = [
    {
        icon: "sun",
        color: "tip-green",
        title: "Pencahayaan terang & merata",
        desc: "Hindari bayangan atau cahaya langsung dari atas",
    },
    {
        icon: "paper",
        color: "tip-coral",
        title: "Letakkan kertas rata di meja",
        desc: "Foto dari atas atau tegak lurus, jangan miring",
    },
    {
        icon: "pencil",
        color: "tip-yellow",
        title: "Tulis 3-5 baris kalimat lengkap",
        desc: "Gunakan pulpen hitam/biru, tinta pekat",
    },
    {
        icon: "focus",
        color: "tip-navy",
        title: "Pastikan tulisan jelas & tidak terpotong",
        desc: "Fokus tajam, tidak buram",
    },
];

const STAR_COUNT = 24;

function SignaturePad({ onChangeHasDrawn }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [tool, setTool] = useState("pen");
    const [lineWidth, setLineWidth] = useState(3);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const setupCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const { clientWidth, clientHeight } = container;
            canvas.width = clientWidth * dpr;
            canvas.height = clientHeight * dpr;
            const ctx = canvas.getContext("2d");
            ctx.scale(dpr, dpr);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctxRef.current = ctx;
        };

        setupCanvas();
        window.addEventListener("resize", setupCanvas);
        return () => window.removeEventListener("resize", setupCanvas);
    }, []);

    function getPos(e) {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function handlePointerDown(e) {
        const ctx = ctxRef.current;
        if (!ctx) return;
        canvasRef.current.setPointerCapture(e.pointerId);
        isDrawingRef.current = true;

        ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
        ctx.strokeStyle = "#26324a";
        ctx.lineWidth = tool === "eraser" ? lineWidth * 4 : lineWidth;

        const { x, y } = getPos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function handlePointerMove(e) {
        if (!isDrawingRef.current) return;
        const ctx = ctxRef.current;
        const { x, y } = getPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
        if (tool === "pen" && !hasDrawn) {
            setHasDrawn(true);
            onChangeHasDrawn?.(true);
        }
    }

    function handlePointerUp() {
        isDrawingRef.current = false;
    }

    function handleClear() {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        setHasDrawn(false);
        onChangeHasDrawn?.(false);
    }

    return (
        <>
            <div
                className={`signature-pad ${isDrawingRef.current ? "active-drawing" : ""}`}
                ref={containerRef}
            >
                <canvas
                    ref={canvasRef}
                    className="signature-canvas"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                />
                {!hasDrawn && (
                    <div className="signature-placeholder">
                        Mulai menulis di sini...
                    </div>
                )}
            </div>

            <div className="signature-toolbar-bar">

                <button
                    type="button"
                    className={`tool-btn ${tool === "pen" ? "active" : ""}`}
                    onClick={() => setTool("pen")}
                    aria-label="Pena"
                    title="Pena"
                >
                    <PencilTabIcon />
                </button>

                <button
                    type="button"
                    className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
                    onClick={() => setTool("eraser")}
                    aria-label="Penghapus goresan"
                    title="Penghapus"
                >
                    <EraserIcon />
                </button>

                <div className="size-slider-wrap">
                    <span className="size-dot size-dot-sm" />
                    <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(Number(e.target.value))}
                        className="size-slider"
                        aria-label="Ukuran goresan"
                    />
                    <span className="size-dot size-dot-lg" />
                </div>

                <span className="color-swatch" aria-hidden="true" />

                <button
                    type="button"
                    className="tool-btn tool-btn-danger"
                    onClick={handleClear}
                    disabled={!hasDrawn}
                    aria-label="Hapus semua coretan"
                    title="Hapus semua"
                >
                    <TrashIcon />
                </button>

            </div>
        </>
    );
}

function CameraView({ onClose, onCapture }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [captured, setCaptured] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                    audio: false,
                });
                if (!active) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
            } catch (err) {
                setError("Tidak bisa mengakses kamera. Periksa izin kamera di browser Anda.");
            }
        }

        startCamera();

        return () => {
            active = false;
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    function handleShutter() {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return;
        const size = Math.min(video.videoWidth, video.videoHeight);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        setCaptured(canvas.toDataURL("image/png"));
    }

    return (
        <div className="camera-card-wrap">
            <div className="camera-card">

                <button type="button" className="camera-close" onClick={onClose} aria-label="Tutup kamera">
                    <XIcon />
                </button>

                {error && (
                    <div className="camera-error">
                        <CameraTabIcon />
                        <p>{error}</p>
                    </div>
                )}

                {!error && !captured && (
                    <video ref={videoRef} className="camera-video" muted playsInline />
                )}

                {captured && (
                    <img src={captured} alt="Hasil scan" className="camera-video" />
                )}

                {!error && (
                    <div className="camera-controls">
                        {!captured ? (
                            <button
                                type="button"
                                className="camera-shutter"
                                onClick={handleShutter}
                                aria-label="Ambil foto"
                            />
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="camera-btn camera-btn-ghost"
                                    onClick={() => setCaptured(null)}
                                >
                                    <RotateIcon />
                                    Ulang
                                </button>
                                <button
                                    type="button"
                                    className="camera-btn camera-btn-solid"
                                    onClick={() => onCapture(captured)}
                                >
                                    <CheckIcon />
                                    Gunakan
                                </button>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function AnalyzePage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("foto");
    const [fileName, setFileName] = useState("");
    const [fileObj, setFileObj] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const fileInputRef = useRef(null);

    function handleFileSelect(file) {
        if (file) {
            setFileName(file.name);
            setFileObj(file);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFileSelect(file);
    }

    function CheckIcon({ size = 26 }) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
            </svg>
        );
    }

    async function handleAnalyze() {
        if (!fileObj) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("school_name", "-");
        formData.append("grade_class", "-");
        formData.append("absence_numbers", "1");
        formData.append("student_names", "Anda");
        formData.append("ages", "0");
        formData.append("genders", "L");
        formData.append("handwriting_images", fileObj);

        try {
            const response = await fetch("http://localhost:8000/analyze-handwriting", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                const result = data.details?.[0];
                if (!result) {
                    alert("Hasil analisis kosong.");
                } else {
                    const image = await fileToDataUrl(fileObj);
                    navigate("/analyze/result", { state: { result, image } });
                }
            } else {
                alert(data.detail || "Gagal memproses analisis.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Tidak bisa terhubung ke server.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="analyze-page">
            {/* Hero */}
            <section className="analyze-hero">
                {/* starfield */}
                {Array.from({ length: STAR_COUNT }, (_, i) => (
                    <span key={i} className={`az-star az-star-${i + 1}`}></span>
                ))}
                {/* extra planets */}
                <span className="az-planet az-planet-4"></span>
                <span className="az-planet az-planet-5"></span>
                <span className="az-planet az-planet-6"></span>
                {/* astronaut */}
                <span className="az-astronaut az-astronaut-1"><AstronautIcon /></span>
                {/* spaceship */}
                <span className="az-spaceship az-spaceship-1"><SpaceshipIcon /></span>
                {/* planets */}
                <span className="az-planet az-planet-1"></span>
                <span className="az-planet az-planet-2"></span>
                <span className="az-planet az-planet-3"></span>
                {/* bintang jatoh*/}
                <span className="az-meteor az-meteor-1">
                    <span className="az-meteor-line"></span>
                </span>
                <span className="az-meteor az-meteor-2">
                    <span className="az-meteor-line"></span>
                </span>
                <span className="az-meteor az-meteor-3">
                    <span className="az-meteor-line"></span>
                </span>
                {/* orbit rings */}
                <span className="hero-ring-a"></span>
                <span className="hero-ring-b"></span>
                <h1>
                    Mulai Analisis Tulisan Tangan dengan bantuan AI
                </h1>
                <p>
                    Ungkap karakteristik kepribadian Anda melalui tulisan tangan, teknologi AI yang canggih untuk insight mendalam.
                </p>
                <div className="hero-flow">
                    <span className="hero-flow-icon">
                        <CloudUploadIcon />
                    </span>
                    <span className="hero-flow-line" />
                    <span
                        className="hero-flow-icon hero-flow-icon-alt hero-flow-icon-pending"
                        style={{ background: "rgba(255, 255, 255, 0.12)", color: "rgba(255, 255, 255, 0.5)", border: "1.5px dashed rgba(255, 255, 255, 0.35)" }}
                    >
                        <CheckIcon size={24} />
                    </span>
                </div>
            </section>

            {/* Layout 2 kolom: input (kiri) + tips (kanan) */}
            <div className="analyze-layout">

                {/* Input card */}
                <section className="analyze-card analyze-card-main">
                    <span className="analyze-card-badge">
                        Input Tulisan Tangan
                    </span>
                    <section className="analyzed-doom">

                        {/* Judul + hint (ikut tab aktif), di ATAS tab bar */}
                        <div className="analyze-panel" key={activeTab}>
                            <h2>{TAB_META[activeTab].title}</h2>
                            <p className="analyze-panel-hint">{TAB_META[activeTab].hint}</p>
                        </div>

                        {/* Tab bar horizontal */}
                        <div className="analyze-tabs">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`analyze-tab ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ---------- Tab: Upload Foto ---------- */}
                        {activeTab === "foto" && (
                            <div className="analyze-panel">
                                <div
                                    className={`dropzone ${isDragging ? "dragging" : ""}`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                >
                                    <span className="dropzone-icon">
                                        <CameraIcon />
                                    </span>
                                    <p className="dropzone-text">
                                        {fileName ? (
                                            <span className="dropzone-filename">{fileName}</span>
                                        ) : (
                                            "Tarik foto atau klik untuk pilih"
                                        )}
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="dropzone-input"
                                        onChange={(e) => handleFileSelect(e.target.files?.[0])}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="analyze-submit"
                                    disabled={!fileName || isLoading}
                                    onClick={handleAnalyze}
                                >
                                    {isLoading ? "Menganalisis..." : "Lanjut ke Hasil Analisis"}
                                </button>
                            </div>
                        )}

                        {/* ---------- Tab: Tulis Manual ---------- */}
                        {activeTab === "manual" && (
                            <div className="analyze-panel">
                                <SignaturePad onChangeHasDrawn={setHasDrawn} />
                                <button type="button" className="analyze-submit" disabled={!hasDrawn}>
                                    Lanjut ke Hasil Analisis
                                </button>
                            </div>
                        )}

                        {/* ---------- Tab: Scan Kamera ---------- */}
                        {activeTab === "kamera" && (
                            <div className="analyze-panel">
                                {!cameraOpen && !capturedPhoto && (
                                    <>
                                        <div className="dropzone dropzone-camera">
                                            <span className="dropzone-icon">
                                                <CameraIcon />
                                            </span>
                                            <p className="dropzone-text">
                                                Aktifkan kamera untuk mulai scan
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="analyze-submit"
                                            onClick={() => setCameraOpen(true)}
                                        >
                                            Buka Kamera
                                        </button>
                                    </>
                                )}
                                {cameraOpen && (
                                    <CameraView
                                        onClose={() => setCameraOpen(false)}
                                        onCapture={(img) => {
                                            setCapturedPhoto(img);
                                            setCameraOpen(false);
                                        }}
                                    />
                                )}
                                {capturedPhoto && !cameraOpen && (
                                    <>
                                        <div className="camera-card-wrap">
                                            <div className="camera-card camera-card-static">
                                                <img src={capturedPhoto} alt="Hasil scan" className="camera-video" />
                                                <button
                                                    type="button"
                                                    className="camera-close"
                                                    onClick={() => setCapturedPhoto(null)}
                                                    aria-label="Hapus foto"
                                                >
                                                    <XIcon />
                                                </button>
                                            </div>
                                        </div>
                                        <button type="button" className="analyze-submit" disabled={!capturedPhoto}>
                                            Lanjut ke Hasil Analisis
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </section>
                </section>

                {/* Sidebar kanan: tips + contoh foto */}
                <div className="analyze-side">

                    {/* Tips hasil akurat */}
                    <aside className="analyze-card">
                        <span className="analyze-card-badge">
                            Tips untuk hasil yang akurat
                        </span>
                        <div className="tip-grid">
                            {TIPS.map((tip) => (
                                <div key={tip.title} className={`tip-box ${tip.color}`}>
                                    <span className="tip-icon">
                                        {tipIcon(tip.icon)}
                                    </span>
                                    <div>
                                        <h3>{tip.title}</h3>
                                        <p>{tip.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Tips foto tulisan tangan */}
                    <aside className="analyze-card">
                        <span className="analyze-card-badge">
                            Tips Tulisan Tangan untuk Analisis Akurat
                        </span>
                        <div className="photo-tip-grid">
                            {PHOTO_TIPS.map((tip) => (
                                <div key={tip.title} className={`photo-tip ${tip.color}`}>
                                    <span className="photo-tip-icon">
                                        {photoTipIcon(tip.icon)}
                                    </span>
                                    <div>
                                        <h3>{tip.title}</h3>
                                        <p>{tip.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                </div>

            </div>
        </main>
    );
}

export default AnalyzePage;