# Test Case - Quản lý Activities

## UC12 - Quản lý chăm sóc khách hàng

### Kỹ thuật thiết kế test áp dụng

- **Phân hoạch tương đương (Equivalence Partitioning):** chia loại Activity, nội dung, mô tả, thời gian, kết quả, Deal và quyền truy cập thành các nhóm hợp lệ/không hợp lệ.
- **Phân tích giá trị biên (Boundary Value Analysis):** kiểm tra `subject` tại biên tối đa 200 ký tự và vượt biên 201 ký tự.
- **Bảng quyết định (Decision Table):** áp dụng cho tổ hợp Role × quyền trên Deal/Task × trạng thái Activity × thao tác tạo/cập nhật kết quả/hủy.
- **Chuyển trạng thái (State Transition):** kiểm tra `Pending → Completed` khi cập nhật kết quả và `Pending → Cancelled` khi hủy Activity.
- **Kiểm thử phân quyền bản ghi (Record-level Permission):** kiểm tra Sales và Customer Care chỉ được thao tác Activity thuộc phạm vi của mình.

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| TC-ACTIVITY-001 | UC12 - Xem danh sách Activity | Kiểm tra Sales xem được danh sách Activity của chính mình | Sales A đã đăng nhập; tồn tại Activity của Sales A và Sales B | Không có | 1. Đăng nhập Sales A; 2. Mở **Hoạt động chăm sóc** | Chỉ hiển thị Activity có người thực hiện là Sales A; không hiển thị Activity của Sales B | Danh sách chỉ hiển thị Activity do Sales A thực hiện, không xuất hiện Activity của Sales B | PASS |
| TC-ACTIVITY-002 | UC12 - Xem danh sách Activity | Kiểm tra Customer Care chỉ xem Activity của chính mình | Customer Care A đã đăng nhập; tồn tại Activity của nhiều người | Không có | 1. Đăng nhập Customer Care A; 2. Mở **Hoạt động chăm sóc** | Chỉ hiển thị Activity do Customer Care A thực hiện | Customer Care A chỉ xem được các Activity do chính tài khoản này thực hiện | PASS |
| TC-ACTIVITY-003 | UC12 - Danh sách rỗng | Kiểm tra giao diện khi người dùng chưa có Activity | Sales hoặc Customer Care đã đăng nhập; không có Activity thuộc user | Không có | 1. Mở **Hoạt động chăm sóc** | Hiển thị trạng thái danh sách rỗng; giao diện không phát sinh lỗi | Khi user chưa có Activity, giao diện hiển thị trạng thái danh sách rỗng và không phát sinh lỗi | PASS |
| TC-ACTIVITY-004 | UC12 - Xem chi tiết | Kiểm tra xem chi tiết Activity thuộc quyền | Người dùng đã đăng nhập; Activity thuộc chính user | Chọn một Activity | 1. Mở danh sách Activity; 2. Nhấn **Chi tiết** | Hiển thị Mã, Loại, Nội dung, Mô tả, Customer, Công ty, Deal, Người thực hiện, Thời gian, Kết quả và Trạng thái | Modal chi tiết hiển thị đầy đủ Mã, Loại, Nội dung, Mô tả, Customer, Công ty, Deal, Người thực hiện, Thời gian, Kết quả và Trạng thái | PASS |
| TC-ACTIVITY-005 | UC12 / Record Permission | Kiểm tra không xem được Activity của người khác qua API | Sales A đăng nhập; biết `activityId` của Sales B | GET `/api/v1/activities/{id}` | 1. Mở Swagger; 2. Authorize token Sales A; 3. Gọi GET Activity của Sales B | HTTP 404; hiển thị `Không tìm thấy Activities hoặc bạn không có quyền truy cập Activities này.` | API trả HTTP 404 khi Sales A truy cập Activity của Sales B và không trả dữ liệu Activity ngoài quyền | PASS |
| TC-ACTIVITY-006 | UC12 - Metadata | Kiểm tra Sales chỉ thấy Deal mình phụ trách khi tạo Activity | Sales A đăng nhập; có Deal của Sales A và Sales B | Không có | 1. Nhấn **Thêm hoạt động**; 2. Kiểm tra danh sách Deal | Chỉ hiển thị Deal đang được phân công cho Sales A | Danh sách Deal trên form tạo Activity chỉ chứa các Deal được phân công cho Sales A | PASS |
| TC-ACTIVITY-007 | UC12 - Metadata | Kiểm tra Customer Care chỉ thấy Deal có Task hợp lệ được giao | Customer Care A đăng nhập; có Task Pending gắn với Deal và giao cho A | Không có | 1. Nhấn **Thêm hoạt động**; 2. Kiểm tra danh sách Deal | Hiển thị Deal có Task đang hoạt động được phân công cho Customer Care A | Customer Care A chỉ thấy các Deal có Task đang hoạt động được giao cho mình | PASS |
| TC-ACTIVITY-008 | UC12 - Tạo Activity | Kiểm tra Sales tạo Activity hợp lệ cho Deal mình phụ trách | Sales đăng nhập; Deal thuộc Sales | Deal hợp lệ; Loại = `Call`; Subject = `Gọi xác nhận nhu cầu`; Description hợp lệ; thời gian hợp lệ | 1. Nhấn **Thêm hoạt động**; 2. Chọn Deal; 3. Chọn Call; 4. Nhập nội dung, mô tả, thời gian; 5. Nhấn **Lưu** | Tạo Activity thành công; Activity gắn đúng Deal, Customer và Sales; `status = Pending`; `result = null`; ghi Activity Log | Activity được tạo thành công, gắn đúng Deal, Customer và Sales; trạng thái ban đầu là `Pending`, `result = null` và có Activity Log | PASS |
| TC-ACTIVITY-009 | UC12 - Tạo Activity | Kiểm tra Customer Care tạo Activity khi có Task Pending được giao | Customer Care A đăng nhập; có Task Pending của Deal giao cho A | Dữ liệu Activity hợp lệ | 1. Mở **Thêm hoạt động**; 2. Chọn Deal; 3. Nhập dữ liệu; 4. Lưu | Tạo Activity thành công; người thực hiện là Customer Care A; trạng thái `Pending`; ghi Activity Log | Customer Care A tạo Activity thành công cho Deal được phân công; Activity có trạng thái `Pending` và phát sinh Activity Log | PASS |
| TC-ACTIVITY-010 | UC12 / Record Permission | Kiểm tra Sales không tạo Activity cho Deal của Sales khác | Sales A đăng nhập; biết `dealId` thuộc Sales B | POST `/api/v1/activities` với `dealId` của Sales B | 1. Mở Swagger; 2. Authorize Sales A; 3. Gửi dữ liệu tạo Activity với Deal của Sales B | HTTP 404; hiển thị `không tìm thấy Deal hoặc không có quyền chăm sóc`; không tạo Activity | API trả HTTP 404 khi Sales A dùng Deal của Sales B và không tạo bản ghi Activity mới | PASS |
| TC-ACTIVITY-011 | UC12 / Customer Care Permission | Kiểm tra Customer Care không tạo Activity khi không có Task được giao | Customer Care A đăng nhập; Deal tồn tại nhưng không có Task giao cho A | Dữ liệu Activity hợp lệ | 1. Gọi POST `/api/v1/activities`; 2. Truyền `dealId` không có Task của A | HTTP 404; không tạo Activity | Request bị từ chối HTTP 404 do Customer Care không được phân công Task của Deal và không phát sinh Activity | PASS |
| TC-ACTIVITY-012 | UC12 / Customer Care Permission | Kiểm tra Customer Care không tạo Activity khi Task đã Completed | Customer Care A đăng nhập; Task của Deal đã `Completed` | Dữ liệu Activity hợp lệ | 1. Gọi API tạo Activity với Deal có Task Completed | HTTP 404; hiển thị `Không tìm thấy Deal hoặc bạn không được phân công chăm sóc Deal này.` | API trả HTTP 404 khi Task của Deal đã `Completed` và không tạo Activity mới | PASS |
| TC-ACTIVITY-013 | UC12 / Customer Care Permission | Kiểm tra Customer Care không tạo Activity khi Task đã Cancelled | Customer Care A đăng nhập; Task của Deal đã `Cancelled` | Dữ liệu Activity hợp lệ | 1. Gọi API tạo Activity với Deal có Task Cancelled | HTTP 404; không cho tạo Activity | API từ chối tạo Activity với HTTP 404 khi Task đã `Cancelled`, không phát sinh bản ghi mới | PASS |
| TC-ACTIVITY-014 | UC12 - Validate loại Activity | Kiểm tra loại Activity không hợp lệ | Role hợp lệ; Deal hợp lệ | `activityType = "SMS"` | 1. Gọi POST `/api/v1/activities`; 2. Truyền loại `SMS` | HTTP 400; hiển thị `Loại hoạt động không hợp lệ.`; không tạo Activity | API trả HTTP 400 với `activityType = "SMS"`, hiển thị lỗi loại hoạt động không hợp lệ và không tạo Activity | PASS |
| TC-ACTIVITY-015 | UC12 - Validate nội dung | Kiểm tra không cho tạo Activity thiếu subject | Role và Deal hợp lệ | `subject = ""` | 1. Mở form thêm Activity; 2. Để trống nội dung; 3. Nhấn Lưu | Không tạo Activity; hiển thị lỗi nội dung hoạt động không được để trống | Form không cho lưu khi subject rỗng và hiển thị lỗi yêu cầu nhập nội dung hoạt động | PASS |
| TC-ACTIVITY-016 | UC12 - Validate nội dung | Kiểm tra subject chỉ chứa khoảng trắng | Role và Deal hợp lệ | `subject = "   "` | 1. Gọi API tạo Activity; 2. Truyền subject chỉ có khoảng trắng | HTTP 422; hiển thị `Nội dung hoạt động không được để trống.`; không tạo Activity | API trả HTTP 422 khi subject chỉ chứa khoảng trắng, hiển thị `Nội dung hoạt động không được để trống.` và không tạo Activity | PASS |
| TC-ACTIVITY-017 | UC12 / Boundary Value | Kiểm tra subject đúng 200 ký tự | Role và Deal hợp lệ | `subject` dài đúng 200 ký tự | 1. Nhập subject 200 ký tự; 2. Nhập các trường hợp lệ; 3. Lưu | Dữ liệu được chấp nhận; Activity được tạo | Subject đúng 200 ký tự được hệ thống chấp nhận và Activity được tạo thành công | PASS |
| TC-ACTIVITY-018 | UC12 / Boundary Value | Kiểm tra subject dài 201 ký tự | Role và Deal hợp lệ | `subject` dài 201 ký tự | 1. Gọi POST tạo Activity với subject 201 ký tự | HTTP 400; dữ liệu bị từ chối; không tạo Activity | Subject 201 ký tự bị validation từ chối với HTTP 400 và không tạo Activity | PASS |
| TC-ACTIVITY-019 | UC12 - Validate mô tả | Kiểm tra mô tả chỉ chứa khoảng trắng | Role và Deal hợp lệ | `description = "   "` | 1. Gọi POST tạo Activity với description chỉ có khoảng trắng | HTTP 422; hiển thị `Mô tả hoạt động không được để trống.`; không tạo Activity | API trả HTTP 422 với description chỉ chứa khoảng trắng và không tạo Activity | PASS |
| TC-ACTIVITY-020 | UC12 - Validate thời gian | Kiểm tra định dạng thời gian Activity không hợp lệ | Role và Deal hợp lệ | `activityTime = "abc"` | 1. Gọi POST `/api/v1/activities`; 2. Truyền thời gian sai định dạng | HTTP 400; hiển thị `Thời gian hoạt động không hợp lệ.`; không tạo Activity | API trả HTTP 400 với `activityTime = "abc"`, hiển thị lỗi thời gian không hợp lệ và không tạo Activity | PASS |
| TC-ACTIVITY-021 | UC12 - Trạng thái ban đầu | Kiểm tra Activity mới có trạng thái Pending | Tạo Activity thành công | Activity vừa tạo | 1. Tạo Activity; 2. Kiểm tra danh sách hoặc database | `status = Pending`; UI hiển thị **Chờ thực hiện**; `result = null` | Activity mới có `status = Pending`, `result = null` và giao diện hiển thị **Chờ thực hiện** | PASS |
| TC-ACTIVITY-022 | UC12 - Cập nhật kết quả | Kiểm tra cập nhật kết quả Activity Pending thành công | Activity thuộc user; `status = Pending` | Result = `Khách hàng đồng ý nhận báo giá.` | 1. Nhấn **Cập nhật kết quả**; 2. Nhập result; 3. Nhấn Lưu | Result được lưu; trạng thái chuyển `Pending → Completed`; UI hiển thị **Hoàn thành**; ghi Activity Log | Result được lưu thành công, Activity chuyển từ `Pending` sang `Completed`, giao diện hiển thị **Hoàn thành** và có Activity Log | PASS |
| TC-ACTIVITY-023 | UC12 - Cập nhật kết quả | Kiểm tra hệ thống trim kết quả trước khi lưu | Activity Pending thuộc user | `result = "  TC-ACTIVITY-023  "` | 1. Cập nhật kết quả; 2. Nhập dữ liệu có khoảng trắng đầu/cuối; 3. Lưu | Lưu `Khách hàng đồng ý.`; không lưu khoảng trắng thừa | Dữ liệu result được trim trước khi lưu, không còn khoảng trắng dư ở đầu và cuối | PASS |
| TC-ACTIVITY-024 | UC12 - Validate kết quả | Kiểm tra không cho cập nhật result chỉ chứa khoảng trắng | Activity Pending thuộc user | `result = "   "` | 1. Mở cập nhật kết quả; 2. Nhập khoảng trắng; 3. Lưu | Không cập nhật; hiển thị `Kết quả chăm sóc không được để trống.` | Result chỉ chứa khoảng trắng bị từ chối, dữ liệu Activity không thay đổi và hiển thị lỗi kết quả không được để trống | PASS |
| TC-ACTIVITY-025 | UC12 / Record Permission | Kiểm tra không cập nhật kết quả Activity của người khác | Sales A đăng nhập; Activity thuộc Sales B | PATCH `/api/v1/activities/{id}/result` | 1. Authorize Sales A; 2. Gọi PATCH result Activity Sales B | HTTP 404; hiển thị `Không tìm thấy Activities hoặc bạn không có quyền cập nhật Activities này.` và status không thay đổi | API trả HTTP 404 khi Sales A cập nhật Activity của Sales B; result và status của Activity không thay đổi | PASS |
| TC-ACTIVITY-026 | UC12 - Cập nhật kết quả | Kiểm tra không cập nhật kết quả Activity đã Cancelled | Activity thuộc user; `status = Cancelled` | Result hợp lệ | 1. Gọi PATCH `/api/v1/activities/{id}/result` | HTTP 422; hiển thị `Activity đã bị hủy nên không thể cập nhật kết quả.`; dữ liệu không thay đổi | API trả HTTP 422 đối với Activity `Cancelled`, result không được cập nhật và trạng thái giữ nguyên | PASS |
| TC-ACTIVITY-027 | UC12 - Cập nhật kết quả | Kiểm tra cho phép bổ sung/chỉnh lại result của Activity Completed | Activity thuộc user; `status = Completed` | Result mới hợp lệ | 1. Nhấn **Cập nhật kết quả**; 2. Sửa result; 3. Lưu | Result được cập nhật; status vẫn là `Completed`; ghi Activity Log | Result của Activity `Completed` được cập nhật thành công, trạng thái vẫn là `Completed` và hệ thống ghi Activity Log | PASS |
| TC-ACTIVITY-028 | UC12 - Hủy Activity | Kiểm tra hủy Activity Pending thành công | Activity thuộc user; `status = Pending` | Activity hợp lệ | 1. Chọn **Hủy**; 2. Xác nhận thao tác | Hiển thị `Hủy Activity thành công.`; trạng thái chuyển `Pending → Cancelled`; record vẫn còn trong database; ghi Activity Log | Hủy Activity thành công, trạng thái chuyển từ `Pending` sang `Cancelled`, record vẫn tồn tại và hệ thống tạo Activity Log | PASS |
| TC-ACTIVITY-029 | UC12 - Hủy Activity | Kiểm tra hủy không phải xóa vật lý | Activity Pending tồn tại | Activity cần hủy | 1. Ghi nhận ID Activity; 2. Hủy Activity; 3. Kiểm tra database | Record Activity vẫn tồn tại; `status = Cancelled`; không thực hiện DELETE vật lý | Sau khi hủy, record Activity vẫn còn trong database với `status = Cancelled`, không bị xóa vật lý | PASS |
| TC-ACTIVITY-030 | UC12 - Hủy Activity | Kiểm tra không hủy Activity đã Completed | Activity thuộc user; `status = Completed` | Activity Completed | 1. Gọi PATCH `/api/v1/activities/{id}/cancel` | HTTP 422; hiển thị `Activity đã hoàn thành nên không thể hủy.`; Activity vẫn Completed | API trả HTTP 422 khi hủy Activity `Completed` và trạng thái Activity vẫn giữ nguyên `Completed` | PASS |
| TC-ACTIVITY-031 | UC12 - Hủy Activity | Kiểm tra không hủy lại Activity đã Cancelled | Activity thuộc user; `status = Cancelled` | Activity Cancelled | 1. Gọi PATCH `/api/v1/activities/{id}/cancel` | HTTP 422; hiển thị `Activity này đã được hủy.`; trạng thái vẫn Cancelled | API trả HTTP 422 khi hủy lại Activity `Cancelled`, trạng thái tiếp tục giữ nguyên `Cancelled` | PASS |
| TC-ACTIVITY-032 | UC12 / Record Permission | Kiểm tra không hủy Activity của người khác | Sales A đăng nhập; Activity thuộc Sales B | PATCH `/api/v1/activities/{id}/cancel` | 1. Authorize Sales A; 2. Gọi API cancel Activity Sales B | HTTP 404; Activity không thay đổi | API trả HTTP 404 khi Sales A cố hủy Activity của Sales B và dữ liệu Activity không thay đổi | PASS |
| TC-ACTIVITY-033 | UC12 - UI theo trạng thái | Kiểm tra thao tác của Activity Pending | Activity có `status = Pending` | Không có | 1. Mở danh sách Activity; 2. Quan sát dòng Pending | Hiển thị **Chi tiết**, **Cập nhật kết quả**, **Hủy** | Dòng Activity `Pending` hiển thị đủ ba thao tác **Chi tiết**, **Cập nhật kết quả** và **Hủy** | PASS |
| TC-ACTIVITY-034 | UC12 - UI theo trạng thái | Kiểm tra thao tác của Activity Completed | Activity có `status = Completed` | Không có | 1. Mở danh sách Activity; 2. Quan sát dòng Completed | Hiển thị **Chi tiết**, **Cập nhật kết quả**; không hiển thị **Hủy** | Activity `Completed` hiển thị **Chi tiết** và **Cập nhật kết quả**, không còn thao tác **Hủy** | PASS |
| TC-ACTIVITY-035 | UC12 - UI theo trạng thái | Kiểm tra thao tác của Activity Cancelled | Activity có `status = Cancelled` | Không có | 1. Mở danh sách Activity; 2. Quan sát dòng Cancelled | Chỉ hiển thị **Chi tiết**; không hiển thị **Cập nhật kết quả** và **Hủy** | Activity `Cancelled` chỉ hiển thị **Chi tiết**, không có **Cập nhật kết quả** hoặc **Hủy** | PASS |
| TC-ACTIVITY-036 | UC12 / RBAC | Kiểm tra Admin không được truy cập API Activities | Admin đã đăng nhập | GET `/api/v1/activities` | 1. Mở Swagger; 2. Authorize token Admin; 3. Gọi GET Activities | HTTP 403; Admin không được sử dụng chức năng Activity | API trả HTTP 403 khi Admin gọi chức năng Activities và không trả dữ liệu Activity | PASS |
| TC-ACTIVITY-037 | UC12 / RBAC | Kiểm tra Marketing không được truy cập API Activities | Marketing đã đăng nhập | GET `/api/v1/activities` | 1. Authorize token Marketing; 2. Gọi GET Activities | HTTP 403; không trả dữ liệu Activity | API trả HTTP 403 với tài khoản Marketing và không trả danh sách Activity | PASS |
| TC-ACTIVITY-038 | UC12 / Authentication | Kiểm tra người chưa đăng nhập không truy cập Activities | Không có access token | GET `/api/v1/activities` | 1. Không Authorize; 2. Gọi GET Activities | HTTP 401; yêu cầu xác thực | Khi không có access token, API trả HTTP 401 và không trả dữ liệu Activity | PASS |
| TC-ACTIVITY-039 | UC12 / BR18 | Kiểm tra tạo Activity có ghi Activity Log | User tạo Activity hợp lệ | Activity hợp lệ | 1. Tạo Activity; 2. Kiểm tra Activity Logs | Có log `Create`; `tableName = activities`; `recordId` đúng Activity vừa tạo; lưu User thực hiện | Sau khi tạo Activity, hệ thống phát sinh log `Create` với `tableName = activities`, đúng `recordId` và đúng User thực hiện | PASS |
| TC-ACTIVITY-040 | UC12 / BR18 | Kiểm tra cập nhật result có ghi Activity Log | Activity Pending tồn tại | Result hợp lệ | 1. Cập nhật kết quả; 2. Kiểm tra Activity Logs | Có log `Update`; oldValue chứa result/status cũ; newValue chứa result mới và `Completed` | Cập nhật result tạo log `Update`; oldValue ghi nhận dữ liệu trước cập nhật và newValue chứa result mới cùng trạng thái `Completed` | PASS |
| TC-ACTIVITY-041 | UC12 / BR18 | Kiểm tra hủy Activity có ghi Activity Log | Activity thuộc người dùng hiện tại và đang Pending | PATCH `/api/v1/activities/{id}/cancel` | 1. Hủy Activity; 2. Mở bảng `activitylogs`; 3. Tìm log theo `table_name = activities` và `record_id` | Activity chuyển sang `Cancelled`; tạo Activity Log với `action = Update`; `oldValue.status = Pending`; `newValue.status = Cancelled` | Sau khi hủy Activity, trạng thái chuyển thành `Cancelled` và Activity Log `Update` ghi `oldValue.status = Pending`, `newValue.status = Cancelled` | PASS |

