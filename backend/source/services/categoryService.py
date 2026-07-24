from uuid import UUID

from errors import CategoryNotFoundError
from repositories import categoryRepository
from schemas.category import CreateCategoryRequest, QueryCategoryRequest, UpdateCategoryRequest

cateogry_repository = categoryRepository.CategoryRepository()

class CategoryService:
    async def create(self, request: CreateCategoryRequest):
        return await cateogry_repository.create(request)
        
    async def get_marker(self, id: UUID):
        marker = await cateogry_repository.get_by_id(id)

        if marker is None:
            raise CategoryNotFoundError(id)

        return marker
    
    async def get_all(self, query: QueryCategoryRequest):
        return await categoryRepository.get_all(query)
    
    async def update(self, id: UUID, request: UpdateCategoryRequest):
        updated_marker = await categoryRepository.update(id, request)

        if updated_marker is None:
            raise CategoryNotFoundError(id)
        
        return updated_marker
    
    async def delete(self, id: UUID):
        deleted_marker = await categoryRepository.delete(id)

        if not deleted_marker:
            raise CategoryNotFoundError(id)
