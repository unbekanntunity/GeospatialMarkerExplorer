from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from errors import FileTooLargeError, UnsupportedFileTypeError

class UploadService:
    def __init__(self):
        self.upload_dir = Path("static/uploads")
        self.allowed_types: {
            "image/png",
            "image/jpeg",
            "image/webp",
        }
        self.max_file_size = 5 * 1024 * 1024 # "5 mb"

    async def upload_file(self, file: UploadFile):
        if file.content_type not in self.allowed_types:
            raise UnsupportedFileTypeError()

        if len(content) > self.max_file_size:
            raise FileTooLargeError()

        self.upload_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        extension = file.filename.split(".")[-1]

        filename = f"{uuid4()}.{extension}"

        filepath = self.upload_dir / filename

        content = await file.read()

        with filepath.open("wb") as buffer:
            buffer.write(content)

        return f"/static/uploads/{filename}"

    async def remove_file(self, url: str):
        if url.startswith("default"):
            return

        file_path = Path(url.lstrip("/"))

        if file_path.exists():
            file_path.unlink()