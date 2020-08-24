# coding=utf-8

import sqlite3

time_to_number = {
    "0800": "08:00",
    "0900": "09:00",
    "1000": "10:00",
    "1100": "11:00",
    "1200": "12:00",
    "1300": "13:00",
    "1400": "14:00",
    "1500": "15:00",
    "1600": "16:00",
    "1700": "17:00",
    "1800": "18:00",
    "1900": "19:00",
    "2000": "20:00",
    "2100": "21:00",
    "2200": "22:00",
}

name = input("借用用途: ")
office = input("借用單位: (ex: SOC Lab): ")
week = input("借用星期 (ex: 1): ")
start_time = input("開始借用時間 (ex: 0800): ")
end_time = input("結束借用時間 (ex: 1200): ")
classroom = input("地點 (ex: 821): ")

# connect to db
dbfile = "../../schedule-template/curriculum.db"
conn = sqlite3.connect(dbfile)

sql_str = "insert into static_purpose(name, office, week, start_time, end_time, classroom) values('{}','{}','{}','{}','{}','{}');".format(name, office, week, time_to_number[start_time], time_to_number[end_time], classroom)
conn.execute(sql_str)
conn.commit()