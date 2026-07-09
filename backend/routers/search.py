from fastapi import APIRouter, Query, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from utils.mongo import get_database
from services.mongo_service import search_memories as search_memory_records

router = APIRouter(prefix="/search", tags=["search"])

@router.get("")
async def search_memories(query: str = Query(..., min_length=1), db: AsyncIOMotorDatabase = Depends(get_database)):
    return await search_memory_records(db, query)