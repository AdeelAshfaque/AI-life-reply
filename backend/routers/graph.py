from fastapi import APIRouter, Query

from services.memory_service import build_memory_graph, build_weekly_insights

router = APIRouter(prefix="/graph", tags=["graph"])


@router.get("")
def get_graph(focus: str = Query("Ali", min_length=1)):
    graph = build_memory_graph(focus)
    return {"focus": focus, "nodes": graph["nodes"], "edges": graph["edges"]}


@router.get("/weekly-insights")
def get_weekly_insights():
    return build_weekly_insights()