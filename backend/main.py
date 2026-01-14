from datetime import timedelta
from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel

from . import auth, crud, models, schemas
from .database import engine, get_session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

app = FastAPI(
    title="Todo API",
    description="A secure Todo API with JWT authentication",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ============================================
# AUTHENTICATION ENDPOINTS
# ============================================

@app.post("/signup", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(get_session)):
    """Register a new user"""
    # Check if username already exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Hash password and create user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/token", response_model=schemas.Token)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_session)):
    """Login and get access token"""
    user = auth.authenticate_user(db, login_data.username, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    refresh_token = auth.create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.post("/refresh", response_model=schemas.Token)
def refresh_token(
    refresh_data: schemas.RefreshTokenRequest,
    db: Session = Depends(get_session)
):
    """Get a new access token using refresh token"""
    try:
        payload = auth.decode_token(refresh_data.refresh_token)
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Verify user still exists
        user = db.query(models.User).filter(models.User.id == int(user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Create new tokens
        new_access_token = auth.create_access_token(data={"sub": str(user.id)})
        new_refresh_token = auth.create_refresh_token(data={"sub": str(user.id)})
        
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

@app.get("/me", response_model=schemas.UserReadWithTasks)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    """Get current user information"""
    return current_user

@app.post("/logout", response_model=schemas.Message)
def logout():
    """Logout (client should delete tokens)"""
    return {
        "message": "Successfully logged out",
        "detail": "Please delete your tokens on the client side"
    }

# ============================================
# TASK ENDPOINTS
# ============================================

@app.get("/tasks", response_model=List[schemas.TaskRead])
def get_tasks(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_session)
):
    """Get all tasks for the current user"""
    tasks = crud.get_tasks_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return tasks

@app.post("/tasks", response_model=schemas.TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task: schemas.TaskCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_session)
):
    """Create a new task"""
    return crud.create_user_task(db=db, task=task, user_id=current_user.id)

@app.get("/tasks/{task_id}", response_model=schemas.TaskRead)
def get_task(
    task_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_session)
):
    """Get a specific task by ID"""
    db_task = crud.get_task(db, task_id=task_id, user_id=current_user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.put("/tasks/{task_id}", response_model=schemas.TaskRead)
def update_task(
    task_id: int,
    task: schemas.TaskUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_session)
):
    """Update a task"""
    db_task = crud.update_task(db, task_id=task_id, task_update=task, user_id=current_user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.delete("/tasks/{task_id}", response_model=schemas.TaskRead)
def delete_task(
    task_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_session)
):
    """Delete a task"""
    db_task = crud.delete_task(db, task_id=task_id, user_id=current_user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}