# Test Case - Quản lý Users

## UC11 - Quản lý Users

### Kỹ thuật thiết kế test áp dụng

- Phân vùng tương đương: dữ liệu người dùng hợp lệ/không hợp lệ; email mới/email đã tồn tại; role hợp lệ/không hợp lệ; User tồn tại/không tồn tại.
- Bảng quyết định: kiểm tra xóa vật lý hoặc khóa tài khoản dựa trên việc User đã phát sinh dữ liệu nghiệp vụ hay chưa.
- Phân quyền: kiểm tra chỉ Admin được phép quản lý Users.
- Bảng quyết định phân quyền Admin: Super Admin là tài khoản có role Admin và userId nhỏ nhất; Super Admin không được xóa, Super Admin được xóa Admin thường và các Admin thường được phép xóa lẫn nhau nhưng không được tự xóa.

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| TC-USERS-001 | UC11 - Xem danh sách Users | Kiểm tra Admin xem được danh sách người dùng | Admin đã đăng nhập; hệ thống có tài khoản người dùng | Không | 1. Đăng nhập bằng Admin; 2. Chọn **Quản lý người dùng** trên menu | Hiển thị danh sách người dùng với họ tên, email, số điện thoại, vai trò, trạng thái và thông tin cần thiết | Đã kiểm thử | PASS |
| TC-USERS-002 | UC11 - Tìm kiếm Users | Kiểm tra tìm kiếm User theo họ tên | Admin đã đăng nhập; có User phù hợp | Một phần họ tên User đang tồn tại | 1. Mở Quản lý người dùng; 2. Nhập một phần họ tên vào ô tìm kiếm; 3. Nhấn **Tìm kiếm** | Chỉ hiển thị các User có họ tên phù hợp với từ khóa | Đã kiểm thử | PASS |
| TC-USERS-003 | UC11 - Tìm kiếm Users | Kiểm tra tìm kiếm User theo email | Admin đã đăng nhập; có User phù hợp | Một phần email User đang tồn tại | 1. Mở Quản lý người dùng; 2. Nhập một phần email; 3. Nhấn **Tìm kiếm** | Hiển thị các User có email phù hợp; tìm kiếm không phân biệt hoa thường | Đã kiểm thử | PASS |
| TC-USERS-004 | UC11 - Tìm kiếm Users | Kiểm tra tìm kiếm User theo số điện thoại | Admin đã đăng nhập; có User có số điện thoại | Một phần số điện thoại đang tồn tại | 1. Mở Quản lý người dùng; 2. Nhập một phần số điện thoại; 3. Nhấn **Tìm kiếm** | Hiển thị các User có số điện thoại phù hợp | Đã kiểm thử | PASS |
| TC-USERS-005 | UC11 - Tìm kiếm Users | Kiểm tra trường hợp không có User phù hợp | Admin đã đăng nhập | Từ khóa `KhongTonTaiXYZ` | 1. Mở Quản lý người dùng; 2. Nhập `KhongTonTaiXYZ`; 3. Nhấn **Tìm kiếm** | Không hiển thị User không phù hợp; danh sách thể hiện trạng thái không có dữ liệu | Đã kiểm thử | PASS |
| TC-USERS-006 | UC11 - Lọc Users | Kiểm tra lọc tài khoản đang hoạt động | Admin đã đăng nhập; có User `status=true` | Trạng thái `Đang hoạt động` | 1. Mở Quản lý người dùng; 2. Chọn trạng thái đang hoạt động | Chỉ hiển thị User có `status=true` | Đã kiểm thử | PASS |
| TC-USERS-007 | UC11 - Lọc Users | Kiểm tra lọc tài khoản đã khóa | Admin đã đăng nhập; có User `status=false` | Trạng thái `Đã khóa` | 1. Mở Quản lý người dùng; 2. Chọn trạng thái đã khóa | Chỉ hiển thị User có `status=false` | Đã kiểm thử | PASS |
| TC-USERS-008 | UC11 - Vai trò | Kiểm tra danh sách vai trò được tải để Admin chọn | Admin đã đăng nhập; hệ thống có các Role | Không | 1. Mở form thêm hoặc sửa User; 2. Mở danh sách vai trò | Hiển thị các vai trò hiện có để Admin lựa chọn | Đã kiểm thử | PASS |
| TC-USERS-009 | UC11 - Xem chi tiết User | Kiểm tra xem thông tin chi tiết User tồn tại | Admin đã đăng nhập; User tồn tại | Chọn một User trong danh sách | 1. Mở Quản lý người dùng; 2. Chọn **Xem** tại một User | Hiển thị đúng họ tên, email, số điện thoại, trạng thái và vai trò của User | Đã kiểm thử | PASS |
| TC-USERS-010 | UC11 - Xem chi tiết User | Kiểm tra API khi User ID không tồn tại | Admin có token hợp lệ | `GET /api/v1/users/999` | 1. Mở Swagger; 2. Authorize bằng token Admin; 3. Gọi `GET /api/v1/users/999`; 4. Execute | HTTP 404; hiển thị `Không tìm thấy người dùng.` | Đã kiểm thử | PASS |
| TC-USERS-011 | UC11 - Thêm User | Kiểm tra Admin thêm User hợp lệ | Admin đã đăng nhập; email chưa tồn tại | Họ tên `Nguyễn Văn An`; email `an.tc011@example.com`; mật khẩu hợp lệ; chọn một Role; trạng thái hoạt động | 1. Mở Quản lý người dùng; 2. Nhấn **Thêm người dùng**; 3. Nhập dữ liệu hợp lệ; 4. Chọn vai trò; 5. Nhấn lưu | Hiển thị `Thêm người dùng thành công.`; User mới xuất hiện trong danh sách; trạng thái và Role đúng dữ liệu đã nhập | Đã kiểm thử | PASS |
| TC-USERS-012 | UC11 - Thêm User | Kiểm tra không cho thêm User thiếu họ tên | Admin đã đăng nhập | Họ tên trống; email mới; mật khẩu và Role hợp lệ | 1. Mở form thêm User; 2. Để trống họ tên; 3. Nhập các trường còn lại; 4. Nhấn lưu | Không tạo User; hệ thống yêu cầu nhập họ tên hoặc thông báo họ tên không được để trống | Đã kiểm thử | PASS |
| TC-USERS-013 | UC11 - Thêm User | Kiểm tra không cho thêm User có email sai định dạng | Admin đã đăng nhập | Email `abc`; các trường còn lại hợp lệ | 1. Mở form thêm User; 2. Nhập email `abc`; 3. Nhập các trường khác hợp lệ; 4. Nhấn lưu | Không tạo User; hiển thị lỗi email không đúng định dạng | Đã kiểm thử | PASS |
| TC-USERS-014 | UC11 - Thêm User | Kiểm tra không cho tạo User khi email đã tồn tại | Admin đã đăng nhập; email đã được một User khác sử dụng | Email của User đang tồn tại | 1. Mở form thêm User; 2. Nhập email đã tồn tại; 3. Nhập các trường còn lại hợp lệ; 4. Nhấn lưu | Không tạo User mới; hiển thị `Email này đã tồn tại.` | Đã kiểm thử | PASS |
| TC-USERS-015 | UC11 - Thêm User | Kiểm tra email trùng không phân biệt hoa thường | Admin đã đăng nhập; có User sử dụng `an.tc011@example.com` | Email `AN.TC011@example.com` | 1. Mở form thêm User; 2. Nhập email khác chữ hoa/thường với email đã tồn tại; 3. Nhấn lưu | Không tạo User; hiển thị `Email này đã tồn tại.` | Đã kiểm thử | PASS |
| TC-USERS-016 | UC11 - Thêm User | Kiểm tra không cho thêm User khi thiếu mật khẩu | Admin đã đăng nhập | Có họ tên, email mới, Role; mật khẩu trống | 1. Mở form thêm User; 2. Nhập các trường hợp lệ; 3. Để trống mật khẩu; 4. Nhấn lưu | Không tạo User; hệ thống yêu cầu nhập mật khẩu | Đã kiểm thử | PASS |
| TC-USERS-017 | UC11 - Thêm User | Kiểm tra không cho thêm User khi chưa chọn vai trò | Admin đã đăng nhập | Họ tên, email và mật khẩu hợp lệ; chưa chọn Role | 1. Mở form thêm User; 2. Nhập thông tin; 3. Không chọn vai trò; 4. Nhấn lưu | Không tạo User; hệ thống yêu cầu chọn vai trò | Đã kiểm thử | PASS |
| TC-USERS-018 | UC11 - Thêm User | Kiểm tra API từ chối Role ID không tồn tại | Admin có token hợp lệ | `roleId=999`; các trường khác hợp lệ | 1. Mở Swagger; 2. Authorize Admin; 3. Gọi `POST /api/v1/users`; 4. Gửi body với `roleId=999`; 5. Execute | HTTP 422; hiển thị `Vai trò người dùng không hợp lệ.`; không tạo User | Đã kiểm thử | PASS |
| TC-USERS-019 | UC11 - BR16 | Kiểm tra emai và tên được chuẩn hóa trước khi lưu | Admin đã đăng nhập; email chưa tồn tại | Họ tên `  User Chuẩn Hóa  `; email `USER.NORMALIZE@EXAMPLE.COM` | 1. Thêm User với dữ liệu trên; 2. Lưu; 3. Quan sát danh sách hoặc chi tiết User | User được tạo; họ tên được loại khoảng trắng đầu/cuối; email được lưu chữ thường `user.normalize@example.com` | Đã kiểm thử | PASS |
| TC-USERS-020 | UC11 - BR16 | Kiểm tra mật khẩu không được lưu dạng plaintext | Admin đã tạo thành công một User | Mật khẩu sử dụng khi tạo User | 1. Tạo User trên giao diện; 2. Mở Prisma Studio; 3. Mở bảng `users`; 4. Kiểm tra trường `password_hash` của User vừa tạo | `password_hash` có giá trị đã mã hóa/hash và không bằng mật khẩu plaintext đã nhập | Đã kiểm thử | PASS |
| TC-USERS-021 | UC11 - Cập nhật User | Kiểm tra cập nhật thông tin User hợp lệ | Admin đã đăng nhập; User tồn tại | Thay đổi họ tên, email, số điện thoại hoặc trạng thái bằng dữ liệu hợp lệ | 1. Mở Quản lý người dùng; 2. Nhấn **Sửa** tại User; 3. Thay đổi thông tin; 4. Nhấn lưu | Hiển thị `Cập nhật người dùng thành công.`; danh sách/chi tiết User hiển thị dữ liệu mới | Đã kiểm thử | PASS |
| TC-USERS-022 | UC11 - Cập nhật User | Kiểm tra không cho cập nhật họ tên thành chuỗi rỗng | Admin đã đăng nhập; User tồn tại | Họ tên chỉ chứa khoảng trắng | 1. Chọn sửa User; 2. Xóa họ tên hoặc nhập khoảng trắng; 3. Nhấn lưu | Không cập nhật; hiển thị `Họ tên không được để trống.`; dữ liệu cũ giữ nguyên | Đã kiểm thử | PASS |
| TC-USERS-023 | UC11 - Cập nhật User | Kiểm tra không cho đổi email thành email của User khác | Admin đã đăng nhập; có ít nhất hai User | Đổi email User A thành email User B | 1. Chọn sửa User A; 2. Nhập email của User B; 3. Nhấn lưu | Không cập nhật; hiển thị `Email này đã tồn tại.`; email User A giữ nguyên | Đã kiểm thử | PASS |
| TC-USERS-024 | UC11 - Cập nhật User | Kiểm tra cập nhật User nhưng không thay đổi dữ liệu | Admin có token hợp lệ; User tồn tại | Body chứa dữ liệu giống dữ liệu hiện tại hoặc không tạo ra thay đổi | 1. Mở Swagger; 2. Authorize Admin; 3. Gọi `PATCH /api/v1/users/{id}` với dữ liệu không thay đổi; 4. Execute | Trả `Không có thông tin thay đổi.`; dữ liệu User giữ nguyên; không tạo Activity Log Update không cần thiết | Đã kiểm thử | PASS |
| TC-USERS-025 | UC11 - Cập nhật User | Kiểm tra cập nhật User không tồn tại | Admin có token hợp lệ | `PATCH /api/v1/users/999` với body hợp lệ | 1. Mở Swagger; 2. Authorize Admin; 3. Gọi PATCH User ID `999`; 4. Execute | HTTP 404; hiển thị `Không tìm thấy người dùng.`; không tạo User mới | Đã kiểm thử | PASS |
| TC-USERS-026 | UC11 - Gán vai trò | Kiểm tra Admin thay đổi vai trò của User thành công | Admin đã đăng nhập; User tồn tại; Role mới tồn tại | Chọn một Role khác Role hiện tại | 1. Mở Quản lý người dùng; 2. Chọn sửa User; 3. Chọn Role khác; 4. Nhấn lưu | Role của User được cập nhật thành Role mới; hiển thị thông báo cập nhật thành công | Đã kiểm thử | PASS |
| TC-USERS-027 | UC11 - Gán vai trò | Kiểm tra API từ chối cập nhật Role không tồn tại | Admin có token hợp lệ; User tồn tại | `{"roleId":999}` | 1. Mở Swagger; 2. Authorize Admin; 3. Gọi `PATCH /api/v1/users/{id}`; 4. Gửi `roleId=999`; 5. Execute | HTTP 422; hiển thị `Vai trò người dùng không hợp lệ.`; Role cũ giữ nguyên | Đã kiểm thử | PASS |
| TC-USERS-028 | UC11 - Khóa User | Kiểm tra Admin thay đổi trạng thái User sang bị khóa | Admin đã đăng nhập; User tồn tại và đang hoạt động | Chuyển trạng thái sang khóa | 1. Chọn sửa User; 2. Chuyển trạng thái sang bị khóa; 3. Nhấn lưu | User chuyển sang `status=false`; danh sách hiển thị trạng thái tài khoản đã khóa | Đã kiểm thử | PASS |
| TC-USERS-029 | UC11 - Xóa User | Kiểm tra xóa vật lý User chưa phát sinh dữ liệu nghiệp vụ | Admin đã đăng nhập; User tồn tại; User chưa có Activity, Activity Log, Deal, Lead, Notification, Quote hoặc Task liên quan | Chọn User chưa phát sinh dữ liệu | 1. Mở Quản lý người dùng; 2. Nhấn **Xóa**; 3. Xác nhận; 4. Kiểm tra danh sách; 5. Kiểm tra bảng `users` bằng Prisma Studio | Hiển thị `Xóa người dùng thành công.`; trả `mode=deleted`; User không còn trong bảng `users`; Activity Log Delete được tạo | Đã kiểm thử | PASS |
| TC-USERS-030 | UC11 - BR20 | Kiểm tra không xóa vật lý User đã phát sinh dữ liệu nghiệp vụ | Admin đã đăng nhập; User có ít nhất một dữ liệu liên kết như Lead, Deal, Task, Quote, Notification, Activity hoặc Activity Log | Chọn User đã phát sinh dữ liệu nghiệp vụ | 1. Mở Quản lý người dùng; 2. Nhấn **Xóa**; 3. Xác nhận; 4. Kiểm tra Prisma Studio | Hệ thống thông báo `Người dùng đã phát sinh dữ liệu nghiệp vụ nên tài khoản đã được khóa thay vì xóa vật lý.`; trả `mode=deactivated`; User vẫn còn trong DB và `status=false`; dữ liệu liên quan không bị xóa | Đã kiểm thử | PASS |
| TC-USERS-031 | UC11 - Xóa User | Kiểm tra Admin thường không được tự xóa tài khoản đang đăng nhập | Admin thường đang đăng nhập và có token hợp lệ; Admin này không phải Super Admin | `DELETE /api/v1/users/{id}` với ID chính Admin thường đang đăng nhập | 1. Mở Swagger; 2. Authorize bằng token Admin thường; 3. Xác định `userId` của chính Admin; 4. Gọi DELETE đúng ID đó; 5. Execute | HTTP 403; hiển thị `Bạn không thể xóa tài khoản đang đăng nhập.`; tài khoản Admin không bị thay đổi | Đã kiểm thử | PASS |
| TC-USERS-032 | UC11 - Xóa User | Kiểm tra xóa User ID không tồn tại | Admin có token hợp lệ | `DELETE /api/v1/users/999` | 1. Mở Swagger; 2. Authorize Admin; 3. Gọi `DELETE /api/v1/users/999`; 4. Execute | HTTP 404; hiển thị `Không tìm thấy người dùng.`; dữ liệu DB không thay đổi | Đã kiểm thử | PASS |
| TC-USERS-033 | UC11 - BR18 | Kiểm tra tạo User có ghi Activity Log | Admin đã tạo thành công User mới | User vừa tạo | 1. Tạo User trên giao diện; 2. Ghi lại User ID; 3. Mở Activity Log hoặc Prisma Studio; 4. Tìm log theo User vừa tạo | Có Activity Log với `action=Create`, `tablename=users`, `recordid` đúng User vừa tạo và người thực hiện là đúng Admin; `new_value` chứa thông tin User mới nhưng không chứa mật khẩu | Đã kiểm thử | PASS |
| TC-USERS-034 | UC11 - BR18 | Kiểm tra cập nhật thông tin User có ghi Activity Log | Admin đã cập nhật thành công một User | User vừa cập nhật | 1. Cập nhật họ tên/email/số điện thoại hoặc trạng thái User; 2. Mở Activity Log; 3. Tìm log tương ứng | Có Activity Log với `action=Update`, `tablename=users`, đúng `recordid`, đúng Admin thực hiện; có dữ liệu trước và sau thay đổi | Đã kiểm thử | PASS |
| TC-USERS-035 | UC11 - BR18 | Kiểm tra đổi Role User có ghi Activity Log riêng | Admin đã đổi vai trò User thành công | User vừa được đổi Role | 1. Đổi Role User trên giao diện; 2. Mở Activity Log; 3. Lọc/tìm log của User vừa đổi Role | Có Activity Log với `action=Assign`, `tablename=users`, đúng `recordid`; `old_value` chứa Role cũ và `new_value` chứa Role mới | Đã kiểm thử | PASS |
| TC-USERS-036 | UC11 - BR18 | Kiểm tra xóa hoặc khóa User có ghi Activity Log | Admin đã thực hiện xóa một User | User vừa được xóa hoặc khóa | 1. Thực hiện xóa User; 2. Mở Activity Log; 3. Tìm log tương ứng | Có Activity Log với `action=Delete`, `tablename=users`, đúng `recordid` và đúng Admin thực hiện; nếu User bị khóa thì log có dữ liệu trước/sau thể hiện `status=false` | Đã kiểm thử | PASS |
| TC-USERS-037 | UC11 - Phân quyền | Kiểm tra Sales không được gọi API quản lý Users | Sales có token hợp lệ | `GET /api/v1/users` | 1. Mở Swagger; 2. Authorize bằng token Sales; 3. Gọi `GET /api/v1/users`; 4. Execute | HTTP 403; không trả danh sách Users | Đã kiểm thử | PASS |
| TC-USERS-038 | UC11 - Phân quyền | Kiểm tra Sales Manager không được gọi API quản lý Users | Sales Manager có token hợp lệ | `GET /api/v1/users` | 1. Mở Swagger; 2. Authorize bằng token Sales Manager; 3. Gọi `GET /api/v1/users`; 4. Execute | HTTP 403; không trả danh sách Users | Đã kiểm thử | PASS |
| TC-USERS-039 | UC11 - Phân quyền | Kiểm tra Marketing không được gọi API quản lý Users | Marketing có token hợp lệ | `GET /api/v1/users` | 1. Mở Swagger; 2. Authorize bằng token Marketing; 3. Gọi `GET /api/v1/users`; 4. Execute | HTTP 403; không trả danh sách Users | Đã kiểm thử | PASS |
| TC-USERS-040 | UC11 - Phân quyền | Kiểm tra Customer Care không được gọi API quản lý Users | Customer Care có token hợp lệ | `GET /api/v1/users` | 1. Mở Swagger; 2. Authorize bằng token Customer Care; 3. Gọi `GET /api/v1/users`; 4. Execute | HTTP 403; không trả danh sách Users | Đã kiểm thử | PASS |
| TC-USERS-041 | UC11 - Xác thực | Kiểm tra gọi API Users khi chưa đăng nhập | Không có access token | `GET /api/v1/users` | 1. Mở Swagger; 2. Clear Authorize; 3. Gọi `GET /api/v1/users`; 4. Execute | HTTP 401; không trả danh sách Users | Đã kiểm thử | PASS |
| TC-USERS-042 | UC11 - Xóa User / Super Admin | Kiểm tra Admin thường không được xóa Super Admin | Super Admin tồn tại và là tài khoản có role Admin với userId nhỏ nhất; Admin thường đã đăng nhập | `DELETE /api/v1/users/1` | 1. Đăng nhập bằng Admin thường; 2. Mở Swagger; 3. Authorize bằng token Admin thường; 4. Gọi `DELETE /api/v1/users/1`; 5. Execute; 6. Kiểm tra bảng `users` | HTTP 403; hiển thị `Không thể xóa tài khoản Super Admin.`; Super Admin vẫn tồn tại và không bị khóa | Đã kiểm thử | PASS |
| TC-USERS-043 | UC11 - Xóa User / Super Admin | Kiểm tra Super Admin không được tự xóa chính mình | Đăng nhập bằng Super Admin có userId nhỏ nhất trong các Admin | `DELETE /api/v1/users/1` | 1. Đăng nhập bằng Super Admin; 2. Mở Swagger; 3. Authorize bằng token Super Admin; 4. Gọi `DELETE /api/v1/users/1`; 5. Execute; 6. Kiểm tra bảng `users` | HTTP 403; hiển thị `Không thể xóa tài khoản Super Admin.`; tài khoản Super Admin không bị thay đổi | Đã kiểm thử | PASS |
| TC-USERS-044 | UC11 - Xóa User / Super Admin | Kiểm tra Super Admin được phép xóa Admin thường | Super Admin đã đăng nhập; Admin thường tồn tại và chưa phát sinh dữ liệu nghiệp vụ | ID của một Admin thường | 1. Đăng nhập bằng Super Admin; 2. Chọn Admin thường; 3. Thực hiện xóa; 4. Xác nhận; | Xóa thành công;  Admin thường bị xóa khỏi bảng `users`; Activity Log Delete ghi nhận Super Admin là người thực hiện | Đã kiểm thử | PASS |
| TC-USERS-045 | UC11 - Xóa User / Admin | Kiểm tra Admin thường được phép xóa Admin thường khác | Có ít nhất hai Admin thường; Admin A đã đăng nhập; Admin B chưa phát sinh dữ liệu nghiệp vụ | ID của Admin B | 1. Đăng nhập bằng Admin A; 2. Chọn Admin B; 3. Thực hiện xóa; 4. Xác nhận; | Xóa thành công; Admin B bị xóa; Admin A vẫn hoạt động; Activity Log Delete ghi nhận đúng Admin A là người thực hiện | Đã kiểm thử | PASS |

