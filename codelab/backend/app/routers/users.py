import os
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..email_service import is_smtp_configured, send_welcome_email
from ..models import Exercise, Submission, User
from ..schemas import (
    DashboardResponse,
    DashboardStats,
    DashboardExercise,
    LevelInfo,
    Badge,
    WelcomeEmailResponse,
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


@router.get(
    "/me/dashboard",
    response_model=DashboardResponse,
    summary="Get user dashboard analytics",
    description="Retrieve personal learning progress, XP points, current level rank, streak days, and achievement badges.",
)
def get_dashboard(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Aggregate statistics, gamification levels, active streaks, and milestone badges for the logged in user."""
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
    distinct_dates = sorted({s[0].date() for s in passed_subs if s[0] is not None}, reverse=True)
    today = datetime.now(timezone.utc).date()
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


@router.post(
    "/me/welcome",
    response_model=WelcomeEmailResponse,
    summary="Trigger Welcome to CodeLab email on login",
    description=(
        "Sends a Welcome to CodeLab email to the authenticated user in the background. "
        "By default sent once per user on first login (set WELCOME_EMAIL_ON_EVERY_LOGIN=true to send on every login)."
    ),
)
def trigger_welcome_email(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Queue a welcome email for the logged-in user without blocking the login flow."""
    send_every_login = os.getenv("WELCOME_EMAIL_ON_EVERY_LOGIN", "false").strip().lower() == "true"

    if current_user.welcome_email_sent and not send_every_login:
        return WelcomeEmailResponse(
            sent=False,
            already_sent=True,
            mode="skipped",
            message="Welcome email was already sent to this user.",
        )

    was_already_sent = bool(current_user.welcome_email_sent)
    if not current_user.welcome_email_sent:
        current_user.welcome_email_sent = True
        db.add(current_user)
        db.commit()
        db.refresh(current_user)

    background_tasks.add_task(
        send_welcome_email,
        current_user.email,
        current_user.name,
        current_user.provider,
    )

    delivery_mode = "smtp" if is_smtp_configured() else "console"
    return WelcomeEmailResponse(
        sent=True,
        already_sent=was_already_sent,
        mode=delivery_mode,
        message=f"Welcome email queued for {current_user.email}.",
    )
