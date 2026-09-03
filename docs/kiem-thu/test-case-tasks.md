# Test Case - Quản lý Task

## UC8 - Quản lý Task

### Kỹ thuật thiết kế test áp dụng

- **Phân hoạch tương đương (Equivalence Partitioning):** chia Title, Priority, Deal, người phụ trách, Deadline, Reminder và Status thành các nhóm hợp lệ/không hợp lệ.
- **Phân tích giá trị biên (Boundary Value Analysis):** kiểm tra độ dài tiêu đề tại biên 200 ký tự và ngay ngoài biên 201 ký tự; kiểm tra Deadline/Reminder ở hai phía của thời điểm hiện tại.
- **Bảng quyết định (Decision Table):** áp dụng cho tổ hợp Role × người phụ trách Task × quyền trên Task × thao tác tạo/cập nhật/phân công.
- **Chuyển trạng thái (State Transition):** kiểm tra các thay đổi trạng thái `Pending → InProgress → Completed` và chuyển Task sang `Cancelled`.

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| TC-TASK-001 | UC8 - Xem danh sách Task | Kiểm tra Sales Manager xem được danh sách Task | Sales Manager đã đăng nhập; hệ thống có Task | Không có | 1. Đăng nhập Sales Manager; 2. Mở Quản lý Task | Hiển thị danh sách Task theo phân trang; không phát sinh lỗi | Đã kiểm thử | PASS |
| TC-TASK-002 | UC8 / Record Permission | Kiểm tra Sales chỉ xem Task được giao cho mình | Sales A đã đăng nhập; có Task của Sales A và Sales B | Không có | 1. Đăng nhập Sales A; 2. Mở Quản lý Task; 3. Kiểm tra danh sách | Chỉ hiển thị Task có người phụ trách là Sales A; không hiển thị Task của Sales B | Đã kiểm thử | PASS |
| TC-TASK-003 | UC8 / Record Permission | Kiểm tra Customer Care chỉ xem Task của chính mình | Customer Care A đã đăng nhập; tồn tại Task của nhiều người | Không có | 1. Đăng nhập Customer Care A; 2. Mở Quản lý Task | Chỉ hiển thị Task được giao cho Customer Care A | Đã kiểm thử | PASS |
| TC-TASK-004 | UC8 - Xem chi tiết | Kiểm tra xem đầy đủ thông tin Task | Người dùng có quyền xem Task | Chọn một Task hợp lệ | 1. Mở Quản lý Task; 2. Nhấn xem chi tiết Task | Hiển thị mã Task, tiêu đề, mô tả, Deal, khách hàng, người phụ trách, mức độ ưu tiên, Deadline và thời gian nhắc | Đã kiểm thử | PASS |
| TC-TASK-005 | UC8 - Tìm kiếm | Kiểm tra tìm Task theo tiêu đề | Có Task với tiêu đề xác định | Từ khóa nằm trong tiêu đề | 1. Nhập từ khóa; 2. Nhấn tìm kiếm | Chỉ hiển thị Task khớp từ khóa theo quyền của người dùng | Đã kiểm thử | PASS |
| TC-TASK-006 | UC8 - Lọc Task | Kiểm tra lọc theo trạng thái | Có Task với nhiều trạng thái | Status = `InProgress` | 1. Chọn trạng thái Chờ xử lý; 2. Quan sát danh sách | Chỉ hiển thị Task có status = `InProgress` thuộc phạm vi quyền | Đã kiểm thử | PASS |
| TC-TASK-007 | UC8 - Lọc Task | Kiểm tra lọc theo mức độ ưu tiên | Có Task Low, Medium, High | Priority = `low` | 1. Chọn mức độ ưu tiên Cao; 2. Quan sát danh sách | Chỉ hiển thị Task có priority = `low` thuộc phạm vi quyền | Đã kiểm thử | PASS |
| TC-TASK-008 | UC8 - Danh sách rỗng | Kiểm tra giao diện khi không có Task phù hợp | Đã đăng nhập | Tìm kiếm từ khóa không tồn tại | 1. Nhập từ khóa không khớp Task nào; 2. Tìm kiếm | Hiển thị `Không tìm thấy Task.`; giao diện không lỗi | Đã kiểm thử | PASS |
| TC-TASK-009 | UC8 - Tạo Task | Kiểm tra Customer Care tự tạo Task thành công | Customer Care đã đăng nhập | Title hợp lệ; Deadline tương lai; Priority = Medium; Reminder hợp lệ hoặc bỏ trống | 1. Nhấn `+ Tạo Task`; 2. Nhập thông tin hợp lệ; 3. Nhấn `Tạo Task` | Hiển thị `Tạo Task thành công.`; Task được gán cho chính Customer Care; status = `Pending`; ghi Activity Log | Đã kiểm thử | PASS |
| TC-TASK-010 | UC8 - Tạo Task | Kiểm tra Sales Manager tạo Task và giao cho Sales thành công | Sales Manager đăng nhập; Sales được giao đang hoạt động | Sales hợp lệ; Title hợp lệ; Deadline tương lai; Priority hợp lệ | 1. Nhấn `+ Tạo Task`; 2. Chọn Sales; 3. Nhập dữ liệu hợp lệ; 4. Lưu | HTTP 201 hoặc UI báo `Tạo Task thành công.`; Task status = `Pending`; Sales nhận Notification; có Activity Log | Đã kiểm thử | PASS |
| TC-TASK-011 | UC8 - Validate form | Kiểm tra không cho tiêu đề rỗng | Customer Care hoặc Sales Manager đã đăng nhập | Title rỗng | 1. Mở form tạo Task; 2. Để trống tiêu đề; 3. Thử lưu | Không tạo Task; hiển thị `Tiêu đề Task không được để trống.` | Đã kiểm thử | PASS |
| TC-TASK-012 | UC8 - Giá trị biên | Kiểm tra tiêu đề đúng 200 ký tự | Có quyền tạo Task | Title dài đúng 200 ký tự; các trường khác hợp lệ | 1. Nhập tiêu đề 200 ký tự; 2. Nhập các trường hợp lệ; 3. Lưu | Task được tạo thành công; tiêu đề 200 ký tự được chấp nhận | Đã kiểm thử | PASS |
| TC-TASK-013 | UC8 - Giá trị biên | Kiểm tra tiêu đề vượt quá 200 ký tự | Có token của role được phép tạo Task | Title dài 201 ký tự | 1. Mở Swagger; 2. Authorize; 3. Chọn `POST /api/v1/tasks`; 4. Gửi title 201 ký tự cùng dữ liệu còn lại hợp lệ; 5. Execute | HTTP 400; hiển thị `Tiêu đề Task không được vượt quá 200 ký tự.`; không tạo Task | Đã kiểm thử | PASS |
| TC-TASK-014 | UC8 - Tạo Task | Kiểm tra Deadline không được ở quá khứ hoặc hiện tại | Có token role được phép tạo Task | `dueDate <= thời điểm hiện tại` | 1. Mở Swagger; 2. Gọi `POST /api/v1/tasks`; 3. Nhập Deadline trong quá khứ; 4. Execute | HTTP 422; hiển thị `Thời hạn hoàn thành phải lớn hơn thời điểm hiện tại.`; không tạo Task | Đã kiểm thử | PASS |
| TC-TASK-015 | UC8 - Tạo Task | Kiểm tra Reminder không được ở quá khứ hoặc hiện tại | Deadline hợp lệ trong tương lai | `reminderTime <= thời điểm hiện tại` | 1. Gọi `POST /api/v1/tasks`; 2. Nhập Deadline tương lai; 3. Nhập Reminder quá khứ; 4. Execute | HTTP 422; hiển thị `Thời gian nhắc việc phải lớn hơn thời điểm hiện tại.`; không tạo Task | Đã kiểm thử | PASS |
| TC-TASK-016 | UC8 - Tạo Task | Kiểm tra Reminder không được sau Deadline | Deadline và Reminder đều ở tương lai | Reminder > Deadline | 1. Gọi `POST /api/v1/tasks`; 2. Nhập Deadline; 3. Nhập Reminder sau Deadline; 4. Execute | HTTP 422; hiển thị `Thời gian nhắc việc không được sau thời hạn hoàn thành.`; không tạo Task | Đã kiểm thử | PASS |
| TC-TASK-017 | UC8 - Tạo Task | Kiểm tra Reminder được phép bỏ trống | Có quyền tạo Task | Reminder không truyền; các trường bắt buộc hợp lệ | 1. Tạo Task; 2. Không nhập Thời gian nhắc; 3. Lưu | Task được tạo thành công; `reminderTime = null` | Đã kiểm thử | PASS |
| TC-TASK-018 | UC8 - Validate form | Kiểm tra Priority không hợp lệ | Có token role được phép tạo | `priority = "Urgent"` | 1. Mở Swagger; 2. Gọi `POST /api/v1/tasks`; 3. Gửi priority = `Urgent`; 4. Execute | HTTP 400; hiển thị `Mức độ ưu tiên không hợp lệ.`; không tạo Task | Đã kiểm thử | PASS |
| TC-TASK-019 | UC8 - Validate form | Kiểm tra Deal ID không hợp lệ về định dạng/biên | Có token role được phép tạo | `dealId = 0` | 1. Mở Swagger; 2. Gọi `POST /api/v1/tasks`; 3. Gửi `dealId = 0`; 4. Execute | HTTP 400; hiển thị `Deal không hợp lệ.`; không tạo Task | Đã kiểm thử | PASS |
| TC-TASK-020 | UC8 - Tạo Task | Kiểm tra không gắn Task với Deal không tồn tại | Có token role được phép tạo | `dealId` > 0 nhưng không tồn tại | 1. Mở Swagger; 2. Gọi `POST /api/v1/tasks`; 3. Gửi ID Deal không tồn tại; 4. Execute | HTTP 404; hiển thị `Không tìm thấy Deal hoặc bạn không có quyền trên Deal này.`; không tạo Task | Đã kiểm thử | PASS |
| TC-TASK-021 | UC8 - Phân công | Kiểm tra Sales Manager bắt buộc chọn Sales thực hiện Task | Sales Manager đã đăng nhập | Không truyền `assignedUserId` | 1. Mở Swagger; 2. Authorize token Sales Manager; 3. Gọi `POST /api/v1/tasks`; 4. Không truyền assignedUserId; 5. Execute | HTTP 422; hiển thị `Vui lòng chọn nhân viên Sales thực hiện Task.` | Đã kiểm thử | PASS |
| TC-TASK-022 | UC8 - Phân công | Kiểm tra không giao Task cho tài khoản Sales bị khóa hoặc người không phải Sales | Sales Manager đã đăng nhập; có tài khoản bị khóa/role khác | `assignedUserId` không phải Sales active | 1. Mở Swagger; 2. Gọi `POST /api/v1/tasks`; 3. Truyền assignedUserId không hợp lệ; 4. Execute | HTTP 422; hiển thị `Nhân viên Sales không tồn tại hoặc đã bị khóa.`; không tạo Task | Đã kiểm thử | PASS |
| TC-TASK-023 | UC8 - Permission | Kiểm tra Customer Care không thể tạo Task cho người khác | Customer Care A đã đăng nhập | `assignedUserId` của người khác | 1. Mở Swagger; 2. Authorize token Customer Care A; 3. Gọi `POST /api/v1/tasks`; 4. Truyền assignedUserId của người khác; 5. Execute | HTTP 403; hiển thị `Customer Care chỉ được tạo Task cho chính mình.`; không tạo Task | Đã kiểm thử | PASS |
| TC-TASK-024 | UC8 - Cập nhật Task | Kiểm tra Customer Care cập nhật Task của chính mình thành công | Customer Care đăng nhập; Task thuộc Customer Care | Thay đổi tiêu đề, Priority hoặc Deadline bằng dữ liệu hợp lệ | 1. Chọn Task của mình; 2. Nhấn Sửa; 3. Thay đổi thông tin; 4. `Lưu thay đổi` | Hiển thị `Cập nhật Task thành công.`; dữ liệu được cập nhật; có Activity Log | Đã kiểm thử | PASS |
| TC-TASK-025 | UC8 / Record Permission | Kiểm tra Customer Care không sửa Task của người khác | Customer Care A đăng nhập; biết taskId thuộc người khác | PATCH `/tasks/{id}` | 1. Mở Swagger; 2. Authorize token Customer Care A; 3. Gửi PATCH tới Task người khác; 4. Execute | HTTP 404; hiển thị `Không tìm thấy Task.`; dữ liệu Task không thay đổi | Đã kiểm thử | PASS |
| TC-TASK-026 | UC8 - Trạng thái Task | Kiểm tra cập nhật trạng thái Task thành công | Role có quyền cập nhật; Task thuộc phạm vi quản lý | Status từ `Pending` sang `InProgress` | 1. Chọn Task Pending; 2. Chuyển trạng thái sang InProgress | Task chuyển thành `InProgress` | Đã kiểm thử | PASS |
| TC-TASK-027 | UC8 - Validate Status | Kiểm tra server chặn trạng thái không hợp lệ | Có Task hợp lệ và token role được phép cập nhật | `status = "Unknown"` | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/tasks/{id}/status`; 3. Gửi status = `Unknown`; 4. Execute | HTTP 400; hiển thị `Trạng thái Task không hợp lệ.`; trạng thái Task không thay đổi | Đã kiểm thử | PASS |
| TC-TASK-028 | UC8 - Xóa Task | Kiểm tra xóa Task thực tế là chuyển sang Cancelled | Role có quyền quản lý; Task chưa Cancelled | Task hợp lệ | 1. Chọn `Xóa`; 2. Xác nhận xóa | Hiển thị `Xóa Task thành công.`; Task chuyển sang `Cancelled` thay vì bị xóa vật lý | Đã kiểm thử | PASS |
| TC-TASK-029 | UC8 - Xóa Task | Kiểm tra không hủy lại Task đã Cancelled | Task đã có status = Cancelled | PATCH `/tasks/{id}/cancel` | 1. Mở Swagger; 2. Authorize; 3. Gọi endpoint cancel Task đã Cancelled; 4. Execute | HTTP 409; hiển thị `Task này đã được hủy.`; Task vẫn Cancelled | Đã kiểm thử | PASS |
| TC-TASK-030 | UC8 - Phân công | Kiểm tra Sales Manager phân công lại Task cho Sales khác thành công | Sales Manager đăng nhập; Task tồn tại; Sales B active | `assignedUserId` của Sales B | 1. Chọn Task; 2. Nhấn Phân công; 3. Chọn Sales B; 4. Lưu | Hiển thị `Phân công Task thành công.`; người phụ trách đổi sang Sales B; Sales B nhận Notification; ghi Activity Log | Đã kiểm thử | PASS |
| TC-TASK-031 | UC8 - Phân công | Kiểm tra không phân công lại cho đúng người đang phụ trách | Sales Manager đăng nhập; Task đã thuộc Sales A | assignedUserId = Sales A hiện tại | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/tasks/{id}/assignment`; 3. Truyền assignedUserId hiện tại; 4. Execute | HTTP 409; hiển thị `Task đã được phân công cho nhân viên này.`; dữ liệu không thay đổi | Đã kiểm thử | PASS |
| TC-TASK-032 | UC8 - Phân công | Kiểm tra không phân công Task cho Sales bị khóa | Sales Manager đăng nhập; tồn tại Sales bị khóa | assignedUserId của Sales bị khóa | 1. Gọi `PATCH /api/v1/tasks/{id}/assignment`; 2. Truyền ID Sales bị khóa; 3. Execute | HTTP 422; hiển thị `Nhân viên Sales không tồn tại hoặc đã bị khóa.`; người phụ trách không đổi | Đã kiểm thử | PASS |
| TC-TASK-033 | UC8 / Record Permission | Kiểm tra Sales không xem được Task của Sales khác qua API | Sales A đăng nhập; biết taskId thuộc Sales B | GET `/tasks/{id}` | 1. Mở Swagger; 2. Authorize token Sales A; 3. Gọi GET Task của Sales B | HTTP 404; hiển thị `Không tìm thấy Task.`; không lộ dữ liệu Task Sales B | Đã kiểm thử | PASS |
| TC-TASK-034 | Phân quyền Task | Kiểm tra Customer Care không được phân công Task cho Sales | Customer Care đăng nhập | PATCH `/tasks/{id}/assignment` | 1. Mở Swagger; 2. Authorize token Customer Care; 3. Gọi endpoint assignment | HTTP 403; hiển thị `Bạn không có quyền truy cập chức năng này` | Đã kiểm thử | PASS |
| TC-TASK-035 | Phân quyền Task | Kiểm tra Sales không được gọi endpoint phân công Task | Sales đăng nhập | PATCH `/tasks/{id}/assignment` | 1. Mở Swagger; 2. Authorize token Sales; 3. Gọi endpoint assignment | HTTP 403; hiển thị `Bạn không có quyền truy cập chức năng này` | Đã kiểm thử | PASS |
| TC-TASK-036 | Phân quyền Task | Kiểm tra Admin không được truy cập API Task | Admin đăng nhập | GET `/tasks` | 1. Mở Swagger; 2. Authorize token Admin; 3. Gọi `GET /api/v1/tasks` | HTTP 403; hiển thị `Bạn không có quyền truy cập chức năng này` | Đã kiểm thử | PASS |
| TC-TASK-037 | Phân quyền Task | Kiểm tra Marketing không được truy cập API Task | Marketing đăng nhập | GET `/tasks` | 1. Mở Swagger; 2. Authorize token Marketing; 3. Gọi `GET /api/v1/tasks` | HTTP 403; hiển thị `Bạn không có quyền truy cập chức năng này` | Đã kiểm thử | PASS |
| TC-TASK-038 | Xác thực Task | Kiểm tra truy cập Task khi không có access token | Chưa đăng nhập | GET `/tasks` không có Authorization | 1. Gọi `GET /api/v1/tasks` không gửi token | HTTP 401; hiển thị `Bạn chưa đăng nhập hoặc pheine đăng nhập đã hết hạn` | Đã kiểm thử | PASS |

