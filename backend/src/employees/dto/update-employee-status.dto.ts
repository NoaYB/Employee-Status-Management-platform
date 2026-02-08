import { IsEnum } from 'class-validator';
import { EmployeeStatus } from '../employee-status.enum';

export class UpdateEmployeeStatusDto {
  @IsEnum(EmployeeStatus)
  status: EmployeeStatus;
}

