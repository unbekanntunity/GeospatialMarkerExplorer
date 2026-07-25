from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from schemas.marker import MarkerResponse


class CreateSectionRequest(BaseModel): 
    name: str
    description: str | None
    marker_ids: list[str]

class UpdateSectionRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    marker_ids: list[str] | None = None

class SectionResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    markers: list[MarkerResponse]

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
