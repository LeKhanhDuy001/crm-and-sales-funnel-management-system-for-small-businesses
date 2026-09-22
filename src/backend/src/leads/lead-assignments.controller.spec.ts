import { Test, TestingModule } from '@nestjs/testing';

import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../common/enums/role.enum';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { LeadAssignmentQueryDto } from './dto/lead-assignment-query.dto';
import { LeadAssignmentsController } from './lead-assignments.controller';
import { LeadAssignmentsService } from './lead-assignments.service';

describe('LeadAssignmentsController', () => {
  let controller: LeadAssignmentsController;

  const leadAssignmentsServiceMock = {
    findAll: jest.fn(),
    getAssignmentMeta: jest.fn(),
    assign: jest.fn(),
  };

  const request = {
    user: {
      userId: 2,
      role: Role.SALES_MANAGER,
    },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadAssignmentsController],
      providers: [
        {
          provide: LeadAssignmentsService,
          useValue: leadAssignmentsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<LeadAssignmentsController>(
      LeadAssignmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('chỉ cho phép Sales Manager truy cập Lead Assignments', () => {
    const metadataValues = Reflect.getMetadataKeys(
      LeadAssignmentsController,
    ).map((key) =>
      Reflect.getMetadata(
        key,
        LeadAssignmentsController,
      ),
    );

    expect(metadataValues).toContainEqual([
      Role.SALES_MANAGER,
    ]);
  });

  describe('findAll', () => {
    it('gọi service findAll với query', async () => {
      const query = {
        page: 1,
        limit: 20,
      } as LeadAssignmentQueryDto;

      const expectedResult = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };

      leadAssignmentsServiceMock.findAll.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findAll(query);

      expect(
        leadAssignmentsServiceMock.findAll,
      ).toHaveBeenCalledTimes(1);

      expect(
        leadAssignmentsServiceMock.findAll,
      ).toHaveBeenCalledWith(query);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAssignmentMeta', () => {
    it('gọi service getAssignmentMeta', async () => {
      const expectedResult = {
        salesUsers: [],
      };

      leadAssignmentsServiceMock.getAssignmentMeta.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getAssignmentMeta();

      expect(
        leadAssignmentsServiceMock.getAssignmentMeta,
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('assign', () => {
    it('gọi service assign với leadId, assignedUserId và người dùng hiện tại', async () => {
      const dto = {
        assignedUserId: 7,
      } as AssignLeadDto;

      const expectedResult = {
        leadId: 10,
        assignedUserId: 7,
      };

      leadAssignmentsServiceMock.assign.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.assign(
        10,
        dto,
        request,
      );

      expect(
        leadAssignmentsServiceMock.assign,
      ).toHaveBeenCalledTimes(1);

      expect(
        leadAssignmentsServiceMock.assign,
      ).toHaveBeenCalledWith(
        10,
        7,
        request.user,
      );

      expect(result).toEqual(expectedResult);
    });
  });
});