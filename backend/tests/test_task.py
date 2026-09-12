import os
import sqlite3

from fastapi.testclient import TestClient

import main


client = TestClient(main.app)


def setup_function():
    if os.path.exists("tasks.db"):
        os.remove("tasks.db")

    main.create_database()


def test_root():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Hello world"}


def test_get_tasks_empty():
    response = client.get("/tasks")

    assert response.status_code == 200
    assert response.json() == {"tasks": []}


def test_create_task():
    task = {
        "id": 1,
        "title": "Learn FastAPI",
        "done": False,
    }

    response = client.post("/tasks", json=task)

    assert response.status_code == 201
    assert response.json() == {"message": "task successfully added"}


def test_create_and_get_task():
    task = {
        "id": 1,
        "title": "Learn FastAPI",
        "done": False,
    }

    client.post("/tasks", json=task)

    response = client.get("/tasks")

    assert response.status_code == 200

    assert response.json() == {
        "tasks": [
            {
                "id": 1,
                "title": "Learn FastAPI",
                "done": False,
            }
        ]
    }


def test_update_task():
    task = {
        "id": 1,
        "title": "Learn FastAPI",
        "done": False,
    }

    client.post("/tasks", json=task)

    response = client.patch(
        "/tasks/1",
        json={
            "title": "Learn Pytest",
            "done": True,
        },
    )

    assert response.status_code == 200
    assert response.json() == {"message": "task updated successfully"}

    response = client.get("/tasks")

    assert response.json()["tasks"][0]["title"] == "Learn Pytest"


def test_delete_task():
    task = {
        "id": 1,
        "title": "Delete me",
        "done": False,
    }

    client.post("/tasks", json=task)

    response = client.delete("/tasks/1")

    assert response.status_code == 200
    assert response.json() == {"message": "task deleted"}

    response = client.get("/tasks")

    assert response.json() == {"tasks": []}


def test_invalid_task_returns_422():
    response = client.post(
        "/tasks",
        json={
            "title": "Missing id",
            "done": False,
        },
    )

    assert response.status_code == 422
