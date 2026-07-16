import os  # 👈 1. ADD THIS IMPORT AT THE TOP
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles 
from routers import auth, diary, graph, memories, search, timeline, upload
from utils.mongo import get_database
from services.mongo_service import ensure_seed_data
import asyncio

app = FastAPI(title="AI Life Replay API", version="0.1.0")

# Bulletproof local CORS policy for development
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👈 2. ADD THIS EXACT LINE HERE to auto-generate the folder and stop the crash!
os.makedirs("uploads", exist_ok=True)

# This exposes your local folder to http://localhost:8000/uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.on_event("startup")
async def startup_event():
    try:
        db = get_database()
        asyncio.create_task(ensure_seed_data(db))
        print("Database connection initialization dispatched successfully.")
    except Exception as e:
        print(f"Database connection early warning failure: {e}")

# Routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(memories.router)
app.include_router(search.router)
app.include_router(timeline.router)
app.include_router(diary.router)
app.include_router(graph.router)

@app.get("/")
def root():
    return {"message": "AI Life Replay API is running"}