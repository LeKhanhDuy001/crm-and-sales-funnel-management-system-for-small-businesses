# Test Case - Quản lý Quote

## UC7 - Tạo và quản lý Quote

### Kỹ thuật thiết kế test áp dụng

- **Phân hoạch tương đương:** chia Deal, Product, Quantity và Quote thành các nhóm hợp lệ/không hợp lệ.
- **Phân tích giá trị biên:** kiểm tra giá trị ngay dưới biên tối thiểu và tại biên tối thiểu, ví dụ `dealId = 0` và `1`, `productId = 0` và `1`, `quantity = 0` và `1`.
- **Bảng quyết định:** áp dụng cho tổ hợp Role × quyền sở hữu Deal/Quote × Stage của Deal × trạng thái Quote.
- **Chuyển trạng thái:** kiểm tra `Draft → Confirmed`, `Draft → Cancelled` và các thao tác bị khóa sau khi rời Draft.

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| TC-QUOTE-001 | UC7 - Xem danh sách Quote | Kiểm tra Sales xem được danh sách Quote thuộc các Deal mình phụ trách | Sales đã đăng nhập; có ít nhất một Quote thuộc Deal của Sales | Không có dữ liệu đầu vào. | 1. Đăng nhập Sales; 2. Mở mục Quản lý báo giá | Hiển thị danh sách Quote; có Mã, Deal, Khách hàng, Ngày báo giá, Tổng tiền, Trạng thái và Thao tác | Sales mở được danh sách Quote thuộc các Deal mình phụ trách, các cột Mã, Deal, Khách hàng, Ngày báo giá, Tổng tiền, Trạng thái và Thao tác hiển thị đầy đủ | PASS |
| TC-QUOTE-002 | UC7 - Xem chi tiết Quote | Kiểm tra hiển thị đầy đủ chi tiết báo giá | Sales đã đăng nhập; có Quote thuộc quyền | Chọn một Quote đang tồn tại | 1. Mở Quản lý báo giá; 2. Nhấn `Chi tiết` | Hiển thị mã Quote, trạng thái, Deal, Khách hàng, Tổng tiền và danh sách sản phẩm gồm Sản phẩm, SL, Đơn giá, Thành tiền | Chi tiết Quote hiển thị đúng mã Quote, trạng thái, Deal, Khách hàng, Tổng tiền và danh sách sản phẩm với số lượng, đơn giá và thành tiền | PASS |
| TC-QUOTE-003 | UC7 - Danh sách rỗng | Kiểm tra giao diện khi Sales chưa có Quote | Sales đã đăng nhập; không có Quote thuộc Deal của Sales | Không có | 1. Đăng nhập Sales không có Quote; 2. Mở Quản lý báo giá | Hiển thị `Chưa có báo giá nào.`; giao diện không lỗi | Khi Sales chưa có Quote, giao diện hiển thị `Chưa có báo giá nào.` và không phát sinh lỗi | PASS |
| TC-QUOTE-004 | UC7 - Tạo Quote | Kiểm tra tạo Quote hợp lệ từ Deal Proposal | Sales đã đăng nhập; Deal thuộc Sales; Deal có Customer; Stage = Proposal; có Product active, giá > 0 | Chọn Deal Proposal; Product hợp lệ; Quantity = 2 | 1. Mở Quản lý báo giá; 2. Nhấn `+ Tạo báo giá`; 3. Chọn Deal Proposal; 4. Chọn Product; 5. Nhập SL = 2; 6. Nhấn `Tạo báo giá` | Hiển thị `Tạo báo giá thành công.`; tạo Quote trạng thái `Draft`; QuoteDetail được lưu; tổng tiền đúng; có Activity Log | Quote được tạo thành công từ Deal `Proposal`, trạng thái ban đầu là `Draft`, QuoteDetail được lưu đúng, tổng tiền được tính chính xác và hệ thống ghi Activity Log | PASS |
| TC-QUOTE-005 | UC7 - Tạo Quote | Kiểm tra tạo Quote hợp lệ từ Deal Negotiation | Sales đã đăng nhập; Deal thuộc Sales; Stage = Negotiation; có Customer và Product hợp lệ | Deal Negotiation; Product hợp lệ; Quantity = 2 | 1. Nhấn `+ Tạo báo giá`; 2. Chọn Deal Negotiation; 3. Chọn sản phẩm; 4. Nhấn `Tạo báo giá` | Quote được tạo thành công ở trạng thái `Draft` | Quote được tạo thành công từ Deal ở Stage `Negotiation` và có trạng thái ban đầu là `Draft` | PASS |
| TC-QUOTE-006 | UC7 - Tạo Quote | Kiểm tra Deal ngoài Proposal/Negotiation không xuất hiện trong form tạo Quote | Sales đã đăng nhập; có Deal của Sales ở Stage khác Proposal/Negotiation | Deal ở Lead/Qualified/Won/Lost hoặc Stage khác | 1. Mở `+ Tạo báo giá`; 2. Mở danh sách Deal | Deal không ở Proposal/Negotiation không xuất hiện trong danh sách lựa chọn | Danh sách Deal trong form tạo Quote chỉ hiển thị Deal ở `Proposal` hoặc `Negotiation`, các Stage khác không xuất hiện | PASS |
| TC-QUOTE-007 | UC7 - Tạo Quote  | Kiểm tra trường hợp không có Deal đủ điều kiện tạo Quote | Sales đã đăng nhập; không có Deal Proposal hoặc Negotiation | Không có | 1. Mở Quản lý báo giá; 2. Nhấn `+ Tạo báo giá` | Hiển thị `Không có Deal ở giai đoạn Proposal hoặc Negotiation.`; nút `Tạo báo giá` bị vô hiệu hóa | Khi không có Deal đủ điều kiện, giao diện hiển thị `Không có Deal ở giai đoạn Proposal hoặc Negotiation.` và nút tạo báo giá bị vô hiệu hóa | PASS |
| TC-QUOTE-008 | UC7 - Giá trị biên | Kiểm tra số lượng tối thiểu hợp lệ | Sales đã đăng nhập; Deal và Product hợp lệ | Quantity = 1 | 1. Tạo Quote; 2. Nhập số lượng = 1; 3. Lưu | Quote được tạo; QuoteDetail.quantity = 1; thành tiền = đơn giá × 1 | Quantity `1` được chấp nhận, Quote được tạo và QuoteDetail lưu `quantity = 1` với thành tiền bằng đúng đơn giá sản phẩm | PASS |
| TC-QUOTE-009 | UC7 - Giá trị biên | Kiểm tra không cho số lượng bằng 0 | Sales đã đăng nhập; Deal/Product hợp lệ | Quantity = 0 | 1. Mở form tạo Quote; 2. Nhập số lượng = 0; 3. Thử lưu | Không tạo Quote; hệ thống từ chối dữ liệu; số lượng phải lớn hơn 0 | Quantity `0` bị validation từ chối, Quote không được tạo và hệ thống yêu cầu số lượng phải lớn hơn 0 | PASS |
| TC-QUOTE-010 | UC7 - Tạo Quote | Kiểm tra không cho số lượng âm | Sales đã đăng nhập; Deal/Product hợp lệ | Quantity = -1 | 1. Mở Swagger POST /api/v1/quotes; 2. Nhập `-1`; 3. Thử lưu | Trả 400, Không tạo Quote; hiển thị `Số lượng sản phẩm phải lớn hơn 0.` | API trả HTTP 400 với Quantity `-1`, không tạo Quote và hiển thị `Số lượng sản phẩm phải lớn hơn 0.` | PASS |
| TC-QUOTE-011 | UC7 - Validate form | Kiểm tra Quote phải có ít nhất một sản phẩm | Sales đã đăng nhập; có Deal hợp lệ | `items = []` | 1. Gửi yêu cầu tạo Quote không có Product hoặc kiểm thử trực tiếp API; 2. Quan sát phản hồi | Không tạo Quote; thông báo `Báo giá phải có ít nhất một sản phẩm.` | Request với `items = []` bị từ chối, Quote không được tạo và hệ thống hiển thị `Báo giá phải có ít nhất một sản phẩm.` | PASS |
| TC-QUOTE-012 | UC7 - Validate form | Kiểm tra Deal ID không hợp lệ | Sales đã đăng nhập | `dealId = 0`; có ít nhất một item hợp lệ | 1. Mở Swagger POST /api/v1/quotes với dealId = 0; 2. Quan sát phản hồi | Không tạo Quote; thông báo `Deal không hợp lệ.` | `dealId = 0` bị hệ thống từ chối, Quote không được tạo và hiển thị `Deal không hợp lệ.` | PASS |
| TC-QUOTE-013 | UC7 - Validate form | Kiểm tra Product ID không hợp lệ | Sales đã đăng nhập; Deal hợp lệ | `productId = 0`, quantity = 1 | 1. Mở Swagger POST /api/v1/quotes; 2. nhập `productId = 0`, quantity = 1 3. Quan sát phản hồi | Không tạo Quote; thông báo `Sản phẩm không hợp lệ.` | `productId = 0` bị validation từ chối, Quote không được tạo và hệ thống hiển thị `Sản phẩm không hợp lệ.` | PASS |
| TC-QUOTE-014 | UC7 - Validate / Duplicate | Kiểm tra không cho thêm cùng một Product hai lần vào Quote | Sales đã đăng nhập; Deal và Product hợp lệ | Hai item có cùng `productId` | 1. Thêm hai dòng sản phẩm; 2. Chọn cùng một Product ở cả hai dòng; 3. Nhấn `Tạo báo giá` | Không tạo Quote; hiển thị `Mỗi sản phẩm chỉ được thêm một lần trong báo giá.` | Khi hai item có cùng Product, hệ thống từ chối tạo Quote và hiển thị `Mỗi sản phẩm chỉ được thêm một lần trong báo giá.` | PASS |
| TC-QUOTE-015 | UC7 - Tạo Quote | Kiểm tra tính thành tiền và tổng giá trị Quote | Sales đã đăng nhập; Deal hợp lệ; Product A giá 5.000.000; Product B giá 25.000.000 | Product A × 2; Product B × 1 | 1. Tạo Quote; 2. Chọn A SL 2; 3. Thêm B SL 1; 4. Kiểm tra Tổng dự kiến; 5. Lưu; 6. Mở Chi tiết | A = 10.000.000; B = 25.000.000; tổng Quote = 35.000.000; giá lưu khớp giá Product trong DB | Hệ thống tính Product A = `10.000.000`, Product B = `25.000.000`, tổng Quote = `35.000.000` và giá lưu khớp dữ liệu Product | PASS |
| TC-QUOTE-016 | UC7 - Tạo Quote | Kiểm tra Product ngừng hoạt động không được dùng trong Quote | Có Product `status = false` trong DB | "productId": 22, "quantity": 1 | 1. Mở Swagger POST /api/v1/quotes; 2. Nhập "productId": 22, "quantity": 1; 3. Kiểm tra thông báo | Hiển thị `{Sản phẩn} đã ngừng hoạt động hoặc có giá không hợp lệ.` | Product ID `22` đang ngừng hoạt động bị từ chối khi tạo Quote và hệ thống hiển thị thông báo sản phẩm đã ngừng hoạt động hoặc có giá không hợp lệ | PASS |
| TC-QUOTE-017 | UC7 - Tạo Quote | Kiểm tra Product có giá không hợp lệ không được dùng trong Quote | Có Product giá <= 0 trong dữ liệu kiểm thử | Product giá 0 hoặc âm | 1. Mở form tạo Quote; 2. Kiểm tra danh sách Product | Product có giá <= 0 không xuất hiện trong danh sách lựa chọn | Product có giá bằng 0 hoặc âm không xuất hiện trong danh sách lựa chọn khi tạo Quote | PASS |
| TC-QUOTE-018 | UC7 - Record Permission | Kiểm tra Deal của Sales khác không xuất hiện trong form Quote | Sales A đăng nhập; tồn tại Deal Proposal thuộc Sales B | Deal thuộc Sales B | 1. Sales A mở `+ Tạo báo giá`; 2. Kiểm tra danh sách Deal | Deal của Sales B không xuất hiện | Form tạo Quote của Sales A không hiển thị Deal Proposal thuộc Sales B | PASS |
| TC-QUOTE-019 | UC7 - Record Permission | Kiểm tra server chặn tạo Quote cho Deal của Sales khác | Sales A đăng nhập; biết ID Deal Proposal thuộc Sales B | POST `/quotes`; body chứa `dealId` của Sales B và item hợp lệ | 1. Gửi request bằng token Sales A; 2. Quan sát response | HTTP 422; không tạo Quote; thông báo `Deal không tồn tại, không có Customer hợp lệ hoặc bạn không có quyền tạo báo giá cho Deal này.` | Server trả HTTP 422 khi Sales A tạo Quote cho Deal của Sales B, không tạo Quote và không để lộ dữ liệu ngoài quyền | PASS |
| TC-QUOTE-020 | UC7 - Sửa Quote | Kiểm tra sửa Quote Draft thành công | Sales đăng nhập; Quote thuộc Sales; status = Draft | Thay đổi Product hoặc Quantity | 1. Chọn Quote Draft; 2. Nhấn `Sửa`; 3. Thay đổi sản phẩm/số lượng; 4. Nhấn `Lưu thay đổi` | Hiển thị `Cập nhật báo giá thành công.`; QuoteDetail và tổng tiền được tính lại; có Activity Log | Quote `Draft` được cập nhật thành công, QuoteDetail và tổng tiền được tính lại đúng và hệ thống ghi Activity Log | PASS |
| TC-QUOTE-021 | UC7 - Xác nhận Quote | Kiểm tra xác nhận Quote Draft | Sales đăng nhập; Quote thuộc Sales; status = Draft | Quote Draft | 1. Nhấn `Xác nhận`; 2. Hộp thoại hiện cảnh báo; 3. Đồng ý | Hiển thị `Xác nhận báo giá thành công.`; status chuyển từ Draft sang Confirmed; ghi Activity Log | Quote `Draft` được xác nhận thành công, trạng thái chuyển sang `Confirmed` và hệ thống ghi Activity Log | PASS |
| TC-QUOTE-022 | UC7 - State Transition | Kiểm tra Quote Confirmed bị khóa trên UI | Sales đăng nhập; Quote status = Confirmed | Quote Confirmed | 1. Mở danh sách Quote; 2. Quan sát cột Thao tác | Chỉ còn nút `Chi tiết`; không có `Sửa`, `Xác nhận`, `Xóa` | Quote `Confirmed` chỉ còn thao tác `Chi tiết`, các nút `Sửa`, `Xác nhận` và `Xóa` không còn hiển thị | PASS |
| TC-QUOTE-023 | UC7 | Kiểm tra backend chặn sửa Quote Confirmed | Sales đăng nhập; Quote thuộc Sales; status = Confirmed | PATCH `/quotes/{id}` với items hợp lệ | 1. Gửi PATCH trực tiếp đến Quote Confirmed; 2. Quan sát response | HTTP 422; dữ liệu Quote không đổi; thông báo `Chỉ báo giá ở trạng thái Bản nháp mới được thực hiện thao tác này.` | Backend trả HTTP 422 khi sửa Quote `Confirmed`, dữ liệu Quote giữ nguyên và hiển thị thông báo chỉ Quote ở trạng thái Bản nháp mới được thao tác | PASS |
| TC-QUOTE-024 | UC7 State Transition | Kiểm tra hủy Quote Draft | Sales đăng nhập; Quote thuộc Sales; status = Draft | Quote Draft | 1. Nhấn `Xóa`; 2. Hệ thống hỏi xác nhận; 3. Đồng ý | Hiển thị `Hủy báo giá thành công.`; status chuyển sang Cancelled; Quote vẫn tồn tại trong DB; ghi Activity Log | Quote `Draft` được hủy thành công, trạng thái chuyển sang `Cancelled`, record vẫn tồn tại trong database và hệ thống ghi Activity Log | PASS |
| TC-QUOTE-025 | UC7 - Xóa Quote | Kiểm tra Quote Cancelled bị khóa | Sales đăng nhập; Quote status = Cancelled | Quote Cancelled | 1. Mở danh sách báo giá; 2. Quan sát thao tác | Quote vẫn hiển thị; trạng thái `Đã hủy`; chỉ có `Chi tiết`; không có Sửa/Xác nhận/Xóa | Quote `Cancelled` vẫn hiển thị trong danh sách với trạng thái `Đã hủy` và chỉ còn thao tác `Chi tiết` | PASS |
| TC-QUOTE-026 | UC7 - Xóa Quote | Kiểm tra backend không cho hủy Quote Confirmed | Sales đăng nhập; Quote thuộc Sales; status = Confirmed | PATCH `/quotes/{id}/cancel` | 1. Gửi request hủy Quote Confirmed; 2. Quan sát response | HTTP 422; Quote vẫn Confirmed; thông báo `Chỉ báo giá ở trạng thái Bản nháp mới được thực hiện thao tác này.` | Backend trả HTTP 422 khi hủy Quote `Confirmed`, trạng thái Quote giữ nguyên và hiển thị thông báo chỉ Quote ở trạng thái Bản nháp mới được thao tác | PASS |
| TC-QUOTE-027 | Record-level Permission | Kiểm tra Sales không xem được Quote của Sales khác | Sales A đăng nhập; Quote thuộc Deal của Sales B | GET `/quotes/{quoteId-của-Sales-B}` | 1. Gửi request bằng token Sales A; 2. Quan sát response | HTTP 404; thông báo `Không tìm thấy báo giá.`; không lộ dữ liệu Quote của Sales B | Sales A truy cập Quote của Sales B bị trả HTTP 404, hệ thống không trả và không làm lộ dữ liệu Quote ngoài quyền | PASS |
| TC-QUOTE-028 | Phân quyền Quote | Kiểm tra Admin không được truy cập API Quote của Sales | Admin đã đăng nhập | GET `/quotes` bằng token Admin | 1. Gửi request GET `/quotes`; 2. Quan sát response | HTTP 403; hiển thỉ `Bạn không có quyền truy cập chức năng này.` | Admin gọi API Quote bị từ chối với HTTP 403 và không nhận dữ liệu Quote | PASS |
| TC-QUOTE-029 | Phân quyền Quote | Kiểm tra Sales Manager không được truy cập API Quote | Sales Manager đã đăng nhập | GET `/quotes` bằng token Admin | 1. Gửi request bằng token Sales Manager; 2. Quan sát response | HTTP 403; hiển thỉ `Bạn không có quyền truy cập chức năng này.` | Sales Manager gọi API Quote bị từ chối với HTTP 403 và không được trả dữ liệu Quote | PASS |
| TC-QUOTE-030 | Phân quyền Quote | Kiểm tra Marketing không được truy cập API Quote | Marketing đã đăng nhập | GET `/quotes` bằng token Admin | 1. Gửi request bằng token Marketing; 2. Quan sát response | HTTP 403; hiển thỉ `Bạn không có quyền truy cập chức năng này.` | Marketing truy cập API Quote bị từ chối với HTTP 403 và không được trả danh sách Quote | PASS |
| TC-QUOTE-031 | Phân quyền Quote | Kiểm tra Customer Care không được truy cập API Quote | Customer Care đã đăng nhập | GET `/quotes` bằng token Admin | 1. Gửi request bằng token Customer Care; 2. Quan sát response | HTTP 403; hiển thỉ `Bạn không có quyền truy cập chức năng này.` | Customer Care gọi API Quote bị từ chối với HTTP 403 và không nhận dữ liệu Quote | PASS |
| TC-QUOTE-032 | Xác thực Quote | Kiểm tra không có access token | Người dùng chưa đăng nhập | GET `/quotes`, không có Authorization header | 1. Gửi request không có token; 2. Quan sát response | HTTP 401; hiển thỉ `Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.` | Request không có access token trả HTTP 401 và hệ thống không trả dữ liệu Quote | PASS |
| TC-QUOTE-033 | UC7 / BR11 - Tạo Quote | Kiểm tra không thể tạo Quote cho Deal không tồn tại | Sales đã đăng nhập, có Product hợp lệ | dealId = 999, Product hợp lệ, quantity = 1 | 1. Mở Swagger, 2. Gọi POST /api/v1/quotes, 3. Nhập Deal ID không tồn tại, 4. Execute | HTTP 422, không tạo Quote, thông báo Deal không tồn tại, không có Customer hợp lệ hoặc không có quyền | API trả HTTP 422 với `dealId = 999`, Quote không được tạo và hệ thống hiển thị thông báo Deal không tồn tại, không có Customer hợp lệ hoặc không có quyền | PASS |

