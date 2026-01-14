from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
from sqlmodel import SQLModel

# ---- Task Schemas ----
class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    owner_id: Optional[int] = None

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None

# ---- User Schemas ----
class UserBase(SQLModel):
    username: str = Field(min_length=3, max_length=50)

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=100)
    
    @field_validator('username')
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username must be alphanumeric (underscores and hyphens allowed)')
        return v.lower()
    
    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserRead(UserBase):
    id: int

class UserReadWithTasks(UserRead):
    tasks: List[TaskRead] = []

# ---- Authentication Schemas ----
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# ---- Login Schema ----
class LoginRequest(BaseModel):
    username: str
    password: str

# ---- Response Messages ----
class Message(BaseModel):
    message: str
    detail: Optional[str] = None