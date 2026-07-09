from fastapi import APIRouter

router = APIRouter(prefix="/login", tags=["auth"])


@router.post("")
def login():
    return {"token": "demo-token", "user": {"name": "Demo User", "email": "demo@ailifereplay.app"}}
