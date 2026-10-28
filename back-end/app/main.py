from fastapi import (
    FastAPI,
    status,
    Depends,
    HTTPException,
    Form
)
from fastapi.security import OAuth2PasswordRequestForm

from schemas.users import *
from models.users import User

from core.config import Settings
from typing import Annotated
from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session
from core.db import Base, engine, get_db

from core.security import (
    get_current_active_user, 
    authenticate_user,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from schemas.security import Token
from core import crud

Base.metadata.create_all(bind=engine) # will be replaced by Alembic later on

db_session = Annotated[Session, Depends(get_db)]

app = FastAPI()

settings = Settings()



@app.post(
    path="/user",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
    tags=['users'],
    name="Register a new user"
)
async def create_user(user: Annotated[UserCreate, Form()], session: db_session):
    email_check = session.scalars(select(User).where(User.email == user.email)).first()
    if email_check:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este e-mail já existe dentro da nossa base de dados")

    new_user = crud.create_user(user, session)
    return new_user

@app.get(
    path="/users",
    response_model=list[UserPublic],
    status_code=status.HTTP_200_OK,
    tags=['users'],
    name="List all users"
)
async def read_all_users(session: db_session):
    users = session.scalars(select(User).where(User.disabled == False))
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
async def read_specific_user(user_id: uuid.UUID, session: db_session):
    specific_user = session.get(User, user_id)
    if not specific_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="O usuário especificado não foi encontrado")
    return specific_user


@app.put(
    path="/users/{user_id}",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    tags=['users'],
    name="Replace entire user"
)
async def update_all_user_info(user_id: uuid.UUID, user: Annotated[UserPut, Form()], session: db_session):
    existing_user = session.get(User, user_id)
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    return crud.update_entire_user(existing_user, user, session)

@app.patch(
    path="/users/{user_id}",
    response_model=UserPublic,
    response_model_exclude_unset=True,
    status_code=status.HTTP_200_OK,
    tags=['users'],
    name="Change user info"
)
# por enquanto, nesse método, não se faz o uso do form, pq dentro do form, não há como excluir campos que não são utilizados.
async def update_user_info(user_id: uuid.UUID, user: UserUpdate, session: db_session):
    existing_user = session.get(User, user_id)
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    return crud.update_user_info(existing_user, user, session)

@app.delete(
    path="/users/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=['users'],
    name="Delete user"
)
async def delete_user(user_id: uuid.UUID, session: db_session):
    existing_user = session.get(User, user_id)
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    crud.delete_user(existing_user, session)

@app.post("/access_token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: db_session):
    user = authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/me", response_model=UserPublic)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    return current_user