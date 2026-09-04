from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

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
    return {
    "tasks": [
        {
        "id": 1,
        "title": "become a poet",
        "done": True
        },
        {
        "id": 2,
        "title": "get groceries",
        "done": False
        }
    ]
        }
    