### Minh chứng TC-QUOTE-001
![TC-QUOTE-001 - Xem danh sách Quote](./assets/quotes/TC-QUOTE-001.png)

### Minh chứng TC-QUOTE-002
![TC-QUOTE-002 - Xem chi tiết báo giá](./assets/quotes/TC-QUOTE-002.png)

### Minh chứng TC-QUOTE-003
![TC-QUOTE-003 - Sales chưa có Quote nào](./assets/quotes/TC-QUOTE-003.png)

### Minh chứng TC-QUOTE-004
![TC-QUOTE-004 - Kiểm tra tạo Quote hợp lệ từ Deal Proposal](./assets/quotes/TC-QUOTE-004.png)

### Minh chứng TC-QUOTE-005
![TC-QUOTE-005 - Kiểm tra tạo Quote hợp lệ từ Deal Negotiation](./assets/quotes/TC-QUOTE-005.png)

### Minh chứng TC-QUOTE-006
![TC-QUOTE-006 - Không hiển thị Deal không phải là Proposal/Negotiation](./assets/quotes/TC-QUOTE-006.1.png)
![TC-QUOTE-006 - Không hiển thị Deal không phải là Proposal/Negotiation](./assets/quotes/TC-QUOTE-006.2.png)

### Minh chứng TC-QUOTE-007
![TC-QUOTE-007 - Không có Deal đủ điều kiện tạo Quote](./assets/quotes/TC-QUOTE-007.png)

