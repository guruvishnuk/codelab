from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Dict

from ..database import get_db
from ..models import User, Topic, Exercise
from ..auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])


def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Validate that the authenticated user possesses administrator privileges."""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not an admin")
    return current_user


class ExerciseCreate(BaseModel):
    title: str = Field(..., description="Exercise title")
    difficulty: str = Field(..., description="Exercise difficulty (easy, medium, hard)")
    prompt_md: str = Field(..., description="Instructions in Markdown")
    starter_code: str = Field(..., description="Initial starter code")
    test_cases: List[Dict[str, str]] = Field(..., description="List of test cases with input and expected output")


class ExerciseCreateResponse(BaseModel):
    message: str = Field(..., description="Confirmation message")
    exercise_id: int | None = Field(None, description="Created exercise ID")


@router.post(
    "/topics/{topic_id}/exercises",
    response_model=ExerciseCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create exercise under topic",
    description="Admin endpoint to append a new coding exercise and test cases to a topic.",
)
def create_exercise(
    topic_id: int,
    exercise: ExerciseCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Add a new exercise to an existing curriculum topic."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")

    # Put the new exercise at the end of the topic exercise list
    position = db.query(Exercise).filter(Exercise.topic_id == topic_id).count() + 1

    new_ex = Exercise(**exercise.model_dump(), topic_id=topic_id, position=position)
    db.add(new_ex)
    db.commit()
    db.refresh(new_ex)

    return {"message": "Exercise added securely!", "exercise_id": new_ex.id}
