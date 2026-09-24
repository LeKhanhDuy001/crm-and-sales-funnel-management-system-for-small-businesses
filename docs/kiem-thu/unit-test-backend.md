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
| UNIT-AUTH-CTRL-001 | `auth.controller.spec.ts` | Controller xử lý đăng nhập | Gọi đúng `AuthService.login()` | PASS |
| UNIT-AUTH-CTRL-002 | `auth.controller.spec.ts` | Controller xử lý quên mật khẩu | Gọi đúng `AuthService.forgotPassword()` | PASS |
| UNIT-AUTH-CTRL-003 | `auth.controller.spec.ts` | Controller xử lý đặt lại mật khẩu | Gọi đúng `AuthService.resetPassword()` | PASS |
| UNIT-AUTH-003 | `auth.service.spec.ts` | Quên mật khẩu với email không tồn tại | Trả thông báo trung lập, không tạo Password Reset Token và không làm lộ email có tồn tại trong hệ thống hay không | PASS |
| UNIT-AUTH-004 | `auth.service.spec.ts` | Quên mật khẩu với tài khoản hợp lệ | Tạo Reset Token ngẫu nhiên, lưu token dưới dạng hash và thiết lập thời gian hết hạn | PASS |
| UNIT-AUTH-005 | `auth.service.spec.ts` | Đặt lại mật khẩu với Reset Token đã hết hạn | Từ chối đặt lại mật khẩu, không cập nhật mật khẩu người dùng | PASS |
| UNIT-AUTH-006 | `auth.service.spec.ts` | Đặt lại mật khẩu với Reset Token đã được sử dụng | Từ chối sử dụng lại Reset Token và không cập nhật mật khẩu lần nữa | PASS |
| UNIT-AUTH-007 | `auth.service.spec.ts` | Đặt lại mật khẩu với Reset Token hợp lệ | Mã hóa mật khẩu mới, cập nhật mật khẩu người dùng và đánh dấu Reset Token đã được sử dụng | PASS |
| UNIT-AUTH-GUARD-001 | `reset-password.guard.spec.ts` | Gửi yêu cầu reset password nhưng thiếu Reset Token | Guard từ chối yêu cầu vì không có Reset Token | PASS |
| UNIT-AUTH-GUARD-002 | `reset-password.guard.spec.ts` | Gửi Reset Token có độ dài không hợp lệ | Guard từ chối yêu cầu trước khi thực hiện đặt lại mật khẩu | PASS |
| UNIT-AUTH-GUARD-003 | `reset-password.guard.spec.ts` | Gửi Reset Token hợp lệ | Guard cho phép request tiếp tục tới controller xử lý reset password | PASS |
| UNIT-AUTH-GUARD-004 | `reset-password.guard.spec.ts` | Gửi Reset Token đã hết hạn hoặc đã được sử dụng | Guard từ chối request, không cho phép sử dụng token không còn hiệu lực | PASS |
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
| UNIT-LEAD-010 | `leads.service.spec.ts` | BR04 - Chuyển Lead có số điện thoại nhưng thiếu email | Ném `UnprocessableEntityException` với thông báo Lead phải có đầy đủ số điện thoại và email trước khi chuyển đổi; không gọi Repository chuyển đổi Customer | PASS |
| UNIT-LEAD-011 | `leads.service.spec.ts` | BR04 - Chuyển Lead có email nhưng thiếu số điện thoại | Ném `UnprocessableEntityException` với thông báo Lead phải có đầy đủ số điện thoại và email trước khi chuyển đổi; không gọi Repository chuyển đổi Customer | PASS |
| UNIT-LEAD-012 | `leads.service.spec.ts` | Sales xem chi tiết Lead được phân công cho chính mình | Cho phép truy cập và trả đúng thông tin Lead cùng Sales đang phụ trách | PASS |
| UNIT-LEAD-013 | `leads.service.spec.ts` | Sales xem chi tiết Lead được phân công cho Sales khác | Ném `NotFoundException` với thông báo `Lead không tồn tại`; không cho Sales truy cập Lead ngoài phạm vi được phân công | PASS |
| UNIT-LEAD-014 | `leads.service.spec.ts` | Marketing xem chi tiết Lead | Cho phép Marketing xem chi tiết Lead không phụ thuộc Sales đang được phân công | PASS |
| UNIT-LEAD-015 | `leads.service.spec.ts` | BR03 - Tạo Lead có email đã tồn tại | Ném `ConflictException` với thông báo `Email của Lead đã tồn tại`; không tạo Lead mới | PASS |
| UNIT-LEAD-016 | `leads.service.spec.ts` | BR03 - Tạo Lead có số điện thoại đã tồn tại | Ném `ConflictException` với thông báo `Số điện thoại của Lead đã tồn tại`; không tạo Lead mới | PASS |

---

## Chức năng phân công Lead

| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-LEAD-ASSIGN-001 | `lead-assignments.service.spec.ts` | BR25 - Sales Manager phân công Lead cho Sales hợp lệ | Phân công Lead thành công, gọi Repository với đúng `leadId`, `assignedUserId`, `actorUserId` và trả thông báo `Phân công Lead thành công.` | PASS |
| UNIT-LEAD-ASSIGN-002 | `lead-assignments.service.spec.ts` | BR25 - Admin không được phép phân công Lead | Ném `ForbiddenException` với thông báo `Bạn không có quyền phân công Lead.`, không truy vấn Lead và không thực hiện phân công | PASS |
| UNIT-LEAD-ASSIGN-003 | `lead-assignments.service.spec.ts` | BR25 - Sales không được phép phân công Lead | Ném `ForbiddenException` với thông báo `Bạn không có quyền phân công Lead.`, không truy vấn Lead và không thực hiện phân công | PASS |
| UNIT-LEAD-ASSIGN-004 | `lead-assignments.service.spec.ts` | BR25 - Marketing không được phép phân công Lead | Ném `ForbiddenException` với thông báo `Bạn không có quyền phân công Lead.`, không truy vấn Lead và không thực hiện phân công | PASS |
| UNIT-LEAD-ASSIGN-005 | `lead-assignments.service.spec.ts` | BR25 - Customer Care không được phép phân công Lead | Ném `ForbiddenException` với thông báo `Bạn không có quyền phân công Lead.`, không truy vấn Lead và không thực hiện phân công | PASS |
| UNIT-LEAD-ASSIGN-006 | `lead-assignments.service.spec.ts` | BR26 - Từ chối phân công Lead cho người không phải Sales đang hoạt động | Ném lỗi `Chỉ được phân công Lead cho nhân viên Sales đang hoạt động.`; không gọi `assignLead` | PASS |
| UNIT-LEAD-ASSIGN-007 | `lead-assignments.service.spec.ts` | BR28 - Từ chối phân công lại Lead đã chuyển đổi thành Customer | Ném lỗi `Lead đã chuyển đổi thành Customer nên không thể phân công.`; không tìm Sales đích và không gọi `assignLead` | PASS |

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
| UNIT-USER-013 | `users.service.spec.ts` | Admin thường xóa chính tài khoản đang đăng nhập | Ném `ForbiddenException` với thông báo `Bạn không thể xóa tài khoản đang đăng nhập.`; không xóa hoặc khóa User | PASS |
| UNIT-USER-014 | `users.service.spec.ts` | Xóa User không tồn tại | Ném `NotFoundException` với thông báo `Không tìm thấy người dùng.` | PASS |
| UNIT-USER-015 | `users.service.spec.ts` | BR20 - Xóa User đã phát sinh dữ liệu nghiệp vụ | Không xóa vật lý; gọi `deactivateUser`, chuyển status thành false và trả mode `deactivated` | PASS |
| UNIT-USER-016 | `users.service.spec.ts` | BR20 - Xóa User chưa phát sinh dữ liệu nghiệp vụ | Gọi `deleteUser`, không gọi `deactivateUser` và trả mode `deleted` | PASS |
| UNIT-USER-017 | `users.service.spec.ts` | Chuẩn hóa email trước khi tìm User | Email được trim, chuyển về chữ thường và truyền đúng vào Repository | PASS |
| UNIT-USER-018 | `users.service.spec.ts` | Tìm User theo ID | Repository được gọi với đúng User ID và trả về đúng User | PASS |
| UNIT-USER-019 | `users.service.spec.ts` | Cập nhật mật khẩu đã mã hóa thông qua Repository | Repository `updatePassword` được gọi với đúng User ID và password hash | PASS |
| UNIT-USER-020 | `users.service.spec.ts` | Admin thường cố xóa Super Admin | Ném `ForbiddenException` với thông báo `Không thể xóa tài khoản Super Admin.`; không xóa hoặc khóa Super Admin | PASS |
| UNIT-USER-021 | `users.service.spec.ts` | Super Admin tự xóa chính tài khoản | Ném `ForbiddenException` với thông báo `Không thể xóa tài khoản Super Admin.`; không xóa hoặc khóa Super Admin | PASS |
| UNIT-USER-022 | `users.service.spec.ts` | Super Admin xóa Admin thường khác | Cho phép xóa Admin thường; gọi `deleteUser` với đúng User cần xóa và Super Admin là người thực hiện | PASS |
| UNIT-USER-023 | `users.service.spec.ts` | Admin thường xóa Admin thường khác | Cho phép xóa Admin thường khác; gọi `deleteUser` với đúng User cần xóa và Admin hiện tại là người thực hiện | PASS |

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
| UNIT-DEAL-003 | `deals.service.spec.ts` | Sales lấy metadata Pipeline dùng cho Deal | Trả đúng `stageId`, `stageName`, `stageOrder`, `probability`; không truy vấn danh sách Sales và trả `salesUsers = []` | PASS |
| UNIT-DEAL-004 | `deals.service.spec.ts` | Sales xem chi tiết Deal thuộc quyền quản lý | Repository kiểm tra bằng đúng `dealId` và `salesUserId`; trả đúng thông tin Deal, Customer, Stage và Sales phụ trách | PASS |
| UNIT-DEAL-005 | `deals.service.spec.ts` | Sales xem Deal không tồn tại hoặc không thuộc quyền quản lý | Ném `NotFoundException` với thông báo `Không tìm thấy Deal.` | PASS |
| UNIT-DEAL-006 | `deals.service.spec.ts` | BR06, BR08, BR09, BR18, BR29 - Sales tạo Deal hợp lệ | Kiểm tra Customer và Stage khởi đầu; tự gán Sales đang đăng nhập làm người phụ trách; trim tên Deal; tính đúng Probability và Expected Revenue; gọi Repository tạo Deal kèm Activity Log | PASS |
| UNIT-DEAL-007 | `deals.service.spec.ts` | BR06 - Tạo Deal với Customer không tồn tại hoặc không thuộc quyền Sales | Ném `UnprocessableEntityException` với thông báo Customer không thuộc quyền; không tạo Deal | PASS |
| UNIT-DEAL-008 | `deals.service.spec.ts` | Tạo Deal nhưng Stage được gửi lên không phải Stage đầu tiên của Pipeline | Ném `UnprocessableEntityException` với thông báo `Deal mới phải bắt đầu ở giai đoạn đầu tiên của Pipeline.`; không tạo Deal | PASS |
| UNIT-DEAL-009 | `deals.service.spec.ts` | BR08 - Tạo Deal khi Stage khởi đầu có Probability ngoài khoảng 0-100 | Ném `UnprocessableEntityException` với thông báo `Giai đoạn "Unconfigured" có xác suất không hợp lệ.`; không tạo Deal | PASS |
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
| UNIT-DEAL-021 | `deals.service.spec.ts` | BR33 - Sales không được đổi Stage Deal không thuộc quyền mình | Ném `NotFoundException` với thông báo `Không tìm thấy Deal.`; không tìm Stage đích và không cập nhật Pipeline | PASS |
| UNIT-DEAL-022 | `deals.service.spec.ts` | Chọn lại đúng Pipeline Stage hiện tại của Deal | Không cập nhật database; trả thông báo `Deal đang ở giai đoạn này.` | PASS |
| UNIT-DEAL-023 | `deals.service.spec.ts` | BR10 - Thay đổi Stage khi Deal đang ở trạng thái Won | Ném `UnprocessableEntityException`; không cho thay đổi Pipeline Stage | PASS |
| UNIT-DEAL-024 | `deals.service.spec.ts` | BR10 - Thay đổi Stage khi Deal đang ở trạng thái Lost | Ném `UnprocessableEntityException`; không cho thay đổi Pipeline Stage | PASS |
| UNIT-DEAL-025 | `deals.service.spec.ts` | Chuyển Deal sang Pipeline Stage không tồn tại | Ném `UnprocessableEntityException` với thông báo `Giai đoạn Pipeline không hợp lệ.` | PASS |
| UNIT-DEAL-026 | `deals.service.spec.ts` | BR08 - Chuyển Deal sang Stage có Probability ngoài khoảng 0-100 | Ném `UnprocessableEntityException` với thông báo `Giai đoạn "Unconfigured" có xác suất không hợp lệ.`; không cập nhật Deal | PASS |
| UNIT-DEAL-027 | `deals.service.spec.ts` | BR08, BR09, BR18 - Chuyển Pipeline Stage thành công | Cập nhật đúng Stage, Probability và Expected Revenue; truyền Deal cũ, User và IP xuống Repository để ghi Activity Log; trả Deal sau cập nhật | PASS |
| UNIT-DEAL-028 | `deals.service.spec.ts` | Sales Manager xem toàn bộ danh sách Deal | Repository nhận `salesUserId = undefined`; không giới hạn Deal theo người phụ trách; gọi đúng `findMany`, `count`, `skip` và `limit` | PASS |
| UNIT-DEAL-029 | `deals.service.spec.ts` | BR-ALLOC-001 - Sales Manager lấy Pipeline Stage, workload và gợi ý Sales có ít Deal đang mở nhất | Trả `openDealCount`, `openExpectedRevenue` cho từng Sales đang hoạt động; Sales có số Deal đang mở thấp nhất được đánh dấu `recommended = true` | PASS |
| UNIT-DEAL-030 | `deals.service.spec.ts` | Sales Manager xem chi tiết Deal không phụ thuộc người phụ trách | Gọi `findById(dealId)` thay vì `findOwnedById`; trả đúng thông tin Deal | PASS |
| UNIT-DEAL-031 | `deals.service.spec.ts` | BR29 - Sales Manager tạo Deal và chọn Sales phụ trách thành công | Kiểm tra Customer và Sales được chọn; Deal được gán đúng `assignedUserId`; gọi `createWithLog` với Manager là người thực hiện và `notifyAssignee = true`; trả `Tạo Deal thành công.` | PASS |
| UNIT-DEAL-032 | `deals.service.spec.ts` | BR29 - Sales Manager tạo Deal nhưng không chọn Sales phụ trách | Ném lỗi `Vui lòng chọn nhân viên Sales phụ trách Deal.`; không gọi Repository tạo Deal | PASS |
| UNIT-DEAL-033 | `deals.service.spec.ts` | BR29 - Sales Manager chọn nhân viên Sales không tồn tại khi tạo Deal | Ném lỗi `Nhân viên Sales không tồn tại.`; không gọi Repository tạo Deal | PASS |
| UNIT-DEAL-034 | `deals.service.spec.ts` | BR29 - Sales Manager chọn người dùng không có vai trò Sales khi tạo Deal | Ném lỗi `Người được phân công phải có vai trò Sales.`; không gọi Repository tạo Deal | PASS |
| UNIT-DEAL-035 | `deals.service.spec.ts` | BR29 - Sales Manager chọn tài khoản Sales đã bị khóa khi tạo Deal | Ném lỗi `Không thể phân công Deal cho tài khoản Sales đã bị khóa.`; không gọi Repository tạo Deal | PASS |
| UNIT-DEAL-036 | `deals.service.spec.ts` | BR29 - Sales cố truyền `assignedUserId` của Sales khác khi tạo Deal | Backend bỏ qua `assignedUserId` được truyền; Deal vẫn tự gán cho Sales đang đăng nhập; không gọi `findUserById` | PASS |
| UNIT-DEAL-037 | `deals.service.spec.ts` | BR07, BR14, BR18 - Sales Manager phân công Deal sang Sales khác thành công | Kiểm tra Deal và Sales đích; gọi `assignWithLog` với đúng `dealId`, Sales mới, Manager `userId`, Deal cũ và IP; trả `Phân công Deal thành công.` và người phụ trách mới | PASS |
| UNIT-DEAL-038 | `deals.service.spec.ts` | BR07 - Sales không có quyền phân công Deal | Ném lỗi `Bạn không có quyền phân công Deal.`; không truy vấn Deal và không gọi `assignWithLog` | PASS |
| UNIT-DEAL-039 | `deals.service.spec.ts` | Phân công Deal không tồn tại | Ném lỗi `Không tìm thấy Deal.`; không tìm Sales đích và không gọi `assignWithLog` | PASS |
| UNIT-DEAL-040 | `deals.service.spec.ts` | Phân công Deal cho nhân viên Sales không tồn tại | Ném lỗi `Nhân viên Sales không tồn tại.`; không gọi `assignWithLog` | PASS |
| UNIT-DEAL-041 | `deals.service.spec.ts` | BR07 - Phân công Deal cho người dùng không có vai trò Sales | Ném lỗi `Người được phân công phải có vai trò Sales.`; không gọi `assignWithLog` | PASS |
| UNIT-DEAL-042 | `deals.service.spec.ts` | Phân công Deal cho tài khoản Sales đã bị khóa | Ném lỗi `Không thể phân công Deal cho tài khoản Sales đã bị khóa.`; không gọi `assignWithLog` | PASS |
| UNIT-DEAL-043 | `deals.service.spec.ts` | Phân công Deal lại cho chính Sales đang phụ trách | Ném lỗi `Deal đã được phân công cho nhân viên này.`; không gọi `assignWithLog` | PASS |
| UNIT-DEAL-044 | `deals.service.spec.ts` | BR10 - Chuyển Deal sang Lost nhưng không nhập lý do thất bại | Ném `UnprocessableEntityException` với thông báo `Vui lòng nhập lý do thất bại khi chuyển Deal sang Lost.`; không gọi `changeStageWithLog` | PASS |
| UNIT-DEAL-045 | `deals.service.spec.ts` | BR10 - Chuyển Deal sang Lost với lý do chỉ chứa khoảng trắng | Trim lý do thành rỗng; ném `UnprocessableEntityException`; không gọi `changeStageWithLog` | PASS |
| UNIT-DEAL-046 | `deals.service.spec.ts` | BR10, BR18 - Chuyển Deal sang Lost khi có lý do thất bại hợp lệ | Chuyển Stage sang Lost; Probability = 0; Expected Revenue = 0; trim lý do; truyền `lostReason` xuống Repository và trả lại trong response | PASS |
| UNIT-DEAL-047 | `deals.service.spec.ts` | BR33, BR08, BR09, BR18 - Sales Manager được đổi Stage Deal bất kỳ | Sales Manager được truy cập Deal không phụ thuộc người phụ trách; cập nhật đúng Stage, Probability và Expected Revenue; ghi Activity Log | PASS |
| UNIT-DEAL-048 | `deals.service.spec.ts` | BR33, BR08, BR09, BR18 - Admin được đổi Stage Deal bất kỳ | Admin được truy cập Deal không phụ thuộc người phụ trách; cập nhật đúng Stage, Probability và Expected Revenue; ghi Activity Log | PASS |
| UNIT-DEAL-049 | `deals.service.spec.ts` | BR33 - Từ chối role không có quyền thay đổi Stage Deal | Ném `ForbiddenException` với thông báo không có quyền thay đổi giai đoạn Deal; không cập nhật Pipeline Stage | PASS |
| UNIT-DEAL-050 | `deals.service.spec.ts` | Admin xem toàn bộ danh sách Deal | Repository nhận `salesUserId = undefined`; Admin không bị giới hạn Deal theo người phụ trách; trả đúng dữ liệu và pagination | PASS |
| UNIT-DEAL-051 | `deals.service.spec.ts` | BR-ALLOC-001 - Admin lấy Pipeline Stage và workload của Sales đang hoạt động | Trả đúng Pipeline Stage, `openDealCount`, `openExpectedRevenue`; Sales chưa có Deal được trả workload bằng 0 và được gợi ý khi có tải thấp nhất | PASS |
| UNIT-DEAL-052 | `deals.service.spec.ts` | Admin xem chi tiết Deal không phụ thuộc người phụ trách | Gọi `findById(dealId)` thay vì `findOwnedById`; trả đúng thông tin Deal | PASS |
| UNIT-DEAL-053 | `deals.service.spec.ts` | BR07, BR14, BR18 - Admin phân công Deal sang Sales khác thành công | Admin được phép phân công Deal cho Sales đang hoạt động, Deal đổi đúng người phụ trách, Repository nhận đúng Admin là người thực hiện | PASS |
| UNIT-DEAL-054 | `deals.service.spec.ts` | BR-ALLOC-001 - Hai Sales có cùng số Deal đang mở | Ưu tiên Sales có tổng `openExpectedRevenue` thấp hơn và đánh dấu người đó `recommended = true` | PASS |
| UNIT-DEAL-055 | `deals.service.spec.ts` | BR-ALLOC-001 - Hai Sales có cùng số Deal đang mở và cùng Expected Revenue | Dùng `userId` làm tiêu chí cuối cùng; Sales có `userId` nhỏ hơn được đánh dấu `recommended = true` | PASS |

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
| UNIT-QUOTE-013 | `quotes.service.spec.ts` | BR11 - Deal tồn tại nhưng không có Customer hợp lệ | Ném lỗi 422, không lấy Product và không tạo Quote | PASS |
| UNIT-QUOTE-014 | `quotes.service.spec.ts` | BR22 - Từ chối chỉnh sửa Quote không ở trạng thái Draft | Ném lỗi `Chỉ báo giá ở trạng thái Bản nháp mới được thực hiện thao tác này.`; không xử lý Product và không cập nhật Quote | PASS |
| UNIT-QUOTE-015 | `quotes.service.spec.ts` | BR23 - Từ chối hủy Quote đã Confirmed | Ném lỗi `Chỉ báo giá ở trạng thái Bản nháp mới được thực hiện thao tác này.`; không gọi `changeStatusWithLog` | PASS |
| UNIT-QUOTE-016 | `quotes.service.spec.ts` | BR24 - Hủy Quote Draft chỉ chuyển trạng thái sang Cancelled | Gọi `changeStatusWithLog` với trạng thái `Cancelled`; Quote vẫn được giữ lại và trả thông báo hủy thành công | PASS |
| UNIT-QUOTE-017 | `quotes.service.spec.ts` | BR23 - Xác nhận Quote đang ở trạng thái Draft | Chuyển trạng thái Quote từ `Draft` sang `Confirmed`, gọi Repository cập nhật trạng thái và trả thông báo xác nhận báo giá thành công | PASS |
| UNIT-QUOTE-018 | `quotes.service.spec.ts` | BR23 - Xác nhận Quote không ở trạng thái Draft | Ném lỗi với thông báo chỉ báo giá ở trạng thái Draft mới được xác nhận; không gọi Repository thay đổi trạng thái | PASS |

