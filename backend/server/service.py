
from io import BytesIO
from datetime import datetime

import pandas as pd
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from fastapi import UploadFile
from pydantic import BaseModel

from database.database_meta import DatabaseMeta, DatabaseMetaData


def transform_files_into_data_frame(
    files: list[UploadFile],
) -> pd.DataFrame:

    data_list: list[pd.DataFrame] = []
    for index, file in enumerate(files):
        file_name = file.filename
        file_content = file.file
        try:
            file_content = file.file.read()
            file.file.close()
            # 将内容转换为 BytesIO 对象
            content_stream = BytesIO(file_content)

            if file_name.endswith('.csv'):
                data_ = pd.read_csv(content_stream, dtype=str)
            elif file_name.endswith('.xls') or file_name.endswith('.xlsx'):
                data_ = pd.read_excel(content_stream, dtype=str)
            else:
                raise ValueError(f"第{index + 1}个文件类型有误")
            data_list.append(data_)
        except (
            UnicodeDecodeError, ValueError,  # ParserError
        ) as e:
            raise ValueError(f"第{index + 1}个文件内容不正确: \n{e}")

    data = pd.concat(data_list)
    data = data.drop_duplicates(data.columns)
    return data


def import_data_into_es_from_frame(
    es_client: Elasticsearch,
    database: DatabaseMeta,
    data: pd.DataFrame,
):

    fields = [
        database.title_field, database.time_field
    ] + database.cate_fields + database.id_fields + database.text_fields

    def _actions(df: pd.DataFrame, should_fields: list[str]):

        for _, row in df.iterrows():

            _source = {}
            for field in should_fields:
                if pd.isna(row.get(field, None)):
                    continue
                _source[field] = (
                    str(row[field])
                    .strip()
                    .replace("\n", "")
                    .replace("\t", "")
                )

            yield {
                "_source": _source
            }

    return bulk(
        es_client,
        _actions(data, fields),
        index=database.id,
        raise_on_error=False,
    )


class SearchRequest(BaseModel):
    db_id: str

    terms: list[str] | None
    date_range: tuple[int, int] | None
    
    filters: dict[str, list[str]] | None
    sub_terms: dict[str, list[str]] | None

    page: int | None
    page_size: int | None


class SearchedData(BaseModel):

    data: list[dict]
    total: int


class EsSearchQuery:

    def __init__(self, s_request: SearchRequest, database_meta_db: DatabaseMetaData) -> None:

        # 查询数据库元数据
        self.database = database_meta_db.get_database_meta(s_request.db_id)
        
        self.page_size = s_request.page_size
        self.page = s_request.page

        # 构造query，用于后续查询
        self.query = {
            "bool": {
                "filter": [],
                "must": [],
                "should": [],
            }
        }

        if terms := s_request.terms:
            terms_and = [
                {"wildcard": {f"{self.database.title_field}.like": f"*{term}*"}}
                for term in terms
            ]
            self.query["bool"]["filter"].append({
                "bool": {"must": terms_and}
            })

        if date_range := s_request.date_range:
            start_date = datetime(date_range[0], 1, 1)
            end_date = datetime(date_range[1], 12, 31)
            self.query["bool"]["filter"].append({
                "range": {
                    self.database.time_field: {
                        "gte": start_date.strftime('%Y-%m-%d'),
                        "lte": end_date.strftime('%Y-%m-%d'),
                    }
                }
            })

        if filters := s_request.filters:
            for field, values in filters.items():
                field_or = [
                    {"term": {field: value}}
                    for value in values
                ]
                self.query["bool"]["filter"].append({
                    "bool": {"should": field_or}
                })

        if sub_terms := s_request.sub_terms:
            for field, values in sub_terms.items():
                field_or = [
                    {"wildcard": {f"{field}.like": f"*{value}*"}}
                    for value in values
                ]
                self.query["bool"]["should"].append({
                    "bool": {"must": field_or}
                })

    def get_search_list(self, es_client: Elasticsearch) -> list[dict]:

        size = self.page_size if self.page_size else 10 
        page = self.page if self.page else 1
        
        res = es_client.search(
            index=self.database.id, 
            query=self.query,
            size=size, 
            from_=size * (page - 1),
        )["hits"]

        return SearchedData(
            data=[x["_source"] for x in res["hits"]],
            total=res['total']["value"],
        )
