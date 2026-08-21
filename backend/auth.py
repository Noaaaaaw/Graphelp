from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import get_db  
from models import User      
from schemas import UserRegister, OTPRequest, ResetPasswordRequest
from utils import otp_storage, generate_otp, send_otp_email

router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

# 1. KIRIM OTP REGISTRASI
@router.post("/send-otp-register")
def send_otp_register(data: OTPRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email sudah terdaftar!")

    otp = generate_otp()
    otp_storage[data.email] = {"code": otp, "type": "register"}
    send_otp_email(data.email, otp, "Registrasi Akun")
    return {"message": "Kode OTP berhasil dikirim ke email!"}

# 2. VERIFIKASI & DAFTAR
@router.post("/register-with-otp")
def register_with_otp(data: UserRegister, otp: str, db: Session = Depends(get_db)):
    stored = otp_storage.get(data.email)
    if not stored or stored["code"] != otp or stored["type"] != "register":
        raise HTTPException(status_code=400, detail="Kode OTP salah atau kadaluarsa!")

    hashed_password = pwd_context.hash(data.password)
    new_user = User(
        username=data.username,
        email=data.email,
        password=hashed_password,
        role=data.role,
        school_name=data.school_name if data.role == "guru" else None,
        school_email=data.school_email if data.role == "guru" else None,
        bukti_path=data.bukti_path if data.role == "guru" else None # Menyimpan nomor pengajar
    )
    db.add(new_user)
    db.commit()

    del otp_storage[data.email]
    return {"message": "Registrasi berhasil!"}

# 3. LOGIN
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Username atau password salah!")

    return {
        "message": "Login berhasil!",
        "user": {"id": user.id, "username": user.username, "email": user.email, "role": user.role, "school_name": user.school_name}
    }

# 4. KIRIM OTP LUPA PASSWORD
@router.post("/forgot-password/send-otp")
def send_otp_forgot(data: OTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email tidak ditemukan!")

    otp = generate_otp()
    otp_storage[data.email] = {"code": otp, "type": "forgot"}
    send_otp_email(data.email, otp, "Reset Password")
    return {"message": "Kode OTP reset password berhasil dikirim!"}

# 5. RESET PASSWORD
@router.post("/forgot-password/reset")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    stored = otp_storage.get(data.email)
    if not stored or stored["code"] != data.otp or stored["type"] != "forgot":
        raise HTTPException(status_code=400, detail="Kode OTP salah atau kadaluarsa!")

    user = db.query(User).filter(User.email == data.email).first()
    user.password = pwd_context.hash(data.new_password)
    db.commit()

    del otp_storage[data.email]
    return {"message": "Password berhasil diperbarui!"}