### Minh chứng TC-TASK-001
![TC-TASK-001 - Sales Manager xem được danh sách Task](./assets/task/TC-TASK-001.png)

### Minh chứng TC-TASK-002
![TC-TASK-002 - Sales chỉ xem Task được giao cho mình](./assets/task/TC-TASK-002.png)

### Minh chứng TC-TASK-003
![TC-TASK-003 - Customer Care chỉ xem Task của chính mình](./assets/task/TC-TASK-003.png)

### Minh chứng TC-TASK-004
![TC-TASK-004 - Xem đầy đủ thông tin Task](./assets/task/TC-TASK-004.png)

### Minh chứng TC-TASK-005
![TC-TASK-005 - Tìm Task theo tiêu đề](./assets/task/TC-TASK-005.png)

### Minh chứng TC-TASK-006
![TC-TASK-006 - Lọc Task theo trạng thái](./assets/task/TC-TASK-006.png)

### Minh chứng TC-TASK-007
![TC-TASK-007 - Lọc Task theo mức độ ưu tiên](./assets/task/TC-TASK-007.png)

### Minh chứng TC-TASK-008
![TC-TASK-008 - Giao diện khi không có Task phù hợp](./assets/task/TC-TASK-008.png)

### Minh chứng TC-TASK-009
![TC-TASK-009 - Customer Care tự tạo Task thành công](./assets/task/TC-TASK-009.png)

