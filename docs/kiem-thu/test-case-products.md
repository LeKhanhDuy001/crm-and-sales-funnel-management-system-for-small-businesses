# Test Case - Quản lý sản phẩm

## UC14 - Quản lý sản phẩm

### Kỹ thuật thiết kế test áp dụng

- **Phân vùng tương đương**: chia dữ liệu thành hợp lệ/không hợp lệ; sản phẩm tồn tại/không tồn tại; Admin/non-Admin; sản phẩm đã/chưa phát sinh QuoteDetail.
- **Phân tích giá trị biên**: kiểm tra giá sản phẩm tại biên hợp lệ và không hợp lệ.
- **Bảng quyết định**: kiểm tra xử lý xóa sản phẩm dựa trên việc sản phẩm đã phát sinh QuoteDetail hay chưa.
- **Phân quyền**: kiểm tra Admin được phép quản lý sản phẩm và các role khác bị từ chối.

| Mã TC | Chức năng / UC | Mục tiêu | Tiền điều kiện | Dữ liệu đầu vào | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|---|
| TC-PRODUCTS-001 | UC14 - Xem danh sách sản phẩm | Kiểm tra Admin xem được danh sách sản phẩm | Admin đã đăng nhập; hệ thống có sản phẩm | Không | 1. Đăng nhập bằng tài khoản Admin; 2. Mở chức năng Quản lý sản phẩm | Trang Quản lý sản phẩm hiển thị danh sách sản phẩm; mỗi sản phẩm hiển thị đúng các thông tin cần thiết | Đã kiểm thử | PASS |
| TC-PRODUCTS-002 | UC14 - Xem danh sách sản phẩm | Kiểm tra danh sách rỗng khi không có sản phẩm phù hợp | Admin đã đăng nhập | Từ khóa `KhongTonTaiXYZ` | 1. Mở trang Quản lý sản phẩm; 2. Nhập `KhongTonTaiXYZ` vào ô tìm kiếm; 3. Thực hiện tìm kiếm | Không hiển thị sản phẩm không phù hợp; giao diện thể hiện không có dữ liệu phù hợp | Đã kiểm thử | PASS |
| TC-PRODUCTS-003 | UC14 - Tìm kiếm sản phẩm | Kiểm tra tìm kiếm sản phẩm theo tên | Admin đã đăng nhập; có sản phẩm phù hợp | Một phần tên sản phẩm đang tồn tại | 1. Mở trang Quản lý sản phẩm; 2. Nhập một phần tên sản phẩm vào ô tìm kiếm; 3. Thực hiện tìm kiếm | Hiển thị các sản phẩm phù hợp với từ khóa; tìm kiếm không phân biệt hoa thường | Đã kiểm thử | PASS |
| TC-PRODUCTS-004 | UC14 - Lọc sản phẩm | Kiểm tra lọc sản phẩm theo danh mục | Admin đã đăng nhập; có sản phẩm thuộc danh mục cần kiểm tra | Một danh mục đang tồn tại | 1. Mở trang Quản lý sản phẩm; 2. Chọn danh mục cần lọc | Chỉ hiển thị các sản phẩm thuộc danh mục đã chọn | Đã kiểm thử | PASS |
| TC-PRODUCTS-005 | UC14 - Lọc sản phẩm | Kiểm tra lọc sản phẩm đang hoạt động | Admin đã đăng nhập; có sản phẩm đang hoạt động | Trạng thái `Đang hoạt động` | 1. Mở trang Quản lý sản phẩm; 2. Chọn bộ lọc trạng thái đang hoạt động | Chỉ hiển thị các sản phẩm có trạng thái đang hoạt động | Đã kiểm thử | PASS |
| TC-PRODUCTS-006 | UC14 - Lọc sản phẩm | Kiểm tra lọc sản phẩm ngừng hoạt động | Admin đã đăng nhập; có sản phẩm đã ngừng hoạt động | Trạng thái `Ngừng hoạt động` | 1. Mở trang Quản lý sản phẩm; 2. Chọn bộ lọc trạng thái ngừng hoạt động | Chỉ hiển thị các sản phẩm có trạng thái ngừng hoạt động | Đã kiểm thử | PASS |
| TC-PRODUCTS-007 | UC14 - Danh mục sản phẩm | Kiểm tra danh sách danh mục dùng để lọc sản phẩm | Admin đã đăng nhập; hệ thống có nhiều sản phẩm thuộc các danh mục khác nhau | Không có dữ liệu ban đầu | 1. Mở trang Quản lý sản phẩm; 2. Mở danh sách lựa chọn danh mục | Các danh mục hiện có được hiển thị để Admin lựa chọn; không xuất hiện giá trị trùng lặp | Đã kiểm thử | PASS |
| TC-PRODUCTS-008 | UC14 - Xem chi tiết sản phẩm | Kiểm tra xem thông tin chi tiết của sản phẩm tồn tại | Admin đã đăng nhập; sản phẩm tồn tại | Chọn một sản phẩm trong danh sách | 1. Mở trang Quản lý sản phẩm; 2. Chọn xem sản phẩm cần kiểm tra | Hiển thị đúng mã sản phẩm, tên, danh mục, giá, mô tả và trạng thái của sản phẩm | Đã kiểm thử | PASS |
| TC-PRODUCTS-009 | UC14 - Xem chi tiết sản phẩm | Kiểm tra API xử lý Product ID không tồn tại | Admin có token hợp lệ | `GET /api/v1/products/999` | 1. Mở Swagger; 2. Authorize bằng token Admin; 3. Gọi `GET /api/v1/products/999`; 4. Execute | HTTP 404; hiển thị `Không tìm thấy sản phẩm.` | Đã kiểm thử | PASS |
| TC-PRODUCTS-010 | UC14 - Thêm sản phẩm | Kiểm tra thêm sản phẩm với dữ liệu hợp lệ | Admin đã đăng nhập; tên sản phẩm chưa tồn tại | Tên `CRM Test Product`; giá `100000`; các trường khác hợp lệ | 1. Mở trang Quản lý sản phẩm; 2. Nhấn thêm sản phẩm; 3. Nhập dữ liệu hợp lệ; 4. Nhấn lưu | Hiển thị thông báo thêm sản phẩm thành công; sản phẩm mới xuất hiện trong danh sách; nếu không chọn trạng thái thì sản phẩm mặc định hoạt động | Đã kiểm thử | PASS |
| TC-PRODUCTS-011 | UC14 - Thêm sản phẩm | Kiểm tra không cho thêm khi thiếu tên sản phẩm | Admin đã đăng nhập | Để trống tên sản phẩm; các trường còn lại hợp lệ | 1. Mở form thêm sản phẩm; 2. Để trống tên sản phẩm; 3. Nhập các dữ liệu còn lại hợp lệ; 4. Nhấn lưu | Hệ thống báo lỗi dữ liệu bắt buộc; sản phẩm không được tạo | Đã kiểm thử | PASS |
| TC-PRODUCTS-012 | UC14 - Thêm sản phẩm | Kiểm tra không cho thêm khi thiếu giá sản phẩm | Admin đã đăng nhập | Có tên sản phẩm; để trống giá | 1. Mở form thêm sản phẩm; 2. Nhập tên; 3. Để trống giá; 4. Nhấn lưu | Hệ thống báo lỗi dữ liệu bắt buộc; sản phẩm không được tạo | Đã kiểm thử | PASS |
| TC-PRODUCTS-013 | UC14 - Thêm sản phẩm | Kiểm tra giá nhỏ nhất hợp lệ | Admin đã đăng nhập; tên sản phẩm chưa tồn tại | Giá `1` | 1. Mở form thêm sản phẩm; 2. Nhập dữ liệu hợp lệ với giá `1`; 3. Nhấn lưu | Sản phẩm được tạo thành công vì giá lớn hơn 0 | Đã kiểm thử | PASS |
| TC-PRODUCTS-014 | UC14 - Thêm sản phẩm | Kiểm tra không cho giá bằng 0 | Admin đã đăng nhập; tên sản phẩm chưa tồn tại | Giá `0` | 1. Mở form thêm sản phẩm; 2. Nhập dữ liệu hợp lệ nhưng giá bằng `0`; 3. Nhấn lưu | Không tạo sản phẩm; giao diện hiển thị thông báo `Giá sản phẩm phải lớn hơn 0.` | Đã kiểm thử | PASS |
| TC-PRODUCTS-015 | UC14 - Thêm sản phẩm | Kiểm tra không cho giá âm | Admin đã đăng nhập; tên sản phẩm chưa tồn tại | Giá `-1` | 1. Mở form thêm sản phẩm; 2. Nhập dữ liệu hợp lệ nhưng giá `-1`; 3. Nhấn lưu | Không tạo sản phẩm; giao diện hiển thị thông báo `Giá sản phẩm phải lớn hơn 0.` | Đã kiểm thử | PASS |
| TC-PRODUCTS-016 | UC14 - Thêm sản phẩm | Kiểm tra không cho tên sản phẩm trùng | Admin đã đăng nhập; đã tồn tại sản phẩm cần kiểm tra | Tên sản phẩm đã tồn tại | 1. Mở form thêm sản phẩm; 2. Nhập tên giống sản phẩm đã tồn tại; 3. Nhập các trường khác hợp lệ; 4. Nhấn lưu | Không tạo sản phẩm mới; hiển thị `Tên sản phẩm đã tồn tại.` | Đã kiểm thử | PASS |
| TC-PRODUCTS-017 | UC14 - Thêm sản phẩm | Kiểm tra tên trùng không phân biệt hoa thường | Admin đã đăng nhập; có sản phẩm tên `CRM Test Product` | Tên `CRM TEST PRODUCT` | 1. Mở form thêm sản phẩm; 2. Nhập `crm basic`; 3. Nhập các trường khác hợp lệ; 4. Nhấn lưu | Không tạo sản phẩm; hiển thị `Tên sản phẩm đã tồn tại.` | Đã kiểm thử | PASS |
| TC-PRODUCTS-018 | UC14 - Thêm sản phẩm | Kiểm tra hệ thống chuẩn hóa khoảng trắng | Admin đã đăng nhập; tên sản phẩm chưa tồn tại | Tên `  Product Test  `; danh mục `  Software  ` | 1. Mở form thêm sản phẩm; 2. Nhập dữ liệu có khoảng trắng đầu và cuối; 3. Nhấn lưu; 4. Quan sát sản phẩm trong danh sách | Sản phẩm được tạo thành công; tên hiển thị `Product Test`; danh mục hiển thị `Software` | Đã kiểm thử | PASS |
| TC-PRODUCTS-019 | UC14 - Cập nhật sản phẩm | Kiểm tra cập nhật sản phẩm với dữ liệu hợp lệ | Admin đã đăng nhập; sản phẩm tồn tại | Tên, giá hoặc danh mục mới hợp lệ | 1. Mở trang Quản lý sản phẩm; 2. Chọn sửa một sản phẩm; 3. Thay đổi thông tin; 4. Nhấn lưu | Hiển thị thông báo cập nhật thành công; danh sách hiển thị thông tin mới | Đã kiểm thử | PASS |
| TC-PRODUCTS-020 | UC14 - Cập nhật sản phẩm | Kiểm tra API khi không gửi thông tin cần cập nhật | Admin có token hợp lệ; sản phẩm tồn tại | Body `{}` | 1. Mở Swagger; 2. Authorize bằng token Admin; 3. Gọi `PATCH /api/v1/products/{id}`; 4. Gửi `{}`; 5. Execute | Trả `Không có thông tin cần cập nhật.`; thông tin sản phẩm giữ nguyên | Đã kiểm thử | PASS |
| TC-PRODUCTS-021 | UC14 - Cập nhật sản phẩm | Kiểm tra không cho cập nhật tên thành chuỗi rỗng | Admin đã đăng nhập; sản phẩm tồn tại | Tên chỉ chứa khoảng trắng | 1. Mở form sửa sản phẩm; 2. Xóa tên và nhập khoảng trắng; 3. Nhấn lưu | Không cập nhật; hiển thị `Tên sản phẩm không được để trống.`; tên cũ giữ nguyên | Đã kiểm thử | PASS |
| TC-PRODUCTS-022 | UC14 - Cập nhật sản phẩm | Kiểm tra không cho đổi sang tên đã được sản phẩm khác sử dụng | Admin đã đăng nhập; có ít nhất hai sản phẩm | Đổi tên Product A thành tên Product B | 1. Chọn sửa Product A; 2. Nhập tên của Product B; 3. Nhấn lưu | Không cập nhật; hiển thị `Tên sản phẩm đã tồn tại.`; Product A giữ nguyên | Đã kiểm thử | PASS |
| TC-PRODUCTS-023 | UC14 - Cập nhật sản phẩm | Kiểm tra không cho cập nhật giá bằng 0 | Admin đã đăng nhập; sản phẩm tồn tại | Giá `0` | 1. Chọn sửa sản phẩm; 2. Nhập giá `0`; 3. Nhấn lưu | Không cập nhật; hiển thị `Giá sản phẩm phải lớn hơn 0.`; giá cũ giữ nguyên | Đã kiểm thử | PASS |
| TC-PRODUCTS-024 | UC14 - Cập nhật sản phẩm | Kiểm tra không cho cập nhật giá âm | Admin đã đăng nhập; sản phẩm tồn tại | Giá `-1` | 1. Chọn sửa sản phẩm; 2. Nhập giá `-1`; 3. Nhấn lưu | Không cập nhật; hiển thị `Giá sản phẩm phải lớn hơn 0.`; giá cũ giữ nguyên | Đã kiểm thử | PASS |
| TC-PRODUCTS-025 | UC14 - Cập nhật sản phẩm | Kiểm tra API khi cập nhật Product ID không tồn tại | Admin có token hợp lệ | `PATCH /api/v1/products/999` với body hợp lệ | 1. Mở Swagger; 2. Authorize bằng token Admin; 3. Gọi `PATCH /api/v1/products/999`; 4. Nhập body hợp lệ; 5. Execute | HTTP 404; hiển thị `Không tìm thấy sản phẩm.`; không tạo dữ liệu mới | Đã kiểm thử | PASS |
| TC-PRODUCTS-026 | UC14 - Cập nhật trạng thái | Kiểm tra chuyển sản phẩm sang ngừng hoạt động | Admin đã đăng nhập; sản phẩm đang hoạt động | Chuyển trạng thái sang ngừng hoạt động | 1. Mở trang Quản lý sản phẩm; 2. Chọn sửa sản phẩm; 3. Chuyển trạng thái sang ngừng hoạt động; 4. Nhấn lưu | Cập nhật thành công; sản phẩm hiển thị trạng thái ngừng hoạt động | Đã kiểm thử | PASS |
| TC-PRODUCTS-027 | UC14 - Xóa sản phẩm | Kiểm tra xóa vật lý sản phẩm chưa phát sinh QuoteDetail | Admin đã đăng nhập; sản phẩm chưa từng được dùng trong Quote | Chọn sản phẩm chưa có QuoteDetail | 1. Mở trang Quản lý sản phẩm; 2. Chọn xóa sản phẩm; 3. Xác nhận xóa; 4. Kiểm tra lại danh sách; 5. Kiểm tra DB/Prisma Studio | Hiển thị `Xóa sản phẩm thành công.`; sản phẩm biến mất khỏi danh sách và không còn trong bảng `products`; Activity Log được ghi | Đã kiểm thử | PASS |
| TC-PRODUCTS-028 | UC14 - Xóa sản phẩm | Kiểm tra không xóa vật lý sản phẩm đã phát sinh QuoteDetail | Admin đã đăng nhập; sản phẩm đã được sử dụng trong ít nhất một QuoteDetail | Chọn sản phẩm đã có QuoteDetail | 1. Mở trang Quản lý sản phẩm; 2. Chọn xóa sản phẩm; 3. Xác nhận; 4. Quan sát kết quả; 5. Kiểm tra DB/Prisma Studio | Hệ thống thông báo sản phẩm đã phát sinh báo giá nên chuyển sang ngừng hoạt động; sản phẩm vẫn còn trong DB với `status=false`; QuoteDetail không bị xóa; Activity Log được ghi | Đã kiểm thử | PASS |
| TC-PRODUCTS-029 | UC14 - Xóa sản phẩm | Kiểm tra API khi xóa Product ID không tồn tại | Admin có token hợp lệ | `DELETE /api/v1/products/999` | 1. Mở Swagger; 2. Authorize bằng token Admin; 3. Gọi `DELETE /api/v1/products/999`; 4. Execute | HTTP 404; hiển thị `Không tìm thấy sản phẩm.`; dữ liệu trong DB không thay đổi | Đã kiểm thử | PASS |
| TC-PRODUCTS-030 | UC14 - Phân quyền | Kiểm tra Sales không được gọi API quản lý Product | Sales có token hợp lệ | `GET /api/v1/products` | 1. Mở Swagger; 2. Authorize bằng token Sales; 3. Gọi `GET /api/v1/products`; 4. Execute | HTTP 403; hiển thị `Bạn không có quyền truy cập chức năng này` | Đã kiểm thử | PASS |
| TC-PRODUCTS-031 | UC14 - Phân quyền | Kiểm tra Sales Manager không được gọi API quản lý Product | Sales Manager có token hợp lệ | `GET /api/v1/products` | 1. Mở Swagger; 2. Authorize bằng token Sales Manager; 3. Gọi `GET /api/v1/products`; 4. Execute | HTTP 403; hiển thị `Bạn không có quyền truy cập chức năng này` | Đã kiểm thử | PASS |
| TC-PRODUCTS-032 | UC14 - Phân quyền | Kiểm tra Marketing không được gọi API quản lý Product | Marketing có token hợp lệ | `GET /api/v1/products` | 1. Mở Swagger; 2. Authorize bằng token Marketing; 3. Gọi `GET /api/v1/products`; 4. Execute | HTTP 403; hiển thị `Bạn không có quyền truy cập chức năng này` | Đã kiểm thử | PASS |
| TC-PRODUCTS-033 | UC14 - Phân quyền | Kiểm tra Customer Care không được gọi API quản lý Product | Customer Care có token hợp lệ | `GET /api/v1/products` | 1. Mở Swagger; 2. Authorize bằng token Customer Care; 3. Gọi `GET /api/v1/products`; 4. Execute | HTTP 403; hiển thị `Bạn không có quyền truy cập chức năng này` | Đã kiểm thử | PASS |
| TC-PRODUCTS-034 | UC14 - Xác thực | Kiểm tra gọi API Product khi chưa đăng nhập | Không có access token | `GET /api/v1/products` | 1. Mở Swagger; 2. Xóa token đang Authorize; 3. Gọi `GET /api/v1/products`; 4. Execute | HTTP 401; hiển thị `Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn` | Đã kiểm thử | PASS |
| TC-PRODUCTS-035 | UC14 - Activity Log | Kiểm tra thêm sản phẩm có ghi Activity Log | Admin đã thêm sản phẩm thành công | Sản phẩm vừa tạo | 1. Thêm sản phẩm trên giao diện; 2. Mở DB/Prisma Studio; 3. Kiểm tra bảng `activitylogs` theo Product vừa tạo | Có Activity Log với `action=Create`, `tablename=products`, đúng `recordid` và đúng Admin thực hiện | Đã kiểm thử | PASS |
| TC-PRODUCTS-036 | UC14 - Activity Log | Kiểm tra cập nhật sản phẩm có ghi Activity Log | Admin đã cập nhật sản phẩm thành công | Sản phẩm vừa cập nhật | 1. Cập nhật sản phẩm trên giao diện; 2. Mở DB/Prisma Studio; 3. Kiểm tra bảng `activitylogs` | Có Activity Log với `action=Update`; đúng Product; có thông tin trước và sau khi cập nhật | Đã kiểm thử | PASS |
| TC-PRODUCTS-037 | UC14 - Activity Log | Kiểm tra xóa hoặc ngừng hoạt động sản phẩm có ghi Activity Log | Admin đã thực hiện thao tác xóa sản phẩm | Sản phẩm vừa thực hiện xóa | 1. Xóa sản phẩm trên giao diện; 2. Mở DB/Prisma Studio; 3. Kiểm tra bảng `activitylogs` | Có Activity Log với `action=Delete`, `tablename=products`, đúng Product và đúng Admin thực hiện | Đã kiểm thử | PASS |