### Minh chứng TC-ACTIVITY-001
![TC-ACTIVITY-001 - Sales xem được danh sách Activity của chính mình](./assets/activities/TC-ACTIVITY-001.png)

### Minh chứng TC-ACTIVITY-002
![TC-ACTIVITY-002 - Customer Care chỉ xem Activity của chính mình](./assets/activities/TC-ACTIVITY-002.png)

### Minh chứng TC-ACTIVITY-003
![TC-ACTIVITY-003 - Giao diện khi người dùng chưa có Activity](./assets/activities/TC-ACTIVITY-003.png)

### Minh chứng TC-ACTIVITY-004
![TC-ACTIVITY-004 - Xem chi tiết Activity thuộc quyền](./assets/activities/TC-ACTIVITY-004.png)

### Minh chứng TC-ACTIVITY-005
![TC-ACTIVITY-005 - Không xem được Activity của người khác qua API](./assets/activities/TC-ACTIVITY-005.png)

### Minh chứng TC-ACTIVITY-006
![TC-ACTIVITY-006 - Sales chỉ thấy Deal mình phụ trách khi tạo Activity](./assets/activities/TC-ACTIVITY-006.png)

### Minh chứng TC-ACTIVITY-007
![TC-ACTIVITY-007 - Customer Care chỉ thấy Deal có Task hợp lệ được giao](./assets/activities/TC-ACTIVITY-007.png)