### Minh chứng TC-QUOTE-008
![TC-QUOTE-008 - Kiểm tra số lượng sản phẩm tối thiểu](./assets/quotes/TC-QUOTE-008.png)

### Minh chứng TC-QUOTE-009
![TC-QUOTE-009 - Số lượng sản phẩm không được bằng 0](./assets/quotes/TC-QUOTE-009.png)

### Minh chứng TC-QUOTE-010
![TC-QUOTE-010 - Số lượng sản phẩm không được âm](./assets/quotes/TC-QUOTE-010.png)

### Minh chứng TC-QUOTE-011
![TC-QUOTE-011 - Tạo Quote phải có ít nhất 1 sản phẩm](./assets/quotes/TC-QUOTE-011.png)

### Minh chứng TC-QUOTE-012
![TC-QUOTE-012 - Tạo Quote có Deal không hợp lệ](./assets/quotes/TC-QUOTE-012.png)

### Minh chứng TC-QUOTE-013
![TC-QUOTE-013 - Tạo Quote có Product không hợp lệ](./assets/quotes/TC-QUOTE-013.png)

### Minh chứng TC-QUOTE-014
![TC-QUOTE-014 - Một sản phẩm không được thêm 2 lần](./assets/quotes/TC-QUOTE-014.png)

### Minh chứng TC-QUOTE-015
![TC-QUOTE-015 - Kiểm tra tính tiền](./assets/quotes/TC-QUOTE-015.png)

