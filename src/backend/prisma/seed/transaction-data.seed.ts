import { action_type, type PrismaClient } from '../../generated/prisma/client';
import type { DealKey, ProductKey, UserKey } from './seed.types';

export async function seedTasks(
  prisma: PrismaClient,
  dealIds: Record<DealKey, number>,
  userIds: Record<UserKey, number>,
): Promise<void> {
  const definitions = [
    {
      dealid: dealIds.qualified,
      title: 'Demo - Gọi xác nhận nhu cầu',
      priority: 'High',
      status: 'Pending',
    },
    {
      dealid: dealIds.proposal,
      title: 'Demo - Gửi báo giá CRM',
      priority: 'High',
      status: 'In Progress',
    },
  ];

  for (const item of definitions) {
    const existing = await prisma.tasks.findFirst({
      where: {
        title: item.title,
      },
    });

    const data = {
      dealid: item.dealid,
      assigneduserid: userIds.sales,
      title: item.title,
      description: 'Công việc mẫu phục vụ trình diễn hệ thống',
      duedate: new Date('2026-09-15T09:00:00+07:00'),
      priority: item.priority,
      status: item.status,
    };

    if (existing) {
      await prisma.tasks.update({
        where: {
          taskid: existing.taskid,
        },
        data,
      });
    } else {
      await prisma.tasks.create({
        data,
      });
    }
  }
}

export async function seedQuote(
  prisma: PrismaClient,
  dealid: number,
  createdby: number,
  productIds: Record<ProductKey, number>,
): Promise<void> {
  const existing = await prisma.quotes.findFirst({
    where: {
      dealid,
      status: 'Draft',
    },
  });

  const quote = existing
    ? await prisma.quotes.update({
        where: {
          quoteid: existing.quoteid,
        },
        data: {
          totalamount: 12_000_000,
          createdby,
        },
      })
    : await prisma.quotes.create({
        data: {
          dealid,
          quotedate: new Date('2026-08-06'),
          totalamount: 12_000_000,
          status: 'Draft',
          createdby,
        },
      });

  const details = [
    {
      productid: productIds.crmPackage,
      quantity: 2,
      unitprice: 3_500_000,
      discount: 0,
      total: 7_000_000,
    },
    {
      productid: productIds.training,
      quantity: 1,
      unitprice: 5_000_000,
      discount: 0,
      total: 5_000_000,
    },
  ];

  for (const item of details) {
    const current = await prisma.quotedetails.findFirst({
      where: {
        quoteid: quote.quoteid,
        productid: item.productid,
      },
    });

    if (current) {
      await prisma.quotedetails.update({
        where: {
          quotedetailid: current.quotedetailid,
        },
        data: item,
      });
    } else {
      await prisma.quotedetails.create({
        data: {
          quoteid: quote.quoteid,
          ...item,
        },
      });
    }
  }
}

export async function seedActivityAndNotification(
  prisma: PrismaClient,
  dealid: number,
  userid: number,
): Promise<void> {
  const activity = await prisma.activities.findFirst({
    where: {
      dealid,
      subject: 'Demo - Trao đổi nhu cầu CRM',
    },
  });

  if (!activity) {
    await prisma.activities.create({
      data: {
        dealid,
        userid,
        activitytype: 'Call',
        subject: 'Demo - Trao đổi nhu cầu CRM',
        description: 'Khách hàng quan tâm gói CRM Starter',
        activitytime: new Date(),
        result: 'Khách hàng đồng ý nhận báo giá',
      },
    });
  }

  const notification = await prisma.notifications.findFirst({
    where: {
      userid,
      title: 'Deal demo mới được phân công',
    },
  });

  if (!notification) {
    await prisma.notifications.create({
      data: {
        userid,
        title: 'Deal demo mới được phân công',
        content: 'Bạn được phân công phụ trách Deal demo CRM.',
        type: 'Assignment',
        isread: false,
      },
    });
  }

  const log = await prisma.activitylogs.findFirst({
    where: {
      userid,
      action: action_type.Create,
      tablename: 'deals',
      recordid: dealid,
    },
  });

  if (!log) {
    await prisma.activitylogs.create({
      data: {
        userid,
        action: action_type.Create,
        tablename: 'deals',
        recordid: dealid,
        ipaddress: '127.0.0.1',
      },
    });
  }
}
