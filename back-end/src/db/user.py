from fastapi import HTTPException, status
from db import db
from db.auth import UserDataSet
from typing import List

async def find_user_by_keyword(keyword: str, identifier: str):
    return await db.users.find_one({keyword: identifier})

async def register_user_in_db(user_data : UserDataSet):
    result = await db.users.insert_one(user_data.model_dump())
    if not result.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User registration failed"
        )
    return str(result.inserted_id)

async def find_user_by_keyword(keyword: str, identifier: str):
    return await db.users.find_one({keyword: identifier})

async def find_user_by_keywords_or(keywords : List[str], identifiers: List[str]):
    existing_user = await db.users.find_one({
        "$or":[
            {f"{keyword}": identifier} for keyword, identifier in zip(keywords, identifiers)
        ]
    })

    return existing_user
