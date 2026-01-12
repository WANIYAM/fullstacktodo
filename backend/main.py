from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel

from . import crud, models, schemas, auth
from .database import engine, get_session


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

app = FastAPI()

# ADD CORS MIDDLEWARE IMMEDIATELY AFTER CREATING THE APP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # Create a default user for development if one doesn't exist
    with Session(engine) as session:
        existing_user = session.query(models.User).filter(models.User.username == "testuser").first()
        if not existing_user:
            hashed_password = auth.get_password_hash("testpassword")
            user_in = models.User(username="testuser", password_hash=hashed_password)
            session.add(user_in)
            session.commit()
            session.refresh(user_in)
            print(f"Created default user: {user_in.username}")


# Authentication endpoints
@app.post("/users/", response_model=schemas.UserRead)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_session)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = crud.create_user(db=db, user=schemas.UserCreate(username=user.username, password=hashed_password))
    return db_user

@app.post("/login/")
def login_for_access_token(
    form_data: schemas.UserCreate,
    db: Session = Depends(get_session)
):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Include router AFTER CORS middleware is added
from .routes.tasks import tasks_router
app.include_router(tasks_router, prefix="/tasks", tags=["tasks"])