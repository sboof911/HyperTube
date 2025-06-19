from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from core.token import create_access_token
from db import db
from .users import PublicUser
from core.token import AuthToken


router = APIRouter()


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

    return PublicUser(**user.model_dump()), AuthToken(access_token=token)


############################ Login Endpoint ############################
from pydantic import TypeAdapter
from core.security import verify_password
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

    return PublicUser(**result), AuthToken(
        access_token=token
    )

############################## OAUTH Endpoint ############################
from typing import Literal
from fastapi import Request
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.responses import RedirectResponse
from starlette.config import Config
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL
import string, secrets


config = Config(environ={
    "GOOGLE_CLIENT_ID": GOOGLE_CLIENT_ID,
    "GOOGLE_CLIENT_SECRET": GOOGLE_CLIENT_SECRET
})

google_oauth = OAuth(config)
google_oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)


class OAuthLogin(BaseModel):
    provider: Literal['google', '42'] = Field(...)



@router.get("/oauth")
async def oauth_login(request: Request, provider: str):
    redirect_uri = request.url_for('google_callback')
    if provider == 'google':
        if not google_oauth.google:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google OAuth is not configured"
            )

        google = google_oauth.create_client('google')
        return await google.authorize_redirect(request, redirect_uri)
    else:
        pass

@router.get("/test")
async def test_oauth():
    user = UserDataSet(
        name="Test User",
        username="testuser",
        email="test@test.com",
        password="testpassword",
        profilePicture=UserDataSet.model_fields['profilePicture'].default_factory()
    )

    return user.profilePicture

@router.get('/google', name="google_callback")
async def auth_callback(request: Request):
    try:
        google = google_oauth.create_client('google')
        token = await google.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth error: {str(e)}"
        )

    if not token or 'userinfo' not in token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to retrieve user info from Google"
        )
    user_info = token['userinfo']
    existing_user = await db.users.find_one({"email": user_info["email"]})
    access_token = None
    if not existing_user:
        # Create a new user in the database
        username = user_info.get("email", "unknown").split('@')[0]
        existing_user = await db.users.find_one({"username": username})
        if existing_user:
            import random
            username = f"{username}_{random.randint(0, 9999)}"
        response = await register(UserDataSet(
            name=user_info.get("name", "Unknown"),
            username=username,
            email=user_info["email"],
            password= ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12)),
            profilePicture=user_info.get("picture", UserDataSet.model_fields['profilePicture'].default_factory()),
            oauth_ids=[user_info["sub"]]
        ))
        access_token = response[1].access_token
    else:
        access_token = create_access_token({
                "sub": str(existing_user["_id"]),
                "username": existing_user["username"]
            })

    return RedirectResponse(f"{FRONTEND_URL}/oauth?token={access_token}")
