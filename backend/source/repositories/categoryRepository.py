from uuid import UUID

from database.connection import SessionLocal
from database.models import Category, Marker
from sqlalchemy import select

from schemas.category import CreateCategoryRequest, QueryCategoryRequest, UpdateCategoryRequest

class CategoryRepository:
    async def create(self, category: CreateCategoryRequest) -> Marker:
        new_Category = Category(
            name=category.name,
            description=category.description,
            icon_url=category.icon_url
        )

        async with SessionLocal() as session:
            session.add(new_Category)
            await session.commit()
            await session.refresh(category)

            return category
    
    async def get_all(self, query: QueryCategoryRequest) -> list[Marker]:
        statement = select(Category)

        filters = []

        if query.name is not None:
            filters.append(query.name in Category.name)

        statement = statement.where(*filters)

        async with SessionLocal() as session:
            result = await session.execute(statement)
            return result.scalars().all()
    
    
    async def update(self, id, marker: UpdateCategoryRequest) -> Marker | None:
        statement = (
            select(Category)
            .where(Category.id == id)
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
            select(Category)
            .where(Category.id == id)
        )

        async with SessionLocal() as session:
            result = await session.execute(statement)
            existing_category = result.scalar_one_or_none()

            if existing_category is None:
                return False

            await session.delete(existing_category)
            await session.commit()

        return True