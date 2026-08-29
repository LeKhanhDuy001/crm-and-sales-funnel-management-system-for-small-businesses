# Ma trận truy vết Business Rule → Code → Test Case

| Mã BR | Nội dung quy tắc nghiệp vụ | Vị trí code | Test case phủ | Kết quả gần nhất |
|---|---|---|---|---|
| BR01 | Chỉ cho phép đăng nhập khi tài khoản tồn tại và mật khẩu chính xác | `src/backend/src/auth/auth.service.ts` → `login()` | `TC-AUTH-001`, `TC-AUTH-002`, `TC-AUTH-003` | PASS |
| BR02 | Người dùng chỉ được truy cập chức năng và dữ liệu theo vai trò | `RolesGuard`, các `Controller`, Service kiểm tra record-level | `TC-LEADS-012`, `TC-LEADS-013`, `TC-LEADS-015`, `TC-DEALS-001`, `TC-DEALS-004`, `TC-DEALS-013`, `TC-DEALS-018`, `TC-DEALS-024`, `TC-USERS-037` → `040`, `TC-PRODUCTS-030` → `033`, `TC-ACTIVITY-LOGS-018` → `021` | PASS theo các TC đã kiểm |
| BR03 | Email hoặc số điện thoại Lead mới không được trùng Lead hiện có | `src/backend/src/leads/leads.service.ts` → `ensureContactIsUnique()` | `TC-LEADS-005`, `TC-LEADS-006` | PASS |
| BR04 | Chỉ Lead chưa chuyển đổi và đủ điều kiện mới được chuyển thành Customer | `src/backend/src/leads/leads.service.ts` → luồng `convertLead()` | `TC-LEADS-014`, `TC-LEADS-016`, `TC-LEADS-017`, `TC-LEADS-018`, `TC-LEADS-019`, `TC-LEADS-020`, `TC-LEADS-021` | PASS |
| BR05 | Khi chuyển Lead phải tạo Customer mới và đổi Lead sang `Converted` | `src/backend/src/leads/repositories/leads.repository.ts` → `convertToCustomer()` | `TC-LEADS-014` | PASS |
| BR06 | Deal phải có Customer, người phụ trách và Pipeline Stage | `src/backend/src/deals/deals.service.ts` → `create()` | `TC-DEALS-002`, `TC-DEALS-003`, `TC-DEALS-004`, `TC-DEALS-005` | PASS |
| BR07 | Chỉ người có quyền được phân công/thay đổi người phụ trách Deal | `src/backend/src/deals/deals.service.ts` → `assign()` | `TC-DEALS-017`, `TC-DEALS-018`, `TC-DEALS-019`, `TC-DEALS-020`, `TC-DEALS-021` | PASS |
| BR08 | Khi đổi Pipeline Stage phải cập nhật Probability tương ứng | `src/backend/src/deals/deals.service.ts` → `changeStage()` | `TC-DEALS-022`, `TC-DEALS-027` | PASS |
| BR09 | Expected Revenue = Deal Value × Probability | `src/backend/src/deals/deals.service.ts` → `calculateExpectedRevenue()` | `TC-DEALS-002`, `TC-DEALS-011`, `TC-DEALS-022` | PASS |
| BR10 | Deal ở Won/Lost không được chuyển ngược về Stage trước | `src/backend/src/deals/deals.service.ts` → `changeStage()` | `TC-DEALS-025`, `TC-DEALS-026` | PASS |
| BR11 | Quote chỉ được tạo cho Deal tồn tại và Customer hợp lệ | `src/backend/src/quotes/quotes.service.ts` | `TC-QUOTE-004`, `TC-QUOTE-005`, `TC-QUOTE-012`, `TC-QUOTE-019` | PASS |
| BR12 | Đơn giá không âm, quantity > 0 và tổng tiền tính qua QuoteDetail | `src/backend/src/quotes/quotes.service.ts`, `quotes.repository.ts` | `TC-QUOTE-008`, `TC-QUOTE-009`, `TC-QUOTE-010`, `TC-QUOTE-015`, `TC-QUOTE-016`, `TC-QUOTE-017` | PASS |
| BR13 | Task phải có tiêu đề, người phụ trách, thời hạn và trạng thái | `src/backend/src/tasks/tasks.service.ts`, DTO Task | `TC-TASK-009`, `TC-TASK-010`, `TC-TASK-011`, `TC-TASK-014`, `TC-TASK-021`, `TC-TASK-022`, `TC-TASK-023` | PASS |
| BR14 | Khi Lead/Deal/Task được phân công phải tạo Notification cho người được giao | `deals.repository.ts`, `tasks.repository.ts`, luồng phân công Lead | `TC-DEALS-017`; các TC Lead/Task chưa xác nhận | Phủ một phần |
| BR15 | Activity phải gắn Customer hoặc Deal và có loại, thời gian, người thực hiện | Chưa triển khai module `activities` | Chưa có TC | ❌ Chưa triển khai |
| BR16 | Email User duy nhất và mật khẩu phải hash trước khi lưu | `src/backend/src/users/users.service.ts` → `create()`, `users.repository.ts` | `TC-USERS-014`, `TC-USERS-015`, `TC-USERS-020` | PASS theo bảng TC |
| BR17 | Giá Product > 0; Product đã nằm trong Quote không được xóa vật lý | `src/backend/src/products/products.service.ts` → `validatePrice()`, `remove()` | `TC-PRODUCTS-013`, `TC-PRODUCTS-014`, `TC-PRODUCTS-015`, `TC-PRODUCTS-028` | PASS theo bảng TC |
| BR18 | Thao tác người dùng phải được ghi Activity Log | Các Repository: `leads`, `deals`, `users`, `products`, `tasks`, `quotes`; module `activity-logs` dùng để truy vấn nhật ký | `TC-LEADS-014`, `TC-DEALS-002`, `TC-DEALS-011`, `TC-DEALS-014`, `TC-DEALS-017`, `TC-DEALS-022`, `TC-USERS-033` → `036`, `TC-PRODUCTS-035` → `037`, `TC-ACTIVITY-LOGS-010` → `014` | Chưa đạt đầy đủ: Login/Logout hiện chưa ghi log |
| BR19 | Dashboard chỉ tổng hợp dữ liệu theo quyền của từng role | `src/backend/src/dashboard/dashboard.service.ts` | `TC-DASHBOARD-001` → `TC-DASHBOARD-016` | PASS |
| BR20 | Dữ liệu đã phát sinh liên kết nghiệp vụ không được xóa vật lý | `leads.service.ts`, `deals.service.ts`, `users.service.ts`, `products.service.ts` | `TC-LEADS-011`, `TC-DEALS-015`, `TC-USERS-030`, `TC-PRODUCTS-028` | PASS theo các TC hiện có |
| BR21 | Chỉ Deal ở Proposal/Negotiation mới được tạo Quote | `src/backend/src/quotes/quotes.service.ts` | `TC-QUOTE-004`, `TC-QUOTE-005`, `TC-QUOTE-006`, `TC-QUOTE-007` | PASS |
| BR22 | Chỉ Quote trạng thái Draft mới được chỉnh sửa nội dung | `src/backend/src/quotes/quotes.service.ts` | `TC-QUOTE-020`, `TC-QUOTE-023`, `TC-QUOTE-025` | PASS |
| BR23 | Quote Confirmed không được sửa, hủy hoặc chuyển về trạng thái trước | `src/backend/src/quotes/quotes.service.ts` | `TC-QUOTE-022`, `TC-QUOTE-023`, `TC-QUOTE-026` | PASS |
| BR24 | Quote không xóa vật lý; Draft không dùng thì chuyển Cancelled | `src/backend/src/quotes/quotes.service.ts` | `TC-QUOTE-024`, `TC-QUOTE-025`, `TC-QUOTE-026` | PASS |
| BR25 | Chỉ Sales Manager được phân công Sales phụ trách Lead | `src/backend/src/leads/leads.service.ts` / controller phân công Lead | Chưa có trong bảng `TC-LEADS-001` → `021` hiện tại | Chưa phủ |
| BR26 | Lead chỉ được phân công cho Sales đang hoạt động | `src/backend/src/leads/leads.service.ts` → kiểm tra Sales được phân công | Chưa có trong bảng `TC-LEADS-001` → `021` hiện tại | Chưa phủ |
| BR27 | Sales chỉ được xem và xử lý Lead mình phụ trách | `src/backend/src/leads/leads.service.ts`, `leads.repository.ts` → filter `assignedUserId` | `TC-LEADS-012`, `TC-LEADS-013`, `TC-LEADS-015` | PASS |
| BR28 | Lead đã Converted không được phân công lại | `src/backend/src/leads/leads.service.ts` → luồng phân công Lead | Chưa có trong bảng `TC-LEADS-001` → `021` hiện tại | Chưa phủ |
| BR29 | Sales tạo Deal tự gán chính mình; Sales Manager tạo phải chọn Sales phụ trách | `src/backend/src/deals/deals.service.ts` → `create()` | `TC-DEALS-002`; `TC-DEALS-016` cần chỉnh để thể hiện rõ Sales Manager chọn Sales | Phủ một phần |