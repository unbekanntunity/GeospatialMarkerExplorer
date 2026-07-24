from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID


class Base(DeclarativeBase):
    pass


class Marker(Base):
    __tablename__ = "markers"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        nullable=True,
    )

    latitude: Mapped[float] = mapped_column(
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        nullable=False,
    )

    category_id: Mapped[UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id"),
        nullable=True,
    )

    category: Mapped["Category | None"] = relationship(
        back_populates="markers"
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        nullable=True,
    )
   
    icon_url: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    markers: Mapped[list["Marker"]] = relationship(
        back_populates="category"
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )