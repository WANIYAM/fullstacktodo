from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    
    # Relationship to Task
    tasks: List["Task"] = Relationship(back_populates="owner")


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    completed: bool = False
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    
    # Relationship back to User
    owner: Optional["User"] = Relationship(back_populates="tasks")