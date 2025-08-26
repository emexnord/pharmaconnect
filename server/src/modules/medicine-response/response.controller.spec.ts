import { Test, TestingModule } from '@nestjs/testing';
import { ResponseController } from './medicine-response.controller';
import { ResponseService } from './medicine-response.service';

describe('ResponseController', () => {
  let controller: ResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponseController],
      providers: [ResponseService],
    }).compile();

    controller = module.get<ResponseController>(ResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
