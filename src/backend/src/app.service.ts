import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Trả thông báo kiểm tra trạng thái cơ bản của ứng dụng
   *
   * @returns chuỗi thông báo xác nhận ứng dụng đang hoạt động
   */
  getHello(): string {
    return 'Hello World!';
  }
}
