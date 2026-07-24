from pydantic import BaseModel

class ImageFile(BaseModel):
    url: str
    name: str

class ImageFileResponse(BaseModel):
    url: str
    name: str