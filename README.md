package.json# Pet Shop Backend (Node.js + Express + Sequelize)

Backend Pet Shop mức độ **trung bình-khá** với nghiệp vụ thực tế hơn:

- Xác thực người dùng (register/login/profile)
- Phân quyền `customer` / `admin`
- Quản lý danh mục, thú cưng, sản phẩm
- Tạo đơn hàng nhiều dòng (`pet` + `product`) có transaction và trừ tồn kho
- Tra cứu đơn hàng của user + dashboard đơn hàng cho admin
- Hỗ trợ lọc, tìm kiếm, phân trang cho list API

---====
## 1) Cài đặt

```bash
npm install
```

## 2) Tạo file `.env`

```env
PORT=3000
DB_HOST=localhost
DB_NAME=pet_shop
DB_USER=root
DB_PASS=123456
JWT_SECRET=your_super_secret
```

## 3) Chạy dự án

```bash
npm run dev
```

Server: `http://localhost:3000`

---

## 4) Auth

### Register
`POST /api/auth/register`

```json
{
  "fullName": "Nguyen Van A",
  "email": "a@gmail.com",
  "password": "123456",
  "phone": "0909000000",
  "address": "HCM"
}
```

### Login
`POST /api/auth/login`

```json
{
  "email": "a@gmail.com",
  "password": "123456"
}
```

### Profile
`GET /api/auth/me` (Bearer token)

---

## 5) Categories

- `GET /api/categories?type=pet&page=1&limit=10&search=dog`
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

Payload create/update:

```json
{
  "name": "Dog Food",
  "type": "product"
}
```

---

## 6) Pets

- `GET /api/pets?page=1&limit=10&species=dog&vaccinated=true&minPrice=100&maxPrice=500&search=poodle`
- `GET /api/pets/:id`
- `POST /api/pets` (admin)
- `PUT /api/pets/:id` (admin)
- `DELETE /api/pets/:id` (admin)

Payload create/update mẫu:

```json
{
  "name": "Poodle Tiny",
  "species": "dog",
  "breed": "Poodle",
  "ageMonths": 3,
  "price": 350,
  "stock": 2,
  "vaccinated": true,
  "description": "Đã tiêm mũi cơ bản",
  "categoryId": 1
}
```

---

## 7) Products

- `GET /api/products?page=1&limit=10&categoryId=2&brand=Royal%20Canin&inStock=true&minPrice=10&maxPrice=100&search=kitten`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

Payload create/update mẫu:

```json
{
  "name": "Hạt cho mèo con",
  "description": "Dành cho mèo dưới 1 tuổi",
  "price": 15.5,
  "quantity": 100,
  "brand": "Royal Canin",
  "categoryId": 2
}
```

---

## 8) Orders

### User tạo đơn
`POST /api/orders`

```json
{
  "shippingAddress": "123 Nguyen Trai, HCM",
  "note": "Giao giờ hành chính",
  "items": [
    {
      "itemType": "pet",
      "itemId": 1,
      "quantity": 1
    },
    {
      "itemType": "product",
      "itemId": 2,
      "quantity": 3
    }
  ]
}
```

### User xem đơn của mình
- `GET /api/orders/my-orders?page=1&limit=10&status=pending`
- `GET /api/orders/:id` (chỉ owner hoặc admin)

### Admin quản lý đơn
- `GET /api/orders/admin/list?page=1&limit=20&status=shipping&dateFrom=2026-01-01&dateTo=2026-12-31`
- `GET /api/orders/admin/summary`
- `PATCH /api/orders/:id/status`

Payload update status:

```json
{
  "status": "shipping"
}
```

---

## 9) Ghi chú kỹ thuật

- Dự án dùng Sequelize `sync({ alter: true })` khi start server để tự đồng bộ bảng.
- Token + hash password đang dùng `crypto` built-in để phù hợp môi trường không cài thêm package.
- List API trả về dạng:

```json
{
  "message": "success",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 0,
      "totalPages": 1
    }
  }
}
```