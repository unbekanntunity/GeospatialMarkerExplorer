from uuid import UUID

from fastapi import APIRouter, HTTPException, Response

from errors.sectionNotFoundError import SectionNotFoundError
from schemas.section import CreateSectionRequest, SectionResponse, UpdateSectionRequest
from services import sectionService


router = APIRouter()
section_service = sectionService.SectionService()

@router.post("/", response_model=SectionResponse)
async def create_section(marker: CreateSectionRequest):
    created_marker = await section_service.create_section(marker)
    response = SectionResponse.model_validate(created_marker)
    return response

@router.get("/", response_model=list[SectionResponse])
async def get_sections():
    sections = await section_service.get_all()
    reponses = [SectionResponse.model_validate(section) for section in sections]
    return reponses
   
@router.get("/{id}", response_model=SectionResponse)
async def get_section(id: UUID):
    try:
        marker = await section_service.get_marker(id)
        response = SectionResponse.model_validate(marker)
        return response
    except SectionNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

@router.put("/{id}", response_model=SectionResponse)
async def update_section(id: UUID, marker: UpdateSectionRequest):
    try:
        updated_section = await section_service.update(id, marker)
        response = SectionResponse.model_validate(updated_section)
        return response
    except SectionNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

@router.delete("/{id}")
async def delete_section(id: UUID):
    try:
        await section_service.delete(id)
        return Response(status_code=204)
    except SectionNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )