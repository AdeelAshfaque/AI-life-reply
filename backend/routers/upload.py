from fastapi import APIRouter, File, UploadFile, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from utils.mongo import get_database
from services.mongo_service import add_memory

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("")
async def upload_file(file: UploadFile = File(...), db: AsyncIOMotorDatabase = Depends(get_database)):
    memory = await add_memory(db, file.filename)
    return memory