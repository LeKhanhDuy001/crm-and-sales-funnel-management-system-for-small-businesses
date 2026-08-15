## 1. Thông tin chung

- Công cụ kiểm thử: Jest
- Lệnh chạy:

```bash
npm run test
npm test -- leads.service.spec.ts
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
| UNIT-LEAD-001 | `leads.service.spec.ts` | Chuyển Lead thành Customer khi Lead đủ điều kiện | Chuyển đổi thành công và gọi Repository với đúng Lead ID và User ID | PASS |
| UNIT-LEAD-002 | `leads.service.spec.ts` | Chuyển đổi Lead không tồn tại | Ném `NotFoundException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-003 | `leads.service.spec.ts` | Sales chuyển Lead được phân công cho Sales khác | Ném `ForbiddenException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-004 | `leads.service.spec.ts` | Chuyển Lead đã có trạng thái `Converted` | Ném `ConflictException`, không tạo Customer mới | PASS |
| UNIT-LEAD-005 | `leads.service.spec.ts` | Chuyển Lead đã có Customer | Ném `ConflictException`, không thực hiện chuyển đổi lại | PASS |
| UNIT-LEAD-006 | `leads.service.spec.ts` | Chuyển Lead có trạng thái `New` | Ném `UnprocessableEntityException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-007 | `leads.service.spec.ts` | Chuyển Lead có trạng thái `Contacted` | Ném `UnprocessableEntityException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-008 | `leads.service.spec.ts` | Chuyển Lead có họ tên không hợp lệ | Ném `UnprocessableEntityException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-009 | `leads.service.spec.ts` | Chuyển Lead thiếu cả số điện thoại và email | Ném `UnprocessableEntityException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-010 | `leads.service.spec.ts` | Chuyển Lead chỉ có số điện thoại, không có email | Cho phép chuyển đổi và gọi Repository | PASS |
| UNIT-LEAD-011 | `leads.service.spec.ts` | Chuyển Lead chỉ có email, không có số điện thoại | Cho phép chuyển đổi và gọi Repository | PASS |

---

## 3. Kết quả tổng hợp

```text
Test Suites: 5 passed, 5 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        2.074 s
```
```text
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        8.654 s
```

**Kết luận:** 21/21 unit test PASS.

---

## 4. Lịch sử cập nhật

| Ngày | Nội dung | Tổng số test | Kết quả |
|---|---|---:|---|
| 10/08/2026 | Khởi tạo và hoàn thiện unit test backend | 10 | PASS |
| 15/08/2026 | unit test backend cho chức năng convert Lead into Customer | 11 | PASS |