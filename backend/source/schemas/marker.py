import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel, ConfigDict

class CreateMarkerRequest(BaseModel):
    name: str
    description: str | None = None
    latitude: float
    longitude: float
    tags: list[str] = []


class UpdateMarkerRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    tags: list[str] | None = None


class MarkerResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    latitude: float
    longitude: float
    tags: list[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )