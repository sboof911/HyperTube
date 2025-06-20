
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from api import auth, users
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY
from starlette.middleware.sessions import SessionMiddleware
from config import CORS_ORIGINS, SESSION_SECRET_KEY


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
    secret_key=SESSION_SECRET_KEY,
    same_site="lax",       # safe for OAuth
    https_only=False,  # TODO: set to True in production
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
app.include_router(users.router, prefix="/users", tags=["users"])