### Minh chứng TC-PRODUCTS-001
![TC-PRODUCTS-001 - Admin xem được danh sách sản phẩm](./assets/products/TC-PRODUCTS-001.png)

### Minh chứng TC-PRODUCTS-002
![TC-PRODUCTS-002 - Danh sách rỗng khi không có sản phẩm phù hợp](./assets/products/TC-PRODUCTS-002.png)

### Minh chứng TC-PRODUCTS-003
![TC-PRODUCTS-003 - Tìm kiếm sản phẩm theo tên](./assets/products/TC-PRODUCTS-003.png)

### Minh chứng TC-PRODUCTS-004
![TC-PRODUCTS-004 - Lọc sản phẩm theo danh mục](./assets/products/TC-PRODUCTS-004.png)

### Minh chứng TC-PRODUCTS-005
![TC-PRODUCTS-005 - Lọc sản phẩm đang hoạt động](./assets/products/TC-PRODUCTS-005.png)

### Minh chứng TC-PRODUCTS-006
![TC-PRODUCTS-006 - Lọc sản phẩm ngừng hoạt động](./assets/products/TC-PRODUCTS-006.png)

### Minh chứng TC-PRODUCTS-007
![TC-PRODUCTS-007 - Danh sách danh mục dùng để lọc sản phẩm](./assets/products/TC-PRODUCTS-007.png)

