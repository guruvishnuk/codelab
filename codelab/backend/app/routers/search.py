from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, Field
from ..database import get_db
from ..models import Topic, Exercise

router = APIRouter(prefix="/api/search", tags=["search"])


class SearchTopicResult(BaseModel):
    slug: str = Field(..., description="Topic slug")
    title: str = Field(..., description="Topic title")
    summary: str = Field(..., description="Topic summary")


class SearchExerciseResult(BaseModel):
    id: int = Field(..., description="Exercise ID")
    topic_slug: str = Field(..., description="Parent topic slug")
    title: str = Field(..., description="Exercise title")
    difficulty: str = Field(..., description="Exercise difficulty")


class SearchResult(BaseModel):
    topics: list[SearchTopicResult] = Field(default_factory=list, description="Matching topics")
    exercises: list[SearchExerciseResult] = Field(default_factory=list, description="Matching exercises")


@router.get(
    "",
    response_model=SearchResult,
    summary="Search curriculum content",
    description="Search across topics and exercise prompts matching the given search query string.",
)
def search(
    q: str = Query(default="", description="Keyword search term for topics or exercises"),
    db: Session = Depends(get_db),
):
    """Search topics and exercises by text substring match."""
    if not q or len(q.strip()) == 0:
        return {"topics": [], "exercises": []}

    search_term = f"%{q.strip()}%"

    # Search topics
    topics_query = (
        db.query(Topic)
        .filter(
            or_(
                Topic.title.ilike(search_term),
                Topic.summary.ilike(search_term),
                Topic.notes_md.ilike(search_term),
            )
        )
        .limit(5)
        .all()
    )

    # Search exercises
    exercises_query = (
        db.query(Exercise)
        .filter(
            or_(
                Exercise.title.ilike(search_term),
                Exercise.prompt_md.ilike(search_term),
            )
        )
        .limit(10)
        .all()
    )

    return {
        "topics": [{"slug": t.slug, "title": t.title, "summary": t.summary} for t in topics_query],
        "exercises": [
            {"id": e.id, "topic_slug": e.topic.slug, "title": e.title, "difficulty": e.difficulty}
            for e in exercises_query
        ],
    }
