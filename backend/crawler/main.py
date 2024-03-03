
import argparse

from selenium.webdriver import Chrome

from crawler import item_list, config
from database import ItemListMongo

parser = argparse.ArgumentParser()
parser.add_argument('mode', type=str, choices=[
    "item-list"
])
args = parser.parse_args()

if args.mode == "item-list":
    client = Chrome(item_list.get_chrome_options())
    db = ItemListMongo("final")
    item_list.main(client, db)