### Minh chứng TC-TASK-010
![TC-TASK-010 - Sales Manager tạo Task và giao cho Sales thành công](./assets/task/TC-TASK-010.1.png)
![TC-TASK-010 - Sales Manager tạo Task và giao cho Sales thành công](./assets/task/TC-TASK-010.2.png)

### Minh chứng TC-TASK-011
![TC-TASK-011 - Không cho tiêu đề rỗng](./assets/task/TC-TASK-011.png)

### Minh chứng TC-TASK-012
![TC-TASK-012 - Tiêu đề đúng 200 ký tự](./assets/task/TC-TASK-012.png)

### Minh chứng TC-TASK-013
![TC-TASK-013 - Tiêu đề vượt quá 200 ký tự](./assets/task/TC-TASK-013.png)

### Minh chứng TC-TASK-014
![TC-TASK-014 - Deadline không được ở quá khứ hoặc hiện tại](./assets/task/TC-TASK-014.png)

### Minh chứng TC-TASK-015
![TC-TASK-015 - Reminder không được ở quá khứ hoặc hiện tại](./assets/task/TC-TASK-015.png)

### Minh chứng TC-TASK-016
![TC-TASK-016 - Reminder không được sau Deadline](./assets/task/TC-TASK-016.png)

### Minh chứng TC-TASK-017
![TC-TASK-017 - Reminder được phép bỏ trống](./assets/task/TC-TASK-017.png)

