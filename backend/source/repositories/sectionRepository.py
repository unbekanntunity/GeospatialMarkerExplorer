from uuid import UUID

from sqlalchemy import select

from database.connection import SessionLocal
from database.models import Marker, Section
from schemas.section import CreateSectionRequest, UpdateSectionRequest
from sqlalchemy.orm import selectinload


class SectionRepository:
    async def create(self, section: CreateSectionRequest):
        async with SessionLocal() as session:
            marker_statement = select(Marker).where(Marker.id.in_(section.marker_ids))
            result = await session.execute(marker_statement)
            markers = result.scalars().all()

            new_section = Section(
                name=section.name,
                description=section.description,
                markers=markers,
            )

            session.add(new_section)
            await session.commit()

            section_statement = select(Section).options(
                selectinload(Section.markers).selectinload(Marker.category)
            )
            result = await session.execute(section_statement)
            new_section = result.scalar_one()

            return new_section

    async def get_by_id(self, id) -> Section:
        statement = (
            select(Section)
            .options(selectinload(Section.markers).selectinload(Marker.category))
            .where(Section.id == id)
        )
        
        async with SessionLocal() as session:
            queried_section = await session.execute(statement)

        return queried_section.scalar_one_or_none()

    async def get_all(self) -> list[Section]:
        statement = select(Section).options(
            selectinload(Section.markers).selectinload(Marker.category)
        )

        async with SessionLocal() as session:
            result = await session.execute(statement)

            return result.scalars().all()

    async def update(self, id, marker: UpdateSectionRequest) -> Section | None:
        statement = (
            select(Section)
            .options(
                selectinload(Section.markers).selectinload(Marker.category)
            )
            .where(Section.id == id)
        )

        async with SessionLocal() as session:
            result = await session.execute(statement)
            existing_section = result.scalar_one_or_none()

            if existing_section is None:
                return None

            for key, value in marker.model_dump(exclude_unset=True).items():
                setattr(existing_section, key, value)


            if marker.marker_ids is not None:
                markers_result = await session.execute(
                    select(Marker).where(Marker.id.in_(marker.marker_ids))
                )
                existing_section.markers = list(markers_result.scalars().all())

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