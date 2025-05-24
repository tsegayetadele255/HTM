import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WorkOrder } from './WorkOrder';
import { SparePart } from './SparePart';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  manufacturer!: string;

  @Column()
  model!: string;

  @Column()
  serial!: string;

  @Column()
  location!: string;

  @Column()
  department!: string;

  @Column()
  status!: string;

  @Column()
  risk!: string;

  @Column({ nullable: true })
  serviceLocation!: string;

  @Column({ nullable: true })
  operator!: string;

  @Column({ nullable: true })
  condition!: string;

  @Column({ nullable: true })
  lifespan  !: string;

  @Column({ nullable: true })
  power!: string;

  @Column({ nullable: true })
  purchaseDate!: Date;

  @Column({ nullable: true })
  warrantyExpiry!: Date;

  @Column({ nullable: true })
  maintenanceInterval!: string;

  @Column({ nullable: true })
  lastMaintenanceDate!: Date;

  @Column({ nullable: true, type: 'text' })
  notes!: string;

  @OneToMany(() => WorkOrder, workOrder => workOrder.equipment)
  workOrders!: WorkOrder[];

  @OneToMany(() => SparePart, sparePart => sparePart.linkedEquipment)
  spareParts!: SparePart[];
}