### Minh chứng TC-ACTIVITY-008
![TC-ACTIVITY-008 - Sales tạo Activity hợp lệ cho Deal mình phụ trách](./assets/activities/TC-ACTIVITY-008.png)

### Minh chứng TC-ACTIVITY-009
![TC-ACTIVITY-009 - Customer Care tạo Activity khi có Task Pending được giao](./assets/activities/TC-ACTIVITY-009.png)

### Minh chứng TC-ACTIVITY-010
![TC-ACTIVITY-010 - Sales không tạo Activity cho Deal của Sales khác](./assets/activities/TC-ACTIVITY-010.png)

### Minh chứng TC-ACTIVITY-011
![TC-ACTIVITY-011 - Customer Care không tạo Activity khi không có Task được giao](./assets/activities/TC-ACTIVITY-011.png)

### Minh chứng TC-ACTIVITY-012
![TC-ACTIVITY-012 - Customer Care không tạo Activity khi Task đã Completed](./assets/activities/TC-ACTIVITY-012.png)

### Minh chứng TC-ACTIVITY-013
![TC-ACTIVITY-013 - Customer Care không tạo Activity khi Task đã Cancelled](./assets/activities/TC-ACTIVITY-013.png)

### Minh chứng TC-ACTIVITY-014
![TC-ACTIVITY-014 - Loại Activity không hợp lệ](./assets/activities/TC-ACTIVITY-014.png)