### Minh chứng TC-PRODUCTS-008
![TC-PRODUCTS-008 - Xem thông tin chi tiết của sản phẩm tồn tại](./assets/products/TC-PRODUCTS-008.png)

### Minh chứng TC-PRODUCTS-009
![TC-PRODUCTS-009 - API xử lý Product ID không tồn tại](./assets/products/TC-PRODUCTS-009.png)

### Minh chứng TC-PRODUCTS-010
![TC-PRODUCTS-010 - Thêm sản phẩm với dữ liệu hợp lệ](./assets/products/TC-PRODUCTS-010.png)

### Minh chứng TC-PRODUCTS-011
![TC-PRODUCTS-011 - Không cho thêm khi thiếu tên sản phẩm](./assets/products/TC-PRODUCTS-011.png)

### Minh chứng TC-PRODUCTS-012
![TC-PRODUCTS-012 - Không cho thêm khi thiếu giá sản phẩm](./assets/products/TC-PRODUCTS-012.png)

### Minh chứng TC-PRODUCTS-013
![TC-PRODUCTS-013 - Giá nhỏ nhất hợp lệ](./assets/products/TC-PRODUCTS-013.png)

### Minh chứng TC-PRODUCTS-014
![TC-PRODUCTS-014 - Không cho giá bằng 0](./assets/products/TC-PRODUCTS-014.png)

