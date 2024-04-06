
import os
from typing import Optional

import dotenv
from fastapi import FastAPI, Cookie, Response
from pymongo import MongoClient
from database.user import UserData, User

dotenv.load_dotenv()

app = FastAPI()
client = MongoClient(
    host=os.getenv("MONGO_HOST"),
    port=int(os.getenv("MONGO_PORT"))
)
user_db = UserData(client, "final")


def check_is_login_decorator(func):
    def wrapper(user_id: Optional[str] = Cookie(None), *args, **kwargs):
        if user_id is None:
            return {"message": "not login"}
        else:
            return func(*args, **kwargs)
    return wrapper


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.post("/admin/db/create")
@check_is_login_decorator
def create_db():
    return {"message": "Hello World"}


@app.post("/admin/db/delete")
@check_is_login_decorator
def delete_db():
    return {"message": "Hello World"}


@app.get("/admin/db/list")
def list_db():
    return {"message": "Hello World"}


@app.get("/admin/db/{db_id}")
@check_is_login_decorator
def get_db(db_id: str):
    return {"message": "Hello World", "db_id": db_id}


def set_user_cookie(user: User, response: Response):
    response.set_cookie(key="user_id", value=user.id)
    response.set_cookie(key="user_name", value=user.name)
    response.set_cookie(key="user_privilege", value=user.privilege)


def clear_user_cookie(response: Response):
    response.delete_cookie(key="user_id")
    response.delete_cookie(key="user_name")
    response.delete_cookie(key="user_privilege")


@app.post("/user/login")
def login(user: User, response: Response):
    if user_db.is_password_ok(user):
        set_user_cookie(user, response)
        return {"message": "login success!"}
    else:
        clear_user_cookie(response)
        return {"message": "login failed!"}


@app.get("/user/logout")
def logout(response: Response):
    clear_user_cookie(response)
    return {"message": "logged out!"}


@app.post("/user/register")
def register(user: User):
    user_db.create_user(user)
    return {"message": "register success!"}
