import { useEffect, useRef, useState } from "react";

function CloudUploadIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 16l-4-4-4 4" />
            <path d="M12 12v9" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
    );
}

function ClipboardCheckIcon() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="12" height="16" rx="2" />
            <path d="M9 4h6v2H9z" />
            <path d="m9.5 13 2 2 3-3.5" />
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

const TABS = [
    { id: "foto", label: "Upload Foto", icon: <UploadTabIcon /> },
    { id: "manual", label: "Tulis Manual", icon: <PencilTabIcon /> },
    { id: "kamera", label: "Scan Kamera", icon: <CameraTabIcon /> },
];

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

/* ---- Signature / scribble pad for the "Tulis Manual" tab ---- */
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

/* ---- Square camera card for the "Scan Kamera" tab ---- */
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

function AnalyzePage() {
    const [activeTab, setActiveTab] = useState("foto");
    const [fileName, setFileName] = useState("");
    const [fileObj, setFileObj] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
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
            setAnalysisResult(data.details?.[0] || null);
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

                <span className="hero-deco hero-deco-1"><PencilTabIcon /></span>
                <span className="hero-deco hero-deco-2"><UploadTabIcon /></span>
                <span className="hero-deco hero-deco-3"><CameraTabIcon /></span>
                <span className="hero-deco hero-deco-4"><PencilTabIcon /></span>
                <span className="hero-deco hero-deco-5"><UploadTabIcon /></span>
                <span className="hero-deco hero-deco-6"><CameraTabIcon /></span>
                <span className="hero-blob-a"></span>
                <span className="hero-blob-b"></span>
                <span className="hero-blob-c"></span>
                <span className="hero-ring-a"></span>
                <span className="hero-ring-b"></span>
                <span className="hero-spark hero-spark-1"></span>
                <span className="hero-spark hero-spark-2"></span>
                <span className="hero-spark hero-spark-3"></span>
                <span className="hero-spark hero-spark-4"></span>
                <span className="hero-spark hero-spark-5"></span>
                <span className="hero-spark hero-spark-6"></span>

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

                    <span className="hero-flow-icon hero-flow-icon-alt">
                        <ClipboardCheckIcon />
                    </span>

                </div>

            </section>

            {/* Input card */}
            <section className="analyze-card">

                <span className="analyze-card-badge">
                    Input Tulisan Tangan
                </span>

                <section className="analyzed-doom">

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

                {activeTab === "foto" && (

                    <div className="analyze-panel">
                        {analysisResult && (
                            <div className="student-result-item" style={{ marginTop: "1.5rem" }}>
                                <div className="student-result-header">
                                    <span>Tipe {analysisResult.pred_type}: {analysisResult.type_name}</span>
                                    <span className="student-result-status">{analysisResult.confidence}%</span>
                                </div>
                                <p className="student-result-desc">{analysisResult.description}</p>
                                <div className="student-result-top3">
                                    {analysisResult.top3?.map((t, i) => (
                                        <span key={i} className="student-result-badge">
                                            #{i + 1} Tipe {t.type} - {t.name} ({t.prob.toFixed(1)}%)
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <h2>
                            Upload Foto Tulisan
                        </h2>

                        <p className="analyze-panel-hint">
                            Foto Tulisan dengan Jelas
                        </p>

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

                        <button type="button" className="analyze-submit" disabled={!fileName || isLoading} onClick={handleAnalyze}>
                            {isLoading ? "Menganalisis..." : "🚀 Lanjut ke Hasil Analisis"}
                        </button>

                    </div>
                )}

                {activeTab === "manual" && (

                    <div className="analyze-panel">

                        <h2>
                            Tulis Manual di Layar
                        </h2>

                        <p className="analyze-panel-hint">
                            Tulis kalimat langsung di area di bawah, seperti menulis di kertas
                        </p>

                        <SignaturePad onChangeHasDrawn={setHasDrawn} />

                        <button type="button" className="analyze-submit" disabled={!hasDrawn}>
                            🚀 Lanjut ke Hasil Analisis
                        </button>

                    </div>
                )}

                {activeTab === "kamera" && (

                    <div className="analyze-panel">

                        <h2>
                            Scan Kamera
                        </h2>

                        <p className="analyze-panel-hint">
                            Ambil foto langsung menggunakan kamera perangkat
                        </p>

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
                                    📷 Buka Kamera
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
                                    🚀 Lanjut ke Hasil Analisis
                                </button>
                            </>
                        )}

                    </div>
                )}
                </section>
            </section>

            {/* Tips */}
            <section className="analyze-card">

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
                                <h3>
                                    {tip.title}
                                </h3>
                                <p>
                                    {tip.desc}
                                </p>
                            </div>

                        </div>
                    ))}

                </div>

            </section>

        </main>
    );
}

export default AnalyzePage;