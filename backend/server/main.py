
import os
from typing import Optional

import dotenv
from fastapi import FastAPI, Cookie, Response
from pymongo import MongoClient
from elasticsearch import Elasticsearch
from database.user import UserData, User
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
    def wrapper(user_id: Optional[str] = Cookie(None), *args, **kwargs):
        if user_id is None:
            return {"message": "not login"}
        else:
            return func(*args, **kwargs)
    return wrapper


@app.get("/")
def root():
    return {"message": "Testing message: 'Hello World!'"}


@app.post("/admin/db/create")
@check_is_login_decorator
def create_db(inputs: DatabaseMetaInput, user_id:str=Cookie(None)):
    database_meta_db.create_database_meta(inputs, user_id)
    return {"message": f"{inputs.name} created."}


@app.post("/admin/db/delete")
@check_is_login_decorator
def delete_db(db_id:str, user_id:str=Cookie(None)):
    if database_meta_db.check_user_is_owner(db_id, user_id):
        database_meta_db.delete_database_meta(db_id)
        return {"message": f"{db_id} deleted."}
    else:
        return {"message": "have no privilege."}


@app.get("/admin/db/list")
def list_db(user_id:Optional[str]=Cookie(None)):
    user = user_db.get_user_info(user_id)
    return database_meta_db.list_database_metas(user.org_name)


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
