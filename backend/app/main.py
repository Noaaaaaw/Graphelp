import os
import json
import uuid
import secrets
from typing import List, Optional
from datetime import datetime, date, timedelta, timezone
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from . import auth, models, schemas
from .database import Base, engine, get_db, SessionLocal
from .predict import predict_image
from .predict_motorik import predict_motorik_siswa

app = FastAPI()

INVITATION_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def generate_unique_invitation_code(db: Session) -> str:
    for _ in range(25):
        suffix = "".join(secrets.choice(INVITATION_ALPHABET) for _ in range(6))
        code = f"GRH-{suffix}"
        exists = db.query(models.Student).filter(models.Student.invitation_code == code).first()
        if not exists:
            return code
    return f"GRH-{uuid.uuid4().hex[:6].upper()}"


def ensure_classroom_schema():
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    needs_recreate = False
    if "classes" in existing_tables:
        class_cols = {c["name"] for c in inspector.get_columns("classes")}
        if "user_id" not in class_cols:
            needs_recreate = True

    if "students" in existing_tables:
        student_cols = {c["name"] for c in inspector.get_columns("students")}
        if not {"class_id", "absence_number", "name", "birth_date", "gender"}.issubset(student_cols):
            needs_recreate = True

    if needs_recreate:
        legacy_tables = [
            "motor_assessments",
            "class_enrollments",
            "class_teachers",
            "parent_students",
            "assessments",
            "students",
            "classes",
        ]
        with engine.begin() as conn:
            for tbl in legacy_tables:
                if tbl in existing_tables:
                    conn.execute(text(f"DROP TABLE IF EXISTS {tbl}"))

    Base.metadata.create_all(bind=engine)

    # Non-destructive column additions for Stage 2 (Tahap A)
    inspector = inspect(engine)
    student_cols = {c["name"] for c in inspector.get_columns("students")}
    assessment_cols = {c["name"] for c in inspector.get_columns("assessments")}

    with engine.begin() as conn:
        if "invitation_code" not in student_cols:
            conn.execute(text("ALTER TABLE students ADD COLUMN invitation_code VARCHAR(20)"))
        if "next_assessment_date" not in student_cols:
            conn.execute(text("ALTER TABLE students ADD COLUMN next_assessment_date DATE"))
        if "assessment_interval_days" not in student_cols:
            conn.execute(text("ALTER TABLE students ADD COLUMN assessment_interval_days INTEGER DEFAULT 30 NOT NULL"))

        if "sequence_number" not in assessment_cols:
            conn.execute(text("ALTER TABLE assessments ADD COLUMN sequence_number INTEGER DEFAULT 1"))
        if "period_label" not in assessment_cols:
            conn.execute(text("ALTER TABLE assessments ADD COLUMN period_label VARCHAR(100)"))
        if "delta_status" not in assessment_cols:
            conn.execute(text("ALTER TABLE assessments ADD COLUMN delta_status VARCHAR(50)"))
        if "teacher_notes" not in assessment_cols:
            conn.execute(text("ALTER TABLE assessments ADD COLUMN teacher_notes TEXT"))

    # Backfill invitation_code & next_assessment_date for any existing rows
    db = SessionLocal()
    try:
        students = db.query(models.Student).all()
        dirty = False
        for st in students:
            if not st.invitation_code:
                st.invitation_code = generate_unique_invitation_code(db)
                dirty = True
            if not st.assessment_interval_days:
                st.assessment_interval_days = 30
                dirty = True

            sorted_asc = sorted(
                st.assessments or [],
                key=lambda a: (a.created_at or datetime.min.replace(tzinfo=timezone.utc), a.id or 0),
            )
            for idx, a in enumerate(sorted_asc, start=1):
                if not a.sequence_number:
                    a.sequence_number = idx
                    dirty = True
                if not a.period_label:
                    dt_str = a.created_at.strftime("%d %b %Y") if a.created_at else ""
                    a.period_label = f"Asesmen Ke-{idx}" + (f" ({dt_str})" if dt_str else "")
                    dirty = True
                if not a.delta_status:
                    a.delta_status = "Asesmen Awal" if idx == 1 else "Stabil"
                    dirty = True

            if sorted_asc and not st.next_assessment_date:
                last_dt = sorted_asc[-1].created_at.date() if sorted_asc[-1].created_at else date.today()
                st.next_assessment_date = last_dt + timedelta(days=st.assessment_interval_days or 30)
                dirty = True

        if dirty:
            db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    try:
        ensure_classroom_schema()
        print("Database tables verified/created successfully.")
    except Exception as e:
        print(f"Warning: Could not connect to database on startup: {e}")
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
app.mount("/graphelp/uploads", StaticFiles(directory=UPLOAD_DIR), name="graphelp_uploads")

app.include_router(auth.router)
app.include_router(auth.router, prefix="/graphelp")


