from datetime import datetime
from sqlalchemy import ForeignKey, JSON, Text, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(120))
    summary: Mapped[str] = mapped_column(String(300), default="")
    notes_md: Mapped[str] = mapped_column(Text, default="")  # lesson notes in Markdown
    position: Mapped[int] = mapped_column(default=0)

    exercises: Mapped[list["Exercise"]] = relationship(
        back_populates="topic", order_by="Exercise.position"
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id"))
    title: Mapped[str] = mapped_column(String(120))
    prompt_md: Mapped[str] = mapped_column(Text)
    starter_code: Mapped[str] = mapped_column(Text, default="")
    difficulty: Mapped[str] = mapped_column(String(20), default="easy")
    # [{"input": "2\n3\n", "expected": "5"}, ...]
    test_cases: Mapped[list] = mapped_column(JSON, default=list)
    position: Mapped[int] = mapped_column(default=0)

    topic: Mapped[Topic] = relationship(back_populates="exercises")


class Submission(Base):
    """Stored for every run. Add user_id here once auth exists."""
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(primary_key=True)
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"))
    code: Mapped[str] = mapped_column(Text)
    passed: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
