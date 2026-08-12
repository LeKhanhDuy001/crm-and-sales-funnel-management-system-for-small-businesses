import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL chưa được cấu hình trong file .env');
    }

    const adapter = new PrismaPg({
      connectionString,
    });

    super({ adapter });
  }

  /**
   * Mở kết nối đến cơ sở dữ liệu khi module được khởi tạo
   *
   * @returns Promise hoàn tất khi kết nối cơ sở dữ liệu thành công
   * @throws Error khi không thể kết nối đến cơ sở dữ liệu
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /**
   * Đóng kết nối cơ sở dữ liệu khi module bị hủy
   *
   * @returns Promise hoàn tất khi kết nối đã được đóng
   * @throws Error khi quá trình đóng kết nối thất bại
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