### Minh chứng TC-USERS-001
![TC-USERS-001 - Admin xem được danh sách người dùng](./assets/users/TC-USERS-001.png)

### Minh chứng TC-USERS-002
![TC-USERS-002 - Tìm kiếm User theo họ tên](./assets/users/TC-USERS-002.png)

### Minh chứng TC-USERS-003
![TC-USERS-003 - Tìm kiếm User theo email](./assets/users/TC-USERS-003.png)

### Minh chứng TC-USERS-004
![TC-USERS-004 - Tìm kiếm User theo số điện thoại](./assets/users/TC-USERS-004.png)

### Minh chứng TC-USERS-005
![TC-USERS-005 - Trường hợp không có User phù hợp](./assets/users/TC-USERS-005.png)

### Minh chứng TC-USERS-006
![TC-USERS-006 - Lọc tài khoản đang hoạt động](./assets/users/TC-USERS-006.png)

### Minh chứng TC-USERS-007
![TC-USERS-007 - Lọc tài khoản đã khóa](./assets/users/TC-USERS-007.png)

### Minh chứng TC-USERS-008
![TC-USERS-008 - Danh sách vai trò được tải để Admin chọn](./assets/users/TC-USERS-008.png)

### Minh chứng TC-USERS-009
![TC-USERS-009 - Xem thông tin chi tiết User tồn tại](./assets/users/TC-USERS-009.png)

