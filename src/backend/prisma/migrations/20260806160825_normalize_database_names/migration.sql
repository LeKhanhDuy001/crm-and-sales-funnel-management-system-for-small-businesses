BEGIN;

ALTER TABLE "activitylogs"
RENAME TO "activity_logs";

ALTER TABLE "leadsources"
RENAME TO "lead_sources";

ALTER TABLE "pipelinestages"
RENAME TO "pipeline_stages";

ALTER TABLE "quotedetails"
RENAME TO "quote_details";

-- Bảng activities

ALTER TABLE "activities"
RENAME COLUMN "activityid" TO "id";

ALTER TABLE "activities"
RENAME COLUMN "dealid" TO "deal_id";

ALTER TABLE "activities"
RENAME COLUMN "userid" TO "user_id";

ALTER TABLE "activities"
RENAME COLUMN "activitytype" TO "activity_type";

ALTER TABLE "activities"
RENAME COLUMN "activitytime" TO "activity_time";

-- Bảng activity_logs

ALTER TABLE "activity_logs"
RENAME COLUMN "logid" TO "id";

ALTER TABLE "activity_logs"
RENAME COLUMN "userid" TO "user_id";

ALTER TABLE "activity_logs"
RENAME COLUMN "tablename" TO "table_name";

ALTER TABLE "activity_logs"
RENAME COLUMN "recordid" TO "record_id";

ALTER TABLE "activity_logs"
RENAME COLUMN "actiontime" TO "action_time";

ALTER TABLE "activity_logs"
RENAME COLUMN "ipaddress" TO "ip_address";

-- Bảng customers

ALTER TABLE "customers"
RENAME COLUMN "customerid" TO "id";

ALTER TABLE "customers"
RENAME COLUMN "leadid" TO "lead_id";

ALTER TABLE "customers"
RENAME COLUMN "fullname" TO "full_name";

ALTER TABLE "customers"
RENAME COLUMN "customertype" TO "customer_type";

ALTER TABLE "customers"
RENAME COLUMN "createddate" TO "created_at";

-- Bảng deals

ALTER TABLE "deals"
RENAME COLUMN "dealid" TO "id";

ALTER TABLE "deals"
RENAME COLUMN "customerid" TO "customer_id";

ALTER TABLE "deals"
RENAME COLUMN "assigneduserid" TO "assigned_user_id";

ALTER TABLE "deals"
RENAME COLUMN "stageid" TO "stage_id";

ALTER TABLE "deals"
RENAME COLUMN "dealname" TO "deal_name";

ALTER TABLE "deals"
RENAME COLUMN "dealvalue" TO "deal_value";

ALTER TABLE "deals"
RENAME COLUMN "expectedrevenue" TO "expected_revenue";

ALTER TABLE "deals"
RENAME COLUMN "expectedclosedate" TO "expected_close_date";

ALTER TABLE "deals"
RENAME COLUMN "createddate" TO "created_at";

-- Bảng leads

ALTER TABLE "leads"
RENAME COLUMN "leadid" TO "id";

ALTER TABLE "leads"
RENAME COLUMN "sourceid" TO "source_id";

ALTER TABLE "leads"
RENAME COLUMN "assigneduserid" TO "assigned_user_id";

ALTER TABLE "leads"
RENAME COLUMN "fullname" TO "full_name";

ALTER TABLE "leads"
RENAME COLUMN "createddate" TO "created_at";

-- Bảng lead_sources

ALTER TABLE "lead_sources"
RENAME COLUMN "sourceid" TO "id";

ALTER TABLE "lead_sources"
RENAME COLUMN "sourcename" TO "source_name";

-- Bảng notifications

ALTER TABLE "notifications"
RENAME COLUMN "notificationid" TO "id";

ALTER TABLE "notifications"
RENAME COLUMN "userid" TO "user_id";

ALTER TABLE "notifications"
RENAME COLUMN "isread" TO "is_read";

ALTER TABLE "notifications"
RENAME COLUMN "createddate" TO "created_at";

-- Bảng pipeline_stages

ALTER TABLE "pipeline_stages"
RENAME COLUMN "stageid" TO "id";

ALTER TABLE "pipeline_stages"
RENAME COLUMN "stagename" TO "stage_name";

ALTER TABLE "pipeline_stages"
RENAME COLUMN "stageorder" TO "stage_order";

-- Bảng products

ALTER TABLE "products"
RENAME COLUMN "productid" TO "id";

ALTER TABLE "products"
RENAME COLUMN "productname" TO "product_name";

-- Bảng quote_details

