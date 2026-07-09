from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from utils.mongo import get_database
from services.mongo_service import build_timeline

router = APIRouter(prefix="/timeline", tags=["timeline"])

@router.get("")
async def get_timeline(db: AsyncIOMotorDatabase = Depends(get_database)):
    return {"items": await build_timeline(db)}