from fastapi import FastAPI

from routes import categories, markers


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