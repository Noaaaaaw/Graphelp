from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="public")
    school_name = Column(String(255), nullable=True)
    school_email = Column(String(150), nullable=True)
    bukti_path = Column(String(255), nullable=True)

    sessions = relationship("AnalysisSession", back_populates="user", cascade="all, delete-orphan")

class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    school_name = Column(String(255), nullable=False)
    grade_class = Column(String(100), nullable=False)
    total_students = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")
    student_results = relationship("StudentAnalysisResult", back_populates="session", cascade="all, delete-orphan")

class StudentAnalysisResult(Base):
    __tablename__ = "student_analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("analysis_sessions.id"), nullable=False)
    absence_number = Column(String(50), nullable=True)
    student_name = Column(String(255), nullable=False)
    age = Column(String(50), nullable=True)
    gender = Column(String(20), nullable=True)
    pred_type = Column(Integer, nullable=False)
    type_name = Column(String(100), nullable=True)
    confidence = Column(Float, nullable=False)
    top3 = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    image_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("AnalysisSession", back_populates="student_results")