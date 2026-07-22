from fastapi import FastAPI

from routes import markers


app = FastAPI(
    title="Geospatial Marker Explorer API"
)

app.include_router(
    markers.router,
    prefix="/markers",
    tags=["markers"]
)