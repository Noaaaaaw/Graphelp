from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from . import auth
from .database import Base, engine
from . import models
from .predict import predict_image
from .predict_motorik import predict_motorik_siswa

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.post("/analyze-handwriting")
async def analyze_handwriting(
    school_name: str = Form(...),
    grade_class: str = Form(...),
    absence_numbers: List[str] = Form(...),
    student_names: List[str] = Form(...),
    ages: List[str] = Form(...),
    genders: List[str] = Form(...),
    handwriting_images: List[UploadFile] = File(...),
):
    details = []
    for i, image in enumerate(handwriting_images):
        result = predict_image(image.file)
        details.append({
            "name": f"No. {absence_numbers[i]} - {student_names[i]}",
            "pred_type": result["pred_type"],
            "confidence": result["confidence"],
            "top3": result["top3"]
        })

    return {
        "total_processed": len(handwriting_images),
        "status": "Sukses",
        "details": details
    }


@app.post("/analyze-students")
async def analyze_students(
    school_name: str = Form(...),
    grade_class: str = Form(...),
    absence_numbers: List[str] = Form(...),
    student_names: List[str] = Form(...),
    ages: List[str] = Form(...),
    genders: List[str] = Form(...),
    handwriting_images: List[UploadFile] = File(...),
):
    details = []
    for i, image in enumerate(handwriting_images):
        file_bytes = await image.read()
        try:
            usia = float(ages[i])
        except (IndexError, ValueError):
            usia = 45.0

        result = predict_motorik_siswa(file_bytes, usia_bulan=usia)
        details.append({
            "absence_number": absence_numbers[i] if i < len(absence_numbers) else str(i + 1),
            "student_name": student_names[i] if i < len(student_names) else f"Siswa {i + 1}",
            "gender": genders[i] if i < len(genders) else "-",
            "age": usia,
            "kesimpulan": result["kesimpulan"],
            "status": result["status"],
            "kategori": result["kategori"],
            "kategori_label": result["kategori_label"],
            "confidence": result["confidence"],
            "alasan_klinis": result["alasan_klinis"],
            "saran_guru": result["saran_guru"],
            "indikator": result["indikator"]
        })

    return {
        "school_name": school_name,
        "grade_class": grade_class,
        "total_processed": len(handwriting_images),
        "status": "Sukses",
        "details": details
    }