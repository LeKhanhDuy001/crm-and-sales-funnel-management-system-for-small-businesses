# Test Case - Quản lý Lead

## UC2 - Quản lý Lead

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| TC-LEADS-001 | UC2 - Xem danh sách Lead | Kiểm tra Marketing xem được danh sách Lead | Marketing đã đăng nhập; hệ thống có dữ liệu Lead | Không có dữ liệu nhập | 1. Đăng nhập Marketing; 2. Mở Dashboard Marketing; 3. Nhấn **Quản lý Lead** | Hiển thị danh sách Lead | Đã kiểm thử | PASS |
| TC-LEADS-002 | UC2 - Thêm Lead | Kiểm tra Marketing tạo Lead hợp lệ | Marketing đã đăng nhập; email và SĐT chưa tồn tại | Họ tên: Nguyễn Văn Tuấn; Email: `lead.tc002@example.com`; SĐT: `0909000002`; Trạng thái: New | 1. Mở Quản lý Lead; 2. Nhấn **Thêm Lead**; 3. Nhập dữ liệu; 4. Nhấn **Lưu** | Lead mới được tạo; Lead xuất hiện trong danh sách | Đã kiểm thử | PASS |
| TC-LEADS-003 | UC2 - Thêm Lead | Kiểm tra không cho tạo Lead thiếu họ tên | Marketing đã đăng nhập | Họ tên: trống; Email: `lead.tc003@example.com`; SĐT: `0909000003` | 1. Nhấn **Thêm Lead**; 2. Để trống họ tên; 3. Nhập các trường còn lại; 4. Nhấn **Lưu** | Hệ thống không bật nút **Thêm Lead** để tạo Lead | Đã kiểm thử | PASS |
| TC-LEADS-004 | UC2 - Thêm Lead | Kiểm tra email sai định dạng | Marketing đã đăng nhập | Họ tên: New Lead; Email: `abc`; SĐT: `0909000004` | 1. Nhấn **Thêm Lead**; 2. Nhập email sai; 3. Nhấn **Lưu** | Hiển thị lỗi email không hợp lệ; không tạo Lead | Đã kiểm thử | PASS |
| TC-LEADS-005 | UC2 / BR03 | Kiểm tra không cho tạo Lead trùng email | Marketing đã đăng nhập; đã tồn tại Lead có email dùng để test | Họ tên: New Lead; nam@namviet.vn; 0909000004 | 1. Nhấn **Thêm Lead**; 2. Nhập email đã tồn tại; 3. Nhấn **Lưu** | Hệ thống từ chối tạo; thông báo email đã tồn tại | Đã kiểm thử | PASS |
| TC-LEADS-006 | UC2 / BR03 | Kiểm tra không cho tạo Lead trùng số điện thoại | Marketing đã đăng nhập; đã tồn tại Lead có SĐT dùng để test | Họ tên: New Lead; lead.tc006@example.com; 0911000001 | 1. Nhấn **Thêm Lead**; 2. Nhập SĐT đã tồn tại; 3. Nhấn **Lưu** | Hệ thống từ chối tạo; không có record Lead mới; thông báo dữ liệu đã tồn tại | Đã kiểm thử | PASS |
| TC-LEADS-007 | UC2 - Tìm kiếm Lead | Tìm kiếm Lead có tồn tại | Marketing đã đăng nhập; có Lead phù hợp | Từ khóa: tên/email/công ty của Lead đang tồn tại | 1. Nhập từ khóa; 2. Nhấn **Tìm kiếm** | Danh sách chỉ hiển thị Lead phù hợp | Đã kiểm thử | PASS |
| TC-LEADS-008 | UC2 - Tìm kiếm Lead | Kiểm tra trường hợp tìm kiếm không có kết quả | Marketing đã đăng nhập | Từ khóa: `khongtontai999999` | 1. Nhập từ khóa; 2. Nhấn **Tìm kiếm** | Danh sách rỗng; giao diện thông báo không tìm thấy Lead phù hợp | Đã kiểm thử | PASS |
| TC-LEADS-009 | UC2 - Cập nhật Lead | Kiểm tra Marketing sửa Lead thành công | Marketing đã đăng nhập; Lead cần sửa tồn tại | Đổi công ty hoặc trạng thái của Lead | 1. Chọn Lead; 2. Nhấn **Sửa**; 3. Thay đổi thông tin; 4. Nhấn **Lưu** | Thông tin Lead được cập nhật; dữ liệu mới hiển thị trên danh sách | Đã kiểm thử | PASS |
| TC-LEADS-010 | UC2 - Xóa Lead | Kiểm tra Marketing xóa Lead chưa có liên kết | Marketing đã đăng nhập; Lead chưa có Customer liên kết | Lead hợp lệ để xóa | 1. Chọn Lead; 2. Nhấn **Xóa**; 3. Xác nhận | Lead bị xóa; Lead không còn xuất hiện trong danh sách | Đã kiểm thử | PASS |
| TC-LEADS-011 | UC2 / BR20 | Kiểm tra không cho xóa Lead đã phát sinh liên kết nghiệp vụ | Marketing đã đăng nhập; Lead đã có Customer liên kết | Lead đã được chuyển đổi | 1. Tìm Lead đã Converted; 2. Nhấn **Xóa**; 3. Xác nhận | Hệ thống từ chối xóa vật lý; Lead và Customer liên quan vẫn tồn tại; hiển thị thông báo lỗi | Đã kiểm thử | PASS |
| TC-LEADS-012 | Phân quyền Lead | Kiểm tra Sales được xem danh sách Lead đã phân công | Sales đã đăng nhập; có ít nhất một Lead được phân công cho Sales hiện tại. | Không có dữ liệu ban đầu | 1. Đăng nhập Sales; 2. Truy cập danh sách Lead | Sales xem được danh sách Lead | Đã kiểm thử | PASS |
| TC-LEADS-013 | Phân quyền Lead | Kiểm tra Sales được xem chi tiết Lead | Sales đã đăng nhập; có ít nhất một Lead được phân công cho Sales hiện tại. | Không có dữ liệu ban đầu | 1. Đăng nhập Sales; 2. Truy cập danh sách Lead; 3. Nhấn **Chi tiết** | Hiển thị chi tiết Lead | Đã kiểm thử | PASS |

