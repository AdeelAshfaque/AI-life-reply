from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, diary, graph, memories, search, timeline, upload

app = FastAPI(title="AI Life Replay API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
