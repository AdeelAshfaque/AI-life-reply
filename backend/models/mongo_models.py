from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId


def serialize_object_id(value: Any):
    if isinstance(value, ObjectId):
        return str(value)
    return value


def memory_document_to_dict(document: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": serialize_object_id(document.get("_id")),
        "image_url": document.get("image_url", ""),
        "title": document.get("title", ""),
        "description": document.get("description", ""),
        "date": document.get("date", ""),
        "time": document.get("time"),
        "tags": document.get("tags", []),
        "people": document.get("people"),
        "location": document.get("location"),
        "mood": document.get("mood"),
        "created_at": document.get("created_at", datetime.utcnow()).isoformat(),
    }
