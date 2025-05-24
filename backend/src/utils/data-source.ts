import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Equipment } from '../models/Equipment';
import { WorkOrder } from '../models/WorkOrder';
import { SparePart } from '../models/SparePart';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // Set to false in production!
  logging: false,
  entities: [Equipment, WorkOrder, SparePart, User, require('../models/Incident').Incident, require('../models/SOP').SOP, require('../models/TrainingRecord').TrainingRecord, require('../models/CalibrationRecord').CalibrationRecord, require('../models/AuditLog').AuditLog, require('../models/DisposalRecord').DisposalRecord, require('../models/ProcurementRecord').ProcurementRecord],
  migrations: [],
  subscribers: [],
});
