from fastapi import APIRouter, File, UploadFile

from services.memory_service import add_memory

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_file(file: UploadFile = File(...)):
    memory = add_memory(file.filename)
    return memory
