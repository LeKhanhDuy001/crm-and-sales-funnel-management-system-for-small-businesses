# KIỂM THỬ HỆ THỐNG LẦN 2 - REGRESSION TEST

## 1. Thông tin kiểm thử

- Ngày kiểm thử: 15-26/09/2026
- Phiên bản: v1.0 RC
- Commit kiểm thử: `8aed613`
- Môi trường:
  - Backend: NestJS
  - Frontend: Next.js
  - Database: PostgreSQL

## 2. Mục tiêu

Lần kiểm thử thứ 2 được thực hiện sau khi hoàn thành các chỉnh sửa theo góp ý của giảng viên.

Mục tiêu:

- Xác nhận các lỗi và thiếu sót đã được khắc phục
- Kiểm tra lại các chức năng có mức rủi ro cao
- Xác nhận các chức năng mới không ảnh hưởng đến chức năng hiện có
- Xác nhận hệ thống ổn định trước khi bàn giao phiên bản v1.0

## 3. Kiểm thử tự động

| ID | Nội dung | Kết quả thực tế | Kết quả |
|---|---|---|---|
| RT-AUTO-001 | Chạy toàn bộ Backend Unit Test | Jest chạy 20/20 test suites PASS, 268/268 test PASS, 0 snapshot, thời gian 30.487 giây | PASS |
| RT-AUTO-002 | Build Backend | Chạy `npm run build`, NestJS build hoàn tất và không phát sinh lỗi biên dịch | PASS |
| RT-AUTO-003 | Build Frontend | Chạy `npm run build`, Next.js compile thành công, TypeScript không lỗi, tạo đủ 36/36 static pages và có route `/admin/pipeline-stages` | PASS |
## 4. Kiểm thử hồi quy chức năng

