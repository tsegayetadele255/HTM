import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Equipment } from './Equipment';
import { User } from './User';

@Entity()
export class ProcurementRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  item!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ nullable: true })
  status?: 'requested' | 'approved' | 'ordered' | 'received' | 'rejected';

  @Column({ nullable: true })
  expectedDeliveryDate?: Date;

  @ManyToOne(() => Equipment, { nullable: true })
  equipment?: Equipment;

  @ManyToOne(() => User, { nullable: false })
  requestedBy!: User;

  @ManyToOne(() => User, { nullable: true })
  approvedBy?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
