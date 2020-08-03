# coding=utf-8

import sqlite3
import datetime

name = str()
office = str()
year = str()
month = str()
date = str()
start_time = str()
end_time = str()
classroom = str()

# connect to db
dbfile = "../schedule-template/curriculum.db"
conn = sqlite3.connect(dbfile)

# clear db when operate
sql_str = "delete from temporary_purpose"
conn.execute(sql_str)
conn.commit()

with open("add_new_classroom.txt", "r", encoding="utf-8") as fileHandler:  
    lines = fileHandler.readlines()
    for line in lines:
        if line.strip().split(' ')[0] != '':
            times = line.strip().split(' ')[0]
            start_time = line.strip().split(' ')[1][:2] + ":" + line.strip().split(' ')[1][2:]
            end_time = line.strip().split(' ')[2][:2] + ":" + line.strip().split(' ')[2][2:]
            name = line.strip().split(' ')[3]
            office = line.strip().split(' ')[4]
            classroom = line.strip().split(' ')[5]

            year = times.split('-')[0]
            month = times.split('-')[1]
            date = times.split('-')[2]
            weeknum = datetime.date(int(year), int(month), int(date)).isocalendar()[1]
            week = datetime.date(int(year), int(month), int(date)).weekday()

            print(name, office, weeknum, week + 1, start_time, end_time, classroom)

            sql_str = "insert into temporary_purpose(name, office, weeknum, week, start_time, end_time, classroom) values('{}','{}','{}','{}','{}','{}','{}');".format(name, office, weeknum, week + 1, start_time, end_time, classroom)
            conn.execute(sql_str)
conn.commit()