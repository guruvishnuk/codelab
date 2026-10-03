from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Exercise, Submission
from ..schemas import ExerciseDetail, RunRequest, RunResponse, TestResult
from ..runner import run_python

router = APIRouter(prefix="/api/exercises", tags=["exercises"])


@router.get("/{exercise_id}", response_model=ExerciseDetail)
def get_exercise(exercise_id: int, db: Session = Depends(get_db)):
    ex = db.get(Exercise, exercise_id)
    if not ex:
        raise HTTPException(404, "Exercise not found")
    return ExerciseDetail(
        id=ex.id, title=ex.title, difficulty=ex.difficulty,
        prompt_md=ex.prompt_md, starter_code=ex.starter_code,
        topic_slug=ex.topic.slug,
        next_exercise_id=_next_exercise_id(db, ex),
    )


def _next_exercise_id(db: Session, current: Exercise) -> int | None:
    """Return the id of the next exercise in the same topic, or None."""
    next_ex = (
        db.query(Exercise)
        .filter(Exercise.topic_id == current.topic_id,
                Exercise.position > current.position)
        .order_by(Exercise.position)
        .first()
    )
    return next_ex.id if next_ex else None


@router.post("/{exercise_id}/run", response_model=RunResponse)
def run_exercise(exercise_id: int, body: RunRequest, db: Session = Depends(get_db)):
    ex = db.get(Exercise, exercise_id)
    if not ex:
        raise HTTPException(404, "Exercise not found")

    results = []
    for case in ex.test_cases:
        out, err = run_python(body.code, case["input"])
        results.append(TestResult(
            passed=(not err and out == case["expected"].strip()),
            input=case["input"], expected=case["expected"],
            actual=out, error=err,
        ))

    all_passed = all(r.passed for r in results)
    db.add(Submission(exercise_id=ex.id, code=body.code, passed=all_passed))
    db.commit()
    return RunResponse(passed=all_passed, results=results)
