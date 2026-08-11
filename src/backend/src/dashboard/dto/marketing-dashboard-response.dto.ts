import { ApiProperty } from '@nestjs/swagger';
import { RecentLeadDashboardDto } from './dashboard-common.dto';

class MarketingOverviewDto {
  @ApiProperty({
    example: 20,
  })
  totalLeads!: number;

  @ApiProperty({
    example: 6,
  })
  newLeadsThisMonth!: number;

  @ApiProperty({
    example: 8,
  })
  convertedLeads!: number;

  @ApiProperty({
    example: 12,
  })
  unconvertedLeads!: number;

  @ApiProperty({
    example: 40,
  })
  conversionRate!: number;

  @ApiProperty({
    example: 4,
  })
  totalLeadSources!: number;
}

class LeadsBySourceDto {
  @ApiProperty({
    example: 1,
  })
  sourceId!: number;

  @ApiProperty({
    example: 'Facebook',
  })
  sourceName!: string;

  @ApiProperty({
    example: 8,
  })
  totalLeads!: number;
}

class LeadsByStatusDto {
  @ApiProperty({
    example: 'New',
  })
  status!: string;

  @ApiProperty({
    example: 6,
  })
  totalLeads!: number;
}

export class MarketingDashboardResponseDto {
  @ApiProperty({
    type: MarketingOverviewDto,
  })
  overview!: MarketingOverviewDto;

  @ApiProperty({
    type: [LeadsBySourceDto],
  })
  leadsBySource!: LeadsBySourceDto[];

  @ApiProperty({
    type: [LeadsByStatusDto],
  })
  leadsByStatus!: LeadsByStatusDto[];

  @ApiProperty({
    type: [RecentLeadDashboardDto],
  })
  recentLeads!: RecentLeadDashboardDto[];
}
