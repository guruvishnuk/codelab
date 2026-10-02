from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Topic
from ..schemas import TopicSummary, TopicDetail

router = APIRouter(prefix="/api/topics", tags=["topics"])


@router.get("", response_model=list[TopicSummary])
def list_topics(db: Session = Depends(get_db)):
    return db.query(Topic).order_by(Topic.position).all()


@router.get("/{slug}", response_model=TopicDetail)
def get_topic(slug: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.slug == slug).first()
    if not topic:
        raise HTTPException(404, "Topic not found")
    return topic
