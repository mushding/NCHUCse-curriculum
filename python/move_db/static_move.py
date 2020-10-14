import sqlite3
import pymysql
from config.index import host, user, password, database

# sqlite
db_file = "curriculum.db"
conn = sqlite3.connect(db_file)
cursor = conn.cursor()

sql_str = "select * from static_purpose"
datas = cursor.execute(sql_str)

# mysql
conn = pymysql.connect(host, user, password, database)
cursor = conn.cursor()

for data in datas:
    sql_str = "insert into static_purpose(name, office, week, start_time, end_time, classroom) values ('{}','{}','{}','{}','{}','{}');".format(data[0], data[1], data[2], data[3], data[4], data[5])
    cursor.execute(sql_str)
    conn.commit()
conn.close()