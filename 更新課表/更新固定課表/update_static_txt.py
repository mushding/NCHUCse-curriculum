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
dbfile = "../../schedule-template/curriculum.db"
conn = sqlite3.connect(dbfile)

# clear db when operate
sql_str = "delete from static_purpose"
conn.execute(sql_str)
conn.commit()

with open("add_new_classroom.txt", "r", encoding="utf-8") as fileHandler:  
    lines = fileHandler.readlines()
    for line in lines:
        if line.strip().split(' ')[0] != '':
            week = line.strip().split(' ')[0]
            start_time = line.strip().split(' ')[1][:2] + ":" + line.strip().split(' ')[1][2:]
            end_time = line.strip().split(' ')[2][:2] + ":" + line.strip().split(' ')[2][2:]
            name = line.strip().split(' ')[3]
            office = line.strip().split(' ')[4]
            classroom = line.strip().split(' ')[5]

            print(week, start_time, end_time, name, office, classroom)

            sql_str = "insert into static_purpose(name, office, week, start_time, end_time, classroom) values('{}','{}','{}','{}','{}','{}');".format(name, office, week, start_time, end_time, classroom)
            conn.execute(sql_str)
conn.commit()