### Minh chứng TC-TASK-018
![TC-TASK-018 - Priority không hợp lệ](./assets/task/TC-TASK-018.png)

### Minh chứng TC-TASK-019
![TC-TASK-019 - Deal ID không hợp lệ về định dạng/biên](./assets/task/TC-TASK-019.png)

### Minh chứng TC-TASK-020
![TC-TASK-020 - Không gắn Task với Deal không tồn tại](./assets/task/TC-TASK-020.png)

### Minh chứng TC-TASK-021
![TC-TASK-021 - Sales Manager bắt buộc chọn Sales thực hiện Task](./assets/task/TC-TASK-021.png)

### Minh chứng TC-TASK-022
![TC-TASK-022 - không giao Task cho tài khoản Sales bị khóa hoặc người không phải Sales](./assets/task/TC-TASK-022.png)

### Minh chứng TC-TASK-023
![TC-TASK-023 - Customer Care không thể tạo Task cho người khác](./assets/task/TC-TASK-023.png)

### Minh chứng TC-TASK-024
![TC-TASK-024 - Customer Care cập nhật Task của chính mình thành công](./assets/task/TC-TASK-024.png)

### Minh chứng TC-TASK-025
![TC-TASK-025 - Customer Care không sửa Task của người khác](./assets/task/TC-TASK-025.png)

