from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REPORTS_DIR = "reports"

@app.get("/")
def root():
    return {"message": "Threat Intelligence API running"}

@app.get("/api/reports/latest")
def get_latest_report():

    files = sorted(os.listdir(REPORTS_DIR))

    if not files:
        return {"error": "No reports found"}

    latest = files[-1]

    with open(f"{REPORTS_DIR}/{latest}") as f:
        data = json.load(f)

    return data