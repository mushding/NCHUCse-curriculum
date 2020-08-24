import requests
from bs4 import BeautifulSoup
import re
import time

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
}

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

for data in datas:
    print(data)
    resp = session.post('http://www.cs.nchu.edu.tw/class/update.php', headers = headers, data = data)

data = {'id': 3, 'password': 3345678, 'application_336_3_13': b'\xb7L\xbfn\xa4\xc0(\xa4@)\r\n\xa7\xf5\xaaL\xb7\xc9\r\n\xa4j\xa4@', 'application_336_3_14': b'\xb7L\xbfn\xa4\xc0(\xa4@)\r\n\xa7\xf5\xaaL\xb7\xc9\r\n\xa4j\xa4@', 'application_336_3_15': b'\xb7L\xbfn\xa4\xc0(\xa4@)\r\n\xa7\xf5\xaaL\xb7\xc9\r\n\xa4j\xa4@', 'application_241_3_9': b'\xb4\xb6\xb3q\xaa\xab\xb2z\xbe\xc7\r\n\xbeG\xab\xd8\xa9v\r\n\xa4j\xa4@', 'application_335_3_14': b'\xa5\xbf\xb3W\xbby\xa8\xa5\r\n\xb9\xf9\xa9y\xae\xa6\r\n\xa4j\xa4G', 'application_335_3_15': b'\xa5\xbf\xb3W\xbby\xa8\xa5\r\n\xb9\xf9\xa9y\xae\xa6\r\n\xa4j\xa4G', 'application_335_3_16': b'\xa5\xbf\xb3W\xbby\xa8\xa5\r\n\xb9\xf9\xa9y\xae\xa6\r\n\xa4j\xa4G', 'application_242_3_9': b'\xc5\xde\xbf\xe8\xb3]\xadp\r\n\xb1i\xa9\xb5\xa5\xf4\r\n\xa4j\xa4G', 'application_242_3_10': b'\xc5\xde\xbf\xe8\xb3]\xadp\r\n\xb1i\xa9\xb5\xa5\xf4\r\n\xa4j\xa4G', 'application_242_3_11': b'\xc5\xde\xbf\xe8\xb3]\xadp\r\n\xb1i\xa9\xb5\xa5\xf4\r\n\xa4j\xa4G', 'application_338_3_14': b'\xb8\xea\xb0T\xc0\xcb\xaf\xc1\xbe\xc9\xbd\xd7\r\n\xadS\xc4\xa3\xa4\xa4\r\n\xa4j\xa5|', 'application_338_3_15': b'\xb8\xea\xb0T\xc0\xcb\xaf\xc1\xbe\xc9\xbd\xd7\r\n\xadS\xc4\xa3\xa4\xa4\r\n\xa4j\xa5|', 'application_338_3_16': b'\xb8\xea\xb0T\xc0\xcb\xaf\xc1\xbe\xc9\xbd\xd7\r\n\xadS\xc4\xa3\xa4\xa4\r\n\xa4j\xa5|', 'application_1007_3_13': b'\xb0\xaa\xb5\xa5\xa6\xa8\xb9\xb3\xc5\xe3\xa5\xdc\xa7\xde\xb3N\r\n\xa4\xfd\xa9v\xbb\xca\r\n\xba\xd3\xa4h', 'application_1007_3_14': b'\xb0\xaa\xb5\xa5\xa6\xa8\xb9\xb3\xc5\xe3\xa5\xdc\xa7\xde\xb3N\r\n\xa4\xfd\xa9v\xbb\xca\r\n\xba\xd3\xa4h', 'application_1007_3_15': b'\xb0\xaa\xb5\xa5\xa6\xa8\xb9\xb3\xc5\xe3\xa5\xdc\xa7\xde\xb3N\r\n\xa4\xfd\xa9v\xbb\xca\r\n\xba\xd3\xa4h', 'application_803_3_13': b'\xb9q\xb8\xa3\xb5\xf8\xc4\xb1\r\n\xb6\xc0\xacK\xbf\xc4\xb5\xa5\r\n\xba\xd3\xa4h', 'application_803_3_14': b'\xb9q\xb8\xa3\xb5\xf8\xc4\xb1\r\n\xb6\xc0\xacK\xbf\xc4\xb5\xa5\r\n\xba\xd3\xa4h', 'application_803_3_15': b'\xb9q\xb8\xa3\xb5\xf8\xc4\xb1\r\n\xb6\xc0\xacK\xbf\xc4\xb5\xa5\r\n\xba\xd3\xa4h', 'application_1019_3_14': b'\xb9q\xb8\xa3\xbb\xb2\xa7U\xb3]\xadp\r\n\xa4\xfd\xa6\xe6\xb0\xb7\r\n\xba\xd3\xa4h', 'application_1019_3_15': b'\xb9q\xb8\xa3\xbb\xb2\xa7U\xb3]\xadp\r\n\xa4\xfd\xa6\xe6\xb0\xb7\r\n\xba\xd3\xa4h', 'application_1019_3_16': b'\xb9q\xb8\xa3\xbb\xb2\xa7U\xb3]\xadp\r\n\xa4\xfd\xa6\xe6\xb0\xb7\r\n\xba\xd3\xa4h', 'application_821_3_9': b'\xaa\xab\xc1p\xba\xf4\xbc\xc6\xbe\xda\xa4\xc0\xaaR\xbbP\xc0\xb3\xa5\xce\r\n\xb3\xaf\xb7\xd8\r\n\xba\xd3\xa4h', 'application_821_3_10': b'\xaa\xab\xc1p\xba\xf4\xbc\xc6\xbe\xda\xa4\xc0\xaaR\xbbP\xc0\xb3\xa5\xce\r\n\xb3\xaf\xb7\xd8\r\n\xba\xd3\xa4h', 'application_821_3_11': b'\xaa\xab\xc1p\xba\xf4\xbc\xc6\xbe\xda\xa4\xc0\xaaR\xbbP\xc0\xb3\xa5\xce\r\n\xb3\xaf\xb7\xd8\r\n\xba\xd3\xa4h', 'application_821_3_18': b'\xaa\xab\xc1p\xba\xf4\xc0\xb3\xa5\xce\xbbP\xb8\xea\xae\xc6\xa4\xc0\xaaR\r\n\xb3\xaf\xb7\xd8\r\n\xba\xd3\xb1M', 'application_821_3_19': b'\xaa\xab\xc1p\xba\xf4\xc0\xb3\xa5\xce\xbbP\xb8\xea\xae\xc6\xa4\xc0\xaaR\r\n\xb3\xaf\xb7\xd8\r\n\xba\xd3\xb1M', 'application_821_3_20': b'\xaa\xab\xc1p\xba\xf4\xc0\xb3\xa5\xce\xbbP\xb8\xea\xae\xc6\xa4\xc0\xaaR\r\n\xb3\xaf\xb7\xd8\r\n\xba\xd3\xb1M'}
session.post('http://www.cs.nchu.edu.tw/class/update.php', headers = headers, data = data)

print(datas[2])