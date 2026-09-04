import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import type { CreateDealDto } from './dto/create-deal.dto';
import type { DealQueryDto } from './dto/deal-query.dto';
import {
  DealsRepository,
  type DealWithRelations,
} from './repositories/deals.repository';
import { DealsService } from './deals.service';

type DealsRepositoryMock = {
  findMany: jest.MockedFunction<DealsRepository['findMany']>;
  count: jest.MockedFunction<DealsRepository['count']>;
  findOwnedById: jest.MockedFunction<DealsRepository['findOwnedById']>;
  findById: jest.MockedFunction<DealsRepository['findById']>;
  findCustomerById: jest.MockedFunction<DealsRepository['findCustomerById']>;
  findUserById: jest.MockedFunction<DealsRepository['findUserById']>;
  findActiveUsersByRole: jest.MockedFunction<
    DealsRepository['findActiveUsersByRole']
  >;
  findCustomerAccessible: jest.MockedFunction<
    DealsRepository['findCustomerAccessible']
  >;
  findStageById: jest.MockedFunction<DealsRepository['findStageById']>;
  findPipelineStages: jest.MockedFunction<
    DealsRepository['findPipelineStages']
  >;
  findInitialStage: jest.MockedFunction<DealsRepository['findInitialStage']>;
  createWithLog: jest.MockedFunction<DealsRepository['createWithLog']>;
  assignWithLog: jest.MockedFunction<DealsRepository['assignWithLog']>;
  updateWithLog: jest.MockedFunction<DealsRepository['updateWithLog']>;
  getLinkedRecordCount: jest.MockedFunction<
    DealsRepository['getLinkedRecordCount']
  >;
  deleteWithLog: jest.MockedFunction<DealsRepository['deleteWithLog']>;
  changeStageWithLog: jest.MockedFunction<
    DealsRepository['changeStageWithLog']
  >;
};

