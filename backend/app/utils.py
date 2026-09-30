import random
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

otp_storage = {}

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(to_email: str, otp_code: str, purpose: str = "Registrasi"):
    sender_email = os.getenv("SMTP_EMAIL")
    sender_password = os.getenv("SMTP_PASSWORD")

    if not sender_email or not sender_password:
        raise Exception("Konfigurasi SMTP_EMAIL atau SMTP_PASSWORD di .env belum terisi!")

    msg = EmailMessage()
    msg['Subject'] = f"Kode OTP {purpose} - Graphhelp"
    msg['From'] = sender_email
    msg['To'] = to_email
    msg.set_content(f"Halo,\n\nKode OTP Anda untuk {purpose} adalah: {otp_code}\n\nJangan berikan kode ini kepada siapapun.")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.send_message(msg)