from fastapi import APIRouter, File, HTTPException, UploadFile

from schemas.imageFileResponse import ImageFileResponse
from services import uploadService


router = APIRouter()
upload_service = uploadService.UploadService()

@router.post("/", response_model=ImageFileResponse)
async def upload_file(file: UploadFile = File(...)):
    try:
        icon_url = await upload_service.upload_file(file)
        return ImageFileResponse(url=icon_url)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )