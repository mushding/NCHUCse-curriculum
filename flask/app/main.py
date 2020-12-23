import requests
from flask import Flask, jsonify
import json
import sys
from bs4 import BeautifulSoup

app = Flask(__name__)

# get start of school date
@app.route('/api_flask/getStartSchoolDate', methods=['GET'])
def home():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    }

    session = requests.Session()

    try:
        resp = session.get('https://www.nchu.edu.tw/calendar/', headers = headers)
    except:
        exit()

    resp.encoding = 'utf-8'
    soup = BeautifulSoup(resp.text, 'html.parser')

    start_of_school = dict()

    spans = soup.findAll('span', attrs={'style': 'letter-spacing: -.3pt'})
    for span in spans:
        for row in span.text.split('\r\n'):
            text = row.split(':')[0]
            if "全校學生開學、開始上課" in text:
                date = row.split(':')[-1]
                if date[0] == '9':
                    month_date_list = date.split('/')
                    start_of_school["9"] = {"month": month_date_list[0].zfill(2), "date": month_date_list[1].zfill(2)}
                elif date[0] == '2':
                    month_date_list = date.split('/')
                    start_of_school["2"] = {"month": month_date_list[0].zfill(2), "date": month_date_list[1].zfill(2)}

    # return result to node.js
    return jsonify(start_of_school)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)