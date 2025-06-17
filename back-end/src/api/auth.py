from fastapi import APIRouter
from pydantic import BaseModel, Field, EmailStr, field_validator
from db import db
from core.security import hash_password, verify_password
from typing import Literal
import random

router = APIRouter()

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    @field_validator("password", mode='after')
    def preprocess_word(cls, v):
        return hash_password(v)
    profilePicture: str = Field(default=f'https://i.pravatar.cc/150?img={random.randint(1, 70)}')
    watchedMovies: list[str] = Field(default_factory=list)
    languagePreference: str = Field(default='en')
    role: Literal['user', 'admin'] = Field(default='user')

class User(BaseModel):
    id: str
    name: str
    username: str
    email: EmailStr
    profilePicture: str
    watchedMovies: list[str]
    languagePreference: str

@router.post("/register")
async def register(user: UserRegister):
    result = await db.users.insert_one(user.model_dump())

    return User(**user.model_dump(), id=str(result.inserted_id))
