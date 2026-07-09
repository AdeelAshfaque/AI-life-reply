from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from utils.settings import get_settings

_settings = get_settings()
_client = AsyncIOMotorClient(_settings.mongo_uri)
_database = _client[_settings.mongo_db_name]


def get_database() -> AsyncIOMotorDatabase:
    return _database
