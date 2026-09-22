import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { LeadsRepository } from './repositories/leads.repository';
import { LeadsService } from './leads.service';

describe('LeadsService - convertLead', () => {
  let service: LeadsService;

  const leadsRepository = {
    findByIdForConversion: jest.fn(),
    convertToCustomer: jest.fn(),
    findDuplicate: jest.fn(),
    createWithLog: jest.fn(),
    updateWithLog: jest.fn(),
  };

  const currentUser: AuthenticatedUser = {
    userId: 3,
    fullName: 'Nguyễn Văn Sales',
    email: 'sales@crm.com',
    role: Role.SALES,
  };

  const validLead = {
    leadid: 5,
    sourceid: 1,
    assigneduserid: 3,
    fullname: 'Lê Minh Tuấn',
    company: 'Công ty Minh Phát',
    phone: '0911000003',
    email: 'tuan@minhphat.vn',
    address: 'TP.HCM',
    status: 'Qualified',
    createddate: new Date(),
    customers: null,
  };

  const createdCustomer = {
    customerid: 10,
    leadid: 5,
    fullname: 'Lê Minh Tuấn',
    company: 'Công ty Minh Phát',
    phone: '0911000003',
    email: 'tuan@minhphat.vn',
    address: 'TP.HCM',
    customertype: null,
    createddate: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new LeadsService(leadsRepository as unknown as LeadsRepository);
  });

  // BR04: Chỉ Lead đủ điều kiện mới được chuyển đổi.
  it('chuyển Lead thành Customer khi Lead đủ điều kiện', async () => {
    leadsRepository.findByIdForConversion.mockResolvedValue(validLead);

    leadsRepository.convertToCustomer.mockResolvedValue(createdCustomer);

    const result = await service.convertLead(validLead.leadid, currentUser);

    expect(leadsRepository.findByIdForConversion).toHaveBeenCalledWith(
      validLead.leadid,
    );

    // BR05: Lead hợp lệ phải được chuyển thành Customer.
    expect(leadsRepository.convertToCustomer).toHaveBeenCalledWith(
      validLead.leadid,
      currentUser.userId,
    );

    expect(result).toEqual({
      message: 'Chuyển Lead thành Customer thành công.',
      customer: {
        customerId: 10,
        leadId: 5,
        fullName: 'Lê Minh Tuấn',
        company: 'Công ty Minh Phát',
        phone: '0911000003',
        email: 'tuan@minhphat.vn',
        address: 'TP.HCM',
      },
    });
  });

  it('không cho chuyển đổi khi Lead không tồn tại', async () => {
    leadsRepository.findByIdForConversion.mockResolvedValue(null);

    await expect(service.convertLead(99999, currentUser)).rejects.toThrow(
      NotFoundException,
    );

    await expect(service.convertLead(99999, currentUser)).rejects.toThrow(
      'Không tìm thấy Lead.',
    );

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  it('không cho Sales chuyển Lead được phân công cho Sales khác', async () => {
    leadsRepository.findByIdForConversion.mockResolvedValue({
      ...validLead,
      assigneduserid: 4,
    });

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(ForbiddenException);

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow('Bạn không được phân công phụ trách Lead này.');

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  // BR04: Lead đã Converted không được chuyển đổi lại.
  it('không cho chuyển Lead đã có trạng thái Converted', async () => {
    leadsRepository.findByIdForConversion.mockResolvedValue({
      ...validLead,
      status: 'Converted',
    });

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(ConflictException);

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow('Lead này đã được chuyển thành Customer.');

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  // BR04: Lead đã liên kết Customer không được chuyển đổi lại.
  it('không cho chuyển Lead đã có Customer', async () => {
    leadsRepository.findByIdForConversion.mockResolvedValue({
      ...validLead,
      customers: createdCustomer,
    });

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(ConflictException);

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  // BR04: Lead phải ở trạng thái Qualified.
  it('không cho chuyển Lead có trạng thái New', async () => {
    leadsRepository.findByIdForConversion.mockResolvedValue({
      ...validLead,
      status: 'New',
    });

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(UnprocessableEntityException);

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow('Lead chưa đủ điều kiện để chuyển thành Customer.');

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  // BR04: Lead phải ở trạng thái Qualified.
  it('không cho chuyển Lead có trạng thái Contacted', async () => {
    leadsRepository.findByIdForConversion.mockResolvedValue({
      ...validLead,
      status: 'Contacted',
    });

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(UnprocessableEntityException);

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  // BR04: Lead phải có họ tên hợp lệ.
  it('không cho chuyển Lead khi họ tên chỉ chứa khoảng trắng', async () => {
    leadsRepository.findByIdForConversion.mockResolvedValue({
      ...validLead,
      fullname: '   ',
    });

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(UnprocessableEntityException);

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow('Lead chưa có họ tên hợp lệ.');

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  // BR04: Lead phải có đầy đủ số điện thoại hoặc email.
  it('không cho chuyển Lead khi thiếu cả số điện thoại và email', async () => {
    leadsRepository.findByIdForConversion.mockResolvedValue({
      ...validLead,
      phone: null,
      email: null,
    });

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(UnprocessableEntityException);

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(
      'Lead phải có đầy đủ số điện thoại và email trước khi chuyển đổi.',
    );

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  // BR04: Lead thiếu email thì không đủ điền kiện chuyển đổi.
  it('không cho phép chuyển Lead khi có phone nhưng thiếu email', async () => {
    const leadWithPhoneOnly = {
      ...validLead,
      phone: '0911000003',
      email: null,
    };

    leadsRepository.findByIdForConversion.mockResolvedValue(leadWithPhoneOnly);

    leadsRepository.convertToCustomer.mockResolvedValue({
      ...createdCustomer,
      email: null,
    });

    leadsRepository.findByIdForConversion.mockResolvedValue(leadWithPhoneOnly);

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(UnprocessableEntityException);

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(
      'Lead phải có đầy đủ số điện thoại và email trước khi chuyển đổi.',
    );

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  // BR04: Lead thiếu số điện thoại thì không đủ điều kiện chuyển đổi.
  it('không cho phép chuyển Lead khi có email nhưng thiếu phone', async () => {
    const leadWithEmailOnly = {
      ...validLead,
      phone: null,
      email: 'tuan@minhphat.vn',
    };

    leadsRepository.findByIdForConversion.mockResolvedValue(leadWithEmailOnly);

    leadsRepository.convertToCustomer.mockResolvedValue({
      ...createdCustomer,
      phone: null,
    });

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(UnprocessableEntityException);

    await expect(
      service.convertLead(validLead.leadid, currentUser),
    ).rejects.toThrow(
      'Lead phải có đầy đủ số điện thoại và email trước khi chuyển đổi.',
    );

    expect(leadsRepository.convertToCustomer).not.toHaveBeenCalled();
  });

  // BR03: Email của Lead mới không được trùng với Lead hiện có.
  it('không cho tạo Lead khi email đã tồn tại', async () => {
    leadsRepository.findDuplicate.mockResolvedValue({
      email: 'duplicate@crm.local',
      phone: '0900000000',
    });

    await expect(
      service.create(
        {
          fullName: 'Lead trùng email',
          email: 'DUPLICATE@CRM.LOCAL',
          phone: '0911111111',
        },
        currentUser.userId,
      ),
    ).rejects.toThrow(ConflictException);

    await expect(
      service.create(
        {
          fullName: 'Lead trùng email',
          email: 'DUPLICATE@CRM.LOCAL',
          phone: '0911111111',
        },
        currentUser.userId,
      ),
    ).rejects.toThrow('Email của Lead đã tồn tại');

    expect(leadsRepository.findDuplicate).toHaveBeenCalledWith(
      'duplicate@crm.local',
      '0911111111',
    );
    expect(leadsRepository.createWithLog).not.toHaveBeenCalled();
  });

  // BR03: Số điện thoại của Lead mới không được trùng với Lead hiện có.
  it('không cho tạo Lead khi số điện thoại đã tồn tại', async () => {
    leadsRepository.findDuplicate.mockResolvedValue({
      email: null,
      phone: '0901234567',
    });

    await expect(
      service.create(
        {
          fullName: 'Lead trùng số điện thoại',
          phone: '0901234567',
        },
        currentUser.userId,
      ),
    ).rejects.toThrow(ConflictException);

    await expect(
      service.create(
        {
          fullName: 'Lead trùng số điện thoại',
          phone: '0901234567',
        },
        currentUser.userId,
      ),
    ).rejects.toThrow('Số điện thoại của Lead đã tồn tại');

    expect(leadsRepository.findDuplicate).toHaveBeenCalledWith(
      undefined,
      '0901234567',
    );
    expect(leadsRepository.createWithLog).not.toHaveBeenCalled();
  });

  it('BR03 - gộp Lead trùng khi người dùng xác nhận mergeDuplicate', async () => {
    const duplicateLead = {
      leadid: 20,
      sourceid: 1,
      assigneduserid: 3,
      fullname: 'Lead cũ',
      company: null,
      phone: null,
      email: 'duplicate@crm.local',
      address: 'TP.HCM',
      status: 'Qualified',
      createddate: new Date('2026-09-01T00:00:00.000Z'),
    };

    const mergedLead = {
      ...duplicateLead,
      fullname: 'Lead cập nhật',
      company: 'Công ty mới',
      leadsources: null,
      users: null,
      customers: null,
    };

    leadsRepository.findDuplicate.mockResolvedValue(duplicateLead);
    leadsRepository.updateWithLog.mockResolvedValue(mergedLead);

    const result = await service.create(
      {
        fullName: 'Lead cập nhật',
        company: 'Công ty mới',
        email: 'DUPLICATE@CRM.LOCAL',
        phone: '0901234567',
        mergeDuplicate: true,
      },
      currentUser.userId,
    );

    expect(leadsRepository.updateWithLog).toHaveBeenCalledWith(
      20,
      expect.objectContaining({
        fullname: 'Lead cũ',
        company: 'Công ty mới',
        phone: '0901234567',
        email: 'duplicate@crm.local',
        status: 'Qualified',
      }),
      currentUser.userId,
    );

    expect(leadsRepository.createWithLog).not.toHaveBeenCalled();
    expect(result.leadId).toBe(20);
  });
});

describe('LeadsService - findOne', () => {
  let service: LeadsService;

  const leadsRepository = {
    findById: jest.fn(),
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

  const lead = {
    leadid: 5,
    sourceid: 1,
    assigneduserid: 3,
    fullname: 'Nguyễn Văn Lead',
    company: 'Công ty ABC',
    phone: '0909000001',
    email: 'lead@example.com',
    address: 'TP.HCM',
    status: 'New',
    createddate: new Date('2026-09-15T00:00:00.000Z'),
    leadsources: {
      sourceid: 1,
      sourcename: 'Website',
    },
    users: {
      userid: 3,
      fullname: 'Sales A',
      email: 'sales.a@crm.local',
    },
    customers: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LeadsService(leadsRepository as unknown as LeadsRepository);
  });

  it('cho phép Sales xem Lead được phân công cho chính mình', async () => {
    leadsRepository.findById.mockResolvedValue(lead);

    const result = await service.findOne(lead.leadid, salesUser);

    expect(leadsRepository.findById).toHaveBeenCalledWith(lead.leadid);
    expect(result.leadId).toBe(lead.leadid);
    expect(result.assignedUser?.userId).toBe(salesUser.userId);
  });

  it('không cho Sales xem Lead được phân công cho Sales khác', async () => {
    leadsRepository.findById.mockResolvedValue({
      ...lead,
      assigneduserid: 4,
      users: {
        userid: 4,
        fullname: 'Sales B',
        email: 'sales.b@crm.local',
      },
    });

    await expect(service.findOne(lead.leadid, salesUser)).rejects.toThrow(
      NotFoundException,
    );

    await expect(service.findOne(lead.leadid, salesUser)).rejects.toThrow(
      'Lead không tồn tại',
    );
  });

  it('cho phép Marketing xem chi tiết Lead', async () => {
    leadsRepository.findById.mockResolvedValue({
      ...lead,
      assigneduserid: 4,
      users: {
        userid: 4,
        fullname: 'Sales B',
        email: 'sales.b@crm.local',
      },
    });

    const result = await service.findOne(lead.leadid, marketingUser);

    expect(result.leadId).toBe(lead.leadid);
  });
});