## Chức năng quản lý Tasks
| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-TASK-001 | `tasks.service.spec.ts` | Sales Manager lấy danh sách Task | Repository lấy toàn bộ Task không giới hạn theo người phụ trách; trả đúng dữ liệu và pagination | PASS |
| UNIT-TASK-002 | `tasks.service.spec.ts` | Sales lấy danh sách Task | Chỉ lấy các Task được phân công cho Sales đang đăng nhập | PASS |
| UNIT-TASK-003 | `tasks.service.spec.ts` | Customer Care lấy danh sách Task | Chỉ lấy các Task được phân công cho Customer Care đang đăng nhập | PASS |
| UNIT-TASK-004 | `tasks.service.spec.ts` | Sales xem chi tiết Task thuộc quyền | Trả đúng thông tin Task, người phụ trách, Deal và Customer liên quan | PASS |
| UNIT-TASK-005 | `tasks.service.spec.ts` | Xem Task không tồn tại hoặc không thuộc quyền | Ném `NotFoundException` với thông báo `Không tìm thấy Task.` | PASS |
| UNIT-TASK-006 | `tasks.service.spec.ts` | Sales Manager lấy metadata để tạo/cập nhật Task | Trả danh sách trạng thái, mức ưu tiên, Deal và các Sales đang hoạt động | PASS |
| UNIT-TASK-007 | `tasks.service.spec.ts` | Customer Care lấy metadata | Chỉ trả chính Customer Care hiện tại trong danh sách người phụ trách | PASS |
| UNIT-TASK-008 | `tasks.service.spec.ts` | Sales truy cập metadata tạo/cập nhật Task | Ném `ForbiddenException` vì Sales không có quyền tạo hoặc chỉnh sửa Task | PASS |
| UNIT-TASK-009 | `tasks.service.spec.ts` | BR13, BR14, BR18 - Sales Manager tạo Task hợp lệ và phân công cho Sales | Tạo Task trạng thái `Pending`, trim dữ liệu, lưu deadline/reminder, gửi Notification và ghi Activity Log | PASS |
| UNIT-TASK-010 | `tasks.service.spec.ts` | Customer Care tạo Task cho chính mình | Tạo Task thành công, tự gán Customer Care hiện tại và không gửi Notification phân công cho chính mình | PASS |
| UNIT-TASK-011 | `tasks.service.spec.ts` | Customer Care tạo Task cho người khác | Ném `ForbiddenException`; không tạo Task | PASS |
| UNIT-TASK-012 | `tasks.service.spec.ts` | Sales Manager tạo Task nhưng không chọn Sales phụ trách | Ném `UnprocessableEntityException`; không tạo Task | PASS |
| UNIT-TASK-013 | `tasks.service.spec.ts` | BR14 - Phân công Task cho Sales không tồn tại hoặc đã bị khóa | Ném `UnprocessableEntityException`; không tạo Task | PASS |
| UNIT-TASK-014 | `tasks.service.spec.ts` | Tạo Task gắn với Deal không tồn tại | Ném `NotFoundException`; không tạo Task | PASS |
| UNIT-TASK-015 | `tasks.service.spec.ts` | BR13 - Tạo Task với thời hạn hoàn thành ở quá khứ | Ném `UnprocessableEntityException`; không tạo Task | PASS |
| UNIT-TASK-016 | `tasks.service.spec.ts` | BR13 - Tạo Task với thời gian nhắc việc ở quá khứ | Ném `UnprocessableEntityException`; không tạo Task | PASS |
| UNIT-TASK-017 | `tasks.service.spec.ts` | BR13 - Thời gian nhắc việc sau thời hạn hoàn thành | Ném `UnprocessableEntityException`; không tạo Task | PASS |
| UNIT-TASK-018 | `tasks.service.spec.ts` | BR13 - Tiêu đề Task chỉ chứa khoảng trắng | Ném `UnprocessableEntityException` với thông báo tiêu đề không được để trống | PASS |
| UNIT-TASK-019 | `tasks.service.spec.ts` | BR18 - Cập nhật nội dung Task hợp lệ | Trim dữ liệu mới, giữ người phụ trách hiện tại, cập nhật Task và ghi Activity Log | PASS |
| UNIT-TASK-020 | `tasks.service.spec.ts` | BR14 - Cập nhật Task và thay đổi người phụ trách | Cập nhật người phụ trách mới và yêu cầu gửi Notification cho người được giao | PASS |
| UNIT-TASK-021 | `tasks.service.spec.ts` | BR13 - Cập nhật Task không có thời hạn hoàn thành | Ném `UnprocessableEntityException`; không cập nhật Task | PASS |
| UNIT-TASK-022 | `tasks.service.spec.ts` | Cập nhật Task không tồn tại hoặc không thuộc quyền | Ném `NotFoundException`; không gọi Repository cập nhật | PASS |
| UNIT-TASK-023 | `tasks.service.spec.ts` | BR18 - Cập nhật trạng thái Task thành `Completed` | Cập nhật đúng trạng thái và gọi Repository có ghi Activity Log | PASS |
| UNIT-TASK-024 | `tasks.service.spec.ts` | Hủy Task đã ở trạng thái `Cancelled` | Ném `ConflictException` với thông báo `Task này đã được hủy.` | PASS |
| UNIT-TASK-025 | `tasks.service.spec.ts` | BR18 - Hủy Task hợp lệ | Chuyển trạng thái sang `Cancelled` và ghi Activity Log | PASS |
| UNIT-TASK-026 | `tasks.service.spec.ts` | Người không phải Sales Manager thực hiện phân công Task | Ném `ForbiddenException`; không phân công Task | PASS |
| UNIT-TASK-027 | `tasks.service.spec.ts` | BR14 - Sales Manager phân công Task cho Sales không tồn tại hoặc bị khóa | Ném `UnprocessableEntityException`; không cập nhật người phụ trách | PASS |
| UNIT-TASK-028 | `tasks.service.spec.ts` | Phân công Task lại cho chính Sales đang phụ trách | Ném `ConflictException` với thông báo Task đã được phân công cho nhân viên này | PASS |
| UNIT-TASK-029 | `tasks.service.spec.ts` | BR14, BR18 - Sales Manager phân công Task thành công | Cập nhật đúng Sales phụ trách, tạo Notification cho người nhận và ghi Activity Log | PASS |

