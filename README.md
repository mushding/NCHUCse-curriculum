NCHUCSE_curriculum
===
###### tags: `github README.md`

全自動爬蟲更新課表並安排教室時間

![](https://i.imgur.com/w0L67K1.png)

## 使用方法
* 進入 schedule-template/
* 開起一個簡單的 server
```
python -m SimpleHTTPServer
```
* 或是使用 vscode 的擴充 [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
* windows 系統也可以直接雙擊 execute.bat

## 如何新增臨時課表
* 進入 update_dbs/
* 執行
```
python update_temporary.py
```
* 進入各別課表輸入
---
* 或是先打開 temporary_schedule.txt
* 照著以下格式打在最底下
* 日期 / 開始時間 / 結束時間 / 目的 / 接用單位 / 接用教室
* ex: 2020-01-01 1200 2200 宿營迎新籌備 資工系系學會 241
* 最後執行
```
python update_temporary_txt.py
```


## 如何更改固定課表
