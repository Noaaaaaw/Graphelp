import os
import json
import hmac
import base64
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional, Callable
try:
    import jwt as _pyjwt
except ImportError:
    _pyjwt = None
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from .database import get_db
from .models import User
from .schemas import UserRegister, OTPRequest, ResetPasswordRequest
from .utils import otp_storage, generate_otp, send_otp_email

router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "graphelp_secret_key_default_fallback_2026")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login", auto_error=False)


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64url_decode(segment: str) -> bytes:
    padding = "=" * (-len(segment) % 4)
    return base64.urlsafe_b64decode((segment + padding).encode("ascii"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

    if _pyjwt is not None:
        to_encode.update({"exp": expire})
        return _pyjwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

    to_encode.update({"exp": int(expire.timestamp())})
    header_b64 = _b64url_encode(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _b64url_encode(json.dumps(to_encode, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
    sig = hmac.new(JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_b64}.{payload_b64}.{_b64url_encode(sig)}"


def decode_access_token(token: str) -> dict:
    if _pyjwt is not None:
        try:
            return _pyjwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        except _pyjwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Sesi login telah kedaluwarsa. Silakan masuk kembali.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token otentikasi tidak valid.",
                headers={"WWW-Authenticate": "Bearer"},
            )

    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Invalid token format")
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode("ascii")
        expected_sig = hmac.new(JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        actual_sig = _b64url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            raise ValueError("Signature mismatch")
        payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token otentikasi tidak valid.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    exp = payload.get("exp")
    if exp is not None and datetime.now(timezone.utc).timestamp() > float(exp):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesi login telah kedaluwarsa. Silakan masuk kembali.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesi login belum memiliki token otorisasi. Silakan Logout lalu Login kembali.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(token)
    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak memiliki klaim pengguna.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        user_id = int(sub)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Format identitas pengguna di dalam token tidak valid.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Pengguna yang terikat pada token tidak ditemukan.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def require_role(required_role: str) -> Callable:
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Akses ditolak: Fitur ini hanya dapat diakses oleh peran '{required_role}'.",
            )
        return current_user
    return role_checker


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
        bukti_path=data.bukti_path if data.role == "guru" else None
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

    access_token = create_access_token(data={
        "sub": str(user.id),
        "username": user.username,
        "role": user.role,
    })

    return {
        "message": "Login berhasil!",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "school_name": user.school_name
        }
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
