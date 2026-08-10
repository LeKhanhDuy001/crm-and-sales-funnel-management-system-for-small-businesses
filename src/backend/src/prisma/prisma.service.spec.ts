import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    } else {
      delete process.env.DATABASE_URL;
    }
  });

  it('should throw error when DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;
    expect(() => {
      new PrismaService();
    }).toThrow('DATABASE_URL chưa được cấu hình trong file .env');
  });
});
