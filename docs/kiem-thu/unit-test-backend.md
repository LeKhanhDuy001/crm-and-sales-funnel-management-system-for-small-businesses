## 1. Thông tin chung

- Công cụ kiểm thử: Jest
- Lệnh chạy:

```bash
npm run test
npm test -- leads.service.spec.ts
```

---

## 2. Danh sách Unit Test

| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-AUTH-001 | `auth.service.spec.ts` | Đăng nhập với mật khẩu chính xác | Trả về access token và thông tin người dùng | PASS |
| UNIT-AUTH-002 | `auth.service.spec.ts` | Đăng nhập với mật khẩu sai | Ném `UnauthorizedException`, không tạo JWT | PASS |
| UNIT-USER-001 | `users.service.spec.ts` | Chuẩn hóa email trước khi tìm kiếm | Email được trim và chuyển thành chữ thường | PASS |
| UNIT-USER-002 | `users.service.spec.ts` | Tìm người dùng theo ID | Repository được gọi với đúng user ID | PASS |
| UNIT-USER-003 | `users.service.spec.ts` | Cập nhật mật khẩu | Repository nhận đúng user ID và password hash | PASS |
| UNIT-AUTH-CTRL-001 | `auth.controller.spec.ts` | Controller xử lý đăng nhập | Gọi đúng `AuthService.login()` | PASS |
| UNIT-AUTH-CTRL-002 | `auth.controller.spec.ts` | Controller xử lý quên mật khẩu | Gọi đúng `AuthService.forgotPassword()` | PASS |
| UNIT-AUTH-CTRL-003 | `auth.controller.spec.ts` | Controller xử lý đặt lại mật khẩu | Gọi đúng `AuthService.resetPassword()` | PASS |
| UNIT-PRISMA-001 | `prisma.service.spec.ts` | Khởi tạo khi thiếu `DATABASE_URL` | Ném lỗi cấu hình | PASS |
| UNIT-APP-001 | `app.controller.spec.ts` | Kiểm tra `getHello()` | Trả về `Hello World!` | PASS |
| UNIT-LEAD-001 | `leads.service.spec.ts` | Chuyển Lead thành Customer khi Lead đủ điều kiện | Chuyển đổi thành công và gọi Repository với đúng Lead ID và User ID | PASS |
| UNIT-LEAD-002 | `leads.service.spec.ts` | Chuyển đổi Lead không tồn tại | Ném `NotFoundException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-003 | `leads.service.spec.ts` | Sales chuyển Lead được phân công cho Sales khác | Ném `ForbiddenException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-004 | `leads.service.spec.ts` | Chuyển Lead đã có trạng thái `Converted` | Ném `ConflictException`, không tạo Customer mới | PASS |
| UNIT-LEAD-005 | `leads.service.spec.ts` | Chuyển Lead đã có Customer | Ném `ConflictException`, không thực hiện chuyển đổi lại | PASS |
| UNIT-LEAD-006 | `leads.service.spec.ts` | Chuyển Lead có trạng thái `New` | Ném `UnprocessableEntityException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-007 | `leads.service.spec.ts` | Chuyển Lead có trạng thái `Contacted` | Ném `UnprocessableEntityException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-008 | `leads.service.spec.ts` | Chuyển Lead có họ tên không hợp lệ | Ném `UnprocessableEntityException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-009 | `leads.service.spec.ts` | Chuyển Lead thiếu cả số điện thoại và email | Ném `UnprocessableEntityException`, không thực hiện chuyển đổi | PASS |
| UNIT-LEAD-010 | `leads.service.spec.ts` | Chuyển Lead chỉ có số điện thoại, không có email | Cho phép chuyển đổi và gọi Repository | PASS |
| UNIT-LEAD-011 | `leads.service.spec.ts` | Chuyển Lead chỉ có email, không có số điện thoại | Cho phép chuyển đổi và gọi Repository | PASS |

---

## CHỨC NĂNG QUẢN LÝ USERS CHO ADMIN
| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-USER-001 | `users.service.spec.ts` | Admin lấy danh sách User có tìm kiếm, lọc và phân trang | Repository nhận đúng search, roleId, status, skip, take; trả đúng danh sách User và thông tin phân trang | PASS |
| UNIT-USER-002 | `users.service.spec.ts` | Admin lấy danh sách Role để gán cho User | Trả về đúng roleId, roleName và description của các Role | PASS |
| UNIT-USER-003 | `users.service.spec.ts` | Xem chi tiết User khi User tồn tại | Trả về đúng thông tin User và Role tương ứng | PASS |
| UNIT-USER-004 | `users.service.spec.ts` | Xem chi tiết User không tồn tại | Ném `NotFoundException` với thông báo `Không tìm thấy người dùng.` | PASS |
| UNIT-USER-005 | `users.service.spec.ts` | BR16 - Tạo User hợp lệ và mã hóa mật khẩu trước khi lưu | Gọi bcrypt hash với mật khẩu và salt rounds = 12; Repository nhận password đã hash; tạo User thành công | PASS |
| UNIT-USER-006 | `users.service.spec.ts` | BR16 - Tạo User với email đã tồn tại | Ném `ConflictException`; không hash mật khẩu và không gọi Repository tạo User | PASS |
| UNIT-USER-007 | `users.service.spec.ts` | Tạo User với Role không tồn tại | Ném `UnprocessableEntityException` với thông báo vai trò không hợp lệ; không tạo User | PASS |
| UNIT-USER-008 | `users.service.spec.ts` | Tạo User với họ tên chỉ chứa khoảng trắng | Ném `UnprocessableEntityException` với thông báo họ tên không được để trống | PASS |
| UNIT-USER-009 | `users.service.spec.ts` | Cập nhật User không tồn tại | Ném `NotFoundException`; không thực hiện cập nhật | PASS |
| UNIT-USER-010 | `users.service.spec.ts` | BR16 - Cập nhật sang email đang thuộc User khác | Ném `ConflictException`; không gọi Repository cập nhật User | PASS |
| UNIT-USER-011 | `users.service.spec.ts` | BR18 - Admin thay đổi Role của User | Repository cập nhật roleId mới và nhận Audit action `Assign` chứa Role cũ và Role mới | PASS |
| UNIT-USER-012 | `users.service.spec.ts` | Admin cập nhật User nhưng dữ liệu không thay đổi | Trả thông báo `Không có thông tin thay đổi.` và không gọi Repository cập nhật | PASS |
| UNIT-USER-013 | `users.service.spec.ts` | Admin xóa chính tài khoản đang đăng nhập | Ném `ForbiddenException`; không thực hiện truy vấn xóa User | PASS |
| UNIT-USER-014 | `users.service.spec.ts` | Xóa User không tồn tại | Ném `NotFoundException` với thông báo `Không tìm thấy người dùng.` | PASS |
| UNIT-USER-015 | `users.service.spec.ts` | BR20 - Xóa User đã phát sinh dữ liệu nghiệp vụ | Không xóa vật lý; gọi `deactivateUser`, chuyển status thành false và trả mode `deactivated` | PASS |
| UNIT-USER-016 | `users.service.spec.ts` | BR20 - Xóa User chưa phát sinh dữ liệu nghiệp vụ | Gọi `deleteUser`, không gọi `deactivateUser` và trả mode `deleted` | PASS |
| UNIT-USER-017 | `users.service.spec.ts` | Chuẩn hóa email trước khi tìm User | Email được trim, chuyển về chữ thường và truyền đúng vào Repository | PASS |
| UNIT-USER-018 | `users.service.spec.ts` | Tìm User theo ID | Repository được gọi với đúng User ID và trả về đúng User | PASS |
| UNIT-USER-019 | `users.service.spec.ts` | Cập nhật mật khẩu đã mã hóa thông qua Repository | Repository `updatePassword` được gọi với đúng User ID và password hash | PASS |

## Chức năng quản lý sản phẩm
| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-PRODUCT-001 | `products.service.spec.ts` | Admin lấy danh sách sản phẩm có tìm kiếm, lọc theo danh mục, trạng thái và phân trang | Repository nhận đúng search, category, status, skip, take; trả đúng danh sách sản phẩm và thông tin phân trang | PASS |
| UNIT-PRODUCT-002 | `products.service.spec.ts` | Admin lấy danh sách danh mục sản phẩm | Trả về đúng danh sách category hiện có | PASS |
| UNIT-PRODUCT-003 | `products.service.spec.ts` | Xem chi tiết sản phẩm khi sản phẩm tồn tại | Trả về đúng productId, productCode, productName và các thông tin sản phẩm | PASS |
| UNIT-PRODUCT-004 | `products.service.spec.ts` | Xem chi tiết sản phẩm không tồn tại | Ném `NotFoundException` với thông báo `Không tìm thấy sản phẩm.` | PASS |
| UNIT-PRODUCT-005 | `products.service.spec.ts` | Tạo sản phẩm hợp lệ và chuẩn hóa dữ liệu trước khi lưu | Tên, danh mục, mô tả được trim; Repository nhận đúng dữ liệu; tạo sản phẩm thành công | PASS |
| UNIT-PRODUCT-006 | `products.service.spec.ts` | Tạo sản phẩm với tên đã tồn tại | Ném `ConflictException` với thông báo `Tên sản phẩm đã tồn tại.`; không gọi Repository tạo sản phẩm | PASS |
| UNIT-PRODUCT-007 | `products.service.spec.ts` | BR17 - Tạo sản phẩm với giá bằng `0` | Ném `UnprocessableEntityException` với thông báo `Giá sản phẩm phải lớn hơn 0.`; không tạo sản phẩm | PASS |
| UNIT-PRODUCT-008 | `products.service.spec.ts` | BR17 - Tạo sản phẩm với giá bằng `-1` | Ném `UnprocessableEntityException` với thông báo `Giá sản phẩm phải lớn hơn 0.`; không tạo sản phẩm | PASS |
| UNIT-PRODUCT-009 | `products.service.spec.ts` | BR17 - Tạo sản phẩm với giá bằng `-100` | Ném `UnprocessableEntityException` với thông báo `Giá sản phẩm phải lớn hơn 0.`; không tạo sản phẩm | PASS |
| UNIT-PRODUCT-010 | `products.service.spec.ts` | Cập nhật sản phẩm hợp lệ | Repository nhận đúng productId, dữ liệu mới, User thực hiện và dữ liệu sản phẩm cũ; trả thông báo cập nhật thành công | PASS |
| UNIT-PRODUCT-011 | `products.service.spec.ts` | Cập nhật sản phẩm không tồn tại | Ném `NotFoundException`; không gọi Repository cập nhật sản phẩm | PASS |
| UNIT-PRODUCT-012 | `products.service.spec.ts` | Cập nhật sản phẩm với tên mới bị trùng | Ném `ConflictException` với thông báo `Tên sản phẩm đã tồn tại.`; không cập nhật sản phẩm | PASS |
| UNIT-PRODUCT-013 | `products.service.spec.ts` | Cập nhật tên sản phẩm chỉ chứa khoảng trắng | Ném `UnprocessableEntityException` với thông báo `Tên sản phẩm không được để trống.` | PASS |
| UNIT-PRODUCT-014 | `products.service.spec.ts` | BR17 - Cập nhật giá sản phẩm bằng `0` | Ném `UnprocessableEntityException` với thông báo `Giá sản phẩm phải lớn hơn 0.`; không cập nhật sản phẩm | PASS |
| UNIT-PRODUCT-015 | `products.service.spec.ts` | BR17 - Cập nhật giá sản phẩm bằng `-1` | Ném `UnprocessableEntityException` với thông báo `Giá sản phẩm phải lớn hơn 0.`; không cập nhật sản phẩm | PASS |
| UNIT-PRODUCT-016 | `products.service.spec.ts` | BR17 - Cập nhật giá sản phẩm bằng `-100` | Ném `UnprocessableEntityException` với thông báo `Giá sản phẩm phải lớn hơn 0.`; không cập nhật sản phẩm | PASS |
| UNIT-PRODUCT-017 | `products.service.spec.ts` | Cập nhật sản phẩm nhưng không có dữ liệu cần thay đổi | Trả thông báo `Không có thông tin cần cập nhật.` và không gọi Repository update | PASS |
| UNIT-PRODUCT-018 | `products.service.spec.ts` | BR17, BR20 - Xóa sản phẩm đã phát sinh QuoteDetail | Không xóa vật lý; gọi `deactivate`, chuyển status thành false và trả mode `deactivated` | PASS |
| UNIT-PRODUCT-019 | `products.service.spec.ts` | Xóa sản phẩm chưa phát sinh QuoteDetail | Gọi Repository `delete`, không gọi `deactivate` và trả mode `deleted` | PASS |
| UNIT-PRODUCT-020 | `products.service.spec.ts` | Xóa sản phẩm không tồn tại | Ném `NotFoundException`; không kiểm QuoteDetail và không thực hiện delete hoặc deactivate | PASS |

## Chức năng xem Activity Logs
| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-ACTIVITY-LOG-001 | `activity-logs.service.spec.ts` | Admin lấy danh sách Activity Log với phân trang mặc định | Repository nhận `skip = 0`, `take = 20`; trả đúng danh sách log và thông tin phân trang mặc định | PASS |
| UNIT-ACTIVITY-LOG-002 | `activity-logs.service.spec.ts` | Lọc Activity Log theo User và Action | Repository nhận đúng `userId` và `action`; trả về các Activity Log phù hợp điều kiện lọc | PASS |
| UNIT-ACTIVITY-LOG-003 | `activity-logs.service.spec.ts` | Lọc Activity Log theo khoảng ngày bắt đầu và ngày kết thúc | `fromDate` được chuyển về đầu ngày; `toDate` được chuyển thành đầu ngày kế tiếp và dùng làm mốc exclusive | PASS |
| UNIT-ACTIVITY-LOG-004 | `activity-logs.service.spec.ts` | Lọc Activity Log chỉ với ngày bắt đầu | Repository nhận đúng `fromDate`; `toDateExclusive` không được thiết lập | PASS |
| UNIT-ACTIVITY-LOG-005 | `activity-logs.service.spec.ts` | Lọc Activity Log chỉ với ngày kết thúc | Repository nhận đúng `toDateExclusive` là đầu ngày kế tiếp; `fromDate` không được thiết lập | PASS |
| UNIT-ACTIVITY-LOG-006 | `activity-logs.service.spec.ts` | Nhập ngày bắt đầu sau ngày kết thúc | Ném `UnprocessableEntityException` với thông báo `Ngày bắt đầu không được sau ngày kết thúc.`; không truy vấn Repository | PASS |
| UNIT-ACTIVITY-LOG-007 | `activity-logs.service.spec.ts` | Nhập ngày bắt đầu và ngày kết thúc giống nhau | Khoảng ngày được chấp nhận; hệ thống lấy toàn bộ Activity Log trong ngày đó | PASS |
| UNIT-ACTIVITY-LOG-008 | `activity-logs.service.spec.ts` | Map dữ liệu Activity Log và thông tin User | Trả đúng logId, User, Action, tableName, recordId, actionTime, ipAddress, oldValue và newValue | PASS |
| UNIT-ACTIVITY-LOG-009 | `activity-logs.service.spec.ts` | Activity Log không gắn với User | Trả `user = null` và vẫn trả đầy đủ các thông tin còn lại của Activity Log | PASS |
| UNIT-ACTIVITY-LOG-010 | `activity-logs.service.spec.ts` | Không có Activity Log phù hợp với điều kiện lọc | Trả danh sách `data = []`, `total = 0` và `totalPages = 0` | PASS |
| UNIT-ACTIVITY-LOG-011 | `activity-logs.service.spec.ts` | Kiểm tra phân trang ở trang thứ 3 với limit 20 | Repository nhận `skip = 40`, `take = 20`; với tổng 45 log hệ thống tính `totalPages = 3` | PASS |
| UNIT-ACTIVITY-LOG-012 | `activity-logs.service.spec.ts` | Admin lấy danh sách User dùng cho bộ lọc Activity Log | Repository `findUsers` được gọi; trả đúng userId, fullName và email của từng User | PASS |

## Chức năng quản lý khách hàng
| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-CUSTOMER-001 | `customers.service.spec.ts` | Sales lấy danh sách Customer theo phạm vi được phân quyền | Repository nhận đúng `salesUserId` của Sales; chỉ trả Customer liên quan đến Lead hoặc Deal do Sales đó phụ trách | PASS |
| UNIT-CUSTOMER-002 | `customers.service.spec.ts` | Customer Care lấy danh sách Customer | Repository không giới hạn theo `salesUserId`; Customer Care có thể xem toàn bộ Customer | PASS |
| UNIT-CUSTOMER-003 | `customers.service.spec.ts` | Tìm kiếm, lọc loại Customer và phân trang | Repository nhận đúng `search`, `customerType`, `skip`, `take`; hệ thống tính đúng tổng số trang | PASS |
| UNIT-CUSTOMER-004 | `customers.service.spec.ts` | Map dữ liệu Customer trả về cho client | Trả đúng customerId, customerCode, leadId, fullName, company, phone, email, address, customerType và createdAt | PASS |
| UNIT-CUSTOMER-005 | `customers.service.spec.ts` | Không có Customer phù hợp với điều kiện tìm kiếm | Trả `data = []`, `total = 0` và `totalPages = 0` | PASS |
| UNIT-CUSTOMER-006 | `customers.service.spec.ts` | Sales xem chi tiết Customer thuộc phạm vi được phép | Repository được gọi với đúng customerId và `salesUserId`; trả đúng thông tin Customer | PASS |
| UNIT-CUSTOMER-007 | `customers.service.spec.ts` | Customer Care xem chi tiết Customer | Repository được gọi với customerId và không giới hạn theo `salesUserId` | PASS |
| UNIT-CUSTOMER-008 | `customers.service.spec.ts` | Xem Customer không tồn tại hoặc Sales không có quyền truy cập | Ném `NotFoundException` với thông báo `Không tìm thấy Customer hoặc bạn không có quyền truy cập Customer này.` | PASS |
| UNIT-CUSTOMER-009 | `customers.service.spec.ts` | Cập nhật Customer nhưng không truyền dữ liệu thay đổi | Ném `BadRequestException` với thông báo `Không có dữ liệu Customer cần cập nhật.`; không gọi Repository cập nhật | PASS |
| UNIT-CUSTOMER-010 | `customers.service.spec.ts` | Cập nhật Customer không tồn tại hoặc người dùng không có quyền truy cập | Ném `NotFoundException`; không gọi `updateWithActivityLog` | PASS |
| UNIT-CUSTOMER-011 | `customers.service.spec.ts` | Cập nhật Customer hợp lệ và chuẩn hóa dữ liệu | Trim các trường text, email chuyển về chữ thường; Repository nhận đúng dữ liệu và trả thông báo cập nhật thành công | PASS |
| UNIT-CUSTOMER-012 | `customers.service.spec.ts` | Cập nhật các trường tùy chọn bằng chuỗi rỗng hoặc null | Các trường company, phone, email, address, customerType được chuyển thành `null` trước khi lưu | PASS |
| UNIT-CUSTOMER-013 | `customers.service.spec.ts` | Customer Care cập nhật Customer mà không bị giới hạn theo Sales scope | Repository kiểm tra Customer với `salesUserId = undefined` và cập nhật thành công | PASS |
| UNIT-CUSTOMER-014 | `customers.service.spec.ts` | BR18 - Truyền IP và User thực hiện xuống Repository khi cập nhật Customer | `updateWithActivityLog` nhận đúng actorUserId và ipAddress để phục vụ ghi Activity Log | PASS |

## Chức năng quản lý Deals
| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-DEAL-001 | `deals.service.spec.ts` | Sales lấy danh sách Deal có tìm kiếm, lọc Pipeline Stage và phân trang | Repository nhận đúng `search`, `stageId`, `salesUserId`, `skip`, `limit`; chỉ lấy Deal thuộc Sales đang đăng nhập và tính đúng pagination | PASS |
| UNIT-DEAL-002 | `deals.service.spec.ts` | Sales không có Deal phù hợp với điều kiện tìm kiếm | Trả `data = []`, `total = 0` và `totalPages = 0` | PASS |
| UNIT-DEAL-003 | `deals.service.spec.ts` | Lấy danh sách Pipeline Stage dùng cho form và bộ lọc | Trả đúng stageId, stageName, stageOrder và xác suất tương ứng của từng Pipeline Stage | PASS |
| UNIT-DEAL-004 | `deals.service.spec.ts` | Sales xem chi tiết Deal thuộc quyền quản lý | Repository kiểm tra bằng đúng `dealId` và `salesUserId`; trả đúng thông tin Deal, Customer, Stage và Sales phụ trách | PASS |
| UNIT-DEAL-005 | `deals.service.spec.ts` | Sales xem Deal không tồn tại hoặc không thuộc quyền quản lý | Ném `NotFoundException` với thông báo `Không tìm thấy Deal.` | PASS |
| UNIT-DEAL-006 | `deals.service.spec.ts` | BR06, BR08, BR09, BR18 - Tạo Deal hợp lệ | Kiểm tra Customer, Pipeline Stage; tự gán Sales hiện tại; trim tên Deal; tính đúng Probability và Expected Revenue; gọi Repository tạo Deal kèm Activity Log | PASS |
| UNIT-DEAL-007 | `deals.service.spec.ts` | BR06 - Tạo Deal với Customer không tồn tại hoặc không thuộc quyền Sales | Ném `UnprocessableEntityException` với thông báo Customer không thuộc quyền; không tạo Deal | PASS |
| UNIT-DEAL-008 | `deals.service.spec.ts` | BR06 - Tạo Deal với Pipeline Stage không tồn tại | Ném `UnprocessableEntityException` với thông báo `Giai đoạn Pipeline không tồn tại.`; không tạo Deal | PASS |
| UNIT-DEAL-009 | `deals.service.spec.ts` | BR08 - Tạo Deal với Pipeline Stage chưa cấu hình xác suất | Ném `UnprocessableEntityException` thông báo Stage chưa được cấu hình xác suất; không tạo Deal | PASS |
| UNIT-DEAL-010 | `deals.service.spec.ts` | Cập nhật Deal nhưng không truyền dữ liệu thay đổi | Ném `BadRequestException` với thông báo `Không có dữ liệu để cập nhật.`; không truy vấn hoặc cập nhật Deal | PASS |
| UNIT-DEAL-011 | `deals.service.spec.ts` | Cập nhật Deal không tồn tại hoặc không thuộc quyền Sales | Ném `NotFoundException`; không gọi Repository cập nhật | PASS |
| UNIT-DEAL-012 | `deals.service.spec.ts` | Cập nhật Deal sang Customer không thuộc quyền Sales | Ném `UnprocessableEntityException`; không cập nhật Deal | PASS |
| UNIT-DEAL-013 | `deals.service.spec.ts` | BR09, BR18 - Cập nhật Deal Value hợp lệ | Trim tên Deal, cập nhật Customer và ngày dự kiến đóng; tính lại Expected Revenue theo Deal Value mới và Probability hiện tại; truyền User và IP để ghi log | PASS |
| UNIT-DEAL-014 | `deals.service.spec.ts` | Cập nhật Deal nhưng không thay đổi Deal Value | Giữ Deal Value hiện tại để tính Expected Revenue; chỉ cập nhật các trường được truyền | PASS |
| UNIT-DEAL-015 | `deals.service.spec.ts` | Xóa Deal không tồn tại hoặc không thuộc quyền Sales | Ném `NotFoundException`; không kiểm tra dữ liệu liên kết và không xóa Deal | PASS |
| UNIT-DEAL-016 | `deals.service.spec.ts` | Không tìm thấy Deal khi kiểm tra dữ liệu nghiệp vụ liên kết trước khi xóa | Ném `NotFoundException`; không gọi `deleteWithLog` | PASS |
| UNIT-DEAL-017 | `deals.service.spec.ts` | BR20 - Xóa Deal đã phát sinh Quote | Ném `UnprocessableEntityException` với thông báo Deal có dữ liệu liên quan; không xóa vật lý | PASS |
| UNIT-DEAL-018 | `deals.service.spec.ts` | BR20 - Xóa Deal đã phát sinh Activity | Ném `UnprocessableEntityException` với thông báo Deal có dữ liệu liên quan; không xóa vật lý | PASS |
| UNIT-DEAL-019 | `deals.service.spec.ts` | BR20 - Xóa Deal đã phát sinh Task | Ném `UnprocessableEntityException` với thông báo Deal có dữ liệu liên quan; không xóa vật lý | PASS |
| UNIT-DEAL-020 | `deals.service.spec.ts` | BR18 - Xóa Deal chưa phát sinh Quote, Activity hoặc Task | Gọi `deleteWithLog` với đúng dealId, userId và IP address để xóa Deal và ghi Activity Log | PASS |
| UNIT-DEAL-021 | `deals.service.spec.ts` | Sales thay đổi Stage của Deal không thuộc quyền quản lý | Ném `NotFoundException`; không tìm Stage đích và không cập nhật Pipeline | PASS |
| UNIT-DEAL-022 | `deals.service.spec.ts` | Chọn lại đúng Pipeline Stage hiện tại của Deal | Không cập nhật database; trả thông báo `Deal đang ở giai đoạn này.` | PASS |
| UNIT-DEAL-023 | `deals.service.spec.ts` | BR10 - Thay đổi Stage khi Deal đang ở trạng thái Won | Ném `UnprocessableEntityException`; không cho thay đổi Pipeline Stage | PASS |
| UNIT-DEAL-024 | `deals.service.spec.ts` | BR10 - Thay đổi Stage khi Deal đang ở trạng thái Lost | Ném `UnprocessableEntityException`; không cho thay đổi Pipeline Stage | PASS |
| UNIT-DEAL-025 | `deals.service.spec.ts` | Chuyển Deal sang Pipeline Stage không tồn tại | Ném `UnprocessableEntityException` với thông báo `Giai đoạn Pipeline không hợp lệ.` | PASS |
| UNIT-DEAL-026 | `deals.service.spec.ts` | BR08 - Chuyển Deal sang Stage chưa cấu hình xác suất | Ném `UnprocessableEntityException` thông báo Stage chưa được cấu hình xác suất; không cập nhật Deal | PASS |
| UNIT-DEAL-027 | `deals.service.spec.ts` | BR08, BR09, BR18 - Chuyển Pipeline Stage thành công | Cập nhật đúng Stage, Probability và Expected Revenue; truyền Deal cũ, User và IP xuống Repository để ghi Activity Log; trả Deal sau cập nhật | PASS |

## Chức năng tạo quotes
| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-QUOTE-001 | `quotes.service.spec.ts` | Lấy danh sách Deal và Product hợp lệ để tạo báo giá | Chỉ trả Deal ở Proposal/Negotiation và Product đang hoạt động, giá lớn hơn 0 | PASS |
| UNIT-QUOTE-002 | `quotes.service.spec.ts` | Tạo báo giá với Deal hợp lệ và 2 Product hợp lệ | Tạo Quote thành công, trạng thái Draft, gán đúng Sales và tính đúng tổng tiền | PASS |
| UNIT-QUOTE-003 | `quotes.service.spec.ts` | Thêm cùng một Product nhiều lần trong Quote | Từ chối tạo Quote và thông báo mỗi sản phẩm chỉ được thêm một lần | PASS |
| UNIT-QUOTE-004 | `quotes.service.spec.ts` | Deal không tồn tại hoặc không thuộc Sales hiện tại | Trả lỗi 422 và không tạo Quote | PASS |
| UNIT-QUOTE-005 | `quotes.service.spec.ts` | Deal không ở Proposal hoặc Negotiation | Trả lỗi 422 và không cho tạo báo giá | PASS |
| UNIT-QUOTE-006 | `quotes.service.spec.ts` | Product không tồn tại | Trả lỗi 422 và không tạo Quote | PASS |
| UNIT-QUOTE-007 | `quotes.service.spec.ts` | Product có `status = false` | Trả lỗi 422 và không cho Product vào Quote | PASS |
| UNIT-QUOTE-008 | `quotes.service.spec.ts` | Product có `price = null` | Trả lỗi 422 do giá Product không hợp lệ | PASS |
| UNIT-QUOTE-009 | `quotes.service.spec.ts` | Product có `price = 0` | Trả lỗi 422 do giá Product không hợp lệ | PASS |
| UNIT-QUOTE-010 | `quotes.service.spec.ts` | Product có `price < 0` | Trả lỗi 422 do giá Product không hợp lệ | PASS |
| UNIT-QUOTE-011 | `quotes.service.spec.ts` | Product có `quantity = 0` | Trả lỗi 422, số lượng sản phẩm phải lớn hơn 0 | PASS |
| UNIT-QUOTE-012 | `quotes.service.spec.ts` | Product có `quantity = -1` | Trả lỗi 422, số lượng sản phẩm phải lớn hơn 0 | PASS |

## 3. Kết quả tổng hợp

```text
Test Suites: 5 passed, 5 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        2.074 s
```
```text
Chuyển Lead thành Customer
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        8.654 s
```

```text
Quản lý Users
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        8.629 s
```

```text
Quản lý Products
Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        25.597 s
```

```text
Xem Activity Logs
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        0.995 s
```

```text
Quản lý Customer
Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        0.923 s
```

```text
Quản lý Deals và kéo thả giai đoạn pipeline
Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        21.009 s
```

```text
Tạo quotes
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        13.98 s
```

**Kết luận:** 125/125 unit test PASS.

---

## 4. Lịch sử cập nhật

| Ngày | Nội dung | Tổng số test | Kết quả |
|---|---|---:|---|
| 10/08/2026 | Khởi tạo và hoàn thiện unit test backend | 10 | PASS |
| 15/08/2026 | unit test backend cho chức năng convert Lead into Customer | 11 | PASS |
| 21/08/2026 | unit test backend cho chức năng quản lý Users, quản lý Products | 39 | PASS |
| 22/08/2026 | unit test backend cho chức năng xem Activity Logs, quản lý Customer, Quản lý Deals và kéo thả giai đoạn pipeline | 53 | PASS |
| 23/08/2026 | unit test backend cho chức năng tạo quotes | 12 | PASS |