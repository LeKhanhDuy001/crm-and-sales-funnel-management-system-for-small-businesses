import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { LeadAssignmentsService } from './lead-assignments.service';
import { LeadAssignmentsRepository } from './repositories/lead-assignments.repository';

describe('LeadAssignmentsService', () => {
  let service: LeadAssignmentsService;
  let repository: jest.Mocked<LeadAssignmentsRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      findMany: jest.fn(),
      findActiveSales: jest.fn(),
      findLeadById: jest.fn(),
      findActiveSalesById: jest.fn(),
      assignLead: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadAssignmentsService,
        {
          provide: LeadAssignmentsRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<LeadAssignmentsService>(
      LeadAssignmentsService,
    );

    repository = module.get(LeadAssignmentsRepository);
  });

  describe('assign - BR25', () => {
    it.each([
      Role.ADMIN,
      Role.SALES,
      Role.MARKETING,
      Role.CUSTOMER_CARE,
    ])(
      'BR25 - từ chối phân công Lead khi role là %s',
      async (role) => {
        const currentUser = {
          userId: 99,
          role,
        } as AuthenticatedUser;

        await expect(
          service.assign(1, 2, currentUser),
        ).rejects.toThrow(
          new ForbiddenException(
            'Bạn không có quyền phân công Lead.',
          ),
        );

        expect(
          repository.findLeadById,
        ).not.toHaveBeenCalled();

        expect(
          repository.findActiveSalesById,
        ).not.toHaveBeenCalled();

        expect(
          repository.assignLead,
        ).not.toHaveBeenCalled();
      },
    );
  });

  it('BR25 - Sales Manager được phép phân công Lead cho Sales', async () => {
    const currentUser = {
      userId: 10,
      role: Role.SALES_MANAGER,
    } as AuthenticatedUser;

    repository.findLeadById.mockResolvedValue({
      leadid: 1,
      fullname: 'Nguyễn Văn Lead',
      status: 'Qualified',
      assigneduserid: 5,
    } as never);

    repository.findActiveSalesById.mockResolvedValue({
      userid: 6,
      fullname: 'Nguyễn Văn Sales',
      email: 'sales@crm.test',
      status: true,
    } as never);

    repository.assignLead.mockResolvedValue(undefined);

    const result = await service.assign(
      1,
      6,
      currentUser,
    );

    expect(
      repository.findLeadById,
    ).toHaveBeenCalledWith(1);

    expect(
      repository.findActiveSalesById,
    ).toHaveBeenCalledWith(6);

    expect(repository.assignLead).toHaveBeenCalledWith({
      leadId: 1,
      assignedUserId: 6,
      actorUserId: 10,
      leadName: 'Nguyễn Văn Lead',
    });

    expect(result).toEqual({
      message: 'Phân công Lead thành công.',
    });
  });

  it('BR26 - từ chối phân công Lead khi người nhận không phải Sales đang hoạt động', async () => {
    const salesManager = {
      userId: 10,
      role: Role.SALES_MANAGER,
    } as AuthenticatedUser;

    repository.findLeadById.mockResolvedValue({
      leadid: 1,
      fullname: 'Lead BR26',
      status: 'Qualified',
      assigneduserid: 5,
    } as never);

    repository.findActiveSalesById.mockResolvedValue(
      null,
    );

    await expect(
      service.assign(
        1,
        77,
        salesManager,
      ),
    ).rejects.toThrow(
      'Chỉ được phân công Lead cho nhân viên Sales đang hoạt động.',
    );

    expect(
      repository.findActiveSalesById,
    ).toHaveBeenCalledWith(77);

    expect(
      repository.assignLead,
    ).not.toHaveBeenCalled();
  });

  it('BR28 - từ chối phân công lại Lead đã chuyển đổi thành Customer', async () => {
    const salesManager = {
      userId: 10,
      role: Role.SALES_MANAGER,
    } as AuthenticatedUser;

    repository.findLeadById.mockResolvedValue({
      leadid: 2,
      fullname: 'Lead đã chuyển đổi',
      status: 'Converted',
      assigneduserid: 5,
    } as never);

    await expect(
      service.assign(
        2,
        6,
        salesManager,
      ),
    ).rejects.toThrow(
      'Lead đã chuyển đổi thành Customer nên không thể phân công.',
    );

    expect(
      repository.findActiveSalesById,
    ).not.toHaveBeenCalled();

    expect(
      repository.assignLead,
    ).not.toHaveBeenCalled();
  });
});

