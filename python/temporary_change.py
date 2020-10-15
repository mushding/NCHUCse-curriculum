# coding=utf-8

import pymysql
import datetime
from config.index import host, user, password, database

name = str()
office = str()
year = str()
month = str()
date = str()
start_time = str()
end_time = str()
classroom = str()

# connect to db
db = pymysql.connect(host, user, password, database)
cursor = db.cursor()

# clear db
sql_str = "TRUNCATE TABLE temporary_purpose;"
try:
    cursor.execute(sql_str)
    db.commit()
except:
    db.rollback()

with open("新增臨時課表.txt", "r", encoding="utf-8") as fileHandler:  
    lines = fileHandler.readlines()
    for line in lines:
        if line.strip().split(' ')[0] != '':
            dates = line.strip().split(' ')[0]
            start_time = line.strip().split(' ')[1][:2] + ":" + line.strip().split(' ')[1][2:]
            end_time = line.strip().split(' ')[2][:2] + ":" + line.strip().split(' ')[2][2:]
            name = line.strip().split(' ')[3]
            office = line.strip().split(' ')[4]
            classroom = line.strip().split(' ')[5]

            year = dates.split('-')[0]
            month = dates.split('-')[1]
            date = dates.split('-')[2]
            week = datetime.date(int(year), int(month), int(date)).weekday()

            print(name, office, dates, week + 1, start_time, end_time, classroom)

            sql_str = "insert into temporary_purpose(name, office, date, week, start_time, end_time, classroom) values('{}','{}','{}','{}','{}','{}','{}');".format(name, office, dates, week + 1, start_time, end_time, classroom)
            try:
                cursor.execute(sql_str)
                db.commit()
            except:
                db.rollback()
db.close()