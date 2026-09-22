import { Test, TestingModule } from '@nestjs/testing';

import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../common/enums/role.enum';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';

describe('QuotesController', () => {
  let controller: QuotesController;

  const quotesServiceMock = {
    findAll: jest.fn(),
    getMeta: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    confirm: jest.fn(),
    cancel: jest.fn(),
  };

  const request = {
    user: {
      userId: 7,
      role: Role.SALES,
    },
    ip: '127.0.0.1',
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotesController],
      providers: [
        {
          provide: QuotesService,
          useValue: quotesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<QuotesController>(QuotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('chỉ cho phép Sales truy cập Quotes', () => {
    const metadataValues = Reflect.getMetadataKeys(
      QuotesController,
    ).map((key) =>
      Reflect.getMetadata(
        key,
        QuotesController,
      ),
    );

    expect(metadataValues).toContainEqual([
      Role.SALES,
    ]);
  });

  describe('findAll', () => {
    it('gọi service findAll với người dùng hiện tại', async () => {
      const expectedResult = {
        data: [],
      };

      quotesServiceMock.findAll.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findAll(request);

      expect(
        quotesServiceMock.findAll,
      ).toHaveBeenCalledTimes(1);

      expect(
        quotesServiceMock.findAll,
      ).toHaveBeenCalledWith(request.user);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMeta', () => {
    it('gọi service getMeta với người dùng hiện tại', async () => {
      const expectedResult = {
        products: [],
        deals: [],
      };

      quotesServiceMock.getMeta.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getMeta(request);

      expect(
        quotesServiceMock.getMeta,
      ).toHaveBeenCalledTimes(1);

      expect(
        quotesServiceMock.getMeta,
      ).toHaveBeenCalledWith(request.user);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('gọi service findOne với quoteId và người dùng hiện tại', async () => {
      const expectedResult = {
        quoteId: 10,
      };

      quotesServiceMock.findOne.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findOne(
        10,
        request,
      );

      expect(
        quotesServiceMock.findOne,
      ).toHaveBeenCalledTimes(1);

      expect(
        quotesServiceMock.findOne,
      ).toHaveBeenCalledWith(
        10,
        request.user,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('gọi service create với dto, người dùng và IP', async () => {
      const dto = {} as CreateQuoteDto;

      const expectedResult = {
        quoteId: 10,
      };

      quotesServiceMock.create.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.create(
        dto,
        request,
      );

      expect(
        quotesServiceMock.create,
      ).toHaveBeenCalledTimes(1);

      expect(
        quotesServiceMock.create,
      ).toHaveBeenCalledWith(
        dto,
        request.user,
        request.ip,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('gọi service update với quoteId, dto, người dùng và IP', async () => {
      const dto = {} as UpdateQuoteDto;

      const expectedResult = {
        quoteId: 10,
      };

      quotesServiceMock.update.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.update(
        10,
        dto,
        request,
      );

      expect(
        quotesServiceMock.update,
      ).toHaveBeenCalledTimes(1);

      expect(
        quotesServiceMock.update,
      ).toHaveBeenCalledWith(
        10,
        dto,
        request.user,
        request.ip,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('confirm', () => {
    it('gọi service confirm với quoteId, người dùng và IP', async () => {
      const expectedResult = {
        quoteId: 10,
        status: 'Confirmed',
      };

      quotesServiceMock.confirm.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.confirm(
        10,
        request,
      );

      expect(
        quotesServiceMock.confirm,
      ).toHaveBeenCalledTimes(1);

      expect(
        quotesServiceMock.confirm,
      ).toHaveBeenCalledWith(
        10,
        request.user,
        request.ip,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('cancel', () => {
    it('gọi service cancel với quoteId, người dùng và IP', async () => {
      const expectedResult = {
        quoteId: 10,
        status: 'Cancelled',
      };

      quotesServiceMock.cancel.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.cancel(
        10,
        request,
      );

      expect(
        quotesServiceMock.cancel,
      ).toHaveBeenCalledTimes(1);

      expect(
        quotesServiceMock.cancel,
      ).toHaveBeenCalledWith(
        10,
        request.user,
        request.ip,
      );

      expect(result).toEqual(expectedResult);
    });
  });
});