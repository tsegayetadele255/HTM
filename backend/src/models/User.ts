import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { WorkOrder } from './WorkOrder';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @Column({ nullable: true })
  fullName!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  department!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => WorkOrder, workOrder => workOrder.assignedTechnician)
  assignedWorkOrders!: WorkOrder[];

  @OneToMany(() => WorkOrder, workOrder => workOrder.faultReportedBy)
  reportedWorkOrders!: WorkOrder[];
}
