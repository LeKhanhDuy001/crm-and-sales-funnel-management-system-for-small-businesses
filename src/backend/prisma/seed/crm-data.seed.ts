import type { PrismaClient } from '../../generated/prisma/client';
import type {
  DealKey,
  LeadKey,
  SourceKey,
  StageKey,
  UserKey,
} from './seed.types';

export async function seedLeads(
  prisma: PrismaClient,
  sourceIds: Record<SourceKey, number>,
  userIds: Record<UserKey, number>,
): Promise<Record<LeadKey, number>> {
  const definitions = [
    {
      key: 'newLead',
      sourceid: sourceIds.website,
      assigneduserid: userIds.sales,
      fullname: 'Công ty Minh Anh Demo',
      company: 'Minh Anh',
      phone: '0911000001',
      email: 'lead.new.demo@crm.local',
      status: 'New',
    },
    {
      key: 'qualifiedLead',
      sourceid: sourceIds.facebook,
      assigneduserid: userIds.sales,
      fullname: 'Công ty Hoàng Gia Demo',
      company: 'Hoàng Gia',
      phone: '0911000002',
      email: 'lead.qualified.demo@crm.local',
      status: 'Qualified',
    },
    {
      key: 'convertedLead',
      sourceid: sourceIds.referral,
      assigneduserid: userIds.salesManager,
      fullname: 'Công ty Đại Phát Demo',
      company: 'Đại Phát',
      phone: '0911000003',
      email: 'lead.converted.demo@crm.local',
      status: 'Converted',
    },
  ] as const;

  const result = {} as Record<LeadKey, number>;

  for (const item of definitions) {
    const existing = await prisma.leads.findFirst({
      where: {
        email: item.email,
      },
    });

    const data = {
      sourceid: item.sourceid,
      assigneduserid: item.assigneduserid,
      fullname: item.fullname,
      company: item.company,
      phone: item.phone,
      email: item.email,
      status: item.status,
      address: 'TP. Hồ Chí Minh',
    };

    const lead = existing
      ? await prisma.leads.update({
          where: {
            leadid: existing.leadid,
          },
          data,
        })
      : await prisma.leads.create({
          data,
        });

    result[item.key] = lead.leadid;
  }

  return result;
}

export async function seedCustomer(
  prisma: PrismaClient,
  leadid: number,
): Promise<number> {
  const existing = await prisma.customers.findUnique({
    where: {
      leadid,
    },
  });

  const data = {
    leadid,
    fullname: 'Công ty Đại Phát Demo',
    company: 'Đại Phát',
    phone: '0911000003',
    email: 'customer.demo@crm.local',
    address: 'TP. Hồ Chí Minh',
    customertype: 'Doanh nghiệp',
  };

  const customer = existing
    ? await prisma.customers.update({
        where: {
          customerid: existing.customerid,
        },
        data,
      })
    : await prisma.customers.create({
        data,
      });

  return customer.customerid;
}

export async function seedDeals(
  prisma: PrismaClient,
  customerid: number,
  userIds: Record<UserKey, number>,
  stageIds: Record<StageKey, number>,
): Promise<Record<DealKey, number>> {
  const definitions = [
    {
      key: 'qualification',
      dealname: 'Demo - Tư vấn CRM',
      stageid: stageIds.qualification,
      dealvalue: 15_000_000,
      probability: 30,
      expectedrevenue: 4_500_000,
      status: 'Open',
    },
    {
      key: 'proposal',
      dealname: 'Demo - Triển khai CRM Starter',
      stageid: stageIds.proposal,
      dealvalue: 24_000_000,
      probability: 60,
      expectedrevenue: 14_400_000,
      status: 'Open',
    },
    {
      key: 'won',
      dealname: 'Demo - Đào tạo CRM',
      stageid: stageIds.won,
      dealvalue: 10_000_000,
      probability: 100,
      expectedrevenue: 10_000_000,
      status: 'Won',
    },
  ] as const;

  const result = {} as Record<DealKey, number>;

  for (const item of definitions) {
    const existing = await prisma.deals.findFirst({
      where: {
        dealname: item.dealname,
      },
    });

    const data = {
      customerid,
      assigneduserid: userIds.sales,
      stageid: item.stageid,
      dealname: item.dealname,
      dealvalue: item.dealvalue,
      probability: item.probability,
      expectedrevenue: item.expectedrevenue,
      expectedclosedate: new Date('2026-09-30'),
      status: item.status,
    };

    const deal = existing
      ? await prisma.deals.update({
          where: {
            dealid: existing.dealid,
          },
          data,
        })
      : await prisma.deals.create({
          data,
        });

    result[item.key] = deal.dealid;
  }

  return result;
}
