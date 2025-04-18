# 🛒 CongNghe-Shop

> Dự án mô phỏng hệ thống bán hàng cơ bản với chức năng quản lý người dùng, sản phẩm và đơn hàng – sử dụng Node.js, Express.js và MongoDB.

---

## 📌 Mục tiêu dự án

- Xây dựng một RESTful API phục vụ cho ứng dụng web bán hàng.
- Thực hành mô hình MVC trong Node.js.
- Kết nối và thao tác dữ liệu với MongoDB thông qua mongoose.
- Quản lý người dùng với phân quyền (admin / user).
- Xử lý xác thực và phân quyền bằng JWT.

---

## 🛠️ Công nghệ sử dụng

| Công nghệ     | Mô tả                                       |
|---------------|----------------------------------------------|
| Node.js       | Nền tảng JavaScript cho backend              |
| Express.js    | Framework xây dựng API nhanh chóng           |
| MongoDB       | Cơ sở dữ liệu NoSQL                          |
| Mongoose      | ORM để giao tiếp với MongoDB                 |
| JWT           | Xác thực và phân quyền người dùng            |
| dotenv        | Quản lý biến môi trường                      |

---

## ⚙️ Cấu trúc dự án

```bash
CongNghe-Shop/
│
├── config/             # Cấu hình cơ sở dữ liệu MongoDB
├── controllers/        # Xử lý logic nghiệp vụ
├── models/             # Định nghĩa schema MongoDB
├── routes/             # Tập hợp các endpoint của API
├── utils/              # Hàm tiện ích và xử lý lỗi
├── server.js           # Điểm khởi động ứng dụng
└── .env                # Biến môi trường (port, mongo URI)


🚀 Chức năng chính:
 Đăng ký / Đăng nhập người dùng
 Xác thực JWT & phân quyền admin
 CRUD sản phẩm (thêm / sửa / xóa / xem)
 Đặt hàng & quản lý đơn hàng
 Kết nối và lưu trữ dữ liệu với MongoDB


📚 API Endpoints (mẫu)
Phương thức | Endpoint | Mô tả
POST | /api/users/register | Đăng ký người dùng
POST | /api/users/login | Đăng nhập & nhận JWT
GET | /api/products/ | Lấy danh sách sản phẩm
POST | /api/products/ | (Admin) Thêm sản phẩm
POST | /api/orders/ | Tạo đơn hàng mới

