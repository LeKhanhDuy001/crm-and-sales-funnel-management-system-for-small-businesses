import { ApiProperty } from '@nestjs/swagger';
import { PipelineStageDto } from './dashboard-common.dto';

class SalesManagerOverviewDto {
  @ApiProperty({
    example: 4,
  })
  totalSales!: number;

  @ApiProperty({
    example: 8,
  })
  openDeals!: number;

  @ApiProperty({
    example: 120000000,
  })
  pipelineValue!: number;

  @ApiProperty({
    example: 65000000,
  })
  expectedRevenue!: number;

  @ApiProperty({
    example: 31000000,
  })
  wonRevenue!: number;

  @ApiProperty({
    example: 6,
  })
  pendingTasks!: number;
}

class SalesPerformanceDto {
  @ApiProperty({
    example: 3,
  })
  userId!: number;

  @ApiProperty({
    example: 'Nguyễn Văn Sales',
  })
  fullName!: string;

  @ApiProperty({
    example: 'sales@crm.com',
  })
  email!: string;

  @ApiProperty({
    example: 5,
  })
  totalDeals!: number;

  @ApiProperty({
    example: 80000000,
  })
  totalDealValue!: number;

  @ApiProperty({
    example: 45000000,
  })
  expectedRevenue!: number;
}

class AttentionDealDto {
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
    example: 'Nguyễn Văn Sales',
  })
  assignedUser!: string;

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

export class SalesManagerDashboardResponseDto {
  @ApiProperty({
    type: SalesManagerOverviewDto,
  })
  overview!: SalesManagerOverviewDto;

  @ApiProperty({
    type: [PipelineStageDto],
  })
  pipeline!: PipelineStageDto[];

  @ApiProperty({
    type: [SalesPerformanceDto],
  })
  salesPerformance!: SalesPerformanceDto[];

  @ApiProperty({
    type: [AttentionDealDto],
  })
  attentionDeals!: AttentionDealDto[];
}
