import uuid
from unittest.mock import MagicMock, patch
import pytest
import jwt
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal, ensure_schema_columns
from app.models import User
from app.seed import seed
from app.auth import SECRET_KEY, ALGORITHM
from app.email_service import build_welcome_email, send_welcome_email

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    ensure_schema_columns()
    with SessionLocal() as db:
        seed(db)

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def auth_headers():
    token = jwt.encode(
        {"email": "testuser@codelab.dev", "name": "Test User", "picture": ""},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return {"Authorization": f"Bearer {token}"}

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}

def test_list_topics_has_all_six_topics(client):
    res = client.get("/api/topics")
    assert res.status_code == 200
    topics = res.json()
    assert len(topics) == 6
    expected_slugs = [
        "python-basics",
        "control-flow",
        "strings",
        "functions-and-scope",
        "lists-and-tuples",
        "dictionaries-and-sets",
    ]
    actual_slugs = [t["slug"] for t in topics]
    assert actual_slugs == expected_slugs

def test_functions_and_scope_topic_detail(client):
    res = client.get("/api/topics/functions-and-scope")
    assert res.status_code == 200
    data = res.json()
    assert data["slug"] == "functions-and-scope"
    assert data["title"] == "Functions & Scope"
    assert "Defining Functions" in data["notes_md"]
    assert len(data["exercises"]) == 3
    titles = [ex["title"] for ex in data["exercises"]]
    assert "Celsius to Fahrenheit" in titles
    assert "Max of Three" in titles
    assert "Is Prime Number" in titles

def test_lists_and_tuples_topic_detail(client):
    res = client.get("/api/topics/lists-and-tuples")
    assert res.status_code == 200
    data = res.json()
    assert data["slug"] == "lists-and-tuples"
    assert data["title"] == "Lists & Tuples"
    assert "List Comprehensions" in data["notes_md"]
    assert len(data["exercises"]) == 3
    titles = [ex["title"] for ex in data["exercises"]]
    assert "Filter Even Numbers" in titles
    assert "Second Largest Distinct Number" in titles
    assert "Swap Tuple Ends" in titles

def test_dictionaries_and_sets_topic_detail(client):
    res = client.get("/api/topics/dictionaries-and-sets")
    assert res.status_code == 200
    data = res.json()
    assert data["slug"] == "dictionaries-and-sets"
    assert data["title"] == "Dictionaries & Sets"
    assert "Counting with Dictionaries" in data["notes_md"]
    assert len(data["exercises"]) == 3
    titles = [ex["title"] for ex in data["exercises"]]
    assert "Word Frequency Counter" in titles
    assert "Find Common Elements" in titles
    assert "Student Grade Lookup" in titles

