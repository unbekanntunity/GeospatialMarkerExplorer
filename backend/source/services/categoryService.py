from uuid import UUID

from errors import CategoryNotFoundError
from repositories import categoryRepository
from schemas.category import CreateCategoryRequest, QueryCategoryRequest, UpdateCategoryRequest

category_repository = categoryRepository.CategoryRepository()

class CategoryService:
    async def create(self, request: CreateCategoryRequest):
        return await category_repository.create(request)
        
    async def get_marker(self, id: UUID):
        marker = await category_repository.get_by_id(id)

        if marker is None:
            raise CategoryNotFoundError(id)

        return marker
    
    async def get_all(self, query: QueryCategoryRequest):
        return await category_repository.get_all(query)
    
    async def update(self, id: UUID, request: UpdateCategoryRequest):
        updated_marker = await categoryRepository.update(id, request)

        if updated_marker is None:
            raise CategoryNotFoundError(id)
        
        return updated_marker

    async def delete(self, id: UUID):
        category = await category_repository.get_by_id(id)

        if category is None:
            raise CategoryNotFoundError(id)

        if category.icon_url and not category_repository.is_icon_used(category.icon_url, category.id):
            await self.upload_service.remove_file(
                category.icon_url
            )

        await category_repository.delete(id)