### Minh chứng TC-QUOTE-016
![TC-QUOTE-016 - Quote không được thêm Product ngừng hoạt động](./assets/quotes/TC-QUOTE-016.png)

### Minh chứng TC-QUOTE-017
![TC-QUOTE-017 - Kiểm tra Product phải có giá trị hợp lệ](./assets/quotes/TC-QUOTE-017.png)

### Minh chứng TC-QUOTE-018
![TC-QUOTE-018 - Deal của Sales khác không được xuất hiện trong danh sách](./assets/quotes/TC-QUOTE-018.png)

### Minh chứng TC-QUOTE-019
![TC-QUOTE-019 - Không được tạo Quote cho Deal của Sales khác](./assets/quotes/TC-QUOTE-019.png)

### Minh chứng TC-QUOTE-020
![TC-QUOTE-020 - Sửa Quote Draft thành công](./assets/quotes/TC-QUOTE-020.png)

### Minh chứng TC-QUOTE-021
![TC-QUOTE-021 - Xác nhận Quote Draft](./assets/quotes/TC-QUOTE-021.png)

### Minh chứng TC-QUOTE-022
![TC-QUOTE-022 - Quote Confirmed bị khóa trên UI](./assets/quotes/TC-QUOTE-022.png)

### Minh chứng TC-QUOTE-023
![TC-QUOTE-023 - Chặn sửa trạng thái Quote Confirmed](./assets/quotes/TC-QUOTE-023.png)