### Minh chứng TC-TASK-026
![TC-TASK-026 - cập nhật trạng thái Task thành công](./assets/task/TC-TASK-026.png)

### Minh chứng TC-TASK-027
![TC-TASK-027 - Server chặn trạng thái không hợp lệ](./assets/task/TC-TASK-027.png)

### Minh chứng TC-TASK-028
![TC-TASK-028 - Xóa Task thực tế là chuyển sang Cancelled](./assets/task/TC-TASK-028.1.png)
![TC-TASK-028 - Xóa Task thực tế là chuyển sang Cancelled](./assets/task/TC-TASK-028.2.png)

### Minh chứng TC-TASK-029
![TC-TASK-029 - không hủy lại Task đã Cancelled](./assets/task/TC-TASK-029.png)

### Minh chứng TC-TASK-030
![TC-TASK-030 - Sales Manager phân công lại Task cho Sales khác thành công](./assets/task/TC-TASK-030.png)

### Minh chứng TC-TASK-031
![TC-TASK-031 - Không phân công lại cho đúng người đang phụ trách](./assets/task/TC-TASK-031.png)

### Minh chứng TC-TASK-032
![TC-TASK-032 - Không phân công Task cho Sales bị khóa](./assets/task/TC-TASK-032.png)

### Minh chứng TC-TASK-033
![TC-TASK-033 - Sales không xem được Task của Sales khác qua API](./assets/task/TC-TASK-033.png)

### Minh chứng TC-TASK-034
![TC-TASK-034 - Customer Care không được phân công Task cho Sales](./assets/task/TC-TASK-034.png)

### Minh chứng TC-TASK-035
![TC-TASK-035 - Sales không được gọi endpoint phân công Task](./assets/task/TC-TASK-035.png)

### Minh chứng TC-TASK-036
![TC-TASK-036 - Admin không được truy cập API Task](./assets/task/TC-TASK-036.png)

### Minh chứng TC-TASK-037
![TC-TASK-037 - Marketing không được truy cập API Task](./assets/task/TC-TASK-037.png)

### Minh chứng TC-TASK-038
![TC-TASK-038 - Truy cập Task khi không có access token](./assets/task/TC-TASK-038.png)