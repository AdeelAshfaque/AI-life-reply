from datetime import datetime
from typing import Any, Dict, List

from motor.motor_asyncio import AsyncIOMotorDatabase

from models.schemas import DiaryEntry, SearchResult, TimelineItem, WeeklyInsights
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


async def add_memory(db: AsyncIOMotorDatabase, file_name: str) -> Dict[str, Any]:
    title = file_name.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()
    document = {
        "image_url": f"https://cdn.example.com/{file_name}",
        "title": title,
        "description": f"Looks like you captured a meaningful moment in {title.lower()}.",
        "date": "Today",
        "time": "20:00",
        "tags": ["memory", "timeline", "uploaded"],
        "people": ["Ali"],
        "location": "Unknown",
        "mood": "reflective",
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
    cursor = db.memories.find({}).sort([("time", 1)])
    documents = await cursor.to_list(length=None)
    return [
        TimelineItem(time=document.get("time", ""), title=document.get("title", ""), note=document.get("description", ""))
        for document in documents
        if document.get("time")
    ]


async def generate_diary(db: AsyncIOMotorDatabase) -> DiaryEntry:
    cursor = db.memories.find({}).sort([("time", 1)])
    documents = await cursor.to_list(length=None)
    titles = [document.get("title", "") for document in documents if document.get("title")]
    diary = f"Today you attended university, spent time studying in the library, played football, and ended your day watching the sunset."
    if len(titles) >= 3:
        diary = f"Today you moved through {', '.join(titles[:3])} and ended the day with {titles[-1]}."
    return DiaryEntry(date="Today", diary=diary, mood="balanced", summary=diary)

async def search_memories(db: AsyncIOMotorDatabase, query: str) -> SearchResult:
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

    if not matched:
        return SearchResult(
            query=query,
            answer="No matching memories found.",
            related_memories=[],
        )

    top = matched[0]
    answer = f"{top.get('title', 'A memory')} — {top.get('description', '')} ({top.get('date', '')} at {top.get('time', '')}, {top.get('location', '')})."
    related = [document.get("title", "") for document in matched if document.get("title")]

    return SearchResult(
        query=query,
        answer=answer,
        related_memories=related,
    )


async def build_memory_graph(db: AsyncIOMotorDatabase, focus: str) -> Dict[str, List[Dict[str, str]]]:
    cursor = db.memories.find({"$or": [{"people": focus}, {"title": {"$regex": focus, "$options": "i"}}]})
    documents = await cursor.to_list(length=10)
    related_titles = [document.get("title", "") for document in documents if document.get("title")]
    if not related_titles:
        related_titles = ["Sports Ground", "Ali", "University Tournament", "Winning Medal"]
    nodes = [focus, *related_titles[:4]]
    edges = []
    for index in range(len(nodes) - 1):
        edges.append({"source": nodes[index], "target": nodes[index + 1]})
    return {"nodes": nodes, "edges": edges}


async def build_weekly_insights(db: AsyncIOMotorDatabase) -> WeeklyInsights:
    memories = await db.memories.find({}).to_list(length=None)
    studied_days = sum(1 for memory in memories if any(tag in ["study", "library", "campus"] for tag in memory.get("tags", [])))
    football_days = sum(1 for memory in memories if "football" in [tag.lower() for tag in memory.get("tags", [])] or memory.get("title", "").lower() == "football")
    university_days = sum(1 for memory in memories if "university" in memory.get("title", "").lower() or "campus" in [tag.lower() for tag in memory.get("tags", [])])

    people_counter: Dict[str, int] = {}
    location_counter: Dict[str, int] = {}
    for memory in memories:
        for person in memory.get("people", []) or []:
            people_counter[person] = people_counter.get(person, 0) + 1
        location = memory.get("location")
        if location:
            location_counter[location] = location_counter.get(location, 0) + 1

    top_people = [name for name, _ in sorted(people_counter.items(), key=lambda item: item[1], reverse=True)[:3]]
    top_locations = [name for name, _ in sorted(location_counter.items(), key=lambda item: item[1], reverse=True)[:3]]

    return WeeklyInsights(
        studied_days=studied_days,
        football_days=football_days,
        university_days=university_days,
        top_people=top_people,
        top_locations=top_locations,
    )
