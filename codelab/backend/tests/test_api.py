import pytest
import jwt
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.seed import seed
from app.auth import SECRET_KEY, ALGORITHM

@pytest.fixture(scope="session", autouse=True)
def setup_database():
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
