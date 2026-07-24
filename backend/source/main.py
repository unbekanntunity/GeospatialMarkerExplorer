from fastapi import FastAPI

from routes import categories, images, markers


app = FastAPI(
    title="Geospatial Marker Explorer API"
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