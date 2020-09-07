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

data = {'id': 4, 'password': 3345678,'application_241_4_10': b'\xb4\xb6\xb3q\xaa\xab\xb2z\xbe\xc7\r\n\xbeG\xab\xd8\xa9v\r\n\xa4j\xa4@', 'application_241_4_11': b'\xb4\xb6\xb3q\xaa\xab\xb2z\xbe\xc7\r\n\xbeG\xab\xd8\xa9v\r\n\xa4j\xa4@', 'application_242_4_9': b'\xa7@\xb7~\xa8t\xb2\xce\r\n\xb1i\xb0a\xb1l\r\n\xa4j\xa4T', 'application_242_4_10': b'\xa7@\xb7~\xa8t\xb2\xce\r\n\xb1i\xb0a\xb1l\r\n\xa4j\xa4T', 'application_242_4_11': b'\xa7@\xb7~\xa8t\xb2\xce\r\n\xb1i\xb0a\xb1l\r\n\xa4j\xa4T', 'application_821_4_13': b'\xb0\xca\xbaA\xba\xf4\xad\xb6\xb5{\xa6\xa1\xb3]\xadp\r\n\xb6\xc0\xacK\xbf\xc4\r\n\xa4j\xa4T', 'application_821_4_14': b'\xb0\xca\xbaA\xba\xf4\xad\xb6\xb5{\xa6\xa1\xb3]\xadp\r\n\xb6\xc0\xacK\xbf\xc4\r\n\xa4j\xa4T', 'application_821_4_15': b'\xb0\xca\xbaA\xba\xf4\xad\xb6\xb5{\xa6\xa1\xb3]\xadp\r\n\xb6\xc0\xacK\xbf\xc4\r\n\xa4j\xa4T', 'application_335_4_14': b'\xb0\xcf\xb0\xec\xba\xf4\xb8\xf4\r\n\xb0\xaa\xb3\xd3\xa7U\r\n\xa4j\xa5|', 'application_335_4_15': b'\xb0\xcf\xb0\xec\xba\xf4\xb8\xf4\r\n\xb0\xaa\xb3\xd3\xa7U\r\n\xa4j\xa5|', 'application_335_4_16': b'\xb0\xcf\xb0\xec\xba\xf4\xb8\xf4\r\n\xb0\xaa\xb3\xd3\xa7U\r\n\xa4j\xa5|', 'application_336_4_14': b'\xb0\xaa\xb5\xa5\xb8\xea\xae\xc6\xb1\xb4\xb0\xc9\xbbP\xa5\xa8\xb6q\xb8\xea\xae\xc6\xa4\xc0\xaaR\r\n\xadS\xc4\xa3\xa4\xa4\xb5\xa5\r\n\xba\xd3\xa4h', 'application_336_4_15': b'\xb0\xaa\xb5\xa5\xb8\xea\xae\xc6\xb1\xb4\xb0\xc9\xbbP\xa5\xa8\xb6q\xb8\xea\xae\xc6\xa4\xc0\xaaR\r\n\xadS\xc4\xa3\xa4\xa4\xb5\xa5\r\n\xba\xd3\xa4h', 'application_336_4_16': b'\xb0\xaa\xb5\xa5\xb8\xea\xae\xc6\xb1\xb4\xb0\xc9\xbbP\xa5\xa8\xb6q\xb8\xea\xae\xc6\xa4\xc0\xaaR\r\n\xadS\xc4\xa3\xa4\xa4\xb5\xa5\r\n\xba\xd3\xa4h', 'application_338_4_14': b'\xb0\xaa\xb5\xa5\xb6W\xa4j\xab\xac\xbfn\xc5\xe9\xb9q\xb8\xf4\xb3]\xadp\r\n\xb6\xc0\xbcw\xa6\xa8\r\n\xba\xd3\xa4h', 'application_338_4_15': b'\xb0\xaa\xb5\xa5\xb6W\xa4j\xab\xac\xbfn\xc5\xe9\xb9q\xb8\xf4\xb3]\xadp\r\n\xb6\xc0\xbcw\xa6\xa8\r\n\xba\xd3\xa4h', 'application_338_4_16': b'\xb0\xaa\xb5\xa5\xb6W\xa4j\xab\xac\xbfn\xc5\xe9\xb9q\xb8\xf4\xb3]\xadp\r\n\xb6\xc0\xbcw\xa6\xa8\r\n\xba\xd3\xa4h', 'application_1007_4_9': b'SOC\xb4\xfa\xb8\xd5\r\n\xb6\xc0\xbcw\xa6\xa8\r\n\xba\xd3\xa4h', 'application_1007_4_10': b'SOC\xb4\xfa\xb8\xd5\r\n\xb6\xc0\xbcw\xa6\xa8\r\n\xba\xd3\xa4h', 'application_1007_4_11': b'SOC\xb4\xfa\xb8\xd5\r\n\xb6\xc0\xbcw\xa6\xa8\r\n\xba\xd3\xa4h', 'application_1019_4_9': b'\xb5L\xbdu\xba\xf4\xb8\xf4\xae\xc4\xaf\xe0\xa4\xc0\xaaR\r\n\xb4\xbf\xbe\xc7\xa4\xe5\r\n\xba\xd3\xa4h', 'application_1019_4_10': b'\xb5L\xbdu\xba\xf4\xb8\xf4\xae\xc4\xaf\xe0\xa4\xc0\xaaR\r\n\xb4\xbf\xbe\xc7\xa4\xe5\r\n\xba\xd3\xa4h', 'application_1019_4_11': b'\xb5L\xbdu\xba\xf4\xb8\xf4\xae\xc4\xaf\xe0\xa4\xc0\xaaR\r\n\xb4\xbf\xbe\xc7\xa4\xe5\r\n\xba\xd3\xa4h', 'application_338_4_9': b'\xb8\xea\xae\xc6\xaew\xa8t\xb2\xce\r\n\xb8\xeb\xa9[\xaa\xda\r\n\xba\xd3\xa4h', 'application_338_4_10': b'\xb8\xea\xae\xc6\xaew\xa8t\xb2\xce\r\n\xb8\xeb\xa9[\xaa\xda\r\n\xba\xd3\xa4h', 'application_338_4_11': b'\xb8\xea\xae\xc6\xaew\xa8t\xb2\xce\r\n\xb8\xeb\xa9[\xaa\xda\r\n\xba\xd3\xa4h', 'application_803_4_18': b'\xb9\xcf\xa7\xce\xc3\xd1\xa7O\r\n\xb3\xeb\xa5\xdb\xa5\xcd\r\n\xba\xd3\xb1M', 'application_803_4_19': b'\xb9\xcf\xa7\xce\xc3\xd1\xa7O\r\n\xb3\xeb\xa5\xdb\xa5\xcd\r\n\xba\xd3\xb1M', 'application_803_4_20': b'\xb9\xcf\xa7\xce\xc3\xd1\xa7O\r\n\xb3\xeb\xa5\xdb\xa5\xcd\r\n\xba\xd3\xb1M'}
session.post('http://www.cs.nchu.edu.tw/class/update.php', headers = headers, data = data)

print(datas[3])