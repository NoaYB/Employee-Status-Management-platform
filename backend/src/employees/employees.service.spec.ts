import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';
import { EmployeeStatus } from './employee-status.enum';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repository: Repository<Employee>;

  const mockRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    repository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const employees: Employee[] = [
        {
          id: 1,
          name: 'John Doe',
          status: EmployeeStatus.Working,
        },
        {
          id: 2,
          name: 'Jane Smith',
          status: EmployeeStatus.OnVacation,
        },
      ];

      mockRepository.find.mockResolvedValue(employees);

      const result = await service.findAll();

      expect(result).toEqual(employees);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new employee', async () => {
      const createDto: CreateEmployeeDto = {
        name: 'New Employee',
        status: EmployeeStatus.Working,
      };

      const savedEmployee: Employee = {
        id: 1,
        ...createDto,
      } as Employee;

      mockRepository.create.mockReturnValue(savedEmployee);
      mockRepository.save.mockResolvedValue(savedEmployee);

      const result = await service.create(createDto);

      expect(result).toEqual(savedEmployee);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(savedEmployee);
    });
  });

  describe('updateStatus', () => {
    it('should update employee status', async () => {
      const employee: Employee = {
        id: 1,
        name: 'John Doe',
        status: EmployeeStatus.Working,
      };

      const updateDto: UpdateEmployeeStatusDto = {
        status: EmployeeStatus.OnVacation,
      };

      const updatedEmployee = {
        ...employee,
        status: EmployeeStatus.OnVacation,
      };

      mockRepository.findOne.mockResolvedValue(employee);
      mockRepository.save.mockResolvedValue(updatedEmployee);

      const result = await service.updateStatus(1, updateDto);

      expect(result.status).toBe(EmployeeStatus.OnVacation);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if employee not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus(999, { status: EmployeeStatus.Working }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an employee', async () => {
      const employee = { id: 1, name: 'Test', status: EmployeeStatus.Working } as Employee;
      mockRepository.findOne.mockResolvedValue(employee);
      mockRepository.remove.mockResolvedValue(employee);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(employee);
    });

    it('should throw NotFoundException if employee not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAvatar', () => {
    it('should update employee avatar URL', async () => {
      const employee: Employee = {
        id: 1,
        name: 'John Doe',
        status: EmployeeStatus.Working,
      };

      const avatarUrl = '/uploads/avatar-123.jpg';

      mockRepository.findOne.mockResolvedValue(employee);
      mockRepository.save.mockResolvedValue({
        ...employee,
        avatarUrl,
      });

      const result = await service.updateAvatar(1, avatarUrl);

      expect(result.avatarUrl).toBe(avatarUrl);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if employee not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateAvatar(999, '/uploads/avatar.jpg'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
