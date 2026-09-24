import {
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PipelineStagesService } from './pipeline-stages.service';
import { PipelineStagesRepository } from './repositories/pipeline-stages.repository';

describe('PipelineStagesService', () => {
  let service: PipelineStagesService;

  const repository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findByOrder: jest.fn(),
    countDeals: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    syncDealsProbability: jest.fn(),
    delete: jest.fn(),
  };

  const stage = {
    stageid: 2,
    stagename: 'Negotiation',
    stageorder: 2,
    probability: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new PipelineStagesService(
      repository as unknown as PipelineStagesRepository,
    );
  });

  it('trả danh sách Pipeline Stage', async () => {
    repository.findAll.mockResolvedValue([stage]);

    const result = await service.findAll();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual([
      {
        stageId: 2,
        stageName: 'Negotiation',
        stageOrder: 2,
        probability: 50,
      },
    ]);
  });

  it('tạo Pipeline Stage hợp lệ', async () => {
    repository.findByName.mockResolvedValue(null);
    repository.findByOrder.mockResolvedValue(null);
    repository.create.mockResolvedValue(stage);

    const result = await service.create({
      stageName: '  Negotiation  ',
      stageOrder: 2,
      probability: 50,
    });

    expect(repository.findByName).toHaveBeenCalledWith(
      'Negotiation',
      undefined,
    );
    expect(repository.findByOrder).toHaveBeenCalledWith(2, undefined);
    expect(repository.create).toHaveBeenCalledWith({
      stagename: 'Negotiation',
      stageorder: 2,
      probability: 50,
    });
    expect(result.message).toBe('Tạo giai đoạn Pipeline thành công.');
  });

  it('không cho tạo Stage trùng tên', async () => {
    repository.findByName.mockResolvedValue(stage);

    await expect(
      service.create({
        stageName: 'Negotiation',
        stageOrder: 3,
        probability: 60,
      }),
    ).rejects.toThrow(ConflictException);

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('không cho tạo Stage trùng thứ tự', async () => {
    repository.findByName.mockResolvedValue(null);
    repository.findByOrder.mockResolvedValue(stage);

    await expect(
      service.create({
        stageName: 'Proposal',
        stageOrder: 2,
        probability: 60,
      }),
    ).rejects.toThrow(ConflictException);

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('không cho tạo mới Stage hệ thống Won hoặc Lost', async () => {
    await expect(
      service.create({
        stageName: 'Won',
        stageOrder: 5,
        probability: 100,
      }),
    ).rejects.toThrow(UnprocessableEntityException);

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('không cập nhật khi body rỗng', async () => {
    await expect(service.update(2, {})).rejects.toThrow(BadRequestException);

    expect(repository.findById).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('đồng bộ Deal khi Probability của Stage thay đổi', async () => {
    repository.findById.mockResolvedValue(stage);
    repository.update.mockResolvedValue({
      ...stage,
      probability: 70,
    });

    const result = await service.update(2, {
      probability: 70,
    });

    expect(repository.update).toHaveBeenCalledWith(2, {
      probability: 70,
    });

    expect(repository.syncDealsProbability).toHaveBeenCalledWith(2, 70);

    expect(result.data.probability).toBe(70);
  });

  it('không đồng bộ Deal khi Probability không thay đổi', async () => {
    repository.findById.mockResolvedValue(stage);
    repository.update.mockResolvedValue(stage);

    await service.update(2, {
      probability: 50,
    });

    expect(repository.syncDealsProbability).not.toHaveBeenCalled();
  });

  it('không cho đổi tên Stage hệ thống Won', async () => {
    repository.findById.mockResolvedValue({
      stageid: 5,
      stagename: 'Won',
      stageorder: 5,
      probability: 100,
    });

    await expect(
      service.update(5, {
        stageName: 'Completed',
      }),
    ).rejects.toThrow(UnprocessableEntityException);

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('không cho xóa Stage đang được Deal sử dụng', async () => {
    repository.findById.mockResolvedValue(stage);
    repository.countDeals.mockResolvedValue(3);

    await expect(service.remove(stage.stageid)).rejects.toThrow(
      UnprocessableEntityException,
    );

    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('xóa Stage chưa được Deal sử dụng', async () => {
    repository.findById.mockResolvedValue(stage);
    repository.countDeals.mockResolvedValue(0);
    repository.delete.mockResolvedValue(stage);

    const result = await service.remove(stage.stageid);

    expect(repository.delete).toHaveBeenCalledWith(stage.stageid);
    expect(result).toEqual({
      message: 'Xóa giai đoạn Pipeline thành công.',
    });
  });

  it('không cho xóa Stage hệ thống Lost', async () => {
    repository.findById.mockResolvedValue({
      stageid: 6,
      stagename: 'Lost',
      stageorder: 6,
      probability: 0,
    });

    await expect(service.remove(6)).rejects.toThrow(
      UnprocessableEntityException,
    );

    expect(repository.countDeals).not.toHaveBeenCalled();
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
