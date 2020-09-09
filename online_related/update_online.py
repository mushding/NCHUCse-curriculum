import requests
from bs4 import BeautifulSoup
import re
import time
import datetime
import sqlite3

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
}
postdatas = [
    {
        'v_career': 'U',
        'v_dept': 'U56',
    },
    {
        'v_career': 'G',
        'v_dept': 'G56',
    },
    {
        'v_career': 'W',
        'v_dept': 'W56',
    },
]
index_to_grade = {
    0: "大一",
    1: "大二",
    2: "大三",
    3: "大四",
    4: "碩士",
    5: "碩專",
}
time_to_hour = {
    "1": "8",
    "2": "9",
    "3": "10",
    "4": "11",
    "5": "13",
    "6": "14",
    "7": "15",
    "8": "16",
    "A": "18",
    "B": "19",
    "C": "20",
    "08": 8,
    "09": 9,
    "10": 10,
    "11": 11,
    "12": 12,
    "13": 13,
    "14": 14,
    "15": 15,
    "16": 16,
    "17": 17,
    "18": 18,
    "19": 19,
    "20": 20,
    "21": 21,
    "22": 22,
}

# connect to db
dbfile = "../schedule-template/curriculum.db"
conn = sqlite3.connect(dbfile)

# init data list
datas = list()
for i in range(7):
    datas.append({
        "id": i + 1,
        "password": 3345678,
    })
session = requests.Session()

for career, postdata in enumerate(postdatas):
    def post_to_website(name, days, classroom, teacher, grade):
        if len(classroom) != 3:
            return
        if career == 1:
            grade = 4
        elif career == 2:       # if is 碩專
            grade = 5
        for day in days:
            week = day[0]
            times = day[1:]
            for classtime in times:
                datas[int(week) - 1]['application_' + classroom[1] + "_" + week + "_" + time_to_hour[classtime]] = (name + "\r\n" + teacher + "\r\n" + index_to_grade[grade]).encode("Big5")

    resp = session.post('https://onepiece.nchu.edu.tw/cofsys/plsql/crseqry_home', headers = headers, data = postdata)
    soup = BeautifulSoup(resp.text, 'lxml')
    tables = soup.findAll('table', 'word_13')[1:]

    # select column
    column = [column.text for column in tables[1].find('tr').findAll('td')]

    # each grade
    for index, table in enumerate(tables):
        # each classes
        for row in table.findAll('tr')[1:]:
            classes = [class_info.text.replace('\u3000', '') for class_info in row.findAll('td')]
            # test if is 實習
            if classes[8] == "":
                post_to_website(classes[2].split(" ")[0], classes[9].split(","), re.split('(\d+)', classes[11]), classes[13], index)
            else:
                post_to_website(classes[2].split(" ")[0], classes[8].split(","), re.split('(\d+)', classes[10]), classes[12], index)

# select data
c = conn.cursor()
sql_str = "select * from static_purpose"
records = c.execute(sql_str)
for row in records:
    for time in range(time_to_hour[row[3][:2]], time_to_hour[row[4][:2]]):
        datas[row[2] - 1]['application_' + str(row[5]) + "_" + str(row[2]) + "_" + str(time)] = (row[0] + "\r\n" + row[1] + "\r\n").encode("Big5")

# post oneweek data to website
for data in datas:
    print(data)
    resp = session.post('http://www.cs.nchu.edu.tw/class/update.php', headers = headers, data = data)

# post today again (bug)
session.post('http://www.cs.nchu.edu.tw/class/update.php', headers = headers, data = datas[datetime.datetime.today().weekday()])
print(datas[datetime.datetime.today().weekday()])