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


class DashboardExercise(BaseModel):
    id: int
    title: str
    topic_slug: str
    difficulty: str

class DashboardStats(BaseModel):
    total_exercises: int
    solved_exercises: int

class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_solved: list[DashboardExercise]
