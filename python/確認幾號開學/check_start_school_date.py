import requests
import flask
import json
import sys
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
}

session = requests.Session()

resp = session.get('https://www.nchu.edu.tw/calendar/', headers = headers)
resp.encoding = 'utf-8'
soup = BeautifulSoup(resp.text, 'lxml')

start_of_school = dict()

spans = soup.findAll('span', attrs={'style': 'letter-spacing: -.3pt'})
for span in spans:
    for row in span.text.split('\r\n'):
        text = row.split(':')[0]
        if "全校學生開學、開始上課" in text:
            date = row.split(':')[-1]
            if date[0] == '9':
                month_date_list = date.split('/')
                start_of_school["summer"] = {"month": month_date_list[0].zfill(2), "date": month_date_list[1].zfill(2)}
            elif date[0] == '2':
                month_date_list = date.split('/')
                start_of_school["winter"] = {"month": month_date_list[0].zfill(2), "date": month_date_list[1].zfill(2)}

# return result to node.js
json = json.dumps(start_of_school)
print(str(json))
sys.stdout.flush()
