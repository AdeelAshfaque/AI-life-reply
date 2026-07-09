from fastapi import APIRouter

from services.memory_service import build_timeline

router = APIRouter(prefix="/timeline", tags=["timeline"])


@router.get("")
def get_timeline():
    return {"items": build_timeline()}