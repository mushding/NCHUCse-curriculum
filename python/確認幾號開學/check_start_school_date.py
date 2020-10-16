import requests
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
}

session = requests.Session()

resp = session.get('https://www.nchu.edu.tw/calendar/', headers = headers)
soup = BeautifulSoup(resp.text, 'lxml')

print(soup)