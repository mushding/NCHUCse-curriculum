import requests
from bs4 import BeautifulSoup
import re
import time
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
    }
]
index_to_grade = {
    0: "大一",
    1: "大二",
    2: "大三",
    3: "大四",
    4: "碩專",
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
}

# connect to db
dbfile = "../schedule-template/curriculum.db"
conn = sqlite3.connect(dbfile)

# clear db when operate
sql_str = "delete from curriculum"
conn.execute(sql_str)
conn.commit()

def store_in_db(class_id, name, days, classroom, teacher, grade):
    if len(classroom) != 3:
        return

    print(class_id, name, days, classroom, teacher, grade)

    for day in days:
        week = day[0]
        times = day[1:]            
        sql_str = "insert into curriculum(class_id, name, grade, week, time, classroom, teacher) values({},'{}','{}','{}','{}','{}','{}');".format(class_id, name, index_to_grade[grade], week, times, classroom[1], teacher)
        print(sql_str)
        conn.execute(sql_str)
        conn.commit()

session = requests.Session()

for career, postdata in enumerate(postdatas):
    resp = session.post('https://onepiece.nchu.edu.tw/cofsys/plsql/crseqry_home', headers = headers, data = postdata)
    soup = BeautifulSoup(resp.text, 'lxml')
    tables = soup.findAll('table', 'word_13')[1:]

    # select column
    column = [column.text for column in tables[1].find('tr').findAll('td')]

    # each grade
    for index, table in enumerate(tables):
        # if is 碩專
        if career == 1:
            index = 4
        # each classes
        for row in table.findAll('tr')[1:]:
            classes = [class_info.text.replace('\u3000', '') for class_info in row.findAll('td')]
            # test if is 實習
            if classes[8] == "":
                store_in_db(classes[1], classes[2].split(" ")[0], classes[9].split(","), re.split('(\d+)', classes[11]), classes[13], index)
            else:
                store_in_db(classes[1], classes[2].split(" ")[0], classes[8].split(","), re.split('(\d+)', classes[10]), classes[12], index)
    
conn.close()