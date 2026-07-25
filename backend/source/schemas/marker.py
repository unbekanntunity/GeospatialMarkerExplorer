from datetime import datetime
from typing import Annotated
from uuid import UUID, uuid4
from fastapi import Query
from pydantic import BaseModel, ConfigDict

from schemas.category import CategoryResponse

class CreateMarkerRequest(BaseModel):
    name: str
    description: str | None = None
    latitude: float
    longitude: float
    category_id: UUID | None = None

class UpdateMarkerRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    category_id: UUID | None = None

class QueryMarkerRequest(BaseModel):
    name: str | None = None
    category_ids: Annotated[list[UUID] | None, Query()] = None

class MarkerResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    latitude: float
    longitude: float
    category: CategoryResponse | None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )