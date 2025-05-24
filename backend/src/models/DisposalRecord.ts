import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Equipment } from './Equipment';
import { User } from './User';

@Entity()
export class DisposalRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Equipment, { nullable: false })
  equipment!: Equipment;

  @Column()
  reason!: string;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => User, { nullable: false })
  disposedBy!: User;

  @Column({ nullable: true })
  disposalDate?: Date;

  @Column({ default: 'pending' })
  status!: 'pending' | 'approved' | 'completed';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
