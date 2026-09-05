import sqlite3
import json


from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl


class UpdateTask(BaseModel):
    title: str | None = None
    done: bool | None = None


class Task(BaseModel):
    id: int
    title: str
    done: bool


def create_database():
    connection = sqlite3.connect("tasks.db")
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks(
            id INTEGER NOT NULL PRIMARY KEY,
            title TEXT,
            done BOOLEAN
        )
        """
    )

    connection.commit()
    connection.close()


def init_db():
    connection = sqlite3.connect("tasks.db")
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO tasks (id, title, done) 
        VALUES
        (1, "become a poet", False),
        (2, "get groceries", True)
        """
    )

    connection.commit()
    connection.close()


app = FastAPI()
create_database()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "https://taskmanager0000.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hello world"}


@app.get("/tasks")
def get_all_tasks():
    conn = sqlite3.connect("tasks.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks")
    rows = cursor.fetchall()
    print(rows)

    tasks = []

    for row in rows:
        tasks.append(
            {"id": row["id"], "title": row["title"], "done": bool(row["done"])}
        )

    conn.close()

    return {"tasks": tasks}


@app.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(task: Task):
    connection = sqlite3.connect("tasks.db")
    cursor = connection.cursor()

    if task is None:
        raise HTTPException(status_code=422, detail="Task not found")

    cursor.execute(
        """
        INSERT INTO tasks (id, title, done) 
        VALUES
        (?,?,?)
        """,
        (task.id, task.title, task.done),
    )

    connection.commit()
    connection.close()
    return {"message": "task successfully added"}


@app.patch("/tasks/{id}")
def update_task(id: str, task: UpdateTask):
    conn = sqlite3.connect("tasks.db")
    c = conn.cursor()

    c.execute(
        """
                    UPDATE tasks 
                    SET title = ?
                    WHERE id = ?
            """,
        (task.title, id),
    )

    conn.commit()
    conn.close()

    return {"message": "task updated successfully"}


@app.delete("/tasks/{id}")
def delete_task(id: int):
    conn = sqlite3.connect("tasks.db")
    c = conn.cursor()

    c.execute(
        """
                DELETE FROM tasks
                WHERE id = ?
            """,
        (id,),
    )

    conn.commit()
    conn.close()

    return {"message": "task deleted"}