### Minh chứng TC-USERS-010
![TC-USERS-010 - API khi User ID không tồn tại](./assets/users/TC-USERS-010.png)

### Minh chứng TC-USERS-011
![TC-USERS-011 - Admin thêm User hợp lệ](./assets/users/TC-USERS-011.png)

### Minh chứng TC-USERS-012
![TC-USERS-012 - Không cho thêm User thiếu họ tên](./assets/users/TC-USERS-012.png)

### Minh chứng TC-USERS-013
![TC-USERS-013 - Không cho thêm User có email sai định dạng](./assets/users/TC-USERS-013.png)

### Minh chứng TC-USERS-014
![TC-USERS-014 - Không cho tạo User khi email đã tồn tại](./assets/users/TC-USERS-014.png)

### Minh chứng TC-USERS-015
![TC-USERS-015 - Email trùng không phân biệt hoa thường](./assets/users/TC-USERS-015.png)

### Minh chứng TC-USERS-016
![TC-USERS-016 - Không cho thêm User khi thiếu mật khẩu](./assets/users/TC-USERS-016.png)

### Minh chứng TC-USERS-017
![TC-USERS-017 - Không cho thêm User khi chưa chọn vai trò](./assets/users/TC-USERS-017.png)

### Minh chứng TC-USERS-018
![TC-USERS-018 - API từ chối Role ID không tồn tại](./assets/users/TC-USERS-018.png)

