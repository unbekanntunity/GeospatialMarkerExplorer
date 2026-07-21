from ast import stmt

from database.connection import SessionLocal
from database.models import Marker
from sqlalchemy import insert, select

class MarkerRepository:
    async def create(self, marker: Marker) -> Marker:
        statement = insert(Marker).values(**marker)

        async with SessionLocal() as session:
            created_marker = await session.execute(statement)
            await session.commit()

        return created_marker.scalar_one()
    
    async def get_by_id(self, id) -> Marker:
        statement = select(Marker).where(Marker.id == id)

        async with SessionLocal() as session:
            queried_marker = await session.execute(statement)
            await session.commit()

        return queried_marker.scalar_one_or_none()
    
    async def get_all(self) -> list[Marker]:
        statement = select(Marker)

        async with SessionLocal() as session:
            markers = await session.execute(statement)
            await session.commit()

        return markers.scalars().all()
    
    async def update(self, id, marker: Marker) -> Marker | None:
        statement = (
            select(Marker)
            .where(Marker.id == id)
        )

        async with SessionLocal() as session:
            result = await session.execute(statement)
            existing_marker = result.scalar_one_or_none()

            if existing_marker is None:
                return None

            for key, value in marker.items():
                setattr(existing_marker, key, value)

            await session.commit()

        return existing_marker
    
    async def delete(self, id) -> bool:
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