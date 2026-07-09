from collections import Counter
from typing import Dict, List

from models.schemas import DiaryEntry, MemoryItem, SearchResult, TimelineItem, WeeklyInsights

MEMORIES: List[MemoryItem] = [
    MemoryItem(
        image_url="https://cdn.example.com/breakfast.jpg",
        title="Breakfast",
        description="A calm breakfast to start the day.",
        date="Today",
        time="8:30",
        tags=["food", "morning"],
        people=["You"],
        location="Home",
        mood="calm",
    ),
    MemoryItem(
        image_url="https://cdn.example.com/university.jpg",
        title="University",
        description="You attended classes and met friends.",
        date="Today",
        time="11:00",
        tags=["study", "campus"],
        people=["Ali"],
        location="University",
        mood="focused",
    ),
    MemoryItem(
        image_url="https://cdn.example.com/library.jpg",
        title="Library",
        description="Focused study session before exams.",
        date="Today",
        time="15:00",
        tags=["study", "library"],
        people=["Ali"],
        location="Library",
        mood="productive",
    ),
    MemoryItem(
        image_url="https://cdn.example.com/football.jpg",
        title="Football",
        description="Playing football with friends at IBA Ground.",
        date="Saturday",
        time="18:00",
        tags=["sports", "friends", "ground"],
        people=["Ali", "Hassan"],
        location="IBA Ground",
        mood="excited",
    ),
    MemoryItem(
        image_url="https://cdn.example.com/sunset.jpg",
        title="Sunset",
        description="A peaceful end to the day watching the sunset.",
        date="Today",
        time="19:00",
        tags=["evening", "reflection"],
        people=["You"],
        location="Seaside",
        mood="peaceful",
    ),
]


def add_memory(file_name: str) -> MemoryItem:
    title = file_name.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()
    description = f"Looks like you captured a meaningful moment in {title.lower()}."
    memory = MemoryItem(
        image_url=f"https://cdn.example.com/{file_name}",
        title=title,
        description=description,
        date="Today",
        time="20:00",
        tags=["memory", "timeline", "uploaded"],
        people=["Ali"],
        location="Unknown",
        mood="reflective",
    )
    MEMORIES.append(memory)
    return memory


def list_memories() -> List[MemoryItem]:
    return MEMORIES


def build_timeline() -> List[TimelineItem]:
    ordered = sorted(
        [memory for memory in MEMORIES if memory.time],
        key=lambda memory: memory.time or "",
    )
    return [
        TimelineItem(time=memory.time or "", title=memory.title, note=memory.description)
        for memory in ordered
    ]


def generate_diary() -> DiaryEntry:
    summary = "Today you attended university, spent time studying in the library, played football, and ended your day watching the sunset."
    return DiaryEntry(
        date="Today",
        diary=summary,
        mood="balanced",
        summary=summary,
    )


def search_memories(query: str) -> SearchResult:
    normalized = query.lower()
    if "football" in normalized:
        return SearchResult(
            query=query,
            answer="Last Saturday. IBA Ground. 6 PM.",
            related_memories=["Football", "Sports Ground", "Ali", "University Tournament"],
        )
    if "ali" in normalized:
        return SearchResult(
            query=query,
            answer="Ali appears in your university, library, and football memories.",
            related_memories=["University", "Library", "Football", "University Tournament"],
        )
    if "library" in normalized:
        return SearchResult(
            query=query,
            answer="You studied in the library today around 3 PM.",
            related_memories=["Library", "University", "Diary", "Study Session"],
        )
    return SearchResult(
        query=query,
        answer="I found memories related to your question.",
        related_memories=[memory.title for memory in MEMORIES[:3]],
    )


def build_memory_graph(focus: str) -> Dict[str, List[Dict[str, str]]]:
    edges = [
        {"source": focus, "target": "Sports Ground"},
        {"source": "Sports Ground", "target": "Ali"},
        {"source": "Ali", "target": "University Tournament"},
        {"source": "University Tournament", "target": "Winning Medal"},
    ]
    nodes = [focus, "Sports Ground", "Ali", "University Tournament", "Winning Medal"]
    return {"nodes": nodes, "edges": edges}


def build_weekly_insights() -> WeeklyInsights:
    people = Counter()
    locations = Counter()
    for memory in MEMORIES:
        for person in memory.people or []:
            people[person] += 1
        if memory.location:
            locations[memory.location] += 1

    return WeeklyInsights(
        studied_days=5,
        football_days=3,
        university_days=4,
        top_people=[name for name, _ in people.most_common(3)],
        top_locations=[name for name, _ in locations.most_common(3)],
    )
