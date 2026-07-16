import cloudinary
import cloudinary.uploader

from utils.settings import get_settings

settings = get_settings()

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)


async def upload_image(file):
    result = cloudinary.uploader.upload(file.file)

    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }


async def delete_image(public_id: str):
    if not public_id:
        return

    try:
        cloudinary.uploader.destroy(public_id)
    except Exception as e:
        print(f"Cloudinary delete error: {e}")