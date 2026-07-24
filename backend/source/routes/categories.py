from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response
from schemas.category import CategoryResponse, CreateCategoryRequest, QueryCategoryRequest, UpdateCategoryRequest
from services import categoryService

router = APIRouter()
category_service = categoryService.CategoryService();

@router.post("/", response_model=CategoryResponse)
async def create_category(marker: CreateCategoryRequest):
    try:
        created_marker = await category_service.create(marker)
        response = CategoryResponse.model_validate(created_marker)
        return response
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/", response_model=list[CategoryResponse])
async def get_category(marker_query: QueryCategoryRequest = Depends()):
    try:
        markers = await category_service.get_all(marker_query)
        reponses = [CategoryResponse.model_validate(marker) for marker in markers]
        return reponses
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.put("/{id}", response_model=CategoryResponse)
async def update_category(id: UUID, marker: UpdateCategoryRequest):
    try:
        updated_marker = await category_service.update(id, marker)
        response = CategoryResponse.model_validate(updated_marker)
        return response
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

@router.delete("/{id}")
async def delete_category(id: UUID):
    try:
        await category_service.delete(id)
        return Response(status_code=204)
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )