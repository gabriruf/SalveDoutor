from pydantic import BaseModel, Field, EmailStr
from pydantic_extra_types.phone_numbers import PhoneNumber
from datetime import date, datetime, UTC
import uuid
from core.enums import AccessType

class BrazilPhoneFormat(PhoneNumber):
    default_region_code='BR'
    supported_regions=['BR']
    phone_format="NATIONAL"

class UserBase(BaseModel):
    name: str = Field(min_length=4, max_length=40)
    last_name: str = Field(min_length=4, max_length=60)
    birth_date: date
    email: EmailStr
    phone: BrazilPhoneFormat = Field(min_length=15, max_length=15)
    access_type: AccessType = Field(default=AccessType.PACIENTE)
    area_atuacao: str | None = Field(max_length=30, default=None)

class User(UserBase):
    id: uuid.UUID | None
    crm_id: str | None = Field(max_length=9, default=None)
    password: str = Field(min_length=12, max_length=100)
    created_at: datetime
    updated_at: datetime
    disabled: bool

class UserPublic(UserBase):
    id: uuid.UUID

class UserCreate(UserBase): # for POST and PUT operations
    crm_id: str | None = Field(max_length=9, default=None)
    password: str = Field(min_length=12, max_length=100)
    created_at: datetime = Field(default=datetime.now(UTC))
    updated_at: datetime = Field(default=datetime.now(UTC))

class UserPut(BaseModel): # for PUT operations
    crm_id: str | None = Field(max_length=9, default=None)
    name: str = Field(min_length=4, max_length=40)
    last_name: str = Field(min_length=4, max_length=60)
    birth_date: date
    email: EmailStr 
    phone: BrazilPhoneFormat = Field(min_length=15, max_length=15)
    access_type: AccessType = Field(default=AccessType.PACIENTE)
    password: str = Field(min_length=12, max_length=100)
    area_atuacao: str = Field(max_length=30)
    updated_at: datetime = Field(default=datetime.now(UTC))

class UserUpdate(BaseModel): # for PATCH 
    crm_id: str | None = Field(max_length=9, default=None)
    name: str | None = Field(max_length=40, default=None)
    last_name: str | None = Field(max_length=60, default=None)
    birth_date: date | None = Field(default=None)
    email: EmailStr | None = Field(default=None)
    phone: BrazilPhoneFormat | None = Field(max_length=15, default=None)
    access_type: AccessType | None = Field(default=None)
    area_atuacao: str | None = Field(max_length=30, default=None)
    updated_at: datetime = Field(default=datetime.now(UTC))

class UserSecurityUpdate(BaseModel):
    email: EmailStr | None = Field(default=None)
    password: str = Field(min_length=12, max_length=100)