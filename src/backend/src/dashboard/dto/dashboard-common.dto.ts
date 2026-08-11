import { ApiProperty } from '@nestjs/swagger';

export class PipelineStageDto {
  @ApiProperty({
    example: 1,
  })
  stageId!: number;

  @ApiProperty({
    example: 'Qualification',
  })
  stageName!: string;

  @ApiProperty({
    example: 1,
  })
  stageOrder!: number;

  @ApiProperty({
    example: 5,
  })
  totalDeals!: number;
}

export class DashboardTaskDto {
  @ApiProperty({
    example: 1,
  })
  taskId!: number;

  @ApiProperty({
    example: 'Gọi lại cho khách hàng',
    nullable: true,
  })
  title!: string | null;

  @ApiProperty({
    example: 'High',
    nullable: true,
  })
  priority!: string | null;

  @ApiProperty({
    example: 'Pending',
    nullable: true,
  })
  status!: string | null;

  @ApiProperty({
    example: '2026-08-12T09:00:00.000Z',
    nullable: true,
  })
  dueDate!: Date | null;

  @ApiProperty({
    example: 3,
    nullable: true,
  })
  dealId!: number | null;

  @ApiProperty({
    example: 'Website doanh nghiệp',
    nullable: true,
  })
  dealName!: string | null;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    nullable: true,
  })
  customer!: string | null;
}

export class RecentLeadDashboardDto {
  @ApiProperty({
    example: 1,
  })
  leadId!: number;

  @ApiProperty({
    example: 'Nguyễn Văn A',
  })
  fullName!: string;

  @ApiProperty({
    example: 'ABC Company',
    nullable: true,
  })
  company!: string | null;

  @ApiProperty({
    example: 'customer@example.com',
    nullable: true,
  })
  email!: string | null;

  @ApiProperty({
    example: 'New',
    nullable: true,
  })
  status!: string | null;

  @ApiProperty({
    example: 'Facebook',
    nullable: true,
  })
  source!: string | null;

  @ApiProperty({
    example: 'Trần Văn Sales',
    nullable: true,
  })
  assignedUser!: string | null;

  @ApiProperty({
    example: '2026-08-11T09:00:00.000Z',
    nullable: true,
  })
  createdDate!: Date | null;
}
