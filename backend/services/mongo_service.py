from datetime import datetime
from typing import Any, Dict, List
from services.ai_service import generate_ai_diary
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.schemas import DiaryEntry, TimelineItem, WeeklyInsights
from models.mongo_models import memory_document_to_dict


async def ensure_seed_data(db: AsyncIOMotorDatabase) -> None:
    memories = db.memories
    count = await memories.count_documents({})
    if count > 0:
        return

    seed_memories = [
        {
            "image_url": "https://cdn.example.com/breakfast.jpg",
            "title": "Breakfast",
            "description": "A calm breakfast to start the day.",
            "date": "Today",
            "time": "8:30",
            "tags": ["food", "morning"],
            "people": ["You"],
            "location": "Home",
            "mood": "calm",
            "created_at": datetime.utcnow(),
        },
        {
            "image_url": "https://cdn.example.com/university.jpg",
            "title": "University",
            "description": "You attended classes and met friends.",
            "date": "Today",
            "time": "11:00",
            "tags": ["study", "campus"],
            "people": ["Ali"],
            "location": "University",
            "mood": "focused",
            "created_at": datetime.utcnow(),
        },
        {
            "image_url": "https://cdn.example.com/library.jpg",
            "title": "Library",
            "description": "Focused study session before exams.",
            "date": "Today",
            "time": "15:00",
            "tags": ["study", "library"],
            "people": ["Ali"],
            "location": "Library",
            "mood": "productive",
            "created_at": datetime.utcnow(),
        },
        {
            "image_url": "https://cdn.example.com/football.jpg",
            "title": "Football",
            "description": "Playing football with friends at IBA Ground.",
            "date": "Saturday",
            "time": "18:00",
            "tags": ["sports", "friends", "ground"],
            "people": ["Ali", "Hassan"],
            "location": "IBA Ground",
            "mood": "excited",
            "created_at": datetime.utcnow(),
        },
        {
            "image_url": "https://cdn.example.com/sunset.jpg",
            "title": "Sunset",
            "description": "A peaceful end to the day watching the sunset.",
            "date": "Today",
            "time": "19:00",
            "tags": ["evening", "reflection"],
            "people": ["You"],
            "location": "Seaside",
            "mood": "peaceful",
            "created_at": datetime.utcnow(),
        },
    ]

    await memories.insert_many(seed_memories)


async def add_memory(
    db: AsyncIOMotorDatabase,
    title: str,
    image_url: str,
    public_id: str,
    description: str,
    tags: list[str] | None = None,
    people: list[str] | None = None,
    location: str = "",
    mood: str = "",
) -> Dict[str, Any]:

    document = {
        "image_url": image_url,
        "public_id": public_id,
        "title": title,
        "description": description,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H:%M"),
        "tags": tags or [],
        "people": people or [],
        "location": location,
        "mood": mood,
        "created_at": datetime.utcnow(),
    }

    result = await db.memories.insert_one(document)
    saved = await db.memories.find_one({"_id": result.inserted_id})

    return memory_document_to_dict(saved or document)


async def list_memories(db: AsyncIOMotorDatabase) -> List[Dict[str, Any]]:
    cursor = db.memories.find({}).sort([("date", 1), ("time", 1)])
    documents = await cursor.to_list(length=None)
    return [memory_document_to_dict(document) for document in documents]


async def build_timeline(db: AsyncIOMotorDatabase) -> List[TimelineItem]:
    cursor = db.memories.find({}).sort("created_at", -1)
    documents = await cursor.to_list(length=None)

    return [
        TimelineItem(
            image_url=document.get("image_url", ""),
            title=document.get("title", ""),
            description=document.get("description", ""),
            date=document.get("date", ""),
            time=document.get("time", ""),
            location=document.get("location", ""),
            mood=document.get("mood", ""),
        )
        for document in documents
    ]


async def generate_diary(db: AsyncIOMotorDatabase):
    memories = await db.memories.find({}).sort("created_at", 1).to_list(length=None)

    return await generate_ai_diary(memories)

async def search_memories(db: AsyncIOMotorDatabase, query: str):
    matched = await db.memories.find(
        {
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}},
                {"tags": {"$regex": query, "$options": "i"}},
                {"location": {"$regex": query, "$options": "i"}},
                {"people": {"$regex": query, "$options": "i"}},
            ]
        }
    ).to_list(length=10)

    return matched


async def build_memory_graph(
    db: AsyncIOMotorDatabase,
    focus: str,
):
    """
    Builds a growing memory graph centered on `focus`.

    Key fix vs the old version: `focus` is only linked to a memory when the
    focus person actually appears in that memory's `people` list (or is the
    memory's title/location/tag, in case someone searches a place or theme
    instead of a person). Previously every memory was force-linked to focus,
    which produced misleading connections.
    """
    memories = await db.memories.find({}).to_list(length=None)

    nodes = []
    edges = []
    added = set()

    def add_node(node_id: str, label: str, node_type: str, size: int):
        if not node_id or node_id in added:
            return
        nodes.append({
            "id": node_id,
            "label": label,
            "type": node_type,
            "size": size,
        })
        added.add(node_id)

    def add_edge(source: str, target: str):
        if not source or not target or source == target:
            return
        edges.append({"source": source, "target": target})

    add_node(focus, focus, "focus", 24)

    for memory in memories:
        title = memory.get("title", "")
        location = memory.get("location", "")
        mood = memory.get("mood", "")
        tags = memory.get("tags", [])
        people = memory.get("people", [])

        if not title:
            continue

        # Does this memory actually relate to the focus?
        is_relevant_to_focus = (
            focus in people
            or focus == location
            or focus == title
            or focus in tags
        )

        add_node(title, title, "memory", 18)

        if is_relevant_to_focus:
            add_edge(focus, title)

        if location:
            add_node(location, location, "place", 15)
            add_edge(title, location)

        if mood:
            add_node(mood, mood, "mood", 13)
            add_edge(title, mood)

        for person in people:
            add_node(person, person, "person", 16)
            add_edge(title, person)

        for tag in tags:
            add_node(tag, tag, "tag", 12)
            add_edge(title, tag)

    return {
        "focus": focus,
        "nodes": nodes,
        "edges": edges,
    }


async def build_weekly_insights(db: AsyncIOMotorDatabase) -> WeeklyInsights:
    memories = await db.memories.find({}).to_list(length=None)

    tags = set()
    people = set()
    locations = set()

    for memory in memories:

        for tag in memory.get("tags", []):
            if tag:
                tags.add(tag)

        for person in memory.get("people", []):
            if person:
                people.add(person)

        if memory.get("location"):
            locations.add(memory["location"])

    return WeeklyInsights(
        total_memories=len(memories),
        total_tags=len(tags),
        total_people=len(people),
        total_locations=len(locations),
    )

async def delete_memory(
    db: AsyncIOMotorDatabase,
    memory_id: str,
) -> Dict[str, Any] | None:

    memory = await db.memories.find_one(
        {"_id": ObjectId(memory_id)}
    )

    if not memory:
        return None

    await db.memories.delete_one(
        {"_id": ObjectId(memory_id)}
    )

    return memory_document_to_dict(memory)