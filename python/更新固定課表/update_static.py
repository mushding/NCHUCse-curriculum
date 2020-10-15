# coding=utf-8
from config.index import host, user, password, database
import pymysql

# connect db
db = pymysql.connect(host, user, password, database)
cursor = db.cursor()

# initail data
name = str()
office = str()
year = str()
month = str()
date = str()
start_time = str()
end_time = str()
classroom = str()

with open("新增固定課表.txt", "r", encoding="utf-8") as fileHandler:  
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
            sql_str = "INSERT INTO static_purpose(name, office, week, start_time, end_time, classroom) SELECT '{}','{}','{}','{}','{}','{}' FROM dual WHERE not exists (select * from static_purpose where static_purpose.classroom = '{}' and static_purpose.week = '{}' and static_purpose.start_time = '{}' and static_purpose.end_time = '{}');".format(name, office, week, start_time, end_time, classroom, classroom, week, start_time, end_time)
            try:
                cursor.execute(sql_str)
                db.commit()
            except:
                db.rollback()
db.close()