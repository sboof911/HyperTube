from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from core.token import create_access_token
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

    token = create_access_token({
            "sub": str(result.inserted_id),
            "username": user.username
        })

    return User(**user.model_dump()), AuthToken(
        access_token=token,
        token_type="bearer"
    )


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

############################## OAUTH Endpoint ############################
import os
from typing import Literal
from fastapi import Request, Body
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.responses import RedirectResponse



GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
config = Config(environ={
    "GOOGLE_CLIENT_ID": GOOGLE_CLIENT_ID,
    "GOOGLE_CLIENT_SECRET": GOOGLE_CLIENT_SECRET
})
if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
    raise ValueError("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in environment variables")

google_oauth = OAuth(config)


class OAuthLogin(BaseModel):
    provider: Literal['google', '42'] = Field(...)


@router.get("/oauth")
async def oauth_login(request: Request, provider: str):
    redirect_uri = request.url_for('google_callback')
    if provider == 'google':
        google_oauth.register(
            name='google',
            server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
            client_kwargs={
                'scope': 'openid email profile'
            }
        )
        if not google_oauth.google:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google OAuth is not configured"
            )
        return await google_oauth.google.authorize_redirect(request, redirect_uri)
    else:
        pass

@router.get('/google/callback', name="google_callback")
async def auth_callback(request: Request):
    token = await google_oauth.google.authorize_access_token(request)
    user_info = await google_oauth.google.parse_id_token(request, token)

    print("User Info:", user_info)
    
    # Here you would typically create/get user from DB
    return {
        "access_token": token['access_token'],
        "user_info": user_info
    }
