import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class Int32IdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    if (!/^\d+$/.test(value)) {
      throw new BadRequestException('ID phải là số nguyên dương.');
    }

    const id = Number(value);

    if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) {
      throw new BadRequestException(
        'ID phải nằm trong phạm vi từ 1 đến 2147483647.',
      );
    }

    return id;
  }
}
