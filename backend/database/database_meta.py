
import datetime
from typing import Optional

from pydantic import BaseModel
from elasticsearch import Elasticsearch
import uuid


class DatabaseMetaInput(BaseModel):

    name: str
    org_name: str

    title_field: str
    time_field: str

    cate_fields: list[str]
    id_fields: list[str]
    text_fields: list[str]


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

    def __init__(self, client: Elasticsearch) -> None:
        self.client = client
        self.index = "serverDatabaseMeta"

    def create_database_meta(self, database_meta: DatabaseMetaInput, user_id: str):
        database_meta_dict = database_meta.model_dump()
        database_meta_dict["create_time"] = str(datetime.datetime.now())
        database_meta_dict["id"] = str(uuid.uuid4())
        database_meta_dict["user_id"] = user_id
        self.client.index(index=self.index, id=database_meta_dict["id"], body=database_meta_dict)

    def delete_database_meta(self, database_meta_id: str):
        self.client.delete(index=self.index, id=database_meta_id)

    def check_user_is_owner(self, database_meta_id: str, user_id: str):
        database_meta = self.client.get(index=self.index, id=database_meta_id)
        if database_meta["found"]:
            return database_meta["_source"]["user_id"] == user_id
        return False

    def list_database_metas(self, org_name: Optional[str]):

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

        return self.client.search(
            index=self.index, body={"query": query}
        )  # TODO: get list




