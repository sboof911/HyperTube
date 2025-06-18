from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from core.token import get_current_user
from db import db
from fastapi import Request

router = APIRouter()

class PublicUser(BaseModel):
    name: str
    username: str
    email: EmailStr
    profilePicture: str
    languagePreference: str

@router.get("/public")
async def get_user(request : Request):
    print("Request Headers:", request.headers)
    token = request.headers.get("Authorization")
    user = get_current_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return PublicUser(**user)
