from datetime import date
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "public"
    school_name: Optional[str] = None
    school_email: Optional[str] = None
    bukti_path: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True


class OTPRequest(BaseModel):
    email: EmailStr


class OTPVerify(BaseModel):
    email: EmailStr
    otp: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str


class StudentResultResponse(BaseModel):
    id: int
    session_id: int
    absence_number: Optional[str] = None
    student_name: str
    age: Optional[str] = None
    gender: Optional[str] = None
    pred_type: int
    type_name: Optional[str] = None
    confidence: float
    top3: Optional[str] = None
    description: Optional[str] = None
    image_path: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class AnalysisSessionResponse(BaseModel):
    id: int
    user_id: int
    school_name: str
    grade_class: str
    total_students: int
    created_at: str
    date: Optional[str] = None

    class Config:
        from_attributes = True


class AnalysisSessionDetailResponse(AnalysisSessionResponse):
    student_results: list[StudentResultResponse] = []

    class Config:
        from_attributes = True


# ==========================================
# Skema Manajemen Kelas, Siswa & Asesmen
# ==========================================

class ClassCreate(BaseModel):
    name: str
    academic_year: str

    @field_validator("name")
    @classmethod
    def validate_class_name(cls, v: str) -> str:
        val = (v or "").strip()
        if not val:
            raise ValueError("Nama kelas tidak boleh kosong.")
        return val

    @field_validator("academic_year")
    @classmethod
    def validate_academic_year(cls, v: str) -> str:
        val = (v or "").strip()
        if not val:
            raise ValueError("Tahun ajaran tidak boleh kosong.")
        return val


class ClassUpdate(BaseModel):
    name: str
    academic_year: str

    @field_validator("name")
    @classmethod
    def validate_class_name(cls, v: str) -> str:
        val = (v or "").strip()
        if not val:
            raise ValueError("Nama kelas tidak boleh kosong.")
        return val

    @field_validator("academic_year")
    @classmethod
    def validate_academic_year(cls, v: str) -> str:
        val = (v or "").strip()
        if not val:
            raise ValueError("Tahun ajaran tidak boleh kosong.")
        return val


class ClassResponse(BaseModel):
    id: int
    user_id: int
    name: str
    academic_year: str
    school_name: Optional[str] = None
    student_count: int = 0
    due_assessment_count: int = 0
    created_at: str

    class Config:
        from_attributes = True


class StudentCreate(BaseModel):
    name: str
    absence_number: int
    birth_date: date
    gender: str

    @field_validator("name")
    @classmethod
    def validate_student_name(cls, v: str) -> str:
        val = (v or "").strip()
        if not val:
            raise ValueError("Nama siswa tidak boleh kosong.")
        return val

    @field_validator("absence_number")
    @classmethod
    def validate_absence_number(cls, v: int) -> int:
        if v < 1:
            raise ValueError("Nomor absen harus berupa angka positif (minimal 1).")
        return v

    @field_validator("birth_date")
    @classmethod
    def validate_birth_date(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("Tanggal lahir tidak boleh di masa depan.")
        return v

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v: str) -> str:
        val = (v or "").strip().upper()
        if val not in ("L", "P"):
            raise ValueError("Jenis kelamin hanya boleh 'L' (Laki-laki) atau 'P' (Perempuan).")
        return val


class StudentUpdate(BaseModel):
    name: str
    absence_number: int
    birth_date: date
    gender: str

    @field_validator("name")
    @classmethod
    def validate_student_name(cls, v: str) -> str:
        val = (v or "").strip()
        if not val:
            raise ValueError("Nama siswa tidak boleh kosong.")
        return val

    @field_validator("absence_number")
    @classmethod
    def validate_absence_number(cls, v: int) -> int:
        if v < 1:
            raise ValueError("Nomor absen harus berupa angka positif (minimal 1).")
        return v

    @field_validator("birth_date")
    @classmethod
    def validate_birth_date(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("Tanggal lahir tidak boleh di masa depan.")
        return v

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v: str) -> str:
        val = (v or "").strip().upper()
        if val not in ("L", "P"):
            raise ValueError("Jenis kelamin hanya boleh 'L' (Laki-laki) atau 'P' (Perempuan).")
        return val


