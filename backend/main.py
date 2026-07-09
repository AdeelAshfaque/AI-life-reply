from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, diary, graph, memories, search, timeline, upload
from utils.mongo import get_database
from services.mongo_service import ensure_seed_data
import asyncio

app = FastAPI(title="AI Life Replay API", version="0.1.0")

# Bulletproof local CORS policy for development
# In your main.py file:

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.100.5:3000"  # <-- ADD THIS EXACT LINE
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Wrap seed data in a background task so a missing database can't freeze the whole API server
    try:
        db = get_database()
        asyncio.create_task(ensure_seed_data(db))
        print("Database connection initialization dispatched successfully.")
    except Exception as e:
        print(f"Database connection early warning failure: {e}")

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



