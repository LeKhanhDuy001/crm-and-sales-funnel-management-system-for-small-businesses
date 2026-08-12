-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "action_type" AS ENUM ('Login', 'Logout', 'Create', 'Update', 'Delete', 'Assign', 'Convert', 'Send Quote', 'Change Stage');

-- CreateTable
CREATE TABLE "activities" (
    "activityid" SERIAL NOT NULL,
    "dealid" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,
    "activitytype" VARCHAR(30),
    "subject" VARCHAR(200),
    "description" TEXT,
    "activitytime" TIMESTAMP(6),
    "result" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("activityid")
);

-- CreateTable
CREATE TABLE "activitylogs" (
    "logid" SERIAL NOT NULL,
    "userid" INTEGER,
    "action" "action_type",
    "tablename" VARCHAR(100),
    "recordid" INTEGER,
    "actiontime" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ipaddress" VARCHAR(50),

    CONSTRAINT "activitylogs_pkey" PRIMARY KEY ("logid")
);

-- CreateTable
CREATE TABLE "customers" (
    "customerid" SERIAL NOT NULL,
    "leadid" INTEGER,
    "fullname" VARCHAR(100) NOT NULL,
    "company" VARCHAR(150),
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "address" TEXT,
    "customertype" VARCHAR(50),
    "createddate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customerid")
);

-- CreateTable
CREATE TABLE "deals" (
    "dealid" SERIAL NOT NULL,
    "customerid" INTEGER NOT NULL,
    "assigneduserid" INTEGER NOT NULL,
    "stageid" INTEGER NOT NULL,
    "dealname" VARCHAR(200) NOT NULL,
    "dealvalue" DECIMAL(18,2) NOT NULL,
    "probability" INTEGER,
    "expectedrevenue" DECIMAL(18,2),
    "expectedclosedate" DATE,
    "status" VARCHAR(30),
    "createddate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deals_pkey" PRIMARY KEY ("dealid")
);

-- CreateTable
CREATE TABLE "leads" (
    "leadid" SERIAL NOT NULL,
    "sourceid" INTEGER,
    "assigneduserid" INTEGER,
    "fullname" VARCHAR(100) NOT NULL,
    "company" VARCHAR(150),
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "address" TEXT,
    "status" VARCHAR(30),
    "createddate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("leadid")
);

-- CreateTable
CREATE TABLE "leadsources" (
    "sourceid" SERIAL NOT NULL,
    "sourcename" VARCHAR(100) NOT NULL,

    CONSTRAINT "leadsources_pkey" PRIMARY KEY ("sourceid")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notificationid" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "title" VARCHAR(200),
    "content" TEXT,
    "type" VARCHAR(30),
    "isread" BOOLEAN DEFAULT false,
    "createddate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notificationid")
);

-- CreateTable
CREATE TABLE "pipelinestages" (
    "stageid" SERIAL NOT NULL,
    "stagename" VARCHAR(100) NOT NULL,
    "stageorder" INTEGER NOT NULL,

    CONSTRAINT "pipelinestages_pkey" PRIMARY KEY ("stageid")
);

-- CreateTable
CREATE TABLE "products" (
    "productid" SERIAL NOT NULL,
    "productname" VARCHAR(200) NOT NULL,
    "category" VARCHAR(100),
    "price" DECIMAL(18,2),
    "description" TEXT,
    "status" BOOLEAN DEFAULT true,

    CONSTRAINT "products_pkey" PRIMARY KEY ("productid")
);

-- CreateTable
CREATE TABLE "quotedetails" (
    "quotedetailid" SERIAL NOT NULL,
    "quoteid" INTEGER NOT NULL,
    "productid" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitprice" DECIMAL(18,2),
    "discount" DECIMAL(5,2),
    "total" DECIMAL(18,2),

    CONSTRAINT "quotedetails_pkey" PRIMARY KEY ("quotedetailid")
);

-- CreateTable
CREATE TABLE "quotes" (
    "quoteid" SERIAL NOT NULL,
    "dealid" INTEGER NOT NULL,
    "quotedate" DATE,
    "totalamount" DECIMAL(18,2),
    "status" VARCHAR(30),
    "createdby" INTEGER,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("quoteid")
);

-- CreateTable
CREATE TABLE "roles" (
    "roleid" SERIAL NOT NULL,
    "rolename" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("roleid")
);

-- CreateTable
CREATE TABLE "tasks" (
    "taskid" SERIAL NOT NULL,
    "dealid" INTEGER,
    "assigneduserid" INTEGER,
    "title" VARCHAR(200),
    "description" TEXT,
    "duedate" TIMESTAMP(6),
    "remindertime" TIMESTAMP(6),
    "priority" VARCHAR(20),
    "status" VARCHAR(30),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("taskid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "roleid" INTEGER NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "passwordhash" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "status" BOOLEAN DEFAULT true,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_leadid_key" ON "customers"("leadid");

-- CreateIndex
CREATE UNIQUE INDEX "leadsources_sourcename_key" ON "leadsources"("sourcename");

-- CreateIndex
CREATE UNIQUE INDEX "roles_rolename_key" ON "roles"("rolename");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "fk_activity_deal" FOREIGN KEY ("dealid") REFERENCES "deals"("dealid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "fk_activity_user" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activitylogs" ADD CONSTRAINT "fk_log_user" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "fk_customer_lead" FOREIGN KEY ("leadid") REFERENCES "leads"("leadid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "fk_deal_customer" FOREIGN KEY ("customerid") REFERENCES "customers"("customerid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "fk_deal_stage" FOREIGN KEY ("stageid") REFERENCES "pipelinestages"("stageid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "fk_deal_user" FOREIGN KEY ("assigneduserid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "fk_lead_source" FOREIGN KEY ("sourceid") REFERENCES "leadsources"("sourceid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "fk_lead_user" FOREIGN KEY ("assigneduserid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notification_user" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quotedetails" ADD CONSTRAINT "fk_qd_product" FOREIGN KEY ("productid") REFERENCES "products"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quotedetails" ADD CONSTRAINT "fk_qd_quote" FOREIGN KEY ("quoteid") REFERENCES "quotes"("quoteid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "fk_quote_deal" FOREIGN KEY ("dealid") REFERENCES "deals"("dealid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "fk_quote_user" FOREIGN KEY ("createdby") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "fk_task_deal" FOREIGN KEY ("dealid") REFERENCES "deals"("dealid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "fk_task_user" FOREIGN KEY ("assigneduserid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_user_role" FOREIGN KEY ("roleid") REFERENCES "roles"("roleid") ON DELETE NO ACTION ON UPDATE NO ACTION;
