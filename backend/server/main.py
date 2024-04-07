
import os
import functools

from typing import Optional, Annotated

import dotenv
from fastapi import FastAPI, Cookie, Response
from pymongo import MongoClient
from elasticsearch import Elasticsearch
from database.user import UserData, User, UserLoginInput
from database.database_meta import DatabaseMeta, DatabaseMetaData, DatabaseMetaInput

dotenv.load_dotenv()

app = FastAPI()
mongo_client = MongoClient(
    host=os.getenv("MONGO_HOST"),
    port=int(os.getenv("MONGO_PORT"))
)
es_client = Elasticsearch(
    hosts=os.getenv("ES_HOST")
)

user_db = UserData(mongo_client, "final")
database_meta_db = DatabaseMetaData(es_client)


def check_is_login_decorator(func):
    @functools.wraps(func)
    def wrapper(user_id: Annotated[str, Cookie()] = None, *args, **kwargs):
        if user_id is None:
            return {"message": "not login"}
        else:
            return func(user_id=user_id, *args, **kwargs)
    return wrapper


@app.get("/api")
def root():
    return {"message": "Testing message: 'Hello World!'"}


def set_user_cookie(user: User, response: Response):
    response.set_cookie(key="user_id", value=user.id)
    response.set_cookie(key="user_name", value=user.name)
    response.set_cookie(key="user_privilege", value=user.privilege)
    response.set_cookie(key="org_name", value=user.org_name)


def clear_user_cookie(response: Response):
    response.delete_cookie(key="user_id")
    response.delete_cookie(key="user_name")
    response.delete_cookie(key="user_privilege")
    response.delete_cookie(key="org_name")


@app.post("/api/user/register")
def register(user: User):
    user_db.create_user(user)
    return {"message": "register success!"}


@app.post("/api/user/login")
def login(user: UserLoginInput, response: Response):
    if user_obj := user_db.get_user_info(user.id):
        set_user_cookie(user_obj, response)
        return {"message": "login success!"}
    else:
        clear_user_cookie(response)
        return {"message": "login failed!"}


@app.get("/api/user/logout")
def logout(response: Response):
    clear_user_cookie(response)
    return {"message": "logged out!"}


@app.post("/api/db/create")
@check_is_login_decorator
def create_db(inputs: DatabaseMetaInput, user_id: Annotated[str, Cookie()] = None):
    database_meta = database_meta_db.create_database_meta(inputs, user_id)
    database_meta_db.create_database(database_meta)
    return {"message": f"{inputs.name} created."}


@app.get("/api/db/list")
def list_db(user_id: Annotated[str, Cookie()] = None):
    if user_id is None:
        return database_meta_db.list_database_metas(None)
    user = user_db.get_user_info(user_id)
    return database_meta_db.list_database_metas(user.org_name)


@app.get("/api/db/{db_id}")
@check_is_login_decorator
def get_db(db_id: str, user_id: Annotated[str, Cookie()] = None):
    db_meta = database_meta_db.get_database_meta(db_id)["_source"]
    return DatabaseMeta(**db_meta)


@app.post("/api/db/delete")
@check_is_login_decorator
def delete_db(db_id: str, user_id: Annotated[str, Cookie()] = None):
    if database_meta_db.check_user_is_owner(db_id, user_id):
        database_meta_db.delete_database_meta(db_id)
        database_meta_db.delete_database(db_id)
        return {"message": f"{db_id} deleted."}
    else:
        return {"message": "have no privilege."}
