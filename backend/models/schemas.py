from typing import List, Optional

from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class MemoryItem(BaseModel):
    image_url: str
    title: str
    description: str
    date: str
    time: Optional[str] = None
    tags: List[str]
    people: Optional[List[str]] = None
    location: Optional[str] = None
    mood: Optional[str] = None


class TimelineItem(BaseModel):
    image_url: str
    title: str
    description: str
    date: str
    time: str
    location: str
    mood: str


class SearchResult(BaseModel):
    query: str
    answer: str
    related_memories: List[str]


class MemoryGraphResponse(BaseModel):
    focus: str
    nodes: List[str]
    edges: List[dict]

class WeeklyInsights(BaseModel):
    total_memories: int
    total_tags: int
    total_people: int
    total_locations: int

class DiaryEntry(BaseModel):
    date: str
    diary: str
    mood: str
    summary: str
