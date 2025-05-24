import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Equipment } from './Equipment';
import { User } from './User';

@Entity()
export class WorkOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column()
  status!: string;

  @Column()
  priority!: string;

  @ManyToOne(() => User, user => user.assignedWorkOrders, { nullable: true })
assignedTechnician!: User;  

  @Column({ nullable: true })
  repairCost!: number;

  @Column({ nullable: true })
  repairTime!: string;

  @ManyToOne(() => Equipment, equipment => equipment.workOrders)
  equipment!: Equipment;

  @ManyToOne(() => User, user => user.reportedWorkOrders, { nullable: true })
  faultReportedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  completedAt!: Date;

  @Column({ nullable: true })
  maintenanceType!: string; // corrective/preventive

  @Column({ nullable: true })
  reason!: string;

  @Column({ nullable: true })
  solution!: string;
}
