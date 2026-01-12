from typing import List, Optional
from sqlmodel import SQLModel

# ---- Task Schemas ----
class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    owner_id: Optional[int] = None

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

# ---- User Schemas ----
class UserBase(SQLModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    tasks: List[TaskRead] = []
