from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Response
from errors.categoryNotFoundError import CategoryNotFoundError
from errors.markerNotFoundError import MarkerNotFoundError
from schemas.marker import CreateMarkerRequest, MarkerResponse, QueryMarkerRequest, UpdateMarkerRequest
from services import markerService

router = APIRouter()
marker_service = markerService.MarkerService()

@router.post("/", response_model=MarkerResponse)
async def create_marker(marker: CreateMarkerRequest):
    try:
        created_marker = await marker_service.create(marker)
        response = MarkerResponse.model_validate(created_marker)
        return response
    except CategoryNotFoundError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/", response_model=list[MarkerResponse])
async def get_markers(
    name: str | None = None,
    category_ids: Annotated[list[UUID] | None, Query()] = None
    ):

    markers = await marker_service.get_all(QueryMarkerRequest(name=name, category_ids=category_ids))
    reponses = [MarkerResponse.model_validate(marker) for marker in markers]
    return reponses
   

@router.get("/{id}", response_model=MarkerResponse)
async def get_marker(id: UUID):
    try:
        marker = await marker_service.get_marker(id)
        response = MarkerResponse.model_validate(marker)
        return response
    except MarkerNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

@router.put("/{id}", response_model=MarkerResponse)
async def update_marker(id: UUID, marker: UpdateMarkerRequest):
    try:
        updated_marker = await marker_service.update(id, marker)
        response = MarkerResponse.model_validate(updated_marker)
        return response
    except MarkerNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    except CategoryNotFoundError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.delete("/{id}")
async def delete_marker(id: UUID):
    try:
        await marker_service.delete(id)
        return Response(status_code=204)
    except MarkerNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )