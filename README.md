NCHUCSE_curriculum
===
###### tags: `github README.md`

全自動爬蟲更新課表並安排教室時間

![](https://i.imgur.com/w0L67K1.png)

## 使用方法
:::info
直接雙擊 execute.bat
:::
或
* 進入 schedule-template/
* 開起一個簡單的 server
```
python -m SimpleHTTPServer
```
* 或是使用 vscode 的擴充 [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## 如何新增臨時課表
> 臨時課表指的是借用次數不多且臨時借用的課表
* 進入 update_dbs/更新臨時課表
* 執行打開 add_new_classroom.txt
* 照著以下格式打在最底下
```
日期 / 開始時間 / 結束時間 / 目的 / 接用單位 / 接用教室
ex: 2020-01-01 1200 2200 宿營迎新籌備 資工系系學會 241
```
* 最後雙擊 update_txtfile_classroom.bat 

## 如何更改固定課表
> 固定課表指的是開學後固定 meeting 時間或是固定上課的時間
* 進入 update_dbs/固定臨時課表
* 執行打開 add_new_classroom.txt
* 照著以下格式打在最底下
```
星期 / 開始時間 / 結束時間 / 目的 / 接用單位 / 接用教室
ex: 3 1300 1700 meeting 吳俊霖老師 337
```
* 最後雙擊 update_txtfile_classroom.bat 