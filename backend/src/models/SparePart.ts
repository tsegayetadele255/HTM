import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Equipment } from './Equipment';

@Entity()
export class SparePart {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  stockLevel!: number;

  @Column({ nullable: true })
  expiryDate!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  equipmentType!: string;

  @Column({ nullable: true })
  partNumber!: string;

  @Column({ nullable: true })
  manufacturer!: string;

  @Column({ nullable: true })
  minStockLevel!: number;

  @Column({ nullable: true })
  maxStockLevel!: number;

  @ManyToOne(() => Equipment, equipment => equipment.spareParts, { nullable: true })
  linkedEquipment!: Equipment;

}
