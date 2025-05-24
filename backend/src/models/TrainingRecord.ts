import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class TrainingRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  topic!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  date!: Date;

  @ManyToOne(() => User, { nullable: false })
  trainee!: User;

  @ManyToOne(() => User, { nullable: false })
  trainer!: User;

  @Column({ nullable: true })
  certificateUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
