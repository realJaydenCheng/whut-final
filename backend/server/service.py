
from io import BytesIO
import pandas as pd
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from fastapi import UploadFile

from database.database_meta import DatabaseMeta


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