@app.post("/analyze-handwriting")
@app.post("/graphelp/analyze-handwriting")
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
            created_at=datetime.now(timezone.utc)
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

        # Memproses analisis kematangan motorik halus siswa
        try:
            usia_val = float(ages[i]) if i < len(ages) and float(ages[i]) > 0 else 45.0
        except (ValueError, IndexError):
            usia_val = 45.0

        result = predict_motorik_siswa(content, usia_bulan=usia_val)

        image_url = f"/uploads/handwriting/{filename}"

        absence_num = absence_numbers[i] if i < len(absence_numbers) else str(i + 1)
        st_name = student_names[i] if i < len(student_names) else f"Siswa {i + 1}"
        st_age = ages[i] if i < len(ages) else "0"
        st_gender = genders[i] if i < len(genders) else "L"

        is_sesuai = "Ya" in result.get("kesimpulan", "")
        pred_type_val = 1 if is_sesuai else 0
        type_name_val = result.get("kesimpulan", "Sesuai Usia [Ya]" if is_sesuai else "Belum Sesuai [Tidak]")
        confidence_val = float(result.get("confidence", 85.0))
        top3_data = [
            {"type": "Ya", "name": "Sesuai Usia", "prob": confidence_val if is_sesuai else round(100.0 - confidence_val, 1)},
            {"type": "Tidak", "name": "Belum Sesuai", "prob": round(100.0 - confidence_val, 1) if is_sesuai else confidence_val}
        ]
        if session_record:
            student_res = models.StudentAnalysisResult(
                session_id=session_record.id,
                absence_number=absence_num,
                student_name=st_name,
                age=st_age,
                gender=st_gender,
                pred_type=pred_type_val,
                type_name=type_name_val,
                confidence=confidence_val,
                top3=json.dumps(top3_data),
                description=result.get("alasan_klinis", ""),
                image_path=image_url,
                created_at=datetime.now(timezone.utc)
            )
            db.add(student_res)

        details.append({
            "absence_number": absence_num,
            "student_name": st_name,
            "name": f"No. {absence_num} - {st_name}",
            "kesimpulan": result["kesimpulan"],
            "status": result["status"],
            "kategori": result.get("kategori", ""),
            "kategori_label": result.get("kategori_label", ""),
            "confidence": result["confidence"],
            "alasan_klinis": result["alasan_klinis"],
            "saran_guru": result["saran_guru"],
            "indikator": result.get("indikator", {}),
            "indikator_klinis_table": result.get("indikator_klinis_table", []),
            "kesimpulan_menulis": result.get("kesimpulan_menulis", {}),
            "kesimpulan_menggambar": result.get("kesimpulan_menggambar", {}),
            "pred_type": pred_type_val,
            "type_name": type_name_val,
            "description": result.get("alasan_klinis", ""),
            "top3": top3_data,
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


MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}

KATEGORI_LABELS = {
    "BB": "Belum Berkembang",
    "MB": "Mulai Berkembang",
    "BSH": "Berkembang Sesuai Harapan",
    "BSB": "Berkembang Sangat Baik",
}

KATEGORI_SCORES = {
    "BB": 1,
    "MB": 2,
    "BSH": 3,
    "BSB": 4,
}


def compute_reminder_info(student: models.Student, ref_date: Optional[date] = None) -> dict:
    if ref_date is None:
        ref_date = date.today()
    interval = student.assessment_interval_days or 30
    next_dt = student.next_assessment_date
    if not next_dt:
        return {
            "status": "belum_dijadwalkan",
            "label": "Belum Dijadwalkan",
            "next_assessment_date": None,
            "days_remaining": None,
            "interval_days": interval,
        }

    days_remaining = (next_dt - ref_date).days
    next_str = next_dt.isoformat()
    if days_remaining < 0:
        overdue = abs(days_remaining)
        return {
            "status": "jatuh_tempo",
            "label": f"Waktunya Asesmen Ulang (Terlewat {overdue} hari)",
            "next_assessment_date": next_str,
            "days_remaining": days_remaining,
            "interval_days": interval,
        }
    if days_remaining == 0:
        return {
            "status": "jatuh_tempo",
            "label": "Waktunya Asesmen Ulang (Hari Ini)",
            "next_assessment_date": next_str,
            "days_remaining": 0,
            "interval_days": interval,
        }
    if days_remaining <= 7:
        return {
            "status": "segera",
            "label": f"Segera ({days_remaining} hari lagi)",
            "next_assessment_date": next_str,
            "days_remaining": days_remaining,
            "interval_days": interval,
        }
    return {
        "status": "terjadwal",
        "label": f"Terjadwal ({days_remaining} hari lagi)",
        "next_assessment_date": next_str,
        "days_remaining": days_remaining,
        "interval_days": interval,
    }


def compute_delta_status(prev_assessment: Optional[models.Assessment], new_kategori: str, new_confidence: float) -> str:
    if prev_assessment is None:
        return "Asesmen Awal"
    old_score = KATEGORI_SCORES.get(prev_assessment.kategori, 0)
    new_score = KATEGORI_SCORES.get(new_kategori, 0)
    if new_score > old_score:
        return "Meningkat"
    if new_score < old_score:
        return "Menurun"
    prev_conf = float(prev_assessment.confidence or 0.0)
    if new_confidence - prev_conf >= 3.0:
        return "Meningkat"
    if prev_conf - new_confidence >= 3.0:
        return "Menurun"
    return "Stabil"


def extract_indikator_scores(parsed_json: dict, fallback_kat: str = "MB") -> dict:
    fallback_score = KATEGORI_SCORES.get(fallback_kat, 2)
    scores = {
        "kestabilan_goresan": fallback_score,
        "kontrol_tekanan": fallback_score,
        "proporsi_spasial": fallback_score,
        "kontinuitas_garis": fallback_score,
    }
    table = parsed_json.get("indikator_klinis_table") or []
    key_map = [
        ("stabil", "kestabilan_goresan"),
        ("tekanan", "kontrol_tekanan"),
        ("proporsi", "proporsi_spasial"),
        ("spasial", "proporsi_spasial"),
        ("kontinuitas", "kontinuitas_garis"),
    ]
    for idx, row in enumerate(table):
        if not isinstance(row, dict):
            continue
        kat = str(row.get("kategori") or row.get("capaian") or "").strip().upper()
        sc = KATEGORI_SCORES.get(kat)
        if not sc:
            continue
        title = str(row.get("indikator") or row.get("nama") or "").lower()
        matched_key = None
        for substr, target_key in key_map:
            if substr in title:
                matched_key = target_key
                break
        if not matched_key and idx < 4:
            ordered_keys = ["kestabilan_goresan", "kontrol_tekanan", "proporsi_spasial", "kontinuitas_garis"]
            matched_key = ordered_keys[idx]
        if matched_key:
            scores[matched_key] = sc
    return scores


def validate_uploaded_image(image: UploadFile, file_bytes: bytes, label_context: str = "siswa"):
    ext = os.path.splitext(image.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS or (image.content_type and image.content_type.lower() not in ALLOWED_CONTENT_TYPES):
        raise HTTPException(
            status_code=400,
            detail=f"Format berkas '{image.filename}' untuk {label_context} tidak didukung. Harap unggah gambar JPG, JPEG, PNG, atau WEBP."
        )
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail=f"Berkas '{image.filename}' kosong. Harap unggah gambar yang valid."
        )
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran berkas '{image.filename}' untuk {label_context} melebihi batas maksimum 5 MB ({len(file_bytes) / (1024 * 1024):.2f} MB)."
        )
    return ext


