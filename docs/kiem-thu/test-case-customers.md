# TEST CASE - QUẢN LÝ CUSTOMER

## UC13 - Quản lý Customer

### Kỹ thuật thiết kế test áp dụng

- **Phân vùng tương đương**: chia dữ liệu thành các nhóm hợp lệ và không hợp lệ đối với thông tin Customer, tìm kiếm và quyền truy cập.
- **Phân tích giá trị biên**: kiểm tra các giới hạn độ dài như họ tên 100/101 ký tự và limit 100/101.
- **Bảng quyết định**: kiểm tra quyền truy cập Customer theo từng vai trò.
- **Kiểm thử quyền truy cập theo từng bản ghi**: kiểm tra Sales chỉ được xem và cập nhật Customer liên quan đến Lead hoặc Deal do Sales đó phụ trách.
- **Kiểm thử dữ liệu không hợp lệ**: kiểm tra dữ liệu sai định dạng, dữ liệu vượt giới hạn, Customer không tồn tại và request không có token.

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| TC-CUSTOMER-001 | UC13 - Danh sách Customer | Kiểm tra Sales xem được danh sách Customer thuộc quyền | Sales A đã đăng nhập; tồn tại Customer liên quan Lead/Deal của Sales A và Customer của Sales khác | Không có | 1. Đăng nhập Sales A; 2. Mở chức năng Quản lý Customer; 3. Quan sát danh sách | Chỉ hiển thị Customer liên quan đến Lead hoặc Deal do Sales A phụ trách; không hiển thị Customer ngoài quyền | Danh sách chỉ hiển thị các Customer liên quan Lead hoặc Deal của Sales A, không xuất hiện Customer ngoài quyền | PASS |
| TC-CUSTOMER-002 | UC13 - Danh sách Customer | Kiểm tra Customer Care xem được toàn bộ Customer | Customer Care đã đăng nhập; hệ thống có nhiều Customer | Không có | 1. Đăng nhập Customer Care; 2. Mở chức năng Quản lý Customer; 3. Quan sát danh sách | Hiển thị toàn bộ Customer trong hệ thống | Customer Care mở được danh sách và xem toàn bộ Customer hiện có trong hệ thống | PASS |
| TC-CUSTOMER-003 | UC13 - Tìm kiếm | Kiểm tra tìm Customer theo họ tên | Có Customer có họ tên phù hợp | Từ khóa thuộc họ tên Customer | 1. Mở Quản lý Customer; 2. Nhập từ khóa họ tên; 3. Nhấn Tìm kiếm | Hiển thị các Customer có họ tên phù hợp và vẫn tuân thủ quyền record | Kết quả tìm kiếm trả đúng Customer có họ tên chứa từ khóa và vẫn giới hạn theo quyền của user | PASS |
| TC-CUSTOMER-004 | UC13 - Tìm kiếm | Kiểm tra tìm Customer theo công ty | Có Customer có tên công ty phù hợp | Từ khóa thuộc tên công ty | 1. Nhập từ khóa tên công ty; 2. Nhấn Tìm kiếm | Hiển thị các Customer có tên công ty phù hợp | Danh sách sau tìm kiếm chỉ hiển thị Customer có tên công ty phù hợp với từ khóa đã nhập | PASS |
| TC-CUSTOMER-005 | UC13 - Tìm kiếm | Kiểm tra tìm Customer theo email | Có Customer có email phù hợp | Email hoặc một phần email | 1. Nhập email; 2. Nhấn Tìm kiếm | Hiển thị các Customer có email phù hợp | Kết quả trả về đúng Customer có email chứa giá trị tìm kiếm | PASS |
| TC-CUSTOMER-006 | UC13 - Tìm kiếm | Kiểm tra tìm Customer theo số điện thoại | Có Customer có số điện thoại phù hợp | Số điện thoại hoặc một phần số điện thoại | 1. Nhập số điện thoại; 2. Nhấn Tìm kiếm | Hiển thị các Customer có số điện thoại phù hợp | Kết quả tìm kiếm hiển thị đúng Customer có số điện thoại phù hợp với dữ liệu nhập | PASS |
| TC-CUSTOMER-007 | UC13 - Tìm kiếm | Kiểm tra trường hợp tìm kiếm không có kết quả | Không có Customer khớp từ khóa | Từ khóa không tồn tại | 1. Nhập từ khóa không tồn tại; 2. Nhấn Tìm kiếm | Hiển thị trạng thái danh sách rỗng phù hợp; không phát sinh lỗi hệ thống | Với từ khóa không tồn tại, danh sách không trả Customer và giao diện hiển thị trạng thái không có dữ liệu | PASS |
| TC-CUSTOMER-008 | UC13 - Chi tiết Customer | Kiểm tra Sales xem chi tiết Customer thuộc quyền | Sales đã đăng nhập; Customer liên quan đến Lead hoặc Deal của Sales | Customer hợp lệ | 1. Mở danh sách Customer; 2. Chọn Chi tiết Customer | Hiển thị đúng mã Customer, họ tên, công ty, số điện thoại, email, địa chỉ và loại khách hàng | Chi tiết Customer thuộc quyền hiển thị đầy đủ mã, họ tên, công ty, số điện thoại, email, địa chỉ và loại khách hàng | PASS |
| TC-CUSTOMER-009 | UC13 - Chi tiết Customer | Kiểm tra Customer Care xem chi tiết Customer | Customer Care đã đăng nhập; Customer tồn tại | Customer hợp lệ | 1. Mở danh sách Customer; 2. Chọn một Customer; 3. Xem chi tiết | Hiển thị đầy đủ và đúng thông tin Customer | Customer Care xem được chi tiết Customer và các thông tin hiển thị khớp dữ liệu của bản ghi đã chọn | PASS |
| TC-CUSTOMER-010 | UC13 / Record Permission | Kiểm tra Sales không xem được Customer ngoài quyền qua API | Sales A đã đăng nhập; biết `customerId` của Customer chỉ liên quan Sales B | `GET /api/v1/customers/{id}` với ID Customer ngoài quyền | 1. Mở Swagger; 2. Authorize bằng token Sales A; 3. Gọi `GET /api/v1/customers/{id}` với Customer ngoài quyền; 4. Execute | HTTP 404; hiển thị `Không tìm thấy Customer hoặc bạn không có quyền truy cập Customer này.`; không trả dữ liệu Customer ngoài quyền | API trả HTTP 404 khi Sales A truy cập Customer ngoài quyền và không trả dữ liệu Customer của Sales B | PASS |
| TC-CUSTOMER-011 | UC13 - Cập nhật Customer | Kiểm tra Sales cập nhật Customer thuộc quyền thành công | Sales đã đăng nhập; Customer thuộc quyền Sales | Dữ liệu cập nhật hợp lệ | 1. Mở Customer thuộc quyền; 2. Chọn Sửa; 3. Thay đổi thông tin; 4. Nhấn Lưu | Hiển thị `Cập nhật Customer thành công.`; dữ liệu Customer được cập nhật; Activity Log ghi nhận thao tác Update | Sales cập nhật Customer thuộc quyền thành công, dữ liệu mới được lưu và hệ thống ghi Activity Log `Update` | PASS |
| TC-CUSTOMER-012 | UC13 - Cập nhật Customer | Kiểm tra Customer Care cập nhật Customer thành công | Customer Care đã đăng nhập; Customer tồn tại | Dữ liệu cập nhật hợp lệ | 1. Mở Customer; 2. Chọn Sửa; 3. Thay đổi thông tin; 4. Nhấn Lưu | Hiển thị `Cập nhật Customer thành công.`; dữ liệu được cập nhật; Activity Log ghi nhận thao tác Update | Customer Care cập nhật Customer thành công, dữ liệu thay đổi được lưu và có Activity Log `Update` | PASS |
| TC-CUSTOMER-013 | UC13 / Record Permission | Kiểm tra Sales không sửa Customer ngoài quyền | Sales A đã đăng nhập; biết `customerId` của Customer chỉ liên quan Sales B | Dữ liệu cập nhật hợp lệ | 1. Mở Swagger; 2. Authorize bằng token Sales A; 3. Gọi `PATCH /api/v1/customers/{id}` với Customer ngoài quyền; 4. Gửi dữ liệu cập nhật hợp lệ; 5. Execute | HTTP 404; hiển thị `Không tìm thấy Customer hoặc bạn không có quyền truy cập Customer này.`; dữ liệu Customer không thay đổi | API trả HTTP 404 khi Sales A cập nhật Customer ngoài quyền và dữ liệu Customer không bị thay đổi | PASS |
| TC-CUSTOMER-014 | UC13 - Validate form | Kiểm tra request cập nhật không có dữ liệu | Có Customer thuộc quyền; có token hợp lệ | Body `{}` | 1. Mở Swagger; 2. Authorize; 3. Gọi `PATCH /api/v1/customers/{id}`; 4. Gửi body `{}`; 5. Execute | HTTP 400; hiển thị `Không có dữ liệu Customer cần cập nhật.`; dữ liệu Customer không thay đổi | Gửi body `{}` bị API từ chối với HTTP 400, hiển thị thông báo không có dữ liệu cần cập nhật và bản ghi giữ nguyên | PASS |
| TC-CUSTOMER-015 | UC13 - Validate form | Kiểm tra họ tên Customer không được để trống | Có Customer thuộc quyền; có token hợp lệ | `fullName = ""` | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/customers/{id}`; 3. Gửi `fullName` rỗng; 4. Execute | HTTP 400; hiển thị `Họ tên không được để trống.`; dữ liệu Customer không thay đổi | API trả HTTP 400 khi `fullName` rỗng, hiển thị lỗi họ tên không được để trống và không cập nhật Customer | PASS |
| TC-CUSTOMER-016 | UC13 - Giá trị biên | Kiểm tra họ tên đúng giới hạn 100 ký tự | Có Customer thuộc quyền; có token hợp lệ | `fullName` dài đúng 100 ký tự | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/customers/{id}`; 3. Gửi `fullName` 100 ký tự; 4. Execute | Request được chấp nhận; cập nhật Customer thành công | `fullName` đúng 100 ký tự được chấp nhận và Customer được cập nhật thành công | PASS |
| TC-CUSTOMER-017 | UC13 - Giá trị biên | Kiểm tra họ tên vượt quá 100 ký tự | Có Customer thuộc quyền; có token hợp lệ | `fullName` dài 101 ký tự | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/customers/{id}`; 3. Gửi `fullName` 101 ký tự; 4. Execute | HTTP 400; hiển thị `Họ tên tối đa 100 ký tự.`; không cập nhật Customer | `fullName` 101 ký tự bị API từ chối với HTTP 400 và Customer không bị cập nhật | PASS |
| TC-CUSTOMER-018 | UC13 - Giá trị biên | Kiểm tra tên công ty vượt quá 150 ký tự | Có Customer thuộc quyền; có token hợp lệ | `company` dài 151 ký tự | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/customers/{id}`; 3. Gửi company 151 ký tự; 4. Execute | HTTP 400; hiển thị `Tên công ty tối đa 150 ký tự.`; không cập nhật Customer | `company` 151 ký tự bị validation từ chối với HTTP 400 và dữ liệu Customer giữ nguyên | PASS |
| TC-CUSTOMER-019 | UC13 - Giá trị biên | Kiểm tra số điện thoại vượt quá 20 ký tự | Có Customer thuộc quyền; có token hợp lệ | `phone` dài 21 ký tự | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/customers/{id}`; 3. Gửi phone 21 ký tự; 4. Execute | HTTP 400; hiển thị `Số điện thoại tối đa 20 ký tự.`; không cập nhật Customer | `phone` 21 ký tự bị API từ chối với HTTP 400 và không cập nhật bản ghi Customer | PASS |
| TC-CUSTOMER-020 | UC13 - Validate form | Kiểm tra email sai định dạng | Có Customer thuộc quyền; có token hợp lệ | `email = "abc"` | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/customers/{id}`; 3. Gửi email `abc`; 4. Execute | HTTP 400; hiển thị `Email không đúng định dạng.`; không cập nhật Customer | Email `abc` bị từ chối với HTTP 400 do sai định dạng và dữ liệu Customer không thay đổi | PASS |
| TC-CUSTOMER-021 | UC13 - Giá trị biên | Kiểm tra loại khách hàng vượt quá 50 ký tự | Có Customer thuộc quyền; có token hợp lệ | `customerType` dài 51 ký tự | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/customers/{id}`; 3. Gửi `customerType` 51 ký tự; 4. Execute | HTTP 400; hiển thị `Loại khách hàng tối đa 50 ký tự.`; không cập nhật Customer | `customerType` 51 ký tự bị validation từ chối với HTTP 400 và Customer không được cập nhật | PASS |
| TC-CUSTOMER-022 | UC13 - Chuẩn hóa dữ liệu | Kiểm tra hệ thống trim dữ liệu và chuyển email về chữ thường | Có Customer thuộc quyền; có token hợp lệ | `fullName = "  Nguyễn Văn A  "`; email có chữ hoa và khoảng trắng | 1. Mở Swagger; 2. PATCH Customer với dữ liệu có khoảng trắng và email chữ hoa; 3. Execute; 4. Kiểm tra lại Customer | Cập nhật thành công; họ tên được loại bỏ khoảng trắng thừa ở đầu/cuối; email được trim và chuyển về chữ thường | Customer được cập nhật thành công, `fullName` được trim khoảng trắng và email được lưu ở dạng chữ thường | PASS |
| TC-CUSTOMER-023 | UC13 - Cập nhật Customer | Kiểm tra có thể xóa dữ liệu của trường không bắt buộc | Customer đang có company, phone, email, address hoặc customerType | Trường optional truyền `null` | 1. Mở Swagger; 2. Gọi `PATCH /api/v1/customers/{id}`; 3. Truyền trường optional bằng `null`; 4. Execute; 5. Kiểm tra lại Customer | Cập nhật thành công; trường tương ứng được lưu thành `null` | API chấp nhận trường optional bằng `null` và sau cập nhật trường tương ứng được lưu giá trị `null` | PASS |
| TC-CUSTOMER-024 | UC13 - Không tồn tại | Kiểm tra xem Customer không tồn tại | Có token Sales hoặc Customer Care hợp lệ; xác nhận ID kiểm thử không tồn tại | `customerId = 999` | 1. Mở Swagger; 2. Authorize; 3. Gọi `GET /api/v1/customers/999`; 4. Execute | HTTP 404; hiển thị `Không tìm thấy Customer hoặc bạn không có quyền truy cập Customer này.` | Gọi Customer ID `999` không tồn tại trả HTTP 404 và không trả dữ liệu Customer | PASS |
| TC-CUSTOMER-025 | UC13 - Validate query | Kiểm tra từ khóa tìm kiếm vượt quá 100 ký tự | Có token hợp lệ | `search` dài 101 ký tự | 1. Mở Swagger; 2. Gọi `GET /api/v1/customers`; 3. Truyền search dài 101 ký tự; 4. Execute | HTTP 400; request bị từ chối | Query `search` dài 101 ký tự bị validation từ chối với HTTP 400 | PASS |
| TC-CUSTOMER-026 | UC13 - Pagination | Kiểm tra page nhỏ hơn giá trị tối thiểu | Có token hợp lệ | `page = 0` | 1. Mở Swagger; 2. Gọi `GET /api/v1/customers?page=0`; 3. Execute | HTTP 400; request bị từ chối | Request với `page = 0` bị API từ chối với HTTP 400 do nhỏ hơn giá trị tối thiểu | PASS |
| TC-CUSTOMER-027 | UC13 - Pagination / Giá trị biên | Kiểm tra limit đúng giá trị tối đa | Có token hợp lệ | `limit = 100` | 1. Mở Swagger; 2. Gọi `GET /api/v1/customers?limit=100`; 3. Execute | HTTP 200; giá trị limit 100 được chấp nhận | API trả HTTP 200 với `limit = 100`, request được chấp nhận và trả danh sách Customer bình thường | PASS |
| TC-CUSTOMER-028 | UC13 - Pagination / Giá trị biên | Kiểm tra limit vượt quá giá trị tối đa | Có token hợp lệ | `limit = 101` | 1. Mở Swagger; 2. Gọi `GET /api/v1/customers?limit=101`; 3. Execute | HTTP 400; request bị từ chối | Request với `limit = 101` bị API từ chối với HTTP 400 do vượt giới hạn tối đa | PASS |
| TC-CUSTOMER-029 | Phân quyền Customer | Kiểm tra Admin không được truy cập chức năng Customer | Admin đã đăng nhập và có token hợp lệ | `GET /api/v1/customers` | 1. Mở Swagger; 2. Authorize bằng token Admin; 3. Gọi `GET /api/v1/customers`; 4. Execute | HTTP 403; hiển thị `Bạn không có quyền truy cập chức năng này` | API trả HTTP 403 khi Admin truy cập Customer và không trả dữ liệu danh sách | PASS |
| TC-CUSTOMER-030 | Phân quyền Customer | Kiểm tra Sales Manager truy cập được danh sách Customer | Sales Manager đã đăng nhập và có token hợp lệ | `GET /api/v1/customers` | 1. Mở Swagger; 2. Authorize bằng token Sales Manager; 3. Gọi `GET /api/v1/customers`; 4. Execute | HTTP 200; Trả danh sách Customer | Sales Manager gọi API thành công với HTTP 200 và nhận được danh sách Customer | PASS |
| TC-CUSTOMER-031 | Phân quyền Customer | Kiểm tra Marketing không được truy cập chức năng Customer | Marketing đã đăng nhập và có token hợp lệ | `GET /api/v1/customers` | 1. Mở Swagger; 2. Authorize bằng token Marketing; 3. Gọi `GET /api/v1/customers`; 4. Execute | HTTP 403; không trả dữ liệu Customer | API trả HTTP 403 với tài khoản Marketing và không trả dữ liệu Customer | PASS |
| TC-CUSTOMER-032 | Xác thực Customer | Kiểm tra API Customer khi không có access token | Không đăng nhập hoặc không Authorize trên Swagger | `GET /api/v1/customers` | 1. Mở Swagger; 2. Không Authorize; 3. Gọi `GET /api/v1/customers`; 4. Execute | HTTP 401; không trả dữ liệu Customer | Khi không có access token, API trả HTTP 401 và không trả danh sách Customer | PASS |

### Minh chứng TC-CUSTOMER-001
![TC-CUSTOMER-001 - Sales xem được danh sách Customer thuộc quyền](./assets/customers/TC-CUSTOMER-001.png)

### Minh chứng TC-CUSTOMER-002
![TC-CUSTOMER-002 - Customer Care xem được toàn bộ Customer](./assets/customers/TC-CUSTOMER-002.png)

### Minh chứng TC-CUSTOMER-003
![TC-CUSTOMER-003 - Tìm Customer theo họ tên](./assets/customers/TC-CUSTOMER-003.png)

### Minh chứng TC-CUSTOMER-004
![TC-CUSTOMER-004 - Tìm Customer theo công ty](./assets/customers/TC-CUSTOMER-004.png)

### Minh chứng TC-CUSTOMER-005
![TC-CUSTOMER-005 - Tìm Customer theo email](./assets/customers/TC-CUSTOMER-005.png)

### Minh chứng TC-CUSTOMER-006
![TC-CUSTOMER-006 - Tìm Customer theo số điện thoại](./assets/customers/TC-CUSTOMER-006.png)

### Minh chứng TC-CUSTOMER-007
![TC-CUSTOMER-007 - Trường hợp tìm kiếm không có kết quả](./assets/customers/TC-CUSTOMER-007.png)

### Minh chứng TC-CUSTOMER-008
![TC-CUSTOMER-008 - Sales xem chi tiết Customer thuộc quyền](./assets/customers/TC-CUSTOMER-008.png)

### Minh chứng TC-CUSTOMER-009
![TC-CUSTOMER-009 - Customer Care xem chi tiết Customer](./assets/customers/TC-CUSTOMER-009.png)

### Minh chứng TC-CUSTOMER-010
![TC-CUSTOMER-010 - Sales không xem được Customer ngoài quyền qua API](./assets/customers/TC-CUSTOMER-010.png)

### Minh chứng TC-CUSTOMER-011
![TC-CUSTOMER-011 - Sales cập nhật Customer thuộc quyền thành công](./assets/customers/TC-CUSTOMER-011.png)

### Minh chứng TC-CUSTOMER-012
![TC-CUSTOMER-012 - Customer Care cập nhật Customer thành công](./assets/customers/TC-CUSTOMER-012.png)

### Minh chứng TC-CUSTOMER-013
![TC-CUSTOMER-013 - Sales không sửa Customer ngoài quyền](./assets/customers/TC-CUSTOMER-013.png)

### Minh chứng TC-CUSTOMER-014
![TC-CUSTOMER-014 - Request cập nhật không có dữ liệu](./assets/customers/TC-CUSTOMER-014.png)

### Minh chứng TC-CUSTOMER-015
![TC-CUSTOMER-015 - Họ tên Customer không được để trống](./assets/customers/TC-CUSTOMER-015.png)

### Minh chứng TC-CUSTOMER-016
![TC-CUSTOMER-016 - Họ tên đúng giới hạn 100 ký tự](./assets/customers/TC-CUSTOMER-016.png)

### Minh chứng TC-CUSTOMER-017
![TC-CUSTOMER-017 - Họ tên vượt quá 100 ký tự](./assets/customers/TC-CUSTOMER-017.png)

### Minh chứng TC-CUSTOMER-018
![TC-CUSTOMER-018 - Tên công ty vượt quá 150 ký tự](./assets/customers/TC-CUSTOMER-018.png)

### Minh chứng TC-CUSTOMER-019
![TC-CUSTOMER-019 - Số điện thoại vượt quá 20 ký tự](./assets/customers/TC-CUSTOMER-019.png)

### Minh chứng TC-CUSTOMER-020
![TC-CUSTOMER-020 - Email sai định dạng](./assets/customers/TC-CUSTOMER-020.png)

### Minh chứng TC-CUSTOMER-021
![TC-CUSTOMER-021 - Loại khách hàng vượt quá 50 ký tự](./assets/customers/TC-CUSTOMER-021.png)

### Minh chứng TC-CUSTOMER-022
![TC-CUSTOMER-022 - Hệ thống trim dữ liệu và chuyển email về chữ thường](./assets/customers/TC-CUSTOMER-022.png)

### Minh chứng TC-CUSTOMER-023
![TC-CUSTOMER-023 - Có thể xóa dữ liệu của trường không bắt buộc](./assets/customers/TC-CUSTOMER-023.png)

### Minh chứng TC-CUSTOMER-024
![TC-CUSTOMER-024 - Xem Customer không tồn tại](./assets/customers/TC-CUSTOMER-024.png)

### Minh chứng TC-CUSTOMER-025
![TC-CUSTOMER-025 - Từ khóa tìm kiếm vượt quá 100 ký tự](./assets/customers/TC-CUSTOMER-025.png)

### Minh chứng TC-CUSTOMER-026
![TC-CUSTOMER-026 - Page nhỏ hơn giá trị tối thiểu](./assets/customers/TC-CUSTOMER-026.png)

### Minh chứng TC-CUSTOMER-027
![TC-CUSTOMER-027 - Limit đúng giá trị tối đa](./assets/customers/TC-CUSTOMER-027.png)

### Minh chứng TC-CUSTOMER-028
![TC-CUSTOMER-028 - Limit vượt quá giá trị tối đa](./assets/customers/TC-CUSTOMER-028.png)

### Minh chứng TC-CUSTOMER-029
![TC-CUSTOMER-029 - Admin không được truy cập chức năng Customer](./assets/customers/TC-CUSTOMER-029.png)

### Minh chứng TC-CUSTOMER-030
![TC-CUSTOMER-030 - Sales Manager truy cập được danh sách Customer](./assets/customers/TC-CUSTOMER-030.png)

### Minh chứng TC-CUSTOMER-031
![TC-CUSTOMER-031 - Marketing không được truy cập chức năng Customer](./assets/customers/TC-CUSTOMER-031.png)

### Minh chứng TC-CUSTOMER-032
![TC-CUSTOMER-032 - API Customer khi không có access token](./assets/customers/TC-CUSTOMER-032.png)