from uuid import UUID

from database.connection import SessionLocal
from database.models import Marker
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from schemas.marker import CreateMarkerRequest, QueryMarkerRequest, UpdateMarkerRequest

class MarkerRepository:
    async def create(self, marker: CreateMarkerRequest) -> Marker:
        new_marker = Marker(
            name=marker.name,
            description=marker.description,
            latitude=marker.latitude,
            longitude=marker.longitude,
            category_id=marker.category_id
        )
                
        async with SessionLocal() as session:
            session.add(new_marker)
            await session.commit()
            await session.refresh(new_marker, attribute_names=["category"]), 

            return new_marker
    
    async def get_by_id(self, id) -> Marker:
        statement = select(Marker).where(Marker.id == id)

        async with SessionLocal() as session:
            queried_marker = await session.execute(statement)

        return queried_marker.scalar_one_or_none()

    async def get_all(self, query: QueryMarkerRequest) -> list[Marker]:
        statement = select(Marker).options(
            selectinload(Marker.category)
        )

        filters = []

        if query.name:
            filters.append(
                Marker.name.ilike(f"%{query.name}%")
            )
            
        if query.category_ids:
            filters.append(Marker.category_id.in_(query.category_ids))

        if filters:
            statement = statement.where(*filters)

        async with SessionLocal() as session:
            result = await session.execute(statement)

            return result.scalars().all()
    
    async def update(self, id, marker: UpdateMarkerRequest) -> Marker | None:
        statement = (
            select(Marker)
            .options(selectinload(Marker.category))
            .where(Marker.id == id)
        )

        async with SessionLocal() as session:
            result = await session.execute(statement)
            existing_marker = result.scalar_one_or_none()

            if existing_marker is None:
                return None

            for key, value in marker.model_dump(exclude_unset=True).items():
                setattr(existing_marker, key, value)

            await session.commit()
            await session.refresh(existing_marker)

            return existing_marker
    
    async def delete(self, id: UUID) -> bool:
        statement = (
            select(Marker)
            .where(Marker.id == id)
        )

        async with SessionLocal() as session:
            result = await session.execute(statement)
            existing_marker = result.scalar_one_or_none()

            if existing_marker is None:
                return False

            await session.delete(existing_marker)
            await session.commit()

        return True