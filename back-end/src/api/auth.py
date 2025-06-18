from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from db import db

router = APIRouter()

class User(BaseModel):
    name: str
    username: str
    email: EmailStr
    profilePicture: str
    languagePreference: str
    
class AuthToken(BaseModel):
    access_token: str
    token_type: str = "bearer"

############################# Register Endpoint ############################
from db.auth import UserDataSet

@router.post("/register")
async def register(user: UserDataSet):
    existing_user = await db.users.find_one({
        "$or": [{"username": user.username}, {"email": user.email}]
    })
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )

    result = await db.users.insert_one(user.model_dump())

    if not result.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User registration failed"
        )

    return User(**user.model_dump())


############################ Login Endpoint ############################
from pydantic import TypeAdapter
from db.auth import verify_password
from core.token import create_access_token


def is_email(value: str) -> bool:
    email_adapter = TypeAdapter(EmailStr)
    try:
        email_adapter.validate_python(value)
        return True
    except ValueError:
        return False

class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=6, max_length=100)

@router.post("/login")
async def login(user: UserLogin):
    if is_email(user.username):
        result = await db.users.find_one({"email": user.username})
    else:
        result = await db.users.find_one({"username": user.username})

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not verify_password(user.password, result.get("password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    token = create_access_token({
            "sub": str(result["_id"]),
            "username": result["username"]
        })

    return User(**result), AuthToken(
        access_token=token,
        token_type="bearer"
    )

