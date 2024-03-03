
from time import sleep, localtime
import logging

from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4.element import Tag
from bs4 import BeautifulSoup

from database import ItemListMongo
from crawler.config import ItemListCrawlerConfig


now = localtime()
logger = logging.getLogger('crawler')
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
file_handler = logging.FileHandler(
    f'crawler-{now.tm_mon}-{now.tm_mday}-{now.tm_hour}-{now.tm_min}.log'
)
file_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)
logger.addHandler(console_handler)
logger.addHandler(file_handler)


target = "http://gjcxcy.bjtu.edu.cn/NewLXItemListForStudent.aspx?year={}"


def get_chrome_options():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('window-size=1400,900')
    return options


def main(client: Chrome, mongo: ItemListMongo, config = ItemListCrawlerConfig({})):
    try:
        for year in range(config.start, config.end+1):
            page_source = enter_first_page(client, target.format(year))
            page_soup = BeautifulSoup(page_source, 'lxml')
            total_page = find_total_page(page_soup)
            logger.info(f"Total page of {year}: {total_page}")
            for page in range(1, total_page+1):
                page_source = enter_page(client, page)
                page_soup = BeautifulSoup(page_source, 'lxml')
                item_list = parse_data(page_soup)
                logger.info(
                    f"Page {page} of {year}: length of item list = {len(item_list)}"
                )
                store_data(mongo, item_list)
    except Exception as e:
        logger.error(e)
        state = config.__dict__
        state["current"] = year
        state["page"] = page
        ItemListCrawlerConfig(state).save_state(
            f'crawler-{now.tm_mon}-{now.tm_mday}-{now.tm_hour}-{now.tm_min}.json'
        )


def wait(client: Chrome):
    wait = WebDriverWait(client, 10)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "script")))
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "table")))
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "a")))
    sleep(0.1)


def enter_first_page(client: Chrome, url: str):

    client.get(url)

    wait(client)
    return client.page_source


def find_total_page(soup: BeautifulSoup) -> int:
    return int(soup.select(".pager-info--number-")[-1].text)


def enter_page(client: Chrome, page: int):

    client.execute_script(
        f"__doPostBack('ctl00$ContentMain$AspNetPager1','{page}');"
    )
    wait(client)
    return client.page_source


def parse_data(soup: BeautifulSoup) -> list[dict]:
    trs = soup.select('tr:not(thead tr)')

    def tr_to_dict(tr: Tag):
        tds = tr.find_all('td')
        return {
            "number": tr['id'].split('_')[-1],
            "code": tds[1].get_text(strip=True),
            "title": tds[2].get_text(strip=True),
            "members": tr.find_all('td')[3].get_text(strip=True).split('、'),
            "level": tr.find_all('td')[4].get_text(strip=True),
            "teachers": tr.find_all('td')[5].get_text(strip=True).split('、'),
            "school": tr.find_all('td')[6].get_text(strip=True),
        }

    return [tr_to_dict(tr) for tr in trs]


def store_data(mongo: ItemListMongo, data: list[dict]):
    mongo.insert_many_items(data)
