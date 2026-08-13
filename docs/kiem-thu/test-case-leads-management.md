# Test Case - Quản lý Lead

## UC2 - Quản lý Lead

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| LEAD-001 | UC2 - Xem danh sách Lead | Kiểm tra Marketing xem được danh sách Lead | Marketing đã đăng nhập; hệ thống có dữ liệu Lead | Không có dữ liệu nhập | 1. Đăng nhập Marketing; 2. Mở Dashboard Marketing; 3. Nhấn **Quản lý Lead** | hiển thị danh sách Lead | Đã kiểm thử | PASS |
| LEAD-002 | UC2 - Thêm Lead | Kiểm tra Marketing tạo Lead hợp lệ | Marketing đã đăng nhập; email và SĐT chưa tồn tại | Họ tên: Nguyễn Văn Tuấn; Email: `lead.tc002@example.com`; SĐT: `0909000002`; Trạng thái: New | 1. Mở Quản lý Lead; 2. Nhấn **Thêm Lead**; 3. Nhập dữ liệu; 4. Nhấn **Lưu** | Lead mới được tạo; Lead xuất hiện trong danh sách | Đã kiểm thử | PASS |
| LEAD-003 | UC2 - Thêm Lead | Kiểm tra không cho tạo Lead thiếu họ tên | Marketing đã đăng nhập | Họ tên: trống; Email: `lead.tc003@example.com`; SĐT: `0909000003` | 1. Nhấn **Thêm Lead**; 2. Để trống họ tên; 3. Nhập các trường còn lại; 4. Nhấn **Lưu** | Hệ thống không bật nút **Thêm Lead** để tạo Lead | Đã kiểm thử | PASS |
| LEAD-004 | UC2 - Thêm Lead | Kiểm tra email sai định dạng | Marketing đã đăng nhập | Họ tên: New Lead; Email: `abc`; SĐT: `0909000004` | 1. Nhấn **Thêm Lead**; 2. Nhập email sai; 3. Nhấn **Lưu** | hiển thị lỗi email không hợp lệ; không tạo Lead | Đã kiểm thử | PASS |
| LEAD-005 | UC2 / BR03 | Kiểm tra không cho tạo Lead trùng email | Marketing đã đăng nhập; đã tồn tại Lead có email dùng để test | Họ tên: New Lead; nam@namviet.vn; 0909000004 | 1. Nhấn **Thêm Lead**; 2. Nhập email đã tồn tại; 3. Nhấn **Lưu** | Hệ thống từ chối tạo; thông báo email đã tồn tại | Đã kiểm thử | PASS |
| LEAD-006 | UC2 / BR03 | Kiểm tra không cho tạo Lead trùng số điện thoại | Marketing đã đăng nhập; đã tồn tại Lead có SĐT dùng để test | Họ tên: New Lead; lead.tc006@example.com; 0911000001 | 1. Nhấn **Thêm Lead**; 2. Nhập SĐT đã tồn tại; 3. Nhấn **Lưu** | Hệ thống từ chối tạo; không có record Lead mới; thông báo dữ liệu đã tồn tại | Đã kiểm thử | PASS |
| LEAD-007 | UC2 - Tìm kiếm Lead | Tìm kiếm Lead có tồn tại | Marketing đã đăng nhập; có Lead phù hợp | Từ khóa: tên/email/công ty của Lead đang tồn tại | 1. Nhập từ khóa; 2. Nhấn **Tìm kiếm** | Danh sách chỉ hiển thị Lead phù hợp | Đã kiểm thử | PASS |
| LEAD-008 | UC2 - Tìm kiếm Lead | Kiểm tra trường hợp tìm kiếm không có kết quả | Marketing đã đăng nhập | Từ khóa: `khongtontai999999` | 1. Nhập từ khóa; 2. Nhấn **Tìm kiếm** | Danh sách rỗng; giao diện thông báo không tìm thấy Lead phù hợp | Đã kiểm thử | PASS |
| LEAD-009 | UC2 - Cập nhật Lead | Kiểm tra Marketing sửa Lead thành công | Marketing đã đăng nhập; Lead cần sửa tồn tại | Đổi công ty hoặc trạng thái của Lead | 1. Chọn Lead; 2. Nhấn **Sửa**; 3. Thay đổi thông tin; 4. Nhấn **Lưu** | Thông tin Lead được cập nhật; dữ liệu mới hiển thị trên danh sách | Đã kiểm thử | PASS |
| LEAD-010 | UC2 - Xóa Lead | Kiểm tra Marketing xóa Lead chưa có liên kết | Marketing đã đăng nhập; Lead chưa có Customer liên kết | Lead hợp lệ để xóa | 1. Chọn Lead; 2. Nhấn **Xóa**; 3. Xác nhận | Lead bị xóa; Lead không còn xuất hiện trong danh sách | Đã kiểm thử | PASS |
| LEAD-011 | UC2 / BR20 | Kiểm tra không cho xóa Lead đã phát sinh liên kết nghiệp vụ | Marketing đã đăng nhập; Lead đã có Customer liên kết | Lead đã được chuyển đổi | 1. Tìm Lead đã Converted; 2. Nhấn **Xóa**; 3. Xác nhận | Hệ thống từ chối xóa vật lý; Lead và Customer liên quan vẫn tồn tại; hiển thị thông báo lỗi | Đã kiểm thử | PASS |
| LEAD-012 | Phân quyền Lead | Kiểm tra Sales được xem danh sách Lead | Sales đã đăng nhập | Không có dữ liệu ban đầu | 1. Đăng nhập Sales; 2. Truy cập danh sách Lead | Sales xem được danh sách Lead | Chưa chạy | Chưa chạy |
| LEAD-013 | Phân quyền Lead | Kiểm tra Sales không được tạo Lead | Sales đã đăng nhập | Không có dữ liệu ban đầu | 1. Đăng nhập Sales; 2. Gửi request tạo Lead | không tạo Lead mới | Chưa chạy | Chưa chạy |
| LEAD-014 | Phân quyền Lead | Kiểm tra Customer Care không được truy cập danh sách Lead | Customer Care đã đăng nhập | Không có dữ liệu ban đầu | 1. Đăng nhập Customer Care; 2. Gọi API danh sách Lead | HTTP 403; không trả dữ liệu Lead | Chưa chạy | Chưa chạy |

