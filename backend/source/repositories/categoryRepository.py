from uuid import UUID

from database.connection import SessionLocal
from database.models import Category
from sqlalchemy import exists, select

from schemas.category import CreateCategoryRequest, QueryCategoryRequest, UpdateCategoryRequest

class CategoryRepository:
    async def create(self, category: CreateCategoryRequest) -> Category:
        new_category = Category(
            name=category.name,
            description=category.description,
            icon_url=category.icon_url
        )

        async with SessionLocal() as session:
            session.add(new_category)
            await session.commit()
            await session.refresh(new_category)

            return new_category

    async def get_by_id(self, id) -> Category:
        statement = select(Category).where(Category.id == id)

        async with SessionLocal() as session:
            category = await session.execute(statement)

        return category.scalar_one_or_none()
    
    async def get_all(self, query: QueryCategoryRequest) -> list[Category]:
        statement = select(Category)

        filters = []

        if query.name is not None:
            filters.append(query.name in Category.name)

        statement = statement.where(*filters)

        async with SessionLocal() as session:
            result = await session.execute(statement)
            return result.scalars().all()
    
    
    async def update(self, id, marker: UpdateCategoryRequest) -> Category | None:
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

    async def is_icon_used(
        self,
        icon_url: str,
        exclude_id: UUID | None = None,
    ) -> bool:
        async with SessionLocal() as session:
            statement = select(
                exists().where(Category.icon_url == icon_url)
            )

            if exclude_id:
                statement = statement.where(
                    Category.id != exclude_id
                )

            result = await session.execute(statement)

            return result.scalar()