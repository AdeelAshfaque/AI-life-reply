from functools import lru_cache
import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    mongo_uri: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    mongo_db_name: str = os.getenv("MONGO_DB_NAME", "ai_life_replay")
    frontend_origin: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

    cloudinary_cloud_name: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    cloudinary_api_key: str = os.getenv("CLOUDINARY_API_KEY", "")
    cloudinary_api_secret: str = os.getenv("CLOUDINARY_API_SECRET", "")
    github_token: str = os.getenv("GITHUB_TOKEN", "")

@lru_cache
def get_settings() -> Settings:
    return Settings()