### Minh chứng LEAD-001
![LEAD-001 - Hiển thị danh sách leads](./assets/leads/leads-001-view-list.png)

### Minh chứng LEAD-002
![LEAD-002 - Thông tin của Lead mới](./assets/leads/leads-002-info-new-lead.png)
![LEAD-002 - Thêm Lead mới thành công](./assets/leads/leads-002-confirm.png)

### Minh chứng LEAD-003
![LEAD-003 - Không cho phép tạo Lead nếu thiếu họ tên](./assets/leads/leads-003-unallowed-creation.png)

### Minh chứng LEAD-004
![LEAD-004 - Thêm Lead mới với email sai định dạng](./assets/leads/leads-004-invalid-email-format.png)

### Minh chứng LEAD-005
![LEAD-005 - Thêm Lead mới với email đã tồn tại](./assets/leads/leads-005-existed-email.png)

### Minh chứng LEAD-006
![LEAD-006 - Thêm Lead mới với số điện thoại đã tồn tại](./assets/leads/leads-006-existed-phone.png)

### Minh chứng LEAD-007
![LEAD-007 - Tìm kiếm danh sách Lead với từ khóa](./assets/leads/leads-007-searching-leads.png)

### Minh chứng LEAD-008
![LEAD-008 - Tìm kiếm danh sách Lead không tồn tại](./assets/leads/leads-008-empty-leads.png)

### Minh chứng LEAD-009
![LEAD-009 - Thông tin của Lead sau khi sửa](./assets/leads/leads-009-info-editing.png)
![LEAD-009 - Sửa thông tin Lead thành công](./assets/leads/leads-009-confirm-editing.png)

### Minh chứng LEAD-010
![LEAD-010 - Chọn Lead chưa có phát sinh liên kết muốn xóa](./assets/leads/leads-010-choose-deleted-lead.png)
![LEAD-009 - Xác nhận xóa Lead thành công](./assets/leads/leads-010-confirm-deleted-lead.png)

### Minh chứng LEAD-011
![LEAD-011 - Chọn Lead đã có phát sinh liên kết muốn xóa](./assets/leads/leads-011-choose-relative-lead.png)
![LEAD-011 - Xác nhận không cho phép xóa Lead](./assets/leads/leads-011-confirm-unallowed-relative-lead.png)