## Chức năng thông báo

| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-NOTIFICATION-001 | `notifications.service.spec.ts` | Người dùng lấy danh sách thông báo của chính mình | Repository được gọi với đúng `userId`; trả đúng danh sách thông báo sau khi mapping dữ liệu | PASS |
| UNIT-NOTIFICATION-002 | `notifications.service.spec.ts` | Người dùng chưa có thông báo | Trả về danh sách rỗng `[]` | PASS |
| UNIT-NOTIFICATION-003 | `notifications.service.spec.ts` | Đếm số thông báo chưa đọc của người dùng hiện tại | Repository đếm theo đúng `userId`; trả đúng `unreadCount` | PASS |
| UNIT-NOTIFICATION-004 | `notifications.service.spec.ts` | Đánh dấu thông báo không tồn tại hoặc không thuộc người dùng hiện tại là đã đọc | Ném `NotFoundException` với thông báo `Không tìm thấy thông báo.`; không cập nhật Notification | PASS |
| UNIT-NOTIFICATION-005 | `notifications.service.spec.ts` | Đánh dấu một thông báo đã ở trạng thái đã đọc | Không cập nhật database lần nữa; trả thông báo `Thông báo đã được đọc.` | PASS |
| UNIT-NOTIFICATION-006 | `notifications.service.spec.ts` | Đánh dấu một thông báo chưa đọc thành đã đọc | Kiểm tra Notification thuộc đúng người dùng, gọi Repository cập nhật `isRead = true` và trả thông báo thành công | PASS |
| UNIT-NOTIFICATION-007 | `notifications.service.spec.ts` | Đánh dấu tất cả thông báo chưa đọc của người dùng thành đã đọc | Repository chỉ cập nhật Notification thuộc đúng `userId`; trả đúng số lượng Notification được cập nhật | PASS |
| UNIT-NOTIFICATION-008 | `notifications.service.spec.ts` | Đánh dấu tất cả đã đọc khi người dùng không còn thông báo chưa đọc | Không phát sinh lỗi; trả `updatedCount = 0` | PASS |

