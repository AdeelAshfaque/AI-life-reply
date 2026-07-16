from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from utils.mongo import get_database
from services.mongo_service import (
    list_memories as fetch_memories,
    delete_memory,
)
from services.cloudinary_service import delete_image

router = APIRouter(prefix="/memories", tags=["memories"])


@router.get("")
async def list_memories(
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return {"items": await fetch_memories(db)}


@router.delete("/{memory_id}")
async def remove_memory(
    memory_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    memory = await delete_memory(db, memory_id)

    if not memory:
        raise HTTPException(
            status_code=404,
            detail="Memory not found",
        )

    public_id = memory.get("public_id")

    if public_id:
        await delete_image(public_id)

    return {"message": "Memory deleted successfully"}