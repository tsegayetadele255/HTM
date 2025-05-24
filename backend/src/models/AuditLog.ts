import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  action!: string;

  @Column({ nullable: true })
  entityType?: string;

  @Column({ nullable: true })
  entityId?: number;

  @Column('text', { nullable: true })
  details?: string;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @CreateDateColumn()
  timestamp!: Date;
}
