from pydantic import BaseModel

class ImageFileResponse(BaseModel):
    url: str