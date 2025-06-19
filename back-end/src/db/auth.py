from core.security import hash_password
from pydantic import BaseModel, Field, EmailStr, field_validator
import random

def random_profile_picture() -> str:
    return f'https://i.pravatar.cc/150?img={random.randint(1, 70)}'

class UserDataSet(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    @field_validator("password", mode='after')
    def preprocess_word(cls, v):
        return hash_password(v)
    profilePicture: str = Field(default_factory=random_profile_picture)
    languagePreference: str = Field(default='en')
    is_admin: bool = Field(default=False)
