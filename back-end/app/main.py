from fastapi import FastAPI, status, Depends, HTTPException, Form

from schemas.users import *
from models.users import User

from core.config import Settings
from typing import Annotated

from sqlalchemy import select
from sqlalchemy.orm import Session
from core.db import Base, engine, get_db

Base.metadata.create_all(bind=engine) # will be replaced by Alembic later on

app = FastAPI()

settings = Settings()



@app.post(
    path="/user",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
    tags=['users'],
    name="Register a new user"
)
async def create_user(user: Annotated[UserCreate, Form()], db: Annotated[Session, Depends(get_db)]):
    email_check = db.scalars(select(User).where(User.email == user.email)).first()
    if email_check:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este e-mail já existe dentro da nossa base de dados")

    new_user = User() # making new_user an empty User() object, so that it can receive values from UserCreate in the following for loop.
    for field, value in user.model_dump(mode="json").items():
        setattr(new_user, field, value)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get(
    path="/users",
    response_model=list[UserPublic],
    status_code=status.HTTP_200_OK,
    tags=['users'],
    name="List all users"
)
async def read_all_users(db: Annotated[Session, Depends(get_db)]):
    users = db.scalars(select(User).where(User.disabled == False))
    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Não foi encontrado nenhum usuário")
    return users.all()

@app.get(
    path="/users/{user_id}",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    tags=['users'],
    name="List user by id",
)
async def read_specific_user(user_id: uuid.UUID, db: Annotated[Session, Depends(get_db)]):
    specific_user = db.scalars(select(User).where(User.id == user_id))
    if not specific_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="O usuário especificado não foi encontrado")
    return specific_user.first()


@app.put(
    path="/users/{user_id}",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    tags=['users'],
    name="Replace entire user"
)
async def update_all_user_info(user_id: uuid.UUID, user: Annotated[UserPut, Form()], db: Annotated[Session, Depends(get_db)]):
    existing_user = db.scalars(select(User).where(User.id == user_id)).first()
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    for field, value in user.model_dump(mode="json").items():
        setattr(existing_user, field, value)

    db.commit()
    db.refresh(existing_user)
    return existing_user

@app.patch(
    path="/users/{user_id}",
    response_model=UserPublic,
    response_model_exclude_unset=True,
    status_code=status.HTTP_200_OK,
    tags=['users'],
    name="Change user info"
)
async def update_user_info(user_id: uuid.UUID, user: UserUpdate, db: Annotated[Session, Depends(get_db)]):
    existing_user = db.scalars(select(User).where(User.id == user_id)).first()
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    partial_info = user.model_dump(mode="json", exclude_unset=True)
    for field, value in partial_info.items():
        setattr(existing_user, field, value)

    db.commit()
    db.refresh(existing_user)
    return existing_user

@app.delete(
    path="/users/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=['users'],
    name="Delete user"
)
async def delete_user(user_id: uuid.UUID, db: Annotated[Session, Depends(get_db)]):
    existing_user = db.get(User, user_id)
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    db.delete(existing_user)
    db.commit()