def calculate_age_months(birth_date: date, ref_date: Optional[date] = None) -> float:
    if ref_date is None:
        ref_date = date.today()
    if not birth_date or birth_date > ref_date:
        return 0.0
    months = (ref_date.year - birth_date.year) * 12 + (ref_date.month - birth_date.month)
    day_diff = ref_date.day - birth_date.day
    age_in_months = round(months + (day_diff / 30.4375), 1)
    return max(0.0, age_in_months)


def get_owned_class(class_id: int, current_user: models.User, db: Session) -> models.SchoolClass:
    cls = db.query(models.SchoolClass).filter(models.SchoolClass.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Kelas tidak ditemukan.")
    if cls.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Akses ditolak: Kelas ini bukan milik Anda.")
    return cls


def get_owned_student(student_id: int, current_user: models.User, db: Session) -> models.Student:
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    if not student.school_class or student.school_class.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Akses ditolak: Siswa ini tidak berada di kelas milik Anda.")
    return student


def format_student_dict(student: models.Student) -> dict:
    age_months = calculate_age_months(student.birth_date)
    sorted_assessments = sorted(
        student.assessments or [],
        key=lambda a: (a.created_at or datetime.min.replace(tzinfo=timezone.utc), a.id or 0),
        reverse=True,
    )
    total_assessments = len(sorted_assessments)
    last_assessment = None
    if sorted_assessments:
        latest = sorted_assessments[0]
        kat_label = KATEGORI_LABELS.get(latest.kategori, "")
        if latest.result_json:
            try:
                parsed = json.loads(latest.result_json)
                kat_label = parsed.get("kategori_label") or kat_label
            except Exception:
                pass
        tanggal_str = latest.created_at.strftime("%Y-%m-%d %H:%M") if latest.created_at else ""
        seq_num = latest.sequence_number or total_assessments
        period_lbl = latest.period_label or f"Asesmen Ke-{seq_num}"
        delta_st = latest.delta_status or ("Asesmen Awal" if total_assessments == 1 else "Stabil")
        last_assessment = {
            "id": latest.id,
            "kategori": latest.kategori,
            "kategori_label": kat_label,
            "tanggal": tanggal_str,
            "created_at": latest.created_at.isoformat() if latest.created_at else "",
            "confidence": latest.confidence,
            "kesimpulan": latest.kesimpulan,
            "sequence_number": seq_num,
            "period_label": period_lbl,
            "delta_status": delta_st,
        }

    reminder = compute_reminder_info(student)

    return {
        "id": student.id,
        "class_id": student.class_id,
        "absence_number": student.absence_number,
        "name": student.name,
        "gender": student.gender,
        "birth_date": student.birth_date.isoformat() if student.birth_date else "",
        "age_months": age_months,
        "invitation_code": student.invitation_code or "",
        "next_assessment_date": student.next_assessment_date.isoformat() if student.next_assessment_date else None,
        "assessment_interval_days": student.assessment_interval_days or 30,
        "total_assessments": total_assessments,
        "parent_count": len(student.parent_links or []),
        "reminder": reminder,
        "last_assessment": last_assessment,
    }


def format_assessment_history_item(a: models.Assessment, student: models.Student, seq_fallback: int = 1) -> dict:
    parsed = {}
    if a.result_json:
        try:
            parsed = json.loads(a.result_json)
        except Exception:
            parsed = {}

    tanggal_str = a.created_at.strftime("%Y-%m-%d %H:%M") if a.created_at else parsed.get("tanggal", "")
    kategori_label = parsed.get("kategori_label") or KATEGORI_LABELS.get(a.kategori, "")
    seq_num = a.sequence_number or parsed.get("sequence_number") or seq_fallback
    period_lbl = a.period_label or parsed.get("period_label") or f"Asesmen Ke-{seq_num}"
    delta_st = a.delta_status or parsed.get("delta_status") or ("Asesmen Awal" if seq_num == 1 else "Stabil")
    notes_str = a.teacher_notes if a.teacher_notes is not None else parsed.get("teacher_notes", "")

    return {
        "id": a.id,
        "assessment_id": a.id,
        "student_id": student.id,
        "student_name": student.name,
        "absence_number": student.absence_number,
        "gender": student.gender,
        "age_months": a.age_months,
        "age": a.age_months,
        "kategori": a.kategori,
        "kategori_label": kategori_label,
        "kesimpulan": a.kesimpulan,
        "status": a.status,
        "confidence": a.confidence,
        "image_path": a.image_path,
        "image_url": a.image_path,
        "tanggal": tanggal_str,
        "created_at": a.created_at.isoformat() if a.created_at else "",
        "sequence_number": seq_num,
        "period_label": period_lbl,
        "delta_status": delta_st,
        "teacher_notes": notes_str or "",
        "alasan_klinis": parsed.get("alasan_klinis", ""),
        "saran_guru": parsed.get("saran_guru", ""),
        "indikator": parsed.get("indikator", {}),
        "indikator_klinis_table": parsed.get("indikator_klinis_table", []),
        "kesimpulan_menulis": parsed.get("kesimpulan_menulis", {}),
        "kesimpulan_menggambar": parsed.get("kesimpulan_menggambar", {}),
    }


def build_student_progress_payload(student: models.Student) -> dict:
    student_dict = format_student_dict(student)
    cls = student.school_class
    teacher = cls.user if cls else None

    sorted_asc = sorted(
        student.assessments or [],
        key=lambda a: (a.created_at or datetime.min.replace(tzinfo=timezone.utc), a.id or 0),
    )

    progress_series = []
    history_desc = []
    for idx, a in enumerate(sorted_asc, start=1):
        item = format_assessment_history_item(a, student, seq_fallback=idx)
        history_desc.append(item)
        parsed = {}
        if a.result_json:
            try:
                parsed = json.loads(a.result_json)
            except Exception:
                parsed = {}
        ind_scores = extract_indikator_scores(parsed, fallback_kat=a.kategori)
        progress_series.append({
            "assessment_id": a.id,
            "sequence_number": item["sequence_number"],
            "period_label": item["period_label"],
            "tanggal": item["tanggal"],
            "age_months": a.age_months,
            "kategori": a.kategori,
            "kategori_label": item["kategori_label"],
            "kategori_score": KATEGORI_SCORES.get(a.kategori, 2),
            "confidence": a.confidence,
            "delta_status": item["delta_status"],
            "indikator_scores": ind_scores,
        })

    history_desc.reverse()

    first_kat = progress_series[0]["kategori"] if progress_series else None
    latest_kat = progress_series[-1]["kategori"] if progress_series else None
    latest_delta = progress_series[-1]["delta_status"] if progress_series else "Belum Ada Data"

    summary = {
        "total_assessments": len(progress_series),
        "first_kategori": first_kat,
        "latest_kategori": latest_kat,
        "latest_delta_status": latest_delta,
        "next_assessment_date": student_dict["next_assessment_date"],
        "reminder": student_dict["reminder"],
    }

    class_info = {
        "id": cls.id if cls else None,
        "name": cls.name if cls else "",
        "academic_year": cls.academic_year if cls else "",
        "school_name": (teacher.school_name if teacher and teacher.school_name else ""),
        "teacher_name": (teacher.username if teacher else ""),
    }

    return {
        "student": student_dict,
        "class_info": class_info,
        "summary": summary,
        "progress_series": progress_series,
        "assessments": history_desc,
    }


@app.post("/analyze-students")
@app.post("/graphelp/analyze-students")
async def analyze_students(
    school_name: str = Form(...),
    grade_class: str = Form(...),
    absence_numbers: List[str] = Form(...),
    student_names: List[str] = Form(...),
    ages: List[str] = Form(...),
    genders: List[str] = Form(...),
    handwriting_images: List[UploadFile] = File(...),
    current_user: models.User = Depends(auth.require_role("guru")),
):
    if len(handwriting_images) == 0:
        raise HTTPException(status_code=400, detail="Minimal unggah 1 berkas lembar kerja siswa.")

    details = []
    for i, image in enumerate(handwriting_images):
        st_name = student_names[i] if i < len(student_names) else f"Siswa {i + 1}"

        try:
            raw_age = ages[i] if i < len(ages) else ""
            usia = float(raw_age)
        except (IndexError, ValueError, TypeError):
            raise HTTPException(
                status_code=400,
                detail=f"Usia siswa nomor {i + 1} ('{st_name}') harus berupa angka dalam satuan bulan."
            )

        if usia < 24 or usia > 96:
            raise HTTPException(
                status_code=400,
                detail=f"Usia siswa nomor {i + 1} ('{st_name}') harus berada dalam rentang 24 hingga 96 bulan (diberikan: {usia})."
            )

        file_bytes = await image.read()
        validate_uploaded_image(image, file_bytes, f"siswa '{st_name}'")

        result = predict_motorik_siswa(file_bytes, usia_bulan=usia)
        details.append({
            "absence_number": absence_numbers[i] if i < len(absence_numbers) else str(i + 1),
            "student_name": st_name,
            "gender": genders[i] if i < len(genders) else "-",
            "age": usia,
            "kesimpulan": result["kesimpulan"],
            "status": result["status"],
            "kategori": result["kategori"],
            "kategori_label": result["kategori_label"],
            "confidence": result["confidence"],
            "alasan_klinis": result["alasan_klinis"],
            "saran_guru": result["saran_guru"],
            "indikator": result["indikator"],
            "indikator_klinis_table": result.get("indikator_klinis_table", []),
            "kesimpulan_menulis": result.get("kesimpulan_menulis", {}),
            "kesimpulan_menggambar": result.get("kesimpulan_menggambar", {}),
        })

    return {
        "school_name": school_name,
        "grade_class": grade_class,
        "total_processed": len(handwriting_images),
        "status": "Sukses",
        "details": details
    }


@app.get("/analysis-history")
@app.get("/graphelp/analysis-history")
def get_analysis_history(
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db)
):
    sessions = (
        db.query(models.AnalysisSession)
        .filter(models.AnalysisSession.user_id == current_user.id)
        .order_by(models.AnalysisSession.created_at.desc())
        .all()
    )

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
@app.get("/graphelp/analysis-history/{session_id}")
def get_analysis_history_detail(
    session_id: int,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db)
):
    session_record = db.query(models.AnalysisSession).filter(models.AnalysisSession.id == session_id).first()
    if not session_record:
        raise HTTPException(status_code=404, detail="Sesi analisis tidak ditemukan.")

    if session_record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Akses ditolak: Sesi analisis ini bukan milik Anda.")
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


