--
-- PostgreSQL database dump
--

\restrict M9FE4wDO97lqAmCGmfihyUiaAJeDQ1dh4PNDcWnaVG0NiOJacyoAUA1YpyQ70CL

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: lead_sources; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.lead_sources (id, source_name) VALUES (1, 'Facebook');
INSERT INTO public.lead_sources (id, source_name) VALUES (2, 'Website');
INSERT INTO public.lead_sources (id, source_name) VALUES (3, 'Google');
INSERT INTO public.lead_sources (id, source_name) VALUES (4, 'TikTok');
INSERT INTO public.lead_sources (id, source_name) VALUES (5, 'Email');
INSERT INTO public.lead_sources (id, source_name) VALUES (6, 'Referral');
INSERT INTO public.lead_sources (id, source_name) VALUES (9, 'Google Ads');
INSERT INTO public.lead_sources (id, source_name) VALUES (10, 'Giới thiệu');
INSERT INTO public.lead_sources (id, source_name) VALUES (11, 'Sự kiện');
INSERT INTO public.lead_sources (id, source_name) VALUES (12, 'Email Marketing');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.roles (id, role_name, description) VALUES (1, 'Admin', 'Quản trị toàn bộ hệ thống');
INSERT INTO public.roles (id, role_name, description) VALUES (2, 'Sales Manager', 'Quản lý hoạt động bán hàng');
INSERT INTO public.roles (id, role_name, description) VALUES (3, 'Sales', 'Nhân viên kinh doanh');
INSERT INTO public.roles (id, role_name, description) VALUES (4, 'Marketing', 'Nhân viên marketing');
INSERT INTO public.roles (id, role_name, description) VALUES (9, 'Customer Care', 'Nhân viên chăm sóc khách hàng');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (1, 1, 'Nguyễn Văn Admin', 'admin@crm.com', '$2b$10$Ly7FuWpnaAb5/czhP4n/8uGXd52PDWDc.CuFSyIX9R9YqhM4IRQxq', '0901000001', true, '2026-07-31 18:29:20.020013');
INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (2, 2, 'Trần Thị Quản Lý', 'salesmanager@crm.com', '$2b$10$Ly7FuWpnaAb5/czhP4n/8uGXd52PDWDc.CuFSyIX9R9YqhM4IRQxq', '0901000002', true, '2026-07-31 18:29:20.020013');
INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (3, 3, 'Lê Minh Kinh Doanh', 'sales@crm.com', '$2b$10$Ly7FuWpnaAb5/czhP4n/8uGXd52PDWDc.CuFSyIX9R9YqhM4IRQxq', '0901000003', true, '2026-07-31 18:29:20.020013');
INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (4, 4, 'Phạm Thị Marketing', 'marketing@crm.com', '$2b$10$Ly7FuWpnaAb5/czhP4n/8uGXd52PDWDc.CuFSyIX9R9YqhM4IRQxq', '0901000004', true, '2026-07-31 18:29:20.020013');
INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (5, 9, 'Võ Thị Chăm Sóc', 'customercare@crm.com', '$2b$10$Ly7FuWpnaAb5/czhP4n/8uGXd52PDWDc.CuFSyIX9R9YqhM4IRQxq', '0901000005', true, '2026-07-31 18:29:20.020013');
INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (6, 1, 'Quản trị viên Demo', 'admin.demo@crm.local', '$2b$12$zT9gq4pQeeNOXXaxZvORf.p.gv7walrPXxNmoBYfzVFmK58.O7RaS', '0900000001', true, '2026-08-06 16:33:08.118');
INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (7, 2, 'Quản lý kinh doanh Demo', 'sales.manager.demo@crm.local', '$2b$12$zT9gq4pQeeNOXXaxZvORf.p.gv7walrPXxNmoBYfzVFmK58.O7RaS', '0900000002', true, '2026-08-06 16:33:08.126');
INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (8, 3, 'Nhân viên kinh doanh Demo', 'sales.demo@crm.local', '$2b$12$zT9gq4pQeeNOXXaxZvORf.p.gv7walrPXxNmoBYfzVFmK58.O7RaS', '0900000003', true, '2026-08-06 16:33:08.127');
INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (9, 4, 'Nhân viên Marketing Demo', 'marketing.demo@crm.local', '$2b$12$zT9gq4pQeeNOXXaxZvORf.p.gv7walrPXxNmoBYfzVFmK58.O7RaS', '0900000004', true, '2026-08-06 16:33:08.128');
INSERT INTO public.users (id, role_id, full_name, email, password_hash, phone, status, created_at) VALUES (10, 9, 'Nhân viên chăm sóc khách hàng Demo', 'customer.care.demo@crm.local', '$2b$12$zT9gq4pQeeNOXXaxZvORf.p.gv7walrPXxNmoBYfzVFmK58.O7RaS', '0900000005', true, '2026-08-06 16:33:08.129');


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (1, 2, 3, 'Nguyễn Hoàng Nam', 'Công ty Nam Việt', '0911000001', 'nam@namviet.vn', 'Quận 1, TP.HCM', 'New', '2026-07-31 18:29:20.020013');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (2, 1, 4, 'Trần Thị Thu Hà', 'Công ty Hà Thành', '0911000002', 'ha@hathanh.vn', 'Quận Bình Thạnh, TP.HCM', 'Contacted', '2026-07-31 18:29:20.020013');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (3, 9, 3, 'Lê Minh Tuấn', 'Công ty Minh Phát', '0911000003', 'tuan@minhphat.vn', 'TP. Thủ Đức, TP.HCM', 'Qualified', '2026-07-31 18:29:20.020013');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (4, 10, 2, 'Phạm Quốc Huy', 'Công ty Quốc Huy', '0911000004', 'huy@quochuy.vn', 'Quận 7, TP.HCM', 'Qualified', '2026-07-31 18:29:20.020013');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (5, 11, 4, 'Võ Ngọc Lan', 'Công ty Lan Anh', '0911000005', 'lan@lananh.vn', 'Quận 3, TP.HCM', 'New', '2026-07-31 18:29:20.020013');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (6, 12, 3, 'Đặng Thành Công', 'Công ty Thành Công', '0911000006', 'cong@thanhcong.vn', 'Quận Tân Bình, TP.HCM', 'Contacted', '2026-07-31 18:29:20.020013');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (7, 2, 3, 'Bùi Thanh Tâm', 'Công ty Tâm Phúc', '0911000007', 'tam@tamphuc.vn', 'Quận Gò Vấp, TP.HCM', 'Qualified', '2026-07-31 18:29:20.020013');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (8, 1, 4, 'Ngô Bảo Trân', 'Công ty Bảo Trân', '0911000008', 'tran@baotran.vn', 'Quận Phú Nhuận, TP.HCM', 'New', '2026-07-31 18:29:20.020013');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (9, 2, 8, 'Công ty Minh Anh Demo', 'Minh Anh', '0911000001', 'lead.new.demo@crm.local', 'TP. Hồ Chí Minh', 'New', '2026-08-06 16:33:08.168');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (10, 1, 8, 'Công ty Hoàng Gia Demo', 'Hoàng Gia', '0911000002', 'lead.qualified.demo@crm.local', 'TP. Hồ Chí Minh', 'Qualified', '2026-08-06 16:33:08.172');
INSERT INTO public.leads (id, source_id, assigned_user_id, full_name, company, phone, email, address, status, created_at) VALUES (11, 6, 7, 'Công ty Đại Phát Demo', 'Đại Phát', '0911000003', 'lead.converted.demo@crm.local', 'TP. Hồ Chí Minh', 'Converted', '2026-08-06 16:33:08.174');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.customers (id, lead_id, full_name, company, phone, email, address, customer_type, created_at) VALUES (1, 3, 'Lê Minh Tuấn', 'Công ty Minh Phát', '0911000003', 'tuan@minhphat.vn', 'TP. Thủ Đức, TP.HCM', 'Doanh nghiệp', '2026-07-31 18:29:20.020013');
INSERT INTO public.customers (id, lead_id, full_name, company, phone, email, address, customer_type, created_at) VALUES (2, 4, 'Phạm Quốc Huy', 'Công ty Quốc Huy', '0911000004', 'huy@quochuy.vn', 'Quận 7, TP.HCM', 'Doanh nghiệp', '2026-07-31 18:29:20.020013');
INSERT INTO public.customers (id, lead_id, full_name, company, phone, email, address, customer_type, created_at) VALUES (3, 7, 'Bùi Thanh Tâm', 'Công ty Tâm Phúc', '0911000007', 'tam@tamphuc.vn', 'Quận Gò Vấp, TP.HCM', 'Doanh nghiệp', '2026-07-31 18:29:20.020013');
INSERT INTO public.customers (id, lead_id, full_name, company, phone, email, address, customer_type, created_at) VALUES (4, NULL, 'Nguyễn Thị Mai', 'Công ty Mai Gia', '0922000001', 'mai@maigia.vn', 'Quận 10, TP.HCM', 'Doanh nghiệp', '2026-07-31 18:29:20.020013');
INSERT INTO public.customers (id, lead_id, full_name, company, phone, email, address, customer_type, created_at) VALUES (5, NULL, 'Trần Quốc Bình', 'Hộ kinh doanh Quốc Bình', '0922000002', 'binh@quocbinh.vn', 'Quận 5, TP.HCM', 'Cá nhân', '2026-07-31 18:29:20.020013');
INSERT INTO public.customers (id, lead_id, full_name, company, phone, email, address, customer_type, created_at) VALUES (6, 11, 'Công ty Đại Phát Demo', 'Đại Phát', '0911000003', 'customer.demo@crm.local', 'TP. Hồ Chí Minh', 'Doanh nghiệp', '2026-08-06 16:33:08.179');


