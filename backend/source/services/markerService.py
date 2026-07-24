from uuid import UUID

from errors import MarkerNotFoundError
from repositories import markerRepository
from schemas.marker import CreateMarkerRequest, QueryMarkerRequest, UpdateMarkerRequest

marker_repository = markerRepository.MarkerRepository()

class MarkerService:
    async def create(self, request: CreateMarkerRequest):
        return await marker_repository.create(request)
        
    async def get_marker(self, id: UUID):
        marker = await marker_repository.get_by_id(id)

        if marker is None:
            raise MarkerNotFoundError(id)

        return marker
    
    async def get_all(self, query: QueryMarkerRequest):
        return await marker_repository.get_all(query)
    
    async def update(self, id: UUID, request: UpdateMarkerRequest):
        updated_marker = await marker_repository.update(id, request)

        if updated_marker is None:
            raise MarkerNotFoundError(id)
        
        return updated_marker
    
    async def delete(self, id: UUID):
        deleted_marker = await marker_repository.delete(id)

        if not deleted_marker:
            raise MarkerNotFoundError(id)
