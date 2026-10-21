#from sqlalchemy import ForeignKey
from sqlalchemy import String, Date, DateTime, func, Enum
from sqlalchemy.orm import Mapped, mapped_column
#from sqlalchemy.orm import relationship
from core.enums import *
from core.db import Base
from datetime import date, datetime, UTC
import uuid
from typing import List, Optional

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, index=True, default=func.uuidv4(monotonic=True))
    crm_id: Mapped[Optional[str]] = mapped_column(String(9))
    name: Mapped[str] = mapped_column(String(40))
    last_name: Mapped[str] = mapped_column(String(60))
    birth_date: Mapped[date] = mapped_column(Date)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(15), unique=True)
    access_type: Mapped[AccessType] = mapped_column(
        Enum(
            AccessType,
            name="access_type",
            values_callable=lambda cls: [item.value for item in cls]
        ),
        default=AccessType.PACIENTE
    )
    area_atuacao: Mapped[Optional[str]] = mapped_column(String(30))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
    disabled: Mapped[bool] = mapped_column(default=False)
