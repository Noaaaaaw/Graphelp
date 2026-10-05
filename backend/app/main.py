import os
import json
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from . import auth, models, schemas
from .database import Base, engine, get_db
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

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
HANDWRITING_DIR = os.path.join(UPLOAD_DIR, "handwriting")
os.makedirs(HANDWRITING_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

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
    user_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
):
    session_record = None
    if user_id:
        session_record = models.AnalysisSession(
            user_id=user_id,
            school_name=school_name,
            grade_class=grade_class,
            total_students=len(handwriting_images),
            created_at=datetime.utcnow()
        )
        db.add(session_record)
        db.commit()
        db.refresh(session_record)

    details = []
    for i, image in enumerate(handwriting_images):
        ext = os.path.splitext(image.filename)[1] or ".png"
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(HANDWRITING_DIR, filename)

        content = await image.read()
        with open(filepath, "wb") as f:
            f.write(content)

        with open(filepath, "rb") as f:
            result = predict_image(f)

        image_url = f"/uploads/handwriting/{filename}"

        absence_num = absence_numbers[i] if i < len(absence_numbers) else str(i + 1)
        st_name = student_names[i] if i < len(student_names) else f"Siswa {i + 1}"
        st_age = ages[i] if i < len(ages) else "0"
        st_gender = genders[i] if i < len(genders) else "L"

        if session_record:
            student_res = models.StudentAnalysisResult(
                session_id=session_record.id,
                absence_number=absence_num,
                student_name=st_name,
                age=st_age,
                gender=st_gender,
                pred_type=result["pred_type"],
                type_name=result["type_name"],
                confidence=result["confidence"],
                top3=json.dumps(result["top3"]),
                description=result["description"],
                image_path=image_url,
                created_at=datetime.utcnow()
            )
            db.add(student_res)

        details.append({
            "absence_number": absence_num,
            "student_name": st_name,
            "name": f"No. {absence_num} - {st_name}",
            "pred_type": result["pred_type"],
            "type_name": result["type_name"],
            "confidence": result["confidence"],
            "description": result["description"],
            "top3": result["top3"],
            "image_url": image_url
        })

    if session_record:
        db.commit()

    return {
        "session_id": session_record.id if session_record else None,
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


@app.get("/analysis-history")
def get_analysis_history(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.AnalysisSession)
    if user_id:
        query = query.filter(models.AnalysisSession.user_id == user_id)

    sessions = query.order_by(models.AnalysisSession.created_at.desc()).all()

    result = []
    for s in sessions:
        result.append({
            "id": s.id,
            "user_id": s.user_id,
            "school_name": s.school_name,
            "grade_class": s.grade_class,
            "total_students": s.total_students,
            "created_at": s.created_at.isoformat() if s.created_at else "",
            "date": s.created_at.strftime("%Y-%m-%d %H:%M") if s.created_at else "",
            "status": "Selesai"
        })
    return result


@app.get("/analysis-history/{session_id}")
def get_analysis_history_detail(session_id: int, db: Session = Depends(get_db)):
    session_record = db.query(models.AnalysisSession).filter(models.AnalysisSession.id == session_id).first()
    if not session_record:
        raise HTTPException(status_code=404, detail="Sesi analisis tidak ditemukan.")

    students = []
    for st in session_record.student_results:
        top3_parsed = []
        if st.top3:
            try:
                top3_parsed = json.loads(st.top3)
            except Exception:
                top3_parsed = []

        students.append({
            "id": st.id,
            "absence_number": st.absence_number,
            "student_name": st.student_name,
            "age": st.age,
            "gender": st.gender,
            "pred_type": st.pred_type,
            "type_name": st.type_name,
            "confidence": st.confidence,
            "top3": top3_parsed,
            "description": st.description,
            "image_path": st.image_path,
            "created_at": st.created_at.isoformat() if st.created_at else ""
        })

    return {
        "id": session_record.id,
        "user_id": session_record.user_id,
        "school_name": session_record.school_name,
        "grade_class": session_record.grade_class,
        "total_students": session_record.total_students,
        "created_at": session_record.created_at.isoformat() if session_record.created_at else "",
        "date": session_record.created_at.strftime("%Y-%m-%d %H:%M") if session_record.created_at else "",
        "students": students
    }