### Minh chứng TC-USERS-019
![TC-USERS-019 - Emai và tên được chuẩn hóa trước khi lưu](./assets/users/TC-USERS-019.1.png)
![TC-USERS-019 - Emai và tên được chuẩn hóa trước khi lưu](./assets/users/TC-USERS-019.2.png)

### Minh chứng TC-USERS-020
![TC-USERS-020 - Mật khẩu không được lưu dạng plaintext](./assets/users/TC-USERS-020.png)

### Minh chứng TC-USERS-021
![TC-USERS-021 - Cập nhật thông tin User hợp lệ](./assets/users/TC-USERS-021.png)

### Minh chứng TC-USERS-022
![TC-USERS-022 - Cập nhật thông tin User hợp lệ](./assets/users/TC-USERS-022.png)

### Minh chứng TC-USERS-023
![TC-USERS-023 - Không cho đổi email thành email của User khác](./assets/users/TC-USERS-023.png)

### Minh chứng TC-USERS-024
![TC-USERS-024 - Cập nhật User nhưng không thay đổi dữ liệu](./assets/users/TC-USERS-024.png)

### Minh chứng TC-USERS-025
![TC-USERS-025 - Cập nhật User không tồn tại](./assets/users/TC-USERS-025.png)

### Minh chứng TC-USERS-026
![TC-USERS-026 - Admin thay đổi vai trò của User thành công](./assets/users/TC-USERS-026.png)

