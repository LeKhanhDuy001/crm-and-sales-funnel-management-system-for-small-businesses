import { ApiProperty } from '@nestjs/swagger';
import { DashboardTaskDto } from './dashboard-common.dto';

class CustomerCareOverviewDto {
  @ApiProperty({
    example: 5,
  })
  customersNeedingCare!: number;

  @ApiProperty({
    example: 2,
  })
  todayTasks!: number;

  @ApiProperty({
    example: 6,
  })
  pendingTasks!: number;

  @ApiProperty({
    example: 1,
  })
  overdueTasks!: number;

  @ApiProperty({
    example: 10,
  })
  completedActivities!: number;
}

class RecentActivityDto {
  @ApiProperty({
    example: 1,
  })
  activityId!: number;

  @ApiProperty({
    example: 'Call',
    nullable: true,
  })
  activityType!: string | null;

  @ApiProperty({
    example: 'Gọi chăm sóc khách hàng',
    nullable: true,
  })
  subject!: string | null;

  @ApiProperty({
    example: '2026-08-11T08:00:00.000Z',
    nullable: true,
  })
  activityTime!: Date | null;

  @ApiProperty({
    example: 'Khách hàng đồng ý nhận tư vấn',
    nullable: true,
  })
  result!: string | null;

  @ApiProperty({
    example: 1,
  })
  dealId!: number;

  @ApiProperty({
    example: 'Website doanh nghiệp',
  })
  dealName!: string;

  @ApiProperty({
    example: 2,
  })
  customerId!: number;

  @ApiProperty({
    example: 'Nguyễn Văn A',
  })
  customer!: string;

  @ApiProperty({
    example: 'ABC Company',
    nullable: true,
  })
  company!: string | null;
}

class ActivitiesByTypeDto {
  @ApiProperty({
    example: 'Call',
  })
  activityType!: string;

  @ApiProperty({
    example: 5,
  })
  totalActivities!: number;
}

export class CustomerCareDashboardResponseDto {
  @ApiProperty({
    type: CustomerCareOverviewDto,
  })
  overview!: CustomerCareOverviewDto;

  @ApiProperty({
    type: [DashboardTaskDto],
  })
  upcomingTasks!: DashboardTaskDto[];

  @ApiProperty({
    type: [RecentActivityDto],
  })
  recentActivities!: RecentActivityDto[];

  @ApiProperty({
    type: [ActivitiesByTypeDto],
  })
  activitiesByType!: ActivitiesByTypeDto[];
}
