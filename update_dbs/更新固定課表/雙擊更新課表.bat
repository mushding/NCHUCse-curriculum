@echo off
chcp 65001
python update_static_txt.py
echo.
set /p isUpdate="-> 是否要同步更新到學校網站上？ (Y/N): "

IF /i "%isUpdate%"=="Y" goto update
IF /i "%isUpdate%"=="y" goto update
IF /i "%isUpdate%"=="N" goto notUpdate
IF /i "%isUpdate%"=="n" goto notUpdate

echo Not found.
goto commonexit

:notUpdate
echo.
echo ===========================
echo 課表更新完成！
echo ===========================
echo.
goto commonexit

:update
python ..\更新學校網站的課表\clear_online.py
python ..\更新學校網站的課表\update_online.py
echo.
echo ===========================
echo 課表更新完成！
echo ===========================
echo.
goto commonexit

:commonexit
pause