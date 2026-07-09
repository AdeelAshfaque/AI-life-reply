from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from utils.mongo import get_database
from services.mongo_service import list_memories as fetch_memories

router = APIRouter(prefix="/memories", tags=["memories"])

@router.get("")
async def list_memories(db: AsyncIOMotorDatabase = Depends(get_database)):
    return {"items": await fetch_memories(db)}