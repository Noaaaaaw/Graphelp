from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os, shutil

# 1. Load variabel environment dari file .env
load_dotenv()

# 2. Ambil URL database dari .env (Fallback ke VPS jika .env tidak ditemukan)
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://graphelp:Capstone04@38.47.94.194:5432/graphelp_db"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    # Perbaikan sintaks id dari kode sebelumnya
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    school_name = Column(String, nullable=True)
    school_email = Column(String, nullable=True)
    bukti_path = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Penggunaan pbkdf2_sha256 agar kompatibel penuh dengan Python 3.13
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class LoginSchema(BaseModel):
    username: str
    password: str

@app.get("/")
def home():
    return {"message": "Backend FastAPI Graphhelp Aktif!"}

@app.post("/register")
async def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    schoolName: Optional[str] = Form(None),
    schoolEmail: Optional[str] = Form(None),
    buktiFile: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    try:
        existing_user = db.query(User).filter((User.username == username) | (User.email == email)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username atau Email sudah terdaftar!")

        file_path = None
        if role == "guru" and buktiFile:
            file_path = os.path.join(UPLOAD_DIR, f"{username}_{buktiFile.filename}")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(buktiFile.file, buffer)

        hashed_pwd = pwd_context.hash(password)

        new_user = User(
            username=username,
            email=email,
            hashed_password=hashed_pwd,
            role=role,
            school_name=schoolName if schoolName != "string" else None,
            school_email=schoolEmail if schoolEmail != "string" else None,
            bukti_path=file_path
        )
        db.add(new_user)
        db.commit()

        return {"message": "Registrasi berhasil!"}
    except HTTPException as he:
        raise he
    except Exception as e:
        print("ERROR REGISTER:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Username atau password salah!")

    return {
        "message": "Login berhasil!",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }