import { ApiProperty } from '@nestjs/swagger';
import { DashboardTaskDto, PipelineStageDto } from './dashboard-common.dto';

class SalesOverviewDto {
  @ApiProperty({
    example: 5,
  })
  totalLeads!: number;

  @ApiProperty({
    example: 4,
  })
  totalDeals!: number;

  @ApiProperty({
    example: 80000000,
  })
  pipelineValue!: number;

  @ApiProperty({
    example: 45000000,
  })
  expectedRevenue!: number;

  @ApiProperty({
    example: 3,
  })
  totalQuotes!: number;

  @ApiProperty({
    example: 4,
  })
  pendingTasks!: number;
}

class RecentDealDto {
  @ApiProperty({
    example: 1,
  })
  dealId!: number;

  @ApiProperty({
    example: 'Website doanh nghiệp',
  })
  dealName!: string;

  @ApiProperty({
    example: 30000000,
  })
  dealValue!: number;

  @ApiProperty({
    example: 70,
    nullable: true,
  })
  probability!: number | null;

  @ApiProperty({
    example: 21000000,
  })
  expectedRevenue!: number;

  @ApiProperty({
    example: '2026-08-20',
    nullable: true,
  })
  expectedCloseDate!: Date | null;

  @ApiProperty({
    example: 'Open',
    nullable: true,
  })
  status!: string | null;

  @ApiProperty({
    example: 'Proposal',
  })
  stage!: string;

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

export class SalesDashboardResponseDto {
  @ApiProperty({
    type: SalesOverviewDto,
  })
  overview!: SalesOverviewDto;

  @ApiProperty({
    type: [PipelineStageDto],
  })
  pipeline!: PipelineStageDto[];

  @ApiProperty({
    type: [RecentDealDto],
  })
  recentDeals!: RecentDealDto[];

  @ApiProperty({
    type: [DashboardTaskDto],
  })
  upcomingTasks!: DashboardTaskDto[];
}
