import os
from dotenv import load_dotenv

load_dotenv()

CORS_ORIGINS = os.getenv("CORS_ORIGINS", ["http://localhost:5173"])
SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY", None)
if SESSION_SECRET_KEY is None:
    raise ValueError("SESSION_SECRET_KEY must be set in environment variables")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", None)
if GOOGLE_CLIENT_ID is None:
    raise ValueError("GOOGLE_CLIENT_ID must be set in environment variables")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", None)
if GOOGLE_CLIENT_SECRET is None:
    raise ValueError("GOOGLE_CLIENT_SECRET must be set in environment variables")
FRONTEND_URL = os.getenv("FRONTEND_URL")
if FRONTEND_URL is None:
    raise ValueError("FRONTEND_URL must be set in environment variables")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
SECRET_KEY = os.getenv("SECRET_KEY", None)
if SECRET_KEY is None:
    raise ValueError("SECRET_KEY must be set in environment variables")
ALGORITHM = os.getenv("ALGORITHM", None)
if ALGORITHM is None:
    raise ValueError("ALGORITHM must be set in environment variables")
MONGODB_URI = os.getenv("MONGODB_URI", None)
if MONGODB_URI is None:
    raise ValueError("MONGODB_URI must be set in environment variables")
DB_NAME = os.getenv("DB_NAME", None)
if DB_NAME is None:
    raise ValueError("DB_NAME must be set in environment variables")