### Minh chứng TC-ACTIVITY-015
![TC-ACTIVITY-015 - Không cho tạo Activity thiếu subject](./assets/activities/TC-ACTIVITY-015.png)

### Minh chứng TC-ACTIVITY-016
![TC-ACTIVITY-016 - Subject chỉ chứa khoảng trắng](./assets/activities/TC-ACTIVITY-016.png)

### Minh chứng TC-ACTIVITY-017
![TC-ACTIVITY-017 - Subject đúng 200 ký tự](./assets/activities/TC-ACTIVITY-017.png)

### Minh chứng TC-ACTIVITY-018
![TC-ACTIVITY-018 - Subject dài 201 ký tự](./assets/activities/TC-ACTIVITY-018.png)

### Minh chứng TC-ACTIVITY-019
![TC-ACTIVITY-019 - Mô tả chỉ chứa khoảng trắng](./assets/activities/TC-ACTIVITY-019.png)

### Minh chứng TC-ACTIVITY-020
![TC-ACTIVITY-020 - Định dạng thời gian Activity không hợp lệ](./assets/activities/TC-ACTIVITY-020.png)

### Minh chứng TC-ACTIVITY-021
![TC-ACTIVITY-021 - Activity mới có trạng thái Pending](./assets/activities/TC-ACTIVITY-021.1.png)
![TC-ACTIVITY-021 - Activity mới có trạng thái Pending](./assets/activities/TC-ACTIVITY-021.2.png)

