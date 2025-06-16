from fastapi import FastAPI
from api import auth

app = FastAPI()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}
