from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from utils.mongo import get_database
from services.mongo_service import generate_diary

router = APIRouter(prefix="/diary", tags=["diary"])

@router.get("")
async def get_diary(db: AsyncIOMotorDatabase = Depends(get_database)):
    return await generate_diary(db)