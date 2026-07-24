import mimetypes
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from errors import FileTooLargeError, UnsupportedFileTypeError

class UploadService:
    def __init__(self):
        self.upload_base_path = "static/uploads"
        self.upload_url = f"/{self.upload_base_path}"
        self.upload_dir = Path(self.upload_base_path)

        self.allowed_types = {
            "image/png",
            "image/jpeg",
            "image/webp",
        }

        self.max_file_size = 5 * 1024 * 1024 # "5 mb"

    async def upload_file(self, file: UploadFile):
        if file.content_type not in self.allowed_types:
            raise UnsupportedFileTypeError()

        size = self.get_file_size(file)
        if size > self.max_file_size:
            raise FileTooLargeError()

        self.upload_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        extension = mimetypes.guess_extension(file.content_type)

        filename = f"{uuid4()}{extension}"

        filepath = self.upload_dir / filename

        content = await file.read()
        with filepath.open("wb") as buffer:
            buffer.write(content)

        return f"{self.upload_url}/{filename}"

    async def remove_file(self, url: str):
        if url.startswith("default"):
            return

        file_path = Path(url.lstrip("/"))

        if file_path.exists():
            file_path.unlink()

    async def get_files(self):
        files = []

        for file in self.upload_dir.rglob("*"):
            if not file.is_file():
                continue

            mime_type, _ = mimetypes.guess_type(file)

            if mime_type not in self.allowed_types:
                continue

            files.append(
                f"{self.upload_url}/{file.relative_to(self.upload_dir)}"
            )

        return files

    def get_file_size(self, file: UploadFile):
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)

        return size