### Minh chứng TC-PRODUCTS-015
![TC-PRODUCTS-015 - Không cho giá âm](./assets/products/TC-PRODUCTS-015.png)

### Minh chứng TC-PRODUCTS-016
![TC-PRODUCTS-016 - Không cho tên sản phẩm trùng](./assets/products/TC-PRODUCTS-016.png)

### Minh chứng TC-PRODUCTS-017
![TC-PRODUCTS-017 - Tên trùng không phân biệt hoa thường](./assets/products/TC-PRODUCTS-017.png)

### Minh chứng TC-PRODUCTS-018
![TC-PRODUCTS-018 - Hệ thống chuẩn hóa khoảng trắng](./assets/products/TC-PRODUCTS-018.png)

### Minh chứng TC-PRODUCTS-019
![TC-PRODUCTS-019 - Cập nhật sản phẩm với dữ liệu hợp lệ](./assets/products/TC-PRODUCTS-019.png)

### Minh chứng TC-PRODUCTS-020
![TC-PRODUCTS-020 - API khi không gửi thông tin cần cập nhật](./assets/products/TC-PRODUCTS-020.png)

### Minh chứng TC-PRODUCTS-021
![TC-PRODUCTS-021 - Không cho cập nhật tên thành chuỗi rỗng](./assets/products/TC-PRODUCTS-021.png)

