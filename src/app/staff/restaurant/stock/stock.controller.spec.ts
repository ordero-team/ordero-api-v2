import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { StaffUser } from '@db/entities/staff/user.entity';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';

describe('Staff Restaurant', () => {
  let controller: StockController;
  let mockRestaurant: Restaurant;
  let mockResponse: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        {
          provide: Validator,
          useValue: {
            init: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StockController>(StockController);

    mockRestaurant = {
      id: '',
    } as Restaurant;

    mockResponse = {
      item: jest.fn(),
    };
  });

  describe('Update Stock', () => {
    it('should throw ValidationException if validation fails', async () => {
      const mockBody = { onhand: -1 }; // Invalid value
      const mockParam = { stock_id: 1 };
      const mockMe = { logName: 'testUser' } as StaffUser;

      jest.spyOn(Validator, 'init').mockReturnValue({
        fails: () => true,
      } as any);

      await expect(controller.update(mockRestaurant, mockBody, mockResponse, mockParam, mockMe)).rejects.toThrow(
        ValidationException
      );
    });
  });
});
