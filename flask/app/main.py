import datetime
import re
import requests
from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
import time
import pandas as pd 

from const import index_to_grade, time_to_hour, start_time_to_hour, end_time_to_hour, table_columns

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
        start_time = start_time_to_hour[times[0]] + ":00"
        end_time = end_time_to_hour[times[-1]] + ":00"
        class_line = {
            "class_id": class_id,
            "name": name,
            "grade": index_to_grade[grade],
            "week": week,
            "start_time": start_time,
            "end_time": end_time,
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
    
    postdatas = [
        {
            # 'v_year': semester_num,
            'v_career': 'U',
            'v_dept': 'U56',
        },
        {
            # 'v_year': semester_num,
            'v_career': 'G',
            'v_dept': 'G56',
        },
        {
            # 'v_year': semester_num,
            'v_career': 'W',
            'v_dept': 'W56',
        },
    ]

    # init class list
    class_line_list = list()

    # for three classes (大學部 碩班 碩專)
    for career, postdata in enumerate(postdatas):    
        resp = session.post('https://onepiece.nchu.edu.tw/cofsys/plsql/crseqry_home_now', headers=headers, data=postdata, verify=False)
        soup = BeautifulSoup(resp.text, 'html.parser')
        tables = soup.findAll('table', 'word_13')[1:]

        # header: https://towardsdatascience.com/all-pandas-read-html-you-should-know-for-scraping-data-from-html-tables-a3cbb5ce8274
        # fixed 15,245 -> 15245: https://stackoverflow.com/questions/59007856/pandas-read-html-converting-only-specific-columns-to-float
        tables = pd.read_html(str(tables), header=1, keep_default_na=False, thousands=None)

        for grade, table in enumerate(tables):
            table.columns = table_columns
            for i in range(len(table)):
                # test if is not 實習
                if table.loc[i, "times"] != "":
                    # test if is not 演講 服學
                    print(re.split('(\d+)', table.loc[i, "classroom"]))
                    if len(re.split('(\d+)', table.loc[i, "classroom"])) == 3:
                        class_line_list.extend(store_and_website(
                            int(table.loc[i, "id"]), 
                            table.loc[i, "name"].split(" ")[0], 
                            str(table.loc[i, "times"]).split(","), 
                            re.split('(\d+)', table.loc[i, "classroom"]), 
                            table.loc[i, "teacher"], 
                            career, 
                            grade
                        ))
                else:
                    # test if is not 演講 服學
                    if len(re.split('(\d+)', table.loc[i, "practical_classroom"])) == 3:
                        class_line_list.extend(store_and_website(
                            int(table.loc[i, "id"]), 
                            table.loc[i, "name"].split(" ")[0], 
                            table.loc[i, "practical_times"].split(","), 
                            re.split('(\d+)', table.loc[i, "practical_classroom"]), 
                            table.loc[i, "practical_teacher"], 
                            career, 
                            grade
                        ))
    return jsonify(class_line_list)

# database data to NCHUCse website
@app.route('/api_flask/updateCseWebsite', methods=['POST'])
def updateCseWebsite():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    }

    # init data list
    datas = list()
    for i in range(7):
        datas.append({
            "id": i + 1,
            "password": 3345678,
        })
    session = requests.Session()
    for curriculum in request.get_json(force=True)['website']:
        week = curriculum["week"]
        classroom = curriculum["classroom"]
        startTime = time_to_hour[curriculum["start_time"].split(":")[0]]
        endTime = time_to_hour[curriculum["end_time"].split(":")[0]]
        classDetail = (curriculum["name"] + "\r\n" + curriculum["teacher"] + "\r\n" + curriculum["grade"]).encode("Big5")
        
        # Cse website post format is: application_821_2_8 means 
        # at room 821, week 2 (TuesDay), time 8 (08:00)
        
        # times is "234" where are multiple values
        # in order to add them individually, add a for loop to "times"
        for time in range(startTime, endTime + 1):
            datas[int(week) - 1]['application_' + classroom + "_" + week + "_" + str(time)] = classDetail
    
    static = request.get_json(force=True)['static']
    temporary = request.get_json(force=True)['temporary']
    purpose = static + temporary


    for curriculum in purpose:
        week = curriculum["week"]
        classroom = curriculum["classroom"]
        startTime = time_to_hour[curriculum["start_time"].split(":")[0]]
        endTime = time_to_hour[curriculum["end_time"].split(":")[0]]
        classDetail = (curriculum["name"] + "\r\n" + curriculum["office"]).encode("Big5")
        
        # Cse website post format is: application_821_2_8 means 
        # at room 821, week 2 (TuesDay), time 8 (08:00)
        
        # times is "234" where are multiple values
        # in order to add them individually, add a for loop to "times"
        for time in range(startTime, endTime + 1):
            datas[int(week) - 1]['application_' + classroom + "_" + week + "_" + str(time)] = classDetail

    # post oneweek data to website
    for data in datas:
        session.post('http://www.cs.nchu.edu.tw/class/update.php', headers=headers, data=data)

    # post today again (bug)
    session.post('http://www.cs.nchu.edu.tw/class/update.php', headers=headers, data=datas[datetime.datetime.today().weekday()])
    
    return "success upload"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)