import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeeStatus } from './employee-status.enum';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: EmployeeStatus.Working,
  })
  status: EmployeeStatus;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  avatarUrl?: string;
}

