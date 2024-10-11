import { CustomerService } from '@core/services/customer.service';
import { ValidationException } from '@lib/exceptions/validation.exception';
import { Validator } from '@lib/helpers/validator.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';

describe('Customer', () => {
  let controller: OrderController;
  let mockResponse: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: Validator,
          useValue: {
            init: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);

    mockResponse = {
      item: jest.fn(),
    };
  });

  describe('Create Order', () => {
    it('should throw ValidationException if validation fails due to missing customer phone', async () => {
      const mockBody = {
        restaurant_id: '01J0KF8EZ4KAJCNVEPA3EFBX5H',
        table_id: '01J0KGVECY4SVZZJQ3XY2367F5',
        customer_name: 'Shely',
        customer_phone: null, // Invalid phone
        products: [], // Invalid products
      };

      const validatorMock = {
        fails: jest.fn().mockReturnValue(true),
        errors: {
          customer_phone: 'Customer phone is required',
        },
      };

      jest.spyOn(Validator, 'init').mockReturnValue(validatorMock as any);

      await expect(controller.createOrder(mockResponse, mockBody)).rejects.toThrow(ValidationException);
      expect(validatorMock.errors.customer_phone).toBe('Customer phone is required');
    });
  });
});
