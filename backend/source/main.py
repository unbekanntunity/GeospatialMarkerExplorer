from fastapi import FastAPI

from geospatial_marker_explorer_api.api.routes import markers

app = FastAPI(
    title="Geospatial Marker Explorer API"
)

app.include_router(
    markers.router,
    prefix="/markers",
    tags=["markers"]
)