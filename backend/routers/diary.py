from fastapi import APIRouter

from services.memory_service import generate_diary

router = APIRouter(prefix="/diary", tags=["diary"])


@router.get("")
def get_diary():
    return generate_diary()