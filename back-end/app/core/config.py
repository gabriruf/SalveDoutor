from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='../.env',
        env_file_encoding='utf-8',
        env_ignore_empty=True,
        extra='ignore'
    )

    db_name: SecretStr = SecretStr("x")
    db_username: SecretStr = SecretStr("x")
    db_password: SecretStr = SecretStr("x")
    db_url: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()