| ID | Chức năng | Nội dung kiểm thử | Kết quả mong đợi | Kết quả thực tế | Kết quả |
|---|---|---|---|---|---|
| RT-AUTH-001 | Login | Đăng nhập bằng tài khoản hợp lệ | Đăng nhập thành công và chuyển đúng dashboard | Đăng nhập thành công bằng `sales.demo@crm.local`, hệ thống chuyển đến `/sales/dashboard` và hiển thị Dashboard Sales | PASS |
| RT-AUTH-002 | Login | Đăng nhập bằng tài khoản bị khóa | Hệ thống từ chối đăng nhập | Đăng nhập bằng `sales.demo@crm.local` khi `status=false` bị từ chối, giao diện hiển thị `Tài khoản đã bị khóa` và không tạo phiên đăng nhập | PASS |
| RT-AUTH-003 | Forgot Password | Gửi yêu cầu bằng email tồn tại | Trả thông báo trung lập, không làm lộ email tồn tại | Nhập `sales.demo@crm.local`, hệ thống hiển thị `Nếu tài khoản tồn tại, yêu cầu đặt lại mật khẩu đã được tạo.` và không tiết lộ email có tồn tại hay không | PASS |
| RT-AUTH-004 | Forgot Password | Gửi yêu cầu bằng email không tồn tại | Trả cùng thông báo như email tồn tại | Nhập `notfound.demo@crm.local`, hệ thống vẫn hiển thị `Nếu tài khoản tồn tại, yêu cầu đặt lại mật khẩu đã được tạo.` giống trường hợp email tồn tại | PASS |
| RT-AUTH-005 | Forgot Password | Gửi quá số lần cho phép trong 60 giây | API trả HTTP 429 | Sau khi gửi liên tiếp quá số lần cho phép, giao diện hiển thị `Bạn đã gửi quá nhiều yêu cầu`; gọi trực tiếp API `POST /api/v1/auth/forgot-password` trả HTTP 429 | PASS |
| RT-AUTH-006 | Reset Password | Reset bằng token hợp lệ | Đổi mật khẩu thành công | Nhập reset token hợp lệ cùng mật khẩu mới và xác nhận mật khẩu, hệ thống xử lý thành công và hiển thị `Đổi mật khẩu thành công` | PASS |
| RT-AUTH-007 | Reset Password | Sử dụng lại token đã dùng | Hệ thống từ chối token | Sử dụng lại reset token đã đổi mật khẩu thành công trước đó, hệ thống từ chối và hiển thị `Reset token không hợp lệ hoặc đã hết hạn`; mật khẩu không được đổi lần nữa | PASS |
| RT-LEAD-001 | Lead Permission | Sales xem Lead được giao cho mình | Hiển thị Lead | Đăng nhập bằng tài khoản Sales và mở `/sales/leads`, hệ thống hiển thị danh sách Lead được giao cho Sales, gồm `Công ty Hoàng Gia Demo` và `Công ty Minh Anh Demo` | PASS |
| RT-LEAD-002 | Lead Permission | Sales truy cập Lead của Sales khác | Không trả dữ liệu Lead ngoài quyền | Dùng Swagger với token của Sales `userId=8` gọi `GET /api/v1/leads/1`, trong khi Lead ID 1 thuộc `assigneduserid=3`; API trả HTTP 404 với thông báo `Lead không tồn tại` và không trả dữ liệu Lead | PASS |
| RT-QUOTE-001 | Báo giá | Xác nhận báo giá đang ở trạng thái Draft | Báo giá chuyển sang Confirmed | Trên giao diện Sales, xác nhận báo giá `QT011` đang ở trạng thái `Bản nháp`; sau khi xác nhận, trạng thái chuyển thành `Đã xác nhận` | PASS |
| RT-QUOTE-002 | Báo giá | Chỉnh sửa báo giá đã Confirmed | Hệ thống từ chối chỉnh sửa | Dùng Swagger gọi `PATCH /api/v1/quotes/11` đối với `QT011` đang ở trạng thái `Confirmed`; API trả HTTP 422 với thông báo `Chỉ báo giá ở trạng thái Bản nháp mới được thực hiện thao tác này.` | PASS |
| RT-TASK-001 | Task Reminder | Task đến thời gian nhắc | Notification được tạo đúng Task và User | Tạo Task `TK031` gán cho Sales `userId=8`, `reminderTime=00:45 16/09/2026`; đến đúng 00:45 hệ thống tạo thông báo `Nhắc việc TK031` cho tài khoản Sales với nội dung Task sẽ đến hạn lúc 00:55 16/09/2026 | PASS |
| RT-PIPELINE-001 | Pipeline Configuration | Admin xem danh sách Pipeline Stage | Hiển thị đầy đủ Stage với tên, thứ tự và Probability | Đăng nhập Admin và mở `/admin/pipeline-stages`, hệ thống hiển thị 6 Stage: Lead 10%, Qualified 30%, Proposal 50%, Negotiation 70%, Won 100% và Lost 0% theo đúng thứ tự | PASS |
| RT-PIPELINE-002 | Pipeline Configuration | Tạo Pipeline Stage hợp lệ | Stage mới được tạo với đúng tên, thứ tự và Probability | Admin tạo Stage `Follow Up` với thứ tự `7` và Probability `20%`; hệ thống hiển thị `Tạo giai đoạn Pipeline thành công.` và Stage mới xuất hiện trong danh sách với đúng thông tin | PASS |
| RT-PIPELINE-003 | Pipeline Configuration | Tạo Stage có tên đã tồn tại | Hệ thống từ chối tạo Stage trùng tên | Admin nhập tên `Follow Up` đã tồn tại, thứ tự `8`, Probability `40%`; hệ thống không tạo Stage mới và hiển thị `Tên giai đoạn Pipeline đã tồn tại.` | PASS |
| RT-PIPELINE-004 | Pipeline Configuration | Tạo Stage có thứ tự đã tồn tại | Hệ thống từ chối tạo Stage trùng thứ tự | Admin nhập Stage `Demo Review`, thứ tự `7` đã được `Follow Up` sử dụng và Probability `40%`; hệ thống không tạo Stage mới và hiển thị `Thứ tự giai đoạn Pipeline đã tồn tại.` | PASS |
| RT-PIPELINE-005 | Pipeline Configuration | Xóa Stage chưa được sử dụng | Stage được xóa thành công | Admin xóa Stage `Follow Up` vừa tạo và chưa được Deal sử dụng, hệ thống hiển thị `Xóa giai đoạn Pipeline thành công.` và Stage không còn trong danh sách | PASS |
| RT-PIPELINE-006 | Pipeline Configuration | Xóa Stage đang được Deal sử dụng | Hệ thống từ chối xóa | Admin thử xóa Stage `Proposal` đang được Deal sử dụng, hệ thống không xóa Stage và hiển thị `Giai đoạn Pipeline đang được Deal sử dụng nên không thể xóa.` | PASS |
| RT-PIPELINE-007 | Pipeline Configuration | Sửa hoặc xóa Won/Lost | Hệ thống không cho phép | Trên giao diện cấu hình Pipeline, hai Stage hệ thống `Won` và `Lost` có nút `Sửa` và `Xóa` bị vô hiệu hóa, người dùng không thể thực hiện thao tác thay đổi hoặc xóa | PASS |
| RT-PIPELINE-008 | Pipeline Permission | Sales truy cập `/admin/pipeline-stages` | Chuyển đến trang Unauthorized hoặc API trả 403 | Đăng nhập bằng tài khoản Sales và truy cập trực tiếp `/admin/pipeline-stages`, hệ thống chuyển đến `/unauthorized` và hiển thị `403 - Không có quyền truy cập` | PASS |
| RT-DEAL-001 | Deal Allocation | Mở form phân công Deal | Hiển thị số Deal đang mở và Expected Revenue của từng Sales | Mở form phân công Deal `DL027`, hệ thống hiển thị từng Sales cùng số Deal đang mở và tổng Expected Revenue tương ứng, ví dụ `Lê Hoàng Nam - 4 Deal đang mở - 27.000.000 VNĐ`, `Lê Minh Kinh Doanh - 1 Deal đang mở - 2.400.000 VNĐ`, `Test - 0 Deal đang mở - 0 VNĐ` | PASS |
| RT-DEAL-002 | Deal Allocation | Có nhiều Sales với workload khác nhau | Hệ thống gợi ý Sales có workload thấp hơn | Trong form phân công Deal, các Sales có workload khác nhau; hệ thống đánh dấu `Gợi ý` cho Sales `Test` có `0 Deal đang mở - 0 VNĐ`, thấp hơn các Sales còn lại | PASS |
| RT-DEAL-003 | Deal Allocation | Hai Sales có cùng số Deal mở | Ưu tiên Sales có tổng Expected Revenue thấp hơn | Sau khi tạo tình huống `Lê Minh Kinh Doanh` và `Test` cùng có 1 Deal đang mở, hệ thống so sánh Expected Revenue và đánh dấu `Gợi ý` cho `Lê Minh Kinh Doanh` với 2.400.000 VNĐ, thấp hơn `Test` với 10.000.000 VNĐ | PASS |
| RT-CARE-001 | Care Priority | Deal quá hạn hoặc còn tối đa 3 ngày | Hiển thị ưu tiên cao | Trên Dashboard Sales Manager, các Deal đã quá hạn như `test` quá hạn 40 ngày, `CRM Enterprise cho Quốc Huy` quá hạn 32 ngày và `CRM Basic` quá hạn 19 ngày đều được gắn nhãn `Ưu tiên cao` | PASS |

