中興大學資工系教室借用表 v2.0
===
###### tags: `github README.md`

<p align="center">
<img src="https://i.imgur.com/hRdt4iV.png" alt="image-20201027164029288" width="200" />
</p>
本系統僅限中興大學資工系系辦工讀生使用

## Feature
* 更好的視覺化管理課表
* 方便新增課表
* 用 docker 使系統在佈署時更方便
* 每學期結束時自動更新新的課表

## 使用方法
### 啟動系統
* docker：
    * 進入課表系統資料夾
    ```
    cd NCHUCse-curriculum
    ```
    * 起動 docker 服務
    ```
    docker-compose up --build
    ```
    * 課表系統就會開在 [http://localhost/](http://localhost/)

### 新增課表
* 在要新增的教室下
* 對著要新增課表開始時間按兩下滑鼠左鍵
* 左側會出現新增課表面板
* 依序輸入：
    * 借用目的
    * 時間
    * 借用類別
        > 借用類別一共有三類：
        > 
        > 網頁課表 -> 從學校網頁上爬來的課表
        > 
        > 固定課表 -> 借用一整個學期之課表
        > 
        > 臨時課表 -> 特別幾天需要借用之課表
    * 借用單位
* 按下「儲存」後即成功新增課表
### 刪除課表
* 小心！
* 為了防止課表被意外刪除
* 本課表並沒有提供刪除相關的 API
* 如果仍要刪除
    * 先在網頁上單擊要刪的課表把它的 id 記下來
    * 進入 python 資料夾中
    * 再進入刪除課表
    ```
    D: -> 0812 -> classroom -> 課表系統好讀版v2.0 -> python -> 刪除課表
    ```
    * 雙擊 [雙擊刪除課表.bat](./python/刪除課表/雙擊刪除課表.bat)
    * 輸入要刪除的類別以及 ID 即可刪除
### 其它
* 右上新增「週」「月」切換功能，在暑假口試週更實用
* 每個課表都可單獨點擊
    * 裡面存著各種課表更詳細的資訊
    * ID 為課表在資料庫中的 private key
    * 新增時間是會了要看是哪一個工讀生新增的，找戰犯用

## 維護
### 進入 database
* 如果要進入 database 修改資料
* 首先先找出 mysql 的 container id
```
docker container ls
```
* 接著進入 mysql container
```
docker exec -it <container_id> /bin/bash
```
* 進入 mysql
* 密碼為系統管理員密碼
```
mysql -uroot -p
```
* mysql 操作
```
use curriculum;
select * from website_curriculum;
...
```
* 備份 .sql file
```
設定排程
crontab -e
```
```
每天早上 6:00 備份
00 06 * * * /home/cloud/Desktop/NCHUCse-curriculum/mysql-docker-backup.sh
```