@echo off
chcp 65001
echo.
echo 網頁好讀版課表已開啟
echo.
start "" http://127.0.0.1:8000/schedule-template/
python -m http.server 8000 --bind 127.0.0.1
pause