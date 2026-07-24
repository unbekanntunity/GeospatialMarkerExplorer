from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from routes import categories, images, markers


app = FastAPI(
    title="Geospatial Marker Explorer API"
)

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static",
)

app.include_router(
    markers.router,
    prefix="/markers",
    tags=["markers"]
)

app.include_router(
    categories.router,
    prefix="/categories",
    tags=["categories"]
)

app.include_router(
    images.router,
    prefix="/images",
    tags=["images"]
)
