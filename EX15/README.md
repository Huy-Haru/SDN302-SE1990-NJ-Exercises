# Exercise 15: RESTful API with Node.js, MongoDB and Mongoose

## Chay ung dung

Can Node.js >= 20 va MongoDB dang chay tai localhost:27017.

~~~powershell
cd EX15
npm ci
npm start
~~~

Mac dinh: http://localhost:3000, database rieng ex15. Tuy chinh bang bien moi truong PowerShell:

~~~powershell
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/ex15'
$env:PORT = '3000'
npm start
~~~

## API va Postman

Import postman/EX15.postman_collection.json, chay cac request theo thu tu. Request tao bai viet tu luu articleId. Body dung raw JSON, Content-Type: application/json.

| Method | URL | Ket qua |
| --- | --- | --- |
| GET | /articles | 200, danh sach bai viet |
| POST | /articles | 201, bai viet vua tao |
| PUT | /articles | 403, khong ho tro |
| DELETE | /articles | 200, xoa tat ca bai viet |
| GET | /articles/:id | 200, chi tiet; 404 neu khong tim thay |
| POST | /articles/:id | 403, khong ho tro |
| PUT | /articles/:id | 200, bai viet sau cap nhat |
| DELETE | /articles/:id | 204, khong co response body |

ID sai dinh dang, JSON sai va du lieu khong hop le tra 400. Loi he thong tra 500.
Title bat buoc, trim va toi thieu 5 ky tu; text bat buoc dai hon 10 ky tu; tags co it nhat 1 phan tu; date mac dinh thoi diem tao. PUT chay lai validation.
Comments nhung trong article, gom body bat buoc va date mac dinh.


## Kiem thu

~~~powershell
npm test
~~~

Test HTTP tich hop voi MongoDB tam thoi (mongodb-memory-server), khong dung database ca nhan. Lan dau can Internet de tai MongoDB binary. Bao phu CRUD, validation khi tao/cap nhat, loi ID/JSON, 403, 404, xoa tat ca.
