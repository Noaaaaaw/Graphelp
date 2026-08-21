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