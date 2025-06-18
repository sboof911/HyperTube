
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from api import auth
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY
from starlette.middleware.sessions import SessionMiddleware

CORS_ORIGINS = os.getenv("CORS_ORIGINS", ["http://localhost:5173"])

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY")
)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    formatted_errors = []
    for err in exc.errors():
        formatted_errors.append(f"Error in field {'.'.join(map(str, err['loc']))}: {err['msg']}")

    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": formatted_errors}
    )

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    # Otherwise wrap it in your format
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.detail
        }
    )

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
