import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, SessionLocal
from .seed import seed
from .routers import exercises, topics, users, admin, search


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed(db)
    yield


openapi_tags = [
    {"name": "topics", "description": "Operations to fetch curriculum topics and exercise listings."},
    {"name": "exercises", "description": "Operations for exercise prompts, navigation, and code execution."},
    {"name": "users", "description": "User profile, progression, streak, and dashboard analytics."},
    {"name": "search", "description": "Search topics and exercises by keyword query."},
    {"name": "admin", "description": "Administrative actions and curriculum content creation."},
]

app = FastAPI(
    title="CodeLab API",
    description="Interactive Python learning platform API with sandboxed code execution, gamification, and curriculum management.",
    version="1.0.0",
    openapi_tags=openapi_tags,
    lifespan=lifespan,
)

frontend_origins_raw = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000,https://codelab-amber.vercel.app")
allow_origins = [o.strip() for o in frontend_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins if "*" not in allow_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(topics.router)
app.include_router(exercises.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(search.router)


@app.get("/api/health", summary="Health check", tags=["health"])
def health():
    """Returns the operational status of the CodeLab API service."""
    return {"status": "ok"}
