from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from core.token import create_access_token
from .users import PublicUser
from core.token import AuthToken


router = APIRouter()


############################# Register Endpoint ############################
from db.auth import UserDataSet
from db.user import register_user_in_db, find_user_by_keywords_or

@router.post("/register")
async def register(user: UserDataSet, status_response = status.HTTP_201_CREATED):
    existing_user = await find_user_by_keywords_or(["username", "email"], [user.username, user.email])
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )

    inserted_id = await register_user_in_db(user)
    token = create_access_token({
            "sub": inserted_id,
            "username": user.username
        })

    return PublicUser(**user.model_dump()), AuthToken(access_token=token)


############################ Login Endpoint ############################
from pydantic import TypeAdapter
from core.security import verify_password
from core.token import create_access_token
from db.user import find_user_by_keyword


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
async def login(user: UserLogin, status_response = status.HTTP_200_OK):
    if is_email(user.username):
        result = await find_user_by_keyword("email", user.username)
    else:
        result = await find_user_by_keyword("username", user.username)

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
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, _42_CLIENT_ID, _42_CLIENT_SECRET
import string, secrets


google_oauth = OAuth()
google_oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

oauth_42 = OAuth()
oauth_42.register(
    name='42',
    client_id=_42_CLIENT_ID,
    client_secret=_42_CLIENT_SECRET,
    access_token_url='https://api.intra.42.fr/oauth/token',
    authorize_url='https://api.intra.42.fr/oauth/authorize'
)


@router.get("/oauth")
async def oauth_login(request: Request, provider : Literal["google", "42"]):
    if provider == 'google':
        redirect_uri = request.url_for('google_callback')
        if not google_oauth.google:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google OAuth is not configured"
            )

        google = google_oauth.create_client('google')
        return await google.authorize_redirect(request, redirect_uri)
    elif provider == '42':
        redirect_uri = request.url_for('42_callback')
        oauth_42_client = oauth_42.create_client('42')
        if not oauth_42_client:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="42 OAuth is not configured"
            )
        return await oauth_42_client.authorize_redirect(request, redirect_uri)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported OAuth provider"
        )


################################ Google Callback Endpoint ############################

async def oauth_log(request: Request, user_info):
    existing_user = await find_user_by_keyword("email", user_info["email"])
    access_token = None
    if not existing_user:
        # Create a new user in the database
        username = user_info["email"].split('@')[0]
        existing_user = await find_user_by_keyword("username", username)
        if existing_user:
            import random
            username = f"{username}_{random.randint(0, 9999)}"
        response = await register(UserDataSet(
            name=user_info.get("name", "Unknown"),
            username=username,
            email=user_info["email"],
            password= ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12)),
            profilePicture=user_info.get("picture", UserDataSet.model_fields['profilePicture'].default_factory())
        ))
        access_token = response[1].access_token
    else:
        access_token = create_access_token({
                "sub": str(existing_user["_id"]),
                "username": existing_user["username"]
            })

    url = request.headers.get("referer")
    return RedirectResponse(f"{url}oauth?token={access_token}")
    
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

    return await oauth_log(request, user_info)

################################# 42 Callback Endpoint ############################

@router.get('/42', name="42_callback")
async def auth_callback_42(request: Request):
    try:
        oauth_42_client = oauth_42.create_client('42')
        token = await oauth_42_client.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth error: {str(e)}"
        )

    try:
        user_info = await oauth_42_client.get('https://api.intra.42.fr/v2/me', token=token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to retrieve user info from 42: {str(e)}"
        )
    user_info = user_info.json()
    img_link = user_info.get("image", {}).get("link", None)
    user_info = {
        "name": user_info.get("displayname", "Unknown"),
        "email": user_info.get("email", ""),
    }
    if img_link:
        user_info["picture"] = img_link

    return await oauth_log(request, user_info)