### Minh chứng TC-PRODUCTS-022
![TC-PRODUCTS-022 - Không cho đổi sang tên đã được sản phẩm khác sử dụng](./assets/products/TC-PRODUCTS-022.png)

### Minh chứng TC-PRODUCTS-023
![TC-PRODUCTS-023 - Không cho cập nhật giá bằng 0](./assets/products/TC-PRODUCTS-023.png)

### Minh chứng TC-PRODUCTS-024
![TC-PRODUCTS-024 - Không cho cập nhật giá âm](./assets/products/TC-PRODUCTS-024.png)

### Minh chứng TC-PRODUCTS-025
![TC-PRODUCTS-025 - API khi cập nhật Product ID không tồn tại](./assets/products/TC-PRODUCTS-025.png)

### Minh chứng TC-PRODUCTS-026
![TC-PRODUCTS-026 - Chuyển sản phẩm sang ngừng hoạt động](./assets/products/TC-PRODUCTS-026.1.png)
![TC-PRODUCTS-026 - Chuyển sản phẩm sang ngừng hoạt động](./assets/products/TC-PRODUCTS-026.2.png)

### Minh chứng TC-PRODUCTS-027
![TC-PRODUCTS-027 - xóa vật lý sản phẩm chưa phát sinh QuoteDetail](./assets/products/TC-PRODUCTS-027.png)