# ==========================================
# ENDPOINT MANAJEMEN KELAS (Role: guru)
# ==========================================

def count_due_students(students: List[models.Student]) -> int:
    cnt = 0
    for st in students or []:
        rem = compute_reminder_info(st)
        if rem["status"] in ("jatuh_tempo", "segera"):
            cnt += 1
    return cnt


@app.get("/classes", response_model=List[schemas.ClassResponse])
@app.get("/graphelp/classes", response_model=List[schemas.ClassResponse])
def list_classes(
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    classes = (
        db.query(models.SchoolClass)
        .filter(models.SchoolClass.user_id == current_user.id)
        .order_by(models.SchoolClass.created_at.desc(), models.SchoolClass.id.desc())
        .all()
    )
    return [
        {
            "id": c.id,
            "user_id": c.user_id,
            "name": c.name,
            "academic_year": c.academic_year,
            "school_name": current_user.school_name or "",
            "student_count": len(c.students or []),
            "due_assessment_count": count_due_students(c.students or []),
            "created_at": c.created_at.isoformat() if c.created_at else "",
        }
        for c in classes
    ]


@app.post("/classes", response_model=schemas.ClassResponse)
@app.post("/graphelp/classes", response_model=schemas.ClassResponse)
def create_class(
    data: schemas.ClassCreate,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    new_cls = models.SchoolClass(
        user_id=current_user.id,
        name=data.name,
        academic_year=data.academic_year,
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_cls)
    db.commit()
    db.refresh(new_cls)

    return {
        "id": new_cls.id,
        "user_id": new_cls.user_id,
        "name": new_cls.name,
        "academic_year": new_cls.academic_year,
        "school_name": current_user.school_name or "",
        "student_count": 0,
        "due_assessment_count": 0,
        "created_at": new_cls.created_at.isoformat() if new_cls.created_at else "",
    }


@app.put("/classes/{class_id}", response_model=schemas.ClassResponse)
@app.put("/graphelp/classes/{class_id}", response_model=schemas.ClassResponse)
def update_class(
    class_id: int,
    data: schemas.ClassUpdate,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    cls = get_owned_class(class_id, current_user, db)
    cls.name = data.name
    cls.academic_year = data.academic_year
    db.commit()
    db.refresh(cls)

    return {
        "id": cls.id,
        "user_id": cls.user_id,
        "name": cls.name,
        "academic_year": cls.academic_year,
        "school_name": current_user.school_name or "",
        "student_count": len(cls.students or []),
        "due_assessment_count": count_due_students(cls.students or []),
        "created_at": cls.created_at.isoformat() if cls.created_at else "",
    }


@app.delete("/classes/{class_id}")
@app.delete("/graphelp/classes/{class_id}")
def delete_class(
    class_id: int,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    cls = get_owned_class(class_id, current_user, db)
    db.delete(cls)
    db.commit()
    return {"message": "Kelas beserta seluruh data siswa dan asesmennya berhasil dihapus."}


# ==========================================
# ENDPOINT MANAJEMEN SISWA (Role: guru)
# ==========================================

@app.get("/classes/{class_id}/students", response_model=schemas.ClassStudentsResponse)
@app.get("/graphelp/classes/{class_id}/students", response_model=schemas.ClassStudentsResponse)
def list_class_students(
    class_id: int,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    cls = get_owned_class(class_id, current_user, db)
    dirty = False
    for st in cls.students or []:
        if not st.invitation_code:
            st.invitation_code = generate_unique_invitation_code(db)
            dirty = True
    if dirty:
        db.commit()

    sorted_students = sorted(
        cls.students or [],
        key=lambda s: (s.absence_number if s.absence_number is not None else 999999, (s.name or "").lower()),
    )
    student_items = [format_student_dict(st) for st in sorted_students]

    return {
        "id": cls.id,
        "name": cls.name,
        "academic_year": cls.academic_year,
        "school_name": current_user.school_name or "",
        "student_count": len(student_items),
        "due_assessment_count": count_due_students(cls.students or []),
        "students": student_items,
    }


@app.post("/classes/{class_id}/students", response_model=schemas.StudentItemResponse)
@app.post("/graphelp/classes/{class_id}/students", response_model=schemas.StudentItemResponse)
def create_student(
    class_id: int,
    data: schemas.StudentCreate,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    cls = get_owned_class(class_id, current_user, db)
    inv_code = generate_unique_invitation_code(db)
    new_student = models.Student(
        class_id=cls.id,
        absence_number=data.absence_number,
        name=data.name,
        birth_date=data.birth_date,
        gender=data.gender,
        invitation_code=inv_code,
        assessment_interval_days=30,
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return format_student_dict(new_student)


@app.put("/students/{student_id}", response_model=schemas.StudentItemResponse)
@app.put("/graphelp/students/{student_id}", response_model=schemas.StudentItemResponse)
def update_student(
    student_id: int,
    data: schemas.StudentUpdate,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    student = get_owned_student(student_id, current_user, db)
    student.name = data.name
    student.absence_number = data.absence_number
    student.birth_date = data.birth_date
    student.gender = data.gender
    if not student.invitation_code:
        student.invitation_code = generate_unique_invitation_code(db)
    db.commit()
    db.refresh(student)

    return format_student_dict(student)


@app.delete("/students/{student_id}")
@app.delete("/graphelp/students/{student_id}")
def delete_student(
    student_id: int,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    student = get_owned_student(student_id, current_user, db)
    db.delete(student)
    db.commit()
    return {"message": "Data siswa beserta riwayat asesmennya berhasil dihapus."}


@app.put("/students/{student_id}/schedule", response_model=schemas.StudentItemResponse)
@app.put("/graphelp/students/{student_id}/schedule", response_model=schemas.StudentItemResponse)
def update_student_schedule(
    student_id: int,
    data: schemas.StudentScheduleUpdate,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    student = get_owned_student(student_id, current_user, db)
    student.next_assessment_date = data.next_assessment_date
    if data.assessment_interval_days:
        student.assessment_interval_days = data.assessment_interval_days
    db.commit()
    db.refresh(student)
    return format_student_dict(student)


@app.get("/students/{student_id}/progress", response_model=schemas.StudentProgressResponse)
@app.get("/graphelp/students/{student_id}/progress", response_model=schemas.StudentProgressResponse)
def get_student_progress(
    student_id: int,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    student = get_owned_student(student_id, current_user, db)
    if not student.invitation_code:
        student.invitation_code = generate_unique_invitation_code(db)
        db.commit()
        db.refresh(student)
    return build_student_progress_payload(student)


@app.get("/reminders")
@app.get("/graphelp/reminders")
def get_teacher_reminders(
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    classes = (
        db.query(models.SchoolClass)
        .filter(models.SchoolClass.user_id == current_user.id)
        .order_by(models.SchoolClass.created_at.desc(), models.SchoolClass.id.desc())
        .all()
    )
    due_items = []
    jatuh_tempo_count = 0
    segera_count = 0

    for cls in classes:
        for st in cls.students or []:
            st_dict = format_student_dict(st)
            rem = st_dict["reminder"]
            if rem["status"] in ("jatuh_tempo", "segera"):
                if rem["status"] == "jatuh_tempo":
                    jatuh_tempo_count += 1
                else:
                    segera_count += 1
                due_items.append({
                    "class_id": cls.id,
                    "class_name": cls.name,
                    "academic_year": cls.academic_year,
                    "student": st_dict,
                })

    due_items.sort(key=lambda x: (x["student"]["reminder"]["days_remaining"] if x["student"]["reminder"]["days_remaining"] is not None else 999999))

    return {
        "jatuh_tempo_count": jatuh_tempo_count,
        "segera_count": segera_count,
        "total_perlu_perhatian": jatuh_tempo_count + segera_count,
        "items": due_items,
    }


# ==========================================
# ENDPOINT ASESMEN MOTORIK SISWA (Role: guru)
# ==========================================

@app.post("/students/{student_id}/assessments")
@app.post("/graphelp/students/{student_id}/assessments")
async def create_student_assessment(
    student_id: int,
    image: UploadFile = File(...),
    teacher_notes: Optional[str] = Form(None),
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    student = get_owned_student(student_id, current_user, db)

    file_bytes = await image.read()
    ext = validate_uploaded_image(image, file_bytes, f"siswa '{student.name}'")

    usia = calculate_age_months(student.birth_date)
    if usia < 24 or usia > 96:
        raise HTTPException(
            status_code=400,
            detail=f"Usia siswa '{student.name}' saat ini ({usia} bulan) berada di luar rentang standar asesmen motorik halus PAUD (24 hingga 96 bulan)."
        )

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(HANDWRITING_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(file_bytes)

    image_url = f"/uploads/handwriting/{filename}"
    result = predict_motorik_siswa(file_bytes, usia_bulan=usia)

    now_utc = datetime.now(timezone.utc)
    tanggal_str = now_utc.strftime("%Y-%m-%d %H:%M")

    # Hitung urutan asesmen berkala & status perkembangan dibanding asesmen sebelumnya
    existing_asc = sorted(
        student.assessments or [],
        key=lambda a: (a.created_at or datetime.min.replace(tzinfo=timezone.utc), a.id or 0),
    )
    seq_number = len(existing_asc) + 1
    prev_assessment = existing_asc[-1] if existing_asc else None
    delta_status = compute_delta_status(prev_assessment, result["kategori"], float(result["confidence"]))
    period_label = f"Asesmen Ke-{seq_number} ({now_utc.strftime('%d %b %Y')})"
    clean_notes = (teacher_notes or "").strip()

    # Jadwalkan pengingat asesmen berikutnya otomatis (+30 hari atau sesuai interval siswa)
    interval_days = student.assessment_interval_days or 30
    next_date = date.today() + timedelta(days=interval_days)
    student.next_assessment_date = next_date
    if not student.invitation_code:
        student.invitation_code = generate_unique_invitation_code(db)

    full_payload = {
        "student_id": student.id,
        "student_name": student.name,
        "absence_number": student.absence_number,
        "gender": student.gender,
        "age_months": usia,
        "age": usia,
        "sequence_number": seq_number,
        "period_label": period_label,
        "delta_status": delta_status,
        "teacher_notes": clean_notes,
        "next_assessment_date": next_date.isoformat(),
        "kesimpulan": result["kesimpulan"],
        "status": result["status"],
        "kategori": result["kategori"],
        "kategori_label": result["kategori_label"],
        "confidence": result["confidence"],
        "alasan_klinis": result["alasan_klinis"],
        "saran_guru": result["saran_guru"],
        "indikator": result["indikator"],
        "indikator_klinis_table": result.get("indikator_klinis_table", []),
        "kesimpulan_menulis": result.get("kesimpulan_menulis", {}),
        "kesimpulan_menggambar": result.get("kesimpulan_menggambar", {}),
        "image_url": image_url,
        "tanggal": tanggal_str,
        "created_at": now_utc.isoformat(),
    }

    assessment = models.Assessment(
        student_id=student.id,
        age_months=usia,
        kategori=result["kategori"],
        kesimpulan=result["kesimpulan"],
        status=result["status"],
        confidence=float(result["confidence"]),
        image_path=image_url,
        result_json=json.dumps(full_payload, ensure_ascii=False),
        sequence_number=seq_number,
        period_label=period_label,
        delta_status=delta_status,
        teacher_notes=clean_notes,
        created_at=now_utc,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    full_payload["assessment_id"] = assessment.id
    full_payload["id"] = assessment.id
    assessment.result_json = json.dumps(full_payload, ensure_ascii=False)
    db.commit()

    return full_payload


@app.get("/students/{student_id}/assessments", response_model=List[schemas.AssessmentHistoryItemResponse])
@app.get("/graphelp/students/{student_id}/assessments", response_model=List[schemas.AssessmentHistoryItemResponse])
def list_student_assessments(
    student_id: int,
    current_user: models.User = Depends(auth.require_role("guru")),
    db: Session = Depends(get_db),
):
    student = get_owned_student(student_id, current_user, db)
    sorted_asc = sorted(
        student.assessments or [],
        key=lambda a: (a.created_at or datetime.min.replace(tzinfo=timezone.utc), a.id or 0),
    )
    items = [
        format_assessment_history_item(a, student, seq_fallback=idx)
        for idx, a in enumerate(sorted_asc, start=1)
    ]
    items.reverse()
    return items


# ==========================================
# ENDPOINT AKUN UMUM / ORANG TUA (Klaim & Pantau Multi-Anak)
# ==========================================

def format_parent_child_link(link: models.ParentStudent) -> dict:
    st = link.student
    cls = st.school_class if st else None
    teacher = cls.user if cls else None
    return {
        "link_id": link.id,
        "relationship_label": link.relationship_label or "Orang Tua",
        "linked_at": link.created_at.isoformat() if link.created_at else "",
        "class_id": cls.id if cls else 0,
        "class_name": cls.name if cls else "",
        "academic_year": cls.academic_year if cls else "",
        "school_name": (teacher.school_name if teacher and teacher.school_name else ""),
        "teacher_name": (teacher.username if teacher else ""),
        "student": format_student_dict(st),
    }


@app.post("/parent/children/claim", response_model=schemas.ParentChildItemResponse)
@app.post("/graphelp/parent/children/claim", response_model=schemas.ParentChildItemResponse)
def claim_student_by_code(
    data: schemas.ClaimChildRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    code = data.invitation_code.strip().upper()
    student = db.query(models.Student).filter(models.Student.invitation_code == code).first()
    if not student:
        raise HTTPException(
            status_code=404,
            detail="Kode anak tidak ditemukan. Pastikan kode unik yang dimasukkan sesuai dengan kode dari guru."
        )

    existing_link = (
        db.query(models.ParentStudent)
        .filter(
            models.ParentStudent.parent_id == current_user.id,
            models.ParentStudent.student_id == student.id,
        )
        .first()
    )
    if existing_link:
        raise HTTPException(
            status_code=400,
            detail=f"Data siswa '{student.name}' sudah terhubung dengan akun Anda."
        )

    new_link = models.ParentStudent(
        parent_id=current_user.id,
        student_id=student.id,
        relationship_label=data.relationship_label or "Orang Tua",
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_link)
    db.commit()
    db.refresh(new_link)

    return format_parent_child_link(new_link)


@app.get("/parent/children", response_model=List[schemas.ParentChildItemResponse])
@app.get("/graphelp/parent/children", response_model=List[schemas.ParentChildItemResponse])
def list_parent_children(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    links = (
        db.query(models.ParentStudent)
        .filter(models.ParentStudent.parent_id == current_user.id)
        .order_by(models.ParentStudent.created_at.desc(), models.ParentStudent.id.desc())
        .all()
    )
    return [format_parent_child_link(lnk) for lnk in links if lnk.student is not None]


@app.get("/parent/children/{student_id}/progress", response_model=schemas.StudentProgressResponse)
@app.get("/graphelp/parent/children/{student_id}/progress", response_model=schemas.StudentProgressResponse)
def get_parent_child_progress(
    student_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Data siswa tidak ditemukan.")

    link = (
        db.query(models.ParentStudent)
        .filter(
            models.ParentStudent.parent_id == current_user.id,
            models.ParentStudent.student_id == student.id,
        )
        .first()
    )
    if not link:
        raise HTTPException(
            status_code=403,
            detail="Akses ditolak: Siswa ini belum terhubung ke akun Anda. Silakan masukkan Kode Anak terlebih dahulu."
        )

    return build_student_progress_payload(student)


@app.delete("/parent/children/{student_id}")
@app.delete("/graphelp/parent/children/{student_id}")
def unlink_parent_child(
    student_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    link = (
        db.query(models.ParentStudent)
        .filter(
            models.ParentStudent.parent_id == current_user.id,
            models.ParentStudent.student_id == student_id,
        )
        .first()
    )
    if not link:
        raise HTTPException(status_code=404, detail="Tautan data anak tidak ditemukan pada akun Anda.")

    db.delete(link)
    db.commit()
    return {"message": "Data anak berhasil dilepas dari daftar pantauan akun Anda."}


# ==========================================
# Frontend React SPA Static Serving
# ==========================================
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.isdir(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/graphelp/assets", StaticFiles(directory=assets_dir), name="graphelp_assets")
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/graphelp/{full_path:path}")
    async def serve_graphelp_spa(full_path: str):
        target = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(target):
            return FileResponse(target)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend build not found"}

    @app.get("/{full_path:path}")
    async def serve_root_spa(full_path: str):
        target = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(target):
            return FileResponse(target)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend build not found"}

    @app.get("/graphelp")
    @app.get("/graphelp/")
    @app.get("/")
    async def serve_root_index():
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        return {"message": "Graphelp API is running"}
