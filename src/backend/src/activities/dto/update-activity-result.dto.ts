import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateActivityResultDto {
  @IsString()
  @IsNotEmpty({
    message: 'Kết quả chăm sóc không được để trống.',
  })
  result!: string;
}