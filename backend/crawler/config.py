
import json


class ItemListCrawlerConfig:
    def __init__(self, conf_dict: dict) -> None:
        self.start = conf_dict.get('start', 2017)
        self.end = conf_dict.get('end', 2023)
        self.current = conf_dict.get('current', self.start)
        self.sleep_time = conf_dict.get('sleep_time', 0.1)
        self.page = conf_dict.get('page', 1)

    def save_state(self, path: str) -> None:
        with open(path, 'w') as f:
            json.dump(self.__dict__, f)

    @staticmethod
    def load_state(path: str) -> 'ItemListCrawlerConfig':
        with open(path, 'r') as f:
            conf_dict = json.load(f)
        return ItemListCrawlerConfig(conf_dict)

    def __repr__(self) -> str:
        return f'ItemListConfig(start={self.start}, end={self.end}, current={self.current}, sleep_time={self.sleep_time}, page={self.page})'
