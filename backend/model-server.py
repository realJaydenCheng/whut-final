
from torch import cuda
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI

e5_local = SentenceTransformer(
    r'C:\Users\realj\Desktop\Projects\whut-final\backend\var\multilingual-e5-large-instruct',
    device='cuda' if cuda.is_available() else 'cpu'
)

server = FastAPI()


class TextList(BaseModel):
    ls: list[str]


@server.get('/embedding/text', response_model=list[float])
def get_text_embedding(text: str) -> list[float]:
    return e5_local.encode(text).tolist()


@server.post('/embedding/text-list', response_model=list[list[float]])
def get_text_embedding_list(ls: TextList) -> list[float]:
    return [
        e5_local.encode(text).tolist()
        for text in ls.ls
    ]
