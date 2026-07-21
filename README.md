# Full Stack Developer Coding Challenge

## Overview

Build a **Geospatial Marker Explorer**—a small web application that displays location-based data on an interactive map with filtering and basic CRUD operations.

**While we have stated some requirements, it is totally fine if you do not complete everything. If you run into challenges or run out of time, write down the problems you faced and how you would plan on handling those with more time. We value your thought process and problem-solving approach as much as the final result.**

---

## Tech Stack

You must use the following technologies:

- **Database:** PostgreSQL (PostGIS extension optional but encouraged)
- **Backend:** FastAPI (Python) with SQLAlchemy ORM
- **Frontend:** React with TypeScript
- **Containerization:** Docker + Docker Compose

---

## Provided Scaffolding

- **`backend/`** — Python project with a prepared `pyproject.toml` (dependencies below), no application code yet
- **`frontend/`** — React + TypeScript single-page application scaffold built with Vite
- **`docker-compose.yaml`** — database service preconfigured, application service left as a TODO
- **`Dockerfile`** — empty (TODO), meant to bundle backend and frontend into a single image

### Backend Dependencies (`backend/pyproject.toml`)

The backend requires **Python >= 3.13** and ships with the following pinned runtime dependencies:

```toml
dependencies = [
  "sqlalchemy==2.0.46",        # ORM
  "sqlalchemy-utils==0.41.2",  # SQLAlchemy utility collection
  "asyncpg==0.30.0",           # async PostgreSQL driver
  "fastapi==0.119.0",          # web framework
  "pydantic==2.12.3",          # data validation & serialization
  "uvicorn[standard]==0.34.0", # ASGI server
]
```

### Frontend Dependencies (`frontend/package.json`)

The frontend is a Vite scaffold with the following runtime dependencies:

```jsonc
"dependencies": {
  "@types/leaflet": "^1.9.21", // TypeScript definitions for Leaflet
  "leaflet": "^1.9.4",         // interactive map library
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-leaflet": "^5.0.0"    // React components for Leaflet
}
```

The dev toolchain consists of **Vite 7** (`vite`, `@vitejs/plugin-react`), **TypeScript 5.9** (`typescript`, `typescript-eslint`, `@types/*`) and **ESLint 9** (`eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`). Useful scripts: `npm run dev` (dev server), `npm run build` (type-check + production build), `npm run lint` and `npm run preview`.

### Docker Compose Scaffolding (`docker-compose.yaml`)

A PostgreSQL 18 database with the PostGIS 3.6 extension is already configured — you only need to add your application container:

```yaml
services:
  database:
    container_name: database
    image: postgis/postgis:18-3.6
    restart: unless-stopped
    ports:
      - 5432:5432
    environment:
      POSTGRES_PASSWORD: password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 15s
      timeout: 10s
      retries: 5

  application:
    # TODO your application container
```

During development the database is reachable at `localhost:5432` (user `postgres`, password `password`, database `postgres`); from inside the compose network use the hostname `database` instead. The healthcheck lets your application container wait for the database to become ready (`depends_on` with `condition: service_healthy`).

---

## Requirements

### Data Model

Create a `Marker` entity with fields that you consider appropriate for a geospatial marker. Think about what information would be useful to store and display.

### Backend (FastAPI + SQLAlchemy)

Implement a REST API with the following endpoints:

| Method | Endpoint        | Description                                |
| ------ | --------------- | ------------------------------------------ |
| GET    | `/markers`      | List all markers (with optional filtering) |
| GET    | `/markers/{id}` | Get a single marker by ID                  |
| POST   | `/markers`      | Create a new marker                        |
| PUT    | `/markers/{id}` | Update an existing marker                  |
| DELETE | `/markers/{id}` | Delete a marker                            |

**Filtering (via query parameters on GET `/markers`):**

- For example: filter by `category`, search by `name` (partial match)
- Consider what other filtering options might be useful when working with geospatial data

### Frontend (React + TypeScript)

Build a single-page application with:

1. **Interactive Map**

   - Display all markers on a map
   - Using the mapping library Leaflet with OpenStreetMap as the tile provider (free, no API key required)
   - Clicking a marker shows a popup with its details

2. **Filter Panel**

   - Filter markers by category (dropdown or checkboxes)
   - Search markers by name

3. **Add Marker**

   - Form to create a new marker
   - User can either enter coordinates manually or click on the map to set location

4. **Edit Marker**

   - Ability to edit an existing marker's details
   - Changes reflect on the map immediately

5. **Delete Marker**
   - Ability to delete a marker with confirmation
   - Marker is removed from the map

### Infrastructure

- Bundle the backend and frontend into a single container
- Complete the provided `docker-compose.yaml` so that it spins up the entire application (database + application container)
- Application should be runnable with a single `docker-compose up` command

---

## User Stories Summary

As a user, I can:

- View an interactive map with markers
- Click on a marker to see its details
- Filter markers by category
- Search for markers by name
- Add a new marker by filling out a form and selecting a location on the map
- Edit an existing marker's information
- Delete a marker I no longer need

---

## Optional Tasks

If you have additional time and want to demonstrate more advanced skills, consider implementing one or both of the following:

### Sections (Linestrings)

- A `Section` represents a linestring (a series of connected coordinates)
- Users can draw sections on the map by clicking multiple points
- Sections are stored in the backend via a `/sections` API
- Sections are displayed on the map as connected lines
- Basic CRUD operations for sections (create, read, update, delete)

### Earthquake Data Import

- Fetch real earthquake data from the USGS Earthquake API and load it into the system as markers
- Example API call: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2025-01-30&limit=20000`
- The query parameters above are just an example—feel free to adjust the date range and limit
- Load as much data as you are comfortable handling
- This is an opportunity to demonstrate how you handle larger datasets and external data sources

---

## Questions?

If you have any questions or need clarification, please don't hesitate to reach out.

Good luck! We're excited to see what you build.
