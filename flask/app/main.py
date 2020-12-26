import requests
from flask import Flask, jsonify
import json
import sys
import re
from bs4 import BeautifulSoup

from const import index_to_grade, time_to_hour

app = Flask(__name__)

def store_and_website(class_id, name, days, classroom, teacher, career, grade):
    class_data = list()
    if career == 1:
        grade = 4
    elif career == 2:       # if is 碩專
        grade = 5
    for day in days:
        week = day[0]
        times = day[1:]
        class_line = {
            "class_id": class_id,
            "name": name,
            "grade": index_to_grade[grade],
            "week": week,
            "time": times,
            "classroom": classroom[1],
            "teacher": teacher,
        }
        class_data.append(class_line)
    return class_data

@app.route('/api_flask/test', methods=['GET'])
def test():
    return jsonify("testtest")

# get website currculum
@app.route('/api_flask/getWebsiteCurrculum/<string:semester_year>/<string:semester_type>', methods=['GET'])
def getWebsiteCurrculum(semester_year, semester_type):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    }
    postdatas = [
        {
            'v_year': semester_year + semester_type,
            'v_career': 'U',
            'v_dept': 'U56',
        },
        {
            'v_year': semester_year + semester_type,
            'v_career': 'G',
            'v_dept': 'G56',
        },
        {
            'v_year': semester_year + semester_type,
            'v_career': 'W',
            'v_dept': 'W56',
        },
    ]

    # init connect session
    session = requests.Session()

    # init class list
    class_line_list = list()

    # for three classes (大學部 碩班 碩專)
    for career, postdata in enumerate(postdatas):    
        resp = session.post('https://onepiece.nchu.edu.tw/cofsys/plsql/crseqry_home', headers = headers, data = postdata)
        soup = BeautifulSoup(resp.text, 'html.parser')
        tables = soup.findAll('table', 'word_13')[1:]

        # select column names
        column = [column.text for column in tables[1].find('tr').findAll('td')]
        # each grade (1 2 3 4) (1 2) (1 2)
        for grade, table in enumerate(tables):
            # each classes
            for row in table.findAll('tr')[1:]:
                classes = [class_info.text.replace('\u3000', '') for class_info in row.findAll('td')]
            
                # test if is 實習
                if classes[8] == "":
                    # test if is not 演講 服學
                    if len(re.split('(\d+)', classes[11])) == 3:
                        class_line_list.extend(store_and_website(classes[1], classes[2].split(" ")[0], classes[9].split(","), re.split('(\d+)', classes[11]), classes[13], career, grade))
                else:
                    # test if is not 演講 服學
                    if len(re.split('(\d+)', classes[10])) == 3:
                        class_line_list.extend(store_and_website(classes[1], classes[2].split(" ")[0], classes[8].split(","), re.split('(\d+)', classes[10]), classes[12], career, grade))
    return jsonify(class_line_list)

# get start of school date
@app.route('/api_flask/getStartSchoolDate', methods=['GET'])
def getStartSchoolDate():
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

    top1 = soup.find('a', attrs={'id': "top1"})
    spans = top1.findChildren("span")
    semester_year = spans[0].text
    start_of_school["year"] = int(semester_year)

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