--
-- Data for Name: pipeline_stages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (1, 'Lead', 1);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (2, 'Qualified', 2);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (6, 'Lost', 6);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (7, 'Tiếp cận', 1);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (8, 'Xác định nhu cầu', 2);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (9, 'Đề xuất báo giá', 3);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (10, 'Đàm phán', 4);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (11, 'Thành công', 5);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (12, 'Thất bại', 6);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (13, 'Qualification', 1);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (3, 'Proposal', 2);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (4, 'Negotiation', 3);
INSERT INTO public.pipeline_stages (id, stage_name, stage_order) VALUES (5, 'Won', 4);


--
-- Data for Name: deals; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.deals (id, customer_id, assigned_user_id, stage_id, deal_name, deal_value, probability, expected_revenue, expected_close_date, status, created_at) VALUES (1, 1, 3, 9, 'Triển khai CRM Standard cho Minh Phát', 18000000.00, 70, 12600000.00, '2026-08-20', 'Open', '2026-07-31 18:29:20.020013');
INSERT INTO public.deals (id, customer_id, assigned_user_id, stage_id, deal_name, deal_value, probability, expected_revenue, expected_close_date, status, created_at) VALUES (2, 2, 2, 10, 'CRM Enterprise cho Quốc Huy', 39000000.00, 80, 31200000.00, '2026-08-15', 'Open', '2026-07-31 18:29:20.020013');
INSERT INTO public.deals (id, customer_id, assigned_user_id, stage_id, deal_name, deal_value, probability, expected_revenue, expected_close_date, status, created_at) VALUES (3, 3, 3, 8, 'CRM Basic cho Tâm Phúc', 8000000.00, 50, 4000000.00, '2026-08-30', 'Open', '2026-07-31 18:29:20.020013');
INSERT INTO public.deals (id, customer_id, assigned_user_id, stage_id, deal_name, deal_value, probability, expected_revenue, expected_close_date, status, created_at) VALUES (4, 4, 3, 11, 'Gói CRM Standard cho Mai Gia', 21000000.00, 100, 21000000.00, '2026-07-26', 'Won', '2026-07-31 18:29:20.020013');
INSERT INTO public.deals (id, customer_id, assigned_user_id, stage_id, deal_name, deal_value, probability, expected_revenue, expected_close_date, status, created_at) VALUES (5, 5, 2, 12, 'Gói CRM Basic cho Quốc Bình', 7500000.00, 0, 0.00, '2026-07-21', 'Lost', '2026-07-31 18:29:20.020013');
INSERT INTO public.deals (id, customer_id, assigned_user_id, stage_id, deal_name, deal_value, probability, expected_revenue, expected_close_date, status, created_at) VALUES (6, 6, 8, 13, 'Demo - Tư vấn CRM', 15000000.00, 30, 4500000.00, '2026-09-30', 'Open', '2026-08-06 16:33:08.186');
INSERT INTO public.deals (id, customer_id, assigned_user_id, stage_id, deal_name, deal_value, probability, expected_revenue, expected_close_date, status, created_at) VALUES (7, 6, 8, 3, 'Demo - Triển khai CRM Starter', 24000000.00, 60, 14400000.00, '2026-09-30', 'Open', '2026-08-06 16:33:08.189');
INSERT INTO public.deals (id, customer_id, assigned_user_id, stage_id, deal_name, deal_value, probability, expected_revenue, expected_close_date, status, created_at) VALUES (8, 6, 8, 5, 'Demo - Đào tạo CRM', 10000000.00, 100, 10000000.00, '2026-09-30', 'Won', '2026-08-06 16:33:08.193');


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.activities (id, deal_id, user_id, activity_type, subject, description, activity_time, result) VALUES (1, 1, 3, 'Call', 'Gọi tư vấn CRM Standard', 'Đã trao đổi về nhu cầu quản lý khách hàng và bán hàng', '2026-07-29 18:29:20.020013', 'Khách hàng quan tâm và yêu cầu báo giá');
INSERT INTO public.activities (id, deal_id, user_id, activity_type, subject, description, activity_time, result) VALUES (2, 2, 2, 'Meeting', 'Họp giới thiệu CRM Enterprise', 'Trình bày các chức năng và kế hoạch triển khai', '2026-07-28 18:29:20.020013', 'Khách hàng yêu cầu điều chỉnh giá');
INSERT INTO public.activities (id, deal_id, user_id, activity_type, subject, description, activity_time, result) VALUES (3, 1, 3, 'Email', 'Gửi báo giá cho Minh Phát', 'Đã gửi báo giá CRM Standard và gói triển khai', '2026-07-30 18:29:20.020013', 'Đã gửi thành công');
INSERT INTO public.activities (id, deal_id, user_id, activity_type, subject, description, activity_time, result) VALUES (4, 4, 5, 'Call', 'Chăm sóc khách hàng Mai Gia', 'Gọi hỏi thăm sau khi hoàn tất giao dịch', '2026-07-30 18:29:20.020013', 'Khách hàng hài lòng');
INSERT INTO public.activities (id, deal_id, user_id, activity_type, subject, description, activity_time, result) VALUES (5, 7, 8, 'Call', 'Demo - Trao đổi nhu cầu CRM', 'Khách hàng quan tâm gói CRM Starter', '2026-08-06 16:33:08.229', 'Khách hàng đồng ý nhận báo giá');


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.activity_logs (id, user_id, action, table_name, record_id, action_time, ip_address) VALUES (1, 1, 'Login', 'users', 1, '2026-07-31 16:29:20.020013', '127.0.0.1');
INSERT INTO public.activity_logs (id, user_id, action, table_name, record_id, action_time, ip_address) VALUES (2, 4, 'Create', 'leads', 1, '2026-07-30 18:29:20.020013', '127.0.0.1');
INSERT INTO public.activity_logs (id, user_id, action, table_name, record_id, action_time, ip_address) VALUES (3, 3, 'Send Quote', 'quotes', 1, '2026-07-30 18:29:20.020013', '127.0.0.1');
INSERT INTO public.activity_logs (id, user_id, action, table_name, record_id, action_time, ip_address) VALUES (4, 8, 'Create', 'deals', 7, '2026-08-06 16:33:08.243', '127.0.0.1');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.notifications (id, user_id, title, content, type, is_read, created_at) VALUES (1, 3, 'Có khách hàng tiềm năng mới', 'Bạn vừa được phân công phụ trách khách hàng Nguyễn Hoàng Nam.', 'Lead', false, '2026-07-31 18:29:20.020013');
INSERT INTO public.notifications (id, user_id, title, content, type, is_read, created_at) VALUES (2, 2, 'Cần duyệt báo giá', 'Báo giá CRM Enterprise của khách hàng Quốc Huy đang chờ xem xét.', 'Quote', false, '2026-07-31 18:29:20.020013');
INSERT INTO public.notifications (id, user_id, title, content, type, is_read, created_at) VALUES (3, 5, 'Nhiệm vụ chăm sóc khách hàng', 'Bạn có nhiệm vụ chăm sóc sau bán hàng cho khách hàng Mai Gia.', 'Task', false, '2026-07-31 18:29:20.020013');
INSERT INTO public.notifications (id, user_id, title, content, type, is_read, created_at) VALUES (4, 4, 'Chiến dịch có Lead mới', 'Chiến dịch Facebook vừa ghi nhận khách hàng tiềm năng mới.', 'Marketing', true, '2026-07-31 18:29:20.020013');
INSERT INTO public.notifications (id, user_id, title, content, type, is_read, created_at) VALUES (5, 8, 'Deal demo mới được phân công', 'Bạn được phân công phụ trách Deal demo CRM.', 'Assignment', false, '2026-08-06 16:33:08.236');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (1, 'CRM Enterprise', 'Phần mềm', 25000000.00, 'Gói CRM đầy đủ dành cho doanh nghiệp lớn', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (2, 'Module Customer Care', 'Tiện ích', 6500000.00, 'Quản lý hoạt động chăm sóc khách hàng', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (3, 'Gói bảo trì 12 tháng', 'Dịch vụ', 6000000.00, 'Bảo trì và hỗ trợ kỹ thuật trong 12 tháng', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (4, 'Gói đào tạo người dùng', 'Dịch vụ', 3000000.00, 'Đào tạo nhân viên sử dụng hệ thống', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (5, 'CRM Basic', 'Phần mềm', 5000000.00, 'Gói CRM cơ bản dành cho doanh nghiệp nhỏ', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (6, 'CRM Standard', 'Phần mềm', 10000000.00, 'Gói CRM tiêu chuẩn dành cho doanh nghiệp vừa', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (7, 'Module Sales', 'Tiện ích', 7000000.00, 'Quản lý cơ hội và quy trình bán hàng', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (8, 'Tích hợp Email', 'Tích hợp', 2500000.00, 'Tích hợp gửi và nhận email trên hệ thống', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (9, 'Gói triển khai hệ thống', 'Dịch vụ', 8000000.00, 'Cài đặt và cấu hình hệ thống CRM', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (10, 'Module Marketing', 'Tiện ích', 7000000.00, 'Quản lý chiến dịch marketing và khách hàng tiềm năng', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (11, 'Gói CRM Starter Demo', 'Phần mềm', 3500000.00, 'Gói CRM dành cho doanh nghiệp nhỏ', true);
INSERT INTO public.products (id, product_name, category, price, description, status) VALUES (12, 'Dịch vụ đào tạo CRM Demo', 'Dịch vụ', 5000000.00, 'Đào tạo sử dụng hệ thống CRM', true);


--
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.quotes (id, deal_id, quote_date, total_amount, status, created_by) VALUES (1, 1, '2026-07-31', 18000000.00, 'Sent', 3);
INSERT INTO public.quotes (id, deal_id, quote_date, total_amount, status, created_by) VALUES (2, 2, '2026-07-29', 39000000.00, 'Negotiating', 2);
INSERT INTO public.quotes (id, deal_id, quote_date, total_amount, status, created_by) VALUES (3, 4, '2026-07-21', 21000000.00, 'Accepted', 3);
INSERT INTO public.quotes (id, deal_id, quote_date, total_amount, status, created_by) VALUES (4, 7, '2026-08-06', 12000000.00, 'Draft', 8);


--
-- Data for Name: quote_details; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (1, 1, 6, 1, 10000000.00, 0.00, 10000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (2, 1, 9, 1, 8000000.00, 0.00, 8000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (3, 2, 1, 1, 25000000.00, 0.00, 25000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (4, 2, 9, 1, 8000000.00, 0.00, 8000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (5, 2, 4, 1, 3000000.00, 0.00, 3000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (6, 2, 3, 1, 6000000.00, 50.00, 3000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (7, 3, 6, 1, 10000000.00, 0.00, 10000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (8, 3, 9, 1, 8000000.00, 0.00, 8000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (9, 3, 4, 1, 3000000.00, 0.00, 3000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (10, 4, 11, 2, 3500000.00, 0.00, 7000000.00);
INSERT INTO public.quote_details (id, quote_id, product_id, quantity, unit_price, discount, total) VALUES (11, 4, 12, 1, 5000000.00, 0.00, 5000000.00);


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tasks (id, deal_id, assigned_user_id, title, description, due_date, reminder_time, priority, status) VALUES (1, 1, 3, 'Gọi xác nhận nhu cầu khách hàng Minh Phát', 'Trao đổi lại số lượng người dùng và các module cần triển khai', '2026-08-02 18:29:20.020013', '2026-08-01 18:29:20.020013', 'High', 'Pending');
INSERT INTO public.tasks (id, deal_id, assigned_user_id, title, description, due_date, reminder_time, priority, status) VALUES (2, 2, 2, 'Đàm phán giá với Quốc Huy', 'Thảo luận chiết khấu và thời gian triển khai', '2026-08-03 18:29:20.020013', '2026-08-02 18:29:20.020013', 'High', 'In Progress');
INSERT INTO public.tasks (id, deal_id, assigned_user_id, title, description, due_date, reminder_time, priority, status) VALUES (3, 3, 3, 'Khảo sát nhu cầu Tâm Phúc', 'Thu thập yêu cầu sử dụng CRM của khách hàng', '2026-08-05 18:29:20.020013', '2026-08-04 18:29:20.020013', 'Medium', 'Pending');
INSERT INTO public.tasks (id, deal_id, assigned_user_id, title, description, due_date, reminder_time, priority, status) VALUES (4, 4, 5, 'Chăm sóc sau bán hàng Mai Gia', 'Liên hệ kiểm tra tình trạng sử dụng sản phẩm', '2026-08-07 18:29:20.020013', '2026-08-06 18:29:20.020013', 'Medium', 'Pending');
INSERT INTO public.tasks (id, deal_id, assigned_user_id, title, description, due_date, reminder_time, priority, status) VALUES (5, 6, 8, 'Demo - Gọi xác nhận nhu cầu', 'Công việc mẫu phục vụ trình diễn hệ thống', '2026-09-15 02:00:00', NULL, 'High', 'Pending');
INSERT INTO public.tasks (id, deal_id, assigned_user_id, title, description, due_date, reminder_time, priority, status) VALUES (6, 7, 8, 'Demo - Gửi báo giá CRM', 'Công việc mẫu phục vụ trình diễn hệ thống', '2026-09-15 02:00:00', NULL, 'High', 'In Progress');


--
-- Name: activities_activityid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activities_activityid_seq', 5, true);


--
-- Name: activitylogs_logid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activitylogs_logid_seq', 4, true);


--
-- Name: customers_customerid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customers_customerid_seq', 6, true);


--
-- Name: deals_dealid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.deals_dealid_seq', 8, true);


--
-- Name: leads_leadid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leads_leadid_seq', 11, true);


--
-- Name: leadsources_sourceid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leadsources_sourceid_seq', 12, true);


--
-- Name: notifications_notificationid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_notificationid_seq', 5, true);


--
-- Name: pipelinestages_stageid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pipelinestages_stageid_seq', 13, true);


--
-- Name: products_productid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_productid_seq', 12, true);


--
-- Name: quotedetails_quotedetailid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quotedetails_quotedetailid_seq', 11, true);


--
-- Name: quotes_quoteid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quotes_quoteid_seq', 4, true);


--
-- Name: roles_roleid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_roleid_seq', 19, true);


--
-- Name: tasks_taskid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tasks_taskid_seq', 6, true);


--
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_userid_seq', 15, true);


--
-- PostgreSQL database dump complete
--

\unrestrict M9FE4wDO97lqAmCGmfihyUiaAJeDQ1dh4PNDcWnaVG0NiOJacyoAUA1YpyQ70CL

