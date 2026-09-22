import { BadRequestException } from '@nestjs/common';
import { Int32IdPipe } from './int32-id.pipe';

describe('Int32IdPipe', () => {
  let pipe: Int32IdPipe;

  beforeEach(() => {
    pipe = new Int32IdPipe();
  });

  it('chấp nhận ID hợp lệ trong phạm vi int4', () => {
    expect(pipe.transform('1')).toBe(1);
    expect(pipe.transform('2147483647')).toBe(2147483647);
  });

  it.each(['0', '-1', '1.5', 'abc', '2147483648', '999999999999999999'])(
    'từ chối ID không hợp lệ: %s',
    (value) => {
      expect(() => pipe.transform(value)).toThrow(BadRequestException);
    },
  );
});
