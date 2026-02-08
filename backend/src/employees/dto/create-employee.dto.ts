import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EmployeeStatus } from '../employee-status.enum';

export class CreateEmployeeDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}