### Minh chứng TC-QUOTE-024
![TC-QUOTE-024 - Hủy Quote Draft](./assets/quotes/TC-QUOTE-024.png)

### Minh chứng TC-QUOTE-025
![TC-QUOTE-025 - Quote Cancelled bị khóa](./assets/quotes/TC-QUOTE-025.png)

### Minh chứng TC-QUOTE-026
![TC-QUOTE-026 - không cho xóa Quote Confirmed](./assets/quotes/TC-QUOTE-026.png)

### Minh chứng TC-QUOTE-027
![TC-QUOTE-027 - Sales không xem được Quote của Sales khác](./assets/quotes/TC-QUOTE-027.png)

### Minh chứng TC-QUOTE-028
![TC-QUOTE-028 - Admin không được truy cập API Quote của Sales](./assets/quotes/TC-QUOTE-028.png)

### Minh chứng TC-QUOTE-029
![TC-QUOTE-029 - Sales Manager không được truy cập API Quote](./assets/quotes/TC-QUOTE-029.png)

### Minh chứng TC-QUOTE-030
![TC-QUOTE-030 - Marketing không được truy cập API Quote](./assets/quotes/TC-QUOTE-030.png)

### Minh chứng TC-QUOTE-031
![TC-QUOTE-031 - Customer Care không được truy cập API Quote](./assets/quotes/TC-QUOTE-031.png)

### Minh chứng TC-QUOTE-032
![TC-QUOTE-032 - Sales chưa đăng nhập](./assets/quotes/TC-QUOTE-032.png)

### Minh chứng TC-QUOTE-033
![TC-QUOTE-033 - Không thể tạo Quote cho Deal không tồn tại](./assets/quotes/TC-QUOTE-033.png)