class LastAssessmentBrief(BaseModel):
    id: Optional[int] = None
    kategori: str
    kategori_label: str
    tanggal: str
    created_at: Optional[str] = None
    confidence: Optional[float] = None
    kesimpulan: Optional[str] = None
    sequence_number: Optional[int] = None
    period_label: Optional[str] = None
    delta_status: Optional[str] = None


class ReminderInfo(BaseModel):
    status: str
    label: str
    next_assessment_date: Optional[str] = None
    days_remaining: Optional[int] = None
    interval_days: int = 30


class StudentItemResponse(BaseModel):
    id: int
    class_id: int
    absence_number: int
    name: str
    gender: str
    birth_date: str
    age_months: float
    invitation_code: Optional[str] = None
    next_assessment_date: Optional[str] = None
    assessment_interval_days: int = 30
    total_assessments: int = 0
    parent_count: int = 0
    reminder: Optional[ReminderInfo] = None
    last_assessment: Optional[LastAssessmentBrief] = None

    class Config:
        from_attributes = True


class ClassStudentsResponse(BaseModel):
    id: int
    name: str
    academic_year: str
    school_name: Optional[str] = None
    student_count: int = 0
    due_assessment_count: int = 0
    students: List[StudentItemResponse] = []


class AssessmentHistoryItemResponse(BaseModel):
    id: int
    assessment_id: int
    student_id: int
    student_name: str
    absence_number: int
    gender: str
    age_months: float
    age: float
    kategori: str
    kategori_label: str
    kesimpulan: str
    status: str
    confidence: float
    image_path: str
    image_url: str
    tanggal: str
    created_at: str
    sequence_number: Optional[int] = 1
    period_label: Optional[str] = ""
    delta_status: Optional[str] = ""
    teacher_notes: Optional[str] = ""
    alasan_klinis: str
    saran_guru: str
    indikator: Dict[str, Any]
    indikator_klinis_table: List[Dict[str, Any]]
    kesimpulan_menulis: Dict[str, Any]
    kesimpulan_menggambar: Dict[str, Any]


class StudentScheduleUpdate(BaseModel):
    next_assessment_date: Optional[date] = None
    assessment_interval_days: Optional[int] = 30

    @field_validator("assessment_interval_days")
    @classmethod
    def validate_interval(cls, v: Optional[int]) -> int:
        if v is None:
            return 30
        if v < 1 or v > 365:
            raise ValueError("Interval asesmen berkala harus antara 1 hingga 365 hari.")
        return v


class ProgressPoint(BaseModel):
    assessment_id: int
    sequence_number: int
    period_label: str
    tanggal: str
    age_months: float
    kategori: str
    kategori_label: str
    kategori_score: int
    confidence: float
    delta_status: str
    indikator_scores: Dict[str, int] = {}


class StudentProgressResponse(BaseModel):
    student: StudentItemResponse
    class_info: Dict[str, Any]
    summary: Dict[str, Any]
    progress_series: List[ProgressPoint] = []
    assessments: List[AssessmentHistoryItemResponse] = []


class ClaimChildRequest(BaseModel):
    invitation_code: str
    relationship_label: Optional[str] = "Orang Tua"

    @field_validator("invitation_code")
    @classmethod
    def validate_code(cls, v: str) -> str:
        val = (v or "").strip().upper()
        if not val:
            raise ValueError("Kode anak tidak boleh kosong.")
        return val

    @field_validator("relationship_label")
    @classmethod
    def validate_rel(cls, v: Optional[str]) -> str:
        val = (v or "Orang Tua").strip()
        return val if val else "Orang Tua"


class ParentChildItemResponse(BaseModel):
    link_id: int
    relationship_label: str
    linked_at: str
    class_id: int
    class_name: str
    academic_year: str
    school_name: str
    teacher_name: str
    student: StudentItemResponse
