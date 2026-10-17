from pydantic import BaseModel, ConfigDict


class ExerciseSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    difficulty: str
    solved: bool = False


class ExerciseDetail(ExerciseSummary):
    prompt_md: str
    starter_code: str
    topic_slug: str
    next_exercise_id: int | None = None


class TopicSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    slug: str
    title: str
    summary: str


class TopicDetail(TopicSummary):
    notes_md: str
    exercises: list[ExerciseSummary]


class RunRequest(BaseModel):
    code: str


class TestResult(BaseModel):
    passed: bool
    input: str
    expected: str
    actual: str
    error: str = ""


class RunResponse(BaseModel):
    passed: bool
    results: list[TestResult]
    xp_earned: int = 0
    is_first_solve: bool = False


class DashboardExercise(BaseModel):
    id: int
    title: str
    topic_slug: str
    difficulty: str


class Badge(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    unlocked: bool
    progress: int
    max_progress: int


class LevelInfo(BaseModel):
    level: int
    title: str
    current_xp: int
    next_level_xp: int
    progress_percent: int


class DashboardStats(BaseModel):
    total_exercises: int
    solved_exercises: int
    total_xp: int = 0
    streak_days: int = 0
    level_info: LevelInfo | None = None
    badges: list[Badge] = []


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_solved: list[DashboardExercise]
