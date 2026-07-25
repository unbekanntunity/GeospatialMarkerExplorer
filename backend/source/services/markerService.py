from uuid import UUID

from errors.categoryNotFoundError import CategoryNotFoundError
from errors.markerNotFoundError import MarkerNotFoundError
from repositories import categoryRepository, markerRepository
from schemas.marker import CreateMarkerRequest, QueryMarkerRequest, UpdateMarkerRequest
from services import categoryService

marker_repository = markerRepository.MarkerRepository()
category_repository = categoryRepository.CategoryRepository()

class MarkerService:
    async def create(self, request: CreateMarkerRequest):
        if(request.category_id is not None):
            category = await category_repository.get_by_id(request.category_id)
            if(category is None):
                raise CategoryNotFoundError(request.category_id)
                    
        return await marker_repository.create(request)
        
    async def get_marker(self, id: UUID):
        marker = await marker_repository.get_by_id(id)

        if marker is None:
            raise MarkerNotFoundError(id)

        return marker
    
    async def get_all(self, query: QueryMarkerRequest):
        return await marker_repository.get_all(query)
    
    async def update(self, id: UUID, request: UpdateMarkerRequest):
        if request.category_id is not None:
            category = await category_repository.get_by_id(request.category_id)
            if category is None:
                raise CategoryNotFoundError(request.category_id)

        updated_marker = await marker_repository.update(id, request)

        if updated_marker is None:
            raise MarkerNotFoundError(id)
        
        return updated_marker
    
    async def delete(self, id: UUID):
        deleted_marker = await marker_repository.delete(id)

        if not deleted_marker:
            raise MarkerNotFoundError(id)
