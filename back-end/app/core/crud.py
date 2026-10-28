from core.db import get_db
from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID
from core.security import hash_password
from models.users import User
from schemas.users import UserCreate, UserPut, UserUpdate
from datetime import datetime, UTC

from typing import Annotated
from fastapi import Depends


db_session = Annotated[Session, Depends(get_db)]

def get_user_by_id(user_id: UUID, session: db_session):
    return session.scalars(select(User).where(User.id == user_id)).first()

def get_all_users(session: db_session):
    return session.scalars(select(User).where(User.disabled == False)).all()
    
def create_user(user: UserCreate, session: db_session):
    new_user = User()

    for field, value in user.model_dump(mode="json").items():
        if field == "password":
            value = hash_password(value)
            setattr(new_user, field, value)
        setattr(new_user, field, value)

    setattr(new_user, "created_at", datetime.now(UTC))
    setattr(new_user, "updated_at", datetime.now(UTC))

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

def update_entire_user(existing_user: User, user: UserPut, session: db_session):
    for field, value in user.model_dump(mode="json").items():
        if field == "password":
            value = hash_password(value)
            setattr(existing_user, field, value)
        setattr(existing_user, field, value)

    setattr(existing_user, "updated_at", datetime.now(UTC))

    session.commit()
    session.refresh(existing_user)
    return existing_user

def update_user_info(existing_user: User, user: UserUpdate, session: db_session):
    partial_info = user.model_dump(mode="json", exclude_unset=True)
    for field, value in partial_info.items():
        if field == "password":
            value = hash_password(value)
            setattr(existing_user, field, value)
        setattr(existing_user, field, value)

    setattr(existing_user, "updated_at", datetime.now(UTC))

    session.commit()
    session.refresh(existing_user)
    return existing_user

def delete_user(existing_user: User, session: db_session) -> None:
    session.delete(existing_user)
    session.commit()