import { PipelineStagesController } from './pipeline-stages.controller';
import { PipelineStagesService } from './pipeline-stages.service';

describe('PipelineStagesController', () => {
  let controller: PipelineStagesController;

  const pipelineStagesService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new PipelineStagesController(
      pipelineStagesService as unknown as PipelineStagesService,
    );
  });

  it('BR-05 - lấy danh sách Pipeline Stage', () => {
    controller.findAll();

    expect(pipelineStagesService.findAll).toHaveBeenCalledTimes(1);
  });

  it('BR-05 - tạo Pipeline Stage', () => {
    const dto = {
      stageName: 'Negotiation',
      stageOrder: 3,
      probability: 70,
    };

    controller.create(dto);

    expect(pipelineStagesService.create).toHaveBeenCalledWith(dto);
  });

  it('BR-05 - cập nhật Pipeline Stage theo ID', () => {
    const dto = {
      stageName: 'Negotiation Updated',
      probability: 75,
    };

    controller.update(3, dto);

    expect(pipelineStagesService.update).toHaveBeenCalledWith(3, dto);
  });

  it('BR-05 - xóa Pipeline Stage theo ID', async () => {
    pipelineStagesService.remove.mockResolvedValue(undefined);

    await controller.remove(3);

    expect(pipelineStagesService.remove).toHaveBeenCalledWith(3);
  });
});