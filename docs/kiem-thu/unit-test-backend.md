## 1. Thông tin chung

- Công cụ kiểm thử: Jest
- Lệnh chạy:

```bash
npm run test
```

---

## 2. Danh sách Unit Test

| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-AUTH-001 | `auth.service.spec.ts` | Đăng nhập với mật khẩu chính xác | Trả về access token và thông tin người dùng | PASS |
| UNIT-AUTH-002 | `auth.service.spec.ts` | Đăng nhập với mật khẩu sai | Ném `UnauthorizedException`, không tạo JWT | PASS |
| UNIT-USER-001 | `users.service.spec.ts` | Chuẩn hóa email trước khi tìm kiếm | Email được trim và chuyển thành chữ thường | PASS |
| UNIT-USER-002 | `users.service.spec.ts` | Tìm người dùng theo ID | Repository được gọi với đúng user ID | PASS |
| UNIT-USER-003 | `users.service.spec.ts` | Cập nhật mật khẩu | Repository nhận đúng user ID và password hash | PASS |
| UNIT-AUTH-CTRL-001 | `auth.controller.spec.ts` | Controller xử lý đăng nhập | Gọi đúng `AuthService.login()` | PASS |
| UNIT-AUTH-CTRL-002 | `auth.controller.spec.ts` | Controller xử lý quên mật khẩu | Gọi đúng `AuthService.forgotPassword()` | PASS |
| UNIT-AUTH-CTRL-003 | `auth.controller.spec.ts` | Controller xử lý đặt lại mật khẩu | Gọi đúng `AuthService.resetPassword()` | PASS |
| UNIT-PRISMA-001 | `prisma.service.spec.ts` | Khởi tạo khi thiếu `DATABASE_URL` | Ném lỗi cấu hình | PASS |
| UNIT-APP-001 | `app.controller.spec.ts` | Kiểm tra `getHello()` | Trả về `Hello World!` | PASS |

---

## 3. Kết quả tổng hợp

```text
Test Suites: 5 passed, 5 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        2.074 s
```

**Kết luận:** 10/10 unit test PASS.

---

## 4. Lịch sử cập nhật

| Ngày | Nội dung | Tổng số test | Kết quả |
|---|---|---:|---|
| 10/08/2026 | Khởi tạo và hoàn thiện unit test backend | 10 | PASS |