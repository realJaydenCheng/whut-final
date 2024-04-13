
import datetime
from typing import Optional

from pydantic import BaseModel
from elasticsearch import BadRequestError, Elasticsearch
import uuid

from .user import UserData


class DatabaseMetaInput(BaseModel):

    name: str
    org_name: str

    title_field: str
    time_field: str

    cate_fields: list[str]
    id_fields: list[str]
    text_fields: list[str]


class DatabaseMetaOutput(BaseModel):

    id: str
    user_id: str
    create_time: str

    name: str
    org_name: str

    title_field: str
    time_field: str

    cate_fields: list[str]
    id_fields: list[str]
    text_fields: list[str]

    user_name: str


class DatabaseMeta(BaseModel):

    id: str
    user_id: str
    create_time: str

    name: str
    org_name: str

    title_field: str
    time_field: str

    cate_fields: list[str]
    id_fields: list[str]
    text_fields: list[str]


class DatabaseMetaData:

    def __init__(self, client: Elasticsearch, user_db: UserData) -> None:
        self.client = client
        self.index = "server-database-meta"
        self.user_db = user_db

    def create_database_meta(self, database_meta: DatabaseMetaInput, user_id: str) -> DatabaseMeta:
        database_meta_dict = database_meta.model_dump()
        database_meta_dict["create_time"] = str(
            datetime.datetime.now().strftime("%Y-%m-%d")
        )
        database_meta_dict["id"] = str(uuid.uuid4())
        database_meta_dict["user_id"] = user_id
        self.client.index(
            index=self.index,
            id=database_meta_dict["id"],
            body=database_meta_dict
        )
        return DatabaseMeta(**database_meta_dict)

    def delete_database_meta(self, database_meta_id: str):
        self.client.delete(index=self.index, id=database_meta_id)

    def check_user_is_owner(self, database_meta_id: str, user_id: str):
        database_meta = self.client.get(index=self.index, id=database_meta_id)
        if database_meta["found"]:
            return database_meta["_source"]["user_id"] == user_id
        return False

    def list_database_metas(self, org_name: Optional[str]) -> list[DatabaseMeta]:

        query = {
            "bool": {
                "should": [
                    {"bool": {"must_not": {"exists": {"field": "org_name"}}}},
                    {"term": {"org_name": "public"}}
                ],
                "minimum_should_match": 1
            }
        }

        # 如果 org_name 不是 None 或者 "public"，在查询中添加匹配 org_name 的条件
        if org_name not in [None, "public"]:
            query["bool"]["should"].append({"term": {"org_name": org_name}})

        metas = [x["_source"] for x in self.client.search(
            index=self.index, body={"query": query}
        )["hits"]["hits"]]

        def add_user_name_into_meta(meta: dict):
            user_id = meta.get("user_id", "")
            user_name = ""
            if user_id != "":
                user_info = self.user_db.get_user_info(user_id)
                user_name = user_info.name
            meta["user_name"] = user_name
            return meta

        return [
            DatabaseMetaOutput(
                **add_user_name_into_meta(meta)
            ) for meta in metas
        ]



    def create_database(self, meta: DatabaseMeta):

        # 构建es映射
        properties = {
            meta.title_field: {
                "type": "text",
                "search_analyzer": "ik_smart",
                "analyzer": "ik_smart",
                "fielddata": True,
                "fields": {
                    "max": {
                        "type": "text",
                        "search_analyzer": "ik_max_word",
                        "analyzer": "ik_max_word",
                        "fielddata": True
                    },
                    "like": {
                        "type": "wildcard"
                    }
                }
            },
            meta.time_field: {
                "type": "date",
                "format": "yyyy-MM-dd"
            }
        }

        for field in meta.cate_fields:
            if field == "":
                continue
            properties[field] = {
                "type": "keyword",
                "doc_values": True,
                "fields": {
                    "search": {
                        "type": "wildcard"
                    }
                }
            }

        for field in meta.id_fields:
            if field == "":
                continue
            properties[field] = {
                "type": "keyword"
            }

        for field in meta.text_fields:
            if field == "":
                continue
            properties[field] = {
                "type": "text",
                "search_analyzer": "ik_smart",
                "analyzer": "ik_smart",
                "fielddata": True,
                "fields": {
                    "max": {
                        "type": "text",
                        "search_analyzer": "ik_max_word",
                        "analyzer": "ik_max_word",
                        "fielddata": True
                    },
                    "like": {
                        "type": "wildcard"
                    }
                }
            }

        # 建表
        es_res = self.client.indices.create(
            index=meta.id,
            mappings={"properties": properties},
        )
        if not es_res.get("acknowledged", False):
            raise BadRequestError

    def delete_database(self, db_id: str):
        self.client.indices.delete(index=db_id)
