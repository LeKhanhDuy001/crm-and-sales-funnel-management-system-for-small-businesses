import { hash } from 'bcrypt';
import type { PrismaClient } from '../../generated/prisma/client';
import {
  DEMO_PASSWORD,
  type ProductKey,
  type RoleKey,
  type SourceKey,
  type StageKey,
  type UserKey,
} from './seed.types';

export async function seedRoles(
  prisma: PrismaClient,
): Promise<Record<RoleKey, number>> {
  const definitions = [
    {
      key: 'admin',
      rolename: 'Admin',
      description: 'Quản trị toàn bộ hệ thống',
    },
    {
      key: 'salesManager',
      rolename: 'Sales Manager',
      description: 'Quản lý hoạt động bán hàng',
    },
    {
      key: 'sales',
      rolename: 'Sales',
      description: 'Nhân viên kinh doanh',
    },
    {
      key: 'marketing',
      rolename: 'Marketing',
      description: 'Nhân viên marketing',
    },
    {
      key: 'customerCare',
      rolename: 'Customer Care',
      description: 'Nhân viên chăm sóc khách hàng',
    },
  ] as const;

  const result = {} as Record<RoleKey, number>;

  for (const item of definitions) {
    const role = await prisma.roles.upsert({
      where: {
        rolename: item.rolename,
      },
      update: {
        description: item.description,
      },
      create: {
        rolename: item.rolename,
        description: item.description,
      },
    });

    result[item.key] = role.roleid;
  }

  return result;
}

export async function seedUsers(
  prisma: PrismaClient,
  roleIds: Record<RoleKey, number>,
): Promise<Record<UserKey, number>> {
  const passwordhash = await hash(DEMO_PASSWORD, 12);

  const definitions = [
    {
      key: 'admin',
      roleid: roleIds.admin,
      fullname: 'Quản trị viên Demo',
      email: 'admin.demo@crm.local',
      phone: '0900000001',
    },
    {
      key: 'salesManager',
      roleid: roleIds.salesManager,
      fullname: 'Quản lý kinh doanh Demo',
      email: 'sales.manager.demo@crm.local',
      phone: '0900000002',
    },
    {
      key: 'sales',
      roleid: roleIds.sales,
      fullname: 'Nhân viên kinh doanh Demo',
      email: 'sales.demo@crm.local',
      phone: '0900000003',
    },
    {
      key: 'marketing',
      roleid: roleIds.marketing,
      fullname: 'Nhân viên Marketing Demo',
      email: 'marketing.demo@crm.local',
      phone: '0900000004',
    },
    {
      key: 'customerCare',
      roleid: roleIds.customerCare,
      fullname: 'Nhân viên chăm sóc khách hàng Demo',
      email: 'customer.care.demo@crm.local',
      phone: '0900000005',
    },
  ] as const;

  const result = {} as Record<UserKey, number>;

  for (const item of definitions) {
    const user = await prisma.users.upsert({
      where: {
        email: item.email,
      },
      update: {
        roleid: item.roleid,
        fullname: item.fullname,
        passwordhash,
        phone: item.phone,
        status: true,
      },
      create: {
        roleid: item.roleid,
        fullname: item.fullname,
        email: item.email,
        passwordhash,
        phone: item.phone,
        status: true,
      },
    });

    result[item.key] = user.userid;
  }

  return result;
}

export async function seedLeadSources(
  prisma: PrismaClient,
): Promise<Record<SourceKey, number>> {
  const definitions = [
    {
      key: 'website',
      sourcename: 'Website',
    },
    {
      key: 'facebook',
      sourcename: 'Facebook',
    },
    {
      key: 'referral',
      sourcename: 'Referral',
    },
  ] as const;

  const result = {} as Record<SourceKey, number>;

  for (const item of definitions) {
    const source = await prisma.leadsources.upsert({
      where: {
        sourcename: item.sourcename,
      },
      update: {},
      create: {
        sourcename: item.sourcename,
      },
    });

    result[item.key] = source.sourceid;
  }

  return result;
}

export async function seedPipelineStages(
  prisma: PrismaClient,
): Promise<Record<StageKey, number>> {
  const definitions = [
    {
      key: 'qualification',
      stagename: 'Qualification',
      stageorder: 1,
    },
    {
      key: 'proposal',
      stagename: 'Proposal',
      stageorder: 2,
    },
    {
      key: 'negotiation',
      stagename: 'Negotiation',
      stageorder: 3,
    },
    {
      key: 'won',
      stagename: 'Won',
      stageorder: 4,
    },
  ] as const;

  const result = {} as Record<StageKey, number>;

  for (const item of definitions) {
    const existing = await prisma.pipelinestages.findFirst({
      where: {
        stagename: item.stagename,
      },
    });

    const stage = existing
      ? await prisma.pipelinestages.update({
          where: {
            stageid: existing.stageid,
          },
          data: {
            stageorder: item.stageorder,
          },
        })
      : await prisma.pipelinestages.create({
          data: {
            stagename: item.stagename,
            stageorder: item.stageorder,
          },
        });

    result[item.key] = stage.stageid;
  }

  return result;
}

export async function seedProducts(
  prisma: PrismaClient,
): Promise<Record<ProductKey, number>> {
  const definitions = [
    {
      key: 'crmPackage',
      productname: 'Gói CRM Starter Demo',
      category: 'Phần mềm',
      price: 3_500_000,
      description: 'Gói CRM dành cho doanh nghiệp nhỏ',
    },
    {
      key: 'training',
      productname: 'Dịch vụ đào tạo CRM Demo',
      category: 'Dịch vụ',
      price: 5_000_000,
      description: 'Đào tạo sử dụng hệ thống CRM',
    },
  ] as const;

  const result = {} as Record<ProductKey, number>;

  for (const item of definitions) {
    const existing = await prisma.products.findFirst({
      where: {
        productname: item.productname,
      },
    });

    const product = existing
      ? await prisma.products.update({
          where: {
            productid: existing.productid,
          },
          data: {
            category: item.category,
            price: item.price,
            description: item.description,
            status: true,
          },
        })
      : await prisma.products.create({
          data: {
            productname: item.productname,
            category: item.category,
            price: item.price,
            description: item.description,
            status: true,
          },
        });

    result[item.key] = product.productid;
  }

  return result;
}
