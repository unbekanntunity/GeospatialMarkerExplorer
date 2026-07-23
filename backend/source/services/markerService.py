from uuid import UUID

from database.models import Marker
from errors import MarkerNotFoundError
from repositories import markerRepository
from schemas.marker import CreateMarkerRequest, UpdateMarkerRequest

marker_repository = markerRepository.MarkerRepository()

class MarkerService:
    async def create(self, request: CreateMarkerRequest):
        marker = Marker(
            name=request.name,
            description=request.description,
            latitude=request.latitude,
            longitude=request.longitude,
            tags=request.tags,
        )

        return await marker_repository.create(marker)
        
    async def get_marker(self, id: UUID):
        marker = await marker_repository.get_by_id(id)

        if marker is None:
            raise MarkerNotFoundError(id)

        return marker
    
    async def get_all(self):
        return await marker_repository.get_all()
    
    async def update(self, id: UUID, marker: UpdateMarkerRequest):
        marker_to_update = Marker(
            name=marker.name,
            description=marker.description,
            latitude=marker.latitude,
            longitude=marker.longitude,
            tags=marker.tags,
        )

        updated_marker = await marker_repository.update(id, marker_to_update)

        if updated_marker is None:
            raise MarkerNotFoundError(id)
        
        return updated_marker
    
    async def delete(self, id: UUID):
        deleted_marker = await marker_repository.delete(id)

        if not deleted_marker:
            raise MarkerNotFoundError(id)