### Minh chứng TC-ACTIVITY-022
![TC-ACTIVITY-022 - Cập nhật kết quả Activity Pending thành công](./assets/activities/TC-ACTIVITY-022.1.png)
![TC-ACTIVITY-022 - Cập nhật kết quả Activity Pending thành công](./assets/activities/TC-ACTIVITY-022.2.png)

### Minh chứng TC-ACTIVITY-023
![TC-ACTIVITY-023 - Hệ thống trim kết quả trước khi lưu](./assets/activities/TC-ACTIVITY-023.1.png)
![TC-ACTIVITY-023 - Hệ thống trim kết quả trước khi lưu](./assets/activities/TC-ACTIVITY-023.2.png)

### Minh chứng TC-ACTIVITY-024
![TC-ACTIVITY-024 - không cho cập nhật result chỉ chứa khoảng trắng](./assets/activities/TC-ACTIVITY-024.png)

### Minh chứng TC-ACTIVITY-025
![TC-ACTIVITY-025 - Không cập nhật kết quả Activity của người khác](./assets/activities/TC-ACTIVITY-025.png)

### Minh chứng TC-ACTIVITY-026
![TC-ACTIVITY-026 - Không cập nhật kết quả Activity đã Cancelled](./assets/activities/TC-ACTIVITY-026.png)

