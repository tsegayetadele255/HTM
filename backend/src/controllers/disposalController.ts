import { Request, Response } from 'express';
import { DisposalRecord } from '../models/DisposalRecord';
import { AppDataSource } from '../utils/data-source';

export const getAllDisposalRecords = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(DisposalRecord);
  const items = await repo.find({ relations: ['equipment', 'disposedBy'] });
  res.json(items);
};

export const getOneDisposalRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(DisposalRecord);
  const { id } = req.params;
  const item = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'disposedBy'] });
  if (!item) return res.status(404).json({ error: 'Disposal record not found' });
  res.json(item);
};

export const createDisposalRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(DisposalRecord);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const userRepo = AppDataSource.getRepository('User');
  const { equipmentId, reason, method, notes, disposedById, disposalDate, status } = req.body;

  const equipment = await equipmentRepo.findOneBy({ id: equipmentId });
  if (!equipment) return res.status(400).json({ error: 'Equipment not found' });
  const disposedBy = await userRepo.findOneBy({ id: disposedById });
  if (!disposedBy) return res.status(400).json({ error: 'User not found' });

  const record = repo.create({ equipment, reason, method, notes, disposedBy, disposalDate, status });
  await repo.save(record);
  res.status(201).json(record);
};

export const updateDisposalRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(DisposalRecord);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const userRepo = AppDataSource.getRepository('User');
  const { id } = req.params;
  let record = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'disposedBy'] });
  if (!record) return res.status(404).json({ error: 'Disposal record not found' });

  const { equipmentId, disposedById, ...fields } = req.body;
  if (equipmentId !== undefined) {
    const equipment = await equipmentRepo.findOneBy({ id: equipmentId });
    if (!equipment) return res.status(400).json({ error: 'Equipment not found' });
    (record as any).equipment = equipment;
  }
  if (disposedById !== undefined) {
    const disposedBy = await userRepo.findOneBy({ id: disposedById });
    if (!disposedBy) return res.status(400).json({ error: 'User not found' });
    (record as any).disposedBy = disposedBy;
  }
  repo.merge(record, fields);
  await repo.save(record);
  res.json(record);
};

export const deleteDisposalRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(DisposalRecord);
  const { id } = req.params;
  const record = await repo.findOneBy({ id: Number(id) });
  if (!record) return res.status(404).json({ error: 'Disposal record not found' });
  await repo.remove(record);
  res.json({ message: 'Disposal record deleted successfully' });
};
