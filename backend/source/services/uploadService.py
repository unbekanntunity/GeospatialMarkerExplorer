import os
import mimetypes
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from errors.fileTooLargeError import FileTooLargeError
from errors.unsupportedFileTypeError import UnsupportedFileTypeError
from schemas.imageFileResponse import ImageFile

class UploadService:
    def __init__(self):
        self.base_url = os.getenv("BASE_URL")
        self.upload_custom_base_path = "static/uploads/custom"
        self.upload_default_base_path = "static/uploads/default"

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

        extension = mimetypes.guess_extension(file.content_type)

        filename = f"{uuid4()}{extension}"

        filepath = Path(self.upload_custom_base_path) / filename

        content = await file.read()
        with filepath.open("wb") as buffer:
            buffer.write(content)

        return ImageFile(url=f"{self.base_url}/{Path(self.upload_custom_base_path)}/{filename}", name=filename)

    async def remove_file(self, url: str):
        if url.startswith("default"):
            return

        file_path = Path(url.lstrip("/"))

        if file_path.exists():
            file_path.unlink()

    async def get_files(self) -> list[ImageFile]:
        files = []

        files.extend(self.get_image_in_dir(Path(self.upload_default_base_path)))
        files.extend(self.get_image_in_dir(Path(self.upload_custom_base_path)))
   
        return files

    def get_file_size(self, file: UploadFile) -> int:
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)

        return size

    def get_image_in_dir(self, dir: Path) -> list[ImageFile]:
        files = []

        for file in dir.rglob("*"):
            if not file.is_file():
                continue

            mime_type, _ = mimetypes.guess_type(file)

            if mime_type not in self.allowed_types:
                continue

            iamgeFile = ImageFile(url=f"{self.base_url}/{Path(dir)}/{file.relative_to(dir)}", name=file.name)
            files.append(iamgeFile)

        return files