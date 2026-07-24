import asyncio

from database.connection import engine, SessionLocal
from database.models import Base, Category, Marker

async def seed_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        marker_table_result = await session.execute(
            Marker.__table__.select().limit(1)
        )
        category_table_result = await session.execute(
            Category.__table__.select().limit(1)
        )

        marker_exists = marker_table_result.first()
        category_exists = category_table_result.first()

        if marker_exists or category_exists:
            return

        restaurant = Category(
            name="Restaurant",
            description="michelin restuarants",
            icon_url="/static/category-icons/restaurant.webp"
        )
        parking = Category(
            name="Parking",
            description="Good parking spots",
            icon_url="/static/category-icons/parking.webp"
        )
        museum = Category(
            name="Museum",
            icon_url="/static/category-icons/museum.webp"
        )

        session.add_all([restaurant, parking, museum])

        markers = [
            Marker(
                name="Berlin parking",
                description="Example marker",
                latitude=52.5200,
                longitude=13.4050,
                category = parking
            ),
            Marker(
                name="Paris museum",
                description="Another example marker",
                latitude=48.8566,
                longitude=2.3522,
                category = museum
            ),
            Marker(
                name="Restaurant al fonso",
                description="Another example marker",
                latitude=57.5200,
                longitude=13.4050,
                category = restaurant
            ),
            Marker(
                name="Restaurant",
                latitude=48.8566,
                longitude=42.3522,
                category = restaurant
            ),
            Marker(
                name="Museum",
                description="Extremly long description. Extremly long description. Extremly long description. Extremly long description",
                latitude=48.8566,
                longitude=100.3522,
                category = museum
            ),
            Marker(
                name="No Category",
                latitude=9.8566,
                longitude=100.3522,
            ),
        ]
        session.add_all(markers)
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed_database())