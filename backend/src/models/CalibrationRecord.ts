import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Equipment } from './Equipment';
import { User } from './User';

@Entity()
export class CalibrationRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Equipment, { nullable: false })
  equipment!: Equipment;

  @Column()
  calibrationDate!: Date;

  @Column()
  dueDate!: Date;

  @ManyToOne(() => User, { nullable: false })
  performedBy!: User;

  @Column({ nullable: true })
  certificateUrl?: string;

  @Column({ default: 'pending' })
  status!: 'pending' | 'passed' | 'failed';

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
