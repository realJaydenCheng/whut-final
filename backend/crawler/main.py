
import argparse

from selenium.webdriver import Chrome

from crawler import item_list, config, item_detail
from database import ItemListMongo, ItemDetailMongo

parser = argparse.ArgumentParser()
parser.add_argument('mode', type=str, choices=[
    "item-list",
    "item-detail",
])
args = parser.parse_args()

if args.mode == "item-list":
    client = Chrome(item_list.get_chrome_options())
    db = ItemListMongo("final")
    item_list.main(client, db)
elif args.mode == "item-detail":
    list_db = ItemListMongo("final")
    detail_db = ItemDetailMongo("final")
    item_detail.crawl(list_db, detail_db)