### Minh chứng TC-LEADS-001
![TC-LEADS-001 - Hiển thị danh sách leads](./assets/leads/TC-LEADS-001.png)

### Minh chứng TC-LEADS-002
![TC-LEADS-002 - Thông tin của Lead mới](./assets/leads/TC-LEADS-002.1.png)
![TC-LEADS-002 - Thêm Lead mới thành công](./assets/leads/TC-LEADS-002.2.png)

### Minh chứng TC-LEADS-003
![TC-LEADS-003 - Không cho phép tạo Lead nếu thiếu họ tên](./assets/leads/TC-LEADS-003.png)

### Minh chứng TC-LEADS-004
![TC-LEADS-004 - Thêm Lead mới với email sai định dạng](./assets/leads/TC-LEADS-004.png)

### Minh chứng TC-LEADS-005
![TC-LEADS-005 - Thêm Lead mới với email đã tồn tại](./assets/leads/TC-LEADS-005.png)

### Minh chứng TC-LEADS-006
![TC-LEADS-006 - Thêm Lead mới với số điện thoại đã tồn tại](./assets/leads/TC-LEADS-006.png)

### Minh chứng TC-LEADS-007
![TC-LEADS-007 - Tìm kiếm danh sách Lead với từ khóa](./assets/leads/TC-LEADS-007.png)

### Minh chứng TC-LEADS-008
![TC-LEADS-008 - Tìm kiếm danh sách Lead không tồn tại](./assets/leads/TC-LEADS-008.png)