### Minh chứng TC-USERS-027
![TC-USERS-027 - API từ chối cập nhật Role không tồn tại](./assets/users/TC-USERS-027.png)

### Minh chứng TC-USERS-028
![TC-USERS-028 - Admin thay đổi trạng thái User sang bị khóa](./assets/users/TC-USERS-028.1.png)
![TC-USERS-028 - Admin thay đổi trạng thái User sang bị khóa](./assets/users/TC-USERS-028.2.png)

### Minh chứng TC-USERS-029
![TC-USERS-029 - Xóa vật lý User chưa phát sinh dữ liệu nghiệp vụ](./assets/users/TC-USERS-029.png)

### Minh chứng TC-USERS-030
![TC-USERS-030 - Không xóa vật lý User đã phát sinh dữ liệu nghiệp vụ](./assets/users/TC-USERS-030.1.png)
![TC-USERS-030 - Không xóa vật lý User đã phát sinh dữ liệu nghiệp vụ](./assets/users/TC-USERS-030.2.png)

### Minh chứng TC-USERS-031
![TC-USERS-031 - Admin không được tự xóa tài khoản đang đăng nhập](./assets/users/TC-USERS-031.png)

### Minh chứng TC-USERS-032
![TC-USERS-032 - Xóa User ID không tồn tại](./assets/users/TC-USERS-032.png)