## Dashboard
| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-DASHBOARD-001 | `dashboard.service.spec.ts` | Admin lấy dữ liệu Dashboard tổng quan | Repository được gọi để lấy số lượng User, Lead, Customer, Deal, Product, Quote, Task, doanh thu Deal Won, Pipeline và Lead mới nhất; trả đúng `overview`, `pipeline` và `recentLeads` sau khi mapping dữ liệu | PASS |
| UNIT-DASHBOARD-002 | `dashboard.service.spec.ts` | Dashboard Admin không có Deal ở trạng thái Won | Khi tổng `dealValue` của Deal Won là `null`, `overview.totalRevenue` được trả về `0`; không trả `null` hoặc `NaN` | PASS |
| UNIT-DASHBOARD-003 | `dashboard.service.spec.ts` | BR09, BR19 - Sales Manager xem tổng hợp đội Sales, Expected Revenue và mức ưu tiên chăm sóc Deal | Trả đúng `overview`, `salesPerformance` và `attentionDeals`; tính `daysToClose`; Deal còn tối đa 3 ngày có `carePriority = High`, còn 4-7 ngày là `Medium`, trên 7 ngày là `Low`; trả đúng `priorityReason` theo số ngày còn lại đến ngày dự kiến chốt | PASS |
| UNIT-DASHBOARD-004 | `dashboard.service.spec.ts` | Dashboard Sales Manager khi không có Sales đang hoạt động | Trả `salesPerformance = []`; không gọi Repository nhóm Deal theo Sales; các số liệu không có dữ liệu được trả về `0` và không phát sinh lỗi | PASS |
| UNIT-DASHBOARD-005 | `dashboard.service.spec.ts` | Sales lấy Dashboard cá nhân theo đúng `userId` | Repository lấy Lead, Deal, Quote, Task, Pipeline, Deal gần nhất và Task sắp tới theo đúng `userId`; kết quả chỉ chứa dữ liệu thuộc Sales hiện tại | PASS |
| UNIT-DASHBOARD-006 | `dashboard.service.spec.ts` | Marketing lấy Dashboard và tính tỷ lệ chuyển đổi Lead | Trả đúng tổng Lead, Lead mới trong tháng, Lead Converted, Lead chưa Converted, nguồn Lead, trạng thái Lead và Lead mới nhất; `conversionRate` được tính đúng | PASS |
| UNIT-DASHBOARD-007 | `dashboard.service.spec.ts` | Dashboard Marketing khi không có Lead | Khi `totalLeads = 0`, trả `conversionRate = 0` và `unconvertedLeads = 0`; không xảy ra chia cho `0` hoặc trả `NaN` | PASS |
| UNIT-DASHBOARD-008 | `dashboard.service.spec.ts` | Customer Care lấy Dashboard cá nhân theo đúng `userId` | Repository lấy Customer cần chăm sóc, Task hôm nay, Task chưa hoàn thành, Task quá hạn, Activity, Task sắp tới và Activity gần nhất theo đúng `userId`; trả đúng `overview`, `upcomingTasks`, `recentActivities` và `activitiesByType` | PASS |