### Minh chứng TC-LEADS-009
![TC-LEADS-009 - Thông tin của Lead sau khi sửa](./assets/leads/TC-LEADS-009.1.png)
![TC-LEADS-009 - Sửa thông tin Lead thành công](./assets/leads/TC-LEADS-009.2.png)

### Minh chứng TC-LEADS-010
![TC-LEADS-010 - Chọn Lead chưa có phát sinh liên kết muốn xóa](./assets/leads/TC-LEADS-010.1.png)
![TC-LEADS-010 - Xác nhận xóa Lead thành công](./assets/leads/TC-LEADS-010.2.png)

### Minh chứng TC-LEADS-011
![TC-LEADS-011 - Chọn Lead đã có phát sinh liên kết muốn xóa](./assets/leads/TC-LEADS-011.1.png)
![TC-LEADS-011 - Xác nhận không cho phép xóa Lead](./assets/leads/TC-LEADS-011.2.png)

### Minh chứng TC-LEADS-012
![TC-LEADS-012 - Sales có quyền xem danh sách Leads đã phân công](./assets/leads/TC-LEADS-012.png)

### Minh chứng TC-LEADS-013
![TC-LEADS-013 - Sales xem chi tiết Lead](./assets/leads/TC-LEADS-013.png)

## UC3 - Chuyển đổi Lead thành Customer

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| TC-LEADS-014 | UC3 - Chuyển Lead thành Customer | Kiểm tra chuyển đổi thành công khi Lead đủ điều kiện | Sales đã đăng nhập.<br>Lead tồn tại.<br>Lead được phân công cho Sales hiện tại.<br>Trạng thái `Qualified`.<br>Lead chưa có Customer.<br>Có họ tên, phone và email. | Chọn Lead có đủ điều kiện chuyển đổi | 1. Sales mở danh sách Lead.<br>2. Chọn Lead đủ điều kiện.<br>3. Bấm `Chuyển đổi`.<br>4. Xác nhận thao tác. | Hệ thống tạo Customer mới.<br>Lead được cập nhật thành `Converted`.<br>Ghi Activity Log.<br>Hiển thị `"Chuyển Lead thành Customer thành công."` | Đã kiểm thử | PASS |
| TC-LEADS-015 | UC3 - Chuyển Lead thành Customer | Kiểm tra Sales không được chuyển Lead của Sales khác | Sales đã đăng nhập. | Không có dữ liệu đầu vào | 1. Đăng nhập Sales.<br>2. Vào danh sách Leads | Không hiện Lead trong danh sách | Đã kiểm thử | PASS |
| TC-LEADS-016 | UC3 - Chuyển Lead thành Customer | Kiểm tra Lead trạng thái `New` không được chuyển đổi | Sales đã đăng nhập.<br>Lead thuộc Sales hiện tại.<br>Lead có trạng thái `New`. | Chọn Lead có trạng thái `New` | 1. Chọn Lead trạng thái `New`.<br>2. Bấm `Chuyển đổi`.<br>3. Xác nhận. | Hiển thị `"Lead chưa đủ điều kiện để chuyển thành Customer."`.<br>Không tạo Customer. | Đã kiểm thử | PASS |
| TC-LEADS-017 | UC3 - Chuyển Lead thành Customer | Kiểm tra Lead trạng thái `Contacted` không được chuyển đổi | Sales đã đăng nhập.<br>Lead thuộc Sales hiện tại.<br>Lead có trạng thái `Contacted`. | Chọn Lead có trạng thái `Contacted` | 1. Chọn Lead `Contacted`.<br>2. Bấm `Chuyển đổi`.<br>3. Xác nhận. | Hiển thị `"Lead chưa đủ điều kiện để chuyển thành Customer."`.<br>Không tạo Customer. | Đã kiểm thử | PASS |
| TC-LEADS-018 | UC3 - Chuyển Lead thành Customer | Kiểm tra Lead trạng thái `Unqualified` không được chuyển đổi | Sales đã đăng nhập.<br>Lead thuộc Sales hiện tại.<br>Lead có trạng thái `Unqualified`. | Chọn Lead có trạng thái `Unqualified` | 1. Chọn Lead `Unqualified`.<br>2. Bấm `Chuyển đổi`.<br>3. Xác nhận. | Hiển thị `"Lead chưa đủ điều kiện để chuyển thành Customer."`.<br>Không tạo Customer. | Đã kiểm thử | PASS |
| TC-LEADS-019 | UC3 - Chuyển Lead thành Customer | Kiểm tra không cho chuyển Lead đã được chuyển đổi trước đó | Sales đã đăng nhập.<br>Lead có trạng thái `Converted` hoặc đã tồn tại Customer liên kết với Lead. | Không có dữ liệu đầu vào | 1. Sales đăng nhập.<br>2. Xem danh sách lead. | Hiển thị thông báo `Đã chuyển đổi` | Đã kiểm thử | PASS |
| TC-LEADS-020 | UC3 - Chuyển Lead thành Customer | Kiểm tra Lead thiếu số điện thoại | Sales đã đăng nhập.<br>Lead thuộc Sales hiện tại.<br>Trạng thái `Qualified`.<br>Có họ tên.<br>`phone = null`. | Chọn Lead không có phone | 1. Chọn Lead `Qualified` nhưng thiếu phone.<br>2. Bấm `Chuyển đổi`.<br>3. Xác nhận. | Hiển thị `"Lead phải có đầy đủ số điện thoại và email trước khi chuyển đổi."`.<br>Không tạo Customer. | Đã kiểm thử | PASS |
| TC-LEADS-021 | UC3 - Chuyển Lead thành Customer | Kiểm tra Lead thiếu email | Sales đã đăng nhập.<br>Lead thuộc Sales hiện tại.<br>Trạng thái `Qualified`.<br>Có họ tên.<br>`email = null`. | Chọn Lead không có email | 1. Chọn Lead `Qualified` nhưng thiếu email.<br>2. Bấm `Chuyển đổi`.<br>3. Xác nhận. | Hiển thị `"Lead phải có đầy đủ số điện thoại và email trước khi chuyển đổi."`.<br>Không tạo Customer. | Đã kiểm thử | PASS |

