from config.index import host, user, password, database
import pymysql

# connect db
db = pymysql.connect(host, user, password, database)
cursor = db.cursor()

# initial data
name = str()
office = str()
year = str()
month = str()
date = str()
start_time = str()
end_time = str()
classroom = str()

with open("新增臨時課表.txt", "r", encoding="utf-8") as fileHandler:  
    lines = fileHandler.readlines()
    for line in lines:
        if line.strip().split(' ')[0] != '':
            date = line.strip().split(' ')[0]
            start_time = line.strip().split(' ')[1][:2] + ":" + line.strip().split(' ')[1][2:]
            end_time = line.strip().split(' ')[2][:2] + ":" + line.strip().split(' ')[2][2:]
            name = line.strip().split(' ')[3]
            office = line.strip().split(' ')[4]
            classroom = line.strip().split(' ')[5]

            print(name, office, date, start_time, end_time, classroom)
            sql_str = "INSERT INTO temporary_purpose(name, office, date, start_time, end_time, classroom) SELECT '{}','{}','{}','{}','{}','{}' FROM dual WHERE not exists (select * from temporary_purpose where temporary_purpose.classroom = '{}' and temporary_purpose.date = '{}' and temporary_purpose.start_time = '{}' and temporary_purpose.end_time = '{}');".format(name, office, date, start_time, end_time, classroom, classroom, date, start_time, end_time)
            try:
                cursor.execute(sql_str)
                db.commit()
            except:
                db.rollback()
db.close()