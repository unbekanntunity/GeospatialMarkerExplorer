from uuid import UUID

from errors.markerNotFoundError import MarkerNotFoundError
from errors.sectionNotFoundError import SectionNotFoundError
from repositories import markerRepository, sectionRepository
from schemas.section import CreateSectionRequest, UpdateSectionRequest

marker_repository = markerRepository.MarkerRepository()
section_repository = sectionRepository.SectionRepository()

class SectionService:
    async def create_section(self, request: CreateSectionRequest):
        if len(request.marker_ids) <= 1:
            raise ValueError("You need at least two markers")

        for marker_id in request.marker_ids:
            marker = await marker_repository.get_by_id(marker_id)
            if marker is None:
                raise MarkerNotFoundError(id)

        return await section_repository.create(request)
            
    async def get_section(self, id: UUID):
        section = await section_repository.get_by_id(id)

        if section is None:
            raise SectionNotFoundError(id)

        return section
    
    async def get_all(self):
        return await section_repository.get_all()
    
    async def update(self, id: UUID, request: UpdateSectionRequest):
        if len(request.marker_ids) <= 1:
            raise ValueError("You need at least two markers")

        for marker_id in request.marker_ids:
            marker = await marker_repository.get_by_id(marker_id)
            if marker is None:
                raise MarkerNotFoundError(marker_id)

        updated_Section = await section_repository.update(id, request)

        if updated_Section is None:
            raise SectionNotFoundError(id)
        
        return updated_Section
    
    async def delete(self, id: UUID):
        deleted_marker = await section_repository.delete(id)

        if not deleted_marker:
            raise SectionNotFoundError(id)