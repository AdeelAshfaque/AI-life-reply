from fastapi import APIRouter, Query

from services.memory_service import search_memories as search_memory_records

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
def search_memories(query: str = Query(..., min_length=1)):
    return search_memory_records(query)
