from uuid import UUID

from sqlalchemy import select

from database.connection import SessionLocal
from database.models import Marker, Section
from schemas.section import CreateSectionRequest, UpdateSectionRequest
from sqlalchemy.orm import selectinload


class SectionRepository:
    async def create(self, section: CreateSectionRequest):
        async with SessionLocal() as session:
            statement = select(Marker).where(Marker.id.in_(section.marker_ids))
            result = await session.execute(statement)
            markers = result.scalars().all()

            new_section = Section(
                name=section.name,
                description=section.description,
                markers=markers,
            )

            session.add(new_section)
            await session.commit()
            await session.refresh(new_section)

            return new_section

    async def get_by_id(self, id) -> Section:
        statement = select(Section).where(Section.id == id)

        async with SessionLocal() as session:
            queried_section = await session.execute(statement)

        return queried_section.scalar_one_or_none()

    async def get_all(self) -> list[Section]:
            statement = select(Section).options(
                selectinload(Section.markers)
            )
    
            async with SessionLocal() as session:
                result = await session.execute(statement)
    
                return result.scalars().all()

    async def update(self, id, marker: UpdateSectionRequest) -> Marker | None:
        statement = (
            select(Section)
            .where(Section.id == id)
        )

        async with SessionLocal() as session:
            result = await session.execute(statement)
            existing_section = result.scalar_one_or_none()

            if existing_section is None:
                return None

            for key, value in marker.model_dump(exclude_unset=True).items():
                setattr(existing_section, key, value)

            await session.commit()
            await session.refresh(existing_section)

            return existing_section
        
    async def delete(self, id: UUID) -> bool:
        statement = (
            select(Section)
            .where(Section.id == id)
        )

        async with SessionLocal() as session:
            result = await session.execute(statement)
            existing_section = result.scalar_one_or_none()

            if existing_section is None:
                return False

            await session.delete(existing_section)
            await session.commit()

        return True