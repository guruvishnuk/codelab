from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Topic, Submission, User
from ..schemas import TopicSummary, TopicDetail
from ..auth import get_optional_current_user

router = APIRouter(prefix="/api/topics", tags=["topics"])


@router.get("", response_model=list[TopicSummary])
def list_topics(db: Session = Depends(get_db)):
    return db.query(Topic).order_by(Topic.position).all()


@router.get("/{slug}", response_model=TopicDetail)
def get_topic(
    slug: str, 
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user)
):
    topic = db.query(Topic).filter(Topic.slug == slug).first()
    if not topic:
        raise HTTPException(404, "Topic not found")
        
    exercises_with_solved = []
    for ex in topic.exercises:
        is_solved = False
        # Only check if they solved it if they are actually logged in
        if current_user:
            is_solved = db.query(Submission).filter(
                Submission.exercise_id == ex.id,
                Submission.user_id == current_user.id,
                Submission.passed == True
            ).first() is not None
        
        exercises_with_solved.append({
            "id": ex.id,
            "title": ex.title,
            "difficulty": ex.difficulty,
            "solved": is_solved
        })
        
    return {
        "slug": topic.slug,
        "title": topic.title,
        "summary": topic.summary,
        "notes_md": topic.notes_md,
        "exercises": exercises_with_solved
    }
