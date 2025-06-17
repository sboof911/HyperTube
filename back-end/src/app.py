
import os
from fastapi import FastAPI
from api import auth
from fastapi.middleware.cors import CORSMiddleware

VITE_URL = os.getenv("VITE_URL", "http://localhost:5173")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[VITE_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])