ALTER TABLE "quote_details"
RENAME COLUMN "quotedetailid" TO "id";

ALTER TABLE "quote_details"
RENAME COLUMN "quoteid" TO "quote_id";

ALTER TABLE "quote_details"
RENAME COLUMN "productid" TO "product_id";

ALTER TABLE "quote_details"
RENAME COLUMN "unitprice" TO "unit_price";

-- Bảng quotes

ALTER TABLE "quotes"
RENAME COLUMN "quoteid" TO "id";

ALTER TABLE "quotes"
RENAME COLUMN "dealid" TO "deal_id";

ALTER TABLE "quotes"
RENAME COLUMN "quotedate" TO "quote_date";

ALTER TABLE "quotes"
RENAME COLUMN "totalamount" TO "total_amount";

ALTER TABLE "quotes"
RENAME COLUMN "createdby" TO "created_by";

-- Bảng roles

ALTER TABLE "roles"
RENAME COLUMN "roleid" TO "id";

ALTER TABLE "roles"
RENAME COLUMN "rolename" TO "role_name";

-- Bảng tasks

ALTER TABLE "tasks"
RENAME COLUMN "taskid" TO "id";

ALTER TABLE "tasks"
RENAME COLUMN "dealid" TO "deal_id";

ALTER TABLE "tasks"
RENAME COLUMN "assigneduserid" TO "assigned_user_id";

ALTER TABLE "tasks"
RENAME COLUMN "duedate" TO "due_date";

ALTER TABLE "tasks"
RENAME COLUMN "remindertime" TO "reminder_time";

-- Bảng users

ALTER TABLE "users"
RENAME COLUMN "userid" TO "id";

ALTER TABLE "users"
RENAME COLUMN "roleid" TO "role_id";

ALTER TABLE "users"
RENAME COLUMN "fullname" TO "full_name";

ALTER TABLE "users"
RENAME COLUMN "passwordhash" TO "password_hash";

ALTER TABLE "users"
RENAME COLUMN "createdat" TO "created_at";

-- Index cho khóa ngoại và các trường thường tìm kiếm

CREATE INDEX "activities_deal_id_idx"
ON "activities" ("deal_id");

CREATE INDEX "activities_user_id_idx"
ON "activities" ("user_id");

CREATE INDEX "activity_logs_user_id_idx"
ON "activity_logs" ("user_id");

CREATE INDEX "activity_logs_action_time_idx"
ON "activity_logs" ("action_time");

CREATE INDEX "customers_email_idx"
ON "customers" ("email");

CREATE INDEX "customers_phone_idx"
ON "customers" ("phone");

CREATE INDEX "deals_customer_id_idx"
ON "deals" ("customer_id");

CREATE INDEX "deals_assigned_user_id_idx"
ON "deals" ("assigned_user_id");

CREATE INDEX "deals_stage_id_idx"
ON "deals" ("stage_id");

CREATE INDEX "deals_status_idx"
ON "deals" ("status");

CREATE INDEX "leads_source_id_idx"
ON "leads" ("source_id");

CREATE INDEX "leads_assigned_user_id_idx"
ON "leads" ("assigned_user_id");

CREATE INDEX "leads_status_idx"
ON "leads" ("status");

CREATE INDEX "leads_email_idx"
ON "leads" ("email");

CREATE INDEX "leads_phone_idx"
ON "leads" ("phone");

CREATE INDEX "notifications_user_id_is_read_idx"
ON "notifications" ("user_id", "is_read");

CREATE INDEX "products_category_idx"
ON "products" ("category");

CREATE INDEX "products_status_idx"
ON "products" ("status");

CREATE INDEX "quote_details_quote_id_idx"
ON "quote_details" ("quote_id");

CREATE INDEX "quote_details_product_id_idx"
ON "quote_details" ("product_id");

CREATE INDEX "quotes_deal_id_idx"
ON "quotes" ("deal_id");

CREATE INDEX "quotes_created_by_idx"
ON "quotes" ("created_by");

CREATE INDEX "quotes_status_idx"
ON "quotes" ("status");

CREATE INDEX "tasks_deal_id_idx"
ON "tasks" ("deal_id");

CREATE INDEX "tasks_assigned_user_id_idx"
ON "tasks" ("assigned_user_id");

CREATE INDEX "tasks_status_idx"
ON "tasks" ("status");

CREATE INDEX "tasks_due_date_idx"
ON "tasks" ("due_date");

CREATE INDEX "users_role_id_idx"
ON "users" ("role_id");

CREATE INDEX "users_status_idx"
ON "users" ("status");

COMMIT;