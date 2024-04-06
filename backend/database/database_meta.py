
from pydantic import BaseModel


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
