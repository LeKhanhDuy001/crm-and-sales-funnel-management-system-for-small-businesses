import type { Request } from 'express';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

describe('LeadsController', () => {
  let controller: LeadsController;

  const leadsService = {
    findAll: jest.fn(),
    findSources: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    convertLead: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const salesUser: AuthenticatedUser = {
    userId: 3,
    fullName: 'Sales A',
    email: 'sales.a@crm.local',
    role: Role.SALES,
  };

  const marketingUser: AuthenticatedUser = {
    userId: 6,
    fullName: 'Marketing',
    email: 'marketing@crm.local',
    role: Role.MARKETING,
  };

  const salesRequest = {
    user: salesUser,
  } as Request & { user: AuthenticatedUser };

  const marketingRequest = {
    user: marketingUser,
  } as Request & { user: AuthenticatedUser };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new LeadsController(leadsService as unknown as LeadsService);
  });

  it('truyền current user vào findAll để áp dụng record-level permission', () => {
    const query = { page: 1, limit: 20 };

    controller.findAll(query, salesRequest);

    expect(leadsService.findAll).toHaveBeenCalledWith(query, salesUser);
  });

  it('lấy danh sách nguồn Lead', () => {
    controller.findSources();

    expect(leadsService.findSources).toHaveBeenCalledTimes(1);
  });

  it('SE-06 - GET /leads/:id truyền current user để chống IDOR', () => {
    controller.findOne(7, salesRequest);

    expect(leadsService.findOne).toHaveBeenCalledWith(7, salesUser);
  });

  it('Marketing tạo Lead với userId của người hiện tại', () => {
    const dto = {
      fullName: 'Lead mới',
      email: 'lead@crm.local',
    };

    controller.create(dto, marketingRequest);

    expect(leadsService.create).toHaveBeenCalledWith(dto, marketingUser.userId);
  });

  it('Sales chuyển Lead thành Customer với current user', () => {
    controller.convertLead({ leadId: 7 }, salesRequest);

    expect(leadsService.convertLead).toHaveBeenCalledWith(7, salesUser);
  });

  it('Marketing cập nhật Lead với userId hiện tại', () => {
    const dto = {
      fullName: 'Lead cập nhật',
    };

    controller.update(7, dto, marketingRequest);

    expect(leadsService.update).toHaveBeenCalledWith(
      7,
      dto,
      marketingUser.userId,
    );
  });

  it('Marketing xóa Lead với userId hiện tại', async () => {
    leadsService.remove.mockResolvedValue(undefined);

    await controller.remove(7, marketingRequest);

    expect(leadsService.remove).toHaveBeenCalledWith(
      7,
      marketingUser.userId,
    );
  });
});