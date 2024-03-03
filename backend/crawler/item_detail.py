

from io import StringIO
import logging
from time import sleep

from bs4 import BeautifulSoup
import pandas as pd
import requests

from database import ItemDetailMongo, ItemListMongo
from crawler.config import ItemDetailCrawlerConfig


target = "http://gjcxcy.bjtu.edu.cn/NewLXItemListForStudentDetail.aspx?ItemNo={}"
headers = {
    "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0",
}


def crawl(
    logger,
    conf: ItemDetailCrawlerConfig,
    item_list_mongo: ItemListMongo,
    item_detail_mongo: ItemDetailMongo
):
    for number in next_target_number(item_list_mongo, item_detail_mongo):
        try:
            page_source = get_page_source(logger, conf, number)
            markup_data = parse_markup_data(BeautifulSoup(page_source, "lxml"))
            table_data = parse_table_data(page_source)
            markup_data.update(table_data)
            markup_data["number"] = number
            item_detail_mongo.insert_one_item(markup_data)
        except ValueError as e:
            logger.warning(f"item number: {number} table may not found, cause: {e}")
            item_detail_mongo.insert_one_item({
                "number": number,
                "项目名称": "项目未找到",
                "项目简介": target.format(number),
            })
            continue
        except Exception as e:
            logger.warning(f"item number: {number} occurred {e}")
            sleep(conf.sleep_time)
            raise e


def next_target_number(
    item_list_mongo: ItemListMongo,
    item_detail_mongo: ItemDetailMongo
):
    for item in item_list_mongo.collection.find():
        number = item["number"]
        if not item_detail_mongo.is_number_exist(number):
            yield number


def get_page_source(logger: logging.Logger, conf: ItemDetailCrawlerConfig, item_no: str):
    for i in range(10):
        response = requests.get(target.format(item_no), headers=headers)
        response.raise_for_status()
        return response.text


def parse_markup_data(soup: BeautifulSoup):
    label_tags = [
        item for item in
        soup.select('div > label > label')
        if (
            "指导教师" not in item.text.strip() and
            "项目成员" not in item.text.strip()
        )
    ]
    value_tags = [
        label.parent.find_next_sibling('div')
        for label in label_tags
    ]
    item_dict = {
        label: value
        for label, value in zip(
            [tag.text.strip() for tag in label_tags],
            [tag.text.strip() for tag in value_tags]
        )
    }
    return item_dict


def parse_members(table: pd.DataFrame):
    return table.to_dict(orient='records')


def parse_teachers(table: pd.DataFrame):
    return table.to_dict(orient='records')


def parse_more_info(table: pd.DataFrame):
    table[0] = table[0].str.rstrip('：')
    return table.set_index(0)[1].to_dict()


def parse_table_data(page_source: str):
    tables = pd.read_html(StringIO(page_source), flavor="lxml")
    tables = [table.fillna("") for table in tables]

    if len(tables) != 3:
        raise ValueError

    return {
        "项目成员": parse_members(tables[0]),
        "指导教师": parse_teachers(tables[1]),
        "项目信息": parse_more_info(tables[2]),
    }
