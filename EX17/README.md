# Exercise 17: Applying MVC

## Chay ung dung

Can Node.js >= 20 va MongoDB dang chay tai localhost:27017.

~~~powershell
cd EX17
npm ci
npm start
~~~

Mac dinh: http://localhost:3000, database rieng ex17. Tuy chinh bang bien moi truong PowerShell:

~~~powershell
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/ex17'
$env:PORT = '3000'
npm start
~~~

## API va Postman

Import postman/EX17.postman_collection.json, chay cac request theo thu tu. Request tao bai viet tu luu articleId. Body dung raw JSON, Content-Type: application/json.

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
| POST | /comments | 201, tao comment voi article la ObjectId |
| GET | /comments | 200, populate article thanh document |

ID sai dinh dang, JSON sai va du lieu khong hop le tra 400. Loi he thong tra 500.
Title bat buoc, trim va toi thieu 5 ky tu; text bat buoc dai hon 10 ky tu; tags co it nhat 1 phan tu; date mac dinh thoi diem tao. PUT chay lai validation.
Comment nam trong collection rieng; article tham chieu model Articles. Tao article truoc, sau do dung _id cua no de POST comment. GET /comments dung populate('article'); tham chieu den article da xoa tra null theo hanh vi Mongoose.

MVC: models/ dinh nghia schema; controllers/ xu ly request va truy van; routes/ anh xa endpoint; JSON response la phan bieu dien cho REST API. Tach deleteAll khoi delete theo ID de sua cho noi nham handler trong anh mau de bai.

## Kiem thu

~~~powershell
npm test
~~~

Test HTTP tich hop voi MongoDB tam thoi (mongodb-memory-server), khong dung database ca nhan. Lan dau can Internet de tai MongoDB binary. Bao phu CRUD, validation khi tao/cap nhat, loi ID/JSON, 403, 404, xoa tat ca, luu ObjectId va population.
