from fastapi import APIRouter, Query, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from utils.mongo import get_database
from services.mongo_service import build_memory_graph, build_weekly_insights

router = APIRouter(prefix="/graph", tags=["graph"])

@router.get("")
async def get_graph(focus: str = Query("Ali", min_length=1), db: AsyncIOMotorDatabase = Depends(get_database)):
    graph = await build_memory_graph(db, focus)
    return {"focus": focus, "nodes": graph["nodes"], "edges": graph["edges"]}

@router.get("/weekly-insights")
async def get_weekly_insights(db: AsyncIOMotorDatabase = Depends(get_database)):
    return await build_weekly_insights(db)