import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Equipment } from './Equipment';
import { User } from './User';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';

@Entity()
export class Incident {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high', 'critical'], default: 'low' })
  severity!: IncidentSeverity;

  @Column({ type: 'enum', enum: ['open', 'investigating', 'resolved', 'closed'], default: 'open' })
  status!: IncidentStatus;

  @Column({ nullable: true })
  actionsTaken!: string;

  @ManyToOne(() => Equipment, { nullable: false })
  relatedEquipment!: Equipment;

  @ManyToOne(() => User, { nullable: false })
  reportedBy!: User;

  @CreateDateColumn()
  reportedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
