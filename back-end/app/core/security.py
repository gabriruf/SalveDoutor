from core.config import Settings
from core.db import get_db
from sqlalchemy.orm import Session
from models.users import User
from datetime import datetime, timedelta, UTC

from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from schemas.security import TokenData

from sqlalchemy import select
from fastapi import Depends, HTTPException, status

from typing import Annotated
from pydantic import EmailStr

import jwt
from jwt.exceptions import InvalidTokenError



settings = Settings()

SECRET_KEY = settings.secret_key.get_secret_value()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hash = PasswordHash.recommended()

DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=4$eC9yy3tc5w5ZHPgkENezCg$uGpk2V9LhuvuPimLHuFjDClk8KLrPndfB1kYMuewMck"

db_session = Annotated[Session, Depends(get_db)]

# Password hashing
def verify_password(plain_pass: str, hashed_pass: str):
    return password_hash.verify(plain_pass, hashed_pass)

def hash_password(plain_pass: str):
    return password_hash.hash(plain_pass)

def authenticate_user(user_email: EmailStr, password: str, session: db_session):
    user = session.scalar(select(User).where(User.email == user_email))
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.password):
        return False
    return user



# Authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=settings.api_token.get_secret_value())

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: db_session):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        payload_email = payload.get("sub")
        if payload_email is None:
            raise credentials_exception
        token_data = TokenData(email=payload_email)
    except InvalidTokenError:
        raise credentials_exception
    user = session.scalar(select(User).where(User.email == token_data.email))
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]):
    if current_user.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuário inativo")
    return current_user