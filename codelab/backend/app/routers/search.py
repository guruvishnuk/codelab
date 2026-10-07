from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from ..models import Topic, Exercise
from pydantic import BaseModel

router = APIRouter(prefix="/api/search", tags=["search"])

class SearchResult(BaseModel):
    topics: list[dict]
    exercises: list[dict]

@router.get("", response_model=SearchResult)
def search(q: str = "", db: Session = Depends(get_db)):
    if not q or len(q.strip()) == 0:
        return {"topics": [], "exercises": []}
        
    search_term = f"%{q.strip()}%"
    
    # Search topics
    topics_query = db.query(Topic).filter(
        or_(
            Topic.title.ilike(search_term),
            Topic.summary.ilike(search_term),
            Topic.notes_md.ilike(search_term)
        )
    ).limit(5).all()
    
    # Search exercises
    exercises_query = db.query(Exercise).filter(
        or_(
            Exercise.title.ilike(search_term),
            Exercise.prompt_md.ilike(search_term)
        )
    ).limit(10).all()
    
    return {
        "topics": [{"slug": t.slug, "title": t.title, "summary": t.summary} for t in topics_query],
        "exercises": [{"id": e.id, "topic_slug": e.topic.slug, "title": e.title, "difficulty": e.difficulty} for e in exercises_query]
    }
