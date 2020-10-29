from config.index import host, user, password, database
import pymysql

type_table_en = {
    '1': 'temporary_purpose',
    '2': 'static_purpose',
}
type_table_zh = {
    '1': '臨時課表',
    '2': '固定課表',
}


# connect db
db = pymysql.connect(host, user, password, database)
cursor = db.cursor()

# curriculum type
print("\n(1) 臨時課表")
print("(2) 固定課表")
curriculum_type = input("請輸入要刪除課表的類型 (1/2)：")

# id
pid = input("\n請輸入要刪除課表的 ID：")

# select data
sql_str = "select * from {0} where (`id` = '{1}')".format(type_table_en[curriculum_type], pid)
try:
    cursor.execute(sql_str)
    results = cursor.fetchall()
except:
    print("Error: umable to fetch data")

# reassure
print("\n要刪除的課表：" + type_table_zh[curriculum_type])
print("課表 ID：" + pid)
print("課表借用目的 & 單位：" + str(results[0][2]) + " " + str(results[0][3]))
continue_flag = input("請確認資料是否正確並且確認刪除課表？(Y/N)：")

if continue_flag == 'N' or continue_flag == 'n':
    exit()

sql_str = "delete from {0} where (`id` = '{1}')".format(type_table_en[curriculum_type], pid)
try:
    cursor.execute(sql_str)
    db.commit()
except:
    db.rollback()

print("刪除成功！")

db.close()