
from uuid import UUID

from pydantic import BaseModel, ConfigDict

class CreateCategoryRequest(BaseModel):
    name: str
    description: str | None = None
    icon_url: str | None = None

class UpdateCategoryRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    icon_url: str | None = None

class QueryCategoryRequest(BaseModel):
    name: str | None = None

class CategoryResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    icon_url: str | None

    model_config = ConfigDict(
        from_attributes=True
    )