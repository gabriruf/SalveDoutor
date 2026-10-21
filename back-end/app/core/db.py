from sqlalchemy import create_engine, Column, URL, text
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from core.config import Settings

class Base(DeclarativeBase):
    pass

settings = Settings()

db_url = URL.create(
    drivername="postgresql+psycopg",
    username=settings.db_username.get_secret_value(),
    password=settings.db_password.get_secret_value(),
    host="localhost",
    database=settings.db_name.get_secret_value()
)

engine = create_engine(
    url=db_url,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    with SessionLocal() as db:
        yield db
