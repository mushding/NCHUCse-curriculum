中興大學資工系教室借用表 v2.0
===
###### tags: `github README.md`

<p align="center">
<img src="https://i.imgur.com/hRdt4iV.png" alt="image-20201027164029288" style="zoom:10%;" />
</p>
本系統僅限中興大學資工系系辦工讀生使用

## Feature
* 更好的視覺化管理課表
* 方便新增課表
* 用 docker 使系統在佈署時更方便

## 使用方法
### 啟動系統
* 指令法：
    * 打開 cmd 後 cd 至課表資料夾
    ```
    cd D:\0812\classroom\NCHUCse-curriculum
    ```
    * 啟動 docker-compose
    ```
    docker-compose up -d
    ```
    * 課表系統就會開在 [http://localhost/](http://localhost/)
* docker 桌面法：
    * 在桌面上有 Docker Desktop 雙擊點開後
    * 選左方的「Containers/Apps」
    * nchucse-curriculum 這個 container 按下右方三角形「Start」鍵
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
* 為了防止課表被意外刪除
* 本課表並沒有提供刪除相關的 API
* 如果仍要刪除
    * 先在網頁上單擊要刪的課表把它的 id 記下來
    * 在桌面上有 Docker Desktop 雙擊點開後
    * 選左方的「Containers/Apps」
    * 點開 nchucse-curriculum 這個 container
    * 裡面有個 nchucse-curriculum_db_1
    * 滑鼠放在上面，按下右現出現「CLI」按鈕，進入 db 的 container 中
    * 接下來依序打入以下指令：
    ```
    mysql -uroot -p    //會要求輸入密碼，密碼為系上管理員密碼
    ```
    ```
    use curriculum;
    ```
    ```
    delete from [table] where (`id` = '[number]');
    ```
    > 注意事項：
    > 
    > 如要刪除臨時課表，將 [table] 改為 temporary_purpose
    > 
    > 如要刪除固定課表，將 [table] 改為 static_purpose
    >  
    > 後面 [number] 打入相對應的 id number
### 其它
* 右上新增「週」「月」切換功能，在暑假口試週更實用
* 每個課表都可單獨點擊
    * 裡面存著各種課表更詳細的資訊
    * ID 為課表在資料庫中的 private key
    * 新增時間是會了要看是哪一個工讀生新增的，找戰犯用