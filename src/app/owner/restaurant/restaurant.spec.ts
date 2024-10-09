import { AwsService } from '@core/services/aws.service';
import { Restaurant } from '@db/entities/owner/restaurant.entity';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';

describe('Owner Restaurant', () => {
  let controller: RestaurantController;
  let mockRestaurant: Partial<Restaurant>;
  let mockResponse: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: Validator,
          useValue: {
            init: jest.fn(),
          },
        },
        {
          provide: AwsService, // Mock the AwsService
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);

    mockRestaurant = {
      save: jest.fn(),
    };

    mockResponse = {
      item: jest.fn(),
    };
  });

  describe('Update Data', () => {
    it('should throw ValidationException if validation fails', async () => {
      const updateBody = {
        name: null, // Set Restaurant Name to null
        phone: '+1234567890',
        email: 'new@example.com',
        website: 'https://newwebsite.com',
        description: 'New description',
      };

      jest.spyOn(Validator, 'init').mockReturnValue({
        fails: () => true,
      } as any);

      await expect(controller.update(mockRestaurant as Restaurant, updateBody, mockResponse)).rejects.toThrow(
        ValidationException
      );
    });
  });
});