## Forecast doanh thu

| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-FORECAST-001 | `forecast.service.spec.ts` | BR34 - Tổng hợp Forecast của Deal đang mở trong kỳ | Repository nhận đúng `fromDate` và `toDateExclusive`; trả đúng `totalOpenDeals`, `pipelineValue` và `forecastRevenue` | PASS |
| UNIT-FORECAST-002 | `forecast.service.spec.ts` | BR34 - Forecast khi kỳ không có Deal | Trả `totalOpenDeals = 0`, `pipelineValue = 0`, `forecastRevenue = 0`; không trả `null` hoặc `NaN` | PASS |
| UNIT-FORECAST-003 | `forecast.service.spec.ts` | BR34 - Ngày bắt đầu sau ngày kết thúc | Ném `UnprocessableEntityException` với thông báo `Ngày bắt đầu không được sau ngày kết thúc.`; không gọi Repository | PASS |
| UNIT-FORECAST-004 | `forecast.service.spec.ts` | BR34 - Forecast trong cùng một ngày | Cho phép `fromDate = toDate`; Repository nhận đầu ngày được chọn và đầu ngày kế tiếp làm mốc exclusive | PASS |

## Chức năng quản lý Activities

| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-ACTIVITY-001 | `activities.service.spec.ts` | Người dùng lấy danh sách Activity của chính mình | Repository được gọi với đúng `userId`; trả đúng danh sách Activity sau khi mapping dữ liệu | PASS |
| UNIT-ACTIVITY-002 | `activities.service.spec.ts` | Người dùng có Role không hỗ trợ truy cập chức năng Activity | Ném `ForbiddenException` với thông báo `Bạn không có quyền sử dụng chức năng Activity.`; không truy vấn Repository | PASS |
| UNIT-ACTIVITY-003 | `activities.service.spec.ts` | Sales lấy metadata Deal dùng để tạo Activity | Gọi `findSalesDealsForActivity` với đúng Sales `userId`; trả đúng Deal và Customer thuộc quyền Sales | PASS |
| UNIT-ACTIVITY-004 | `activities.service.spec.ts` | Customer Care lấy metadata Deal dùng để tạo Activity | Gọi `findCustomerCareDealsForActivity` với đúng Customer Care `userId`; chỉ trả Deal thuộc phạm vi chăm sóc | PASS |
| UNIT-ACTIVITY-005 | `activities.service.spec.ts` | Xem chi tiết Activity thuộc người dùng hiện tại | Repository được gọi với đúng Activity ID; trả đúng Activity, Deal, Customer và trạng thái | PASS |
| UNIT-ACTIVITY-006 | `activities.service.spec.ts` | Người dùng xem Activity của người khác | Ném `NotFoundException` với thông báo không có quyền truy cập Activity | PASS |
| UNIT-ACTIVITY-007 | `activities.service.spec.ts` | Xem Activity không tồn tại | Ném `NotFoundException`; không trả dữ liệu Activity | PASS |
| UNIT-ACTIVITY-008 | `activities.service.spec.ts` | BR15, BR18 - Sales tạo Activity cho Deal mình phụ trách | Trim nội dung và mô tả; Repository nhận đúng Deal, User, loại Activity, thời gian và IP; Activity được tạo ở trạng thái `Pending`, `result = null` | PASS |
| UNIT-ACTIVITY-009 | `activities.service.spec.ts` | Sales tạo Activity cho Deal của Sales khác | Ném `NotFoundException`; không gọi Repository tạo Activity | PASS |
| UNIT-ACTIVITY-010 | `activities.service.spec.ts` | Tạo Activity với Deal không tồn tại | Ném `NotFoundException` với thông báo `Không tìm thấy Deal.`; không tạo Activity | PASS |
| UNIT-ACTIVITY-011 | `activities.service.spec.ts` | Tạo Activity với nội dung chỉ chứa khoảng trắng | Ném `UnprocessableEntityException` với thông báo nội dung hoạt động không được để trống; không tạo Activity | PASS |
| UNIT-ACTIVITY-012 | `activities.service.spec.ts` | Tạo Activity với mô tả chỉ chứa khoảng trắng | Ném `UnprocessableEntityException` với thông báo mô tả hoạt động không được để trống; không tạo Activity | PASS |
| UNIT-ACTIVITY-013 | `activities.service.spec.ts` | Customer Care tạo Activity khi có Task đang hoạt động được phân công | Cho phép tạo Activity và gán đúng Customer Care đang đăng nhập làm người thực hiện | PASS |
| UNIT-ACTIVITY-014 | `activities.service.spec.ts` | Customer Care tạo Activity khi Task đã `Completed` | Ném `NotFoundException`; không tạo Activity | PASS |
| UNIT-ACTIVITY-015 | `activities.service.spec.ts` | Customer Care tạo Activity khi Task đã `Cancelled` | Ném `NotFoundException`; không tạo Activity | PASS |
| UNIT-ACTIVITY-016 | `activities.service.spec.ts` | Customer Care chăm sóc Deal có Task thuộc người khác | Ném `NotFoundException`; không tạo Activity | PASS |
| UNIT-ACTIVITY-017 | `activities.service.spec.ts` | Cập nhật kết quả Activity thành công | Trim kết quả; gọi Repository cập nhật và ghi Activity Log; trạng thái chuyển từ `Pending` sang `Completed` | PASS |
| UNIT-ACTIVITY-018 | `activities.service.spec.ts` | Cập nhật kết quả Activity của người khác | Ném `NotFoundException`; không gọi Repository cập nhật kết quả | PASS |
| UNIT-ACTIVITY-019 | `activities.service.spec.ts` | Cập nhật kết quả chỉ chứa khoảng trắng | Ném `UnprocessableEntityException` với thông báo kết quả chăm sóc không được để trống | PASS |
| UNIT-ACTIVITY-020 | `activities.service.spec.ts` | Cập nhật kết quả Activity đã `Cancelled` | Ném `UnprocessableEntityException` với thông báo Activity đã bị hủy; không cập nhật kết quả | PASS |
| UNIT-ACTIVITY-021 | `activities.service.spec.ts` | BR18 - Hủy Activity đang `Pending` | Gọi Repository hủy và ghi Activity Log; trạng thái Activity chuyển sang `Cancelled` | PASS |
| UNIT-ACTIVITY-022 | `activities.service.spec.ts` | Hủy Activity đã `Completed` | Ném `UnprocessableEntityException` với thông báo Activity đã hoàn thành nên không thể hủy | PASS |
| UNIT-ACTIVITY-023 | `activities.service.spec.ts` | Hủy lại Activity đã `Cancelled` | Ném `UnprocessableEntityException` với thông báo Activity đã được hủy; không cập nhật lại | PASS |
| UNIT-ACTIVITY-024 | `activities.service.spec.ts` | Hủy Activity của người khác | Ném `NotFoundException`; không gọi Repository hủy Activity | PASS |

