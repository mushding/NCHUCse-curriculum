@echo off
chcp 65001
python clear_online.py
python update_online.py
python update_db.py
echo.
echo ===========================
echo 網站更新完成！
echo ===========================
echo.
pause