def test_exercise_detail_and_chaining(client):
    # Fetch functions topic to get first exercise id
    topic_res = client.get("/api/topics/functions-and-scope")
    ex1_id = topic_res.json()["exercises"][0]["id"]
    
    res = client.get(f"/api/exercises/{ex1_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Celsius to Fahrenheit"
    assert data["topic_slug"] == "functions-and-scope"
    assert data["next_exercise_id"] is not None

def test_search_curriculum(client):
    res = client.get("/api/search?q=tuples")
    assert res.status_code == 200
    data = res.json()
    topic_slugs = [t["slug"] for t in data["topics"]]
    assert "lists-and-tuples" in topic_slugs

def test_run_celsius_to_fahrenheit_code(client, auth_headers):
    # Fetch functions topic to get exercise id
    topic_res = client.get("/api/topics/functions-and-scope")
    ex_id = topic_res.json()["exercises"][0]["id"]
    
    solution_code = (
        "def to_fahrenheit(c):\n"
        "    return int(c * 9 / 5 + 32)\n"
        "celsius = int(input())\n"
        "print(to_fahrenheit(celsius))\n"
    )
    res = client.post(
        f"/api/exercises/{ex_id}/run",
        json={"code": solution_code},
        headers=auth_headers,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["passed"] is True
    assert all(r["passed"] for r in data["results"])

def test_exercise_not_found(client):
    res = client.get("/api/exercises/999999")
    assert res.status_code == 404

def test_topic_not_found(client):
    res = client.get("/api/topics/non-existent-topic-slug")
    assert res.status_code == 404

def test_search_empty_query(client):
    res = client.get("/api/search?q=")
    assert res.status_code == 200
    data = res.json()
    assert data["topics"] == []
    assert data["exercises"] == []

def test_unauthorized_dashboard_access(client):
    res = client.get("/api/users/me/dashboard")
    assert res.status_code == 401


def test_run_custom_code_success(client):
    code = "a = int(input())\nb = int(input())\nprint(a + b)"
    res = client.post(
        "/api/exercises/run-custom",
        json={"code": code, "stdin": "15\n25"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["stdout"] == "40"
    assert data["stderr"] == ""
    assert data["execution_time_ms"] >= 0


def test_run_custom_code_runtime_error(client):
    code = "print(1 / 0)"
    res = client.post(
        "/api/exercises/run-custom",
        json={"code": code, "stdin": ""},
    )
    assert res.status_code == 200
    data = res.json()
    assert "ZeroDivisionError" in data["stderr"]


def test_get_exercise_submissions_unauthenticated(client):
    res = client.get("/api/exercises/1/submissions")
    assert res.status_code == 200
    assert res.json() == []


def test_get_exercise_submissions_authenticated(client, auth_headers):
    # Fetch first exercise
    topic_res = client.get("/api/topics/python-basics")
    ex_id = topic_res.json()["exercises"][0]["id"]

    # Submit a run
    client.post(
        f"/api/exercises/{ex_id}/run",
        json={"code": "print('hello')"},
        headers=auth_headers,
    )

    # Fetch submissions
    res = client.get(f"/api/exercises/{ex_id}/submissions", headers=auth_headers)
    assert res.status_code == 200
    subs = res.json()
    assert len(subs) >= 1
    assert subs[0]["exercise_id"] == ex_id
    assert "code" in subs[0]
    assert "passed" in subs[0]
    assert "created_at" in subs[0]


def test_get_exercise_submissions_not_found(client, auth_headers):
    res = client.get("/api/exercises/999999/submissions", headers=auth_headers)
    assert res.status_code == 404


def test_welcome_email_unauthenticated(client):
    res = client.post("/api/users/me/welcome")
    assert res.status_code == 401


def test_welcome_email_sent_once_and_skipped_on_repeat(client, monkeypatch):
    monkeypatch.delenv("WELCOME_EMAIL_ON_EVERY_LOGIN", raising=False)
    unique_email = f"welcome-{uuid.uuid4().hex[:8]}@codelab.dev"
    token = jwt.encode(
        {
            "email": unique_email,
            "name": "Ada Lovelace",
            "picture": "",
            "provider": "google",
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    headers = {"Authorization": f"Bearer {token}"}

    sent_calls = []
    monkeypatch.setattr(
        "app.routers.users.send_welcome_email",
        lambda to_email, name, provider: sent_calls.append((to_email, name, provider)),
    )

    try:
        # First login: should queue welcome email and mark user as welcomed
        res1 = client.post("/api/users/me/welcome", headers=headers)
        assert res1.status_code == 200
        body1 = res1.json()
        assert body1["sent"] is True
        assert body1["already_sent"] is False
        assert sent_calls == [(unique_email, "Ada Lovelace", "google")]

        # Second login: should skip duplicate email
        res2 = client.post("/api/users/me/welcome", headers=headers)
        assert res2.status_code == 200
        body2 = res2.json()
        assert body2["sent"] is False
        assert body2["already_sent"] is True
        assert body2["mode"] == "skipped"
        assert len(sent_calls) == 1

        # With WELCOME_EMAIL_ON_EVERY_LOGIN=true: should send again
        monkeypatch.setenv("WELCOME_EMAIL_ON_EVERY_LOGIN", "true")
        res3 = client.post("/api/users/me/welcome", headers=headers)
        assert res3.status_code == 200
        body3 = res3.json()
        assert body3["sent"] is True
        assert body3["already_sent"] is True
        assert len(sent_calls) == 2
    finally:
        with SessionLocal() as db:
            db.query(User).filter(User.email == unique_email).delete()
            db.commit()


def test_build_welcome_email_content_and_html_escaping(monkeypatch):
    monkeypatch.setenv("APP_URL", "https://codelab-amber.vercel.app")
    msg = build_welcome_email(
        to_email="learner@example.com",
        name="Guru <script>alert(1)</script>",
        provider="github",
    )
    assert msg["To"] == "learner@example.com"
    assert "Welcome to CodeLab" in msg["Subject"]

    parts = msg.get_payload()
    assert len(parts) == 2
    plain_body = parts[0].get_payload(decode=True).decode("utf-8")
    html_body = parts[1].get_payload(decode=True).decode("utf-8")

    assert "Welcome to CodeLab" in plain_body
    assert "https://codelab-amber.vercel.app/topics/python-basics" in plain_body
    assert "&lt;script&gt;alert(1)&lt;/script&gt;" in html_body
    assert "<script>" not in html_body
    assert "Github" in html_body


def test_send_welcome_email_console_fallback(monkeypatch):
    monkeypatch.delenv("SMTP_HOST", raising=False)
    monkeypatch.delenv("SMTP_USER", raising=False)
    monkeypatch.delenv("SMTP_PASSWORD", raising=False)

    result = send_welcome_email("dev@codelab.dev", "Dev User", "google")
    assert result["delivered"] is True
    assert result["mode"] == "console"
    assert result["recipient"] == "dev@codelab.dev"


def test_send_welcome_email_via_smtp_starttls(monkeypatch):
    monkeypatch.setenv("SMTP_HOST", "smtp.example.com")
    monkeypatch.setenv("SMTP_PORT", "587")
    monkeypatch.setenv("SMTP_USE_SSL", "false")
    monkeypatch.setenv("SMTP_USER", "sender@example.com")
    monkeypatch.setenv("SMTP_PASSWORD", "app-secret-password")

    mock_smtp_instance = MagicMock()
    mock_smtp_cm = MagicMock()
    mock_smtp_cm.__enter__.return_value = mock_smtp_instance
    mock_smtp_cm.__exit__.return_value = False

    with patch("app.email_service.smtplib.SMTP", return_value=mock_smtp_cm) as mock_smtp:
        result = send_welcome_email("user@example.com", "Alice", "google")

    assert result["delivered"] is True
    assert result["mode"] == "smtp"
    mock_smtp.assert_called_once_with("smtp.example.com", 587, timeout=10)
    mock_smtp_instance.starttls.assert_called_once()
    mock_smtp_instance.login.assert_called_once_with("sender@example.com", "app-secret-password")
    mock_smtp_instance.send_message.assert_called_once()