### Minh chứng RT-AUTO-001
![RT-AUTO-001 - Chạy toàn bộ Backend Unit Test](./assets/kiem-thu-lan-2/RT-AUTO-001.png)

### Minh chứng RT-AUTO-002
![RT-AUTO-002 - Build Backend ](./assets/kiem-thu-lan-2/RT-AUTO-002.png)

### Minh chứng RT-AUTO-003
![RT-AUTO-003 - Build Frontend ](./assets/kiem-thu-lan-2/RT-AUTO-003.png)

### Minh chứng RT-AUTH-001
![RT-AUTH-001 - Đăng nhập bằng tài khoản hợp lệ ](./assets/kiem-thu-lan-2/RT-AUTH-001.png)

### Minh chứng RT-AUTH-002
![RT-AUTH-002 - Đăng nhập bằng tài khoản bị khóa ](./assets/kiem-thu-lan-2/RT-AUTH-002.png)

### Minh chứng RT-AUTH-003
![RT-AUTH-003 - Gửi yêu cầu bằng email tồn tại ](./assets/kiem-thu-lan-2/RT-AUTH-003.png)

### Minh chứng RT-AUTH-004
![RT-AUTH-004 - Gửi yêu cầu bằng email không tồn tại ](./assets/kiem-thu-lan-2/RT-AUTH-004.png)

### Minh chứng RT-AUTH-005
![RT-AUTH-005 - Gửi quá số lần cho phép trong 60 giây ](./assets/kiem-thu-lan-2/RT-AUTH-005.png)

### Minh chứng RT-AUTH-006
![RT-AUTH-006 - Reset bằng token hợp lệ ](./assets/kiem-thu-lan-2/RT-AUTH-006.png)

