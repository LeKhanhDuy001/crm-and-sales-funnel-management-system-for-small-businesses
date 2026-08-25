import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SALES, Role.CUSTOMER_CARE)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findMyNotifications(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.notificationsService.findMyNotifications(request.user);
  }

  @Get('unread-count')
  countUnread(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.notificationsService.countUnread(request.user);
  }

  @Patch('read-all')
  markAllAsRead(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.notificationsService.markAllAsRead(request.user);
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id', ParseIntPipe)
    notificationId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.notificationsService.markAsRead(notificationId, request.user);
  }
}
