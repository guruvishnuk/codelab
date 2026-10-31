from pydantic import BaseModel, ConfigDict, Field


class ExerciseSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int = Field(..., description="Unique exercise identifier")
    title: str = Field(..., description="Exercise title")
    difficulty: str = Field(..., description="Difficulty level (easy, medium, hard)")
    solved: bool = Field(False, description="Whether current user has solved this exercise")


class ExerciseDetail(ExerciseSummary):
    prompt_md: str = Field(..., description="Exercise description and markdown instructions")
    starter_code: str = Field(..., description="Initial Python code template")
    topic_slug: str = Field(..., description="Parent topic slug")
    next_exercise_id: int | None = Field(None, description="Next exercise ID in current topic sequence")


class TopicSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    slug: str = Field(..., description="Unique URL-friendly slug for the topic")
    title: str = Field(..., description="Topic title")
    summary: str = Field(..., description="Short summary of topic contents")


class TopicDetail(TopicSummary):
    notes_md: str = Field(..., description="Comprehensive study notes and explanations in Markdown")
    exercises: list[ExerciseSummary] = Field(default_factory=list, description="List of exercises in this topic")


class RunRequest(BaseModel):
    code: str = Field(..., description="Python source code submitted by learner to execute")


class TestResult(BaseModel):
    passed: bool = Field(..., description="Whether the test case passed successfully")
    input: str = Field(..., description="Standard input passed to program")
    expected: str = Field(..., description="Expected standard output")
    actual: str = Field(..., description="Actual output produced by runner")
    error: str = Field("", description="Error message or traceback if execution failed")


class RunResponse(BaseModel):
    passed: bool = Field(..., description="True if all test cases passed")
    results: list[TestResult] = Field(..., description="Detailed per-test-case results")
    xp_earned: int = Field(0, description="XP gained on first successful solve")
    is_first_solve: bool = Field(False, description="Whether this is the first time the user solved this")


class DashboardExercise(BaseModel):
    id: int = Field(..., description="Exercise identifier")
    title: str = Field(..., description="Exercise title")
    topic_slug: str = Field(..., description="Topic slug")
    difficulty: str = Field(..., description="Difficulty level")


class Badge(BaseModel):
    id: str = Field(..., description="Unique badge ID")
    title: str = Field(..., description="Display title for badge")
    description: str = Field(..., description="Achievement unlock criteria")
    icon: str = Field(..., description="Badge icon identifier")
    unlocked: bool = Field(..., description="Whether badge is unlocked by user")
    progress: int = Field(..., description="Current progress value")
    max_progress: int = Field(..., description="Target threshold to unlock")


class LevelInfo(BaseModel):
    level: int = Field(..., description="Current user rank level")
    title: str = Field(..., description="Level title (e.g. Apprentice, Code Wizard)")
    current_xp: int = Field(..., description="Current XP within the level")
    next_level_xp: int = Field(..., description="XP required to achieve next level")
    progress_percent: int = Field(..., description="Progress percentage towards next level (0-100)")


class DashboardStats(BaseModel):
    total_exercises: int = Field(..., description="Total count of exercises across curriculum")
    solved_exercises: int = Field(..., description="Number of unique exercises solved by user")
    total_xp: int = Field(0, description="Total experience points earned")
    streak_days: int = Field(0, description="Consecutive active daily coding streak")
    level_info: LevelInfo | None = Field(None, description="Computed level progression details")
    badges: list[Badge] = Field(default_factory=list, description="List of user badges and milestones")


class DashboardResponse(BaseModel):
    stats: DashboardStats = Field(..., description="Aggregated user statistics and progression")
    recent_solved: list[DashboardExercise] = Field(default_factory=list, description="Recently solved exercises")
