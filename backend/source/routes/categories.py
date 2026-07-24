from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response
from schemas.category import CategoryResponse, CreateCategoryRequest, QueryCategoryRequest, UpdateCategoryRequest
from services import categoryService

router = APIRouter()
category_service = categoryService.CategoryService();

@router.post("/", response_model=CategoryResponse)
async def create_category(category: CreateCategoryRequest):
    try:
        created_category = await category_service.create(category)
        response = CategoryResponse.model_validate(created_category)
        return response
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/", response_model=list[CategoryResponse])
async def get_categories(category_query: QueryCategoryRequest = Depends()):
    try:
        markers = await category_service.get_all(category_query)
        reponses = [CategoryResponse.model_validate(marker) for marker in markers]
        return reponses
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.put("/{id}", response_model=CategoryResponse)
async def update_category(id: UUID, category: UpdateCategoryRequest):
    try:
        updated_category = await category_service.update(id, category)
        response = CategoryResponse.model_validate(updated_category)
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