import re
import requests
from flask import Flask, jsonify
import json
import sys
from bs4 import BeautifulSoup
import time

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
    
    # init connect session
    session = requests.Session()
    
    # get new year/semester (old: 1092, new: 109243284...)
    resp = session.get('https://onepiece.nchu.edu.tw/cofsys/plsql/crseqry_home', headers = headers)
    soup = BeautifulSoup(resp.text, 'lxml')
    semester_num = soup.find(attrs={'value': re.compile('^' + semester_year + semester_type + '\d+$')})['value']
    
    postdatas = [
        {
            'v_year': semester_num,
            'v_career': 'U',
            'v_dept': 'U56',
        },
        {
            'v_year': semester_num,
            'v_career': 'G',
            'v_dept': 'G56',
        },
        {
            'v_year': semester_num,
            'v_career': 'W',
            'v_dept': 'W56',
        },
    ]

    # init class list
    class_line_list = list()

    # for three classes (大學部 碩班 碩專)
    for career, postdata in enumerate(postdatas):    
        resp = session.post('https://onepiece.nchu.edu.tw/cofsys/plsql/crseqry_home', headers = headers, data = postdata)
        soup = BeautifulSoup(resp.text, 'html.parser')
        tables = soup.findAll('table', 'word_13')[1:]
        time.sleep(1)

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

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)