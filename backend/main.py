import sqlite3
import json


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


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
        tasks.append({
            "id": row["id"],
            "title": row["title"],
            "done": bool(row["done"])
        })

    conn.close()

    return {
        "tasks": tasks
    }



