# Test Case - Authentication

## 1. Đăng nhập

| TC ID | Mô tả | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| TC-AUTH-001 | Đăng nhập với thông tin hợp lệ | Email hợp lệ, mật khẩu đúng | Đăng nhập thành công và chuyển đến dashboard phù hợp với vai trò | Đã kiểm thử | PASS |
| TC-AUTH-002 | Đăng nhập sai mật khẩu | Email hợp lệ, mật khẩu sai | Không đăng nhập, hiển thị thông báo lỗi | Đã kiểm thử | PASS |
| TC-AUTH-003 | Đăng nhập bằng email không tồn tại | Email chưa có trong hệ thống | Không đăng nhập, hiển thị thông báo lỗi | Đã kiểm thử | PASS |
| TC-AUTH-004 | Bỏ trống email hoặc password | Email hoặc password rỗng | Hiển thị lỗi yêu cầu nhập email hoặc password| Đã kiểm thử | PASS |
| TC-AUTH-005 | Email sai định dạng | admin.crm.com | Hiển thị lỗi email không hợp lệ | Đã kiểm thử | PASS |
| TC-AUTH-006 | Đăng nhập bằng tài khoản bị khóa | Tài khoản có status = false | Hệ thống từ chối đăng nhập | Chưa kiểm thử | NOT RUN |

### Minh chứng TC-AUTH-001

![TC-AUTH-001 - Đăng nhập thành công](./assets/auth/TC-AUTH-001.png)

### Minh chứng TC-AUTH-002

![TC-AUTH-002 - Đúng Email, sai mật khẩu](./assets/auth/TC-AUTH-002.png)

### Minh chứng TC-AUTH-003

![TC-AUTH-003 - Email không tồn tại](./assets/auth/TC-AUTH-003.png)

### Minh chứng TC-AUTH-004

![TC-AUTH-004 - Chưa nhập email hoặc password](./assets/auth/TC-AUTH-004.png)

### Minh chứng TC-AUTH-005

![TC-AUTH-005 - Email không đúng định dạng](./assets/auth/TC-AUTH-005.png)

## 2. Ghi nhớ đăng nhập

| TC ID | Mô tả | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| TC-AUTH-007 | Chọn ghi nhớ đăng nhập | Checkbox được chọn | Phiên đăng nhập được lưu và email được ghi nhớ | Đã kiểm thử | PASS |
| TC-AUTH-008 | Không chọn ghi nhớ đăng nhập | Checkbox không được chọn | Phiên chỉ được lưu trong session hiện tại | Đã kiểm thử | PASS |

### Minh chứng TC-AUTH-007

![TC-AUTH-007 - Email không đúng định dạng](./assets/auth/TC-AUTH-007.png)

### Minh chứng TC-AUTH-008

![TC-AUTH-008 - Email không đúng định dạng](./assets/auth/TC-AUTH-008.png)

## 3. Quên mật khẩu

| TC ID | Mô tả | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| TC-AUTH-009 | Nhập email tồn tại | Email có trong hệ thống | Hệ thống cho phép chuyển sang bước đặt lại mật khẩu | Đã kiểm thử | PASS |
| TC-AUTH-010 | Nhập email không tồn tại | Email chưa đăng ký | Hệ thống từ chối yêu cầu | Đã kiểm thử | PASS |
| TC-AUTH-011 | Nhập email sai định dạng | admin.crm.com | Hiển thị lỗi validation | Đã kiểm thử | PASS |
| TC-AUTH-012 | Không nhập email | Email rỗng | Hiển thị lỗi yêu cầu nhập email | Đã kiểm thử | PASS |

### Minh chứng TC-AUTH-009
![TC-AUTH-009 - Xác thực email thành công](./assets/auth/TC-AUTH-009.png)

### Minh chứng TC-AUTH-010
![TC-AUTH-010 - Email không tồn tại](./assets/auth/TC-AUTH-010.png)

### Minh chứng TC-AUTH-011
![TC-AUTH-011 - Email sai định dạng](./assets/auth/TC-AUTH-011.png)

### Minh chứng TC-AUTH-012
![TC-AUTH-012 - Email rỗng](./assets/auth/TC-AUTH-012.png)

## 4. Đặt lại mật khẩu

| TC ID | Mô tả | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| TC-AUTH-013 | Đổi mật khẩu hợp lệ | Hai mật khẩu mới giống nhau và đủ độ dài: 123456789 | Đổi mật khẩu thành công và chuyển về trang đăng nhập | Đã kiểm thử | PASS |
| TC-AUTH-014 | Mật khẩu xác nhận không khớp | Hai mật khẩu khác nhau | Hiển thị lỗi mật khẩu không khớp | Đã kiểm thử | PASS |
| TC-AUTH-015 | Mật khẩu quá ngắn | Dưới 8 ký tự | Không cho phép đổi mật khẩu | Đã kiểm thử | PASS |
| TC-AUTH-016 | Đăng nhập bằng mật khẩu mới | Đã đổi mật khẩu thành công | Đăng nhập thành công | Đã kiểm thử | PASS |
| TC-AUTH-017 | Đăng nhập bằng mật khẩu cũ | Đã đổi mật khẩu thành công | Hệ thống từ chối đăng nhập | Đã kiểm thử | PASS |

### Minh chứng TC-AUTH-013
![TC-AUTH-013 - Mật khẩu mới và xác nhận mật khẩu giống nhau](./assets/auth/TC-AUTH-013.png)

### Minh chứng TC-AUTH-014
![TC-AUTH-014 - Mật khẩu mới và xác nhận mật khẩu khác nhau](./assets/auth/TC-AUTH-014.png)

### Minh chứng TC-AUTH-015
![TC-AUTH-015 - Mật khẩu dưới 8 ký tự](./assets/auth/TC-AUTH-015.png)

### Minh chứng TC-AUTH-016
![TC-AUTH-016 - Xác nhận đổi mật khẩu thành công](./assets/auth/TC-AUTH-016.png)

### Minh chứng TC-AUTH-017
![TC-AUTH-017 - Xác nhận không đăng nhập được bằng mật khẩu cũ](./assets/auth/TC-AUTH-017.png)

---

## Lịch sử cập nhật

| Ngày | Nội dung |
|---|---|
| 10/08/2026 | Tạo test case cho module Authentication |