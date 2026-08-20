import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findManyByUserId(userId: number) {
    return this.prisma.notifications.findMany({
      where: { userid: userId },
      orderBy: { createddate: 'desc' },
      take: 50,
    });
  }

  countUnreadByUserId(userId: number) {
    return this.prisma.notifications.count({
      where: {
        userid: userId,
        isread: false,
      },
    });
  }

  findByIdAndUserId(notificationId: number, userId: number) {
    return this.prisma.notifications.findFirst({
      where: {
        notificationid: notificationId,
        userid: userId,
      },
    });
  }

  markAsRead(notificationId: number) {
    return this.prisma.notifications.update({
      where: {
        notificationid: notificationId,
      },
      data: { isread: true },
    });
  }

  markAllAsRead(userId: number) {
    return this.prisma.notifications.updateMany({
      where: {
        userid: userId,
        isread: false,
      },
      data: { isread: true },
    });
  }
}
