import { IsInt, Max, Min } from 'class-validator';

export class AssignLeadDto {
  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
  assignedUserId!: number;
}