import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    },
  )
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  email!: string;

  @IsString()
  @IsNotEmpty({
    message: 'Mật khẩu mới không được để trống',
  })
  @MinLength(8, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự',
  })
  @MaxLength(72, {
    message: 'Mật khẩu không được vượt quá 72 ký tự',
  })
  newPassword!: string;

  @IsString()
  @IsNotEmpty({
    message: 'Vui lòng xác nhận mật khẩu',
  })
  @MinLength(8, {
    message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự',
  })
  @MaxLength(72, {
    message: 'Mật khẩu xác nhận không được vượt quá 72 ký tự',
  })
  confirmPassword!: string;
}