### Minh chứng TC-LEADS-014
![TC-LEADS-014 - Chuyển đổi Lead thành Customer thành công](./assets/leads/TC-LEADS-014.png)

### Minh chứng TC-LEADS-015
![TC-LEADS-015 - Sales không được phép chuyển đổi Lead của Sales khác](./assets/leads/TC-LEADS-015.png)

### Minh chứng TC-LEADS-016
![TC-LEADS-016 - Lead không được chuyển đổi nếu đang ở trạng thái New](./assets/leads/TC-LEADS-016.png)

### Minh chứng TC-LEADS-017
![TC-LEADS-017 - Lead không được chuyển đổi nếu đang ở trạng thái Contacted](./assets/leads/TC-LEADS-017.png)

### Minh chứng TC-LEADS-018
![TC-LEADS-018 - Lead không được chuyển đổi nếu đang ở trạng thái Unqualified](./assets/leads/TC-LEADS-018.png)

### Minh chứng TC-LEADS-019
![TC-LEADS-019 - Không được chuyển đổi Lead đã có trạng thái Converted](./assets/leads/TC-LEADS-019.png)

### Minh chứng TC-LEADS-020
![TC-LEADS-020 - Lead phải có cả số điện thoại và email thì mới được chuyển đổi](./assets/leads/TC-LEADS-020.png)

### Minh chứng TC-LEADS-021
![TC-LEADS-021 - Lead phải có cả số điện thoại và email thì mới được chuyển đổi](./assets/leads/TC-LEADS-021.png)