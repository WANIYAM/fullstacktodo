from sqlmodel import Session, select

from . import models, schemas


def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user"""
    db_user = models.User(username=user.username, password_hash=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_task(db: Session, task_id: int, user_id: int):
    """Get a specific task by ID for a user"""
    task = db.get(models.Task, task_id)
    if not task or task.owner_id != user_id:
        return None
    return task


def get_tasks_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Get all tasks for a user"""
    statement = select(models.Task).where(models.Task.owner_id == user_id).offset(skip).limit(limit)
    return db.exec(statement).all()


def create_user_task(db: Session, task: schemas.TaskCreate, user_id: int):
    """Create a new task for a user"""
    db_task = models.Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        owner_id=user_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate, user_id: int):
    """Update a task"""
    db_task = get_task(db, task_id, user_id)
    if not db_task:
        return None
    
    # Use model_dump instead of dict for Pydantic v2
    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int, user_id: int):
    """Delete a task"""
    db_task = get_task(db, task_id, user_id)
    if not db_task:
        return None
    db.delete(db_task)
    db.commit()
    return db_task