### Minh chứng TC-ACTIVITY-027
![TC-ACTIVITY-027 - Cho phép bổ sung/chỉnh lại result của Activity Completed](./assets/activities/TC-ACTIVITY-027.png)

### Minh chứng TC-ACTIVITY-028
![TC-ACTIVITY-028 - Hủy Activity Pending thành công](./assets/activities/TC-ACTIVITY-028.1.png)
![TC-ACTIVITY-028 - Hủy Activity Pending thành công](./assets/activities/TC-ACTIVITY-028.2.png)

### Minh chứng TC-ACTIVITY-029
![TC-ACTIVITY-029 - Hủy không phải xóa vật lý](./assets/activities/TC-ACTIVITY-029.png)

### Minh chứng TC-ACTIVITY-030
![TC-ACTIVITY-030 - Không hủy Activity đã Completed](./assets/activities/TC-ACTIVITY-030.png)

### Minh chứng TC-ACTIVITY-031
![TC-ACTIVITY-031 - Không hủy lại Activity đã Cancelled](./assets/activities/TC-ACTIVITY-031.png)

### Minh chứng TC-ACTIVITY-032
![TC-ACTIVITY-032 - Không hủy Activity của người khác](./assets/activities/TC-ACTIVITY-032.png)

### Minh chứng TC-ACTIVITY-033
![TC-ACTIVITY-033 - Thao tác của Activity Pending](./assets/activities/TC-ACTIVITY-033.png)

