from pydantic import BaseModel, EmailStr
from typing import Optional

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