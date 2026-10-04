from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any

from ..database import get_db
from ..models import User, Topic, Exercise
from ..auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

# THE SECURITY BOUNCER
def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    return current_user

# Data structures we expect from the frontend form
class ExerciseCreate(BaseModel):
    title: str
    difficulty: str
    prompt_md: str
    starter_code: str
    test_cases: List[Dict[str, str]]

@router.post("/topics/{topic_id}/exercises")
def create_exercise(
    topic_id: int, 
    exercise: ExerciseCreate, 
    db: Session = Depends(get_db), 
    admin: User = Depends(get_admin_user) # Requires admin!
):
    # Find the parent topic
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
        
    # Put the new exercise at the end of the list
    position = db.query(Exercise).filter(Exercise.topic_id == topic_id).count() + 1
    
    new_ex = Exercise(**exercise.model_dump(), topic_id=topic_id, position=position)
    db.add(new_ex)
    db.commit()
    
    return {"message": "Exercise added securely!"}