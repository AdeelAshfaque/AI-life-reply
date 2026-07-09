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
    time: str
    title: str
    note: str


class SearchResult(BaseModel):
    query: str
    answer: str
    related_memories: List[str]


class MemoryGraphResponse(BaseModel):
    focus: str
    nodes: List[str]
    edges: List[dict]


class WeeklyInsights(BaseModel):
    studied_days: int
    football_days: int
    university_days: int
    top_people: List[str]
    top_locations: List[str]


class DiaryEntry(BaseModel):
    date: str
    diary: str
    mood: str
    summary: str