describe('DealsService - quản lý Deal', () => {
  let dealsService: DealsService;
  let dealsRepository: DealsRepositoryMock;
  const salesUser = {
    userId: 5,
    fullName: 'Nguyễn Văn Sales',
    email: 'sales@crm.com',
    role: Role.SALES,
  } as AuthenticatedUser;

  const salesManagerUser = {
    userId: 2,
    fullName: 'Nguyễn Văn Manager',
    email: 'manager@crm.com',
    role: Role.SALES_MANAGER,
  } as AuthenticatedUser;

  const adminUser = {
    userId: 1,
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@crm.com',
    role: Role.ADMIN,
  } as AuthenticatedUser;

  const customerCareUser = {
    userId: 8,
    fullName: 'Nguyễn Văn Customer Care',
    email: 'care@crm.com',
    role: Role.CUSTOMER_CARE,
  } as AuthenticatedUser;

  const leadStage = {
    stageid: 1,
    stagename: 'Lead',
    stageorder: 1,
    probability: 10,
  };

  const proposalStage = {
    stageid: 2,
    stagename: 'Proposal',
    stageorder: 3,
    probability: 50,
  };

  const negotiationStage = {
    stageid: 3,
    stagename: 'Negotiation',
    stageorder: 4,
    probability: 70,
  };

  const deal = {
    dealid: 7,
    customerid: 3,
    assigneduserid: 5,
    stageid: 2,
    dealname: 'Triển khai CRM',
    dealvalue: new Prisma.Decimal(10_000_000),
    probability: 50,
    expectedrevenue: new Prisma.Decimal(5_000_000),
    expectedclosedate: new Date('2026-09-30'),
    status: 'Open',
    lostreason: null,
    createddate: new Date('2026-08-20T08:00:00.000Z'),
    customers: {
      customerid: 3,
      fullname: 'Công ty ABC',
      company: 'ABC',
    },
    pipelinestages: {
      stageid: 2,
      stagename: 'Proposal',
      stageorder: 3,
    },
    users: {
      userid: 5,
      fullname: 'Nguyễn Văn Sales',
    },
  } as DealWithRelations;

  beforeEach(() => {
    dealsRepository = {
      findMany: jest.fn() as jest.MockedFunction<DealsRepository['findMany']>,
      count: jest.fn() as jest.MockedFunction<DealsRepository['count']>,
      findOwnedById: jest.fn() as jest.MockedFunction<
        DealsRepository['findOwnedById']
      >,
      findById: jest.fn() as jest.MockedFunction<DealsRepository['findById']>,

      findCustomerById: jest.fn() as jest.MockedFunction<
        DealsRepository['findCustomerById']
      >,

      findUserById: jest.fn() as jest.MockedFunction<
        DealsRepository['findUserById']
      >,

      findActiveUsersByRole: jest.fn() as jest.MockedFunction<
        DealsRepository['findActiveUsersByRole']
      >,
      findCustomerAccessible: jest.fn() as jest.MockedFunction<
        DealsRepository['findCustomerAccessible']
      >,
      findStageById: jest.fn() as jest.MockedFunction<
        DealsRepository['findStageById']
      >,
      findInitialStage: jest.fn() as jest.MockedFunction<
        DealsRepository['findInitialStage']
      >,
      findPipelineStages: jest.fn() as jest.MockedFunction<
        DealsRepository['findPipelineStages']
      >,
      createWithLog: jest.fn() as jest.MockedFunction<
        DealsRepository['createWithLog']
      >,
      assignWithLog: jest.fn() as jest.MockedFunction<
        DealsRepository['assignWithLog']
      >,
      updateWithLog: jest.fn() as jest.MockedFunction<
        DealsRepository['updateWithLog']
      >,
      getLinkedRecordCount: jest.fn() as jest.MockedFunction<
        DealsRepository['getLinkedRecordCount']
      >,
      deleteWithLog: jest.fn() as jest.MockedFunction<
        DealsRepository['deleteWithLog']
      >,
      changeStageWithLog: jest.fn() as jest.MockedFunction<
        DealsRepository['changeStageWithLog']
      >,
    };

    dealsService = new DealsService(
      dealsRepository as unknown as DealsRepository,
    );
  });

  describe('findAll', () => {
    it('Sales chỉ lấy danh sách Deal thuộc quyền mình và áp dụng bộ lọc', async () => {
      dealsRepository.findMany.mockResolvedValue([deal]);
      dealsRepository.count.mockResolvedValue(21);
      const query = {
        search: 'CRM',
        stageId: 2,
        page: 2,
        limit: 10,
      } as DealQueryDto;

      const result = await dealsService.findAll(query, salesUser);

      expect(dealsRepository.findMany).toHaveBeenCalledWith(
        {
          search: 'CRM',
          stageId: 2,
          salesUserId: 5,
        },
        10,
        10,
      );
      expect(dealsRepository.count).toHaveBeenCalledWith({
        search: 'CRM',
        stageId: 2,
        salesUserId: 5,
      });
      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 21,
        totalPages: 3,
      });
      expect(result.data[0]).toMatchObject({
        dealId: 7,
        dealCode: 'DL007',
        dealName: 'Triển khai CRM',
        dealValue: 10_000_000,
        probability: 50,
        expectedRevenue: 5_000_000,
      });
    });
    it('trả danh sách rỗng khi Sales không có Deal phù hợp', async () => {
      dealsRepository.findMany.mockResolvedValue([]);
      dealsRepository.count.mockResolvedValue(0);

      const result = await dealsService.findAll(
        {
          page: 1,
          limit: 20,
        },
        salesUser,
      );
      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
    it('Sales Manager xem được toàn bộ Deal, không bị giới hạn theo người phụ trách', async () => {
      dealsRepository.findMany.mockResolvedValue([deal]);
      dealsRepository.count.mockResolvedValue(1);

      const query = {
        page: 1,
        limit: 20,
      } as DealQueryDto;

      await dealsService.findAll(query, salesManagerUser);

      expect(dealsRepository.findMany).toHaveBeenCalledWith(
        {
          search: undefined,
          stageId: undefined,
          salesUserId: undefined,
        },
        0,
        20,
      );

      expect(dealsRepository.count).toHaveBeenCalledWith({
        search: undefined,
        stageId: undefined,
        salesUserId: undefined,
      });
    });
  });

  it('Admin xem được toàn bộ Deal, không bị giới hạn theo người phụ trách', async () => {
    dealsRepository.findMany.mockResolvedValue([deal]);
    dealsRepository.count.mockResolvedValue(1);
    const query = { page: 1, limit: 20 } as DealQueryDto;
    const result = await dealsService.findAll(query, adminUser);
    expect(dealsRepository.findMany).toHaveBeenCalledWith(
      {
        search: undefined,
        stageId: undefined,
        salesUserId: undefined,
      },
      0,
      20,
    );

    expect(dealsRepository.count).toHaveBeenCalledWith({
      search: undefined,
      stageId: undefined,
      salesUserId: undefined,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].dealId).toBe(7);
  });

  describe('getMeta', () => {
    it('Sales lấy Pipeline Stage nhưng không lấy danh sách Sales', async () => {
      dealsRepository.findPipelineStages.mockResolvedValue([
        proposalStage,
        negotiationStage,
      ]);

      const result = await dealsService.getMeta(salesUser);

      expect(dealsRepository.findActiveUsersByRole).not.toHaveBeenCalled();

      expect(result).toEqual({
        stages: [
          {
            stageId: 2,
            stageName: 'Proposal',
            stageOrder: 3,
            probability: 50,
          },
          {
            stageId: 3,
            stageName: 'Negotiation',
            stageOrder: 4,
            probability: 70,
          },
        ],
        salesUsers: [],
      });
    });

    it('Sales Manager lấy Pipeline Stage và danh sách Sales đang hoạt động', async () => {
      dealsRepository.findPipelineStages.mockResolvedValue([
        proposalStage,
        negotiationStage,
      ]);

      dealsRepository.findActiveUsersByRole.mockResolvedValue([
        {
          userid: 5,
          fullname: 'Nguyễn Văn Sales',
          email: 'sales@crm.com',
        },
        {
          userid: 6,
          fullname: 'Trần Thị Sales',
          email: 'sales2@crm.com',
        },
      ]);

      const result = await dealsService.getMeta(salesManagerUser);

      expect(dealsRepository.findActiveUsersByRole).toHaveBeenCalledWith(
        Role.SALES,
      );

      expect(result.salesUsers).toEqual([
        {
          userId: 5,
          fullName: 'Nguyễn Văn Sales',
          email: 'sales@crm.com',
        },
        {
          userId: 6,
          fullName: 'Trần Thị Sales',
          email: 'sales2@crm.com',
        },
      ]);
    });
  });

  it('Admin lấy Pipeline Stage và danh sách Sales đang hoạt động', async () => {
    dealsRepository.findPipelineStages.mockResolvedValue([
      proposalStage,
      negotiationStage,
    ]);
    dealsRepository.findActiveUsersByRole.mockResolvedValue([
      {
        userid: 5,
        fullname: 'Nguyễn Văn Sales',
        email: 'sales@crm.com',
      },
      {
        userid: 6,
        fullname: 'Trần Thị Sales',
        email: 'sales2@crm.com',
      },
    ]);
    const result = await dealsService.getMeta(adminUser);
    expect(dealsRepository.findActiveUsersByRole).toHaveBeenCalledWith(
      Role.SALES,
    );
    expect(result.stages).toHaveLength(2);
    expect(result.salesUsers).toEqual([
      {
        userId: 5,
        fullName: 'Nguyễn Văn Sales',
        email: 'sales@crm.com',
      },
      {
        userId: 6,
        fullName: 'Trần Thị Sales',
        email: 'sales2@crm.com',
      },
    ]);
  });

  describe('findOne', () => {
    it('Sales xem được chi tiết Deal thuộc quyền của mình', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      const result = await dealsService.findOne(7, salesUser);
      expect(dealsRepository.findOwnedById).toHaveBeenCalledWith(7, 5);
      expect(result.dealId).toBe(7);
      expect(result.dealCode).toBe('DL007');
      expect(result.customer.customerId).toBe(3);
      expect(result.assignedUser.userId).toBe(5);
    });

    it('ném NotFoundException khi Deal không thuộc quyền Sales', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(null);
      await expect(dealsService.findOne(999, salesUser)).rejects.toThrow(
        'Không tìm thấy Deal.',
      );
    });
    it('Sales Manager xem được Deal không phụ thuộc người phụ trách', async () => {
      dealsRepository.findById.mockResolvedValue(deal);

      const result = await dealsService.findOne(7, salesManagerUser);

      expect(dealsRepository.findById).toHaveBeenCalledWith(7);
      expect(dealsRepository.findOwnedById).not.toHaveBeenCalled();
      expect(result.dealId).toBe(7);
    });
  });

  it('Admin xem được Deal không phụ thuộc người phụ trách', async () => {
    dealsRepository.findById.mockResolvedValue(deal);
    const result = await dealsService.findOne(7, adminUser);
    expect(dealsRepository.findById).toHaveBeenCalledWith(7);
    expect(dealsRepository.findOwnedById).not.toHaveBeenCalled();
    expect(result.dealId).toBe(7);
    expect(result.dealCode).toBe('DL007');
    expect(result.assignedUser.userId).toBe(5);
  });

  describe('create', () => {
    it('tạo Deal hợp lệ, tự gán Sales và tính Expected Revenue', async () => {
      dealsRepository.findCustomerAccessible.mockResolvedValue({
        customerid: 3,
      });
      dealsRepository.findInitialStage.mockResolvedValue(leadStage);
      dealsRepository.createWithLog.mockResolvedValue({
        ...deal,
        stageid: 1,
        probability: 10,
        expectedrevenue: new Prisma.Decimal(1_000_000),
        pipelinestages: {
          stageid: 1,
          stagename: 'Lead',
          stageorder: 1,
        },
      });
      const dto = {
        customerId: 3,
        stageId: 1,
        dealName: '  Triển khai CRM  ',
        dealValue: 10_000_000,
        expectedCloseDate: '2026-09-30',
      } as CreateDealDto;

      const result = await dealsService.create(dto, salesUser, '127.0.0.1');
      expect(dealsRepository.findCustomerAccessible).toHaveBeenCalledWith(3, 5);
      expect(dealsRepository.findInitialStage).toHaveBeenCalled();
      const [data, actorUserId, ipAddress] =
        dealsRepository.createWithLog.mock.calls[0];
      expect(data.customerid).toBe(3);
      expect(data.assigneduserid).toBe(5);
      expect(data.stageid).toBe(1);
      expect(data.dealname).toBe('Triển khai CRM');
      expect(data.dealvalue.toNumber()).toBe(10_000_000);
      expect(data.probability).toBe(10);
      expect(data.expectedrevenue.toNumber()).toBe(1_000_000);
      expect(data.expectedclosedate).toEqual(new Date('2026-09-30'));
      expect(actorUserId).toBe(5);
      expect(ipAddress).toBe('127.0.0.1');
      expect(result.message).toBe('Tạo Deal thành công.');
    });

    it('BR-06 - từ chối tạo Deal khi Customer không thuộc quyền Sales', async () => {
      dealsRepository.findCustomerAccessible.mockResolvedValue(null);
      await expect(
        dealsService.create(
          {
            customerId: 999,
            stageId: 2,
            dealName: 'Deal mới',
            dealValue: 1_000_000,
          },
          salesUser,
          null,
        ),
      ).rejects.toThrow(
        'Customer không tồn tại hoặc không thuộc quyền quản lý của Sales.',
      );

      expect(dealsRepository.findInitialStage).not.toHaveBeenCalled();
      expect(dealsRepository.createWithLog).not.toHaveBeenCalled();
    });

    it('từ chối tạo Deal khi không bắt đầu ở giai đoạn đầu tiên của Pipeline', async () => {
      dealsRepository.findCustomerAccessible.mockResolvedValue({
        customerid: 3,
      });
      dealsRepository.findInitialStage.mockResolvedValue(leadStage);
      await expect(
        dealsService.create(
          {
            customerId: 3,
            stageId: 2,
            dealName: 'Deal mới',
            dealValue: 1_000_000,
          },
          salesUser,
          null,
        ),
      ).rejects.toThrow(
        'Deal mới phải bắt đầu ở giai đoạn đầu tiên của Pipeline.',
      );
      expect(dealsRepository.createWithLog).not.toHaveBeenCalled();
    });

    it('BR-08 - từ chối tạo Deal khi Stage có xác suất không hợp lệ', async () => {
      dealsRepository.findCustomerAccessible.mockResolvedValue({
        customerid: 3,
      });
      dealsRepository.findInitialStage.mockResolvedValue({
        stageid: 6,
        stagename: 'Unconfigured',
        stageorder: 1,
        probability: 101,
      });

      await expect(
        dealsService.create(
          {
            customerId: 3,
            stageId: 6,
            dealName: 'Deal mới',
            dealValue: 1_000_000,
          },
          salesUser,
          null,
        ),
      ).rejects.toThrow('Giai đoạn "Unconfigured" có xác suất không hợp lệ.');
      expect(dealsRepository.createWithLog).not.toHaveBeenCalled();
    });
    it('BR-29 - Sales Manager tạo Deal và chọn Sales phụ trách thành công', async () => {
      dealsRepository.findCustomerById.mockResolvedValue({ customerid: 3 });

      dealsRepository.findUserById.mockResolvedValue({
        userid: 6,
        fullname: 'Trần Thị Sales',
        email: 'sales2@crm.com',
        status: true,
        roles: { rolename: 'Sales' },
      });

      dealsRepository.findInitialStage.mockResolvedValue(leadStage);

      dealsRepository.createWithLog.mockResolvedValue({
        ...deal,
        assigneduserid: 6,
        stageid: 1,
        probability: 10,
        expectedrevenue: new Prisma.Decimal(1_000_000),
        pipelinestages: {
          stageid: 1,
          stagename: 'Lead',
          stageorder: 1,
        },
        users: {
          userid: 6,
          fullname: 'Trần Thị Sales',
        },
      });

      const result = await dealsService.create(
        {
          customerId: 3,
          stageId: 1,
          assignedUserId: 6,
          dealName: 'Deal Manager tạo',
          dealValue: 10_000_000,
        },
        salesManagerUser,
        '127.0.0.1',
      );

      expect(dealsRepository.findCustomerById).toHaveBeenCalledWith(3);

      expect(dealsRepository.findUserById).toHaveBeenCalledWith(6);

      const [data, actorUserId, ipAddress, notifyAssignee] =
        dealsRepository.createWithLog.mock.calls[0];

      expect(data.assigneduserid).toBe(6);
      expect(actorUserId).toBe(2);
      expect(ipAddress).toBe('127.0.0.1');
      expect(notifyAssignee).toBe(true);

      expect(result.message).toBe('Tạo Deal thành công.');
    });

    it('BR-29 - từ chối khi Sales Manager tạo Deal nhưng không chọn Sales', async () => {
      dealsRepository.findCustomerById.mockResolvedValue({ customerid: 3 });

      await expect(
        dealsService.create(
          {
            customerId: 3,
            stageId: 1,
            dealName: 'Deal Manager tạo',
            dealValue: 10_000_000,
          },
          salesManagerUser,
          null,
        ),
      ).rejects.toThrow('Vui lòng chọn nhân viên Sales phụ trách Deal.');
      expect(dealsRepository.createWithLog).not.toHaveBeenCalled();
    });

    it('BR-29 - từ chối khi Sales Manager chọn nhân viên không tồn tại', async () => {
      dealsRepository.findCustomerById.mockResolvedValue({ customerid: 3 });

      dealsRepository.findUserById.mockResolvedValue(null);

      await expect(
        dealsService.create(
          {
            customerId: 3,
            stageId: 1,
            assignedUserId: 999,
            dealName: 'Deal Manager tạo',
            dealValue: 10_000_000,
          },
          salesManagerUser,
          null,
        ),
      ).rejects.toThrow('Nhân viên Sales không tồn tại.');

      expect(dealsRepository.createWithLog).not.toHaveBeenCalled();
    });

    it('BR-29 - từ chối khi Sales Manager chọn user không phải Sales', async () => {
      dealsRepository.findCustomerById.mockResolvedValue({ customerid: 3 });

      dealsRepository.findUserById.mockResolvedValue({
        userid: 1,
        fullname: 'Nguyễn Văn Admin',
        email: 'admin@crm.com',
        status: true,
        roles: { rolename: 'Admin' },
      });

      await expect(
        dealsService.create(
          {
            customerId: 3,
            stageId: 1,
            assignedUserId: 1,
            dealName: 'Deal Manager tạo',
            dealValue: 10_000_000,
          },
          salesManagerUser,
          null,
        ),
      ).rejects.toThrow('Người được phân công phải có vai trò Sales.');

      expect(dealsRepository.createWithLog).not.toHaveBeenCalled();
    });

    it('BR-29 - từ chối khi Sales Manager chọn Sales đã bị khóa', async () => {
      dealsRepository.findCustomerById.mockResolvedValue({ customerid: 3 });

      dealsRepository.findUserById.mockResolvedValue({
        userid: 6,
        fullname: 'Trần Thị Sales',
        email: 'sales2@crm.com',
        status: false,
        roles: { rolename: 'Sales' },
      });

      await expect(
        dealsService.create(
          {
            customerId: 3,
            stageId: 1,
            assignedUserId: 6,
            dealName: 'Deal Manager tạo',
            dealValue: 10_000_000,
          },
          salesManagerUser,
          null,
        ),
      ).rejects.toThrow(
        'Không thể phân công Deal cho tài khoản Sales đã bị khóa.',
      );

      expect(dealsRepository.createWithLog).not.toHaveBeenCalled();
    });

    it('BR-29 - Sales không thể tự ý chọn người phụ trách khác khi tạo Deal', async () => {
      dealsRepository.findCustomerAccessible.mockResolvedValue({
        customerid: 3,
      });

      dealsRepository.findInitialStage.mockResolvedValue(leadStage);

      dealsRepository.createWithLog.mockResolvedValue({
        ...deal,
        stageid: 1,
        assigneduserid: 5,
        probability: 10,
        expectedrevenue: new Prisma.Decimal(1_000_000),
        pipelinestages: {
          stageid: 1,
          stagename: 'Lead',
          stageorder: 1,
        },
      });

      await dealsService.create(
        {
          customerId: 3,
          stageId: 1,
          assignedUserId: 6,
          dealName: 'Deal Sales tạo',
          dealValue: 10_000_000,
        },
        salesUser,
        null,
      );

      const data = dealsRepository.createWithLog.mock.calls[0][0];

      expect(data.assigneduserid).toBe(5);

      expect(dealsRepository.findUserById).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('từ chối cập nhật khi không có dữ liệu thay đổi', async () => {
      await expect(dealsService.update(7, {}, salesUser, null)).rejects.toThrow(
        new BadRequestException('Không có dữ liệu để cập nhật.'),
      );
      expect(dealsRepository.findOwnedById).not.toHaveBeenCalled();
      expect(dealsRepository.updateWithLog).not.toHaveBeenCalled();
    });

    it('từ chối cập nhật Deal không thuộc quyền Sales', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(null);
      await expect(
        dealsService.update(999, { dealName: 'Deal mới' }, salesUser, null),
      ).rejects.toThrow('Không tìm thấy Deal.');

      expect(dealsRepository.updateWithLog).not.toHaveBeenCalled();
    });

    it('từ chối đổi sang Customer không thuộc quyền Sales', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      dealsRepository.findCustomerAccessible.mockResolvedValue(null);
      await expect(
        dealsService.update(7, { customerId: 999 }, salesUser, null),
      ).rejects.toThrow(
        'Customer không tồn tại hoặc không thuộc quyền quản lý của Sales.',
      );
      expect(dealsRepository.updateWithLog).not.toHaveBeenCalled();
    });

    it('cập nhật Deal Value và tính lại Expected Revenue', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      dealsRepository.findCustomerAccessible.mockResolvedValue({
        customerid: 4,
      });
      const updatedDeal = {
        ...deal,
        customerid: 4,
        dealname: 'CRM Enterprise',
        dealvalue: new Prisma.Decimal(20_000_000),
        expectedrevenue: new Prisma.Decimal(10_000_000),
        expectedclosedate: new Date('2026-10-15'),
      } as DealWithRelations;
      dealsRepository.updateWithLog.mockResolvedValue(updatedDeal);
      const result = await dealsService.update(
        7,
        {
          customerId: 4,
          dealName: '  CRM Enterprise  ',
          dealValue: 20_000_000,
          expectedCloseDate: '2026-10-15',
        },
        salesUser,
        '127.0.0.1',
      );
      const [, data, actorUserId, ipAddress] =
        dealsRepository.updateWithLog.mock.calls[0];
      expect(data.customerid).toBe(4);
      expect(data.dealname).toBe('CRM Enterprise');
      expect(data.dealvalue).toBeDefined();
      expect(data.expectedrevenue).toBeDefined();
      expect(data.dealvalue!.toNumber()).toBe(20_000_000);
      expect(data.expectedrevenue!.toNumber()).toBe(10_000_000);
      expect(data.expectedclosedate).toEqual(new Date('2026-10-15'));
      expect(actorUserId).toBe(5);
      expect(ipAddress).toBe('127.0.0.1');
      expect(result.message).toBe('Cập nhật Deal thành công.');
    });

    it('giữ Deal Value hiện tại để tính Expected Revenue khi không đổi giá trị Deal', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      dealsRepository.updateWithLog.mockResolvedValue({
        ...deal,
        dealname: 'Tên Deal mới',
      });
      await dealsService.update(
        7,
        { dealName: 'Tên Deal mới' },
        salesUser,
        null,
      );
      const data = dealsRepository.updateWithLog.mock.calls[0][1];
      expect(data.dealname).toBe('Tên Deal mới');
      expect(data.dealvalue).toBeUndefined();
      expect(data.expectedrevenue).toBeDefined();
      expect(data.expectedrevenue!.toNumber()).toBe(5_000_000);
    });
  });

  describe('remove', () => {
    it('từ chối xóa Deal không thuộc quyền Sales', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(null);
      await expect(dealsService.remove(999, salesUser, null)).rejects.toThrow(
        'Không tìm thấy Deal.',
      );
      expect(dealsRepository.getLinkedRecordCount).not.toHaveBeenCalled();
      expect(dealsRepository.deleteWithLog).not.toHaveBeenCalled();
    });
    it('ném NotFoundException khi không tìm thấy dữ liệu Deal lúc kiểm tra liên kết', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      dealsRepository.getLinkedRecordCount.mockResolvedValue(null);
      await expect(dealsService.remove(7, salesUser, null)).rejects.toThrow(
        new NotFoundException('Không tìm thấy Deal.'),
      );
      expect(dealsRepository.deleteWithLog).not.toHaveBeenCalled();
    });
    it.each([
      [
        'Quote',
        {
          quotes: 1,
          activities: 0,
          tasks: 0,
        },
      ],
      [
        'Activity',
        {
          quotes: 0,
          activities: 1,
          tasks: 0,
        },
      ],
      [
        'Task',
        {
          quotes: 0,
          activities: 0,
          tasks: 1,
        },
      ],
    ])(
      'BR-20 - từ chối xóa Deal đã phát sinh %s',
      async (_linkedType, counts) => {
        dealsRepository.findOwnedById.mockResolvedValue(deal);
        dealsRepository.getLinkedRecordCount.mockResolvedValue({
          _count: counts,
        });
        await expect(dealsService.remove(7, salesUser, null)).rejects.toThrow(
          new UnprocessableEntityException(
            'Deal đã phát sinh dữ liệu liên quan nên không thể xóa.',
          ),
        );
        expect(dealsRepository.deleteWithLog).not.toHaveBeenCalled();
      },
    );

    it('xóa Deal chưa phát sinh dữ liệu liên quan và ghi Activity Log', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      dealsRepository.getLinkedRecordCount.mockResolvedValue({
        _count: {
          quotes: 0,
          activities: 0,
          tasks: 0,
        },
      });
      dealsRepository.deleteWithLog.mockResolvedValue(undefined);
      await dealsService.remove(7, salesUser, '192.168.1.10');
      expect(dealsRepository.deleteWithLog).toHaveBeenCalledWith(
        7,
        5,
        '192.168.1.10',
      );
    });
  });

  describe('assign', () => {
    it('BR-07, BR-14, BR-18 - Sales Manager phân công Deal thành công', async () => {
      dealsRepository.findById.mockResolvedValue(deal);

      dealsRepository.findUserById.mockResolvedValue({
        userid: 6,
        fullname: 'Trần Thị Sales',
        email: 'sales2@crm.com',
        status: true,
        roles: { rolename: 'Sales' },
      });

      const reassignedDeal = {
        ...deal,
        assigneduserid: 6,
        users: {
          userid: 6,
          fullname: 'Trần Thị Sales',
        },
      };

      dealsRepository.assignWithLog.mockResolvedValue(reassignedDeal);

      const result = await dealsService.assign(
        7,
        {
          assignedUserId: 6,
        },
        salesManagerUser,
        '127.0.0.1',
      );

      expect(dealsRepository.findById).toHaveBeenCalledWith(7);
      expect(dealsRepository.findUserById).toHaveBeenCalledWith(6);
      expect(dealsRepository.assignWithLog).toHaveBeenCalledWith(
        7,
        6,
        2,
        deal,
        '127.0.0.1',
      );
      expect(result.message).toBe('Phân công Deal thành công.');
      expect(result.data.assignedUser.userId).toBe(6);
    });

    it('BR-07 - Sales không có quyền phân công Deal', async () => {
      await expect(
        dealsService.assign(
          7,
          {
            assignedUserId: 6,
          },
          salesUser,
        ),
      ).rejects.toThrow('Bạn không có quyền phân công Deal.');

      expect(dealsRepository.findById).not.toHaveBeenCalled();
      expect(dealsRepository.assignWithLog).not.toHaveBeenCalled();
    });

    it('từ chối phân công khi Deal không tồn tại', async () => {
      dealsRepository.findById.mockResolvedValue(null);

      await expect(
        dealsService.assign(
          999,
          {
            assignedUserId: 6,
          },
          salesManagerUser,
        ),
      ).rejects.toThrow('Không tìm thấy Deal.');

      expect(dealsRepository.findUserById).not.toHaveBeenCalled();

      expect(dealsRepository.assignWithLog).not.toHaveBeenCalled();
    });

    it('từ chối phân công khi nhân viên Sales không tồn tại', async () => {
      dealsRepository.findById.mockResolvedValue(deal);
      dealsRepository.findUserById.mockResolvedValue(null);

      await expect(
        dealsService.assign(
          7,
          {
            assignedUserId: 999,
          },
          salesManagerUser,
        ),
      ).rejects.toThrow('Nhân viên Sales không tồn tại.');

      expect(dealsRepository.assignWithLog).not.toHaveBeenCalled();
    });

    it('BR-07 - từ chối phân công cho user không phải Sales', async () => {
      dealsRepository.findById.mockResolvedValue(deal);

      dealsRepository.findUserById.mockResolvedValue({
        userid: 1,
        fullname: 'Nguyễn Văn Admin',
        email: 'admin@crm.com',
        status: true,
        roles: {
          rolename: 'Admin',
        },
      });

      await expect(
        dealsService.assign(
          7,
          {
            assignedUserId: 1,
          },
          salesManagerUser,
        ),
      ).rejects.toThrow('Người được phân công phải có vai trò Sales.');

      expect(dealsRepository.assignWithLog).not.toHaveBeenCalled();
    });

    it('từ chối phân công cho Sales đã bị khóa', async () => {
      dealsRepository.findById.mockResolvedValue(deal);

      dealsRepository.findUserById.mockResolvedValue({
        userid: 6,
        fullname: 'Trần Thị Sales',
        email: 'sales2@crm.com',
        status: false,
        roles: {
          rolename: 'Sales',
        },
      });

      await expect(
        dealsService.assign(
          7,
          {
            assignedUserId: 6,
          },
          salesManagerUser,
        ),
      ).rejects.toThrow(
        'Không thể phân công Deal cho tài khoản Sales đã bị khóa.',
      );

      expect(dealsRepository.assignWithLog).not.toHaveBeenCalled();
    });

    it('từ chối khi Deal đã được phân công cho Sales đang chọn', async () => {
      dealsRepository.findById.mockResolvedValue(deal);

      dealsRepository.findUserById.mockResolvedValue({
        userid: 5,
        fullname: 'Nguyễn Văn Sales',
        email: 'sales@crm.com',
        status: true,
        roles: {
          rolename: 'Sales',
        },
      });

      await expect(
        dealsService.assign(
          7,
          {
            assignedUserId: 5,
          },
          salesManagerUser,
        ),
      ).rejects.toThrow('Deal đã được phân công cho nhân viên này.');

      expect(dealsRepository.assignWithLog).not.toHaveBeenCalled();
    });
  });

  describe('changeStage', () => {
    it('BR-33 - Sales không được đổi Stage Deal không thuộc quyền mình', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(null);
      await expect(
        dealsService.changeStage(999, { stageId: 3 }, salesUser),
      ).rejects.toThrow('Không tìm thấy Deal.');
      expect(dealsRepository.findOwnedById).toHaveBeenCalledWith(999, 5);
      expect(dealsRepository.findById).not.toHaveBeenCalled();
      expect(dealsRepository.findStageById).not.toHaveBeenCalled();
      expect(dealsRepository.changeStageWithLog).not.toHaveBeenCalled();
    });

    it('BR-33, BR-08, BR-09, BR-18 - Sales Manager được đổi Stage Deal bất kỳ', async () => {
      dealsRepository.findById.mockResolvedValue(deal);
      dealsRepository.findStageById.mockResolvedValue(negotiationStage);
      const updatedDeal = {
        ...deal,
        stageid: 3,
        probability: 70,
        expectedrevenue: new Prisma.Decimal(7_000_000),
        pipelinestages: {
          ...deal.pipelinestages,
          stageid: 3,
          stagename: 'Negotiation',
          stageorder: 4,
        },
      } as DealWithRelations;
      dealsRepository.changeStageWithLog.mockResolvedValue(updatedDeal);
      const result = await dealsService.changeStage(
        7,
        { stageId: 3 },
        salesManagerUser,
        '192.168.1.20',
      );

      expect(dealsRepository.findById).toHaveBeenCalledWith(7);
      expect(dealsRepository.findOwnedById).not.toHaveBeenCalled();
      const input = dealsRepository.changeStageWithLog.mock.calls[0][0];
      expect(input.userId).toBe(2);
      expect(input.stageId).toBe(3);
      expect(input.probability).toBe(70);
      expect(input.expectedRevenue.toNumber()).toBe(7_000_000);
      expect(result.message).toBe('Cập nhật giai đoạn Deal thành công.');
    });

    it('BR-33, BR-08, BR-09, BR-18 - Admin được đổi Stage Deal bất kỳ', async () => {
      dealsRepository.findById.mockResolvedValue(deal);
      dealsRepository.findStageById.mockResolvedValue(negotiationStage);
      const updatedDeal = {
        ...deal,
        stageid: 3,
        probability: 70,
        expectedrevenue: new Prisma.Decimal(7_000_000),
        pipelinestages: {
          ...deal.pipelinestages,
          stageid: 3,
          stagename: 'Negotiation',
          stageorder: 4,
        },
      } as DealWithRelations;

      dealsRepository.changeStageWithLog.mockResolvedValue(updatedDeal);
      const result = await dealsService.changeStage(
        7,
        { stageId: 3 },
        adminUser,
        '192.168.1.30',
      );

      expect(dealsRepository.findById).toHaveBeenCalledWith(7);
      expect(dealsRepository.findOwnedById).not.toHaveBeenCalled();
      const input = dealsRepository.changeStageWithLog.mock.calls[0][0];
      expect(input.userId).toBe(1);
      expect(input.stageId).toBe(3);

      expect(result.message).toBe('Cập nhật giai đoạn Deal thành công.');
    });

    it('BR-33 - từ chối role không có quyền thay đổi Stage Deal', async () => {
      await expect(
        dealsService.changeStage(7, { stageId: 3 }, customerCareUser),
      ).rejects.toThrow(
        new ForbiddenException('Bạn không có quyền thay đổi giai đoạn Deal.'),
      );

      expect(dealsRepository.findOwnedById).not.toHaveBeenCalled();
      expect(dealsRepository.findById).not.toHaveBeenCalled();
      expect(dealsRepository.findStageById).not.toHaveBeenCalled();
      expect(dealsRepository.changeStageWithLog).not.toHaveBeenCalled();
    });

    it('không cập nhật khi Deal đã ở đúng Stage được chọn', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      const result = await dealsService.changeStage(
        7,
        { stageId: 2 },
        salesUser,
      );
      expect(result.message).toBe('Deal đang ở giai đoạn này.');
      expect(dealsRepository.findStageById).not.toHaveBeenCalled();
      expect(dealsRepository.changeStageWithLog).not.toHaveBeenCalled();
    });

    it.each(['Won', 'Lost'])(
      'BR-10 - không cho chuyển Stage khi Deal đang ở %s',
      async (stageName) => {
        dealsRepository.findOwnedById.mockResolvedValue({
          ...deal,
          stageid: 5,
          pipelinestages: {
            ...deal.pipelinestages,
            stageid: 5,
            stagename: stageName,
          },
        });

        await expect(
          dealsService.changeStage(7, { stageId: 2 }, salesUser),
        ).rejects.toThrow(
          'Deal đang ở giai đoạn Won hoặc Lost nên không thể thay đổi giai đoạn.',
        );
        expect(dealsRepository.findStageById).not.toHaveBeenCalled();
        expect(dealsRepository.changeStageWithLog).not.toHaveBeenCalled();
      },
    );

    it('từ chối khi Pipeline Stage đích không tồn tại', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      dealsRepository.findStageById.mockResolvedValue(null);

      await expect(
        dealsService.changeStage(7, { stageId: 999 }, salesUser),
      ).rejects.toThrow('Giai đoạn Pipeline không hợp lệ.');
      expect(dealsRepository.changeStageWithLog).not.toHaveBeenCalled();
    });

    it('BR-10 - từ chối chuyển Deal sang Lost khi không nhập lý do thất bại', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);

      dealsRepository.findStageById.mockResolvedValue({
        stageid: 5,
        stagename: 'Lost',
        stageorder: 6,
        probability: 0,
      });

      await expect(
        dealsService.changeStage(7, { stageId: 5 }, salesUser, '192.168.1.10'),
      ).rejects.toThrow(
        new UnprocessableEntityException(
          'Vui lòng nhập lý do thất bại khi chuyển Deal sang Lost.',
        ),
      );

      expect(dealsRepository.changeStageWithLog).not.toHaveBeenCalled();
    });

    it('BR-10 - từ chối chuyển Deal sang Lost khi lý do chỉ có khoảng trắng', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      dealsRepository.findStageById.mockResolvedValue({
        stageid: 5,
        stagename: 'Lost',
        stageorder: 6,
        probability: 0,
      });

      await expect(
        dealsService.changeStage(
          7,
          {
            stageId: 5,
            lostReason: '   ',
          },
          salesUser,
          '192.168.1.10',
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException(
          'Vui lòng nhập lý do thất bại khi chuyển Deal sang Lost.',
        ),
      );
      expect(dealsRepository.changeStageWithLog).not.toHaveBeenCalled();
    });

    it('BR-10, BR-18 - chuyển Deal sang Lost thành công khi có lý do thất bại', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      dealsRepository.findStageById.mockResolvedValue({
        stageid: 5,
        stagename: 'Lost',
        stageorder: 6,
        probability: 0,
      });
      const updatedDeal = {
        ...deal,
        stageid: 5,
        probability: 0,
        expectedrevenue: new Prisma.Decimal(0),
        status: 'Lost',
        lostreason: 'Khách hàng chọn đối thủ.',
        pipelinestages: {
          stageid: 5,
          stagename: 'Lost',
          stageorder: 6,
        },
      } as DealWithRelations;

      dealsRepository.changeStageWithLog.mockResolvedValue(updatedDeal);
      const result = await dealsService.changeStage(
        7,
        {
          stageId: 5,
          lostReason: '  Khách hàng chọn đối thủ.  ',
        },
        salesUser,
        '192.168.1.10',
      );

      const input = dealsRepository.changeStageWithLog.mock.calls[0][0];

      expect(input.dealId).toBe(7);
      expect(input.stageId).toBe(5);
      expect(input.stageName).toBe('Lost');
      expect(input.probability).toBe(0);
      expect(input.expectedRevenue.toNumber()).toBe(0);
      expect(input.status).toBe('Lost');
      expect(input.lostReason).toBe('Khách hàng chọn đối thủ.');
      expect(input.currentDeal).toBe(deal);
      expect(input.userId).toBe(5);
      expect(input.ipAddress).toBe('192.168.1.10');
      expect(result.message).toBe('Cập nhật giai đoạn Deal thành công.');
      expect(result.data.status).toBe('Lost');
      expect(result.data.lostReason).toBe('Khách hàng chọn đối thủ.');
    });

    it('BR-08 - từ chối khi Stage đích có xác suất không hợp lệ', async () => {
      dealsRepository.findStageById.mockResolvedValue({
        stageid: 6,
        stagename: 'Unconfigured',
        stageorder: 6,
        probability: 101,
      });
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      await expect(
        dealsService.changeStage(7, { stageId: 6 }, salesUser),
      ).rejects.toThrow('Giai đoạn "Unconfigured" có xác suất không hợp lệ.');
      expect(dealsRepository.changeStageWithLog).not.toHaveBeenCalled();
    });

    it('BR-08, BR-09, BR-18 - đổi Stage thành công, cập nhật xác suất và Expected Revenue', async () => {
      dealsRepository.findOwnedById.mockResolvedValue(deal);
      dealsRepository.findStageById.mockResolvedValue(negotiationStage);
      const updatedDeal = {
        ...deal,
        stageid: 3,
        probability: 70,
        expectedrevenue: new Prisma.Decimal(7_000_000),
        pipelinestages: {
          stageid: 3,
          stagename: 'Negotiation',
          stageorder: 4,
        },
      } as DealWithRelations;
      dealsRepository.changeStageWithLog.mockResolvedValue(updatedDeal);
      const result = await dealsService.changeStage(
        7,
        { stageId: 3 },
        salesUser,
        '192.168.1.10',
      );
      const input = dealsRepository.changeStageWithLog.mock.calls[0][0];

      expect(input.dealId).toBe(7);
      expect(input.stageId).toBe(3);
      expect(input.stageName).toBe('Negotiation');
      expect(input.probability).toBe(70);
      expect(input.expectedRevenue.toNumber()).toBe(7_000_000);
      expect(input.lostReason).toBeNull();
      expect(input.currentDeal).toBe(deal);
      expect(input.userId).toBe(5);
      expect(input.ipAddress).toBe('192.168.1.10');
      expect(result.message).toBe('Cập nhật giai đoạn Deal thành công.');
      expect(result.data.stage.stageName).toBe('Negotiation');
      expect(result.data.probability).toBe(70);
      expect(result.data.expectedRevenue).toBe(7_000_000);
    });
  });
});
