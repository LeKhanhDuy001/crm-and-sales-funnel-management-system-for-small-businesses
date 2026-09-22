import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';

describe('DealsController', () => {
  let controller: DealsController;

  const dealsService = {
    findAll: jest.fn(),
    getMeta: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    assign: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    changeStage: jest.fn(),
  };

  const salesUser: AuthenticatedUser = {
    userId: 5,
    fullName: 'Sales A',
    email: 'sales.a@crm.local',
    role: Role.SALES,
  };

  const managerUser: AuthenticatedUser = {
    userId: 2,
    fullName: 'Sales Manager',
    email: 'manager@crm.local',
    role: Role.SALES_MANAGER,
  };

  const salesRequest = {
    user: salesUser,
    ip: '127.0.0.1',
  } as unknown as AuthenticatedRequest;

  const managerRequest = {
    user: managerUser,
    ip: '192.168.1.10',
  } as unknown as AuthenticatedRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DealsController(dealsService as unknown as DealsService);
  });

  it('truyền current user vào findAll để áp dụng record-level permission', async () => {
    const query = { page: 1, limit: 20 };

    await controller.findAll(query, salesRequest);

    expect(dealsService.findAll).toHaveBeenCalledWith(query, salesUser);
  });

  it('lấy metadata Deal theo current user', async () => {
    await controller.getMeta(managerRequest);

    expect(dealsService.getMeta).toHaveBeenCalledWith(managerUser);
  });

  it('GET /deals/:id truyền current user để kiểm tra quyền bản ghi', async () => {
    await controller.findOne(7, salesRequest);

    expect(dealsService.findOne).toHaveBeenCalledWith(7, salesUser);
  });

  it('tạo Deal với current user và IP', async () => {
    const dto = {
      customerId: 4,
      assignedUserId: 5,
      stageId: 1,
      dealName: 'Deal mới',
      dealValue: 20_000_000,
      expectedCloseDate: '2026-10-15',
    };

    await controller.create(dto, salesRequest);

    expect(dealsService.create).toHaveBeenCalledWith(
      dto,
      salesUser,
      '127.0.0.1',
    );
  });

  it('BR-08 - endpoint update truyền Deal, user và IP xuống Service', async () => {
    const dto = {
      dealName: 'Deal cập nhật',
      dealValue: 50_000_000,
    };

    await controller.update(7, dto, salesRequest);

    expect(dealsService.update).toHaveBeenCalledWith(
      7,
      dto,
      salesUser,
      '127.0.0.1',
    );
  });

  it('BR-08 - endpoint remove truyền Deal, user và IP xuống Service', async () => {
    dealsService.remove.mockResolvedValue(undefined);

    await controller.remove(7, salesRequest);

    expect(dealsService.remove).toHaveBeenCalledWith(7, salesUser, '127.0.0.1');
  });

  it('BR-08 - endpoint assign truyền Deal, assignee, user và IP xuống Service', async () => {
    const dto = {
      assignedUserId: 6,
    };

    await controller.assign(7, dto, managerRequest);

    expect(dealsService.assign).toHaveBeenCalledWith(
      7,
      dto,
      managerUser,
      '192.168.1.10',
    );
  });

  it('đổi Pipeline Stage với current user và IP', async () => {
    const dto = {
      stageId: 3,
    };

    await controller.changeStage(7, dto, salesRequest);

    expect(dealsService.changeStage).toHaveBeenCalledWith(
      7,
      dto,
      salesUser,
      '127.0.0.1',
    );
  });
});
