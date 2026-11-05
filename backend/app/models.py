from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="public")
    school_name = Column(String, nullable=True)
    school_email = Column(String, nullable=True)
    bukti_path = Column(String, nullable=True)

    sessions = relationship("AnalysisSession", back_populates="user", cascade="all, delete-orphan")
    classes = relationship("SchoolClass", back_populates="user", cascade="all, delete-orphan")
    parent_links = relationship("ParentStudent", back_populates="parent_user", cascade="all, delete-orphan")

class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    school_name = Column(String, nullable=False)
    grade_class = Column(String, nullable=False)
    total_students = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="sessions")
    student_results = relationship("StudentAnalysisResult", back_populates="session", cascade="all, delete-orphan")

class StudentAnalysisResult(Base):
    __tablename__ = "student_analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("analysis_sessions.id"), nullable=False)
    absence_number = Column(String, nullable=True)
    student_name = Column(String, nullable=False)
    age = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    pred_type = Column(Integer, nullable=False)
    type_name = Column(String, nullable=True)
    confidence = Column(Float, nullable=False)
    top3 = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    image_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("AnalysisSession", back_populates="student_results")

class SchoolClass(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    academic_year = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="classes")
    students = relationship("Student", back_populates="school_class", cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False, index=True)
    absence_number = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(String(10), nullable=False)
    invitation_code = Column(String(20), unique=True, index=True, nullable=True)
    next_assessment_date = Column(Date, nullable=True)
    assessment_interval_days = Column(Integer, default=30, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    school_class = relationship("SchoolClass", back_populates="students")
    assessments = relationship("Assessment", back_populates="student", cascade="all, delete-orphan")
    parent_links = relationship("ParentStudent", back_populates="student", cascade="all, delete-orphan")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, index=True)
    age_months = Column(Float, nullable=False)
    kategori = Column(String(20), nullable=False)
    kesimpulan = Column(String(100), nullable=False)
    status = Column(String(150), nullable=False)
    confidence = Column(Float, nullable=False)
    image_path = Column(String(255), nullable=False)
    result_json = Column(Text, nullable=False)
    sequence_number = Column(Integer, default=1, nullable=True)
    period_label = Column(String(100), nullable=True)
    delta_status = Column(String(50), nullable=True)
    teacher_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="assessments")


class ParentStudent(Base):
    __tablename__ = "parent_students"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, index=True)
    relationship_label = Column(String(50), default="Orang Tua", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    parent_user = relationship("User", back_populates="parent_links")
    student = relationship("Student", back_populates="parent_links")
