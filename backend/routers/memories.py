from fastapi import APIRouter

from services.memory_service import list_memories as fetch_memories

router = APIRouter(prefix="/memories", tags=["memories"])


@router.get("")
def list_memories():
    return {"items": fetch_memories()}
