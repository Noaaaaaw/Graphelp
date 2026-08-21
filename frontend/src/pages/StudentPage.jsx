import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const schoolName = user.school_name || "Sekolah Tidak Ditemukan";
    const [gradeClass, setGradeClass] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    // Dynamic Student Input (Nama + File Gambar Tulisan Tangan)
    const [students, setStudents] = useState([
        { id: 1, name: "", imageFile: null, previewUrl: "" }
    ]);

    useEffect(() => {
        if (!user || user.role !== "guru") {
            alert("Akses Ditolak! Halaman ini hanya untuk Guru.");
            navigate("/");
        }
    }, [user, navigate]);

    // Opsi Tambah & Hapus Siswa
    const handleAddStudent = () => {
        setStudents([...students, { id: Date.now(), name: "", imageFile: null, previewUrl: "" }]);
    };

    const handleRemoveStudent = (id) => {
        if (students.length === 1) {
            alert("Minimal harus ada 1 siswa!");
            return;
        }
        setStudents(students.filter((s) => s.id !== id));
    };

    // Update Nama / File Gambar
    const handleStudentChange = (id, field, value) => {
        setStudents(
            students.map((s) => {
                if (s.id === id) {
                    if (field === "imageFile") {
                        const file = value;
                        const previewUrl = file ? URL.createObjectURL(file) : "";
                        return { ...s, imageFile: file, previewUrl };
                    }
                    return { ...s, [field]: value };
                }
                return s;
            })
        );
    };

    // Kirim Data Gambar ke Backend untuk Diimpor / Dianalisis
    const handleAnalyze = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("school_name", schoolName);
        formData.append("grade_class", gradeClass);

        // Bungkus data siswa dan filenya
        students.forEach((student, index) => {
            formData.append(`student_names`, student.name);
            if (student.imageFile) {
                formData.append(`handwriting_images`, student.imageFile);
            }
        });

        try {
            // Sesuaikan endpoint API backend untuk analisis tulisan tangan
            const response = await fetch("http://localhost:8000/analyze-handwriting", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setAnalysisResult(data);
            } else {
                alert(data.detail || "Gagal memproses analisis tulisan tangan.");
            }
        } catch (error) {
            console.error("Error analyzing handwriting:", error);
            // Contoh Fallback Tampilan Sementara
            setAnalysisResult({
                total_processed: students.length,
                status: "Sukses (Demo Client)",
                details: students.map(s => ({ name: s.name, status: s.imageFile ? "Gambar Terdeteksi" : "Tanpa Gambar" }))
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px 20px", color: "#fff", maxWidth: "850px", margin: "0 auto" }}>
            <h1>Analisis Tulisan Tangan Siswa</h1>
            <p style={{ color: "#aaa" }}>Unggah sampel tulisan tangan siswa per kelas untuk dilakukan analisis visual.</p>

            <form onSubmit={handleAnalyze} style={{ marginTop: "20px", background: "#1a1a1a", padding: "20px", borderRadius: "8px" }}>
                {/* Meta Data Kelas */}
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "14px" }}>Nama Sekolah</label>
                        <input
                            type="text"
                            value={schoolName}
                            disabled
                            style={{ width: "100%", padding: "10px", marginTop: "5px", background: "#2a2a2a", color: "#00ffcc", border: "1px solid #444", borderRadius: "4px", fontWeight: "bold" }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "14px" }}>Kelas</label>
                        <input
                            type="text"
                            placeholder=" "
                            value={gradeClass}
                            onChange={(e) => setGradeClass(e.target.value)}
                            required
                            style={{ width: "100%", padding: "10px", marginTop: "5px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px" }}
                        />
                    </div>
                </div>

                <h3>Daftar Siswa ({students.length} Orang)</h3>

                {/* List Siswa + File Upload */}
                {students.map((student, index) => (
                    <div key={student.id} style={{ background: "#252525", padding: "15px", borderRadius: "6px", marginBottom: "15px" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ color: "#aaa", fontWeight: "bold" }}>#{index + 1}</span>
                            <input
                                type="text"
                                placeholder="Nama Siswa"
                                value={student.name}
                                onChange={(e) => handleStudentChange(student.id, "name", e.target.value)}
                                required
                                style={{ flex: 2, padding: "8px", background: "#1a1a1a", color: "#fff", border: "1px solid #444", borderRadius: "4px" }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveStudent(student.id)}
                                style={{ padding: "8px 12px", background: "#ff4d4d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                            >
                                Hapus
                            </button>
                        </div>

                        {/* Input Gambar Tulisan Tangan */}
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleStudentChange(student.id, "imageFile", e.target.files[0])}
                                required
                                style={{ color: "#aaa", fontSize: "14px" }}
                            />
                            {student.previewUrl && (
                                <img
                                    src={student.previewUrl}
                                    alt="Preview"
                                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", border: "1px solid #00ffcc" }}
                                />
                            )}
                        </div>
                    </div>
                ))}

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button
                        type="button"
                        onClick={handleAddStudent}
                        style={{ padding: "10px 15px", background: "#008cba", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        + Tambah Siswa
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ padding: "10px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        {isLoading ? "Menganalisis..." : "Proses Analisis Tulisan Tangan"}
                    </button>
                </div>
            </form>

            {/* Panel Hasil Analisis */}
            {analysisResult && (
                <div style={{ marginTop: "30px", background: "#222", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #00ffcc" }}>
                    <h2>Hasil Analisis Tulisan Tangan Kelas {gradeClass}</h2>
                    <p style={{ color: "#aaa" }}>Sekolah: {schoolName}</p>
                    <p style={{ color: "#00ffcc" }}>Total Gambar Diproses: {analysisResult.total_processed} Siswa</p>
                    <hr style={{ borderColor: "#444", margin: "15px 0" }} />
                    
                    <div>
                        {analysisResult.details?.map((res, idx) => (
                            <div key={idx} style={{ padding: "8px 0", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between" }}>
                                <span>{res.name}</span>
                                <span style={{ color: "#00ffcc" }}>{res.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentPage;