from fastapi import APIRouter, File, UploadFile, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.mongo_service import add_memory
from utils.mongo import get_database
from services.cloudinary_service import upload_image
from services.ai_service import analyze_image

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Upload the asset to Cloudinary
    uploaded = await upload_image(file)

    # Rewind the file back to byte 0 so the AI service can read the actual image data.
    await file.seek(0)

    # 2. Analyze the image data with your AI vision engine
    analysis = await analyze_image(file)
    # Support both old and new AI responses
    if isinstance(analysis, dict):
        title = analysis.get("title", file.filename.rsplit(".", 1)[0].replace("_", " ").title())
        description = analysis.get("diary", analysis.get("description", ""))
        tags = analysis.get("tags", [])
        mood = analysis.get("mood", "")
        location = analysis.get("location", "")
        people = analysis.get("people", [])
    else:
        title = file.filename.rsplit(".", 1)[0].replace("_", " ").title()
        description = analysis
        tags = []
        mood = ""
        location = ""
        people = []

    cloudinary_url = uploaded.get("secure_url", uploaded.get("url", ""))
    cloudinary_public_id = uploaded.get("public_id", "")

    # 3. Store records safely into MongoDB
    memory = await add_memory(
        db=db,
        title=title,
        image_url=cloudinary_url,
        public_id=cloudinary_public_id,
        description=description,
        tags=tags,
        people=people,
        location=location,
        mood=mood,
    )

    return memory