from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import auth
from database import Base, engine
import models
from predict import predict_image

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
):
    details = []
    for i, image in enumerate(handwriting_images):
        result_label = predict_image(image.file)
        details.append({
            "name": f"No. {absence_numbers[i]} - {student_names[i]}",
            "status": result_label
        })

    return {
        "total_processed": len(handwriting_images),
        "status": "Sukses",
        "details": details
    }