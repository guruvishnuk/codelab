from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Exercise, Submission, User
from ..schemas import (
    DashboardResponse,
    DashboardStats,
    DashboardExercise,
    LevelInfo,
    Badge,
)
from ..auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

LEVEL_TIERS = [
    (1, "Novice Coder", 0, 150),
    (2, "Python Apprentice", 150, 350),
    (3, "Code Crafter", 350, 700),
    (4, "Logic Master", 700, 1200),
    (5, "Pythonista Grandmaster", 1200, 2000),
]


@router.get("/me/dashboard", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    total_exercises = db.query(Exercise).count()

    # Unique solved exercises
    solved_submissions = (
        db.query(Submission.exercise_id)
        .filter(Submission.user_id == current_user.id, Submission.passed == True)
        .distinct()
        .all()
    )
    solved_exercise_ids = [s[0] for s in solved_submissions]
    solved_count = len(solved_exercise_ids)

    exercises = db.query(Exercise).filter(Exercise.id.in_(solved_exercise_ids)).all() if solved_exercise_ids else []

    # Calculate XP based on difficulty
    diff_xp = {"easy": 50, "medium": 100, "hard": 200}
    exercise_xp = sum(diff_xp.get(ex.difficulty.lower(), 50) for ex in exercises)

    # Calculate Daily Streak
    passed_subs = (
        db.query(Submission.created_at)
        .filter(Submission.user_id == current_user.id, Submission.passed == True)
        .order_by(Submission.created_at.desc())
        .all()
    )
    distinct_dates = sorted({s[0].date() for s in passed_subs}, reverse=True)
    today = datetime.utcnow().date()
    streak_days = 0
    if distinct_dates:
        if distinct_dates[0] == today or distinct_dates[0] == (today - timedelta(days=1)):
            curr = distinct_dates[0]
            for d in distinct_dates:
                if d == curr:
                    streak_days += 1
                    curr = curr - timedelta(days=1)
                elif d < curr:
                    break

    # Add streak bonus
    total_xp = exercise_xp + (streak_days * 15)

    # Determine Level Rank
    curr_level = 1
    curr_title = "Novice Coder"
    base_xp = 0
    next_xp = 150
    for lvl, title, low, high in LEVEL_TIERS:
        if total_xp >= low:
            curr_level = lvl
            curr_title = title
            base_xp = low
            next_xp = high

    progress_pct = min(100, int(((total_xp - base_xp) / max(1, next_xp - base_xp)) * 100))
    level_info = LevelInfo(
        level=curr_level,
        title=curr_title,
        current_xp=total_xp,
        next_level_xp=next_xp,
        progress_percent=progress_pct,
    )

    # Badges
    badges = [
        Badge(
            id="first_code",
            title="First Blood",
            description="Solve your first coding exercise.",
            icon="🎯",
            unlocked=solved_count >= 1,
            progress=min(solved_count, 1),
            max_progress=1,
        ),
        Badge(
            id="triple_threat",
            title="Triple Threat",
            description="Solve 3 distinct coding exercises.",
            icon="⚡",
            unlocked=solved_count >= 3,
            progress=min(solved_count, 3),
            max_progress=3,
        ),
        Badge(
            id="on_fire",
            title="On Fire",
            description="Maintain an active 3-day coding streak.",
            icon="🔥",
            unlocked=streak_days >= 3,
            progress=min(streak_days, 3),
            max_progress=3,
        ),
        Badge(
            id="python_scholar",
            title="Python Scholar",
            description="Master 5 coding exercises across topics.",
            icon="🐍",
            unlocked=solved_count >= 5,
            progress=min(solved_count, 5),
            max_progress=5,
        ),
        Badge(
            id="code_champion",
            title="Code Champion",
            description="Solve 10 coding exercises.",
            icon="🏆",
            unlocked=solved_count >= 10,
            progress=min(solved_count, 10),
            max_progress=10,
        ),
    ]

    recent_solved = [
        DashboardExercise(
            id=ex.id,
            title=ex.title,
            topic_slug=ex.topic.slug,
            difficulty=ex.difficulty,
        )
        for ex in exercises
    ]

    return DashboardResponse(
        stats=DashboardStats(
            total_exercises=total_exercises,
            solved_exercises=solved_count,
            total_xp=total_xp,
            streak_days=streak_days,
            level_info=level_info,
            badges=badges,
        ),
        recent_solved=recent_solved,
    )