### Minh chứng TC-ACTIVITY-034
![TC-ACTIVITY-034 - Thao tác của Activity Completed](./assets/activities/TC-ACTIVITY-034.png)

### Minh chứng TC-ACTIVITY-035
![TC-ACTIVITY-035 - thao tác của Activity Cancelled](./assets/activities/TC-ACTIVITY-035.png)

### Minh chứng TC-ACTIVITY-036
![TC-ACTIVITY-036 - Admin không được truy cập API Activities](./assets/activities/TC-ACTIVITY-036.png)

### Minh chứng TC-ACTIVITY-037
![TC-ACTIVITY-037 - Marketing không được truy cập API Activities](./assets/activities/TC-ACTIVITY-037.png)

### Minh chứng TC-ACTIVITY-038
![TC-ACTIVITY-038 - Người chưa đăng nhập không truy cập Activities](./assets/activities/TC-ACTIVITY-038.png)

### Minh chứng TC-ACTIVITY-039
![TC-ACTIVITY-039 - tạo Activity có ghi Activity Log](./assets/activities/TC-ACTIVITY-039.png)

### Minh chứng TC-ACTIVITY-040
![TC-ACTIVITY-040 - Cập nhật result có ghi Activity Log](./assets/activities/TC-ACTIVITY-040.png)

### Minh chứng TC-ACTIVITY-041
![TC-ACTIVITY-041 - Hủy Activity có ghi Activity Log](./assets/activities/TC-ACTIVITY-041.png)