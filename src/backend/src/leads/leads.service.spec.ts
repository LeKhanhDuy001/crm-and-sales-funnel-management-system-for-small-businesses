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
});
