import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  findAll(): Promise<Employee[]> {
    // אין createdAt ב-entity, אז נסדר לפי id
    return this.employeesRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);
    return employee;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepository.create(dto);
    return this.employeesRepository.save(employee);
  }

  async updateStatus(id: number, dto: UpdateEmployeeStatusDto): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.status = dto.status;
    return this.employeesRepository.save(employee);
  }

  async updateAvatar(id: number, avatarUrl: string): Promise<Employee> {
    const employee = await this.findOne(id);

    // מחיקת תמונה קודמת אם קיימת
    if (employee.avatarUrl) {
      const oldFilename = employee.avatarUrl.replace('/uploads/', '');
      const oldPath = join(process.cwd(), 'uploads', oldFilename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    employee.avatarUrl = avatarUrl;
    return this.employeesRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);

    if (employee.avatarUrl) {
      const filename = employee.avatarUrl.replace('/uploads/', '');
      const filePath = join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await this.employeesRepository.remove(employee);
  }
}
