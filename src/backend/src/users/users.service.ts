import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Tìm người dùng theo email sau khi chuẩn hóa email.
   *
   * @param email Email của người dùng.
   * @returns Người dùng cùng thông tin vai trò hoặc null.
   */
  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    return this.usersRepository.findByEmail(normalizedEmail);
  }

  /**
   * Tìm người dùng theo mã định danh.
   *
   * @param userId Mã định danh của người dùng
   * @returns Người dùng cùng với thông tin vai trò hoặc null nếu không tồn tại
   */
  async findById(userId: number) {
    return this.usersRepository.findById(userId);
  }
}