### Minh chứng RT-AUTH-007
![RT-AUTH-007 - Sử dụng lại token đã dùng ](./assets/kiem-thu-lan-2/RT-AUTH-007.png)

### Minh chứng RT-LEAD-001
![RT-LEAD-001 - Sales xem Lead được giao cho mình ](./assets/kiem-thu-lan-2/RT-LEAD-001.png)

### Minh chứng RT-LEAD-002
![RT-LEAD-002 - Sales truy cập Lead của Sales khác ](./assets/kiem-thu-lan-2/RT-LEAD-002.png)

### Minh chứng RT-QUOTE-001
![RT-QUOTE-001 - Xác nhận báo giá đang ở trạng thái Draft ](./assets/kiem-thu-lan-2/RT-QUOTE-001.png)

### Minh chứng RT-QUOTE-002
![RT-QUOTE-002 - Chỉnh sửa báo giá đã Confirmed ](./assets/kiem-thu-lan-2/RT-QUOTE-002.png)

### Minh chứng RT-TASK-001
![RT-TASK-001 - Task đến thời gian nhắc ](./assets/kiem-thu-lan-2/RT-TASK-001.png)

### Minh chứng RT-PIPELINE-001
![RT-PIPELINE-001 - Admin xem danh sách Pipeline Stage ](./assets/kiem-thu-lan-2/RT-PIPELINE-001.png)

### Minh chứng RT-PIPELINE-002
![RT-PIPELINE-002 - Tạo Pipeline Stage hợp lệ ](./assets/kiem-thu-lan-2/RT-PIPELINE-002.png)

### Minh chứng RT-PIPELINE-003
![RT-PIPELINE-003 - Tạo Stage có tên đã tồn tại ](./assets/kiem-thu-lan-2/RT-PIPELINE-003.png)

### Minh chứng RT-PIPELINE-004
![RT-PIPELINE-004 - Tạo Stage có thứ tự đã tồn tại ](./assets/kiem-thu-lan-2/RT-PIPELINE-004.png)

### Minh chứng RT-PIPELINE-005
![RT-PIPELINE-005 - Xóa Stage chưa được sử dụng ](./assets/kiem-thu-lan-2/RT-PIPELINE-005.png)

### Minh chứng RT-PIPELINE-006
![RT-PIPELINE-006 - Xóa Stage đang được Deal sử dụng ](./assets/kiem-thu-lan-2/RT-PIPELINE-006.png)

### Minh chứng RT-PIPELINE-007
![RT-PIPELINE-007 - Sửa hoặc xóa Won/Lost ](./assets/kiem-thu-lan-2/RT-PIPELINE-007.png)

### Minh chứng RT-PIPELINE-008
![RT-PIPELINE-008 - Sales truy cập `/admin/pipeline-stages` ](./assets/kiem-thu-lan-2/RT-PIPELINE-008.png)

### Minh chứng RT-DEAL-001
![RT-DEAL-001 - Mở form phân công Deal ](./assets/kiem-thu-lan-2/RT-DEAL-001.png)

### Minh chứng RT-DEAL-003
![RT-DEAL-003 - Hai Sales có cùng số Deal mở ](./assets/kiem-thu-lan-2/RT-DEAL-003.png)

### Minh chứng RT-CARE-001
![RT-CARE-001 - Deal quá hạn hoặc còn tối đa 3 ngày ](./assets/kiem-thu-lan-2/RT-CARE-001.png

## 5. Tổng kết

| Nội dung | Kết quả |
|---|---|
| Backend Unit Test | PASS - 20/20 test suites, 268/268 test PASS |
| Backend Build | PASS - NestJS build thành công, không phát sinh lỗi biên dịch |
| Frontend Build | PASS - Next.js build thành công, TypeScript không lỗi, tạo đủ 36/36 static pages |
| Regression Test | PASS - 26/26 test case hồi quy PASS |
| Lỗi còn lại | Không phát hiện lỗi trong phạm vi kiểm thử lần 2 |

**Kết luận:** Kiểm thử hệ thống lần 2 đã hoàn tất. Toàn bộ 268/268 Backend Unit Test, Backend Build, Frontend Build và 26/26 test case hồi quy đều PASS. Không phát hiện lỗi trong phạm vi kiểm thử lần 2. Hệ thống đáp ứng các nội dung cần kiểm tra lại sau khi chỉnh sửa theo góp ý của giảng viên và đủ điều kiện để chốt phiên bản v1.0.