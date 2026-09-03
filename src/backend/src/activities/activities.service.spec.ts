import {
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { ActivitiesService } from './activities.service';
import type { CreateActivityDto } from './dto/create-activity.dto';
import type { UpdateActivityResultDto } from './dto/update-activity-result.dto';
import type { ActivityType } from './enums/activity-type.enum';
import { ActivitiesRepository, type ActivityWithRelations, } from './repositories/activities.repository';

type ActivitiesRepositoryMock = {
  findManyByUser: jest.Mock;
  findById: jest.Mock;
  findDealById: jest.Mock;
  findSalesDealsForActivity: jest.Mock;
  findCustomerCareDealsForActivity: jest.Mock;
  createWithActivityLog: jest.Mock;
  updateResultWithActivityLog: jest.Mock;
  cancelWithActivityLog: jest.Mock;
  findActiveAssignedTaskForDeal: jest.Mock;
};

describe('ActivitiesService', () => {
  let activitiesService: ActivitiesService;
  let activitiesRepository: ActivitiesRepositoryMock;
  const salesUser = {
    userId: 5,
    email: 'sales@crm.com',
    role: Role.SALES,
  } as unknown as AuthenticatedUser;
  const customerCareUser = {
    userId: 8,
    email: 'care@crm.com',
    role: Role.CUSTOMER_CARE,
  } as unknown as AuthenticatedUser;
  const adminUser = {
    userId: 1,
    email: 'admin@crm.com',
    role: Role.ADMIN,
  } as unknown as AuthenticatedUser;
  function makeActivity(
    overrides: Record<string, unknown> = {},
  ): ActivityWithRelations {
    return {
      activityid: 11,
      dealid: 7,
      userid: 5,
      activitytype: 'Call',
      subject: 'Gọi xác nhận nhu cầu',
      description: 'Trao đổi nhu cầu CRM với khách hàng.',
      activitytime: new Date('2026-09-03T02:00:00.000Z'),
      result: null,
      status: 'Pending',
      users: {
        userid: 5,
        fullname: 'Nguyễn Văn Sales',
        email: 'sales@crm.com',
      },

      deals: {
        dealid: 7,
        dealname: 'CRM Enterprise',
        customers: {
          customerid: 12,
          fullname: 'Phạm Quốc Huy',
          company: 'ABC Company',
        },
      },
      ...overrides,
    } as unknown as ActivityWithRelations;
  }

  function makeDeal(
    overrides: Record<string, unknown> = {},
  ): Awaited<
    ReturnType<ActivitiesRepository['findDealById']>
  > {
    return {
      dealid: 7,
      dealname: 'CRM Enterprise',
      assigneduserid: 5,
      customers: {
        customerid: 12,
        fullname: 'Phạm Quốc Huy',
        company: 'ABC Company',
      },
      tasks: [],
      ...overrides,
    } as unknown as Awaited<
      ReturnType<ActivitiesRepository['findDealById']>
    >;
  }

  beforeEach(() => {
    activitiesRepository = {
      findManyByUser: jest.fn(),
      findById: jest.fn(),
      findDealById: jest.fn(),
      findSalesDealsForActivity: jest.fn(),
      findCustomerCareDealsForActivity: jest.fn(),
      createWithActivityLog: jest.fn(),
      updateResultWithActivityLog: jest.fn(),
      cancelWithActivityLog: jest.fn(),
      findActiveAssignedTaskForDeal: jest.fn(),
    };

    activitiesService = new ActivitiesService(activitiesRepository as unknown as ActivitiesRepository,);
  });

  describe('findAll', () => {
    it('trả danh sách Activity của người dùng đang đăng nhập', async () => {
      const activity = makeActivity();
      activitiesRepository.findManyByUser.mockResolvedValue([activity,]);
      const result = await activitiesService.findAll(salesUser);
      expect(activitiesRepository.findManyByUser,).toHaveBeenCalledWith(5);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].activityId).toBe(11);
      expect(result.data[0].status).toBe('Pending');
      expect(result.data[0].customer.fullName).toBe('Phạm Quốc Huy',);
    });

    it('từ chối Role không được sử dụng chức năng Activity', async () => {
      await expect(
        activitiesService.findAll(adminUser),
      ).rejects.toThrow(
        new ForbiddenException('Bạn không có quyền sử dụng chức năng Activity.',),
      );

      expect(activitiesRepository.findManyByUser,).not.toHaveBeenCalled();
    });
  });

  describe('getMeta', () => {
    it('Sales chỉ nhận các Deal thuộc quyền Sales', async () => {
      activitiesRepository.findSalesDealsForActivity.mockResolvedValue(
        [
          {
            dealid: 7,
            dealname: 'CRM Enterprise',
            customers: {
              customerid: 12,
              fullname: 'Phạm Quốc Huy',
              company: 'ABC Company',
            },
          },
        ],
      );

      const result = await activitiesService.getMeta(salesUser);
      expect(activitiesRepository.findSalesDealsForActivity,).toHaveBeenCalledWith(5);
      expect(activitiesRepository.findCustomerCareDealsForActivity,).not.toHaveBeenCalled();
      expect(result.deals).toEqual([
        {
          dealId: 7,
          dealName: 'CRM Enterprise',
          customer: {
            customerId: 12,
            fullName: 'Phạm Quốc Huy',
            company: 'ABC Company',
          },
        },
      ]);
    });

    it('Customer Care chỉ nhận Deal có Task được phân công', async () => {
      activitiesRepository.findCustomerCareDealsForActivity.mockResolvedValue(
        [
          {
            dealid: 7,
            dealname: 'CRM Enterprise',
            customers: {
              customerid: 12,
              fullname: 'Phạm Quốc Huy',
              company: 'ABC Company',
            },
          },
        ],
      );
      const result = await activitiesService.getMeta(customerCareUser,);
      expect(activitiesRepository.findCustomerCareDealsForActivity,).toHaveBeenCalledWith(8);
      expect(activitiesRepository.findSalesDealsForActivity,).not.toHaveBeenCalled();
      expect(result.deals).toHaveLength(1);
      expect(result.deals[0].dealId).toBe(7);
    });
  });

  describe('findOne', () => {
    it('trả chi tiết Activity thuộc người dùng hiện tại', async () => {
      activitiesRepository.findById.mockResolvedValue(makeActivity(),);
      const result = await activitiesService.findOne(11, salesUser,);
      expect(activitiesRepository.findById,).toHaveBeenCalledWith(11);
      expect(result.activityId).toBe(11);
      expect(result.status).toBe('Pending');
      expect(result.deal.dealName).toBe('CRM Enterprise',);
    });

    it('từ chối xem Activity của người khác', async () => {
      activitiesRepository.findById.mockResolvedValue(
        makeActivity({ userid: 99, }),
      );

      await expect(
        activitiesService.findOne(
          11,
          salesUser,
        ),
      ).rejects.toThrow(
        new NotFoundException('Không tìm thấy Activity hoặc bạn không có quyền truy cập Activity này.',),
      );
    });

    it('ném NotFoundException khi Activity không tồn tại', async () => {
      activitiesRepository.findById.mockResolvedValue(null,);
      await expect(
        activitiesService.findOne(
          999,
          salesUser,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create - Sales', () => {
    it('BR-15, BR-18 - Sales tạo Activity cho Deal mình phụ trách', async () => {
      const deal = makeDeal();
      const createdActivity = makeActivity();
      activitiesRepository.findDealById.mockResolvedValue(deal,);
      activitiesRepository.createWithActivityLog.mockResolvedValue(createdActivity,);
      const dto = {
        dealId: 7,
        activityType: 'Call' as ActivityType,
        subject: '  Gọi xác nhận nhu cầu  ',
        description: '  Trao đổi nhu cầu CRM với khách hàng.  ',
        activityTime: '2026-09-03T02:00:00.000Z',
      } as CreateActivityDto;

      const result = await activitiesService.create(dto, salesUser, '127.0.0.1',);
      expect(activitiesRepository.findDealById,).toHaveBeenCalledWith(7);
      expect(
        activitiesRepository.createWithActivityLog,
      ).toHaveBeenCalledWith({
        dealId: 7,
        userId: 5,
        activityType: 'Call',
        subject: 'Gọi xác nhận nhu cầu',
        description: 'Trao đổi nhu cầu CRM với khách hàng.',
        activityTime: new Date('2026-09-03T02:00:00.000Z',),
        ipAddress: '127.0.0.1',
      });

      expect(result.message).toBe('Ghi nhận hoạt động chăm sóc thành công.',);
      expect(result.data.status).toBe('Pending',);
      expect(result.data.result).toBeNull();
    });

    it('Sales không được tạo Activity cho Deal của Sales khác', async () => {
      activitiesRepository.findDealById.mockResolvedValue(
        makeDeal({ assigneduserid: 99, }),
      );
      const dto = {
        dealId: 7,
        activityType: 'Call' as ActivityType,
        subject: 'Gọi khách hàng',
        description: 'Trao đổi nhu cầu.',
        activityTime: '2026-09-03T02:00:00.000Z',
      } as CreateActivityDto;

      await expect(
        activitiesService.create(
          dto,
          salesUser,
        ),
      ).rejects.toThrow(
        new NotFoundException('Không tìm thấy Deal hoặc bạn không có quyền chăm sóc Deal này.',),
      );

      expect(activitiesRepository.createWithActivityLog,).not.toHaveBeenCalled();
    });

    it('ném NotFoundException khi Deal không tồn tại', async () => {
      activitiesRepository.findDealById.mockResolvedValue(null,);
      const dto = {
        dealId: 999,
        activityType: 'Call' as ActivityType,
        subject: 'Gọi khách hàng',
        description: 'Trao đổi nhu cầu.',
        activityTime: '2026-09-03T02:00:00.000Z',
      } as CreateActivityDto;

      await expect(
        activitiesService.create(
          dto,
          salesUser,
        ),
      ).rejects.toThrow(
        new NotFoundException('Không tìm thấy Deal.',),
      );
      expect(activitiesRepository.createWithActivityLog,).not.toHaveBeenCalled();
    });

    it('từ chối subject chỉ chứa khoảng trắng', async () => {
      activitiesRepository.findDealById.mockResolvedValue(makeDeal(),);
      const dto = {
        dealId: 7,
        activityType: 'Call' as ActivityType,
        subject: '   ',
        description: 'Trao đổi nhu cầu.',
        activityTime: '2026-09-03T02:00:00.000Z',
      } as CreateActivityDto;

      await expect(
        activitiesService.create(
          dto,
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException('Nội dung hoạt động không được để trống.',),
      );

      expect(activitiesRepository.createWithActivityLog,).not.toHaveBeenCalled();
    });

    it('từ chối description chỉ chứa khoảng trắng', async () => {
      activitiesRepository.findDealById.mockResolvedValue(makeDeal(),);
      const dto = {
        dealId: 7,
        activityType: 'Email' as ActivityType,
        subject: 'Gửi báo giá',
        description: '   ',
        activityTime: '2026-09-03T02:00:00.000Z',
      } as CreateActivityDto;

      await expect(
        activitiesService.create(
          dto,
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException('Mô tả hoạt động không được để trống.',),
      );
      expect(activitiesRepository.createWithActivityLog,).not.toHaveBeenCalled();
    });
  });

  describe('create - Customer Care', () => {
    it('Customer Care tạo Activity khi có Task đang hoạt động được phân công', async () => {
      const deal = makeDeal({
        assigneduserid: 5,
        tasks: [
          {
            assigneduserid: 8,
            status: 'Pending',
          },
        ],
      });
      const createdActivity = makeActivity({
        userid: 8,
        users: {
          userid: 8,
          fullname: 'Trần Thị Care',
          email: 'care@crm.com',
        },
      });
      activitiesRepository.findDealById.mockResolvedValue(deal,);
      activitiesRepository
        .findActiveAssignedTaskForDeal
        .mockResolvedValue({taskid: 15,});
      activitiesRepository.createWithActivityLog.mockResolvedValue(createdActivity,);
      const dto = {
        dealId: 7,
        activityType: 'Call' as ActivityType,
        subject: 'Chăm sóc sau bán',
        description: 'Liên hệ hỏi tình hình sử dụng sản phẩm.',
        activityTime: '2026-09-03T03:00:00.000Z',
      } as CreateActivityDto;

      const result = await activitiesService.create(dto, customerCareUser,);
      expect(activitiesRepository.createWithActivityLog,).toHaveBeenCalled();
      expect(result.data.user.userId).toBe(8);
    });

    it.each([
      ['Completed'],
      ['Cancelled'],
    ])(
      'Customer Care không được tạo Activity khi Task ở trạng thái %s',
      async (taskStatus) => {
        activitiesRepository.findDealById.mockResolvedValue(
          makeDeal({
            tasks: [
              {
                assigneduserid: 8,
                status: taskStatus,
              },
            ],
          }),
        );

        const dto = {
          dealId: 7,
          activityType: 'Call' as ActivityType,
          subject: 'Chăm sóc khách hàng',
          description: 'Liên hệ khách hàng.',
          activityTime: '2026-09-03T03:00:00.000Z',
        } as CreateActivityDto;

        await expect(
          activitiesService.create(
            dto,
            customerCareUser,
          ),
        ).rejects.toThrow(
          new NotFoundException('Không tìm thấy Deal hoặc bạn không được phân công chăm sóc Deal này.',),
        );
        expect(activitiesRepository.createWithActivityLog,).not.toHaveBeenCalled();
      },
    );

    it('Customer Care không được chăm sóc Deal khi Task thuộc người khác', async () => {
      activitiesRepository.findDealById.mockResolvedValue(
        makeDeal({
          tasks: [
            {
              assigneduserid: 99,
              status: 'Pending',
            },
          ],
        }),
      );

      const dto = {
        dealId: 7,
        activityType: 'Call' as ActivityType,
        subject: 'Chăm sóc khách hàng',
        description: 'Liên hệ khách hàng.',
        activityTime: '2026-09-03T03:00:00.000Z',
      } as CreateActivityDto;

      await expect(
        activitiesService.create(
          dto,
          customerCareUser,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(activitiesRepository.createWithActivityLog,).not.toHaveBeenCalled();
    });
  });

  describe('updateResult', () => {
    it('cập nhật kết quả Activity và chuyển thành Completed', async () => {
      const current = makeActivity({
        status: 'Pending',
        result: null,
      });

      const completed = makeActivity({
        status: 'Completed',
        result: 'Khách hàng đồng ý nhận báo giá.',
      });

      activitiesRepository.findById.mockResolvedValue(current,);
      activitiesRepository.updateResultWithActivityLog.mockResolvedValue(completed,);
      const dto = { result: '  Khách hàng đồng ý nhận báo giá.  ', } as UpdateActivityResultDto;
      const result =
        await activitiesService.updateResult(
          11,
          dto,
          salesUser,
          '127.0.0.1',
        );
      expect(
        activitiesRepository.updateResultWithActivityLog,
      ).toHaveBeenCalledWith(
        11,
        'Khách hàng đồng ý nhận báo giá.',
        current,
        5,
        '127.0.0.1',
      );
      expect(result.message).toBe('Cập nhật kết quả chăm sóc thành công.',);
      expect(result.data.result).toBe('Khách hàng đồng ý nhận báo giá.',);
      expect(result.data.status).toBe('Completed',);
    });

    it('từ chối cập nhật kết quả Activity của người khác', async () => {
      activitiesRepository.findById.mockResolvedValue(
        makeActivity({ userid: 99, }),
      );

      await expect(
        activitiesService.updateResult(
          11,
          {
            result: 'Đã gọi khách hàng.',
          } as UpdateActivityResultDto,
          salesUser,
        ),
      ).rejects.toThrow(
        new NotFoundException('Không tìm thấy Activity hoặc bạn không có quyền cập nhật Activity này.',),
      );

      expect(activitiesRepository.updateResultWithActivityLog,).not.toHaveBeenCalled();
    });

    it('từ chối kết quả chỉ chứa khoảng trắng', async () => {
      activitiesRepository.findById.mockResolvedValue(makeActivity(),);
      await expect(
        activitiesService.updateResult(
          11,
          {
            result: '   ',
          } as UpdateActivityResultDto,
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException('Kết quả chăm sóc không được để trống.',),
      );
      expect(activitiesRepository.updateResultWithActivityLog,).not.toHaveBeenCalled();
    });

    it('từ chối cập nhật kết quả Activity đã Cancelled', async () => {
      activitiesRepository.findById.mockResolvedValue(
        makeActivity({ status: 'Cancelled', }),
      );
      await expect(
        activitiesService.updateResult(
          11,
          {
            result: 'Đã liên hệ.',
          } as UpdateActivityResultDto,
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException('Activity đã bị hủy nên không thể cập nhật kết quả.',),
      );
      expect(activitiesRepository.updateResultWithActivityLog,).not.toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('hủy Activity Pending thành công và chuyển thành Cancelled', async () => {
      const current = makeActivity({ status: 'Pending', });
      const cancelled = makeActivity({ status: 'Cancelled', });
      activitiesRepository.findById.mockResolvedValue(current,);
      activitiesRepository.cancelWithActivityLog.mockResolvedValue(cancelled,);
      const result =
        await activitiesService.cancel(
          11,
          salesUser,
          '127.0.0.1',
        );
      expect(
        activitiesRepository.cancelWithActivityLog,
      ).toHaveBeenCalledWith(
        11,
        current,
        5,
        '127.0.0.1',
      );
      expect(result.message).toBe('Hủy Activity thành công.',);
      expect(result.data.status).toBe('Cancelled',);
    });

    it('không cho hủy Activity đã Completed', async () => {
      activitiesRepository.findById.mockResolvedValue(
        makeActivity({
          status: 'Completed',
          result: 'Đã chăm sóc xong.',
        }),
      );
      await expect(
        activitiesService.cancel(
          11,
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException('Activity đã hoàn thành nên không thể hủy.',),
      );
      expect(activitiesRepository.cancelWithActivityLog,).not.toHaveBeenCalled();
    });

    it('không cho hủy lại Activity đã Cancelled', async () => {
      activitiesRepository.findById.mockResolvedValue(
        makeActivity({ status: 'Cancelled', }),
      );

      await expect(
        activitiesService.cancel(
          11,
          salesUser,
        ),
      ).rejects.toThrow(
        new UnprocessableEntityException('Activity này đã được hủy.',),
      );
      expect(activitiesRepository.cancelWithActivityLog,).not.toHaveBeenCalled();
    });
    it('không cho hủy Activity của người khác', async () => {
      activitiesRepository.findById.mockResolvedValue(
        makeActivity({ userid: 99, }),
      );
      await expect(
        activitiesService.cancel(
          11,
          salesUser,
        ),
      ).rejects.toThrow(
        new NotFoundException('Không tìm thấy Activity hoặc bạn không có quyền hủy Activity này.',),
      );
      expect(activitiesRepository.cancelWithActivityLog,).not.toHaveBeenCalled();
    });
  });
});