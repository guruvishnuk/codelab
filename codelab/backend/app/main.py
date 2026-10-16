import os
from .routers import exercises, topics, users, admin, search
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, SessionLocal
from .seed import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed(db)
    yield


app = FastAPI(title="CodeLab API", lifespan=lifespan)

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


@app.get("/api/health")
def health():
    return {"status": "ok"}
