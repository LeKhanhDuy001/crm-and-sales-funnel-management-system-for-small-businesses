# CRM System - Hệ Thống Quản Lý Khách Hàng

Đề tài đồ án ngành là CRM System nhằm hỗ trợ các doanh nghiệp nhỏ quản lý khách hàng. Hệ thống hỗ trợ quản lý khách hàng, lead, deal, pipeline bán hàng, sản phẩm, báo giá, hoạt động chăm sóc khách hàng, phân quyền người dùng và báo cáo doanh thu.

## Thông tin đồ án

- Ngày bảo vệ dự kiến: 20/09/2026
- Phiên bản bàn giao: v1.0

---

## 1. Công nghệ sử dụng

### Frontend

- Next.js
- dnd-kit
- Recharts

### Backend

- NestJS
- Prisma ORM

### Database

- PostgreSQL

---

## 2. Cấu trúc project

```text
crm-project/
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── src/
│   ├── backend/
│   │   ├── prisma/
│   │   ├── src/
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── frontend/
│       ├── app/
│       ├── components/
│       ├── modules/
│       ├── services/
│       └── package.json
│── docs/
│   ├── assets/
│   ├── BaoCao/
│   ├── phan-tich/
│   ├── thiet-ke/
│   └── weekly/
│      
├── .gitignore
└── README.md
```

---

## 3. Yêu cầu môi trường

Cần cài đặt các phần mềm sau trước khi chạy project:

- Node.js
- npm
- PostgreSQL
- Git

Kiểm tra Node.js và npm:

```bash
node --version
npm --version
```

Kiểm tra PostgreSQL:

```bash
psql --version
```

---

## 4. Clone project

```bash
git clone https://github.com/LeKhanhDuy001/crm-and-sales-funnel-management-system-for-small-businesses.git
```

Di chuyển vào thư mục project:

```bash
cd crm-project
```

---

## 5. Cài đặt Backend

Di chuyển vào backend:

```bash
cd ./src/backend
```

Cài dependencies:

```bash
npm install
```

Tạo file môi trường từ file mẫu: .env

Sau đó mở:

```text
./src/backend/.env
```

và cấu hình kết nối PostgreSQL.

Ví dụ:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/crm_system"
JWT_SECRET="your_jwt_secret"
PORT=3001
```

## 6. Tạo Database

Đăng nhập PostgreSQL và tạo database:

```sql
CREATE DATABASE crm_system;
```

Tên database phải khớp với `DATABASE_URL` trong:

```text
./src/backend/.env
```

---

## 7. Chạy Prisma Migration

Tại thư mục:

```text
./src/backend
```

chạy:

```bash
npx prisma generate
```

Sau đó áp dụng migration:

```bash
npx prisma migrate deploy
```

Kiểm tra trạng thái migration:

```bash
npx prisma migrate status
```

---

## 8. Tạo dữ liệu mẫu

Tại thư mục backend:

```bash
npx prisma db seed
```

Seed có thể chạy lại nhiều lần mà không làm hỏng dữ liệu mẫu.

Ngoài Prisma seed, project còn cung cấp:

```text
database/schema.sql
database/seed.sql
```

để phục vụ kiểm tra cấu trúc và dữ liệu database.

---

## 9. Chạy Backend

Tại:

```text
./src/backend
```

chạy:

```bash
npm run start:dev
```

Backend mặc định chạy tại:

```text
http://localhost:3001
```

API sử dụng prefix:

```text
/api/v1
```

Ví dụ API đăng nhập:

```text
POST http://localhost:3001/api/v1/auth/login
```

---

## 10. Cài đặt Frontend

Mở terminal mới và di chuyển vào:

```bash
cd ./src/frontend
```

Cài dependencies:

```bash
npm install
```

Tạo file:

```text
src/frontend/.env.local
```

với nội dung:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## 11. Chạy Frontend

Tại:

```text
src/frontend
```

chạy:

```bash
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:3000
```

Trang đăng nhập:

```text
http://localhost:3000/login
```

---

## 12. Tài khoản demo

Sau khi chạy:

```bash
npx prisma db seed
```

có thể sử dụng các tài khoản demo sau:

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | `admin.demo@crm.local` | `Demo@12345` |
| Sales Manager | `sales.manager.demo@crm.local` | `Demo@12345` |
| Sales | `sales.demo@crm.local` | `Demo@12345` |
| Marketing | `marketing.demo@crm.local` | `Demo@12345` |
| Customer Care | `customer.care.demo@crm.local` | `Demo@12345` |

Mật khẩu trong database được lưu dưới dạng bcrypt hash, không lưu mật khẩu dạng plain text.

---

## 13. Chạy kiểm tra Backend

Di chuyển vào:

```text
./src/backend
```

Kiểm tra ESLint:

```bash
npm run lint
```

Kiểm tra build:

```bash
npm run build
```

Chạy test:

```bash
npm run test
```

---

## 14. Chạy kiểm tra Frontend

Di chuyển vào:

```text
./src/frontend
```

Kiểm tra ESLint:

```bash
npm run lint
```

Kiểm tra build:

```bash
npm run build
```

---

## 15. Quy trình chạy project từ đầu

Terminal 1:

```bash
cd src/backend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

Terminal 2:

```bash
cd src/frontend
npm install
npm run dev
```

Sau đó truy cập:

```text
http://localhost:3000/login
```

---

## 16. Các vai trò trong hệ thống

Hệ thống hỗ trợ các vai trò:

```text
Admin
Sales Manager
Sales
Marketing
Customer Care
```

Người dùng sau khi đăng nhập sẽ được điều hướng đến dashboard
phù hợp với vai trò của tài khoản.