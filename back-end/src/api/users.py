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

@router.get("/public", response_model=PublicUser)
async def get_user(request : Request):
    # print("Request Headers:", request.headers)
    token = request.headers.get("Authorization")
    user = await get_current_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return PublicUser(**user)

@router.get("/{id}", response_model=PublicUser)
async def get_user(id : str, request : Request):
    token = request.headers.get("Authorization")
    current_user = get_current_user(token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not current_user.is_admin and current_user._id != id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    return PublicUser(**current_user)

@router.get("/", response_model=list[PublicUser])
async def get_all_users(request : Request):
    token = request.headers.get("Authorization")
    current_user = get_current_user(token)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )

    users = await db.users.find().to_list(length=None)
    return [PublicUser(**user) for user in users]
