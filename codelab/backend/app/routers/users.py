from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Exercise, Submission, User
from ..schemas import DashboardResponse, DashboardStats, DashboardExercise
from ..auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. How many exercises exist in total across all topics?
    total_exercises = db.query(Exercise).count()

    # 2. How many UNIQUE exercises has this user solved?
    # We use func.distinct() because a user might submit the correct answer 5 times 
    # to the same exercise, and we only want to count it once.
    solved_count = (
        db.query(func.count(func.distinct(Submission.exercise_id)))
        .filter(Submission.user_id == current_user.id, Submission.passed == True)
        .scalar()
    ) or 0

    # 3. Get the actual IDs of the exercises they solved
    solved_submissions = (
        db.query(Submission.exercise_id)
        .filter(Submission.user_id == current_user.id, Submission.passed == True)
        .distinct()
        .all()
    )
    solved_exercise_ids = [s[0] for s in solved_submissions]

    # 4. Fetch the full details of those exercises so the frontend can display them
    exercises = db.query(Exercise).filter(Exercise.id.in_(solved_exercise_ids)).all()

    recent_solved = []
    for ex in exercises:
        recent_solved.append(
            DashboardExercise(
                id=ex.id,
                title=ex.title,
                topic_slug=ex.topic.slug,
                difficulty=ex.difficulty
            )
        )

    return DashboardResponse(
        stats=DashboardStats(
            total_exercises=total_exercises,
            solved_exercises=solved_count
        ),
        recent_solved=recent_solved
    )
