from core.security import hash_password, verify_password
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Literal
import random

class UserDataSet(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    @field_validator("password", mode='after')
    def preprocess_word(cls, v):
        return hash_password(v)
    profilePicture: str = Field(default=f'https://i.pravatar.cc/150?img={random.randint(1, 70)}')
    languagePreference: str = Field(default='en')
    role: Literal['user', 'admin'] = Field(default='user')
    oauth_ids : list[str]= Field(default=[])
