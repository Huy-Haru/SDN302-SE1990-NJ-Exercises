# SDN302 Practice - HE190724

REST API theo mô hình MVC với Express, Mongoose và JWT.

## Cấu trúc

```text
config/
  db.js                    Kết nối MongoDB
controllers/
  authController.js        Đăng nhập, cấp JWT
  productController.js     Xử lý sản phẩm
  orderController.js       Xử lý đơn hàng, kiểm tra tồn kho, tính tiền
data/
  customers.json
  products.json
  orders.json
  members.json
middleware/
  auth.js                  Xác thực Bearer token
  validation.js            Kiểm tra dữ liệu và xử lý hàm bất đồng bộ
models/
  Customer.js
  Product.js
  Order.js
routes/
  auth.js
  products.js
  orders.js
.env
app.js                     Cấu hình Express và gắn routes
server.js                  Kết nối database, chạy server
seed.js                    Nhập dữ liệu mẫu
package.json
```

Luồng xử lý: Request → Route → Middleware → Controller → Model → JSON response.
Vì đây là REST API, kết quả trả về là JSON; không cần thư mục views hay trang HTML.

## Chạy bài

Cài Node.js >= 20 và bật MongoDB, rồi mở terminal trong thư mục này:

```powershell
npm install
npm run seed
npm start
```

- API: http://localhost:9999
- MongoDB: mongodb://127.0.0.1:27017/sdn302-practice-HE190724-db
- .env chứa PORT, MONGO_URI và JWT_SECRET=HE190724.
- Seed giữ ObjectId và liên kết gốc; chạy lại chỉ thêm dữ liệu mẫu còn thiếu.
- Dùng `npm run dev` để tự chạy lại khi sửa mã.
- Không đưa .env và node_modules vào Git.

## Đăng nhập

POST /auth/tokens:

```json
{
  "name": "storeadmin",
  "pass": "Store@123"
}
```

Response trả JWT có hiệu lực 1 giờ. Các API bên dưới yêu cầu header:

```text
Authorization: Bearer <token>
```

## Các API

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| POST | /auth/tokens | Đăng nhập |
| GET | /api/products | Danh sách sản phẩm |
| GET | /api/products/:id | Chi tiết sản phẩm |
| POST | /api/products | Tạo sản phẩm |
| PUT | /api/products/:id | Cập nhật sản phẩm |
| DELETE | /api/products/:id | Xóa sản phẩm chưa được đơn hàng tham chiếu |
| GET | /api/orders | Danh sách đơn hàng kèm khách hàng, sản phẩm |
| GET | /api/orders/:id | Chi tiết đơn hàng |
| POST | /api/orders | Tạo đơn hàng |
| PUT | /api/orders/:id | Cập nhật đơn hàng |
| DELETE | /api/orders/:id | Xóa đơn hàng |

Tạo sản phẩm:

```json
{
  "name": "USB Keyboard",
  "price": 200000,
  "category": "Accessories",
  "stock": 10
}
```

Tạo đơn hàng:

```json
{
  "customer_id": "6936f4c6f2937fc51e5f7ca7",
  "items": [
    {
      "product_id": "6936f4c6f2937fc51e5f7cac",
      "quantity": 2
    }
  ],
  "payment_method": "COD",
  "status": "Pending"
}
```

Server kiểm tra khách hàng/sản phẩm tồn tại, số lượng nguyên >= 1 và không vượt tồn kho; tự lấy giá và tính tổng tiền. Nếu không gửi order_date, server dùng thời gian hiện tại.

PUT cập nhật các trường được gửi. Khi sửa items, giá được tính lại theo giá sản phẩm hiện tại; chỉ sửa trạng thái thì giữ giá đã chốt. Bài kiểm tra tồn kho, không tự trừ/hoàn stock khi thay đổi đơn.

Mã phản hồi chính: 200 thành công, 201 tạo mới, 400 dữ liệu sai, 401 lỗi xác thực, 404 không tìm thấy, 409 sản phẩm đang được đơn hàng sử dụng.
