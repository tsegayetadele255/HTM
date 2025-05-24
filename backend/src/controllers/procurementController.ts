import { Request, Response } from 'express';
import { ProcurementRecord } from '../models/ProcurementRecord';
import { AppDataSource } from '../utils/data-source';

export const getAllProcurementRecords = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(ProcurementRecord);
  const items = await repo.find({ relations: ['equipment', 'requestedBy', 'approvedBy'] });
  res.json(items);
};

export const getOneProcurementRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(ProcurementRecord);
  const { id } = req.params;
  const item = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'requestedBy', 'approvedBy'] });
  if (!item) return res.status(404).json({ error: 'Procurement record not found' });
  res.json(item);
};

export const createProcurementRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(ProcurementRecord);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const userRepo = AppDataSource.getRepository('User');
  const { item, amount, description, supplier, status, expectedDeliveryDate, equipmentId, requestedById, approvedById } = req.body;

  let equipment = undefined;
  if (equipmentId) {
    equipment = await equipmentRepo.findOneBy({ id: equipmentId });
    if (!equipment) return res.status(400).json({ error: 'Equipment not found' });
  }
  const requestedBy = await userRepo.findOneBy({ id: requestedById });
  if (!requestedBy) return res.status(400).json({ error: 'Requested by user not found' });
  let approvedBy = undefined;
  if (approvedById) {
    approvedBy = await userRepo.findOneBy({ id: approvedById });
    if (!approvedBy) return res.status(400).json({ error: 'Approved by user not found' });
  }

  const record = repo.create({ item, amount, description, supplier, status, expectedDeliveryDate, equipment, requestedBy, approvedBy });
  await repo.save(record);
  res.status(201).json(record);
};

export const updateProcurementRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(ProcurementRecord);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const userRepo = AppDataSource.getRepository('User');
  const { id } = req.params;
  let record = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'requestedBy', 'approvedBy'] });
  if (!record) return res.status(404).json({ error: 'Procurement record not found' });

  const { equipmentId, requestedById, approvedById, ...fields } = req.body;
  if (equipmentId !== undefined) {
    let equipment = undefined;
    if (equipmentId) {
      equipment = await equipmentRepo.findOneBy({ id: equipmentId });
      if (!equipment) return res.status(400).json({ error: 'Equipment not found' });
    }
    (record as any).equipment = equipment;
  }
  if (requestedById !== undefined) {
    const requestedBy = await userRepo.findOneBy({ id: requestedById });
    if (!requestedBy) return res.status(400).json({ error: 'Requested by user not found' });
    (record as any).requestedBy = requestedBy;
  }
  if (approvedById !== undefined) {
    let approvedBy = undefined;
    if (approvedById) {
      approvedBy = await userRepo.findOneBy({ id: approvedById });
      if (!approvedBy) return res.status(400).json({ error: 'Approved by user not found' });
    }
    (record as any).approvedBy = approvedBy;
  }
  repo.merge(record, fields);
  await repo.save(record);
  res.json(record);
};

export const deleteProcurementRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(ProcurementRecord);
  const { id } = req.params;
  const record = await repo.findOneBy({ id: Number(id) });
  if (!record) return res.status(404).json({ error: 'Procurement record not found' });
  await repo.remove(record);
  res.json({ message: 'Procurement record deleted successfully' });
};
