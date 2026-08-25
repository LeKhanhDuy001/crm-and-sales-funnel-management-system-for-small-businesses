import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ActivityLogQueryDto } from './dto/activity-log-query.dto';
import { ActivityLogsService } from './activity-logs.service';

@ApiTags('Activity Logs')
@ApiBearerAuth('access-token')
@Controller('activity-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
// BR-02: chỉ Admin được xem toàn bộ Activity Log.
@Roles(Role.ADMIN)
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Xem và lọc Activity Log' })
  findAll(@Query() query: ActivityLogQueryDto) {
    return this.activityLogsService.findAll(query);
  }

  @Get('filter-users')
  @ApiOperation({ summary: 'Lấy người dùng cho bộ lọc Activity Log' })
  findFilterUsers() {
    return this.activityLogsService.findFilterUsers();
  }
}
