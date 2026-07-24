from fastapi import APIRouter, File, HTTPException, UploadFile

from schemas.imageFileResponse import ImageFileResponse
from services import uploadService


router = APIRouter()
upload_service = uploadService.UploadService()

@router.get("/", response_model=list[ImageFileResponse])
async def get_files():
    try:
        icon_urls = await upload_service.get_files()
        return  [ImageFileResponse(url=icon_url) for icon_url in icon_urls]
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

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