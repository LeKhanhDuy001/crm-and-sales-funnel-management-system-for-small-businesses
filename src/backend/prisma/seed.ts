import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { seedCustomer, seedDeals, seedLeads } from './seed/crm-data.seed';
import {
  seedLeadSources,
  seedPipelineStages,
  seedProducts,
  seedRoles,
  seedUsers,
} from './seed/master-data.seed';
import {
  seedActivityAndNotification,
  seedQuote,
  seedTasks,
} from './seed/transaction-data.seed';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL chưa được cấu hình trong file .env');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main(): Promise<void> {
  const roleIds = await seedRoles(prisma);
  const userIds = await seedUsers(prisma, roleIds);

  const sourceIds = await seedLeadSources(prisma);
  const stageIds = await seedPipelineStages(prisma);
  const productIds = await seedProducts(prisma);

  const leadIds = await seedLeads(prisma, sourceIds, userIds);

  const customerid = await seedCustomer(prisma, leadIds.convertedLead);

  const dealIds = await seedDeals(prisma, customerid, userIds, stageIds);

  await seedTasks(prisma, dealIds, userIds);

  await seedQuote(prisma, dealIds.proposal, userIds.sales, productIds);

  await seedActivityAndNotification(prisma, dealIds.proposal, userIds.sales);
}

main()
  .then(() => {
    process.stdout.write(
      'Seed dữ liệu thành công. ' + 'Mật khẩu tài khoản demo: Demo@12345\n',
    );
  })
  .catch((error: unknown) => {
    const message =
      error instanceof Error ? (error.stack ?? error.message) : String(error);

    process.stderr.write(`Seed dữ liệu thất bại:\n${message}\n`);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
