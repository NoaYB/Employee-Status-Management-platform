import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeeStatus } from './employee-status.enum';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: EmployeesService;

  const mockEmployeesService = {
    findAll: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
    updateAvatar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const employees = [
        {
          id: 1,
          name: 'John Doe',
          status: EmployeeStatus.Working,
        },
      ];

      mockEmployeesService.findAll.mockResolvedValue(employees);

      const result = await controller.findAll();

      expect(result).toEqual(employees);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createDto: CreateEmployeeDto = {
        name: 'New Employee',
        status: EmployeeStatus.Working,
      };

      const createdEmployee = {
        id: 1,
        ...createDto,
      };

      mockEmployeesService.create.mockResolvedValue(createdEmployee);

      const result = await controller.create(createDto);

      expect(result).toEqual(createdEmployee);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateStatus', () => {
    it('should update employee status', async () => {
      const updateDto: UpdateEmployeeStatusDto = {
        status: EmployeeStatus.OnVacation,
      };

      const updatedEmployee = {
        id: 1,
        name: 'John Doe',
        status: EmployeeStatus.OnVacation,
      };

      mockEmployeesService.updateStatus.mockResolvedValue(updatedEmployee);

      const result = await controller.updateStatus(1, updateDto);

      expect(result).toEqual(updatedEmployee);
      expect(service.updateStatus).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete an employee', async () => {
      mockEmployeesService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