## Chức năng Task Reminder

| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-TASK-REMINDER-001 | `task-reminder.service.spec.ts` | Không có Task nào đến thời điểm cần nhắc | Repository tìm Task đến hạn theo thời gian hiện tại; không tạo Reminder mới | PASS |
| UNIT-TASK-REMINDER-002 | `task-reminder.service.spec.ts` | Có một Task đến thời điểm cần nhắc | Tạo Reminder đúng `taskId`, `assignedUserId`, tiêu đề theo mã Task, nội dung chứa tiêu đề Task và thời hạn được định dạng theo múi giờ `Asia/Ho_Chi_Minh` | PASS |
| UNIT-TASK-REMINDER-003 | `task-reminder.service.spec.ts` | Task có `title = null` và `dueDate = null` | Sử dụng giá trị dự phòng cho nội dung Reminder, vẫn tạo thông báo nhắc việc đúng Task và người được phân công | PASS |
| UNIT-TASK-REMINDER-004 | `task-reminder.service.spec.ts` | Có nhiều Task cùng đến thời điểm cần nhắc | Tạo Reminder cho tất cả Task đến hạn, mỗi Task được tạo đúng một Reminder với đúng `taskId` và `assignedUserId` | PASS |

## Chức năng cấu hình Pipeline

| ID | Test Suite | Nội dung kiểm thử | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| UNIT-PIPELINE-001 | `pipeline-stages.service.spec.ts` | Lấy danh sách Pipeline Stage | Trả danh sách Stage với đúng `stageId`, `stageName`, `stageOrder` và `probability` | PASS |
| UNIT-PIPELINE-002 | `pipeline-stages.service.spec.ts` | Tạo Pipeline Stage hợp lệ | Tạo Stage mới với đúng tên, thứ tự và Probability; trả dữ liệu Stage sau khi tạo | PASS |
| UNIT-PIPELINE-003 | `pipeline-stages.service.spec.ts` | Tạo Pipeline Stage có tên đã tồn tại | Ném `ConflictException`; không tạo Stage mới | PASS |
| UNIT-PIPELINE-004 | `pipeline-stages.service.spec.ts` | Tạo Pipeline Stage có thứ tự đã tồn tại | Ném `ConflictException`; không tạo Stage mới | PASS |
| UNIT-PIPELINE-005 | `pipeline-stages.service.spec.ts` | Tạo mới Stage hệ thống có tên `Won` hoặc `Lost` | Ném `UnprocessableEntityException`; không cho tạo thêm Stage hệ thống `Won` hoặc `Lost` | PASS |
| UNIT-PIPELINE-006 | `pipeline-stages.service.spec.ts` | Cập nhật Pipeline Stage nhưng body rỗng | Ném `BadRequestException`; không gọi Repository cập nhật Stage | PASS |
| UNIT-PIPELINE-007 | `pipeline-stages.service.spec.ts` | Thay đổi Probability của Pipeline Stage | Cập nhật Probability của Stage và đồng bộ Probability cùng Expected Revenue của các Deal đang thuộc Stage đó | PASS |
| UNIT-PIPELINE-008 | `pipeline-stages.service.spec.ts` | Cập nhật Stage nhưng Probability không thay đổi | Cập nhật Stage nhưng không thực hiện đồng bộ lại Deal khi Probability giữ nguyên | PASS |
| UNIT-PIPELINE-009 | `pipeline-stages.service.spec.ts` | Thay đổi tên Stage hệ thống `Won` | Ném `UnprocessableEntityException`; không cho đổi tên Stage hệ thống `Won` | PASS |
| UNIT-PIPELINE-010 | `pipeline-stages.service.spec.ts` | Xóa Pipeline Stage đang được Deal sử dụng | Ném `UnprocessableEntityException`; không xóa Stage đang có Deal liên kết | PASS |
| UNIT-PIPELINE-011 | `pipeline-stages.service.spec.ts` | Xóa Pipeline Stage chưa được Deal sử dụng | Gọi Repository xóa đúng Stage và hoàn tất thao tác thành công | PASS |
| UNIT-PIPELINE-012 | `pipeline-stages.service.spec.ts` | Xóa Stage hệ thống `Lost` | Ném `UnprocessableEntityException`; không cho xóa Stage hệ thống `Lost` | PASS |

