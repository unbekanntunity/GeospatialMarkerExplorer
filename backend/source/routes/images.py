from fastapi import APIRouter, File, HTTPException, UploadFile

from schemas.imageFileResponse import ImageFileResponse
from services import uploadService


router = APIRouter()
upload_service = uploadService.UploadService()

@router.get("/", response_model=list[ImageFileResponse])
async def get_files():
    try:
        imageFiles = await upload_service.get_files()
        return [ImageFileResponse(url=imageFile.url, name=imageFile.name) for imageFile in imageFiles]
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/", response_model=ImageFileResponse)
async def upload_file(file: UploadFile = File(...)):
    try:
        imageFile = await upload_service.upload_file(file)
        return ImageFileResponse(url=imageFile.url, name=imageFile.name)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )