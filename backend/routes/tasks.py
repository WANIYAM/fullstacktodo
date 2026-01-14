from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from .. import crud
from .. import schemas
from ..auth import get_current_user_id
from ..database import get_session

tasks_router = APIRouter()


@tasks_router.get("/", response_model=List[schemas.TaskRead])
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id),
):
    """Get all tasks for the current user"""
    tasks = crud.get_tasks_by_user(db, user_id=current_user_id, skip=skip, limit=limit)
    return tasks


@tasks_router.post("/", response_model=schemas.TaskRead, status_code=201)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id),
):
    """Create a new task for the current user"""
    return crud.create_user_task(db=db, task=task, user_id=current_user_id)


@tasks_router.get("/{task_id}", response_model=schemas.TaskRead)
def read_task(
    task_id: int,
    db: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id),
):
    """Get a specific task by ID"""
    db_task = crud.get_task(db, task_id=task_id, user_id=current_user_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@tasks_router.put("/{task_id}", response_model=schemas.TaskRead)
def update_task(
    task_id: int,
    task: schemas.TaskUpdate,
    db: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id),
):
    """Update a task"""
    db_task = crud.update_task(db, task_id=task_id, task_update=task, user_id=current_user_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@tasks_router.delete("/{task_id}", response_model=schemas.TaskRead)
def delete_task(
    task_id: int,
    db: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id),
):
    """Delete a task"""
    db_task = crud.delete_task(db, task_id=task_id, user_id=current_user_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task