## 3. Kết quả tổng hợp

| Test Suite | Số test | Kết quả |
|---|---:|---|
| `app.controller.spec.ts` | 1 | PASS |
| `prisma.service.spec.ts` | 1 | PASS |
| `auth.controller.spec.ts` | 3 | PASS |
| `auth.service.spec.ts` | 7 | PASS |
| `reset-password.guard.spec.ts` | 4 | PASS |
| `leads.service.spec.ts` | 16 | PASS |
| `lead-assignments.service.spec.ts` | 7 | PASS |
| `users.service.spec.ts` | 23 | PASS |
| `products.service.spec.ts` | 20 | PASS |
| `activity-logs.service.spec.ts` | 12 | PASS |
| `customers.service.spec.ts` | 14 | PASS |
| `deals.service.spec.ts` | 55 | PASS |
| `pipeline-stages.service.spec.ts` | 12 | PASS |
| `quotes.service.spec.ts` | 18 | PASS |
| `tasks.service.spec.ts` | 29 | PASS |
| `task-reminder.service.spec.ts` | 4 | PASS |
| `notifications.service.spec.ts` | 8 | PASS |
| `dashboard.service.spec.ts` | 8 | PASS |
| `forecast.service.spec.ts` | 4 | PASS |
| `activities.service.spec.ts` | 24 | PASS |

Kết quả chạy toàn bộ Unit Test backend ngày 16/09/2026:

```text
Test Suites: 20 passed, 20 total
Tests:       270 passed, 270 total
Snapshots:   0 total
Time:        23.728 s
Ran all test suites.
```

**Kết luận:** 270/270 unit test PASS.

---


## 4. Lịch sử cập nhật

| Ngày | Nội dung | Tổng số test | Kết quả |
|---|---|---:|---|
| 10/08/2026 | Khởi tạo và hoàn thiện unit test backend | 10 | PASS |
| 15/08/2026 | unit test backend cho chức năng convert Lead into Customer | 11 | PASS |
| 21/08/2026 | Hoàn thiện unit test quản lý Users và thêm unit test quản lý Products | 36 | PASS |
| 22/08/2026 | unit test backend cho chức năng xem Activity Logs, quản lý Customer, Quản lý Deals và kéo thả giai đoạn pipeline | 53 | PASS |
| 23/08/2026 | unit test backend cho chức năng tạo quotes, chức năng quản lý tasks, chức năng thông báo | 49 | PASS |
| 26/08/2026 | unit test backend cho chức năng tạo và phân công Deal cho Sales Manager| 16 | PASS |
| 27/08/2026 | unit test backend Dashboard| 8 | PASS |
| 01/09/2026 | Bổ sung unit test phân quyền xóa Admin và bảo vệ Super Admin | 4 | PASS |
| 02/09/2026 | Hoàn thiện unit test backend cho chức năng quản lý Activities | 24 | PASS |
| 04/09/2026 | Bổ sung unit test BR10 cho lý do thất bại khi chuyển Deal sang Lost, BR33 phân quyền thay đổi Pipeline Stage và quyền Admin xem Deal | 9 | PASS |
| 04/09/2026 | Bổ sung unit test BR34 cho chức năng Forecast doanh thu theo kỳ | 4 | PASS |
| 11/09/2026 | Bổ sung Unit Test BR07 cho quyền Admin phân công Deal, BR11 kiểm tra Deal không có Customer hợp lệ và BR25 phân quyền phân công Lead | 7 | PASS |
| 11/09/2026 | Bổ sung Unit Test BR22, BR23, BR24 cho quản lý Quote và BR26, BR28 cho phân công Lead | 5 | PASS |
| 15/09/2026 | Bổ sung unit test bảo mật Reset Password, phân quyền Lead, xác nhận Quote, Task Reminder, phân bổ Deal cân đối, ưu tiên chăm sóc Deal và cấu hình Pipeline | 268 | PASS |
| 16/09/2026 | Bổ sung Unit Test BR03 kiểm tra không cho tạo Lead khi trùng email hoặc số điện thoại | 2 | PASS |