### Minh chứng TC-PRODUCTS-028
![TC-PRODUCTS-028 - Không xóa vật lý sản phẩm đã phát sinh QuoteDetail](./assets/products/TC-PRODUCTS-028.png)

### Minh chứng TC-PRODUCTS-029
![TC-PRODUCTS-029 - API khi xóa Product ID không tồn tại](./assets/products/TC-PRODUCTS-029.png)

### Minh chứng TC-PRODUCTS-030
![TC-PRODUCTS-030 - Sales không được gọi API quản lý Product](./assets/products/TC-PRODUCTS-030.png)

### Minh chứng TC-PRODUCTS-031
![TC-PRODUCTS-031 - Sales Manager không được gọi API quản lý Product](./assets/products/TC-PRODUCTS-031.png)

### Minh chứng TC-PRODUCTS-032
![TC-PRODUCTS-032 - Marketing không được gọi API quản lý Product](./assets/products/TC-PRODUCTS-032.png)

### Minh chứng TC-PRODUCTS-033
![TC-PRODUCTS-033 - Customer Care không được gọi API quản lý Product](./assets/products/TC-PRODUCTS-033.png)

### Minh chứng TC-PRODUCTS-034
![TC-PRODUCTS-034 - Gọi API Product khi chưa đăng nhập](./assets/products/TC-PRODUCTS-034.png)

### Minh chứng TC-PRODUCTS-035
![TC-PRODUCTS-035 - Thêm sản phẩm có ghi Activity Log](./assets/products/TC-PRODUCTS-035.1.png)
![TC-PRODUCTS-035 - Thêm sản phẩm có ghi Activity Log](./assets/products/TC-PRODUCTS-035.2.png)

### Minh chứng TC-PRODUCTS-036
![TC-PRODUCTS-036 - Cập nhật sản phẩm có ghi Activity Log](./assets/products/TC-PRODUCTS-036.1.png)
![TC-PRODUCTS-036 - Cập nhật sản phẩm có ghi Activity Log](./assets/products/TC-PRODUCTS-036.2.png)

### Minh chứng TC-PRODUCTS-037
![TC-PRODUCTS-037 - Xóa hoặc ngừng hoạt động sản phẩm có ghi Activity Log](./assets/products/TC-PRODUCTS-037.1.png)
![TC-PRODUCTS-037 - Xóa hoặc ngừng hoạt động sản phẩm có ghi Activity Log](./assets/products/TC-PRODUCTS-037.2.png)