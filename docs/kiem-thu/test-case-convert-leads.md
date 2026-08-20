# Test Case - Chức năng chuyển Lead thành Customer

## UC3: Chuyển Lead thành Customer

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| CONV-001 | UC3 - Chuyển Lead thành Customer | Kiểm tra chuyển đổi thành công khi Lead đủ điều kiện | Sales đã đăng nhập.<br>Lead tồn tại.<br>Lead được phân công cho Sales hiện tại.<br>Trạng thái `Qualified`.<br>Lead chưa có Customer.<br>Có họ tên và ít nhất phone hoặc email. | Chọn Lead có đủ điều kiện chuyển đổi | 1. Sales mở danh sách Lead.<br>2. Chọn Lead đủ điều kiện.<br>3. Bấm `Chuyển đổi`.<br>4. Xác nhận thao tác. | Hệ thống tạo Customer mới.<br>Lead được cập nhật thành `Converted`.<br>Ghi Activity Log.<br>Hiển thị `"Chuyển Lead thành Customer thành công."` | Chưa kiểm thử | Chưa test |
| CONV-002 | UC3 - Chuyển Lead thành Customer | Kiểm tra Sales không được chuyển Lead của Sales khác | Sales đã đăng nhập. | Không có dữ liệu đầu vào | 1. Đăng nhập Sales.<br>2. Vào danh sách Leads | Không hiện Lead trong danh sách | Đã kiểm thử | PASS |
| CONV-003 | UC3 - Chuyển Lead thành Customer | Kiểm tra Lead trạng thái `New` không được chuyển đổi | Sales đã đăng nhập.<br>Lead thuộc Sales hiện tại.<br>Lead có trạng thái `New`. | Chọn Lead có trạng thái `New` | 1. Chọn Lead trạng thái `New`.<br>2. Bấm `Chuyển đổi`.<br>3. Xác nhận. | Hiển thị `"Lead chưa đủ điều kiện để chuyển thành Customer."`.<br>Không tạo Customer. | Đã kiểm thử | PASS |
| CONV-004 | UC3 - Chuyển Lead thành Customer | Kiểm tra Lead trạng thái `Contacted` không được chuyển đổi | Sales đã đăng nhập.<br>Lead thuộc Sales hiện tại.<br>Lead có trạng thái `Contacted`. | Chọn Lead có trạng thái `Contacted` | 1. Chọn Lead `Contacted`.<br>2. Bấm `Chuyển đổi`.<br>3. Xác nhận. | Hiển thị `"Lead chưa đủ điều kiện để chuyển thành Customer."`.<br>Không tạo Customer. | Đã kiểm thử | PASS |
| CONV-005 | UC3 - Chuyển Lead thành Customer | Kiểm tra Lead trạng thái `Unqualified` không được chuyển đổi | Sales đã đăng nhập.<br>Lead thuộc Sales hiện tại.<br>Lead có trạng thái `Unqualified`. | Chọn Lead có trạng thái `Unqualified` | 1. Chọn Lead `Unqualified`.<br>2. Bấm `Chuyển đổi`.<br>3. Xác nhận. | <br>Hiển thị `"Lead chưa đủ điều kiện để chuyển thành Customer."`.<br>Không tạo Customer. | Chưa kiểm thử | Chưa test |
| CONV-006 | UC3 - Chuyển Lead thành Customer | Kiểm tra không cho chuyển Lead đã được chuyển đổi trước đó | Sales đã đăng nhập.<br>Lead có trạng thái `Converted` hoặc đã tồn tại Customer liên kết với Lead. | Không có dữ liệu đầu vào | 1. Sales đăng nhập.<br>2. Xem danh sách lead. | Hiển thị thông báo `Đã chuyển đối` | Đã kiểm thử | PASS |
| CONV-007 | UC3 - Chuyển Lead thành Customer | Kiểm tra Lead thiếu cả số điện thoại và email | Sales đã đăng nhập.<br>Lead thuộc Sales hiện tại.<br>Trạng thái `Qualified`.<br>Có họ tên.<br>`phone = null`.<br>`email = null`. | Chọn Lead không có phone hoặc email | 1. Chọn Lead `Qualified` nhưng thiếu phone và email.<br>2. Bấm `Chuyển đổi`.<br>3. Xác nhận. | <br>Hiển thị `"Lead phải có số điện thoại hoặc email trước khi chuyển đổi."`.<br>Không tạo Customer. | Chưa kiểm thử | Chưa test |

### Minh chứng CONV-001
![CONV-001 - Chuyển đổi Lead thành Customer thành công] Chưa tạo dữ liệu phù hợp

### Minh chứng CONV-002
![CONV-002 - Sales không được phép chuyển đổi Lead của Sales khác](./assets/convet-leads-into-customer/conv-002-no-permission-to-convert.png)

### Minh chứng CONV-003
![CONV-003 - Lead không được chuyển đổi nếu đang ở trạng thái New](./assets/convet-leads-into-customer/conv-003-new-status.png)

### Minh chứng CONV-004
![CONV-004 - Lead không được chuyển đổi nếu đang ở trạng thái Contacted](./assets/convet-leads-into-customer/conv-004-contacted-status.png)

### Minh chứng CONV-005
![CONV-005 - Lead không được chuyển đổi nếu đang ở trạng thái Unqualified]Chưa tạo dữ liệu phù hợp

### Minh chứng CONV-006
![CONV-006 - Không được chuyển đổi Lead đã có trạng thái Converted](./assets/convet-leads-into-customer/conv-006-converted-status.png)

### Minh chứng CONV-007
![CONV-007 - Lead thiếu ít nhất số điện thoại hoặc email thì không được chuyển đổi]Chưa tạo dữ liệu phù hợp