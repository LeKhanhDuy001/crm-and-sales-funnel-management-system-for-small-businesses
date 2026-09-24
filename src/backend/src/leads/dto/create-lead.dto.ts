import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLeadDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
  sourceId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
  assignedUserId?: number;

  @IsString()
  @MaxLength(100)
  fullName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  company?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @IsBoolean()
  mergeDuplicate?: boolean;
}
