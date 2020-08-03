import requests

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
}
classrooms = ["803", "821", "1002", "1007", "1019", "1022A", "241", "242", "335", "336", "337", "338", "350"]
session = requests.Session()

for week in range(1, 8):
    data = dict()
    data["id"] = week
    data["password"] = 3345678
    for classroom in classrooms:
        for time in range(8, 24):
            data['application_' + classroom + "_" + str(week) + "_" + str(time)] = ""
    resp = session.post('http://www.cs.nchu.edu.tw/class/update.php', headers = headers, data = data)