### Minh chứng TC-USERS-033
![TC-USERS-033 - Tạo User có ghi Activity Log](./assets/users/TC-USERS-033.1.png)
![TC-USERS-033 - Tạo User có ghi Activity Log](./assets/users/TC-USERS-033.2.png)

### Minh chứng TC-USERS-034
![TC-USERS-034 - Cập nhật thông tin User có ghi Activity Log](./assets/users/TC-USERS-034.1.png)
![TC-USERS-034 - Cập nhật thông tin User có ghi Activity Log](./assets/users/TC-USERS-034.2.png)

### Minh chứng TC-USERS-035
![TC-USERS-035 - Đổi Role User có ghi Activity Log riêng](./assets/users/TC-USERS-035.1.png)
![TC-USERS-035 - Đổi Role User có ghi Activity Log riêng](./assets/users/TC-USERS-035.2.png)

### Minh chứng TC-USERS-036
![TC-USERS-036 - Xóa hoặc khóa User có ghi Activity Log](./assets/users/TC-USERS-036.1.png)
![TC-USERS-036 - Xóa hoặc khóa User có ghi Activity Log](./assets/users/TC-USERS-036.2.png)

### Minh chứng TC-USERS-037
![TC-USERS-037 - Sales không được gọi API quản lý Users](./assets/users/TC-USERS-037.png)

### Minh chứng TC-USERS-038
![TC-USERS-038 - Sales Manager không được gọi API quản lý Users](./assets/users/TC-USERS-038.png)

### Minh chứng TC-USERS-039
![TC-USERS-039 - Marketing không được gọi API quản lý Users](./assets/users/TC-USERS-039.png)

### Minh chứng TC-USERS-040
![TC-USERS-040 - Customer Care không được gọi API quản lý Users](./assets/users/TC-USERS-040.png)

### Minh chứng TC-USERS-041
![TC-USERS-041 - Gọi API Users khi chưa đăng nhập](./assets/users/TC-USERS-041.png)

### Minh chứng TC-USERS-042
![TC-USERS-042 - Admin thường không được xóa Super Admin](./assets/users/TC-USERS-042.png)

### Minh chứng TC-USERS-043
![TC-USERS-043 - Super Admin không được tự xóa chính mình](./assets/users/TC-USERS-043.png)

### Minh chứng TC-USERS-044
![TC-USERS-044 - Super Admin được phép xóa Admin thường](./assets/users/TC-USERS-044.png)

### Minh chứng TC-USERS-045
![TC-USERS-045 - Admin thường được phép xóa Admin thường khác](./assets/users/TC-USERS-045.png)