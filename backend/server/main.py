
import os
import functools
from typing import Annotated

import dotenv
from fastapi import Depends, FastAPI, Cookie, Response, UploadFile, Form
from pydantic import BaseModel
from pymongo import MongoClient
from elasticsearch import Elasticsearch

from server.service import (
    EsSearchQuery, SearchRequest, SearchedData,
    import_data_into_es_from_frame,
    transform_files_into_data_frame,
)
from database.user import UserData, User, UserLoginInput
from database.database_meta import (
    DatabaseMetaData, DatabaseMetaDetail,
    DatabaseMetaInput, DatabaseMetaOutput,
)

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
database_meta_db = DatabaseMetaData(es_client, user_db)


class ReturnMessage(BaseModel):
    message: str
    status: bool


def check_is_login_decorator(func):
    @functools.wraps(func)
    def wrapper(user_id: Annotated[str, Cookie()] = None, *args, **kwargs):
        # if user_id is None:
        #     return ReturnMessage(message="您还没有登录", status=False)
        # else:
        return func(user_id=user_id, *args, **kwargs)
    return wrapper


@app.get("/api", response_model=ReturnMessage)
def root():
    return ReturnMessage(message="Hello World!", status=True)


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


@app.post("/api/user/register", response_model=ReturnMessage)
def register(user: User):
    try:
        user_db.create_user(user)
        return ReturnMessage(message="注册成功", status=True)
    except Exception as e:
        return ReturnMessage(message=repr(e), status=False)


@app.post("/api/user/login", response_model=ReturnMessage)
def login(user: UserLoginInput, response: Response):
    if user_obj := user_db.get_user_info(user.id):
        set_user_cookie(user_obj, response)
        return ReturnMessage(message="登陆成功", status=True)
    else:
        clear_user_cookie(response)
        return ReturnMessage(message="登陆失败", status=False)


@app.get("/api/user/logout", response_model=ReturnMessage)
def logout(response: Response):
    clear_user_cookie(response)
    return ReturnMessage(message="已登出", status=True)


@app.post("/api/db/create", response_model=ReturnMessage)
@check_is_login_decorator
def create_db(inputs: DatabaseMetaInput, user_id: Annotated[str, Cookie()] = None):
    database_meta = database_meta_db.create_database_meta(inputs, user_id)
    database_meta_db.create_database(database_meta)
    return ReturnMessage(message=f"已创建{inputs.name}", status=True)


@app.get("/api/db/list", response_model=list[DatabaseMetaOutput])
def list_db(user_id: Annotated[str, Cookie()] = None):
    if user_id is None:
        return database_meta_db.list_database_metas(None)
    user = user_db.get_user_info(user_id)
    return database_meta_db.list_database_metas(user.org_name)


@app.post("/api/db/delete", response_model=ReturnMessage)
@check_is_login_decorator
def delete_db(db_id: str, user_id: Annotated[str, Cookie()] = None):
    if database_meta_db.check_user_is_owner(db_id, user_id):
        database_meta_db.delete_database_meta(db_id)
        database_meta_db.delete_database(db_id)
        return ReturnMessage(message=f"已删除{db_id}", status=True)
    else:
        return ReturnMessage(message="没有操作权限", status=False)


@app.post("/api/db/import", response_model=ReturnMessage)
def import_data(data_files: list[UploadFile] | UploadFile, db_id: str = Form()):
    database = database_meta_db.get_database_meta(db_id)

    if database is None:
        return ReturnMessage(status=False, message="数据库有误")

    if type(data_files) != list:
        data_files = [data_files]

    try:
        data_frame = transform_files_into_data_frame(data_files)
        s, f = import_data_into_es_from_frame(es_client, database, data_frame)
    except ValueError as e:
        return ReturnMessage(status=False, message=repr(e))
    except KeyError as e:
        return ReturnMessage(status=False, message=f"文件内容不正确: {repr(e)}")

    msg = f"成功导入数据{s}条"
    if f:
        msg += f"，存在以下问题：{f}"

    return ReturnMessage(status=True, message=msg)


@app.get("/api/db/detail", response_model=DatabaseMetaDetail)
def get_db_detail(db_id: str):
    return database_meta_db.get_database_meta_detail(db_id)


@app.post("/api/search", response_model=SearchedData)
def get_search_result(s_requests: SearchRequest):
    es_query = EsSearchQuery(s_requests, database_meta_db)
    return es_query.get_search_list(es_client)
