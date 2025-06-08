from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Libera os domínios permitidos para enviar requisições
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pedrotxdev.com",
        "https://www.pedrotxdev.com",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY")

@app.post("/verify-captcha")
async def verify_captcha(request: Request):
    data = await request.json()
    token = data.get("token")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": RECAPTCHA_SECRET_KEY, "response": token}
        )
    result = response.json()
    return {"success": result.get("success", False)}
