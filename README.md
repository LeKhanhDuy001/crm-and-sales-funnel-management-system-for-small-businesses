# **Đồ án ngành:** CRM System - Hệ Thống Quản Lý Khách Hàng Cho Doanh Nghiệp Nhỏ

## 📖 BỐI CẢNH ĐỀ TÀI

Các doanh nghiệp nhỏ thường lưu trữ thông tin khách hàng, cơ hội bán hàng bằng sổ sách hoặc Excel một cách rời rạc, dẫn đến khi có một nhân viên nghỉ thì thì bị mất dữ liệu, bỏ sót lead, không nắm được doanh thu sắp tới. Doanh nghiệp cần một hệ thống CRM phù hợp để quản lý việc bán hàng và thống kê dự báo doanh thu. Đề tài xây dựng hệ thống CRM tối ưu cho doanh nghiệp nhỏ với quy trình quản lý Deal dạng kéo – thả trực quan và dự báo doanh thu dựa trên xác suất thắng của từng cơ hội kinh doanh.

## 📌 PHẦN 1: TỔNG QUAN ĐỀ TÀI

### 💡 1. Ý nghĩa đề tài
Hệ thống CRM giúp doanh nghiệp xây dựng trải nghiệm khách hàng bền vững và tăng khả năng giữ chân khách hàng. Sử dụng mô hình CRM tích hợp hiện đại kết nối dữ liệu từ nhiều bộ phận, việc tích hợp này rất phù hợp cho các doanh nghiệp vừa và nhỏ để tiết kiệm chi phí, rút ngắn quy trình và tăng tương tác phản hồi đối với khách hàng.

### 👥 2. Đối tượng sử dụng
* **Quản lý (Admin / Manager):** Theo dõi thống kê, lập cơ sở dữ liệu về sản phẩm, khách hàng, thiết kế phễu, lập lịch hoặc chiến lược kinh doanh.
* **Nhân viên bán hàng (Sales Rep):** Tìm kiếm và nhập thông tin khách hàng; tư vấn, giới thiệu và báo giá sản phẩm; theo dõi và cập nhật tiến độ của khách hàng; phân công deal; đặt lịch hẹn.
* **Nhân viên chăm sóc khách hàng (Customer Service):** Tiếp nhận sự cố và phản hồi của khách hàng, xử lý sự cố, chăm sóc khách hàng định kỳ.

### 🛠️ 3. Phạm vi & Chức năng chính
* **Lead & Khách hàng:** Thu thập lead, chuyển đổi thành khách hàng, lưu thông tin liên hệ và lịch sử tương tác.
* **Deal & Pipeline:** Kéo-thả deal theo giai đoạn (stage); tính xác suất thắng, giá trị deal, giá trị kỳ vọng.
* **Hoạt động & Lịch chăm sóc:** Ghi lại cuộc gọi/email/cuộc hẹn; đặt lịch và nhắc chăm sóc khách hàng.
* **Sản phẩm & Báo giá:** Quản lý danh mục sản phẩm/dịch vụ; tạo báo giá gắn trực tiếp vào deal.
* **Nhắc việc & Thông báo:** Nhắc lịch chăm sóc, cảnh báo deal sắp đến hạn, thông báo khi được phân công công việc.
* **Báo cáo & Forecast:** Dự báo doanh thu theo pipeline; báo cáo hiệu suất theo nhân viên và theo từng giai đoạn.
* **Hệ thống:** Đăng nhập/Đăng xuất, phân quyền chi tiết theo vai trò (RBAC), nhật ký hoạt động (Audit log).

### 💻 4. Công nghệ sử dụng (Tech Stack)

#### **Front-end:**
* **Next.js (Framework cho React):** Xây dựng toàn bộ giao diện cho nhân viên sales, chăm sóc khách hàng và admin.
* **dnd-kit:** Thư viện xử lý tính năng kéo – thả các Deal qua từng giai đoạn trên phễu bán hàng.
* **Recharts:** Vẽ các biểu đồ phễu, biểu đồ cột dự báo doanh thu, báo cáo hiệu suất nhân viên.

#### **Back-end & Database:**
* **NestJS:** Framework xây dựng kiến trúc và xử lý toàn bộ logic nghiệp vụ hệ thống.
* **Prisma (ORM):** Làm cầu nối để NestJS tương tác an toàn và tối ưu với Cơ sở dữ liệu.
* **PostgreSQL:** Hệ quản trị cơ sở dữ liệu quan hệ lưu trữ dữ liệu tập trung.

---

## 🔍 PHẦN 2: PHÂN TÍCH HIỆN TRẠNG

### 🌟 Ưu điểm của giải pháp CRM
* **Quản lý dữ liệu tập trung:** CRM giúp lưu trữ tất cả thông tin khách hàng, lịch sử giao dịch và liên hệ một cách nhất quán, thay vì quản lý bằng sổ sách, trí nhớ hay Excel riêng lẻ (tránh mất dữ liệu khi nhân viên nghỉ việc).
* **Chuẩn hóa quy trình làm việc:** Hướng dẫn cho nhân viên sale biết cần làm gì ở từng bước, giúp đồng bộ tiến trình làm việc chuyên nghiệp.
* **Tự động hóa kênh tiếp thị:** Tích hợp tự động các nền tảng như Google hoặc Zalo để ghi nhận chính xác nguồn khách hàng, giúp doanh nghiệp tập trung ngân sách vào các kênh hiệu quả.

### ⚠️ Nhược điểm & Hạn chế
* **Chi phí & Thời gian đào tạo:** Doanh nghiệp phải tổ chức các chương trình đào tạo để nhân viên sale có thể làm quen và sử dụng thành thạo CRM.
* **Thay đổi thói quen nhập liệu:** Làm cho nhân viên sale bị gò mình vào quy trình và bắt buộc phải chủ động nhập dữ liệu liên tục.
* **Phụ thuộc vào giá trị sản phẩm:** CRM chỉ phát huy hiệu quả tốt đối với các sản phẩm hoặc dịch vụ có giá trị cao; đối với các sản phẩm giá trị thấp, CRM làm phức tạp hóa quy trình và lãng phí chi phí.