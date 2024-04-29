
from torch import cuda
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI
import fasttext
import torch

e5_local = SentenceTransformer(
    r'C:\Users\realj\Desktop\Projects\whut-final\backend\var\multilingual-e5-large-instruct',
    device='cuda' if cuda.is_available() else 'cpu'
)

embedding_2023 = fasttext.load_model(
    r"C:\Users\realj\Desktop\Projects\whut-final\backend\var\fasttext-models\2023-model.bin"
)

embedding_2022 = fasttext.load_model(
    r"C:\Users\realj\Desktop\Projects\whut-final\backend\var\fasttext-models\2023-model.bin"
)

alignment_matrix: torch.nn.Parameter = torch.load(
    r"C:\Users\realj\Desktop\Projects\whut-final\backend\var\fasttext-models\alignment_matrix.pt"
)

server = FastAPI()


class TextList(BaseModel):
    ls: list[str]


def map_scores(value: float):

    Q1 = 0.009386032819747925
    Q2 = 0.017434478
    Q3 = 0.033541515469551086
    upper_fence = 0.06977473944425583

    if value >= upper_fence:
        return 98
    elif value <= 0:
        return 65
    elif value == Q1:
        return 75
    elif value == Q2:
        return 85
    elif value == Q3:
        return 90
    else:
        if value < Q1:
            # 在0到Q1之间线性插值映射到65-75
            return 65 + (75 - 65) * (value / Q1)
        elif value < Q2:
            # 在Q1到Q2之间线性插值映射到75-85
            return 75 + (85 - 75) * ((value - Q1) / (Q2 - Q1))
        elif value < Q3:
            # 在Q2到Q3之间线性插值映射到85-90
            return 85 + (90 - 85) * ((value - Q2) / (Q3 - Q2))
        else:
            # 在Q3到上触须之间线性插值映射到90-98
            return 90 + (98 - 90) * ((value - Q3) / (upper_fence - Q3))


@server.get('/embedding/text', response_model=list[float])
def get_text_embedding(text: str) -> list[float]:
    return e5_local.encode(text).tolist()


@server.post('/embedding/text-list', response_model=list[list[float]])
def get_text_embedding_list(text_ls: TextList) -> list[float]:
    return [
        e5_local.encode(text).tolist()
        for text in text_ls.ls
    ]


@server.post('/embedding/words/new', response_model=list[list[float]])
def get_words_embedding_new(text_ls: TextList) -> list[float]:
    return [
        embedding_2023.get_sentence_vector(text).tolist()
        for text in text_ls.ls
    ]


@server.post('/embedding/words/old', response_model=list[list[float]])
def get_words_embedding_old(text_ls: TextList) -> list[float]:
    return [
        embedding_2022.get_sentence_vector(text).tolist()
        for text in text_ls.ls
    ]


@server.get('/eval/score', response_model=float)
def get_eval_score(text: str) -> float:
    new_repr = torch.tensor(
        embedding_2023.get_word_vector(text),
        dtype=torch.float32,
    )
    old_repr = torch.tensor(
        embedding_2022.get_word_vector(text),
        dtype=torch.float32,
    )
    new_repr_al = torch.matmul(new_repr, alignment_matrix)
    value = 1 - float(
        torch.cosine_similarity(new_repr_al, old_repr, dim=0).item()
    )
    return map_scores(value)
