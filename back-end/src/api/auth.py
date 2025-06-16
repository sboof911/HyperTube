from fastapi import APIRouter
from pydantic import BaseModel, Field, EmailStr

router = APIRouter()

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


@router.post("/register")
def register(data: RegisterRequest):
    print(f"Registering user: {data.name}, {data.username}, {data.email}")
    return {
        "id": 1,
        "name": data.name,
        "username": data.username,
        "email": data.email,
        "password": data.password
    }
