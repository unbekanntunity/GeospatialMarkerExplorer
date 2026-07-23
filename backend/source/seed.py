import asyncio

from database.connection import engine, SessionLocal
from database.models import Base, Marker


async def seed_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        result = await session.execute(
            Marker.__table__.select().limit(1)
        )

        marker_exists = result.first()

        if marker_exists:
            return

        markers = [
            Marker(
                name="Berlin",
                description="Example marker",
                latitude=52.5200,
                longitude=13.4050,
            ),
            Marker(
                name="Paris",
                description="Another example marker",
                latitude=48.8566,
                longitude=2.3522,
            ),
            Marker(
                name="Berlin we",
                description="Another example marker",
                latitude=57.5200,
                longitude=13.4050,
            ),
            Marker(
                name="Abc",
                description="Another example markerasdasdawdawd",
                latitude=48.8566,
                longitude=42.3522,
            ),
            Marker(
                name="Nowhere",
                description="Another example markerasdasdawdawd",
                latitude=48.8566,
                longitude=100.3522,
            ),
            Marker(
                name="Pew pew",
                description="Another example markerasdasdawdawd",
                latitude=9.8566,
                longitude=100.3522,
            ),
        ]
        session.add_all(markers)
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed_database())