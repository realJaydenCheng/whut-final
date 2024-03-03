
from pymongo import MongoClient

CLIENT = MongoClient(
    host="localhost",
    port=27017,
)

class ItemListMongo:

    def __init__(self, db: str) -> None:
        self.db = db
        self.collection = CLIENT[self.db]["itemList"]
    
    def insert_many_items(self, items: list[dict]) -> None:
        self.collection.insert_many(items)
